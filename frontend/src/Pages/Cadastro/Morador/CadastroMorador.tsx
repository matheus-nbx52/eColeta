import "./CadastroMorador.css"
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock } from "react-icons/fa";

function CadastroMorador() {
    return (
        <div className="cadastro-page">
            <div className="cadastro-card">

                <h2>Cadastro de morador</h2>
                <p className="subtitle">Preencha seus dados para solicitar coletas</p>
                <form className="cadastro-form">
                    <div className="section">
                        <label className="label-icon">
                            <FaUser/>
                            Nome Completo
                        </label>
                        <input type="text" />
                    </div>
                    <div className="row">
                        <div className="section">
                            <label className="label-icon">
                                <FaIdCard/>
                                CPF
                            </label>
                            <input type="text" />
                        </div>

                        <div className="section">
                            <label className="label-icon">
                                <FaPhone/>
                                Telefone
                            </label>
                            <input type="tel" placeholder="(00) 00000-0000" />
                        </div>
                    </div>
                    <div className="section">
                        <label className="label-icon">
                            <FaEnvelope/>
                            Email
                        </label>
                        <input type="email"/>
                    </div>
                    <h3 className="section-title">
                        <FaMapMarkerAlt/>
                        Endereço
                    </h3>
                    <div className="row">
                       <div className="section">
                            <label>CEP</label>
                            <input type="text" placeholder="00000-000" />
                        </div>
                       <div className="section">
                            <label>Rua/Avenida</label>
                            <input type="text" />
                        </div>

                    </div>
                    <div className="row">
                        <div className="section">
                            <label>Número</label>
                            <input type="text" />
                        </div>
                     <div className="section">
                            <label>Complemento</label>
                            <input type="text" placeholder="apto, bloco, etc." />
                        </div>
                    </div>
                    <div className="row">
                      <div className="section">
                            <label>Bairro</label>
                            <input type="text" />
                        </div>
                        <div className="section">
                            <label>Cidade</label>
                            <input type="text" />
                        </div>
                    </div>
                    <h3 className="section-title">
                        <FaLock/>
                        Senha
                    </h3>
                    <div className="row">
                        <div className="section">
                            <label>Senha</label>
                            <input type="password" />
                        </div>
                        <div className="section">
                            <label>Confirmar senha</label>
                            <input type="password" />
                        </div>
                    </div>
                    <button className="btn-criar">Criar Conta</button>
                </form>
            </div>

        </div>
    )
}

export default CadastroMorador