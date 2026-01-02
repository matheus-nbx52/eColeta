import { IEnderecoDTO } from './IEnderecoDTO';

export interface ICreateMoradorDTO {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone?: string;
  endereco: IEnderecoDTO;
}
