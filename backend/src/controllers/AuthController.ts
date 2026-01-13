import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { MoradorService } from "../services/MoradorService";
import { ICreateMoradorDTO } from "../DTOs/MoradorDTO";
import { ICreateCooperativaDTO } from "../DTOs/CooperativaDTO";
import { ICreateEcoletorDTO } from "../DTOs/EcoletorDTO";
import { ILoginDTO } from "../DTOs/ILoginDTO";
import { CooperativaService } from "../services/CooperativaService";
import { EcoletorService } from "../services/EcoletorService";

export class AuthController {
    private authService = new AuthService();
    private moradorService = new MoradorService();
    private cooperativaService = new CooperativaService();
    private ecoletorService = new EcoletorService();

    // registro de morador
    public async registerMorador(req: Request, res: Response): Promise<Response> {
        const dados: ICreateMoradorDTO = req.body;
        const { email, senha, cpf, endereco } = dados;

        if (!email || !senha || !cpf || !endereco) {
            return res.status(400).json({ message: "Email, senha, CPF e endereço são obrigatórios." });
        }

        // Validação de Senha Forte
        if (senha.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(senha)) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres, incluindo letras e números." });
        }

        try {
            // Verificação de Email Global
            const emailEmUso = await this.authService.verificarEmailGlobal(email);
            if (emailEmUso) {
                return res.status(409).json({ message: "Este e-mail já está cadastrado no sistema." });
            }

            const novoMorador = await this.moradorService.create(dados);
            const { senha: _, ...moradorSemSenha } = novoMorador;

            return res.status(201).json({
                message: "Morador criado com sucesso.",
                morador: moradorSemSenha,
            });
            
        } catch (error: any) {
            console.error("Erro ao criar morador:", error);
            return res.status(500).json({ message: "Erro interno ao criar morador." });
        }
    }

    public async loginMorador(req: Request, res: Response): Promise<Response> {
        const dadosLogin: ILoginDTO = req.body;
        const { email, senha } = dadosLogin;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        try {
            const loginResult = await this.authService.loginMorador(email, senha);
            return res.status(200).json(loginResult);
        } catch (error: any) {
            console.error("Erro ao fazer login:", error);
            return res.status(401).json({ message: error.message || "Erro ao fazer login." });
        }
    }

    // registro da cooperativa
    public async registerCooperativa(req: Request, res: Response): Promise<Response> {
        const dados: ICreateCooperativaDTO = req.body;
        const { email, senha, nome, cnpj, endereco } = dados;

        if (!email || !senha || !nome || !cnpj || !endereco) {
            return res.status(400).json({ message: "Email, senha, nome, CNPJ e endereço são obrigatórios." });
        }

        if (senha.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(senha)) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres, incluindo letras e números." });
        }

        try {
            const emailEmUso = await this.authService.verificarEmailGlobal(email);
            if (emailEmUso) {
                return res.status(409).json({ message: "Este e-mail já está cadastrado no sistema." });
            }

            const novaCoop = await this.cooperativaService.create(dados);
            const { senha: _, ...coopSemSenha } = novaCoop;

            return res.status(201).json({
                message: "Cooperativa criada com sucesso.",
                cooperativa: coopSemSenha
            });

        } catch (error: any) {
            console.error("Erro na criação da cooperativa:", error);
            return res.status(500).json({ message: "Erro interno ao criar cooperativa." });
        }
    }

    public async loginCooperativa(req: Request, res: Response): Promise<Response> {
        const dadosLogin: ILoginDTO = req.body;
        const { email, senha } = dadosLogin;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }
        try {
            const loginResult = await this.authService.loginCooperativa(email, senha);
            return res.status(200).json(loginResult);
        } catch (error: any) {
            console.error("Erro ao fazer login cooperativa", error);
            return res.status(401).json({ message: error.message || "Erro ao fazer login."})
        }
    }

    // registro do ecoletor
    public async registerEcoletor(req: Request, res: Response): Promise<Response> {
        const dados: ICreateEcoletorDTO = req.body;
        const { email, senha, cpf } = dados;
        
        if (!email || !senha || !cpf) {
            return res.status(400).json({ message: "Email, senha e CPF são obrigatórios." });
        }

        if (senha.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)/.test(senha)) {
            return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres, incluindo letras e números." });
        }

        try {
            const emailEmUso = await this.authService.verificarEmailGlobal(email);
            if (emailEmUso) {
                return res.status(409).json({ message: "Este e-mail já está cadastrado no sistema." });
            }

            const novoEcoletor = await this.ecoletorService.create(dados);
            const { senha: _, ...ecoletorSemSenha } = novoEcoletor;

            return res.status(201).json({
                message: "Ecoletor criado com sucesso.",
                ecoletor: ecoletorSemSenha
            });

        } catch (error: any) {
            console.error("Erro ao criar ecoletor:", error);
            return res.status(500).json({ message: "Erro interno ao criar ecoletor." });
        }
    }

    public async loginEcoletor(req: Request, res: Response): Promise<Response> {
        const dadosLogin: ILoginDTO = req.body;
        const { email, senha } = dadosLogin;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        try {
            const loginResult = await this.authService.loginEcoletor(email, senha);
            return res.status(200).json(loginResult);
        } catch (error: any) {
            console.error("Erro ao fazer login de ecoletor:", error);
            return res.status(401).json({ message: error.message || "Erro ao fazer login." });
        }
    }
}