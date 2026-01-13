import { AppDataSource } from "../config/database";
import { ColetaModel, StatusColeta } from "../models/ColetaModel";
import { ICreateColetaDTO } from "../DTOs/IColetaDTO";
import { ItemColetaModel } from "../models/ItemColetaModel";
import { ResiduoModel } from "../models/ResiduoModel";
import { MoradorModel } from "../models/MoradorModel";
import { EcoletorModel } from "../models/EcoletorModel";
import { CooperativaModel } from "../models/CooperativaModel";

export class ColetaService {
    private coletaRepository = AppDataSource.getRepository(ColetaModel);
    private itemColetaRepository = AppDataSource.getRepository(ItemColetaModel);
    private residuoRepository = AppDataSource.getRepository(ResiduoModel);
    private moradorRepository = AppDataSource.getRepository(MoradorModel);
    private ecoletorRepository = AppDataSource.getRepository(EcoletorModel);
    private cooperativaRepository = AppDataSource.getRepository(CooperativaModel);

    async create(dados: ICreateColetaDTO) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const morador = await this.moradorRepository.findOne({
                where: { id_morador: dados.id_morador }
            });

            if (!morador) {
                throw new Error("Morador não encontrado");
            }

            // 1. Criar coleta
            const coleta = this.coletaRepository.create({
                morador,
                data_agendada: dados.data_agendada,
                observacoes: dados.observacoes,
                status_coleta: StatusColeta.PENDENTE,
                data_solicitacao: new Date()
            });

            const coletaSalva = await queryRunner.manager.save(ColetaModel, coleta);

            // 2. Adicionar itens
            for (const item of dados.itens) {
                const residuo = await this.residuoRepository.findOne({
                    where: { id_residuo: item.fk_residuo }  // ← MUDOU AQUI
                });

                if (!residuo) {
                    throw new Error(`Resíduo ${item.fk_residuo} não encontrado`);
                }

                const itemColeta = this.itemColetaRepository.create({
                    coleta: coletaSalva,
                    residuo,
                    quantidade_estimada: item.quantidade
                });

                await queryRunner.manager.save(ItemColetaModel, itemColeta);
            }

            await queryRunner.commitTransaction();
            return coletaSalva;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }


    // Evita race condition com LOCK FOR UPDATE
    async aceitarColeta(id_coleta: number, id_coletor: number, id_cooperativa: number) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Lock pessimista: bloqueia a linha enquanto a transação roda
            const coleta = await queryRunner.manager
                .createQueryBuilder(ColetaModel, 'coleta')
                .setLock('pessimistic_write')
                .where('coleta.id_coleta = :id', { id: id_coleta })
                .getOne();

            if (!coleta) {
                throw new Error("Coleta não encontrada");
            }

            if (coleta.status_coleta !== StatusColeta.PENDENTE) {
                throw new Error(`Coleta já foi ${coleta.status_coleta} por outro coletor`);
            }

            // Verificar se coletor existe
            const coletor = await this.ecoletorRepository.findOne({
                where: { id_ecoletor: id_coletor }
            });

            if (!coletor) {
                throw new Error("Coletor não encontrado");
            }

            // Verificar se cooperativa existe
            const cooperativa = await this.cooperativaRepository.findOne({
                where: { id_cooperativa: id_cooperativa }
            });

            if (!cooperativa) {
                throw new Error("Cooperativa não encontrada");
            }

            // Atualizar coleta
            coleta.status_coleta = StatusColeta.ACEITA;
            coleta.ecoletor = coletor;
            coleta.cooperativa = cooperativa;

            const coletaAtualizada = await queryRunner.manager.save(ColetaModel, coleta);

            await queryRunner.commitTransaction();

            console.log(`[EVENTO] Coleta ${id_coleta} aceita. Cooperativa ${id_cooperativa} foi notificada`);

            return coletaAtualizada;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // Morador cancela coleta
    async cancelarColeta(id_coleta: number, id_morador: number) {
        const coleta = await this.coletaRepository.findOne({
            where: { 
                id_coleta, 
                morador: { id_morador } 
            }
        });

        if (!coleta) {
            throw new Error("Coleta não encontrada ou morador não autorizado");
        }

        // Só pode cancelar se estiver pendente
        if (coleta.status_coleta !== StatusColeta.PENDENTE) {
            throw new Error("Apenas coletas pendentes podem ser canceladas");
        }

        coleta.status_coleta = StatusColeta.CANCELADA;
        return await this.coletaRepository.save(coleta);
    }

    // Coletor recusa uma coleta disponível (apenas remove da lista dele, não altera status)
    async recusarColeta(id_coleta: number, id_coletor: number) {
        // Verificar se a coleta existe e está pendente
        const coleta = await this.coletaRepository.findOne({
            where: { id_coleta, status_coleta: StatusColeta.PENDENTE }
        });

        if (!coleta) {
            throw new Error("Coleta não encontrada ou não está disponível");
        }

        // A recusa não altera o status da coleta, apenas remove da lista do coletor
        // Isso é mais uma ação de "não mostrar para este coletor"
        // Por enquanto, apenas retornamos sucesso
        return { message: "Coleta recusada com sucesso" };
    }

    // Cooperativa cancela uma coleta que foi entregue a ela
    async cancelarColetaCooperativa(id_coleta: number, id_cooperativa: number) {
        const coleta = await this.coletaRepository.findOne({
            where: { 
                id_coleta, 
                cooperativa: { id_cooperativa }
            },
            relations: ['morador', 'ecoletor']
        });

        if (!coleta) {
            throw new Error("Coleta não encontrada ou cooperativa não autorizada");
        }

        // Só pode cancelar se estiver entregue ou aceita (ainda não validada)
        if (coleta.status_coleta !== StatusColeta.ENTREGUE && 
            coleta.status_coleta !== StatusColeta.ACEITA && 
            coleta.status_coleta !== StatusColeta.EM_CAMINHO) {
            throw new Error("Apenas coletas entregues ou em andamento podem ser canceladas pela cooperativa");
        }

        coleta.status_coleta = StatusColeta.CANCELADA;
        return await this.coletaRepository.save(coleta);
    }

    // Coletor cancela uma coleta que ele aceitou (em andamento)
    async cancelarColetaColetor(id_coleta: number, id_coletor: number) {
        const coleta = await this.coletaRepository.findOne({
            where: { 
                id_coleta, 
                ecoletor: { id_ecoletor: id_coletor }
            },
            relations: ['morador', 'cooperativa']
        });

        if (!coleta) {
            throw new Error("Coleta não encontrada ou coletor não autorizado");
        }

        // Só pode cancelar se estiver aceita ou em caminho (ainda não entregue)
        if (coleta.status_coleta !== StatusColeta.ACEITA && 
            coleta.status_coleta !== StatusColeta.EM_CAMINHO) {
            throw new Error("Apenas coletas aceitas ou em caminho podem ser canceladas pelo coletor");
        }

        coleta.status_coleta = StatusColeta.CANCELADA;
        // Limpar referências do coletor e cooperativa
        coleta.ecoletor = null;
        coleta.cooperativa = null;
        return await this.coletaRepository.save(coleta);
    }

    // Coletor saiu com a coleta
    async iniciarEntrega(id_coleta: number, id_coletor: number) {
        const coleta = await this.coletaRepository.findOne({
            where: { id_coleta, ecoletor: { id_ecoletor: id_coletor } }
        });

        if (!coleta) {
            throw new Error("Coleta não encontrada ou coletor não autorizado");
        }

        if (coleta.status_coleta !== StatusColeta.ACEITA) {
            throw new Error("Coleta deve estar aceita para iniciar entrega");
        }

        coleta.status_coleta = StatusColeta.EM_CAMINHO;
        return await this.coletaRepository.save(coleta);
    }

    // Coletor entregou na cooperativa
    async entregarNaCooperativa(id_coleta: number, id_coletor: number) {
        const coleta = await this.coletaRepository.findOne({
            where: { id_coleta, ecoletor: { id_ecoletor: id_coletor } },
            relations: ['cooperativa']
        });

        if (!coleta) {
            throw new Error("Coleta não encontrada ou coletor não autorizado");
        }

        // Permite entregar se estiver aceita ou em caminho
        if (coleta.status_coleta !== StatusColeta.EM_CAMINHO && coleta.status_coleta !== StatusColeta.ACEITA) {
            throw new Error("Coleta deve estar aceita ou em caminho para ser entregue");
        }

        coleta.status_coleta = StatusColeta.ENTREGUE;
        coleta.entregue_em = new Date();

        return await this.coletaRepository.save(coleta);
    }

    // Cooperativa valida peso e gera pontos
    async validarEFinalizar(id_coleta: number, id_cooperativa: number, peso_kg: number) {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const coleta = await queryRunner.manager.findOne(ColetaModel, {
                where: { 
                    id_coleta,
                    cooperativa: { id_cooperativa }
                },
                relations: ['morador', 'itens']
            });

            if (!coleta) {
                throw new Error("Coleta não encontrada nesta cooperativa");
            }

            if (coleta.status_coleta !== StatusColeta.ENTREGUE) {
                throw new Error("Coleta deve estar entregue");
            }

            // Calcular pontos (1kg = 10 pontos)
            const pontosGerados = Math.floor(peso_kg * 10);

            coleta.peso_kg = peso_kg;
            coleta.pontos_gerados = pontosGerados;
            coleta.status_coleta = StatusColeta.VALIDADA;
            coleta.validada_em = new Date();

            const coletaFinalizada = await queryRunner.manager.save(ColetaModel, coleta);

            // Adicionar pontos ao morador
            const morador = coleta.morador;
            morador.saldo = (morador.saldo || 0) + pontosGerados;
            await queryRunner.manager.save(MoradorModel, morador);

            await queryRunner.commitTransaction();

            return {
                message: "Coleta validada e finalizada",
                coleta: coletaFinalizada,
                pontos_gerados: pontosGerados
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // Listar coletas pendentes (para coletores)
    async listarDisponiveis() {
        return await this.coletaRepository.find({
            where: { 
                status_coleta: StatusColeta.PENDENTE
            },
            relations: ['morador', 'morador.endereco', 'itens', 'itens.residuo'],
            order: { criada_em: 'DESC' }
        });
    }

    // Histórico do morador
    async listarPorMorador(id_morador: number) {
        return await this.coletaRepository.find({
            where: { morador: { id_morador } },
            relations: ['morador', 'morador.endereco', 'ecoletor', 'cooperativa', 'itens', 'itens.residuo'],
            order: { criada_em: 'DESC' }
        });
    }

    // Dashboard da cooperativa (coletas aceitas, em caminho + para validar)
    async listarParaCooperativa(id_cooperativa: number) {
        return await this.coletaRepository.find({
            where: [
                { cooperativa: { id_cooperativa }, status_coleta: StatusColeta.ACEITA },
                { cooperativa: { id_cooperativa }, status_coleta: StatusColeta.EM_CAMINHO },
                { cooperativa: { id_cooperativa }, status_coleta: StatusColeta.ENTREGUE }
            ],
            relations: ['morador', 'morador.endereco', 'ecoletor', 'itens', 'itens.residuo'],
            order: { atualizada_em: 'DESC' }
        });
    }

    // Dashboard do coletor (em andamento)
    async listarParaColetor(id_coletor: number) {
        return await this.coletaRepository.find({
            where: [
                { ecoletor: { id_ecoletor: id_coletor }, status_coleta: StatusColeta.ACEITA },
                { ecoletor: { id_ecoletor: id_coletor }, status_coleta: StatusColeta.EM_CAMINHO }
            ],
            relations: ['morador', 'morador.endereco', 'cooperativa', 'itens', 'itens.residuo'],
            order: { atualizada_em: 'DESC' }
        });
    }

    // Histórico do coletor (finalizadas)
    async listarFinalizadasColetor(id_coletor: number) {
        return await this.coletaRepository.find({
            where: [
                { ecoletor: { id_ecoletor: id_coletor }, status_coleta: StatusColeta.ENTREGUE },
                { ecoletor: { id_ecoletor: id_coletor }, status_coleta: StatusColeta.VALIDADA }
            ],
            relations: ['morador', 'morador.endereco', 'cooperativa', 'itens', 'itens.residuo'],
            order: { validada_em: 'DESC', entregue_em: 'DESC' }
        });
    }

    // Histórico da cooperativa (validadas)
    async listarHistoricoCooperativa(id_cooperativa: number) {
        return await this.coletaRepository.find({
            where: [
                { cooperativa: { id_cooperativa }, status_coleta: StatusColeta.VALIDADA }
            ],
            relations: ['morador', 'morador.endereco', 'ecoletor', 'itens', 'itens.residuo'],
            order: { validada_em: 'DESC' }
        });
    }
}