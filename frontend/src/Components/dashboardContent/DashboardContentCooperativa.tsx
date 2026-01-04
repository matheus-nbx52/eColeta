import "./DashBoardContentCooperativa.css";
import { Package, Scale, BarChart3, Calendar } from "lucide-react";

export default function DashBoardContentCooperativa() {
  return (
    <div className="corpo-painel-coop">
      <div className="grade-metricas">
        <div className="cartao-metrica">
          <div className="icone-fundo-verde"><Package size={24} /></div>
          <div className="textos-metrica">
            <span>Total de Coletas</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="cartao-metrica">
          <div className="icone-fundo-azul"><Scale size={24} /></div>
          <div className="textos-metrica">
            <span>Material Recebido</span>
            <strong>0.0 kg</strong>
          </div>
        </div>

        <div className="cartao-metrica">
          <div className="icone-fundo-laranja"><BarChart3 size={24} /></div>
          <div className="textos-metrica">
            <span>Tipos de Material</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="cartao-metrica">
          <div className="icone-fundo-roxo"><Calendar size={24} /></div>
          <div className="textos-metrica">
            <span>Este Mês</span>
            <strong>0</strong>
          </div>
        </div>
      </div>

      <div className="quadro-principal">
        <h3 className="titulo-secao">Materiais Recebidos por Tipo</h3>
        
        <div className="container-vazio">
          <div className="circulo-icone-caixa">
             <Package size={45} />
          </div>
          <p className="mensagem-vazia">Nenhum material recebido ainda</p>
        </div>
      </div>
    </div>
  );
}