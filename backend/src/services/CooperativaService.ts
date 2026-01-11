import { AppDataSource } from "../config/database";
import { CooperativaModel } from "../models/CooperativaModel";
import { EnderecoModel } from "../models/EnderecoModel";
import { ICreateCooperativaDTO, IUpdateCooperativaDTO } from "../DTOs/CooperativaDTO";
import bcrypt from "bcryptjs";

export class CooperativaService {
    private cooperativaRepository = AppDataSource.getRepository(CooperativaModel);
    private enderecoRepository = AppDataSource.getRepository(EnderecoModel);

    async create(dados: ICreateCooperativaDTO) {
        const { nome, email, senha, cnpj, telefone, endereco } = dados;

        const coopExists = await this.cooperativaRepository.findOne({
            where: [
                { email },
                { cnpj }
            ]
        });

        if (coopExists) {
            throw new Error("Já existe uma cooperativa cadastrada com esse Email ou CNPJ.");
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            const novoEndereco = queryRunner.manager.create(EnderecoModel, {
                ...endereco,
                complemento: endereco.complemento || undefined
            });
            const enderecoSalvo = await queryRunner.manager.save(EnderecoModel, novoEndereco);

            const novaCooperativa = queryRunner.manager.create(CooperativaModel, {
                nome,
                email,
                cnpj,
                senha: senhaHash,
                telefone: telefone,
                endereco: enderecoSalvo
            });

            const cooperativaSalva = await queryRunner.manager.save(CooperativaModel, novaCooperativa);

            await queryRunner.commitTransaction();

            return cooperativaSalva;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    async findById(id: number) {
        return await this.cooperativaRepository.findOne({
            where: { id_cooperativa: id },
            relations: ['endereco'] 
        });
    }
    
    async update(id: number, dados: IUpdateCooperativaDTO) {
        const cooperativa = await this.findById(id);

        if (!cooperativa) {
            throw new Error("Cooperativa não encontrada.");
        }

        const { endereco, ...dadosDaCooperativa } = dados;

        if (endereco) {
            await this.enderecoRepository.update(
                cooperativa.endereco.id_endereco, 
                endereco
            );
        }

        if (Object.keys(dadosDaCooperativa).length > 0) {
            await this.cooperativaRepository.update(id, dadosDaCooperativa);
        }

        return this.findById(id);
    }

    async delete(id: number) {
        const cooperativa = await this.findById(id);

        if (!cooperativa) {
            throw new Error("Cooperativa não encontrada.");
        }

        const idEndereco = cooperativa.endereco.id_endereco;

        await this.cooperativaRepository.remove(cooperativa);

        await this.enderecoRepository.delete(idEndereco);

        return true;
    }

    async listarTodas() {
        const cooperativas = await this.cooperativaRepository.find({
            relations: ['endereco']
        });
        
        return cooperativas.map(coop => ({
            id_cooperativa: coop.id_cooperativa,
            nome: coop.nome,
            endereco: coop.endereco ? `${coop.endereco.rua}, ${coop.endereco.numero} - ${coop.endereco.bairro}` : ''
        }));
    }
}