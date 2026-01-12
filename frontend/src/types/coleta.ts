export interface ColetaResponse {
  id_coleta: number;
  status_coleta: string;
  data_agendada: string;
  observacoes?: string;
  morador?: {
    id_morador: number;
    nome: string;
    endereco?: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
    };
  };
  ecoletor?: {
    id_ecoletor: number;
    nome: string;
  };
  cooperativa?: {
    id_cooperativa: number;
    nome: string;
  };
  itens?: Array<{
    id_item_coleta: number;
    quantidade_estimada: number;
    residuo: {
      id_residuo: number;
      nome: string;
    };
  }>;
  peso_kg?: number;
  pontos_gerados?: number;
}
