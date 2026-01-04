import { useState } from 'react';
import './ModalSolicitarColeta.css';

interface Coleta {
    id: string;
    material: string;
    quantidade: string;
    status: 'Pendente' | 'Em Coleta' | 'Coletado';
    data: string;
    peso: number;
}

interface Usuario {
    id: string;
    historico: Coleta[];
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalSolicitarColeta({ isOpen, onClose }: ModalProps) {
    const [material, setMaterial] = useState('');
    const [quantidade, setQuantidade] = useState('');

    if (!isOpen) return null;

    const handleSalvarSolicitacao = () => {
        if (!material || !quantidade) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const idLogado = localStorage.getItem('usuarioLogadoId');
        const usuariosRaw = localStorage.getItem('usuarios');

        if (idLogado && usuariosRaw) {
           
            const usuarios: Usuario[] = JSON.parse(usuariosRaw);
            
            const novaColeta: Coleta = {
                id: Date.now().toString(),
                material: material,
                quantidade: quantidade,
                status: 'Pendente',
                data: new Date().toLocaleDateString('pt-BR'),
                peso: 0
            };

            const usuariosAtualizados = usuarios.map((user: Usuario) => {
                if (user.id === idLogado) {
                    return {
                        ...user,
                        historico: [...(user.historico || []), novaColeta]
                    };
                }
                return user;
            });

            localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
            
    
            setMaterial('');
            setQuantidade('');
            
            alert("Solicitação enviada com sucesso!");
            onClose(); 
        } else {
            alert("Erro: Usuário não encontrado. Tente fazer login novamente.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-conteudo">
                <div className="modal-header">
                    <h2>Nova Solicitação de Coleta</h2>
                    <button className="fechar-x" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="campo-grupo">
                        <label>Tipo de Material</label>
                        <select 
                            value={material} 
                            onChange={(e) => setMaterial(e.target.value)}
                            className="modal-input"
                        >
                            <option value="">Selecione o material...</option>
                            <option value="Plástico">Plástico</option>
                            <option value="Papel/Papelão">Papel / Papelão</option>
                            <option value="Vidro">Vidro</option>
                            <option value="Metal">Metal</option>
                            <option value="Eletrônico">Resíduo Eletrônico</option>
                        </select>
                    </div>

                    <div className="campo-grupo">
                        <label>Quantidade/Volume</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 2 sacos grandes ou 5kg"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            className="modal-input"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secundario" onClick={onClose}>Cancelar</button>
                    <button className="btn-primario" onClick={handleSalvarSolicitacao}>Confirmar Solicitação</button>
                </div>
            </div>
        </div>
    );
}