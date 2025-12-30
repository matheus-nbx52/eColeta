import '../../CSS/global.css';
import './NavbarMorador.css';
import iconeReciclagem from "../../assets/Logo/recycleIcon.png"; 

interface PropriedadesNavbar {
    nome: string;
}

export default function NavbarMorador({ nome }: PropriedadesNavbar) {
    return (
        <header className="navegacao-recipiente">
            <div className="navegacao-esquerda">
                <div className="caixa-icone">
                    <img src={iconeReciclagem} alt="Ícone de Reciclagem" className="navegacao-icone" />
                </div>
                <div className="navegacao-texto">
                    <h2>Olá, {nome}!</h2>
                    <span>Painel do Morador</span>
                </div>
            </div>
            <button className="botao-navegacao">
                 Guia de Separação
            </button>
        </header>
    );
}