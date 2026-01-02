import { Request, Response } from "express";
import { ResiduoService } from "../services/ResiduoService";

export class ResiduoController {
    private residuoService = new ResiduoService();

    public async index(req: Request, res: Response): Promise<Response> {
        try {
            const lista = await this.residuoService.findAll();
            return res.status(200).json(lista);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar lista de resíduos." });
        }
    }
           
}