import "./CardResumo.css"

type CardResumoColetorProps = {
  titulo: string;
  valor: string | number;
  icon: React.ReactNode
  colorClass: string
};

function CardResumo({ titulo, valor, icon, colorClass }: CardResumoColetorProps) {
  return (
    <div className="card-resumo">
      <div className={`card-icon ${colorClass}`}>{icon}</div>
      <div className="card-text">
        <p>{titulo}</p>
        <h3>{valor}</h3>
      </div>
    </div>
  );
}
export default CardResumo;