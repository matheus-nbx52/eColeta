import { Clock, Box, CheckCircle, Trophy, Gift, Sparkles, Scale } from 'lucide-react';
import './DashboardContentMorador.css';
import { useState } from 'react';
import ModalSolicitarColeta from '../modalSolicitarColeta/ModalSolicitarColeta';

export default function DashboardContentMorador() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="conteudo-principal-recipiente">
            <div className="container-botao-topo">
                <button 
                    className="botao-solicitar-coleta" 
                    onClick={() => setIsModalOpen(true)}
                >
                    <span className="icone-mais">+</span>
                    Solicitar Nova Coleta
                </button>
            </div>

            <div className="cartao-pontos-destaque">
                <div className="painel-pontos-esquerda">
                    <div className="cabecalho-principal">
                        <div className="caixa-trofeu">
                            <Trophy size={32} color="#ffffff" strokeWidth={1.5} />
                        </div>
                        <div className="texto-pontos-grande">
                            <span className="label-pontos">Seus Pontos eColeta</span>
                            <h1>0</h1>
                        </div>
                    </div>

                    <div className="grade-estatisticas-internas">
                        <div className="mini-card-transparente">
                            <div className="info-topo">
                                <Sparkles size={16} color="#ffffff" />
                                <span>Coletas Realizadas</span>
                            </div>
                            <strong>0</strong>
                        </div>

                        <div className="mini-card-transparente">
                            <div className="info-topo">
                                <Scale size={16} color="#ffffff" />
                                <span>Total Coletado</span>
                            </div>
                            <strong>0.0 kg</strong>
                        </div>
                    </div>

                    <p className="texto-ajuda-rodape">
                        Ganhe 10 pontos por kg de material reciclado e troque por descontos em empresas sustentáveis!
                    </p>
                </div>

                <button className="botao-troca-lateral">
                    <Gift size={24} color="#FF9D00" />
                    <div className="texto-botao-lateral">
                        <strong>Trocar Pontos</strong>
                        <br />
                        <small>Ver empresas parceiras</small>
                    </div>
                </button>
            </div>

            <div className="grade-cartoes-status">
                <div className="cartao-status-individual">
                    <div className="icone-status fundo-laranja">
                        <Clock size={24} color="#ff9800" />
                    </div>
                    <div className="texto-status">
                        <span className="titulo-status">Pendentes</span>
                        <strong className="valor-status">0</strong>
                    </div>
                </div>

                <div className="cartao-status-individual">
                    <div className="icone-status fundo-azul">
                        <Box size={24} color="#2196f3" />
                    </div>
                    <div className="texto-status">
                        <span className="titulo-status">Em Coleta</span>
                        <strong className="valor-status">0</strong>
                    </div>
                </div>

                <div className="cartao-status-individual">
                    <div className="icone-status fundo-verde">
                        <CheckCircle size={24} color="#4caf50" />
                    </div>
                    <div className="texto-status">
                        <span className="titulo-status">Coletadas</span>
                        <strong className="valor-status">0</strong>
                    </div>
                </div>
            </div>

            <ModalSolicitarColeta 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}