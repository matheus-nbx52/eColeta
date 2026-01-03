import "./ColetasDisponiveis.css";
import { Check, X } from 'lucide-react';

function ColetasDisponiveis() {
  return (
    <div className="coletas-container">
      <h2 className="titulo-secao">Coletas disponíveis</h2>
      <div className="coleta-card">
       
        <div className="coleta-info">
          <div><strong>Material:</strong> Papel e Plástico</div>
          <div><strong>Peso est. (Kg):</strong> 5kg</div>
          <div><strong>Endereço:</strong> Rua das Flores, 123</div>
          <div><strong>Data:</strong> 20/09/2025</div>
          <div><strong>Horário:</strong> 14:00</div>
        </div>
        
        <div className="coleta-actions">
          <button className="btn-aceitar">
            <Check size={18} /> Aceitar
          </button>
          <button className="btn-recusar">
            <X size={18} /> Recusar
          </button>
        </div>
      </div>

      <div className="coleta-card">
        <div className="coleta-info">
          <div><strong>Material:</strong> Vidro</div>
          <div><strong>Peso est. (Kg):</strong> 5kg</div>
          <div><strong>Endereço:</strong> Av. Central, 456</div>
          <div><strong>Data:</strong> 22/09/2025</div>
          <div><strong>Horário:</strong> 14:00</div>
        </div>

        <div className="coleta-actions">
          <button className="btn-aceitar">
            <Check size={18} /> Aceitar
          </button>
          <button className="btn-recusar">
            <X size={18} /> Recusar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColetasDisponiveis;