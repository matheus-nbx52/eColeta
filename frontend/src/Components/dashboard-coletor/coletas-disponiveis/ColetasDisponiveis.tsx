import { Check, X, MapPin, Calendar, Clock } from 'lucide-react';
import "./ColetasDisponiveis.css";

function ColetasDisponiveis({ dados, onAceitar, onRecusar, bloquearBotao, carregando }: any) {

  const handleAceitar = (coleta: any) => {
    if (bloquearBotao) {
      alert("Você já possui uma coleta em andamento! Finalize-a antes de aceitar outra.");
      return;
    }
    if (onAceitar) onAceitar(coleta);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const obterEndereco = (coleta: any) => {
    const morador = coleta.morador;
    if (morador?.endereco) {
      const { rua, numero, bairro, cidade } = morador.endereco;
      return `${rua}, ${numero} - ${bairro}, ${cidade}`;
    }
    return 'Endereço não disponível';
  };

  if (carregando) {
    return (
      <div className="sem-dados">
        <p>Carregando coletas disponíveis...</p>
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return (
      <div className="sem-dados">
        <MapPin size={48} color="#cbd5e0" />
        <p>Não há coletas disponíveis na sua região no momento.</p>
      </div>
    );
  }

  return (
    <div className="section-main-wrapper">
      <div className="lista-cards-aberta">
        {dados.map((coleta: any) => {
          const materiais = coleta.itens?.map((item: any) => item.residuo?.nome || 'Material').join(', ') || 'Material';
          const quantidadeTotal = coleta.itens?.reduce((acc: number, item: any) => acc + (item.quantidade_estimada || 0), 0) || 0;
          const dataAgendada = new Date(coleta.data_agendada);
          
          return (
            <div className="coleta-card" key={coleta.id_coleta}>
              <div className="accent-bar" />

              <div className="card-body">
                <div className="info-section">
                  <div className="header-coleta">
                    <span className="material-nome">{materiais}</span>
                    <span className="peso-tag">{quantidadeTotal}kg</span>
                  </div>

                  <div className="detalhes-horizontal">
                    <div className="detalhe-item">
                      <MapPin size={20} className="icon-purple" />
                      <span>{obterEndereco(coleta)}</span>
                    </div>
                    <div className="detalhe-item">
                      <Calendar size={20} className="icon-blue" />
                      <span>{formatarData(coleta.data_agendada)}</span>
                    </div>
                    <div className="detalhe-item">
                      <Clock size={20} className="icon-orange" />
                      <span>{dataAgendada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {coleta.observacoes && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                      <strong>Observações:</strong> {coleta.observacoes}
                    </div>
                  )}
                </div>

                <div className="actions-section">
                  <button 
                    className={`btn-aceitar ${bloquearBotao ? "btn-desativado" : ""}`}
                    onClick={() => handleAceitar(coleta)}
                    disabled={bloquearBotao || carregando}
                  >
                    <Check size={20} /> {bloquearBotao ? "Indisponível" : "Aceitar"}
                  </button>
                  <button
                    className="btn-recusar"
                    onClick={() => onRecusar && onRecusar(coleta.id_coleta)}
                    disabled={carregando}
                  >
                    <X size={20} /> Recusar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ColetasDisponiveis;