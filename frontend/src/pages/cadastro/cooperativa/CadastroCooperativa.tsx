import './CadastroCooperativa.css';
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaBuilding,
  FaRecycle
} from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import CheckboxTermos from '../../../Components/checkboxTermos/CheckboxTermos';

const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
};

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .substring(0, 9);
};

const CadastroCooperativa: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erroTermos, setErroTermos] = useState(false)

  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [papel, setPapel] = useState(false);
  const [papelao, setPapelao] = useState(false);
  const [plastico, setPlastico] = useState(false);
  const [metal, setMetal] = useState(false);
  const [vidro, setVidro] = useState(false);
  const [eletronicos, setEletronicos] = useState(false);
  const [oleoDeCozinha, setOleoDeCozinha] = useState(false);

  const [erro, setErro] = useState<string>('');
  const [erroEndereco, setErroEndereco] = useState<string>('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
        .then(res => res.json())
        .then(dados => {
          if (!dados.erro) {
            setRua(dados.logradouro || '');
            setBairro(dados.bairro || '');
            setCidade(dados.localidade || '');
            setErroEndereco('');
          } else {
            setErroEndereco('CEP não encontrado.');
          }
        })
        .catch(() => setErroEndereco('Erro ao buscar o CEP.'));
    }
  }, [cep]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const algumMaterialSelecionado =
      papel || papelao || plastico || metal || vidro || eletronicos || oleoDeCozinha;

    if (!nomeEmpresa || !nomeResponsavel || !cnpj || !telefone || !email ||
      !cep || !rua || !numero || !bairro || !cidade || !senha) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (erroEndereco) {
      setErro('Corrija o CEP antes de continuar.');
      return;
    }

    if (!algumMaterialSelecionado) {
      setErro('Selecione pelo menos um tipo de material aceito.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

     if (!aceitouTermos) {
  setErroTermos(true); 
  return; 
}

    const materiais = [];
    if (papel) materiais.push('papel');
    if (papelao) materiais.push('papelao');
    if (plastico) materiais.push('plastico');
    if (metal) materiais.push('metal');
    if (vidro) materiais.push('vidro');
    if (eletronicos) materiais.push('eletronicos');
    if (oleoDeCozinha) materiais.push('oleo');

    const payload = {
      nome: nomeEmpresa,
      nomeRepresentante: nomeResponsavel,
      email: email.toLowerCase().trim(),
      senha,
      cnpj: cnpj.replace(/\D/g, ''),
      telefone: telefone.replace(/\D/g, ''),
      materiais,
      endereco: {
        cep: cep.replace(/\D/g, ''),
        rua,
        numero,
        complemento,
        bairro,
        cidade
      }
    };

    try {
      setCarregando(true);

      // Cadastra a cooperativa
      console.log("Cadastrando cooperativa...", payload);
      await api.post('/auth/register/cooperativa', payload);

      // Faz login automático
      console.log("Realizando login automático...");
      const loginResponse = await api.post('/auth/login/cooperativa', {
        email: email.toLowerCase().trim(),
        senha: senha
      });

      const { token, user } = loginResponse.data;
      login(user, token);

      alert("Bem-vindo ao eColeta! Sua cooperativa foi registrada.");
      navigate('/dashboard-cooperativa');

    } catch (error: any) {
      console.error("Erro no processo:", error);
      const msg = error.response?.data?.message || "Erro ao realizar cadastro. Tente novamente.";
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h2> Cadastro de Cooperativa</h2>

        {erro && <div className="erro">{erro}</div>}

        <form className="cadastro-form" onSubmit={handleSubmit}>

          <div className="section">
            <label><FaBuilding /> Nome da Empresa</label>
            <input required value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)} />
          </div>

          <div className="section">
            <label><FaUser /> Responsável</label>
            <input required value={nomeResponsavel} onChange={e => setNomeResponsavel(e.target.value)} />
          </div>

          <div className="row">
            <div className="section">
              <label><FaIdCard /> CNPJ</label>
              <input
                required
                value={cnpj}
                onChange={e => setCnpj(maskCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="section">
              <label><FaPhone /> Telefone</label>
              <input
                required
                value={telefone}
                onChange={e => setTelefone(maskPhone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="section">
            <label><FaEnvelope /> Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <h3><FaMapMarkerAlt /> Endereço</h3>
          {erroEndereco && <p className="erro">{erroEndereco}</p>}

          <div className="row">
            <div className="section">
              <label>CEP</label>
              <input
                required
                value={cep}
                onChange={e => setCep(maskCEP(e.target.value))}
                placeholder="00000-000"
              />
            </div>
            <div className="section">
              <label>Número</label>
              <input required value={numero} onChange={e => setNumero(e.target.value)} />
            </div>
          </div>

          <div className="section">
            <label>Rua</label>
            <input required value={rua} onChange={e => setRua(e.target.value)} />
          </div>

          <div className="row">
            <div className="section">
              <label>Bairro</label>
              <input required value={bairro} onChange={e => setBairro(e.target.value)} />
            </div>
            <div className="section">
              <label>Cidade</label>
              <input required value={cidade} onChange={e => setCidade(e.target.value)} />
            </div>
          </div>

          <div className="section">
            <label>Complemento (Opcional)</label>
            <input value={complemento} onChange={e => setComplemento(e.target.value)} />
          </div>

          <h3><FaRecycle /> Materiais Aceitos</h3>
          <div className="checkbox-group">
            <label><input type="checkbox" checked={papel} onChange={() => setPapel(!papel)} /> Papel</label>
            <label><input type="checkbox" checked={papelao} onChange={() => setPapelao(!papelao)} /> Papelão</label>
            <label><input type="checkbox" checked={plastico} onChange={() => setPlastico(!plastico)} /> Plástico</label>
            <label><input type="checkbox" checked={metal} onChange={() => setMetal(!metal)} /> Metal</label>
            <label><input type="checkbox" checked={vidro} onChange={() => setVidro(!vidro)} /> Vidro</label>
            <label><input type="checkbox" checked={eletronicos} onChange={() => setEletronicos(!eletronicos)} /> Eletrônicos</label>
            <label><input type="checkbox" checked={oleoDeCozinha} onChange={() => setOleoDeCozinha(!oleoDeCozinha)} /> Óleo</label>
          </div>

          <h3><FaLock /> Senha</h3>
          <div className="row">
            <div className="section">
              <label>Senha</label>
              <input required type="password" value={senha} onChange={e => setSenha(e.target.value)} />
            </div>
            <div className="section">
              <label>Confirmar Senha</label>
              <input required type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
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
            {carregando ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroCooperativa;
