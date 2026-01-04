import "./NavbarCooperativa.css";
import { useNavigate } from "react-router-dom";
import IconeCooperativa from "../../assets/Logo/icone-cooperativa.png";
import BotaoDescarte from "../BotaoDescarte/BotaoDescarte";
import BotaoSair from "../botaoSair/BotaoSair"; 

interface Usuario {
  id: string;
  nome: string;
  tipo: string;
}

interface NavbarProps {
  nome?: string;
}

export default function NavbarCooperativa({ nome }: NavbarProps) {
  const navigate = useNavigate();

  const nomeParaExibir = (() => {
    if (nome) return nome;

    const idLogado = localStorage.getItem('usuarioLogadoId');
    const usuariosRaw = localStorage.getItem('usuarios');

    if (idLogado && usuariosRaw) {
      try {
        const usuarios: Usuario[] = JSON.parse(usuariosRaw);
        const usuarioAtual = usuarios.find((u) => u.id === idLogado);
        return usuarioAtual?.nome || "Cooperativa";
      } catch (error) {
        console.error("Erro ao ler dados da Cooperativa", error);
      }
    }
    return "Cooperativa";
  })();

  const handleSair = () => {
    localStorage.removeItem('usuarioLogadoId');
    navigate("/");
  };

  return (
    <nav className="barra-navegacao-coop">
      <div className="conteudo-navegacao">
        <div className="logo-e-texto" onClick={() => navigate("/dashboard-cooperativa")}>
          <img src={IconeCooperativa} alt="Logo" className="imagem-logo-png" />
          <div className="identificacao">
            <h2 className="titulo-coop">{nomeParaExibir}</h2>
            <p className="subtitulo-coop">Painel de Gestão</p>
          </div>
        </div>

        <div className="acoes-navbar">
          <BotaoDescarte onClick={() => navigate("/guia-materiais")} />
          <BotaoSair onSair={handleSair} />
        </div>
      </div>
    </nav>
  );
}