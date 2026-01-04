import "./MateriaisAceitos.css";
import { FileText, Milk, Container, GlassWater, Monitor, Droplets } from "lucide-react";

const dicionarioMateriais = {
  papel: { nome: "Papel/Papelão", icone: <FileText size={28} /> },
  plastico: { nome: "Plástico", icone: <Milk size={28} /> },
  metal: { nome: "Metal/Latas", icone: <Container size={28} /> },
  vidro: { nome: "Vidro", icone: <GlassWater size={28} /> },
  eletronicos: { nome: "Eletrônicos", icone: <Monitor size={28} /> },
  oleo: { nome: "Óleo de Cozinha", icone: <Droplets size={28} /> },
};

interface MateriaisProps {
  materiaisSelecionados: string[];
}

export default function MateriaisAceitos({ materiaisSelecionados }: MateriaisProps) {
  return (
    <div className="secao-materiais-laranja">
      <h4 className="titulo-materiais">Materiais Aceitos pela Cooperativa</h4>
      <div className="grade-cards-materiais">
        {materiaisSelecionados.map((chave) => {
          const item = dicionarioMateriais[chave as keyof typeof dicionarioMateriais];
          if (!item) return null;

          return (
            <div key={chave} className="cartao-material-item">
              <div className="circulo-branco-icone">
                <div className="icone-laranja">
                    {item.icone}
                </div>
              </div>
              <span className="texto-material">{item.nome}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}