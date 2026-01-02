import CardResumo from "../../../Components/dashboard-coletor/card-resumo/CardResumo"
import "./DashboardColetor.css"
import NavbarColetor from "../../../Components/dashboard-coletor/navbar/NavbarColetor";
import ColetasDisponiveis from "../../../Components/dashboard-coletor/coletas-disponiveis/ColetasDisponiveis";

function DashboardColetor() {
  return (
    <>
    <NavbarColetor/>
    
    <main className="dashboard-page"> 
      
      <div className="dashboard-container">

        <div className="dashboard-cards">
          <CardResumo
            titulo="Disponíveis"
            valor={0}
            icon="📦"
            colorClass="orange"
          />

          <CardResumo
            titulo="Em Andamento"
            valor={0}
            icon="✈️"
            colorClass="blue"
          />

          <CardResumo
            titulo="Finalizadas"
            valor={0}
            icon="✅"
            colorClass="green"
          />
        </div>
        <div className="dashboard-section-wrapper">
          <ColetasDisponiveis/>
        </div>
        
      </div>
      
    </main>
   
    </>
  );
}

export default DashboardColetor;

