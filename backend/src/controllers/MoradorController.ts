import { Request, Response } from "express";
import { MoradorService } from "../services/MoradorService";

export class MoradorController {
    private moradorService = new MoradorService();

    public async getProfile(req: Request, res: Response): Promise<Response> {
        // const userId = Number(req.user.id); // Futuro JWT
        const userId = 1; 

        try {
            const morador = await this.moradorService.findById(userId);
            
            if (!morador) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }
            return res.status(200).json({ morador });
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno.' });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<Response> {
        // const userId = Number(req.user.id);
        const userId = 1; 
        const { nome, telefone } = req.body;

        try {
            const updatedUser = await this.moradorService.update(userId, { nome, telefone });
            return res.status(200).json({ message: 'Atualizado.', morador: updatedUser });
        } catch (error: any) {
            if (error.message === "Morador não encontrado.") {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro ao atualizar.' });
        }
    }

    public async deleteProfile(req: Request, res: Response): Promise<Response> {
        // const userId = Number(req.user.id);
        const userId = 4;

        try {
            await this.moradorService.delete(userId);
            return res.status(200).json({ message: 'Conta deletada com sucesso.' });
        } catch (error: any) {
            return res.status(500).json({ message: 'Erro ao deletar conta.' });
        }
    }
}