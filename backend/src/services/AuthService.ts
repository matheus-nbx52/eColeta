import { AppDataSource } from "../config/database";
import { MoradorModel } from "../models/MoradorModel";

export class AuthService {

    async loginMorador(email: string, senha: string) {
        const moradorRepository = AppDataSource.getRepository(MoradorModel);
        const user = await moradorRepository.findOne({ where: { email }});

        if (!user) {
            throw new Error("Credenciais inválidas.");
        }

        const senhaValida = senha === user.senha; // Implementar verificação de hash aqui

        if (!senhaValida) {
            throw new Error("Credenciais inválidas.");
        }

        // Gerar token JWT aqui (não implementado)
        const token = "token-fake-service";

        return {
            token,
            user: {
                id: user.id_morador,
                nome: user.nome,
                email: user.email,
                tipo: "morador"
            }
        };
    }
}