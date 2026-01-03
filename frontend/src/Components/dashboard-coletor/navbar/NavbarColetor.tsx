import "./NavbarColetor.css"
import logo from "../../../assets/dashboard.jpeg"
import { useNavigate } from "react-router-dom"; 


function NavbarColetor() {
  const navigate = useNavigate();
  return (
    <header className="navbar-coletor">
      <div className="navbar-container">
        
        <div className="navbar-left">
          <img src={logo} alt="logo eColeta" className="navbar-logo"/>
          <div>
            <h1>Olá, Carlos Santos!</h1>
            <p>Painel do Coletor</p>
          </div>
        </div>

        <button className="navbar-button" onClick={() => navigate("/perfil")}>
          Meu perfil
        </button>

      </div>
    </header>
  );
}

export default NavbarColetor;
