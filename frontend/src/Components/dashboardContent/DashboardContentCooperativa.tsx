import "./DashBoardContentCooperativa.css";
import { Package, Scale, BarChart3, Calendar, X } from "lucide-react";
import { useState } from "react";

interface Coleta {
  id: string;
  material: string;
  quantidade: string;
  status: 'Pendente' | 'Em Coleta' | 'Coletado';
  data: string;
  peso: number;
}

interface Usuario {
  id: string;
  nome: string;
  tipo: string;
  historico?: Coleta[];
  pontos?: number;
}

export default function DashBoardContentCooperativa() {
  const [coletaSelecionada, setColetaSelecionada] = useState<{moradorId: string, coleta: Coleta} | null>(null);
  const [novoPeso, setNovoPeso] = useState("");
  const [novoStatus, setNovoStatus] = useState<Coleta['status']>('Pendente');

  const carregarDados = () => {
    const usuariosRaw = localStorage.getItem('usuarios');
    const metricas = {
      totalColetas: 0,
      materialKg: 0,
      tiposUnicos: new Set<string>(),
      esteMes: 0,
      solicitacoes: [] as { moradorId: string; moradorNome: string; coleta: Coleta }[]
    };

    if (usuariosRaw) {
      const usuarios: Usuario[] = JSON.parse(usuariosRaw);
      const mesAtual = new Date().getMonth();

      usuarios.forEach(user => {
        user.historico?.forEach(coleta => {
          if (coleta.status === 'Coletado') {
            metricas.totalColetas++;
            metricas.materialKg += coleta.peso || 0;
            metricas.tiposUnicos.add(coleta.material);
            
            const partesData = coleta.data.split('/');
            if (partesData.length > 1) {
              const mesColeta = parseInt(partesData[1]);
              if (mesColeta - 1 === mesAtual) metricas.esteMes++;
            }
          }
          if (coleta.status !== 'Coletado') {
            metricas.solicitacoes.push({ moradorId: user.id, moradorNome: user.nome, coleta });
          }
        });
      });
    }
    return metricas;
  };

  const dados = carregarDados();

  const salvarGerenciamento = () => {
    if (!coletaSelecionada) return;

    const usuariosRaw = localStorage.getItem('usuarios');
    if (usuariosRaw) {
      const usuarios: Usuario[] = JSON.parse(usuariosRaw);
      const pesoNumerico = parseFloat(novoPeso) || 0;

      const novosUsuarios = usuarios.map(user => {
        if (user.id === coletaSelecionada.moradorId) {
          const novoHistorico = user.historico?.map(c => {
            if (c.id === coletaSelecionada.coleta.id) {
              if (novoStatus === 'Coletado') {
                user.pontos = (user.pontos || 0) + (pesoNumerico * 10);
              }
              return { ...c, status: novoStatus, peso: pesoNumerico };
            }
            return c;
          });
          return { ...user, historico: novoHistorico };
        }
        return user;
      });

      localStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
      setColetaSelecionada(null);
      setNovoPeso("");
      window.location.reload();
    }
  };

  return (
    <div className="corpo-painel-coop">
      <div className="grade-metricas">
        <div className="cartao-metrica">
          <div className="icone-fundo-verde"><Package size={24} /></div>
          <div className="textos-metrica">
            <span>Total Concluído</span>
            <strong>{dados.totalColetas}</strong>
          </div>
        </div>
        <div className="cartao-metrica">
          <div className="icone-fundo-azul"><Scale size={24} /></div>
          <div className="textos-metrica">
            <span>Peso Total</span>
            <strong>{dados.materialKg.toFixed(1)} kg</strong>
          </div>
        </div>
        <div className="cartao-metrica">
          <div className="icone-fundo-laranja"><BarChart3 size={24} /></div>
          <div className="textos-metrica">
            <span>Tipos de Material</span>
            <strong>{dados.tiposUnicos.size}</strong>
          </div>
        </div>
        <div className="cartao-metrica">
          <div className="icone-fundo-roxo"><Calendar size={24} /></div>
          <div className="textos-metrica">
            <span>Coletas no Mês</span>
            <strong>{dados.esteMes}</strong>
          </div>
        </div>
      </div>

      <div className="quadro-principal">
        <h3 className="titulo-secao">Solicitações Pendentes</h3>
        <div className="tabela-coop-container">
          <table className="tabela-coop">
            <thead>
              <tr>
                <th>Morador</th>
                <th>Material</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {dados.solicitacoes.map((item) => (
                <tr key={item.coleta.id}>
                  <td><strong>{item.moradorNome}</strong></td>
                  <td>{item.coleta.material}</td>
                  <td>
                    <span className={`tag-status ${item.coleta.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item.coleta.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-acao-tabela"
                      onClick={() => {
                        setColetaSelecionada({ moradorId: item.moradorId, coleta: item.coleta });
                        setNovoStatus(item.coleta.status);
                      }}
                    >
                      Gerenciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {coletaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-gerenciar">
            <div className="modal-header">
              <h4>Atualizar Coleta</h4>
              <button onClick={() => setColetaSelecionada(null)}><X size={20}/></button>
            </div>
            <div className="modal-body">
              <label>Status:</label>
              <select 
                value={novoStatus} 
                onChange={(e) => setNovoStatus(e.target.value as Coleta['status'])}
              >
                <option value="Pendente">Pendente</option>
                <option value="Em Coleta">Em Coleta</option>
                <option value="Coletado">Coletado (Finalizar)</option>
              </select>

              {novoStatus === 'Coletado' && (
                <div className="campo-peso">
                  <label>Peso Final (kg):</label>
                  <input 
                    type="number" 
                    value={novoPeso} 
                    onChange={(e) => setNovoPeso(e.target.value)}
                    placeholder="Ex: 5.5"
                  />
                </div>
              )}
            </div>
            <button className="btn-confirmar" onClick={salvarGerenciamento}>Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
}