import "./CadastroMorador.css"
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroMorador() {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [erroDados, setErroDados] = useState('');
    const [erroEndereco, setErroEndereco] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setErroDados('');
        setErroEndereco('');
        setErroSenha('');


        if (!nome || !cpf || !email || !telefone) {
            setErroDados('Preencha todos os dados pessoais');
            return;
        }

        if (!cep || !rua || !numero || !bairro || !cidade) {
            setErroEndereco('Preencha o endereço completo');
            return;
        }

        if (!senha || senha !== confirmarSenha) {
            setErroSenha('As senhas não conferem');
            return;
        }

        const morador = {
            nome,
            cpf,
            email,
            telefone,
            endereco: {
                cep,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
            },
            senha,
        };

        console.log("Cadastro Válido:", morador);

        navigate("/dashboard-morador");
    };

    return (
        <div className="cadastro-page">
            <div className="cadastro-card">
                <h2>Cadastro de morador</h2>
                <p className="subtitle">Preencha seus dados para solicitar coletas</p>

                {erroDados && <p className="erro">{erroDados}</p>}

                <form className="cadastro-form" onSubmit={handleSubmit}>
                    <div className="section">
                        <label className="label-icon">
                            <FaUser /> Nome Completo
                        </label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>

                    <div className="row">
                        <div className="section">
                            <label className="label-icon">
                                <FaIdCard /> CPF
                            </label>
                            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                        </div>

                        <div className="section">
                            <label className="label-icon">
                                <FaPhone /> Telefone
                            </label>
                            <input type="tel" placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                        </div>
                    </div>

                    <div className="section">
                        <label className="label-icon">
                            <FaEnvelope /> Email
                        </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <h3 className="section-title">
                        <FaMapMarkerAlt /> Endereço
                    </h3>

                    {erroEndereco && <p className="erro">{erroEndereco}</p>}

                    <div className="row">
                        <div className="section">
                            <label>CEP</label>
                            <input type="text" placeholder="00000-000" value={cep} onChange={(e) => setCep(e.target.value)} />
                        </div>
                        <div className="section">
                            <label>Rua/Avenida</label>
                            <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="section">
                            <label>Número</label>
                            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} />
                        </div>
                        <div className="section">
                            <label>Complemento</label>
                            <input type="text" placeholder="apto, bloco, etc." value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="section">
                            <label>Bairro</label>
                            <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} />
                        </div>
                        <div className="section">
                            <label>Cidade</label>
                            <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} />
                        </div>
                    </div>

                    <h3 className="section-title">
                        <FaLock /> Senha
                    </h3>

                    {erroSenha && <p className="erro">{erroSenha}</p>}

                    <div className="row">
                        <div className="section">
                            <label>Senha</label>
                            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                        </div>
                        <div className="section">
                            <label>Confirmar senha</label>
                            <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="btn-criar">Criar Conta</button>
                </form>
            </div>
        </div>
    )
}

export default CadastroMorador;