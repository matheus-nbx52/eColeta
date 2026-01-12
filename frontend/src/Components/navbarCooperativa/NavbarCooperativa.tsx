import "./NavbarCooperativa.css";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo/ecoleta-icon.png";
import BotaoSair from "../botaoSair/BotaoSair";
import { useAuth } from "../../contexts/AuthContext";

export default function NavbarCooperativa() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Garantir que o nome seja exibido corretamente
  const nomeCooperativa = user?.nome ? user.nome.split(' ')[0] : "Cooperativa";

  const handleSair = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="barra-navegacao-coop">
      <div className="conteudo-navegacao">
        <div
          className="logo-e-texto"
          onClick={() => navigate("/dashboard-cooperativa")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={Logo}
            alt="Logo"
            className="imagem-logo-png"
          />

          <div className="identificacao">
            <h2 className="titulo-coop">Olá, {nomeCooperativa}!</h2>
            <p className="subtitulo-coop">Painel da Cooperativa</p>
          </div>
        </div>

        <nav className="nav-menu">
          <ul>
            <li
              className="nav-link"
              onClick={() => navigate("/")}> Home
            </li>

            <li
              className="nav-link"
              onClick={() => navigate("/saibaMais")}> Saiba Mais
            </li>

            <li
              className="nav-link"
              onClick={() => navigate("/guia-separacao")}> Guia de Separação
            </li>

            <li className="nav-item-botao">
              <BotaoSair onSair={handleSair} /> 
            </li>
          </ul>
        </nav>
      </div>
    </nav>
  );
}