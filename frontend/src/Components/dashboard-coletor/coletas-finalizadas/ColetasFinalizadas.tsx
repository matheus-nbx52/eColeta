import { MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import "./ColetasFinalizadas.css";

interface Coleta {
  id: string;
  material: string;
  peso: string;
  endereco: string;
  data?: string;
  horario?: string;
}

function ColetasFinalizadas({ dados }: { dados: Coleta[] }) {
  if (!dados || dados.length === 0) {
    return (
      <div className="sem-dados">
        <CheckCircle size={48} color="#cbd5e0" />
        <p>Você ainda não finalizou nenhuma coleta.</p>
      </div>
    );
  }

  return (
    <div className="lista-cards-stack">
      {dados.map((coleta) => (
        <div className="coleta-card card-finalizada-container" key={coleta.id}>
          <div className="accent-bar-green" />
          
          <div className="card-body">
            <div className="info-section">
              <div className="header-coleta">
                <span className="material-nome">{coleta.material}</span>
                <span className="badge-finalizada">CONCLUÍDA</span>
              </div>

              <div className="detalhes-horizontal">
                <div className="detalhe-item">
                  <MapPin size={20} className="icon-green" />
                  <span>{coleta.endereco}</span>
                </div>
                <div className="detalhe-item">
                  <Calendar size={20} className="icon-green" />
                  <span>{coleta.data}</span>
                </div>
                <div className="detalhe-item">
                  <Clock size={20} className="icon-green" />
                  <span>{coleta.horario}</span>
                </div>
              </div>
            </div>

            <div className="status-section-finalizada">
              <div className="check-circular">
                <CheckCircle size={32} />
              </div>
              <span>Finalizada</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ColetasFinalizadas;