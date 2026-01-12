import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes: ('morador' | 'ecoletor' | 'cooperativa')[];
}

export default function ProtectedRoute({ children, allowedTypes }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedTypes.includes(user.tipo)) {
    // Redirecionar para o dashboard correto baseado no tipo do usuário
    if (user.tipo === 'morador') {
      return <Navigate to="/dashboard-morador" replace />;
    } else if (user.tipo === 'ecoletor') {
      return <Navigate to="/dashboard-coletor" replace />;
    } else if (user.tipo === 'cooperativa') {
      return <Navigate to="/dashboard-cooperativa" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
