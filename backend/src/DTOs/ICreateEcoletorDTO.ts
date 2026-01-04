export interface ICreateEcoletorDTO {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone: string;
    veiculo_tipo: string;
    id_cooperativa?: number;
}