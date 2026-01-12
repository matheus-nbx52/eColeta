import React from 'react';
import { Trash2, Weight, MapPin, X } from 'lucide-react';
import './DetalheColetas.css';

interface Coleta {
  material: string;
  peso: string;
  endereco: string;
}

interface Props {
  coleta: Coleta;
  onClose: () => void;
  onFinalizar: () => void;
  onIniciar?: () => void;
  iniciada: boolean;   
  setIniciada: (valor: boolean) => void; 
}
const DetalheColetas: React.FC<Props> = ({ coleta, onClose, onFinalizar, onIniciar, iniciada, setIniciada }) => {


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-fechar" onClick={onClose}><X size={24} /></button>

        <h1 className="modal-titulo">Detalhes da Coleta</h1>

        <div className="grid-info">
          <div className="card-detalhe">
            <Trash2 size={32} color="#1a5235" />
            <p className="label">Material:</p>
            <p className="valor">{coleta.material}</p>
          </div>

          <div className="card-detalhe">
            <Weight size={32} color="#1a5235" />
            <p className="label">Peso:</p>
            <p className="valor">{coleta.peso}</p>
          </div>

          <div className="card-detalhe">
            <MapPin size={32} color="#1a5235" />
            <p className="label">Endereço:</p>
            <p className="valor">{coleta.endereco}</p>
          </div>
        </div>

        <div className="mapa-placeholder">
          <div className="mapa-header">Local da Coleta</div>
          <div className="mapa-img">

            <MapPin size={40} color="#e63946" />
          </div>
          <div className="mapa-footer">
          </div>
        </div>
        {!iniciada ? (
          <button
            className="btn-finalizar-grande"
            style={{ backgroundColor: '#2196f3' }} 
            onClick={() => {
              if (onIniciar) {
                onIniciar();
              } else {
                setIniciada(true);
              }
            }} 
          >
            INICIAR ENTREGA
          </button>
        ) : (
          <button
            className="btn-finalizar-grande"
            style={{ backgroundColor: '#6abf4b' }} 
            onClick={onFinalizar}
          >
            ENTREGAR NA COOPERATIVA
          </button>
        )}
      </div>
    </div>
  );
};
export default DetalheColetas;