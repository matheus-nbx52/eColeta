import { MapPin, Calendar, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import "./ColetasAndamento.css";

function ColetasAndamento({ coleta, onFinalizar, onCancelar, onVerDetalhes, status_coleta }: any) {
  const status = status_coleta || coleta.status_coleta;
  const isAceita = status === 'Aceito' || status === 'Aceita';
  const isEmCaminho = status === 'A Caminho' || status === 'Em_Caminho';

  return (
    <div className="coleta-card card-andamento-container"> 
      <div className="accent-bar-blue" />
      
      <div className="card-body">
        <div className="info-section">
          <div className="header-coleta">
            <span className="material-nome">{coleta.material}</span>
            <span className="badge-andamento">
              {isEmCaminho ? 'A CAMINHO' : 'ACEITA'}
            </span>
          </div>

          <div className="detalhes-horizontal">
            <div className="detalhe-item">
              <MapPin size={22} className="icon-blue" />
              <span>{coleta.endereco}</span>
            </div>
            <div className="detalhe-item">
              <Calendar size={22} className="icon-blue" />
              <span>{coleta.data || "08/01/2026"}</span>
            </div>
            <div className="detalhe-item">
              <Clock size={22} className="icon-blue" />
              <span>{coleta.horario || "14:00"}</span>
            </div>
          </div>
        </div>

        <div className="actions-section-vertical">
          {onVerDetalhes && (
            <button className="btn-finalizar" onClick={onVerDetalhes} style={{ backgroundColor: '#2196f3' }}>
              <Truck size={20} />
              Ver Detalhes
            </button>
          )}
          <button className="btn-finalizar" onClick={onFinalizar}>
            <CheckCircle size={20} />
            {isEmCaminho ? 'Entregar na Cooperativa' : 'Finalizar Coleta'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColetasAndamento;