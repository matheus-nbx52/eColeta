import './Login.css';
import { Mail, Lock, User } from 'lucide-react';
import Logo from "../../assets/Logo/logo2.png"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AuthRedirect from '../../Components/AuthRedirect';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('morador'); 
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  // Se já houver um usuário logado, redirecionar sem mostrar o login
  if (!loading && user) {
    return <AuthRedirect />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await api.post(`/auth/login/${tipo}`, {
        email: email.toLowerCase().trim(),
        senha: senha
      });

      console.log("STATUS DA RESPOSTA:", response.status);
      console.log("DADOS CHEGANDO:", response.data);

      const { token, user } = response.data;

      if (token && user) {
          console.log("TOKEN ENCONTRADO! Salvando...");
          
          // Normalizar dados do usuário para ter um ID genérico
          const normalizedUser = {
            ...user,
            id: user.id_morador?.toString() || 
                user.id_cooperativa?.toString() || 
                user.id_ecoletor?.toString() || 
                user.id?.toString() || 
                ''
          };
          
          // Fazer login (isso já limpa dados antigos)
          login(normalizedUser, token);
          
          // Aguardar um pouco para garantir que o contexto foi atualizado
          setTimeout(() => {
            if (tipo === 'morador') navigate('/dashboard-morador');
            else if (tipo === 'ecoletor') navigate('/dashboard-coletor');
            else if (tipo === 'cooperativa') navigate('/dashboard-cooperativa');
          }, 100);
      } else {
          console.warn("ATENÇÃO: A resposta não trouxe token ou usuário.");
          setErro("Erro ao fazer login. Tente novamente.");
          return;
      }

    } catch (error: any) {
      console.error("ERRO COMPLETO:", error);
      setErro(error.response?.data?.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <img src={Logo} alt="eColeta" className="login-logo" />
        <h1 className="brand-name">eColeta</h1>
        <p className="login-subtitle">Entre na sua conta</p>
      </div>
      <div className="login-card">
        {erro && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>{erro}</p>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div className="input-group">
            <User size={20} className="input-icon" />
            <select 
              value={tipo} 
              onChange={(e) => setTipo(e.target.value)}
              className="login-select"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '10px' }}
            >
              <option value="morador">Sou Morador</option>
              <option value="ecoletor">Sou Ecoletor</option>
              <option value="cooperativa">Sou Cooperativa</option>
            </select>
          </div>

          <div className="input-group">
            <Mail size={20} className="input-icon" />
            <input type="email" placeholder="E-mail ou Telefone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input type="password" placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)} 
              required
            />
          </div>
          
          <button type="submit" className="btn-entrar" disabled={carregando}>
             {carregando ? "Acessando..." : "Entrar"}
          </button>
        </form>

        <button className="btn-flat">Esqueceu a senha?</button>
      </div>
      <div className="register-card">
        <p> Não tem uma conta? <span className="register-link-container" onClick={() => navigate('/')}>
            <strong className="text-bold"> Cadastre-se</strong>
          </span>
          </p>
      </div>

    </div>
  );
}