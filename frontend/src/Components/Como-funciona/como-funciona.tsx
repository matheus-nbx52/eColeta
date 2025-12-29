import ComoFuncionaImg from '../../assets/Logo/como-funciona.png'
import './como-funciona.css'

export default function Como_funciona() {
    return (
        <div className="como-funciona">
            <h2>Como funciona?</h2>
            
            <div>
                <img src={ComoFuncionaImg} alt="Como funciona o processo de reciclagem" />
            </div>

            <section className="descricao">
                <p>Separe seus recicláveis usando nosso guia</p>
                <p>Peça a coleta informando tipo e peso</p>
                <p>Coletor aceita e vai até a sua casa</p>
                <p>Material vai para a cooperativa</p>
            </section>
        </div>
    )
}