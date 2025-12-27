import '../Barra-de-navegacao/barra-de-navegacao.css';
import Logo from '../../assets/Logo-ecoleta/logo.png';
import '../../CSS/global.css'
export default function Barra_de_navegacao() {
    return (
        <>
      
            <div className="barra-de-navegacao-container">
                <div className="logo-descricao">
                    <div className="logo">
                        <img src={Logo} />
                    </div>
                </div>

                <nav className="navbar">
                    <ul className="menu">
                        <li>Inicio</li>
                        <li>Sobre</li>
                        <li>Como Funciona</li>
                        <li>Contato</li>
                    </ul>

                    <button className="btn-entrar">Entrar</button>
                </nav>

            </div>
        </>
    )
}
