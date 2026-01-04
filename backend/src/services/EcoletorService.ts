import { AppDataSource } from "../config/database";
import { EcoletorModel } from "../models/EcoletorModel";
import { CooperativaModel } from "../models/CooperativaModel";
import { ICreateEcoletorDTO } from "../DTOs/ICreateEcoletorDTO";
import bcrypt from "bcryptjs";

export class EcoletorService {
    private ecoletorRepository = AppDataSource.getRepository(EcoletorModel);
    private cooperativaRepository = AppDataSource.getRepository(CooperativaModel);

    async create(dados: ICreateEcoletorDTO) {
        const { nome, email, senha, cpf, telefone, veiculo_tipo, id_cooperativa } = dados;

        let cooperativaEncontrada: CooperativaModel | undefined = undefined;
        
        if (id_cooperativa) {
            const busca = await this.cooperativaRepository.findOneBy({ 
                id_cooperativa: id_cooperativa 
            });

        if (!busca) {
            throw new Error("Cooperativa informada não encontrada.");
        }
            cooperativaEncontrada = busca;
        }
        
        const ecoletorExists = await this.ecoletorRepository.findOne({
            where: [
                { email },
                { cpf }
            ]
        });

        if (ecoletorExists) {
            throw new Error("Já existe um Ecoletor cadastrado com esse Email ou CPF.");
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            const novoEcoletor = queryRunner.manager.create(EcoletorModel, {
                nome,
                email,
                cpf,
                senha: senhaHash,
                veiculo_tipo,
                telefone,
                cooperativa: cooperativaEncontrada,
                disponivel: false,
                saldo_ecoletor: 0
            });

            const ecoletorSalvo = await queryRunner.manager.save(EcoletorModel, novoEcoletor);
            await queryRunner.commitTransaction();

            // limpeza de segurança da senha da coop (se houver vinculo)
            if (ecoletorSalvo.cooperativa) {
            delete (ecoletorSalvo.cooperativa as any).senha;
            }

            return ecoletorSalvo;

            } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}