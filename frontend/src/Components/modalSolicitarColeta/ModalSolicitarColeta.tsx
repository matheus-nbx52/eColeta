import { useState } from 'react';
import {
  FileText, CupSoda, Box, Wine, Smartphone,
  Droplets, Clock, Calendar as CalendarIcon
} from 'lucide-react';
import './ModalSolicitarColeta.css';
import Swal from "sweetalert2";
import { coletasService } from '../../services/coletasService';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ModalSolicitarColeta({ isOpen, onClose, onSuccess }: ModalProps) {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [peso, setPeso] = useState('');
  const [dataColeta, setDataColeta] = useState('');
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async () => {
    if (!cep || !rua || !peso || !dataColeta || !horario || materiaisSelecionados.length === 0) {
      Swal.fire({
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos e selecione pelo menos um tipo de material.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      setCarregando(true);
      
      // Mapear nomes de materiais para os IDs do backend
      const mapaResiduo: { [key: string]: number } = {
        'Papel': 1,
        'Plástico': 2,
        'Metal': 3,
        'Vidro': 4,
        'Eletrônicos': 5,
        'Óleo': 6
      };

      // Combinar data e horário
      const dataHora = new Date(`${dataColeta}T${horario}:00`);
      const dataAgendada = dataHora.toISOString();

      const itens = materiaisSelecionados.map(nome => ({
        fk_residuo: mapaResiduo[nome] || 1,
        quantidade: parseFloat(peso) || 0
      }));

      const payload = {
        data_agendada: dataAgendada,
        observacoes: observacoes || '',
        itens: itens
      };

      await coletasService.criarColeta(payload);
      
      // Limpar formulário
      setCep('');
      setRua('');
      setBairro('');
      setCidade('');
      setEstado('');
      setPeso('');
      setDataColeta('');
      setHorario('');
      setObservacoes('');
      setMateriaisSelecionados([]);
      
      // Fechar modal imediatamente
      onClose();
      
      // Mostrar mensagem de sucesso
      Swal.fire({
        title: 'Solicitação Enviada!',
        text: 'Obrigado por colaborar com o meio ambiente. Acompanhe o status no seu histórico.',
        icon: 'success',
        confirmButtonText: 'Entendido'
      }).then(() => {
        if (onSuccess) onSuccess();
      });
    } catch (error: any) {
      console.error('Erro ao criar coleta:', error);
      Swal.fire({
        title: 'Erro!',
        text: error.response?.data?.message || 'Erro ao solicitar coleta. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setCarregando(false);
    }
  };


  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setRua(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (error) {
        console.error('Erro no CEP', error);
      }
    }
  };

  if (!isOpen) return null;

  const listaMateriais = [
    { id: 'papel', nome: 'Papel', icone: <FileText size={20} />, cor: '#A78BFA' },
    { id: 'plastico', nome: 'Plástico', icone: <CupSoda size={20} />, cor: '#F472B6' },
    { id: 'metal', nome: 'Metal', icone: <Box size={20} />, cor: '#F87171' },
    { id: 'vidro', nome: 'Vidro', icone: <Wine size={20} />, cor: '#4ADE80' },
    { id: 'eletronicos', nome: 'Eletrônicos', icone: <Smartphone size={20} />, cor: '#6366F1' },
    { id: 'oleo', nome: 'Óleo', icone: <Droplets size={20} />, cor: '#0EA5E9' },
  ];

  const toggleMaterial = (nome: string) => {
    setMateriaisSelecionados(prev =>
      prev.includes(nome)
        ? prev.filter(m => m !== nome)
        : [...prev, nome]
    );
  };

  return (
    <div className="modal-overlay-morador">
      <div className="modal-container-refinado">
        <div className="modal-scroll-area">

          <div className="grid-duplo-endereco">
            <div className="campo-grupo">
              <label className="label-teal">CEP</label>
              <input
                type="text" placeholder='00000-000'
                className="input-custom"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={handleCepBlur}
              />
            </div>

            <div className="campo-grupo">
              <label className="label-teal">Estado</label>
              <input type="text" className="input-custom" value={estado} readOnly />
            </div>
          </div>

          <div className="campo-grupo">
            <label className="label-teal">Rua e Número</label>
            <input
              type="text"
              className="input-custom"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
          </div>

          <div className="grid-duplo-endereco">
            <div className="campo-grupo">
              <label className="label-teal">Bairro</label>
              <input
                type="text"
                className="input-custom"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            <div className="campo-grupo">
              <label className="label-teal">Cidade</label>
              <input type="text" className="input-custom" value={cidade} readOnly />
            </div>
          </div>

          <div className="campo-grupo">
            <label className="label-teal">
              Tipos de Material ({materiaisSelecionados.length})
            </label>

            <div className="grid-materiais-colorida">
              {listaMateriais.map(m => (
                <div
                  key={m.id}
                  className={`card-material-vibrante ${materiaisSelecionados.includes(m.nome) ? 'active' : ''}`}
                  onClick={() => toggleMaterial(m.nome)}
                >
                  <span style={{ color: m.cor }}>{m.icone}</span>
                  <span>{m.nome}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-duplo-endereco">
            <div className="campo-grupo">
              <label className="label-teal">Peso Estimado (kg)</label>
              <input
                type="text" placeholder='5.5'
                className="input-custom"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
            </div>

            <div className="campo-grupo">
              <label className="label-teal">Data</label>
              <div className="input-wrapper-icon">
                <input
                  type="date"
                  className="input-custom"
                  value={dataColeta}
                  onChange={(e) => setDataColeta(e.target.value)}
                />
                <CalendarIcon size={18} className="icon-absolute" />
              </div>
            </div>
          </div>

          <div className="campo-grupo">
            <label className="label-teal">Horário</label>
            <div className="input-wrapper-icon">
              <select
                className="input-custom"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                disabled={carregando}
              >
                <option value="">Selecione</option>
                {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
                  .map(h => <option key={h} value={h}>{h}</option>)}
              </select>
              <Clock size={18} className="icon-absolute" />
            </div>
          </div>

          <div className="campo-grupo">
            <label className="label-teal">Observações (opcional)</label>
            <textarea
              className="input-custom"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais sobre a coleta..."
              rows={3}
              disabled={carregando}
            />
          </div>
        </div>

        <div className="modal-btns-footer">
          <button className="btn-cancel-border" onClick={onClose} disabled={carregando}>
            Cancelar
          </button>

          <button className="btn-submit-solid" onClick={handleSubmit} disabled={carregando}>
            {carregando ? 'Enviando...' : 'Solicitar Coleta'}
          </button>
        </div>
      </div>
    </div>
  );
}
