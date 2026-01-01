export interface IUpdateMorador {
    nome?: string;
    email?: string;
    senha?: string;
    telefone?: string;
    endereco?: {
        cep?: string;
        logradouro?: string;
        numero?: string;
        complemento?: string | null;
        bairro?: string;
        cidade?: string;
        estado?: string;
    };
}