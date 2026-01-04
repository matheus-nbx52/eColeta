import { Clock, Box, CheckCircle, Trophy, Gift, Sparkles, Scale } from 'lucide-react';
import './DashboardContentMorador.css';
import { useState } from 'react'; 
import ModalSolicitarColeta from '../modalSolicitarColeta/ModalSolicitarColeta';

interface Coleta {
    id: string;
    status: 'Pendente' | 'Em Coleta' | 'Coletado';
    peso?: number;
}

interface Usuario {
    id: string;
    historico: Coleta[];
}

export default function DashboardContentMorador() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [stats] = useState(() => {
        const idLogado = localStorage.getItem('usuarioLogadoId');
        const usuariosRaw = localStorage.getItem('usuarios');
        
        const valorPadrao = { pendentes: 0, emColeta: 0, coletadas: 0, totalKg: 0, pontos: 0 };

        if (idLogado && usuariosRaw) {
            try {
                const usuarios: Usuario[] = JSON.parse(usuariosRaw);
                const usuarioAtual = usuarios.find(u => u.id === idLogado);

                if (usuarioAtual && usuarioAtual.historico) {
                    const calculoLocal = usuarioAtual.historico.reduce((acc, item) => {
                        if (item.status === 'Pendente') acc.pendentes++;
                        else if (item.status === 'Em Coleta') acc.emColeta++;
                        else if (item.status === 'Coletado') {
                            acc.coletadas++;
                            acc.totalKg += item.peso || 0;
                        }
                        return acc;
                    }, { pendentes: 0, emColeta: 0, coletadas: 0, totalKg: 0 });

                    return {
                        ...calculoLocal,
                        pontos: Math.floor(calculoLocal.totalKg * 10)
                    };
                }
            } catch (e) {
                console.error("Erro ao processar dados", e);
            }
        }
        return valorPadrao;
    });

    const handleFecharModal = () => {
        setIsModalOpen(false);
        window.location.reload(); 
    };

    return (
        <div className="conteudo-principal-recipiente">
            <div className="container-botao-topo">
                <button className="botao-solicitar-coleta" onClick={() => setIsModalOpen(true)}>
                    <span className="icone-mais">+</span> Solicitar Nova Coleta
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
                            <h1>{stats.pontos}</h1>
                        </div>
                    </div>
                    <div className="grade-estatisticas-internas">
                        <div className="mini-card-transparente">
                            <div className="info-topo">
                                <Sparkles size={16} color="#ffffff" />
                                <span>Coletas Realizadas</span>
                            </div>
                            <strong>{stats.coletadas}</strong>
                        </div>
                        <div className="mini-card-transparente">
                            <div className="info-topo">
                                <Scale size={16} color="#ffffff" />
                                <span>Total Coletado</span>
                            </div>
                            <strong>{stats.totalKg.toFixed(1)} kg</strong>
                        </div>
                    </div>
                </div>
                <button className="botao-troca-lateral">
                    <Gift size={24} color="#FF9D00" />
                    <div className="texto-botao-lateral">
                        <strong>Trocar Pontos</strong>
                        <br /><small>Ver parceiros</small>
                    </div>
                </button>
            </div>

            <div className="grade-cartoes-status">
                <div className="cartao-status-individual">
                    <div className="icone-status fundo-laranja"><Clock size={24} color="#ff9800" /></div>
                    <div className="texto-status">
                        <span className="titulo-status">Pendentes</span>
                        <strong className="valor-status">{stats.pendentes}</strong>
                    </div>
                </div>
                <div className="cartao-status-individual">
                    <div className="icone-status fundo-azul"><Box size={24} color="#2196f3" /></div>
                    <div className="texto-status">
                        <span className="titulo-status">Em Coleta</span>
                        <strong className="valor-status">{stats.emColeta}</strong>
                    </div>
                </div>
                <div className="cartao-status-individual">
                    <div className="icone-status fundo-verde"><CheckCircle size={24} color="#4caf50" /></div>
                    <div className="texto-status">
                        <span className="titulo-status">Coletadas</span>
                        <strong className="valor-status">{stats.coletadas}</strong>
                    </div>
                </div>
            </div>

            <ModalSolicitarColeta isOpen={isModalOpen} onClose={handleFecharModal} />
        </div>
    );
}