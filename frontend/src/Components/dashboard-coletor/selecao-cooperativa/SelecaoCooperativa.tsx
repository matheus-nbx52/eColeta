import { X, Building2, Check, AlertCircle, Loader2 } from "lucide-react";
import "./SelecaoCooperativa.css";
import { useState, useEffect } from "react";
import { api } from "../../../services/api";

interface Cooperativa {
  id_cooperativa: number;
  nome: string;
  endereco: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cooperativaId: number) => void;
}

function SelecaoCooperativa({ isOpen, onClose, onConfirm }: Props) {
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [cooperativas, setCooperativas] = useState<Cooperativa[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (isOpen) {
      carregarCooperativas();
    }
  }, [isOpen]);

  const carregarCooperativas = async () => {
    try {
      setCarregando(true);
      const response = await api.get('/cooperativa/listar');
      setCooperativas(response.data);
    } catch (error) {
      console.error('Erro ao carregar cooperativas:', error);
      alert('Erro ao carregar cooperativas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  const handleConfirmar = () => {
    if (selecionada) {
      onConfirm(selecionada);
      setSelecionada(null);
    }
  };

  return (
    <div className="coop-overlay">
      <div className="coop-container">
        <div className="coop-header">
          <div className="coop-titulo-grupo">
            <Building2 size={24} className="coop-icon-principal" />
            <h3>Destino da Coleta</h3>
          </div>
          <button onClick={onClose} className="coop-btn-fechar"><X size={20} /></button>
        </div>

        <div className="coop-body">
          <div className="coop-alerta">
            <AlertCircle size={16} />
            <span>Selecione uma cooperativa cadastrada para continuar.</span>
          </div>
          
          {carregando ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : cooperativas.length > 0 ? (
            <div className="coop-lista">
              {cooperativas.map((coop) => (
                <div 
                  key={coop.id_cooperativa} 
                  className={`coop-item-card ${selecionada === coop.id_cooperativa ? 'selecionado' : ''}`}
                  onClick={() => setSelecionada(coop.id_cooperativa)}
                >
                  <div className="coop-info-box">
                    <div className="coop-avatar">
                      {coop.nome.charAt(0)}
                    </div>
                    <div className="coop-textos">
                      <span className="coop-nome-label">{coop.nome}</span>
                      <span className="coop-endereco-label">{coop.endereco}</span>
                    </div>
                  </div>
                  <div className={`coop-radio ${selecionada === coop.id_cooperativa ? 'marcado' : ''}`}>
                    {selecionada === coop.id_cooperativa && <Check size={14} color="white" />}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>Nenhuma cooperativa cadastrada no momento.</p>
            </div>
          )}
        </div>

        <div className="coop-footer">
          <button className="coop-btn-voltar" onClick={onClose}>Voltar</button>
          <button 
            className="coop-btn-confirmar" 
            disabled={!selecionada}
            onClick={handleConfirmar}
          >
            Confirmar Cooperativa
          </button>
        </div>
      </div>
    </div>
  );
}

export default SelecaoCooperativa;