export interface IUpdateMoradorDTO {
    nome?: string;
    email?: string;
    senha?: string;
    telefone?: string;
    endereco?: {
        cep?: string;
        rua?: string;
        numero?: string;
        complemento?: string | null;
        bairro?: string;
        cidade?: string;
        estado?: string;
    };
}