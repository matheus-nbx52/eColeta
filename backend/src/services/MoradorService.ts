import { AppDataSource } from "../config/database";
import { MoradorModel } from "../models/MoradorModel"
import { EnderecoModel } from "../models/EnderecoModel";

export class MoradorService {
    private moradorRepository = AppDataSource.getRepository(MoradorModel);
    private enderecoRepository = AppDataSource.getRepository(EnderecoModel);

    //Logica de CRIAÇÃO
    async create(dados: any) {
        const { nome, email, senha, cpf, telefone, endereco } = dados;

        // Validação
        const moradorExists = await this.moradorRepository.findOne({ where: { email }});
        if (moradorExists) {
            throw new Error("Email já cadastrado.");
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const hashedSenha = senha; // Implementar hash de senha aqui

            // Criar e salvar o endereço primeiro
            const novoEndereco = queryRunner.manager.create(EnderecoModel, {
                ...endereco,
                complemento: endereco.complemento || null,
            });
            const enderecoSalvo = await queryRunner.manager.save(novoEndereco);

            // salva o morador com o endereço já salvo
            const novoMorador = queryRunner.manager.create(MoradorModel, {
                nome,
                email,
                cpf,
                telefone,
                senha: hashedSenha,
                endereco: enderecoSalvo
            });
            const moradorSalvo = await queryRunner.manager.save(MoradorModel, novoMorador);

            await queryRunner.commitTransaction();
            return moradorSalvo;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
    } finally {
            await queryRunner.release();
        }
    }

    async findById(id: number) {
        const morador = await this.moradorRepository.findOne({ 
            where: { id_morador: id },
            relations: ['endereco']
        });
        return morador;
    }

    async update(id: number, dadosAtualizacao: { nome?: string; telefone?: string; }) {
        const result = await this.moradorRepository.update(id, dadosAtualizacao);

        if (result.affected === 0) {
            throw new Error('Morador não encontrado para atualização.');
        }

        return this.findById(id);
    }

    async delete(id: number) {
        const morador = await this.findById(id);

        if (!morador) {
            throw new Error('Morador não encontrado para exclusão.');
        }

        const enderecoId = morador.endereco.id_endereco;

        //remover o morador (endereço será removido em cascade)
        await this.moradorRepository.remove(morador);

        //remover o endereço explicitamente para garantir
        await this.enderecoRepository.delete(enderecoId);

        return true;
    }


}