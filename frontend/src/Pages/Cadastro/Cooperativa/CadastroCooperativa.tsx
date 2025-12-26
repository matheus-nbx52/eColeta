import './CadastroCooperativa.css'
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock, FaBuilding, FaRecycle } from "react-icons/fa";

function CadastroCooperativa() {
    return (
        <div className="cadastro-page">
            <div className="cadastro-card">

                <h2>Cadastro de cooperativa</h2>
                <p className="subtitle">Preencha os dados da cooperativa</p>
                <form className="cadastro-form">
                    <div className="section">
                        <label className="label-icon">
                            <FaBuilding />
                            Nome da empresa
                        </label>
                        <input type="text" />
                    </div>
                    <div className="row">
                        <div className="section">
                            <label className="label-icon">
                                <FaUser />
                                Nome do responsável
                            </label>
                            <input type="text" />
                        </div>

                        <div className="section">
                            <label className="label-icon">
                                <FaIdCard />
                                CNPJ
                            </label>
                            <input type="text" placeholder="00.000.000/0000-00" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="section">
                            <label className="label-icon">
                                <FaPhone />
                                Telefone
                            </label>
                            <input type="tel" placeholder='(00) 00000-0000' />
                        </div>
                        <div className="section">
                            <label className="label-icon">
                                <FaEnvelope />
                                Email
                            </label>
                            <input type="text" />
                        </div>
                    </div>
                    <h3 className="section-title">
                        <FaMapMarkerAlt />
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

                    <h3 className='section-title'>
                        <FaRecycle/>
                       Materiais aceitos
                    </h3>
                    <div className='checkbox-group'>
                        <label className='checkbox-label'>
                            <input type="checkbox" />
                            Papel
                        </label>
                          <label className='checkbox-label'>
                            <input type="checkbox" />
                            Papelão
                        </label>
                          <label className='checkbox-label'>
                            <input type="checkbox" />
                            Plástico
                        </label>
                           <label className='checkbox-label'>
                            <input type="checkbox" />
                            Metal
                        </label>
                         <label className='checkbox-label'>
                            <input type="checkbox" />
                            Vidro
                        </label>
                         <label className='checkbox-label'>
                            <input type="checkbox" />
                            Eletrônicos
                        </label>
                         <label className='checkbox-label'>
                            <input type="checkbox" />
                            Óleo de cozinha
                        </label>
                    </div>

                    <h3 className="section-title">
                        <FaLock />
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

export default CadastroCooperativa