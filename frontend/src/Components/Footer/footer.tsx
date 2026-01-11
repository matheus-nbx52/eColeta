import "./footer.css";
import { MapPin, Mail,Leaf, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-marca">
          <div className="footer-logo">
            <MapPin className="footer-icone-localizacao" />
            <h2>eColeta</h2>
          </div>
          <span className="footer-slogan">Reciclagem na sua porta</span>
          <p className="footer-descricao">
            Conectando pessoas e cooperativas para um futuro mais sustentável.
            Transforme seus resíduos em impacto positivo.
          </p>
          <div className="footer-selo">♻️ Certificado Selo Verde</div>
        </div>

        <div className="footer-links">
          <h4>Informações</h4>
          <ul>
            <li><a href="/faq">Perguntas Frequentes</a></li>
            <li><a href="/privacidade">Política de Privacidade</a></li>
          </ul>
        </div>

        <div className="footer-contato">
          <h4>Contato</h4>
          <div className="footer-contato-wrapper">
            <div className="contato-item">
              <Mail size={18} />
              <span>contato@ecoleta.com.br</span>
            </div>

            <div className="contato-item">
              <Phone size={18} />
              <span>(81) 99636-3918</span>
            </div>

            <div className="contato-item">
              <MapPin size={18} />
              <span>Igarassu, PE</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="footer-divisor" />

      <div className="footer-inferior">
        <p>© 2026 eColeta. Todos os direitos reservados.</p>
      </div>

     <div className="footer-impacto">
        <Leaf size={16} className="footer-icone-impacto" />
        <span>Impacto Positivo — Ajudando a construir um futuro sustentável</span>
      </div>
    </footer>
  );
}