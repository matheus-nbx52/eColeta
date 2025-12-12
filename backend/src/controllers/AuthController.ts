import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { MoradorModel } from "../models/MoradorModel";
import { EnderecoModel } from "../models/EnderecoModel";

export class AuthController {

    public async registerMorador(req: Request, res: Response): Promise<Response> {
        const { nome, email, senha, cpf, telefone, endereco } = req.body;

        if (!email || !senha || !cpf || !endereco) {
            return res.status(400).json({ message: "Campos obrigatórios faltando." });
        }

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            const moradorExists = await queryRunner.manager.findOne(MoradorModel, { where: { email }});
            if (moradorExists) {
                return res.status(409).json({ message: "Email já cadastrado." });
            }

            const hashedSenha = senha; // Implementar hash de senha aqui

            // Criar e salvar o endereço primeiro
            // Pois o MoradorModel depende do EnderecoModel
            const novoEndereco = queryRunner.manager.create(EnderecoModel, {
                ...endereco,
                complemento: endereco.complemento || null,
            });
            const enderecoSalvo = await queryRunner.manager.save(novoEndereco);

            // Agora criar e salvar o morador com o endereço salvo
            const novoMorador = queryRunner.manager.create(MoradorModel, {
                nome,
                email,
                cpf,
                telefone,
                senha: hashedSenha,
                endereco: enderecoSalvo
            });
            const moradorSalvo = await queryRunner.manager.save(MoradorModel, novoMorador);

            await queryRunner.commitTransaction();

            return res.status(201).json({ message: "Morador cadastrado com sucesso.",
                 morador: moradorSalvo, nome: novoMorador.nome, email: novoMorador.email 
            });


        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Erro no cadastro:', error);
            return res.status(500).json({ message: 'Erro interno ao cadastrar morador.'});
        } finally {
            await queryRunner.release();
        }
    }

    
    // Método de login do morador
    // Verifica email e senha, retorna token JWT (a ser implementado)
    public async login(req: Request, res: Response): Promise<Response> {
        const { email, senha } = req.body;

        const moradorRepository = AppDataSource.getRepository(MoradorModel);

        const user = await moradorRepository.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Credenciais inválidas.' });
        }

        const senhaValida = senha === user.senha; // Implementar verificação de hash aqui

        if (!senhaValida) {
            return res.status(404).json({ message: 'Credenciais inválidas.' });
        }
        
        // Gerar token JWT aqui (não implementado)
        const token = "token-fake";

        return res.status(200).json({
            sucess: true,
            token: token,
            morador: {
                id: user.id_morador,
                nome: user.nome,
                email: user.email,
                tipo: "morador"
            }
        });
    }

}