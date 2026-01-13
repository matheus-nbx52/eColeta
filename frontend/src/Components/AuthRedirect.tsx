import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthRedirectProps {
  redirectTo?: string;
}

export default function AuthRedirect({ redirectTo }: AuthRedirectProps) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const targetRoute = redirectTo || (
        user.tipo === 'morador' ? '/dashboard-morador' :
        user.tipo === 'ecoletor' ? '/dashboard-coletor' :
        user.tipo === 'cooperativa' ? '/dashboard-cooperativa' :
        '/'
      );
      navigate(targetRoute, { replace: true });
    }
  }, [user, loading, navigate, redirectTo]);

  // Mostrar loading enquanto verifica, evitando flash da página
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Carregando...</p>
      </div>
    </div>
  );
}
