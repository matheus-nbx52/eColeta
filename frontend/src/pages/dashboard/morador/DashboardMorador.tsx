import './DashboardMorador.css';
import NavbarMorador from '../../../Components/navbar-morador/NavbarMorador';
import DashboardContentMorador from '../../../Components/dashboardContent/DashboardContentMorador';

export default function DashboardMorador() {
 
    const nomeDoUsuarioLogado = "Débora"; 

    return (
        <div className="recipiente-dashboard-principal">
           
            <NavbarMorador nome={nomeDoUsuarioLogado} />
            
            <DashboardContentMorador />
        </div>
    );
}   