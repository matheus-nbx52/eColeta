import './card-cooperativa.css'
import LogoCooperativa from '../../assets/Logo/cooperativa.png' 
import { Link } from 'react-router-dom'

export default function Card_cooperativa() {
    return (
        <div className='card-cooperativa-container'>
            <h3>Cadastro de Cooperativa</h3>
            <div className='card-logo-cooperativa'>
                <img src={LogoCooperativa} alt="Logo Cooperativa" />
            </div>
            
            <p>Receba materiais recicláveis de coletores cadastrados na plataforma.</p>

            <Link to="/cadastro-cooperativa" className='btn-cooperativa'>
                Cadastrar
            </Link>
        </div>
    )
}