import { Box } from 'lucide-react';
import './HistoricoMorador.css'; 

const HistoricoMorador = () => {
  return (
    <div className="container-historico">
      <h5 className="titulo-secao">Minhas Coletas</h5>
      
      <div className="conteudo-vazio">
        <div className="circulo-icone">
          <Box size={40} color="#09625bff" />
        </div>
        <h4>Nenhuma coleta solicitada ainda</h4>
        <p>Clique em "Solicitar Nova Coleta" para começar</p>
      </div>
    </div>
  );
};

export default HistoricoMorador;