import { Calendar, Package, Clock, XCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import './HistoricoMorador.css';
import { coletasService } from '../../services/coletasService';
import type { ColetaResponse } from '../../types/coleta';
import Swal from 'sweetalert2';

interface Props {
  filtroStatus?: 'Pendente' | 'Em Coleta' | 'Coletado';
  onColetasChange?: () => void;
  refreshTrigger?: number;
}

const HistoricoMorador = ({ filtroStatus, onColetasChange, refreshTrigger }: Props) => {
  const [todasColetas, setTodasColetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const coletas = await coletasService.listarPorMorador();

      const coletasMapeadas = coletas
        .filter((coleta: ColetaResponse) => coleta.status_coleta !== 'Cancelado' && coleta.status_coleta !== 'CANCELADA')
        .map((coleta: ColetaResponse) => {
          const dataAgendada = new Date(coleta.data_agendada);
          const materiais = coleta.itens?.map((item: any) => item.residuo?.nome || 'Material').join(', ') || 'Material';
          const quantidadeTotal = coleta.itens?.reduce((acc: number, item: any) => acc + (item.quantidade_estimada || 0), 0) || 0;

          // Mapear status do backend para o formato do frontend
          let status: 'Pendente' | 'Em Coleta' | 'Coletado' = 'Pendente';
          if (coleta.status_coleta === 'Pendente') {
            status = 'Pendente';
          } else if (coleta.status_coleta === 'Aceito' || coleta.status_coleta === 'A Caminho' || coleta.status_coleta === 'EM_CAMINHO') {
            status = 'Em Coleta';
          } else if (coleta.status_coleta === 'Entregue_Coop' || coleta.status_coleta === 'Concluido' || coleta.status_coleta === 'VALIDADA' || coleta.status_coleta === 'Validada') {
            status = 'Coletado';
          }

          return {
            id: coleta.id_coleta.toString(),
            material: materiais,
            quantidade: `${quantidadeTotal}kg`,
            status,
            data: dataAgendada.toLocaleDateString('pt-BR'),
            horario: dataAgendada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status_coleta: coleta.status_coleta,
            peso_kg: coleta.peso_kg,
            pontos_gerados: coleta.pontos_gerados
          };
        });

      // Armazenar todas as coletas (sem filtro)
      setTodasColetas(coletasMapeadas.reverse());
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      setTodasColetas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar localmente baseado no filtroStatus (sem recarregar da API)
  const historico = filtroStatus 
    ? todasColetas.filter(c => c.status === filtroStatus)
    : todasColetas;

  const handleCancelar = async (id: string) => {
    const result = await Swal.fire({
      title: 'Cancelar Coleta',
      text: 'Deseja realmente cancelar este agendamento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Não'
    });

    if (!result.isConfirmed) return;

    try {
      await coletasService.cancelarColeta(parseInt(id));

      Swal.fire({
        title: 'Cancelada!',
        text: 'A coleta foi cancelada com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        carregarDados();
        if (onColetasChange) {
          onColetasChange();
        }
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.response?.data?.message || 'Não foi possível cancelar a coleta.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Carregar dados na montagem e quando refreshTrigger mudar
  useEffect(() => {
    carregarDados();
  }, [refreshTrigger]);

  const handleInfo = (e: React.MouseEvent, status: string) => {
    e.stopPropagation();

    if (status === 'Pendente') {
      Swal.fire({
        title: 'Status: Pendente',
        text: 'Sua solicitação foi recebida! Estamos aguardando que um coletor aceite realizar a sua coleta.',
        icon: 'info',
        
      });
    } else if (status === 'Em Coleta') {
      Swal.fire({
        title: 'Status: Em Coleta',
        text: 'Um coletor já aceitou sua solicitação! Ele está organizando a rota para buscar seus materiais.',
        icon: 'success',

      });
    } else if (status === 'Coletado') {
      Swal.fire({
        title: 'Status: Coletado',
        text: 'Essa coleta já foi finalizada e os materiais foram entregues.',
        icon: 'success',
        
      });
    }
  };

  if (loading) {
    return (
      <div className="historico-wrapper" id="secao-historico">
        <p>Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="historico-wrapper" id="secao-historico">
      <h2 className={`titulo-secao ${filtroStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
        {filtroStatus}
      </h2>
      {loading && historico.length === 0 ? (
        <div className="sem-dados">
          <p>Carregando histórico...</p>
        </div>
      ) : historico.length > 0 ? (
        <div className="lista-cards animar-entrada">
          {historico.map((coleta) => (
            <div className="coleta-card" key={coleta.id}>
              <div className={`accent-bar ${coleta.status.toLowerCase().replace(/\s+/g, '-')}`} />

              <div className="card-body">
                <div className="info-section">
                  <div className="header-coleta">
                    <span className="material-nome">{coleta.material}</span>
                    <span className="peso-tag">{coleta.quantidade}</span>
                  </div>

                  <div className="detalhes-horizontal">
                    <div className="detalhe-item">
                      <Calendar size={18} className="icon-blue" />
                      <span>{coleta.data}</span>
                    </div>

                    <div className="detalhe-item">
                      <Clock size={18} className="icon-orange" />
                      <span>{coleta.horario}</span>
                    </div>

                    <div
                      className={`status-badge-inline ${coleta.status.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={(e) => handleInfo(e, coleta.status)}
                      style={{ cursor: 'pointer' }}
                    >
                      {coleta.status}
                      <Info size={14} className="info-icon-status" />
                    </div>
                  </div>
                </div>

                <div className="actions-section">
                  {coleta.status === 'Pendente' && (
                    <button
                      className="btn-cancelar-estilizado"
                      onClick={() => handleCancelar(coleta.id)}
                    >
                      <XCircle size={18} />
                      Cancelar agendamento
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sem-dados">
          <Package size={48} color="#cbd5e0" />
          <p>Nenhuma coleta {filtroStatus?.toLowerCase()} encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default HistoricoMorador;