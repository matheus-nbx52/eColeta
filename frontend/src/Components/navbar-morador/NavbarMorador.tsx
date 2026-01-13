import './NavbarMorador.css';
import Logo from "../../assets/Logo/ecoleta-icon.png";
import { useNavigate } from "react-router-dom";
import BotaoSair from "../botaoSair/BotaoSair";
import { User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function NavbarMorador() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const nomeExibicao = (() => {
        if (user?.nome) {
            const partes = user.nome.trim().split(/\s+/);
            if (partes.length > 1) {
                return `${partes[0]} ${partes[1]}`;
            }
            return partes[0];
        }
        return 'Morador';
    })();

    return (
        <header className="navegacao-recipiente">
            <div className="navegacao-esquerda">
                <div className="caixa-icone">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="navegacao-logo"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate("/")}
                    />
                </div>
                <div className="navegacao-texto">
                    <h2>Olá, {nomeExibicao}!</h2>
                    <span>Painel do Morador</span>
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
                        <button
                            className="perfil-link"
                            onClick={() => navigate("/PerfilMorador")}
                        >
                            <User size={18} />
                            Meu Perfil
                        </button>
                    </li>

                    <li className="nav-item-botao">
                        <BotaoSair onSair={() => { 
                            logout(); 
                            navigate("/login");
                        }} />
                    </li>
                </ul>
            </nav>
        </header>
    );
}