import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '../@types/express'

interface TokenPayload {
    id: number;
    tipo: UserRole;
    email: string;
    iat: number;
    exp: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({message: "Token não fornecido"})
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2){
        return res.status(401).json({ message: "Formato de token invalido"});
    }
    const token = parts[1];

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(401).json({ message: "JWT_SECRET não configurado" });
        }

        const decoded = jwt.verify(token, secret);
        const { id, tipo, email } = decoded as TokenPayload;

        // Validar se o tipo é um UserRole válido
        const validRoles: UserRole[] = ['morador', 'ecoletor', 'cooperativa', 'admin'];
        if (!validRoles.includes(tipo)) {
            return res.status(401).json({ message: "Tipo de usuário inválido no token" });
        }

        // injetar o id do usuario na requisição com tipo correto
        req.user = { id, tipo, email };
        return next();
    } catch (error){
        return res.status(401).json({message: "token de autenticação invalido ou expirado"})
    }
}