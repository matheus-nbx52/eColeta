import { IEnderecoDTO } from "./IEnderecoDTO";

export interface IMoradorDTO {
    id_morador: string;
    nome: string;
    email: string;
    cpf: string;
    telefone?: string;
    saldo_pontos: number;
    endereco: IEnderecoDTO & { id_endereco: number };
}