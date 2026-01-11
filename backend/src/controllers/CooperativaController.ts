import { Request, Response } from "express";
import { CooperativaService } from "../services/CooperativaService";
import { ICooperativaDTO } from "../DTOs/CooperativaDTO";

export class CooperativaController {
    private cooperativaService = new CooperativaService();

    public async getProfile(req: Request, res: Response): Promise<Response> {
        const userId = (req as any).user.id;

        try {
            const cooperativa = await this.cooperativaService.findById(userId);

            if (!cooperativa) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }

            const { senha, ...dadosSemSenha } = cooperativa;

            const respostaSegura: ICooperativaDTO = dadosSemSenha;

            return res.status(200).json({ cooperativa: respostaSegura });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno ao buscar perfil.' });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<Response> {
        const userId = (req as any).user.id;

        const { nome, telefone, endereco } = req.body;

        try {
            const updatedCooperativa = await this.cooperativaService.update(userId, {
                nome,
                telefone,
                endereco
            });

            if (updatedCooperativa) {
                const { senha, ...dadosSemSenha } = updatedCooperativa;

                const respostaSegura: ICooperativaDTO = dadosSemSenha;

                return res.status(200).json({
                    message: 'Perfil atualizado com sucesso.',
                    cooperativa: respostaSegura
                });
            }

            return res.status(404).json({ message: 'Erro ao retornar dados atualizados.' });

        } catch (error: any) {
            console.error(error);
            if (error.message === "Cooperativa não encontrada.") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro ao atualizar perfil.' });
        }
    }
    public async deleteProfile(req: Request, res: Response): Promise<Response> {
        const userId = (req as any).user.id;

        try {
            await this.cooperativaService.delete(userId);
            return res.status(200).json({ message: 'Conta deletada com sucesso.' });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao deletar conta.' });
        }
    }

    public async listarTodas(req: Request, res: Response): Promise<Response> {
        try {
            const cooperativas = await this.cooperativaService.listarTodas();
            return res.status(200).json(cooperativas);
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao listar cooperativas.' });
        }
    }
}