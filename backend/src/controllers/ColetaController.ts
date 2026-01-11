import { Request, Response } from "express";
import { ColetaService } from "../services/ColetaService";
import { ICreateColetaDTO } from "../DTOs/IColetaDTO";

export class ColetaController {
    private coletaService = new ColetaService();

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const { data_agendada, observacoes, itens } = req.body;

            if (!itens || itens.length === 0) {
                return res.status(400).json({ message: "Selecione ao menos um resíduo." });
            }

            const dadosColeta: ICreateColetaDTO = {
                id_morador: user.id,
                data_agendada,
                observacoes,
                itens
            };

            const novaColeta = await this.coletaService.create(dadosColeta);
            return res.status(201).json({ message: "Solicitação criada!", coleta: novaColeta });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async aceitar(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { id_cooperativa } = req.body;
            const user = (req as any).user;

            if (!id_cooperativa) {
                return res.status(400).json({ message: "Selecione uma cooperativa de destino." });
            }

            const coleta = await this.coletaService.aceitarColeta(Number(id), user.id, id_cooperativa);
            
            return res.status(200).json({ 
                message: "Coleta aceita com sucesso!", 
                coleta 
            });
        } catch (error: any) {
            return res.status(409).json({ message: error.message });
        }
    }

    public async iniciarEntrega(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            const coleta = await this.coletaService.iniciarEntrega(Number(id), user.id);
            return res.status(200).json({ message: "Saiu para entrega!", coleta });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    public async entregar(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            const coleta = await this.coletaService.entregarNaCooperativa(Number(id), user.id);
            return res.status(200).json({ message: "Coleta entregue!", coleta });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    public async validar(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { peso_kg } = req.body;
            const user = (req as any).user;

            const result = await this.coletaService.validarEFinalizar(Number(id), user.id, peso_kg);
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    public async minhasColetas(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const coletas = await this.coletaService.listarPorMorador(user.id);
            return res.status(200).json(coletas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async coletasDisponiveis(req: Request, res: Response): Promise<Response> {
        try {
            const coletas = await this.coletaService.listarDisponiveis();
            return res.status(200).json(coletas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async dashboardCooperativa(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const coletas = await this.coletaService.listarParaCooperativa(user.id);
            return res.status(200).json(coletas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async dashboardColetor(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const coletas = await this.coletaService.listarParaColetor(user.id);
            return res.status(200).json(coletas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async historicoColetor(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const coletas = await this.coletaService.listarFinalizadasColetor(user.id);
            return res.status(200).json(coletas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async historicoCooperativa(req: Request, res: Response): Promise<Response> {
        try {
            const user = (req as any).user;
            const coletas = await this.coletaService.listarHistoricoCooperativa(user.id);
            return res.status(200).json(coletas);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }
}