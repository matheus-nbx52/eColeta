import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { MoradorService } from "../services/MoradorService";


export class AuthController {
    private authService = new AuthService();
    private moradorService = new MoradorService();

    public async registerMorador(req: Request, res: Response): Promise<Response> {
        const { email, senha, cpf, endereco } = req.body;

        if (!email || !senha || !cpf || !endereco) {
            return res.status(400).json({ message: "Email, senha, CPF e endereço são obrigatórios." });
        }
        
        try {
            const novoMorador = await this.moradorService.create(req.body);

            return res.status(201).json({
                message: "Morador criado com sucesso.",
                morador: novoMorador
            });
        } catch (error: any) {
            // tratamento de erro simplificado
            if (error.message === "Email já cadastrado.") {
                return res.status(409).json({ message: error.message });
            }
            console.error("Erro ao criar morador:", error);
            return res.status(500).json({ message: "Erro interno ao criar morador." });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { email, senha } = req.body;

        try {
            const loginResult = await this.authService.loginMorador(email, senha);
            return res.status(200).json(loginResult);
        } catch (error: any) {
            console.error("Erro ao fazer login:", error);
            return res.status(401).json({ message: error.message || "Erro ao fazer login." });
        }
    }
}