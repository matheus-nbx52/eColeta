import * as express from "express";

// Define quais são as roles válidas no sistema inteiro
export type UserRole = 'morador' | 'ecoletor' | 'cooperativa' | 'admin';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                tipo: UserRole;
                email: string;
            }
        }
    }
}