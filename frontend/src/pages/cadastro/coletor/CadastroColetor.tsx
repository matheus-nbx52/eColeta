import "./CadastroColetor.css";
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaCar
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import CheckboxTermos from "../../../Components/checkboxTermos/CheckboxTermos";

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .substring(0, 14);
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
};

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

const maskCNH = (value: string) => {
  return value.replace(/\D/g, "").substring(0, 11);
};

function CadastroColetor() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erroTermos, setErroTermos] = useState(false)

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  const [veiculo, setVeiculo] = useState("");
  const [cnh, setCnh] = useState("");

  const [erroDados, setErroDados] = useState("");
  const [erroEndereco, setErroEndereco] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroVeiculo, setErroVeiculo] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then((res) => res.json())
        .then((dados) => {
          if (!dados.erro) {
            setRua(dados.logradouro);
            setBairro(dados.bairro);
            setCidade(dados.localidade);
            setErroEndereco("");
          } else {
            setErroEndereco("CEP não encontrado.");
          }
        })
        .catch(() => setErroEndereco("Erro ao buscar servidor de CEP."));
    }
  }, [cep]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setErroDados("");
    setErroEndereco("");
    setErroVeiculo("");
    setErroSenha("");

    if (!nome || !cpf || !email || !telefone) return setErroDados('Preencha todos os dados pessoais');
    if (!cep || !rua || !numero || !bairro || !cidade) return setErroEndereco('Preencha o endereço completo');
    if (!veiculo || !cnh) return setErroVeiculo('Preencha os dados do veículo');
    if (!senha || senha !== confirmarSenha) return setErroSenha('As senhas não conferem');

    if (!aceitouTermos) {
  setErroTermos(true); 
  return; 
}

    const payload = {
      nome,
      email: email.toLowerCase().trim(),
      senha,
      cpf: cpf.replace(/\D/g, ''),
      telefone: telefone.replace(/\D/g, ''),
      veiculo_tipo: veiculo,
    };


    try {
      setCarregando(true);

      console.log("Cadastrando usuário...");
      await api.post('/auth/register/ecoletor', payload);

      console.log("Realizando login automático...");
      const loginResponse = await api.post('/auth/login/ecoletor', {
        email: email.toLowerCase().trim(),
        senha: senha
      });

      const { token, user } = loginResponse.data;
      login(user, token);

      alert("Bem-vindo ao eColeta! Seu cadastro foi realizado.");

      navigate("/dashboard-coletor");

    } catch (error: any) {
      console.error("Erro no processo:", error);
      const msg = error.response?.data?.message || "Erro ao realizar cadastro.";
      setErroDados(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h2>Cadastro de coletor</h2>
        <p className="subtitle">Preencha seus dados para aceitar coletas</p>

        {erroDados && <p className="erro">{erroDados}</p>}

        <form className="cadastro-form" onSubmit={handleSubmit}>

          <div className="section">
            <label className="label-icon">
              <FaUser /> Nome Completo
            </label>
            <input
              required
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="section">
              <label className="label-icon">
                <FaIdCard /> CPF
              </label>
              <input
                required
                type="text"
                value={cpf}
                placeholder="000.000.000-00"
                onChange={(e) => setCpf(maskCPF(e.target.value))}
              />
            </div>

            <div className="section">
              <label className="label-icon">
                <FaPhone /> Telefone
              </label>
              <input
                required
                type="tel"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(maskPhone(e.target.value))}
              />
            </div>
          </div>

          <div className="section">
            <label className="label-icon">
              <FaEnvelope /> Email
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <h3 className="section-title">
            <FaMapMarkerAlt /> Endereço
          </h3>

          {erroEndereco && <p className="erro">{erroEndereco}</p>}

          <div className="row">
            <div className="section">
              <label>CEP</label>
              <input
                required
                type="text"
                placeholder="00000-000"
                value={cep}
                maxLength={9}
                onChange={(e) => setCep(maskCEP(e.target.value))}
              />
            </div>

            <div className="section">
              <label>Rua/Avenida</label>
              <input
                required
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="section">
              <label>Número</label>
              <input
                required
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>

            <div className="section">
              <label>Complemento</label>
              <input
                type="text"
                placeholder="apto, bloco, etc."
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="section">
              <label>Bairro</label>
              <input
                required
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            <div className="section">
              <label>Cidade</label>
              <input
                required
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
          </div>

          <h3 className="section-title">
            <FaCar /> Veículo
          </h3>

          {erroVeiculo && <p className="erro">{erroVeiculo}</p>}

          <div className="row">
            <div className="section">
              <label>Tipo de veículo</label>
              <select
                required
                value={veiculo}
                onChange={(e) => setVeiculo(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="moto">Moto</option>
                <option value="carro">Carro</option>
                <option value="caminhão">Caminhão</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="section">
              <label>CNH</label>
              <input
                required
                type="text"
                placeholder="00000000000"
                value={cnh}
                maxLength={11}
                onChange={(e) => setCnh(maskCNH(e.target.value))}
              />
            </div>
          </div>

          <h3 className="section-title">
            <FaLock /> Senha
          </h3>

          {erroSenha && <p className="erro">{erroSenha}</p>}

          <div className="row">
            <div className="section">
              <label>Senha</label>
              <input
                required
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="section">
              <label>Confirmar senha</label>
              <input
                required
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
          </div>

          <CheckboxTermos
            valor={aceitouTermos}
            onChange={(valor) => {
              setAceitouTermos(valor);
              if (valor) setErroTermos(false);
            }}
          />
          {erroTermos && (
            <p style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '5px', fontWeight: 'bold' }}>
              ⚠️ Você precisa aceitar os Termos e a Política de Privacidade para continuar.
            </p>
          )}
          <button className="btn-criar" type="submit" disabled={carregando}>
            {carregando ? "Criando e Acessando..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroColetor;