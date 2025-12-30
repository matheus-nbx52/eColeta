import ComoFuncionaImg from '../../assets/Logo/como-funciona.png'
import './como-funciona.css'

export default function Como_funciona() {
    return (
        <div className="como-funciona">
            <h2>Como funciona?</h2>

            <div className="passos-wrapper">
                <div className="passo">
                    <span className="numero">1</span>
                    <h3 className="titulo-passo">Separe</h3>
                </div>
                <div className="passo">
                    <span className="numero">2</span>
                    <h3 className="titulo-passo">Solicite</h3>
                </div>
                <div className="passo">
                    <span className="numero">3</span>
                    <h3 className="titulo-passo">Coleta</h3>
                </div>
                <div className="passo">
                    <span className="numero">4</span>
                    <h3 className="titulo-passo">Recicle</h3>
                </div>
            </div>
            <div>
                <img src={ComoFuncionaImg} alt="Como funciona o processo de reciclagem" />
            </div>

            <section className="descricao">
                <p>Separe seus recicláveis <br /> usando nosso guia</p>
                <p>Peça a coleta informando tipo <br />e peso</p>
                <p>Coletor aceita e vai até a <br /> sua casa</p>
                <p>Material vai para a <br />cooperativa</p>
            </section>
        </div>
    )
}