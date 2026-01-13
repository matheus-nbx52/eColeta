import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { MoradorModel } from "../models/MoradorModel";
import { EcoletorModel } from "../models/EcoletorModel";
import { CooperativaModel } from "../models/CooperativaModel";

export class AuthService {

    async verificarEmailGlobal(email: string): Promise<boolean> {
        const repoMorador = AppDataSource.getRepository(MoradorModel);
        const repoCoop = AppDataSource.getRepository(CooperativaModel);
        const repoEco = AppDataSource.getRepository(EcoletorModel);

        const [morador, coop, ecoletor] = await Promise.all([
            repoMorador.findOneBy({ email }),
            repoCoop.findOneBy({ email }),
            repoEco.findOneBy({ email })
        ]);

        return !!(morador || coop || ecoletor);
    }

    private generateToken(payload: object): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET não foi definido no .env");
        }

        return jwt.sign(payload, secret, { expiresIn: '1d' });
    }

    //Autenticação com token morador
    async loginMorador(email: string, senhaDigitada: string) {
        const repo = AppDataSource.getRepository(MoradorModel);
        const user = await repo.findOne({ 
            where: { email },
            select:  ['id_morador', 'nome', 'email', 'senha']
        });

        if (!user) {
            throw new Error("Email ou senha inválidos.");
        }

        const senhaValida = await bcrypt.compare(senhaDigitada, user.senha)

        if (!senhaValida) {
            throw new Error("Email ou senha inválidos.");
        }

        const token = this.generateToken({
            id: user.id_morador,
            tipo: 'morador',
            email: user.email
        });
        
        return { 
            token, 
            user: { 
                id_morador: user.id_morador,
                nome: user.nome,
                email: user.email,
                tipo: "morador" 
            } 
         };
    }

    //Autenticação com token cooperativa
    async loginCooperativa(email: string, senhaDigitada: string) {
        const repo = AppDataSource.getRepository(CooperativaModel);
        const user = await repo.findOne({ 
            where: { email },
            select: ['id_cooperativa', 'nome', 'email', 'senha', 'cnpj'] 
        });

        if (!user) {
            throw new Error("Email ou senha inválidos.");
        }

        const senhaValida = await bcrypt.compare(senhaDigitada, user.senha)

        if (!senhaValida) {
            throw new Error("Email ou senha inválidos.");
        }

        const token = this.generateToken({
            id: user.id_cooperativa,
            tipo: 'cooperativa'
        });

        const { senha, ...userSemSenha } = user;

        return { 
            token, 
            user: { 
                ...userSemSenha, 
                tipo: "cooperativa" 
            }
        }
    }

    // Autenticação com token ecoletor
    async loginEcoletor(email: string, senhaDigitada: string) {
        const repo = AppDataSource.getRepository(EcoletorModel);
        const user = await repo.findOne({ 
            where: { email },
            select: ['id_ecoletor', 'nome', 'email', 'senha', 'cpf', 'telefone', 'veiculo_tipo'],
            relations: ['cooperativa']
        });

        if (!user) {
            throw new Error("Email ou senha inválidos.");
        }

        const senhaValida = await bcrypt.compare(senhaDigitada, user.senha);

        if (!senhaValida) {
            throw new Error("Email ou senha inválidos.");
        }

        if (user.cooperativa) {
            delete (user.cooperativa as any).senha;
        }

        const token = this.generateToken({
            id: user.id_ecoletor,
            tipo: 'ecoletor'
        });

        const { senha, ...userSemSenha } = user;

        return { 
            token, 
            user: { 
                ...userSemSenha, 
                tipo: "ecoletor" 
            }
        };
    }
}