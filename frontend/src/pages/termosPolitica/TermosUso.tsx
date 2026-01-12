import './PoliticaPrivacidade.css'; 

export default function TermosUso() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">Termos de Uso</h1>
        <span className="legal-date">Última atualização: 12 de Janeiro de 2026</span>

        <section className="legal-section">
          <h2 className="legal-subtitle">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar a plataforma <strong>eColeta</strong>, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-subtitle">2. Descrição do Serviço</h2>
          <p>
            O eColeta é uma plataforma tecnológica que facilita o contato entre cidadãos (Moradores) que desejam descartar resíduos recicláveis e profissionais da coleta (Coletores/Empresas). O eColeta não realiza a coleta diretamente, funcionando apenas como ponte de conexão.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-subtitle">3. Responsabilidades do Usuário</h2>
          <ul className="legal-list">
            <li><strong>Morador:</strong> Compromete-se a entregar materiais limpos, separados e no local indicado no momento do agendamento.</li>
            <li><strong>Coletor:</strong> Compromete-se a cumprir os horários aceitos e dar a destinação ambientalmente correta aos resíduos.</li>
            <li><strong>Conduta:</strong> É proibido o uso da plataforma para fins ilícitos ou que violem a privacidade de outros usuários.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-subtitle">4. Limitação de Responsabilidade</h2>
          <p>
            O eColeta não se responsabiliza por quaisquer danos, perdas ou incidentes decorrentes da interação direta entre Moradores e Coletores. Recomendamos sempre o uso da plataforma em locais seguros e a conferência mútua de dados.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-subtitle">5. Alterações nos Termos</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. Alterações entrarão em vigor imediatamente após sua publicação no site.
          </p>
        </section>

        <button className="legal-btn-voltar" onClick={() => window.close()}>
          Fechar Documento
        </button>
      </div>
    </div>
  );
}