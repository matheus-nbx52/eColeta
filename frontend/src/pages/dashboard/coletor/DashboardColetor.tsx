import CardResumo from "../../../Components/dashboard-coletor/card-resumo/CardResumo"
import "./DashboardColetor.css"
import NavbarColetor from "../../../Components/dashboard-coletor/navbar/NavbarColetor";
import ColetasDisponiveis from "../../../Components/dashboard-coletor/coletas-disponiveis/ColetasDisponiveis";
import { useState } from "react";
import DetalheColetas from "../../../Components/dashboard-coletor/detalhe-coletas/DetalheColetas"

function DashboardColetor() {
  const [totalDisponiveis, setTotalDisponiveis] = useState(0)
  const [totalAndamento, setTotalAndamento] = useState(0)
  const [totalFinalizadas, setTotalFinalizadas] = useState(0)
  const [coletaIniciada, setColetaIniciada] = useState(false);

  const [coletaAtiva, setColetaAtiva] = useState<any>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleAceitarColeta = (dadosDaColeta: any) => {
    if (coletaAtiva) {
      alert("Você já possui uma coleta em andamento! Finalize-a antes de aceitar outra.");
      return;
    }

    setColetaAtiva(dadosDaColeta);
    setMostrarModal(true);
    setTotalAndamento(prev => prev + 1);
    setTotalDisponiveis(prev => (prev > 0 ? prev - 1 : 0));
  };


  const handleFinalizarColeta = () => {
    setMostrarModal(false);
    setColetaAtiva(null);
    setColetaIniciada(false);
    setTotalAndamento(prev => prev - 1);
    setTotalFinalizadas(prev => prev + 1);
  };

  return (
    <>
      <NavbarColetor />

      <main className="dashboard-page">

        <div className="dashboard-container">

          <div className="dashboard-cards">
            <CardResumo
              titulo="Disponíveis"
              valor={totalDisponiveis}
              icon="📦"
              colorClass="orange"
            />

            <CardResumo
              titulo="Em Andamento"
              valor={totalAndamento}
              icon="✈️"
              colorClass="blue"
            />

            <CardResumo
              titulo="Finalizadas"
              valor={totalFinalizadas}
              icon="✅"
              colorClass="green"
            />
          </div>

          {/* NOVO: Card de Atalho para a Coleta Ativa */}
          {coletaAtiva && !mostrarModal && (
            <div className="alerta-coleta-ativa" onClick={() => setMostrarModal(true)}>
              <p>🚀 Você tem uma coleta em andamento: <strong>{coletaAtiva.material}</strong></p>
              <span>Clique para ver detalhes</span>
            </div>
          )}

          <div className="dashboard-section-wrapper">
            <ColetasDisponiveis
              setTotalDisponiveis={setTotalDisponiveis}
              setTotalAndamento={setTotalAndamento}
              onAceitar={handleAceitarColeta}
              bloquearBotao={!!coletaAtiva}
            />
          </div>

        </div>

  
        {mostrarModal && coletaAtiva && (
          <DetalheColetas
            coleta={coletaAtiva}
            onClose={() => setMostrarModal(false)}
            onFinalizar={handleFinalizarColeta}
            iniciada={coletaIniciada}
            setIniciada={setColetaIniciada}
          />
        )}

      </main>

    </>
  );
}

export default DashboardColetor;

