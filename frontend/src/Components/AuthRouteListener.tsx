import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthRouteListener() {
  const location = useLocation();
  const { user, loadUserByType } = useAuth();
  const lastPathRef = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Função para determinar o tipo de usuário baseado na rota
    const getTipoFromPath = (pathname: string): 'morador' | 'ecoletor' | 'cooperativa' | null => {
      if (pathname.includes('morador')) return 'morador';
      if (pathname.includes('coletor')) return 'ecoletor';
      if (pathname.includes('cooperativa')) return 'cooperativa';
      return null;
    };

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Evitar processar a mesma rota múltiplas vezes
    if (lastPathRef.current === location.pathname) {
      return;
    }

    lastPathRef.current = location.pathname;
    const tipoEsperado = getTipoFromPath(location.pathname);
    
    // Se a rota mudou e o tipo esperado é diferente do usuário atual, carregar a sessão mais recente do tipo correto
    // Usar debounce para evitar múltiplas chamadas
    if (tipoEsperado && (!user || user.tipo !== tipoEsperado)) {
      timeoutRef.current = setTimeout(() => {
        loadUserByType(tipoEsperado);
      }, 200);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [location.pathname, user, loadUserByType]);

  return null; // Componente invisível
}
