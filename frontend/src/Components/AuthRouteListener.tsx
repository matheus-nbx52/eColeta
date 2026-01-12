import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthRouteListener() {
  const location = useLocation();
  const { user, loadUserByType } = useAuth();

  useEffect(() => {
    // Função para determinar o tipo de usuário baseado na rota
    const getTipoFromPath = (pathname: string): 'morador' | 'ecoletor' | 'cooperativa' | null => {
      if (pathname.includes('morador')) return 'morador';
      if (pathname.includes('coletor')) return 'ecoletor';
      if (pathname.includes('cooperativa')) return 'cooperativa';
      return null;
    };

    const tipoEsperado = getTipoFromPath(location.pathname);
    
    // Se a rota mudou e o tipo esperado é diferente do usuário atual, carregar a sessão mais recente do tipo correto
    if (tipoEsperado && (!user || user.tipo !== tipoEsperado)) {
      loadUserByType(tipoEsperado);
    }
  }, [location.pathname, user, loadUserByType]);

  return null; // Componente invisível
}
