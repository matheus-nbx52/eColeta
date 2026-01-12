import CardResumo from "../../../Components/dashboard-coletor/card-resumo/CardResumo"
import "./DashboardColetor.css"
import NavbarColetor from "../../../Components/dashboard-coletor/navbar/NavbarColetor";
import ColetasDisponiveis from "../../../Components/dashboard-coletor/coletas-disponiveis/ColetasDisponiveis";
import ColetasAndamento from "../../../Components/dashboard-coletor/coletas-andamento/ColetasAndamento";
import ColetasFinalizadas from "../../../Components/dashboard-coletor/coletas-finalizadas/ColetasFinalizadas";
import { useState, useEffect } from "react";
import DetalheColetas from "../../../Components/dashboard-coletor/detalhe-coletas/DetalheColetas"
import { Package, Truck, CheckCircle } from "lucide-react";
import Footer from "../../../Components/Footer/footer"
import SelecaoCooperativa from "../../../Components/dashboard-coletor/selecao-cooperativa/SelecaoCooperativa";
import { coletasService } from "../../../services/coletasService";
import type { ColetaResponse } from "../../../types/coleta";
import Swal from "sweetalert2";

interface Coleta {
  id: string;
  material: string;
  quantidade: string;
  peso: string;
  endereco: string;
  distancia?: string;
  data?: string;
  horario?: string;
  status_coleta?: string;
}

function DashboardColetor() {
  const [totalFinalizadas, setTotalFinalizadas] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtro, setFiltro] = useState('disponiveis');
  const [coletaParaModal, setColetaParaModal] = useState<Coleta | null>(null);
  const [coletaIniciada, setColetaIniciada] = useState(false);
  const [loading, setLoading] = useState(false);

  const [listaDisponiveis, setListaDisponiveis] = useState<ColetaResponse[]>([]);
  const [coletasAceitas, setColetasAceitas] = useState<Coleta[]>([]);
  const [historicoFinalizadas, setHistoricoFinalizadas] = useState<Coleta[]>([]);

  const mapearColeta = (coleta: ColetaResponse): Coleta => {
    const dataAgendada = new Date(coleta.data_agendada);
    const materiais = coleta.itens?.map((item: any) => item.residuo?.nome || 'Material').join(', ') || 'Material';
    const quantidadeTotal = coleta.itens?.reduce((acc: number, item: any) => acc + (item.quantidade_estimada || 0), 0) || 0;
    const endereco = coleta.morador?.endereco 
      ? `${coleta.morador.endereco.rua}, ${coleta.morador.endereco.numero} - ${coleta.morador.endereco.bairro}`
      : 'Endereço não informado';

    return {
      id: coleta.id_coleta.toString(),
      material: materiais,
      quantidade: coleta.itens?.length.toString() || '1',
      peso: `${quantidadeTotal}kg`,
      endereco,
      data: dataAgendada.toLocaleDateString('pt-BR'),
      horario: dataAgendada.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status_coleta: coleta.status_coleta
    };
  };

  const carregarColetas = async () => {
    setLoading(true);
    try {
      // Coletas disponíveis
      const disponiveis = await coletasService.obterColetasDisponiveis();
      setListaDisponiveis(disponiveis);

      // Coletas em andamento (dashboard do coletor)
      const andamento = await coletasService.listarParaColetor();
      const coletasMapeadas = andamento.map(mapearColeta);
      setColetasAceitas(coletasMapeadas);

      // Histórico de coletas finalizadas
      const historico = await coletasService.listarFinalizadasColetor();
      const historicoMapeado = historico.map(mapearColeta);
      setHistoricoFinalizadas(historicoMapeado);
      setTotalFinalizadas(historicoMapeado.length);
    } catch (error) {
      console.error('Erro ao carregar coletas:', error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        carregarColetas();
        // Aumentar intervalo para 60 segundos para evitar piscar na tela
        const interval = setInterval(carregarColetas, 60000);
        return () => clearInterval(interval);
    }, []);

  const handleRecusarColeta = (id: string) => {
    // Remove da lista local com feedback visual
    const coletaRemovida = listaDisponiveis.find(item => item.id_coleta.toString() === id);
    
    if (coletaRemovida) {
      Swal.fire({
        title: 'Coleta removida',
        text: 'A coleta foi removida da sua lista de disponíveis.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
      
      setListaDisponiveis(prev => prev.filter(item => item.id_coleta.toString() !== id));
    }
  };

  const handleFinalizarColeta = async (id: string) => {
    try {
      // Primeiro entregar na cooperativa
      await coletasService.entregarNaCooperativa(parseInt(id));
      Swal.fire({
        title: 'Sucesso!',
        text: 'Coleta entregue na cooperativa com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        carregarColetas();
        setMostrarModal(false);
        setColetaIniciada(false);
        setFiltro('finalizadas');
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.response?.data?.message || 'Erro ao finalizar coleta.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleIniciarEntrega = async (id: string) => {
    try {
      await coletasService.iniciarEntrega(parseInt(id));
      Swal.fire({
        title: 'Sucesso!',
        text: 'Entrega iniciada!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        setColetaIniciada(true);
        carregarColetas();
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.response?.data?.message || 'Erro ao iniciar entrega.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleCancelarColeta = (id: string) => {
    Swal.fire({
      title: 'Atenção!',
      text: 'Cancelar coletas não é permitido. Entre em contato com o suporte se necessário.',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
  };

  const [isSelecaoOpen, setIsSelecaoOpen] = useState(false);
  const [coletaPendente, setColetaPendente] = useState<ColetaResponse | null>(null);

  const handleAbrirSelecao = (coleta: ColetaResponse) => {
    // Verificar se já tem coleta em andamento
    if (coletasAceitas.length > 0) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Você já possui uma coleta em andamento! Finalize-a antes de aceitar outra.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    setColetaPendente(coleta);
    setIsSelecaoOpen(true);
  };

  const confirmarSelecao = async (coopId: number) => {
    if (!coletaPendente) return;

    try {
      // Fechar modal imediatamente
      setIsSelecaoOpen(false);
      const coletaAceita = coletaPendente;
      setColetaPendente(null);
      
      await coletasService.aceitarColeta(coletaAceita.id_coleta, coopId);
      
      // Mostrar mensagem de sucesso
      Swal.fire({
        title: 'Sucesso!',
        text: 'Coleta aceita com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        carregarColetas();
        setFiltro('andamento');
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Erro!',
        text: error.response?.data?.message || 'Erro ao aceitar coleta.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
      <NavbarColetor />

      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-cards">
            <div onClick={() => setFiltro('disponiveis')} className={filtro === 'disponiveis' ? 'card-selecionado' : ''}>
              <CardResumo titulo="Disponíveis" valor={listaDisponiveis.length} icon={<Package size={24} />} colorClass="orange" />
            </div>

            <div onClick={() => setFiltro('andamento')} className={filtro === 'andamento' ? 'card-selecionado' : ''}>
              <CardResumo titulo="Em Andamento" valor={coletasAceitas.length} icon={<Truck size={24} />} colorClass="blue" />
            </div>

            <div onClick={() => setFiltro('finalizadas')} className={filtro === 'finalizadas' ? 'card-selecionado' : ''}>
              <CardResumo titulo="Finalizadas" valor={totalFinalizadas} icon={<CheckCircle size={24} />} colorClass="green" />
            </div>
          </div>

          <div className="dashboard-section-wrapper coletas-container">


            {filtro === 'disponiveis' && (
              <div className="animar-entrada">
                <h2 className="titulo-secao">Coletas Disponíveis</h2>
                <ColetasDisponiveis
                  dados={listaDisponiveis}
                  onAceitar={handleAbrirSelecao} 
                  onRecusar={handleRecusarColeta}
                  bloquearBotao={coletasAceitas.length > 0}
                  carregando={loading}
                />
              </div>
            )}


            {filtro === 'andamento' && (
              <div className="animar-entrada">
                <h2 className="titulo-secao andamento">Coletas em Andamento</h2>

                {coletasAceitas.length > 0 ? (
                  <div className="lista-cards-stack">
                    {coletasAceitas.map(item => (
                      <ColetasAndamento
                        key={item.id}
                        coleta={item}
                        status_coleta={item.status_coleta}
                        onFinalizar={() => handleFinalizarColeta(item.id)}
                        onCancelar={() => handleCancelarColeta(item.id)}
                        onVerDetalhes={() => {
                          setColetaParaModal(item);
                          setMostrarModal(true);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="sem-dados">
                    <Truck size={48} color="#cbd5e0" />
                    <p>Nenhuma coleta em andamento.</p>
                  </div>
                )}
              </div>
            )}


            {filtro === 'finalizadas' && (
              <div className="animar-entrada">
                <h2 className="titulo-secao finalizadas">Coletas Finalizadas</h2>
                <ColetasFinalizadas dados={historicoFinalizadas} />
              </div>
            )}
          </div>
        </div>

        {mostrarModal && coletaParaModal && (
          <DetalheColetas
            coleta={coletaParaModal}
            onClose={() => {
              setMostrarModal(false);
              setColetaIniciada(false);
            }}
            onFinalizar={() => handleFinalizarColeta(coletaParaModal.id)}
            onIniciar={() => handleIniciarEntrega(coletaParaModal.id)}
            iniciada={coletaIniciada}
            setIniciada={setColetaIniciada}
          />
        )}
        <SelecaoCooperativa
          isOpen={isSelecaoOpen}
          onClose={() => setIsSelecaoOpen(false)}
          onConfirm={confirmarSelecao}
        />

      </main>
      <Footer />
    </>
  );
}

export default DashboardColetor;