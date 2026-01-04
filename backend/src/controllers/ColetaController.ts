import { Request, Response } from "express";
import { ColetaService } from "../services/ColetaService";
import { ICreateColetaDTO } from "../DTOs/IColetaDTO";

export class ColetaController {
    private coletaService = new ColetaService();

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            // O usuário vem do middleware de auth/roles
            const user = (req as any).user; 
            const { data_agendada, observacoes, itens } = req.body;

            // Validação básica de entrada
            if (!itens || itens.length === 0) {
                return res.status(400).json({ message: "Selecione ao menos um resíduo." });
            }

            // Monta o DTO
            const dadosColeta: ICreateColetaDTO = {
                id_morador: user.id,
                data_agendada,
                observacoes,
                itens
            };

            const novaColeta = await this.coletaService.create(dadosColeta);

            return res.status(201).json({
                message: "Solicitação criada com sucesso!",
                coleta: novaColeta
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message || "Erro interno." });
        }
    }

    public async listMine(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const coletas = await this.coletaService.listarPorMorador(user.id);
            return res.status(200).json(coletas);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar histórico." });
        }
    }

    public async listAvailable(req: Request, res: Response): Promise<Response> {
        try {
            const coletas = await this.coletaService.listarDisponiveis();
            return res.status(200).json(coletas);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar coletas disponíveis." });
        }
    }
}