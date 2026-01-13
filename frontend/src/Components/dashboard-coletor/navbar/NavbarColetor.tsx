import "./NavbarColetor.css";
import logo from "../../../assets/Logo/ecoleta-icon.png"; 
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../../contexts/AuthContext";
import BotaoSair from "../../botaoSair/BotaoSair";
import { User } from "lucide-react";

function NavbarColetor() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const nomeExibicao = user?.nome ? user.nome.split(' ')[0] : "Coletor";

  const handleSair = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="navbar-coletor">
      <div className="navbar-container">
        
        <div 
          className="navbar-left" 
          onClick={() => navigate("/dashboard-coletor")} 
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="logo eColeta" className="navbar-logo"/>
          <div className="navbar-texto">
            <h1>Olá, {nomeExibicao}!</h1>
            <p>Painel do Coletor</p>
          </div>
        </div>

        <nav className="nav-menu">
          <ul>

            <li className="nav-link" onClick={() => navigate("/")}>
              Home
            </li>

            <li className="nav-link" onClick={() => navigate("/saibaMais")}>
              Saiba Mais
            </li>

            <li className="nav-link" onClick={() => navigate("/guia-separacao")}>
              Guia de Separação
            </li>

            <li className="perfil-item">
              <button className="perfil-link" onClick={() => navigate("/perfil")}>
                <User size={18} />
                Meu Perfil
              </button>
            </li>

            <li className="nav-item-botao">
              <BotaoSair onSair={handleSair} />
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}

export default NavbarColetor;