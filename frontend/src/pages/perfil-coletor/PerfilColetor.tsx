import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; 
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import { coletasService } from "../../services/coletasService";
import type { ColetaResponse } from "../../types/coleta";
import "./PerfilColetor.css";
import {  User,  Mail, Phone, IdCard, MapPin, Package, TrendingUp } from "lucide-react";

function PerfilColetor() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        setCarregando(true);
        
        const perfilResponse = await api.get('/ecoletor/perfil');
        const ecoletor = perfilResponse.data.ecoletor;
        
        const coletasAndamento = await coletasService.listarParaColetor();
        const coletasFinalizadas = await coletasService.listarFinalizadasColetor();
        
        const todasColetas = [...coletasAndamento, ...coletasFinalizadas];
        
        const pesoTotal = todasColetas.reduce((acc: number, coleta: ColetaResponse) => {
          return acc + (coleta.peso_kg || 0);
        }, 0);

        const dadosReais = {
          nome: ecoletor.nome || "Coletor",
          cargo: "Coletor Profissional",
          dataAdesao: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          coletasRealizadas: todasColetas.length,
          pesoTotal: pesoTotal,
          email: ecoletor.email || "Não informado",
          telefone: ecoletor.telefone || "Não informado",
          cpf: ecoletor.cpf || "Não informado",
          localizacao: ecoletor.localizacao || "Não informado"
        };

        setUsuario(dadosReais);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setUsuario({
          nome: authUser?.nome || "Coletor",
          cargo: "Coletor Profissional",
          dataAdesao: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
          coletasRealizadas: 0,
          pesoTotal: 0,
          email: authUser?.email || "Não informado",
          telefone: authUser?.telefone || "Não informado",
          cpf: "Não informado",
          localizacao: "Não informado"
        });
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosPerfil();
  }, [authUser]);

  if (carregando) return <div className="perfil-page">Carregando perfil...</div>;
  if (!usuario) return <div className="perfil-page">Erro ao carregar dados.</div>;

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <button className="btn-voltar" onClick={() => navigate("/dashboard-coletor")}>
          ← Voltar ao Dashboard
        </button>

        <header className="perfil-header-card">
          <div className="avatar-section">
            <div className="avatar-placeholder">
              <User size={48} color="#00897b" />
            </div>
          </div>
          <div className="user-details">
            <h1>{usuario.nome}</h1>
            <p>{usuario.cargo}</p>
            <span>Membro desde {usuario.dataAdesao}</span>
          </div>
        </header>

        <main className="perfil-content-box">
          <div className="stats-row">
            <div className="stat-card">
              <div className="icon-circle green-bg"><Package size={24} color="#00897b" /></div>
              <strong>{usuario.coletasRealizadas}</strong>
              <p>Coletas Realizadas</p>
            </div>
            <div className="stat-card">
              <div className="icon-circle blue-bg"><TrendingUp size={24} color="#2196f3" /></div>
              <strong>{usuario.pesoTotal} kg</strong>
              <p>Material Coletado</p>
            </div>
          </div>

          <hr className="divider" />

          <section className="personal-data">
            <h3 className="data-title-centered">Dados Pessoais</h3>
            <div className="data-grid-centered">
              <div className="data-item">
                <label><Mail size={16} /> Email</label>
                <p>{usuario.email}</p>
              </div>
              <div className="data-item">
                <label><Phone size={16} /> Telefone</label>
                <p>{usuario.telefone}</p>
              </div>
              <div className="data-item">
                <label><IdCard size={16} /> CPF</label>
                <p>{usuario.cpf}</p>
              </div>
              <div className="data-item">
                <label><MapPin size={16} /> Localização</label>
                <p>{usuario.localizacao}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PerfilColetor;