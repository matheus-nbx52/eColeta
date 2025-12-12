import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { MoradorModel } from "../models/MoradorModel";
import { EnderecoModel } from "../models/EnderecoModel";

export class MoradorController {

    public async getProfile(req: Request, res: Response): Promise<Response> {

        //const userId = (req as any).user.id; // Supondo que o middleware JWT adicione o ID do usuário ao req
        const userId = 1; // Remover esta linha após implementar o middleware JWT
        try {
            const moradorRepository = AppDataSource.getRepository(MoradorModel);
            //Busca o morador e seu endereço (relation: ['endereco'])
            const morador = await moradorRepository.findOne({ 
                where: { id_morador: userId },
                relations: ['endereco']
            });

            if (!morador) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }
            return res.status(200).json({ morador });


        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar perfil.' });
        }
    }


    // Métodos updateProfile
    // atualiza os dados básicos do morador
    public async updateProfile(req: Request, res: Response): Promise<Response> {
        const userId = (req as any).user.id;
        const { nome, telefone } = req.body;

        try {
            const moradorRepository = AppDataSource.getRepository(MoradorModel);

            //TypeORM faz o UPDATE na tabela Morador
            const result = await moradorRepository.update(userId, {nome, telefone});

            if (result.affected === 1) {
                //Se atualizado, busca o registro novo para retornar
                const updatedUser = await moradorRepository.findOne({ where: { id_morador: userId }, relations: ['endereco'] });
                return res.status(200).json({ message: 'Perfil atualizado com sucesso.', morador: updatedUser });
            }
            return res.status(404).json({ message: 'Morador não encontrado para atualização.' });

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar perfil.' });
        }
    }

    // Método deleteProfile. Deleta o morador e seu endereço associado (cuidado com cascade!)
    public async deleteProfile(req: Request, res: Response): Promise<Response> {
        //const userId = (req as any).user.id;
        const userId = 4; // Remover esta linha após implementar o middleware JWT

        try {
            const moradorRepository = AppDataSource.getRepository(MoradorModel);
            const morador = await moradorRepository.findOne({ where: { id_morador: userId }, relations: ['endereco'] });

            if (!morador) {
                return res.status(404).json({ message: 'Morador não encontrado para exclusão.' });
            }

            //Armazenar o endereço antes de deletar o morador
            const enderecoId = morador.endereco.id_endereco;

            //Deletar o morador
            await moradorRepository.remove(morador);

            // Como o EnderecoModel está mapeado com cascade: true, o TypeORM
            // deveria deletar o Endereco automaticamente, mas é bom ser explícitos para garantir.
            const enderecoRepository = AppDataSource.getRepository(EnderecoModel);
            await enderecoRepository.delete(enderecoId);

            return res.status(200).json({ message: 'Morador e endereço associados deletados com sucesso.' });

        } catch (error) {
            console.error('Erro ao deletar perfil:', error);
            return res.status(500).json({ message: 'Erro interno ao deletar conta.' });
        }
    }

}
