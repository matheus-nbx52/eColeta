export interface IEnderecoDTO {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string | null;
    bairro: string;
    cidade?: string;
    estado?: string;
}