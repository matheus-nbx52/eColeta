import './footer.css'

export default function Footer() {
    return (
        <footer className='footer-principal'>
            <div className='footer-content'>
                <div className='coluna'>
                    <h3>Sobre Nós</h3>
                    <hr />
                    <ul>
                        <li>Quem Somos</li>
                        <li>Contato</li>
                    </ul>
                </div>

                <div className='coluna'>
                    <h3>Informações</h3>
                    <hr />
                    <ul className='lista-horizontal'>
                        <li>Perguntas Frequentes</li>
                        <li>Política de Privacidade</li>
                    </ul>
                </div>
            </div>

            <div className='footer-bottom'>
                <p>© 2026 eColeta Todos os direitos reservados - Termos de Uso</p>
            </div>
        </footer>
    )
}