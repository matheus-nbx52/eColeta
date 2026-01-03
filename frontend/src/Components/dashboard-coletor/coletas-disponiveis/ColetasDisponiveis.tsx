import "./ColetasDisponiveis.css";
import { Check, X } from 'lucide-react';
import { useState, useEffect } from "react";

function ColetasDisponiveis() {
  const [coletas, setColetas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    const buscarColetas = async () => {
      try {
        setCarregando(true);
        const dadosFalsos = [
          {
            id: 1,
            material: "Papel e Plástico",
            peso: "5kg",
            endereco: "Rua das Flores, 123",
            data: "20/09/2025",
            horario: "14:00"
          },
          {
            id: 2,
            material: "Vidro",
            peso: "12kg",
            endereco: "Av. Central, 456",
            data: "22/09/2025",
            horario: "14:00"
          }
        ];
        
        setColetas(dadosFalsos);
      } catch (error) {
        console.error("Erro ao conectar com o backend:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarColetas();
  }, []);

  
  const handleAceitar = async (id: number) => {
    console.log(`Enviando para o backend: Coleta ${id} aceita`);
    setColetas(coletas.filter(coleta => coleta.id !== id));
  };

  const handleRecusar = (id: number) => {
    console.log(`Enviando para o backend: Coleta ${id} recusada`);
    setColetas(coletas.filter(coleta => coleta.id !== id));
  };

  if (carregando) {
    return <div className="loading">Carregando coletas disponíveis...</div>;
  }

  return (
    <div className="coletas-container">
      <h2 className="titulo-secao">Coletas disponíveis</h2>
      
      {coletas.length > 0 ? (
        coletas.map((coleta) => (
          <div className="coleta-card" key={coleta.id}>
            <div className="coleta-info">
              <div><strong>Material:</strong> {coleta.material}</div>
              <div><strong>Peso est. (Kg):</strong> {coleta.peso}</div>
              <div><strong>Endereço:</strong> {coleta.endereco}</div>
              <div><strong>Data:</strong> {coleta.data}</div>
              <div><strong>Horário:</strong> {coleta.horario}</div>
            </div>
            
            <div className="coleta-actions">
              <button 
                className="btn-aceitar" 
                onClick={() => handleAceitar(coleta.id)}
              >
                <Check size={18} /> Aceitar
              </button>
              <button 
                className="btn-recusar" 
                onClick={() => handleRecusar(coleta.id)}
              >
                <X size={18} /> Recusar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="sem-coletas">Nenhuma coleta disponível no momento.</p>
      )}
    </div>
  );
}

export default ColetasDisponiveis;