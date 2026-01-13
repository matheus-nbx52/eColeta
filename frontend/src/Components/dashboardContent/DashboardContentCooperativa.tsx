import "./DashBoardContentCooperativa.css";
import {
  Clock, MapPin, Calendar,
  Check, Scale, X, History, User, Truck, AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { coletasService } from "../../services/coletasService";
import type { ColetaResponse } from "../../types/coleta";
import Swal from "sweetalert2";

interface ItemColetaExtendida {
  id: string;
  material: string;
  quantidade: string;
  status: string;
  data: string;
  peso: number;
  coletorNome?: string;
  coletorId?: string;
  motivoRecusa?: string;
  endereco?: string;
  horario?: string;
  moradorNome: string;
  moradorId: string;
  statusBackend?: string;
}

export default function DashBoardContentCooperativa() {
  const [abaAtiva, setAbaAtiva] = useState<'Em Andamento' | 'Histórico'>('Em Andamento');
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<{ emAndamento: ItemColetaExtendida[], historico: ItemColetaExtendida[] }>({
    emAndamento: [],
    historico: []
  });

  const [modalFinalizar, setModalFinalizar] = useState<ItemColetaExtendida | null>(null);
  const [modalRecusar, setModalRecusar] = useState<ItemColetaExtendida | null>(null);
  const [pesoFinal, setPesoFinal] = useState("");
  const [motivoRecusa, setMotivoRecusa] = useState("");

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Buscar coletas em andamento
      const coletasAndamento = await coletasService.listarParaCooperativa();

      // Buscar histórico de coletas validadas
      const coletasHistorico = await coletasService.listarHistoricoCooperativa();

      const emAndamento: ItemColetaExtendida[] = [];
      const historico: ItemColetaExtendida[] = [];

      const mapearColeta = (coleta: ColetaResponse): ItemColetaExtendida => {
        const dataAgendada = new Date(coleta.data_agendada);
        const materiais = coleta.itens?.map((item: any) => item.residuo?.nome || 'Material').join(', ') || 'Material';
        const quantidadeTotal = coleta.itens?.reduce((acc: number, item: any) => acc + (item.quantidade_estimada || 0), 0) || 0;
        const endereco = coleta.morador?.endereco 
          ? `${coleta.morador.endereco.rua}, ${coleta.morador.endereco.numero} - ${coleta.morador.endereco.bairro}`
          : 'Endereço não informado';

        // Determinar status para exibição
        let statusExibicao = 'Em Coleta';
        if (coleta.status_coleta === 'Entregue_Coop' || coleta.status_coleta === 'Concluido' || coleta.status_coleta === 'VALIDADA' || coleta.status_coleta === 'Validada') {
          statusExibicao = 'Coletado';
        }

        return {
          id: coleta.id_coleta.toString(),
          material: materiais,
          quantidade: `${quantidadeTotal} kg`,
          status: statusExibicao,
          data: dataAgendada.toLocaleDateString('pt-BR'),
          peso: coleta.peso_kg || 0,
          coletorNome: coleta.ecoletor?.nome || 'Não informado',
          coletorId: coleta.ecoletor?.id_ecoletor?.toString() || '',
          moradorNome: coleta.morador?.nome || 'Não informado',
          moradorId: coleta.morador?.id_morador?.toString() || '',
          endereco,
          horario: dataAgendada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          statusBackend: coleta.status_coleta
        };
      };

      // Mapear coletas em andamento
      coletasAndamento.forEach((coleta: ColetaResponse) => {
        emAndamento.push(mapearColeta(coleta));
      });

      // Mapear histórico
      coletasHistorico.forEach((coleta: ColetaResponse) => {
        historico.push(mapearColeta(coleta));
      });

      setDados({ emAndamento, historico });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setDados({ emAndamento: [], historico: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
    // Aumentar intervalo para 60 segundos para evitar piscar na tela
    const interval = setInterval(carregarDados, 60000);
    return () => clearInterval(interval);
  }, []);

  const processarAcao = async (status: 'Coletado' | 'Recusado') => {
    const itemAlvo = status === 'Coletado' ? modalFinalizar : modalRecusar;
    if (!itemAlvo) return;

    try {
      if (status === 'Coletado') {
        if (!pesoFinal || parseFloat(pesoFinal) <= 0) {
          Swal.fire({
            title: 'Atenção!',
            text: 'Informe um peso válido.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return;
        }

        await coletasService.validarColeta(parseInt(itemAlvo.id), parseFloat(pesoFinal));

        Swal.fire({
          title: 'Sucesso!',
          text: 'Coleta validada e pontos creditados!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          setModalFinalizar(null);
          setModalRecusar(null);
          setPesoFinal("");
          setMotivoRecusa("");
          carregarDados();
        });
      } else {
        // TODO: Implementar recusa no backend se necessário
        Swal.fire({
          title: 'Atenção!',
          text: 'Funcionalidade de recusa será implementada em breve.',
          icon: 'info',
          confirmButtonText: 'OK'
        }).then(() => {
          setModalFinalizar(null);
          setModalRecusar(null);
          setPesoFinal("");
          setMotivoRecusa("");
          carregarDados();
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.response?.data?.message || 'Erro ao processar ação.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (loading && dados.emAndamento.length === 0 && dados.historico.length === 0) {
    return (
      <div className="corpo-painel-coop" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="corpo-painel-coop">

      <div className="grade-metricas">
        <div className={`cartao-metrica azul ${abaAtiva === 'Em Andamento' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Em Andamento')}>
          <div className="icone-fundo-box"><Clock size={24} /></div>
          <div className="textos-metrica"><span>A Caminho</span><strong>{dados.emAndamento.length}</strong></div>
        </div>
        <div className={`cartao-metrica verde ${abaAtiva === 'Histórico' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Histórico')}>
          <div className="icone-fundo-box"><History size={24} /></div>
          <div className="textos-metrica"><span>Histórico</span><strong>{dados.historico.length}</strong></div>
        </div>
      </div>

      <div className="quadro-lista-coletas">
        <h3 className="titulo-secao-coop">Coletas {abaAtiva}</h3>

        <div className="lista-cards-container">
          {abaAtiva === 'Em Andamento' && (
            dados.emAndamento.length > 0 ? (
              dados.emAndamento.map(item => (
                <div key={item.id} className="card-coleta-item border-azul">
                  <div className="card-info-detalhada">
                    <div className="topo-card">
                      <h4>{item.material} <span className="badge-quantidade">{item.quantidade}</span></h4>
                      <span className={`badge-status ${
                        item.statusBackend === 'Aceito' || item.statusBackend === 'ACEITA' ? 'laranja' : 
                        item.statusBackend === 'A Caminho' || item.statusBackend === 'EM_CAMINHO' ? 'azul' : 
                        item.statusBackend === 'Entregue_Coop' || item.statusBackend === 'ENTREGUE' || item.statusBackend === 'Entregue' ? 'verde' : 'azul'
                      }`}>
                        {item.statusBackend === 'Aceito' || item.statusBackend === 'ACEITA' ? 'ACEITA' : 
                         item.statusBackend === 'A Caminho' || item.statusBackend === 'EM_CAMINHO' ? 'COLETOR A CAMINHO' : 
                         item.statusBackend === 'Entregue_Coop' || item.statusBackend === 'ENTREGUE' || item.statusBackend === 'Entregue' ? 'AGUARDANDO VALIDAÇÃO' : 
                         'COLETOR A CAMINHO'}
                      </span>
                    </div>
                    <div className="grade-envolvidos">
                      <div className="perfil-mini"><User size={16} className="cor-morador" /><div><label>Morador</label><p>{item.moradorNome}</p></div></div>
                      <div className="perfil-mini"><Truck size={16} className="cor-coletor" /><div><label>Coletor</label><p>{item.coletorNome}</p></div></div>
                    </div>
                    <div className="detalhes-linha">
                      <span><MapPin size={14} /> {item.endereco}</span>
                      <span><Calendar size={14} /> {item.data}</span>
                    </div>
                  </div>
                  <div className="card-acoes-coop">
                    {item.statusBackend === 'Entregue_Coop' || item.statusBackend === 'ENTREGUE' || item.statusBackend === 'Entregue' ? (
                      <>
                        <button className="btn-receber" onClick={() => setModalFinalizar(item)}>Recebida <Check size={18}/></button>
                        <button className="btn-recusar-link" onClick={() => setModalRecusar(item)}>Recusar Material</button>
                      </>
                    ) : (
                      <span className="badge-status azul">Aguardando coletor...</span>
                    )}
                  </div>
                </div>
              ))
            ) : <div className="mensagem-vazia"><Truck size={40} /><p>Não há nenhuma coleta em andamento.</p></div>
          )}

          {abaAtiva === 'Histórico' && (
            dados.historico.length > 0 ? (
              dados.historico.map(item => (
                <div key={item.id} className={`card-coleta-item ${item.status === 'Recusado' ? 'border-vermelho' : 'border-verde'}`}>
                  <div className="card-info-principal">
                    <div className="titulo-material">
                      <h4>{item.material}</h4>
                      <span className={`badge-status ${item.status === 'Recusado' ? 'vermelho' : 'verde'}`}>
                        {item.status === 'Recusado' ? 'RECUSADA' : 'CONCLUÍDA'}
                      </span>
                    </div>
                    {item.status === 'Coletado' ? (
                      <p className="peso-validado"><Scale size={16} /> Peso: <strong>{item.peso} kg</strong></p>
                    ) : <div className="motivo-info"><AlertTriangle size={16} /> {item.motivoRecusa}</div>}
                    <p className="txt-sub">Morador: {item.moradorNome} | Coletor: {item.coletorNome}</p>
                  </div>
                </div>
              ))
            ) : <div className="mensagem-vazia"><History size={40} /><p>Histórico vazio.</p></div>
          )}
        </div>
      </div>

      {modalFinalizar && (
        <div className="modal-overlay">
          <div className="modal-container-recusa">
            <div className="modal-header-recusa">
              <h3>Validar Peso</h3>
              <button className="fechar-x" onClick={() => setModalFinalizar(null)}><X /></button>
            </div>
            <div className="input-peso-container">
              <Scale size={24} />
              <input
                type="number" step="0.1" value={pesoFinal} onChange={(e) => setPesoFinal(e.target.value)} placeholder="0.0 kg" autoFocus />
            </div>
            <div className="modal-footer-recusa">
              <button className="btn-receber" style={{ width: '100%' }} onClick={() => processarAcao('Coletado')}>Confirmar Recebimento</button>
            </div>
          </div>
        </div>
      )}

      {modalRecusar && (
        <div className="modal-overlay">
          <div className="modal-container-recusa">
            <div className="modal-header-recusa">
              <h3>Motivo da Recusa</h3>
              <button className="fechar-x" onClick={() => setModalRecusar(null)}><X /></button>
            </div>
            <textarea
              className="input-area-motivo"
              value={motivoRecusa}
              onChange={(e) => setMotivoRecusa(e.target.value)}
              placeholder="Descreva o motivo..."
            />
            <div className="modal-footer-recusa">
              <button className="btn-confirmar-recusa-v2" onClick={() => processarAcao('Recusado')}>Confirmar Recusa</button>
              <button className="btn-cancelar-v2" onClick={() => setModalRecusar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}