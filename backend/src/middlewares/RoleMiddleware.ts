import { NextFunction, Request, Response } from "express";
import { UserRole } from "../@types/express";

export function authorize(...allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
       
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Autenticação necessaria'
            });
        }

        if (!user.tipo) {
            return res.status(403).json({
                message: 'Acesso proibido: Tipo de usuário inválido.'
            });
        }

        // 2. Validação Type-Safe
        if (!allowedRoles.includes(user.tipo)) {
            return res.status(403).json({
                message: 'Você não tem permissão para acessar este recurso.'
            });
        }

        next();
    };
}

export const onlyMorador = authorize('morador');
export const onlyEcoletor = authorize('ecoletor');
export const onlyCooperativa = authorize('cooperativa');
export const onlyWorkers = authorize('ecoletor', 'cooperativa');