import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { MoradorService } from "../services/MoradorService";
import { ICreateMoradorDTO } from "../DTOs/ICreateMoradorDTO";
import { ICreateCooperativaDTO } from "../DTOs/ICreateCooperativaDTO";
import { ICreateEcoletorDTO } from "../DTOs/ICreateEcoletorDTO";
import { ILoginDTO } from "../DTOs/ILoginDTO";
import { CooperativaService } from "../services/CooperativaService";
import { EcoletorService } from "../services/EcoletorService";


export class AuthController {
    private authService = new AuthService();
    private moradorService = new MoradorService();
    private cooperativaService = new CooperativaService();
    private ecoletorService = new EcoletorService();

    // registro e login de morador
    public async registerMorador(req: Request, res: Response): Promise<Response> {
        const dados: ICreateMoradorDTO = req.body;
        const { email, senha, cpf, endereco } = dados;

        if (!email || !senha || !cpf || !endereco) {
            return res.status(400).json({ message: "Email, senha, CPF e endereço são obrigatórios." });
        }
        
        try {
            const novoMorador = await this.moradorService.create(dados);

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

    public async loginMorador(req: Request, res: Response): Promise<Response> {
        const dadosLogin: ILoginDTO = req.body;
        const {email, senha} = dadosLogin

        try {
            const loginResult = await this.authService.loginMorador(email, senha);
            return res.status(200).json(loginResult);
        } catch (error: any) {
            console.error("Erro ao fazer login:", error);
            return res.status(401).json({ message: error.message || "Erro ao fazer login." });
        }
    }

    // regisro e login da cooperativa
    public async registerCooperativa(req: Request, res: Response): Promise<Response> {
        const dados: ICreateCooperativaDTO = req.body;
        const { email, senha, nome, cnpj, endereco } = dados;

        if (!dados.email || !dados.senha || !dados.nome || !dados.cnpj || !dados.endereco) {
            return res.status(400).json({ 
                message: "Email, senha, nome, CNPJ e endereço são obrigatórios."
             });

        } try {
            const novaCoop = await this.cooperativaService.create(dados);
            const { senha, ...coopSemSenha } = novaCoop;

            return res.status(201).json({
                message: "Cooperativa criada com sucesso.",
                cooperativa: coopSemSenha
            });

    } catch (error: any) {
            console.error("Erro na criação da cooperativa:", error);
            if (error.message.includes("Conta já cadastrada")) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro interno ao criar cooperativa." });
        }
    }

    public async loginCooperativa(req: Request, res: Response): Promise<Response> {
        const dadosLogin: ILoginDTO = req.body;
        const {email, senha} = dadosLogin

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

    // registro e login do ecoletor
    public async registerEcoletor(req: Request, res: Response): Promise<Response> {
        const dados: ICreateEcoletorDTO = req.body;
        const { email, senha, cpf, id_cooperativa } = dados;
        
        if (!email || !senha || !cpf || !id_cooperativa) {
            return res.status(400).json({ 
                message: "Email, senha, CPF e ID da Cooperativa são obrigatórios." 
            });
        }

        try {
            const novoEcoletor = await this.ecoletorService.create(dados);
            const { senha, ...ecoletorSemSenha } = novoEcoletor;

            return res.status(201).json({
                message: "Ecoletor criado com sucesso.",
                ecoletor: ecoletorSemSenha
            });

        } catch (error: any) {
            console.error("Erro ao criar ecoletor:", error);

            if (error.message.includes("Já existe") || error.message.includes("cadastrado")) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes("Cooperativa não encontrada")) {
                return res.status(400).json({ message: error.message });
            }

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