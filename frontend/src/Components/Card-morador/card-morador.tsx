import '../Card-morador/card-morador.css'
import { Link } from 'react-router-dom'
import Morador from '../../assets/Logo-morador/morador.png'


export default function Card_morador() {
    return (
        <>
            <div className='card-morador-container'>
                <h3>Cadastro de Morador</h3>
                <div className='card-logo-morador'>
                    <img src={Morador} alt="" />

                </div>
                <p>Solicite a coleta de recicláveis na sua casa
                    de forma rápida e prática.</p>

                <Link to="/cadastro-morador" className="btn-morador">
                Cadastrar
                </Link>

                


            </div>
        </>
    )

}
