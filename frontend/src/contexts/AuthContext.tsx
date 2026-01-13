import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'morador' | 'ecoletor' | 'cooperativa';
  telefone?: string;
  cpf?: string;
  cnpj?: string;
  // IDs específicos do backend
  id_morador?: number;
  id_cooperativa?: number;
  id_ecoletor?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loadUserByType: (tipo: 'morador' | 'ecoletor' | 'cooperativa') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Função auxiliar para determinar o tipo de usuário baseado na rota
  const getTipoFromPath = (pathname: string): 'morador' | 'ecoletor' | 'cooperativa' | null => {
    if (pathname.includes('morador')) return 'morador';
    if (pathname.includes('coletor')) return 'ecoletor';
    if (pathname.includes('cooperativa')) return 'cooperativa';
    return null;
  };

  // Função auxiliar para obter o ID único do usuário
  const getUserId = (userData: User): string => {
    return userData.id_morador?.toString() || 
           userData.id_ecoletor?.toString() || 
           userData.id_cooperativa?.toString() || 
           userData.id || 
           userData.email || 
           '';
  };

  // Função auxiliar para obter todas as sessões ativas de um tipo
  const getActiveSessions = (tipo: 'morador' | 'ecoletor' | 'cooperativa'): Array<{userId: string, user: User, token: string, lastAccess: number}> => {
    const sessions: Array<{userId: string, user: User, token: string, lastAccess: number}> = [];
    
    // Buscar todas as chaves do localStorage que correspondem ao tipo
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`user_${tipo}_`)) {
        const userId = key.replace(`user_${tipo}_`, '');
        const tokenKey = `token_${tipo}_${userId}`;
        const userStr = localStorage.getItem(key);
        const token = localStorage.getItem(tokenKey);
        const lastAccessKey = `lastAccess_${tipo}_${userId}`;
        const lastAccess = parseInt(localStorage.getItem(lastAccessKey) || '0');
        
        if (userStr && token) {
          try {
            const user = JSON.parse(userStr);
            sessions.push({ userId, user, token, lastAccess });
          } catch (error) {
            console.error('Erro ao parsear sessão:', error);
          }
        }
      }
    }
    
    // Ordenar por último acesso (mais recente primeiro)
    return sessions.sort((a, b) => b.lastAccess - a.lastAccess);
  };

  // Restaura dados do localStorage ao montar o componente e quando a rota muda
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const loadUser = (pathname?: string) => {
      // Tentar determinar o tipo baseado na rota atual
      const tipoEsperado = pathname ? getTipoFromPath(pathname) : null;
      
      // Se temos um tipo esperado, tentar carregar a sessão mais recente desse tipo
      if (tipoEsperado) {
        const sessions = getActiveSessions(tipoEsperado);
        if (sessions.length > 0) {
          // Verificar se há um usuário salvo no sessionStorage desta aba
          // Isso garante que cada aba mantenha seu próprio usuário mesmo após reload
          const sessionStorageKey = `activeUser_${tipoEsperado}`;
          const savedUserId = sessionStorage.getItem(sessionStorageKey);
          
          let sessionToLoad = sessions[0]; // Por padrão, usar a mais recente
          
          // Se há um usuário salvo no sessionStorage, tentar carregá-lo
          if (savedUserId) {
            const savedUserSession = sessions.find(s => s.userId === savedUserId);
            if (savedUserSession) {
              sessionToLoad = savedUserSession;
            }
          } else {
            // Se não há usuário salvo, verificar se há um usuário atual nas chaves genéricas
            const currentGenericUser = localStorage.getItem('user');
            if (currentGenericUser) {
              try {
                const parsedUser = JSON.parse(currentGenericUser);
                if (parsedUser.tipo === tipoEsperado) {
                  const currentUserId = getUserId(parsedUser);
                  // Tentar encontrar a sessão do usuário atual
                  const currentUserSession = sessions.find(s => s.userId === currentUserId);
                  if (currentUserSession) {
                    sessionToLoad = currentUserSession;
                    // Salvar no sessionStorage para próximos reloads
                    sessionStorage.setItem(sessionStorageKey, currentUserId);
                  }
                }
              } catch (error) {
                // Se houver erro ao parsear, usar a sessão mais recente
              }
            }
          }
          
          try {
            setToken(sessionToLoad.token);
            setUser(sessionToLoad.user);
            // Salvar o ID do usuário no sessionStorage para manter após reload
            sessionStorage.setItem(sessionStorageKey, sessionToLoad.userId);
            // Atualizar timestamp de último acesso
            const lastAccessKey = `lastAccess_${tipoEsperado}_${sessionToLoad.userId}`;
            localStorage.setItem(lastAccessKey, Date.now().toString());
            // Atualizar chaves genéricas apenas se necessário
            const currentGenericUser = localStorage.getItem('user');
            const shouldUpdateGeneric = !currentGenericUser || 
              (currentGenericUser && JSON.parse(currentGenericUser).tipo !== tipoEsperado) ||
              (currentGenericUser && getUserId(JSON.parse(currentGenericUser)) === sessionToLoad.userId);
            if (shouldUpdateGeneric) {
              localStorage.setItem('token', sessionToLoad.token);
              localStorage.setItem('user', JSON.stringify(sessionToLoad.user));
            }
            setLoading(false);
            return;
          } catch (error) {
            console.error('Erro ao restaurar sessão:', error);
          }
        }
      }
      
      // Se não encontrou pelo tipo esperado, tentar chaves genéricas (compatibilidade)
      let storedToken = localStorage.getItem('token');
      let storedUser = localStorage.getItem('user');

      // Se não encontrar nas chaves genéricas, tentar qualquer tipo disponível
      if (!storedToken || !storedUser) {
        const tipos = ['morador', 'ecoletor', 'cooperativa'];
        for (const tipo of tipos) {
          const sessions = getActiveSessions(tipo);
          if (sessions.length > 0) {
            const latestSession = sessions[0];
            storedToken = latestSession.token;
            storedUser = JSON.stringify(latestSession.user);
            break;
          }
        }
      }

    if (storedToken && storedUser) {
      try {
          const parsedUser = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao restaurar usuário do localStorage:', error);
          setToken(null);
          setUser(null);
        }
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    // Carregar na montagem inicial
    loadUser(window.location.pathname);

    // Listener para mudanças no localStorage (quando faz login/logout em outra aba)
    // Usar debounce para evitar múltiplas chamadas
    const handleStorageChange = (e: StorageEvent) => {
      // Ignorar eventos que não são relevantes
      if (!e.key || (!e.key.startsWith('token_') && !e.key.startsWith('user_') && e.key !== 'token' && e.key !== 'user')) {
        return;
      }
      
      // Verificar o tipo esperado pela rota atual
      const tipoEsperado = getTipoFromPath(window.location.pathname);
      
      // Se temos um tipo esperado, verificar se a mudança é de outro usuário do mesmo tipo
      if (tipoEsperado) {
        // Se a mudança foi em uma chave específica de outro usuário do mesmo tipo, ignorar
        if (e.key?.startsWith('token_') || e.key?.startsWith('user_')) {
          if (e.key.includes(`_${tipoEsperado}_`)) {
            // Verificar qual usuário está atualmente carregado nesta aba
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
              try {
                const currentUser = JSON.parse(currentUserStr);
                if (currentUser.tipo === tipoEsperado) {
                  const currentUserId = getUserId(currentUser);
                  // Se a mudança foi em uma chave de outro usuário do mesmo tipo, ignorar
                  if (!e.key.includes(`_${tipoEsperado}_${currentUserId}`)) {
                    return; // Ignorar mudanças de outros usuários do mesmo tipo
                  }
                }
              } catch (error) {
                // Se houver erro ao parsear, continuar normalmente
              }
            }
          }
        }
        
        // Se a mudança foi nas chaves genéricas, SEMPRE ignorar se já temos um usuário válido
        // porque as chaves genéricas não devem ser atualizadas quando há múltiplos usuários do mesmo tipo
        if (e.key === 'token' || e.key === 'user') {
          // Verificar qual usuário está atualmente carregado nesta aba
          const currentUserStr = localStorage.getItem('user');
          if (currentUserStr) {
            try {
              const currentUser = JSON.parse(currentUserStr);
              // Se já temos um usuário do tipo esperado, SEMPRE ignorar mudanças nas chaves genéricas
              // porque elas não devem ser atualizadas quando há múltiplos usuários do mesmo tipo
              if (currentUser.tipo === tipoEsperado) {
                return; // SEMPRE ignorar mudanças nas chaves genéricas se já temos um usuário válido
      }
            } catch (error) {
              // Se houver erro ao parsear, continuar normalmente
            }
          }
        }
      }
      
      // Limpar timeout anterior
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Debounce de 500ms para evitar múltiplas atualizações
      timeoutId = setTimeout(() => {
        loadUser(window.location.pathname);
      }, 500);
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Executar apenas uma vez na montagem

  const login = (userData: User, userToken: string) => {
    // Salvar dados usando chaves específicas por tipo E ID do usuário
    // Isso permite ter múltiplos usuários do mesmo tipo logados simultaneamente
    const tipo = userData.tipo;
    const userId = getUserId(userData);
    
    if (!userId) {
      console.error('Não foi possível obter ID do usuário para salvar sessão');
      return;
    }
    
    const tokenKey = `token_${tipo}_${userId}`;
    const userKey = `user_${tipo}_${userId}`;
    const lastAccessKey = `lastAccess_${tipo}_${userId}`;
    
    // Limpar apenas dados antigos do sistema antigo (se existirem)
    localStorage.removeItem('usuarioLogadoId');
    localStorage.removeItem('usuarios');
    
    // Salvar nas chaves específicas do tipo e ID
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(tokenKey, userToken);
    localStorage.setItem(userKey, JSON.stringify(userData));
    localStorage.setItem(lastAccessKey, Date.now().toString());
    
    // Salvar o ID do usuário no sessionStorage para manter após reload
    const sessionStorageKey = `activeUser_${tipo}`;
    sessionStorage.setItem(sessionStorageKey, userId);
    
    // NUNCA atualizar chaves genéricas se já houver outro usuário do mesmo tipo logado
    // Isso evita que outras abas sejam afetadas quando um novo usuário do mesmo tipo faz login
    const currentGenericUser = localStorage.getItem('user');
    let shouldUpdateGeneric = false; // Por padrão, NÃO atualizar
    
    if (!currentGenericUser) {
      // Se não há usuário genérico, atualizar (primeira vez)
      shouldUpdateGeneric = true;
    } else {
      try {
        const parsedUser = JSON.parse(currentGenericUser);
        // Só atualizar se:
        // 1. O usuário genérico é de um tipo diferente
        // 2. O usuário genérico é o mesmo usuário (mesmo ID)
        if (parsedUser.tipo !== tipo || parsedUser.id === userData.id) {
          shouldUpdateGeneric = true;
        }
        // Se há outro usuário do mesmo tipo mas ID diferente, NÃO atualizar
      } catch (error) {
        // Se houver erro ao parsear, atualizar de qualquer forma
        shouldUpdateGeneric = true;
      }
    }
    
    if (shouldUpdateGeneric) {
      localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const loadUserByType = useCallback((tipo: 'morador' | 'ecoletor' | 'cooperativa') => {
    // Buscar todas as sessões ativas do tipo
    const sessions = getActiveSessions(tipo);
    
    if (sessions.length > 0) {
      // Verificar se há um usuário salvo no sessionStorage desta aba
      const sessionStorageKey = `activeUser_${tipo}`;
      const savedUserId = sessionStorage.getItem(sessionStorageKey);
      
      let sessionToLoad = sessions[0]; // Por padrão, usar a mais recente
      
      // Se há um usuário salvo no sessionStorage, tentar carregá-lo
      if (savedUserId) {
        const savedUserSession = sessions.find(s => s.userId === savedUserId);
        if (savedUserSession) {
          sessionToLoad = savedUserSession;
        }
      } else {
        // Se não há usuário salvo, verificar se há um usuário atual nas chaves genéricas
        const currentGenericUser = localStorage.getItem('user');
        if (currentGenericUser) {
          try {
            const parsedUser = JSON.parse(currentGenericUser);
            if (parsedUser.tipo === tipo) {
              const currentUserId = getUserId(parsedUser);
              // Tentar encontrar a sessão do usuário atual
              const currentUserSession = sessions.find(s => s.userId === currentUserId);
              if (currentUserSession) {
                sessionToLoad = currentUserSession;
                // Salvar no sessionStorage para próximos reloads
                sessionStorage.setItem(sessionStorageKey, currentUserId);
              }
            }
          } catch (error) {
            // Se houver erro ao parsear, usar a sessão mais recente
          }
        }
      }
      
      // Verificar se já está carregado o mesmo usuário (evitar atualizações desnecessárias)
      const currentToken = token;
      const currentUser = user;
      
      if (currentUser && currentUser.tipo === tipo) {
        const currentUserId = getUserId(currentUser);
        if (currentUserId === sessionToLoad.userId && currentToken === sessionToLoad.token) {
          // Já está carregado, apenas atualizar timestamp silenciosamente
          const lastAccessKey = `lastAccess_${tipo}_${sessionToLoad.userId}`;
          localStorage.setItem(lastAccessKey, Date.now().toString());
          return;
        }
      }
      
      try {
        setToken(sessionToLoad.token);
        setUser(sessionToLoad.user);
        // Salvar o ID do usuário no sessionStorage para manter após reload
        sessionStorage.setItem(sessionStorageKey, sessionToLoad.userId);
        // Atualizar timestamp de último acesso
        const lastAccessKey = `lastAccess_${tipo}_${sessionToLoad.userId}`;
        localStorage.setItem(lastAccessKey, Date.now().toString());
        // Atualizar chaves genéricas apenas se necessário
        const currentGenericUser = localStorage.getItem('user');
        const shouldUpdateGeneric = !currentGenericUser || 
          (currentGenericUser && JSON.parse(currentGenericUser).tipo !== tipo) ||
          (currentGenericUser && getUserId(JSON.parse(currentGenericUser)) === sessionToLoad.userId);
        if (shouldUpdateGeneric) {
          localStorage.setItem('token', sessionToLoad.token);
          localStorage.setItem('user', JSON.stringify(sessionToLoad.user));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário por tipo:', error);
      }
    }
  }, [user, token]);

  const logout = () => {
    // Limpar apenas os dados do usuário atual (não todos os usuários)
    const tipoAtual = user?.tipo;
    const userIdAtual = user ? getUserId(user) : null;
    
    setUser(null);
    setToken(null);
    
    // Limpar chaves genéricas
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Limpar chaves específicas do usuário atual (se houver)
    if (tipoAtual && userIdAtual) {
      localStorage.removeItem(`token_${tipoAtual}_${userIdAtual}`);
      localStorage.removeItem(`user_${tipoAtual}_${userIdAtual}`);
      localStorage.removeItem(`lastAccess_${tipoAtual}_${userIdAtual}`);
    }
    
    // Limpar sessionStorage desta aba
    if (tipoAtual) {
      sessionStorage.removeItem(`activeUser_${tipoAtual}`);
    }
    
    // Limpar dados antigos do sistema antigo (se existirem)
    localStorage.removeItem('usuarioLogadoId');
    localStorage.removeItem('usuarios');
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        logout,
        loadUserByType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
