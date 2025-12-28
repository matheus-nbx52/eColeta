import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from '../pages/home/home'
import CadastroMorador from "../pages/cadastro/morador/CadastroMorador"
import CadastroColetor from "../pages/cadastro/coletor/CadastroColetor"
import CadastroCooperativa from "../pages/cadastro/cooperativa/CadastroCooperativa"

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cadastro-morador" element={<CadastroMorador />} />
                <Route path="/cadastro-coletor" element={<CadastroColetor />} />
                <Route path="/cadastro-cooperativa" element={<CadastroCooperativa />} />
            </Routes>
        </BrowserRouter>

    )
}

export default AppRoutes;