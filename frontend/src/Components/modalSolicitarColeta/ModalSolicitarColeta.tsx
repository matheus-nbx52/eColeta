import './ModalSolicitarColeta.css';
import { X, FileText, CupSoda, Trash2, GlassWater, Smartphone, Droplets } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ModalSolicitarColeta = ({ isOpen, onClose }: ModalProps) => {
    if (!isOpen) return null;

    const materiais = [
        { nome: 'Papel/Papelão', icone: <FileText size={20} color="#9333ea" /> },
        { nome: 'Plástico', icone: <CupSoda size={20} color="#db2777" /> },
        { nome: 'Metal/Latas', icone: <Trash2 size={20} color="#ea580c" /> },
        { nome: 'Vidro', icone: <GlassWater size={20} color="#ca8a04" /> },
        { nome: 'Eletrônicos', icone: <Smartphone size={20} color="#4f46e5" /> },
        { nome: 'Óleo de Cozinha', icone: <Droplets size={20} color="#2563eb" /> },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Solicitar Coleta</h2>
                    <button className="botao-fechar" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="modal-body">
                    <div className="campo-grupo">
                        <label>Endereço da Coleta</label>
                        <input type="text" placeholder="Rua das Flores, 123" />
                    </div>

                    <div className="campo-grupo">
                        <label>Tipos de Material</label>
                        <div className="grade-materiais">
                            {materiais.map((item, index) => (
                                <div key={index} className="item-material">
                                    <input type="checkbox" id={`mat-${index}`} />
                                    <label htmlFor={`mat-${index}`}>
                                        {item.icone}
                                        <span>{item.nome}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="campo-grupo">
                        <label>Peso Estimado (kg)</label>
                        <input type="text" placeholder="Ex: 5.5" />
                    </div>

                    <div className="campo-grupo">
                        <label>Horário Preferido</label>
                        <select>
                            <option>Selecione um horário</option>
                            <option>Manhã (08:00 - 12:00)</option>
                            <option>Tarde (13:00 - 18:00)</option>
                        </select>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="botao-cancelar" onClick={onClose}>Cancelar</button>
                    <button className="botao-enviar" onClick={onClose}>Enviar Solicitação</button>
                </div>
            </div>
        </div>
    );
};

export default ModalSolicitarColeta;