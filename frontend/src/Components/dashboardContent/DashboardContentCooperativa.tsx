import "./DashBoardContentCooperativa.css";
import { 
  Clock, MapPin, Calendar, 
  Check, Scale, X, History, User, Truck, AlertTriangle, 
} from "lucide-react";
import { useState, useEffect } from "react";

interface Coleta {
  id: string;
  material: string;
  quantidade: string;
  status: 'Pendente' | 'Em Coleta' | 'Coletado' | 'Recusado';
  data: string;
  peso: number;
  coletorNome?: string;
  coletorId?: string;
  motivoRecusa?: string;
  endereco?: string;
  horario?: string;
}

interface Usuario {
  id: string;
  nome: string;
  tipo: string;
  historico?: Coleta[];
  pontos?: number;
}

interface ItemColetaExtendida extends Coleta {
  moradorNome: string;
  moradorId: string;
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
      const usuariosRaw = localStorage.getItem('usuarios');
      const metricas = { emAndamento: [] as ItemColetaExtendida[], historico: [] as ItemColetaExtendida[] };

      if (usuariosRaw) {
        const usuarios: Usuario[] = JSON.parse(usuariosRaw);
        usuarios.forEach(user => {
          user.historico?.forEach(coleta => {
            const item: ItemColetaExtendida = { ...coleta, moradorNome: user.nome, moradorId: user.id };
            if (coleta.status === 'Em Coleta') metricas.emAndamento.push(item);
            else if (coleta.status === 'Coletado' || coleta.status === 'Recusado') metricas.historico.push(item);
          });
        });
      }
      setDados(metricas);
    } catch {
      console.error("Erro ao processar dados locais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const processarAcao = async (status: 'Coletado' | 'Recusado') => {
    const itemAlvo = status === 'Coletado' ? modalFinalizar : modalRecusar;
    if (!itemAlvo) return;

    try {
      const usuariosRaw = localStorage.getItem('usuarios');
      if (usuariosRaw) {
        const usuarios: Usuario[] = JSON.parse(usuariosRaw);
        const novosUsuarios = usuarios.map(user => {
          if (user.id === itemAlvo.moradorId) {
            const novoHist = user.historico?.map(c => {
              if (c.id === itemAlvo.id) {
                if (status === 'Coletado') return { ...c, status, peso: parseFloat(pesoFinal) };
                return { ...c, status, motivoRecusa };
              }
              return c;
            });
            return { ...user, historico: novoHist };
          }
          return user;
        });
        localStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
        
        setModalFinalizar(null);
        setModalRecusar(null);
        setPesoFinal("");
        setMotivoRecusa("");
        carregarDados();
      }
    } catch {
      alert("Erro ao processar ação.");
    }
  };

  const gerarDadosTeste = () => {
    const dadosMock: Usuario[] = [
      { id: "u1", nome: "Carlos Silva", tipo: "morador", historico: [{ id: "c1", material: "Papelão", quantidade: "25kg est.", status: "Em Coleta", data: "10/01/2026", horario: "14:00", endereco: "Rua das Flores, 123", peso: 0, coletorNome: "Marcos Oliveira" }] },
      { id: "u2", nome: "Ana Oliveira", tipo: "morador", historico: [{ id: "c2", material: "Vidro PET", quantidade: "12 unidades", status: "Em Coleta", data: "10/01/2026", horario: "15:30", endereco: "Av. Paulista, 900", peso: 0, coletorNome: "Ricardo Souza" }] }
    ];
    localStorage.setItem('usuarios', JSON.stringify(dadosMock));
    carregarDados();
  };

  if (loading && dados.emAndamento.length === 0) return null;

  return (
    <div className="corpo-painel-coop">
      <div className="controles-teste">
        <button onClick={gerarDadosTeste} className="btn-gerar">🔄 Gerar Teste</button>
        <button onClick={() => { localStorage.removeItem('usuarios'); carregarDados(); }} className="btn-limpar">🗑️ Zerar</button>
      </div>

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
                    </div>
                    <div className="grade-envolvidos">
                      <div className="perfil-mini"><User size={16} className="cor-morador"/><div><label>Morador</label><p>{item.moradorNome}</p></div></div>
                      <div className="perfil-mini"><Truck size={16} className="cor-coletor"/><div><label>Coletor</label><p>{item.coletorNome}</p></div></div>
                    </div>
                    <div className="detalhes-linha">
                      <span><MapPin size={14} /> {item.endereco}</span>
                      <span><Calendar size={14} /> {item.data}</span>
                    </div>
                  </div>
                  <div className="card-acoes-coop">
                    <span className="badge-status azul">COLETOR A CAMINHO</span>
                    <button className="btn-receber" onClick={() => setModalFinalizar(item)}>Recebida <Check size={18}/></button>
                    <button className="btn-recusar-link" onClick={() => setModalRecusar(item)}>Recusar Material</button>
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
              <button className="fechar-x" onClick={() => setModalFinalizar(null)}><X/></button>
            </div>
            <div className="input-peso-container">
              <Scale size={24} />
              <input type="number" value={pesoFinal} onChange={(e) => setPesoFinal(e.target.value)} placeholder="0.0 kg" autoFocus />
            </div>
            <div className="modal-footer-recusa">
              <button className="btn-receber" style={{width: '100%'}} onClick={() => processarAcao('Coletado')}>Confirmar Recebimento</button>
            </div>
          </div>
        </div>
      )}

      {modalRecusar && (
        <div className="modal-overlay">
          <div className="modal-container-recusa">
            <div className="modal-header-recusa">
              <h3>Motivo da Recusa</h3>
              <button className="fechar-x" onClick={() => setModalRecusar(null)}><X/></button>
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