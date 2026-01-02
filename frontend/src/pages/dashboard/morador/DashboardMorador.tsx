import './DashboardMorador.css';
import NavbarMorador from '../../../Components/navbar-morador/NavbarMorador';
import DashboardContentMorador from '../../../Components/dashboardContent/DashboardContentMorador';
import HistoricoMorador from '../../../Components/HistoricoMorador/HistoricoMorador';

export default function DashboardMorador() {
 const nomeDoUsuarioLogado = "Débora";

    return (
        <div className="recipiente-dashboard-principal">
            <NavbarMorador nome={nomeDoUsuarioLogado} />
            
            <div className="conteudo-central">
                <button type="button" className="btn-voltar" onClick={() => window.history.back()}>
                    ← Voltar
                </button>

                <DashboardContentMorador />
                <HistoricoMorador />
            </div>
        </div>
    );
}