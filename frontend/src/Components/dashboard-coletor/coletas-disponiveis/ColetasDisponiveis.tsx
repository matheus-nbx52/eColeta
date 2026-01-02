import "./ColetasDisponiveis.css";

function ColetasDisponiveis() {
  return (
    

    <div className="coletas-container">
      <h2>Coletas disponíveis</h2>

      <div className="coleta-card">
        <div>
          <strong>Material:</strong> Papel e Plástico
        </div>
        <div>
          <strong>Endereço:</strong> Rua das Flores, 123
        </div>
        <div>
          <strong>Data:</strong> 20/09/2025
        </div>

        <button className="btn-coleta">Ver detalhes</button>
      </div>

      <div className="coleta-card">
        <div>
          <strong>Material:</strong> Vidro
        </div>
        <div>
          <strong>Endereço:</strong> Av. Central, 456
        </div>
        <div>
          <strong>Data:</strong> 22/09/2025
        </div>

        <button className="btn-coleta">Ver detalhes</button>
      </div>
    </div>
  );
}

export default ColetasDisponiveis;
