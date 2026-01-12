import './PoliticaPrivacidade.css';

export default function PoliticaPrivacidade() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">Política de Privacidade</h1>
        <span className="legal-date">Última atualização: 12 de Janeiro de 2026</span>

        <section className="legal-section">
          <p>
            A sua privacidade é importante para nós. É política do <strong>eColeta</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site eColeta.
          </p>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
          </p>
          <p>
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Protegemos seus dados dentro de meios comercialmente aceitáveis para evitar perdas e roubos.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-subtitle">Compromisso do Usuário</h2>
          <p>O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o eColeta oferece:</p>
          <ul className="legal-list">
            <li><strong>A)</strong> Não se envolver em atividades ilegais ou contrárias à boa fé.</li>
            <li><strong>B)</strong> Não difundir conteúdo racista, xenofóbico ou apologia ao terrorismo.</li>
            <li><strong>C)</strong> Não causar danos aos sistemas de hardware e software do eColeta.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-subtitle">Mais informações</h2>
          <p>
            Se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados para garantir a interação com os recursos do nosso site.
          </p>
        </section>

        <button className="legal-btn-voltar" onClick={() => window.close()}>
          Fechar Documento
        </button>
      </div>
    </div>
  );
}