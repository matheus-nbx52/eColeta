export interface IItemColetaDTO {
    fk_residuo: number;
    quantidade: number;
}

export interface ICreateColetaDTO {
    data_agendada: string | Date;
    observacoes?: string;
    itens: IItemColetaDTO[];
    id_morador: number;
}