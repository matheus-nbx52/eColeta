import { api } from './api';
import type { ColetaResponse } from '../types/coleta';

export const coletasService = {
  async criarColeta(dados: {
    data_agendada: string;
    observacoes?: string;
    itens: Array<{ fk_residuo: number; quantidade: number }>;
  }) {
    const response = await api.post('/coleta', dados);
    return response.data;
  },

  async obterColetasDisponiveis(): Promise<ColetaResponse[]> {
    const response = await api.get('/coleta/disponiveis');
    return response.data;
  },

  async aceitarColeta(idColeta: number, idCooperativa: number) {
    const response = await api.post(`/coleta/${idColeta}/aceitar`, {
      id_cooperativa: idCooperativa
    });
    return response.data;
  },

  async iniciarEntrega(idColeta: number) {
    const response = await api.patch(`/coleta/${idColeta}/iniciar-entrega`);
    return response.data;
  },

  async entregarNaCooperativa(idColeta: number) {
    const response = await api.patch(`/coleta/${idColeta}/entregar`);
    return response.data;
  },

  async validarColeta(idColeta: number, pesoKg: number) {
    const response = await api.patch(`/coleta/${idColeta}/validar`, {
      peso_kg: pesoKg
    });
    return response.data;
  },

  async listarPorMorador(): Promise<ColetaResponse[]> {
    const response = await api.get('/coleta/minhas');
    return response.data;
  },

  async listarParaColetor(): Promise<ColetaResponse[]> {
    const response = await api.get('/coleta/coletor/dashboard');
    return response.data;
  },

  async listarFinalizadasColetor(): Promise<ColetaResponse[]> {
    const response = await api.get('/coleta/coletor/historico');
    return response.data;
  },

  async listarParaCooperativa(): Promise<ColetaResponse[]> {
    const response = await api.get('/coleta/coop/dashboard');
    return response.data;
  },

  async listarHistoricoCooperativa(): Promise<ColetaResponse[]> {
    const response = await api.get('/coleta/coop/historico');
    return response.data;
  },

  async cancelarColeta(idColeta: number) {
    const response = await api.patch(`/coleta/${idColeta}/cancelar`);
    return response.data;
  }
};

// Re-export para garantir compatibilidade
export type { ColetaResponse } from '../types/coleta';
