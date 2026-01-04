import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; 
import "./PerfilColetor.css";

function PerfilColetor() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDadosPerfil = async () => {
      try {
        setCarregando(true);
        const dadosSimulados = {
          nome: "Carlos Santos",
          cargo: "Coletor Profissional",
          dataAdesao: "Janeiro 2026",
          coletasRealizadas: 15,
          pesoTotal: 125.5,
          email: "carlos.santos@email.com",
          telefone: "(11) 98765-4321",
          cpf: "123.456.789-00",
          localizacao: "São Paulo, SP"
        };

        await new Promise(resolve => setTimeout(resolve, 1000));

        setUsuario(dadosSimulados);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosPerfil();
  }, []);

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
               <span className="user-icon-svg">👤</span>
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
              <div className="icon-circle green-bg">📦</div>
              <strong>{usuario.coletasRealizadas}</strong>
              <p>Coletas Realizadas</p>
            </div>
            <div className="stat-card">
              <div className="icon-circle blue-bg">📈</div>
              <strong>{usuario.pesoTotal} kg</strong>
              <p>Material Coletado</p>
            </div>
          </div>

          <hr className="divider" />

          <section className="personal-data">
            <h3 className="data-title-centered">Dados Pessoais</h3>
            <div className="data-grid-centered">
              <div className="data-item">
                <label>📧 Email</label>
                <p>{usuario.email}</p>
              </div>
              <div className="data-item">
                <label>📞 Telefone</label>
                <p>{usuario.telefone}</p>
              </div>
              <div className="data-item">
                <label>🆔 CPF</label>
                <p>{usuario.cpf}</p>
              </div>
              <div className="data-item">
                <label>📍 Localização</label>
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