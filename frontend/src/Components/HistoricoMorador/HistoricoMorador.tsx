import { Box, Calendar, Package, Tag } from 'lucide-react';
import { useState } from 'react';
import './HistoricoMorador.css';

interface Coleta {
  id: string;
  material: string;
  quantidade: string;
  status: 'Pendente' | 'Em Coleta' | 'Coletado';
  data: string;
}

interface Usuario {
  id: string;
  historico: Coleta[];
}

const HistoricoMorador = () => {

  const [historico] = useState<Coleta[]>(() => {
    const idLogado = localStorage.getItem('usuarioLogadoId');
    const usuariosRaw = localStorage.getItem('usuarios');

    if (idLogado && usuariosRaw) {
      const usuarios: Usuario[] = JSON.parse(usuariosRaw);
      const usuarioAtual = usuarios.find(u => u.id === idLogado);
      return usuarioAtual?.historico || [];
    }
    return [];
  });

  return (
    <div className="container-historico">
      <h5 className="titulo-secao">Minhas Coletas</h5>
      
      {historico.length > 0 ? (
        <div className="tabela-responsiva">
          <table className="tabela-historico">
            <thead>
              <tr>
                <th><Calendar size={16} /> Data</th>
                <th><Tag size={16} /> Material</th>
                <th><Package size={16} /> Quantidade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((item) => (
                <tr key={item.id}>
                  <td>{item.data}</td>
                  <td>{item.material}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    <span className={`badge-status ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (

        <div className="conteudo-vazio">
          <div className="circulo-icone">
            <Box size={40} color="#0c9f6e" />
          </div>
          <h4>Nenhuma coleta solicitada ainda</h4>
          <p>Clique em "Solicitar Nova Coleta" para começar</p>
        </div>
      )}
    </div>
  );
};

export default HistoricoMorador;