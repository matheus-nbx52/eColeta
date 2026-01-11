import { useNavigate } from 'react-router-dom';
import { Recycle, Users, Star, Gift, Smartphone, MapPin, TrendingUp, CheckCircle, Building2 } from 'lucide-react';
import './SaibaMais.css';
import logo from '../../assets/Logo/logo.png';


export function SaibaMais() {
    const navigate = useNavigate();

    return (
        <div className="saiba-mais">

            <header className="sm-header">
                <div className="sm-header-content">
                    <div className="sm-title">
                        <img src={logo} alt="logo" className='sm-logo' />
                        <h1>Como Funciona o eColeta</h1>
                    </div>

                </div>
                <div className='menu'>
                    <ul>
                        <li className="nav-link" onClick={() => navigate('/')}> Home </li>
                        <li className="nav-link" onClick={() => navigate("/guia-separacao")}> Guia de Separação </li>
                    </ul>

                    <button className="btn-entrar-fix" onClick={() => navigate('/login')}>Entrar</button>

                </div>

            </header>
            <section className="sm-hero">
                <div className="sm-hero-content">
                    <span className="sm-badge">
                        <Star size={16} />
                        O delivery da reciclagem
                    </span>

                    <h2>
                        Conectando pessoas,<br />
                        <span>transformando o futuro</span>
                    </h2>

                    <p> O eColeta é uma plataforma revolucionária
                        que facilita a coleta de materiais recicláveis,
                        conectando moradores, coletores e cooperativas
                        em um ecossistema sustentável e recompensador.
                    </p>

                    <div className="sm-stats">
                        <div className="sm-stat">
                            <Users size={32} />
                            <strong><br />1000+</strong>
                            <span><br />Usuários ativos</span>
                        </div>

                        <div className="sm-stat">
                            <Recycle size={32} />
                            <strong><br />50 toneladas</strong>
                            <span><br />Material reciclado</span>
                        </div>

                        <div className="sm-stat">
                            <TrendingUp size={32} />
                            <strong><br />95%</strong>
                            <span><br />Satisfação</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sm-section">
                <h3>Para moradores</h3>
                <p className="sm-subtitle">
                    Recicle de forma fácil e ganhe recompensas
                </p>

                <div className="sm-steps">
                    <div className="sm-step">
                        <span>1</span>
                        <br />
                        <Smartphone />
                        <h4>Separe seus resíduos</h4>
                        <p>
                            Organize seus materiais recicláveis (papel, plástico, metal, vidro, eletrônicos)
                        </p>
                    </div>

                    <div className="sm-step">
                        <span>2</span>
                        <br />
                        <MapPin />
                        <h4>Solicite a coleta</h4>
                        <p>
                            Informe o tipo e peso estimado dos materiais, escolha o horário preferido
                        </p>
                    </div>

                    <div className="sm-step">
                        <span>3</span>
                        <br />
                        <Recycle />
                        <h4>Aguarde o coletor</h4>
                        <p>Um coletor aceita sua solicitação e vai até você retirar o material
                        </p>
                    </div>

                    <div className="sm-step">
                        <span>4</span>
                        <br />
                        <Gift />
                        <h4>Ganhe pontos</h4>
                        <p>
                            Receba 10 pontos por kg reciclado e troque por descontos em empresas parceiras
                        </p>
                    </div>
                </div>
            </section>

            <section className="sm-card">
                <h3>Para coletores</h3>
                <p className="sm-subtitle">
                    Aceite coletas e conquiste recompensas
                </p>

                <div className="sm-grid-2">
                    <div className="sm-item">
                        <CheckCircle />
                        <div>
                            <h4>Visualize coletas disponíveis</h4>
                            <p>
                                Veja todas as solicitações de coleta na sua região,
                                com informações detalhadas sobre tipo de material, peso e endereço.
                            </p>
                        </div>
                    </div>

                    <div className="sm-item">
                        <CheckCircle />
                        <div>
                            <h4>Aceite a coleta</h4>
                            <p>
                                Escolha as coletas que deseja realizar e inicie o percurso.
                                O morador é notificado que você está a caminho.
                            </p>
                        </div>
                    </div>

                    <div className="sm-item">
                        <CheckCircle />
                        <div>
                            <h4>Realize a coleta</h4>
                            <p>
                                Vá até o endereço, retire o material reciclável e
                                leve para a cooperativa cadastrada mais próxima.
                            </p>
                        </div>
                    </div>

                    <div className="sm-item">
                        <CheckCircle />
                        <div>
                            <h4>Conquiste badges</h4>
                            <p>
                                Sistema de gamificação com conquistas baseadas em desempenho: Iniciante, Experiente, Especialista e Lenda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sm-card">
                <h3>Para cooperativas</h3>
                <p className="sm-subtitle">
                    Receba materiais e acompanhe estatísticas
                </p>

                <div className="sm-grid-3">
                    <div className="sm-mini-card">
                        <Building2 />
                        <h4>Cadastro na plataforma</h4>
                        <p>
                            Cooperativas se cadastram e ficam disponíveis para receber materiais recicláveis dos coletores
                        </p>
                    </div>

                    <div className="sm-mini-card">
                        <Recycle />
                        <h4>Recebimento de materiais</h4>
                        <p>
                            Coletores levam os materiais coletados para a cooperativa, que processa e destina corretamente.
                        </p>
                    </div>

                    <div className="sm-mini-card">
                        <TrendingUp />
                        <h4>Estatísticas detalhadas</h4>
                        <p>
                            Dashboard com métricas de materiais recebidos, histórico de coletas e impacto ambiental.
                        </p>
                    </div>
                </div>
            </section>

            <section className="sm-pontos">
                <div className="sm-pontos-header">
                    <div className="sm-pontos-icon">
                        <Star />
                    </div>
                    <div>
                        <h3>Sistema de pontos</h3>
                        <p>Recicle e seja recompensado</p>
                    </div>
                </div>

                <div className="sm-pontos-grid">
                    <div className="sm-pontos-col">
                        <h4>Como ganhar pontos?</h4>

                        <div className="sm-pontos-item">
                            <CheckCircle />
                            <p><strong>10 pontos por kg</strong> de material reciclável coletado</p>
                        </div>

                        <div className="sm-pontos-item">
                            <CheckCircle />
                            <p>Os pontos são creditados automaticamente após a finalização da coleta</p>
                        </div>

                        <div className="sm-pontos-item">
                            <CheckCircle />
                            <p>Quanto mais você recicla, mais pontos acumula</p>
                        </div>
                    </div>

                    <div className="sm-pontos-col">
                        <h4>Como usar seus pontos?</h4>

                        <div className="sm-pontos-item">
                            <Gift />
                            <p>
                                Troque por descontos em<strong> empresas parceiras </strong>que possuem o Selo Verde eColeta.
                            </p>
                        </div>

                        <div className="sm-pontos-item">
                            <Gift />
                            <p>Diversos estabelecimentos: supermercados, restaurantes, lojas sustentáveis</p>
                        </div>

                        <div className="sm-pontos-item">
                            <Gift />
                            <p>Descontos de até <strong>50%</strong> em produtos e serviços</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="sm-cta">
                <h3>Pronto para começar?</h3>
                <p>
                    Cadastre-se agora e faça parte da revolução sustentável
                </p>
                <button onClick={() => navigate('/login')}>
                    Começar agora
                </button>
            </div>

        </div>
    );
}
