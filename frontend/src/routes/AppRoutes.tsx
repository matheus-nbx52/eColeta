import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../contexts/AuthContext"
import Home from '../pages/home/home'
import CadastroMorador from "../pages/cadastro/morador/CadastroMorador"
import CadastroColetor from "../pages/cadastro/coletor/CadastroColetor"
import CadastroCooperativa from "../pages/cadastro/cooperativa/CadastroCooperativa"
import DashboardColetor from "../pages/dashboard/coletor/DashboardColetor"
import DashboardMorador from "../pages/dashboard/morador/DashboardMorador"
import PerfilColetor from "../pages/perfil-coletor/PerfilColetor"
import DashboardCooperativa from "../pages/dashboard/cooperativa/DashboardCooperativa"
import GuiaSeparacao from "../pages/guia-separacao/Guiaseparacao"
import PontosMorador from "../Components/pontosMorador/PontosMorador"
import { SaibaMais } from '../Components/saibaMais/SaibaMais';
import Login from "../pages/login/Login"
import PerfilMorador from "../Components/perfilMorador/PerfilMorador"
import PoliticaPrivacidade from "../pages/termosPolitica/PoliticaPrivacidade"
import TermosUso from "../pages/termosPolitica/TermosUso"

function AppRoutes() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/saibaMais" element={<SaibaMais/>} />
                    <Route path="/cadastro-morador" element={<CadastroMorador />} />
                    <Route path="/cadastro-coletor" element={<CadastroColetor />} />
                    <Route path="/cadastro-cooperativa" element={<CadastroCooperativa />} />
                    <Route path="/dashboard-coletor" element={<DashboardColetor />} />
                    <Route path="/dashboard-morador" element={<DashboardMorador/>}/>
                    <Route path="/perfil" element={<PerfilColetor />} />
                    <Route path="/dashboard-cooperativa" element={<DashboardCooperativa/>} />
                    <Route path="/guia-separacao" element={<GuiaSeparacao/>} />
                    <Route path="/pontos-morador" element={<PontosMorador />} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/PerfilMorador" element={<PerfilMorador/>} />
                    <Route path="/politica-privacidade" element={<PoliticaPrivacidade/>} />
                     <Route path="/termos-uso" element={<TermosUso/>} />
                   
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    )
}

export default AppRoutes;   