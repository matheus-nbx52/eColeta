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

  const getTipoFromPath = (pathname: string): 'morador' | 'ecoletor' | 'cooperativa' | null => {
    if (pathname.includes('morador')) return 'morador';
    if (pathname.includes('coletor')) return 'ecoletor';
    if (pathname.includes('cooperativa')) return 'cooperativa';
    return null;
  };

  const getUserId = (userData: User): string => {
    return userData.id_morador?.toString() || 
           userData.id_ecoletor?.toString() || 
           userData.id_cooperativa?.toString() || 
           userData.id || 
           userData.email || 
           '';
  };

  const getActiveSessions = (tipo: 'morador' | 'ecoletor' | 'cooperativa'): Array<{userId: string, user: User, token: string, lastAccess: number}> => {
    const sessions: Array<{userId: string, user: User, token: string, lastAccess: number}> = [];
    
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
    
    return sessions.sort((a, b) => b.lastAccess - a.lastAccess);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    const loadUser = (pathname?: string) => {
      const tipoEsperado = pathname ? getTipoFromPath(pathname) : null;
      
      if (tipoEsperado) {
        const sessions = getActiveSessions(tipoEsperado);
        if (sessions.length > 0) {
          const sessionStorageKey = `activeUser_${tipoEsperado}`;
          const savedUserId = sessionStorage.getItem(sessionStorageKey);
          
          let sessionToLoad = sessions[0];
          
          if (savedUserId) {
            const savedUserSession = sessions.find(s => s.userId === savedUserId);
            if (savedUserSession) {
              sessionToLoad = savedUserSession;
            }
          } else {
            const currentGenericUser = localStorage.getItem('user');
            if (currentGenericUser) {
              try {
                const parsedUser = JSON.parse(currentGenericUser);
                if (parsedUser.tipo === tipoEsperado) {
                  const currentUserId = getUserId(parsedUser);
                  const currentUserSession = sessions.find(s => s.userId === currentUserId);
                  if (currentUserSession) {
                    sessionToLoad = currentUserSession;
                    sessionStorage.setItem(sessionStorageKey, currentUserId);
                  }
                }
              } catch (error) {
              }
            }
          }
          
          try {
            setToken(sessionToLoad.token);
            setUser(sessionToLoad.user);
            sessionStorage.setItem(sessionStorageKey, sessionToLoad.userId);
            const lastAccessKey = `lastAccess_${tipoEsperado}_${sessionToLoad.userId}`;
            localStorage.setItem(lastAccessKey, Date.now().toString());
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
      
      let storedToken = localStorage.getItem('token');
      let storedUser = localStorage.getItem('user');

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

    loadUser(window.location.pathname);

    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || (!e.key.startsWith('token_') && !e.key.startsWith('user_') && e.key !== 'token' && e.key !== 'user')) {
        return;
      }
      
      const tipoEsperado = getTipoFromPath(window.location.pathname);
      
      if (tipoEsperado) {
        if (e.key?.startsWith('token_') || e.key?.startsWith('user_')) {
          if (e.key.includes(`_${tipoEsperado}_`)) {
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
              try {
                const currentUser = JSON.parse(currentUserStr);
                if (currentUser.tipo === tipoEsperado) {
                  const currentUserId = getUserId(currentUser);
                  if (!e.key.includes(`_${tipoEsperado}_${currentUserId}`)) {
                    return;
                  }
                }
              } catch (error) {
              }
            }
          }
        }
        
        if (e.key === 'token' || e.key === 'user') {
          const currentUserStr = localStorage.getItem('user');
          if (currentUserStr) {
            try {
              const currentUser = JSON.parse(currentUserStr);
              if (currentUser.tipo === tipoEsperado) {
                return;
      }
            } catch (error) {
            }
          }
        }
      }
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
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
  }, []);

  const login = (userData: User, userToken: string) => {
    const tipo = userData.tipo;
    const userId = getUserId(userData);
    
    if (!userId) {
      console.error('Não foi possível obter ID do usuário para salvar sessão');
      return;
    }
    
    const tokenKey = `token_${tipo}_${userId}`;
    const userKey = `user_${tipo}_${userId}`;
    const lastAccessKey = `lastAccess_${tipo}_${userId}`;
    
    localStorage.removeItem('usuarioLogadoId');
    localStorage.removeItem('usuarios');
    
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(tokenKey, userToken);
    localStorage.setItem(userKey, JSON.stringify(userData));
    localStorage.setItem(lastAccessKey, Date.now().toString());
    
    const sessionStorageKey = `activeUser_${tipo}`;
    sessionStorage.setItem(sessionStorageKey, userId);
    
    const currentGenericUser = localStorage.getItem('user');
    let shouldUpdateGeneric = false;
    
    if (!currentGenericUser) {
      shouldUpdateGeneric = true;
    } else {
      try {
        const parsedUser = JSON.parse(currentGenericUser);
        if (parsedUser.tipo !== tipo || parsedUser.id === userData.id) {
          shouldUpdateGeneric = true;
        }
      } catch (error) {
        shouldUpdateGeneric = true;
      }
    }
    
    if (shouldUpdateGeneric) {
      localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const loadUserByType = useCallback((tipo: 'morador' | 'ecoletor' | 'cooperativa') => {
    const sessions = getActiveSessions(tipo);
    
    if (sessions.length > 0) {
      const sessionStorageKey = `activeUser_${tipo}`;
      const savedUserId = sessionStorage.getItem(sessionStorageKey);
      
      let sessionToLoad = sessions[0];
      
      if (savedUserId) {
        const savedUserSession = sessions.find(s => s.userId === savedUserId);
        if (savedUserSession) {
          sessionToLoad = savedUserSession;
        }
      } else {
        const currentGenericUser = localStorage.getItem('user');
        if (currentGenericUser) {
          try {
            const parsedUser = JSON.parse(currentGenericUser);
            if (parsedUser.tipo === tipo) {
              const currentUserId = getUserId(parsedUser);
              const currentUserSession = sessions.find(s => s.userId === currentUserId);
              if (currentUserSession) {
                sessionToLoad = currentUserSession;
                sessionStorage.setItem(sessionStorageKey, currentUserId);
              }
            }
          } catch (error) {
          }
        }
      }
      
      const currentToken = token;
      const currentUser = user;
      
      if (currentUser && currentUser.tipo === tipo) {
        const currentUserId = getUserId(currentUser);
        if (currentUserId === sessionToLoad.userId && currentToken === sessionToLoad.token) {
          const lastAccessKey = `lastAccess_${tipo}_${sessionToLoad.userId}`;
          localStorage.setItem(lastAccessKey, Date.now().toString());
          return;
        }
      }
      
      try {
        setToken(sessionToLoad.token);
        setUser(sessionToLoad.user);
        sessionStorage.setItem(sessionStorageKey, sessionToLoad.userId);
        const lastAccessKey = `lastAccess_${tipo}_${sessionToLoad.userId}`;
        localStorage.setItem(lastAccessKey, Date.now().toString());
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
    const tipoAtual = user?.tipo;
    const userIdAtual = user ? getUserId(user) : null;
    
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    if (tipoAtual && userIdAtual) {
      localStorage.removeItem(`token_${tipoAtual}_${userIdAtual}`);
      localStorage.removeItem(`user_${tipoAtual}_${userIdAtual}`);
      localStorage.removeItem(`lastAccess_${tipoAtual}_${userIdAtual}`);
    }
    
    if (tipoAtual) {
      sessionStorage.removeItem(`activeUser_${tipoAtual}`);
    }
    
    localStorage.removeItem('usuarioLogadoId');
    localStorage.removeItem('usuarios');
    
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
