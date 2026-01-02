import { useNavigate } from "react-router-dom";
import "./PerfilColetor.css";

function PerfilColetor() {
  const navigate = useNavigate();

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
            <h1>Carlos Santos</h1>
            <p>Coletor Profissional</p>
            <span>Membro desde Janeiro 2024</span>
          </div>
        </header>

        
        <main className="perfil-content-box">
          
          
          <div className="stats-row">
            <div className="stat-card">
              <div className="icon-circle green-bg">📦</div>
              <strong>0</strong>
              <p>Coletas Realizadas</p>
            </div>
            <div className="stat-card">
              <div className="icon-circle blue-bg">📈</div>
              <strong>0.0 kg</strong>
              <p>Material Coletado</p>
            </div>
          </div>

          <hr className="divider" />

          
          <section className="personal-data">
            <h3 className="data-title-centered">Dados Pessoais</h3>
            <div className="data-grid-centered">
              <div className="data-item">
                <label>📧 Email</label>
                <p>carlos.santos@email.com</p>
              </div>
              <div className="data-item">
                <label>📞 Telefone</label>
                <p>(11) 98765-4321</p>
              </div>
              <div className="data-item">
                <label>🆔 CPF</label>
                <p>123.456.789-00</p>
              </div>
              <div className="data-item">
                <label>📍 Localização</label>
                <p>São Paulo, SP</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PerfilColetor;