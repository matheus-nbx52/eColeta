import React, { useState, useEffect } from 'react';
import {
    Mail, Phone, CreditCard, User, MapPin, Package, TrendingUp,
    Trophy, Medal, ArrowLeft, Gift, Leaf, Globe, Target, Shield, Zap, Star, Award, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { coletasService } from '../../services/coletasService';
import type { ColetaResponse } from '../../types/coleta';
import './PerfilMorador.css';

const PerfilMorador: React.FC = () => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const [carregando, setCarregando] = useState(true);
    const [dadosPerfil, setDadosPerfil] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        cep: '',
        endereco: '',
        saldo: 0
    });
    const [stats, setStats] = useState({
        coletasRealizadas: 0,
        totalKg: 0,
        pontos: 0,
        conquistas: 0
    });

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setCarregando(true);
                
                const perfilResponse = await api.get('/morador/perfil');
                const morador = perfilResponse.data.morador;
                
                if (!morador) {
                    setCarregando(false);
                    return;
                }
                
                let enderecoFormatado = '';
                let cepFormatado = '';
                
                if (morador.endereco) {
                    if (typeof morador.endereco === 'object') {
                        const end = morador.endereco as any;
                        cepFormatado = end.cep || '';
                        const partes = [
                            end.rua,
                            end.numero ? `, ${end.numero}` : '',
                            end.complemento ? ` - ${end.complemento}` : '',
                            end.bairro ? `, ${end.bairro}` : '',
                            end.cidade ? `, ${end.cidade}` : '',
                            end.estado ? ` - ${end.estado}` : ''
                        ].filter(Boolean);
                        enderecoFormatado = partes.join('');
                    } else {
                        enderecoFormatado = morador.endereco;
                        cepFormatado = morador.cep || '';
                    }
                }
                
                setDadosPerfil({
                    nome: morador.nome || '',
                    email: morador.email || '',
                    telefone: morador.telefone || '',
                    cpf: morador.cpf || '',
                    cep: cepFormatado,
                    endereco: enderecoFormatado,
                    saldo: morador.saldo || 0
                });

                try {
                    const coletas = await coletasService.listarPorMorador();
                    
                    const coletasValidadas = coletas.filter((c: ColetaResponse) => 
                        c.status_coleta === 'Entregue_Coop' || 
                        c.status_coleta === 'Concluido' || 
                        c.status_coleta === 'VALIDADA' || 
                        c.status_coleta === 'Validada'
                    );

                    const totalKg = coletasValidadas.reduce((acc: number, c: ColetaResponse) => {
                        return acc + (c.peso_kg || 0);
                    }, 0);

                    let conquistas = 0;
                    if (coletasValidadas.length > 0) conquistas++;
                    if (coletasValidadas.length >= 5) conquistas++;
                    if (totalKg >= 10) conquistas++;
                    if (totalKg >= 50) conquistas++;
                    if (totalKg >= 100) conquistas++;
                    if (coletasValidadas.length >= 10) conquistas++;
                    if (morador.saldo >= 1000) conquistas++;
                    if (coletasValidadas.length >= 20) conquistas++;

                    setStats({
                        coletasRealizadas: coletasValidadas.length,
                        totalKg: totalKg,
                        pontos: morador.saldo || 0,
                        conquistas: conquistas
                    });
                } catch (errorColetas) {
                    console.error('Erro ao carregar coletas:', errorColetas);
                    setStats({
                        coletasRealizadas: 0,
                        totalKg: 0,
                        pontos: morador.saldo || 0,
                        conquistas: 0
                    });
                }
            } catch (error: any) {
                console.error('Erro ao carregar dados do perfil:', error);
                setDadosPerfil({
                    nome: authUser?.nome || 'Morador',
                    email: authUser?.email || '',
                    telefone: authUser?.telefone || '',
                    cpf: '',
                    cep: '',
                    endereco: '',
                    saldo: 0
                });
                setStats({
                    coletasRealizadas: 0,
                    totalKg: 0,
                    pontos: 0,
                    conquistas: 0
                });
            } finally {
                setCarregando(false);
            }
        };

        if (authUser) {
            carregarDados();
        } else {
            setCarregando(false);
        }
    }, [authUser]);

    if (carregando) {
        return (
            <div className="perfil-app-container" style={{ minHeight: '100vh', width: '100%' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p>Carregando perfil...</p>
                </div>
            </div>
        );
    }

    const nomeExibicao = dadosPerfil.nome || authUser?.nome || 'Morador';
    const dataAdesao = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    return (
        <div className="perfil-app-container">

            <div className="perfil-card-branco">
                <button className="btn-voltar-perfil" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Voltar
                </button>

                <header className="perfil-header-azul">
                    <div className="header-info">
                        <div className="avatar-box">
                            <User size={40} color="#3b82f6" />
                        </div>
                        <div className="usuario-texto">
                            <h1>{nomeExibicao}</h1>
                            <p>Morador eColeta</p>
                            <span>Membro desde {dataAdesao}</span>
                        </div>
                    </div>
                </header>

                <div className="stats-resumo-grid">
                    <div className="stat-item">
                        <div className="icon-circle icon-verde"><Package size={22} /></div>
                        <strong>{stats.coletasRealizadas}</strong>
                        <span>Coletas Realizadas</span>
                    </div>
                    <div className="stat-item">
                        <div className="icon-circle icon-azul"><TrendingUp size={22} /></div>
                        <strong>{stats.totalKg.toFixed(1)} kg</strong>
                        <span>Reciclado</span>
                    </div>
                    <div className="stat-item">
                        <div className="icon-circle icon-laranja"><Trophy size={22} /></div>
                        <strong>{stats.pontos}</strong>
                        <span>Pontos</span>
                    </div>
                    <div className="stat-item">
                        <div className="icon-circle icon-roxo"><Medal size={22} /></div>
                        <strong>{stats.conquistas}/8</strong>
                        <span>Conquistas</span>
                    </div>
                </div>

                <section className="secao-interna-dados">
                    <h2 className="titulo-secao-verde">Dados Pessoais</h2>
                    <div className="dados-pessoais-grid">
                        <div className="dado-bloco">
                            <label><Mail size={14} /> Email</label>
                            <p>{dadosPerfil.email || 'Não informado'}</p>
                        </div>
                        <div className="dado-bloco">
                            <label><Phone size={14} /> Telefone</label>
                            <p>{dadosPerfil.telefone || 'Não informado'}</p>
                        </div>
                        <div className="dado-bloco">
                            <label><CreditCard size={14} /> CPF</label>
                            <p>{dadosPerfil.cpf || 'Não informado'}</p>
                        </div>
                        <div className="dado-bloco">
                            <label><MapPin size={14} /> CEP</label>
                            <p>{dadosPerfil.cep || 'Não informado'}</p>
                        </div>
                    </div>
                    <div className="endereco-destaque">
                        <label><MapPin size={14} /> Endereço Principal</label>
                        <p>{dadosPerfil.endereco || 'Não informado'}</p>
                    </div>
                </section>
            </div>

            <div className="perfil-card-laranja">
                <div className="pontos-topo">
                    <div className="icon-bg-branco"><Gift size={24} color="#f59e0b" /></div>
                    <div>
                        <h3>Sistema de Pontos</h3>
                        <p>Ganhe 10 pontos por kg reciclado</p>
                    </div>
                </div>
                <div className="pontos-valores-grid">
                    <div className="valor-box"><span>Pontos Disponíveis</span><strong>{stats.pontos}</strong></div>
                    <div className="valor-box"><span>Pontos Ganhos</span><strong>{stats.pontos}</strong></div>
                    <div className="valor-box"><span>Pontos Resgatados</span><strong>0</strong></div>
                </div>
                <div className="historico-recente-area">
                    <div className="historico-label"><Target size={16} /> Histórico Recente</div>
                    <div className="lista-atividades">
                        <div className="atividade-row">
                            <div><p>Desconto Supermercado</p><span>15/01/2024</span></div>
                            <span className="badge-pts badge-negativo">-100 pts</span>
                        </div>
                        <div className="atividade-row">
                            <div><p>Coleta de 5kg</p><span>10/01/2024</span></div>
                            <span className="badge-pts badge-positivo">+50 pts</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="perfil-card-branco secao-conquistas">
                <div className="titulo-conquistas">
                    <Medal size={20} color="#0b7a33" />
                    <h3>Conquistas Ambientais</h3>
                </div>

                <div className="conquistas-grid">
                   
                    <div className={`conquista-item ${stats.coletasRealizadas > 0 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Target color="#ec4899" size={20} /></div>
                        <div><h4>Primeira Coleta</h4><p>Realize sua primeira coleta</p></div>
                    </div>
                    
                    <div className={`conquista-item ${stats.totalKg >= 10 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Leaf color="#84cc16" size={20} /></div>
                        <div><h4>Eco Iniciante</h4><p>Recicle 10kg de materiais</p></div>
                    </div>
                    
                    <div className={`conquista-item ${stats.coletasRealizadas >= 5 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Trophy color="#cd7f32" size={20} /></div>
                        <div><h4>Reciclador Bronze</h4><p>Realize 5 coletas</p></div>
                    </div>
                 
                    <div className={`conquista-item ${stats.totalKg >= 50 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Globe color="#3b82f6" size={20} /></div>
                        <div><h4>Guardião do Planeta</h4><p>Recicle 50kg de materiais</p></div>
                    </div>
                  
                    <div className={`conquista-item ${stats.coletasRealizadas >= 10 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Zap color="#f59e0b" size={20} /></div>
                        <div><h4>Super Eficiente</h4><p>10 coletas realizadas</p></div>
                    </div>
                    
                    <div className={`conquista-item ${stats.pontos >= 1000 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Star color="#a855f7" size={20} /></div>
                        <div><h4>Doador Master</h4><p>Acumule 1000 pontos</p></div>
                    </div>
                  
                    <div className={`conquista-item ${stats.coletasRealizadas >= 20 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Shield color="#06b6d4" size={20} /></div>
                        <div><h4>Eco Protetor</h4><p>Complete 20 coletas</p></div>
                    </div>
                    
                    <div className={`conquista-item ${stats.totalKg >= 100 ? 'ativa' : 'inativa'}`}>
                        <div className="conquista-icon"><Award color="#ef4444" size={20} /></div>
                        <div><h4>Herói da Natureza</h4><p>Recicle 100kg no total</p></div>
                    </div>
                </div>

                <div className="progresso-geral-footer">
                    <div className="progresso-topo">
                        <span>Progresso Geral</span>
                        <strong>{Math.round((stats.conquistas / 8) * 100)}%</strong>
                    </div>
                    <div className="barra-progresso-container">
                        <div className="barra-preenchimento" style={{ width: `${(stats.conquistas / 8) * 100}%` }}></div>
                    </div>
                    <span className="legenda-progresso">{stats.conquistas} de 8 conquistas desbloqueadas</span>
                </div>
            </div>
        </div>
    );
};

export default PerfilMorador;