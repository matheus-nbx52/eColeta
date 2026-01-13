import { Clock, Box, CheckCircle, Trophy, Gift} from 'lucide-react';
import './DashboardContentMorador.css';
import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import ModalSolicitarColeta from '../modalSolicitarColeta/ModalSolicitarColeta';
import HistoricoMorador from '../HistoricoMorador/HistoricoMorador';
import { coletasService } from '../../services/coletasService';
import { api } from '../../services/api';
import type { ColetaResponse } from '../../types/coleta';

export default function DashboardContentMorador() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroAtivo, setFiltroAtivo] = useState<'Pendente' | 'Em Coleta' | 'Coletado'>('Pendente');
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    const [stats, setStats] = useState({ 
        pendentes: 0, 
        emColeta: 0, 
        coletadas: 0, 
        totalKg: 0, 
        pontos: 0 
    });

    const carregarEstatisticas = async () => {
        try {
            setLoading(true);
            const coletas = await coletasService.listarPorMorador();
            
            const calculo = coletas.reduce((acc: any, coleta: ColetaResponse) => {
                if (coleta.status_coleta === 'Pendente') {
                    acc.pendentes++;
                } else if (coleta.status_coleta === 'Aceito' || coleta.status_coleta === 'A Caminho' || coleta.status_coleta === 'EM_CAMINHO') {
                    acc.emColeta++;
                } else if (coleta.status_coleta === 'Entregue_Coop' || coleta.status_coleta === 'Concluido' || coleta.status_coleta === 'VALIDADA' || coleta.status_coleta === 'Validada') {
                    acc.coletadas++;
                    // Calcular kg a partir dos itens ou do peso validado
                    if (coleta.peso_kg) {
                        acc.totalKg += coleta.peso_kg;
                    } else if (coleta.itens) {
                        coleta.itens.forEach(item => {
                            acc.totalKg += item.quantidade_estimada || 0;
                        });
                    }
                }
                return acc;
            }, { pendentes: 0, emColeta: 0, coletadas: 0, totalKg: 0 });

            // Buscar saldo real do morador do perfil
            let pontos = 0;
            try {
                const perfilResponse = await api.get('/morador/perfil');
                pontos = perfilResponse.data.morador?.saldo || 0;
            } catch (error) {
                console.error('Erro ao buscar saldo do morador:', error);
                // Fallback: calcular pelos pontos gerados nas coletas validadas
                pontos = coletas
                    .filter(c => c.pontos_gerados)
                    .reduce((acc, c) => acc + (c.pontos_gerados || 0), 0);
            }

            setStats({
                ...calculo,
                pontos
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarEstatisticas();
        // Atualizar a cada 60 segundos (mesmo padrão do coletor)
        const interval = setInterval(carregarEstatisticas, 60000);
        return () => clearInterval(interval);
    }, []);

   const handleFecharModal = () => {
    setIsModalOpen(false);
    carregarEstatisticas();
    setRefreshTrigger(prev => prev + 1); // Forçar refresh do histórico
    setFiltroAtivo('Pendente');
};

    if (loading) {
        return (
            <div className="conteudo-principal-recipiente">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Carregando dados...</p>
                </div>
            </div>
        );
    }

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
                        <div className="caixa-trofeu"><Trophy size={32} /></div>
                        <div className="texto-pontos-grande">
                            <span style={{fontSize: '0.9rem', opacity: 0.9}}>Seus Pontos eColeta</span>
                            <h1>{stats.pontos}</h1>
                        </div>
                    </div>
                    <div className="grade-estatisticas-internas">
                        <div className="mini-card-transparente">
                            <span>Coletas Realizadas</span>
                            <strong>{stats.coletadas}</strong>
                        </div>
                        <div className="mini-card-transparente">
                            <span>Total Coletado</span>
                            <strong>{stats.totalKg} kg</strong>
                        </div>
                    </div>
                </div>
                <button className="botao-troca-lateral" onClick={() => navigate('/pontos-morador')}>
                    <Gift size={24} color="#FF9100" />
                    <div className="texto-botao-lateral">
                        <strong>Trocar Pontos</strong>
                        <br /><small>Ver parceiros</small>
                    </div>
                </button>
            </div>

            <div className="grade-cartoes-status">
                {/* CARD PENDENTE */}
                <div 
                    className={`cartao-status-individual pendente-click ${filtroAtivo === 'Pendente' ? 'ativo' : ''}`}
                    onClick={() => setFiltroAtivo('Pendente')}
                >
                    <div className="icone-status fundo-laranja"><Clock size={24} color="#ff9800" /></div>
                    <div className="texto-status">
                        <span className="titulo-status">Pendentes</span>
                        <strong className="valor-status">{stats.pendentes}</strong>
                    </div>
                </div>

                {/* CARD EM COLETA */}
                <div 
                    className={`cartao-status-individual coleta-click ${filtroAtivo === 'Em Coleta' ? 'ativo' : ''}`}
                    onClick={() => setFiltroAtivo('Em Coleta')}
                >
                    <div className="icone-status fundo-azul"><Box size={24} color="#2196f3" /></div>
                    <div className="texto-status">
                        <span className="titulo-status">Em Coleta</span>
                        <strong className="valor-status">{stats.emColeta}</strong>
                    </div>
                </div>

                {/* CARD COLETADO */}
                <div 
                    className={`cartao-status-individual coletado-click ${filtroAtivo === 'Coletado' ? 'ativo' : ''}`}
                    onClick={() => setFiltroAtivo('Coletado')}
                >
                    <div className="icone-status fundo-verde"><CheckCircle size={24} color="#10b981" /></div>
                    <div className="texto-status">
                        <span className="titulo-status">Coletadas</span>
                        <strong className="valor-status">{stats.coletadas}</strong>
                    </div>
                </div>
            </div>

            <HistoricoMorador 
                filtroStatus={filtroAtivo} 
                onColetasChange={() => {
                    carregarEstatisticas();
                    setRefreshTrigger(prev => prev + 1);
                }}
                refreshTrigger={refreshTrigger}
            />

        <ModalSolicitarColeta 
          isOpen={isModalOpen} 
          onClose={handleFecharModal}
          onSuccess={carregarEstatisticas}
        />
        </div>
    );
}