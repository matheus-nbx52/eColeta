import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Função para obter o token correto baseado na rota atual
// Isso garante que cada aba use o token do seu próprio usuário
const getToken = (): string | null => {
    // Determinar o tipo esperado baseado na rota atual
    const pathname = window.location.pathname;
    let tipoEsperado: 'morador' | 'ecoletor' | 'cooperativa' | null = null;
    
    if (pathname.includes('morador')) tipoEsperado = 'morador';
    else if (pathname.includes('coletor')) tipoEsperado = 'ecoletor';
    else if (pathname.includes('cooperativa')) tipoEsperado = 'cooperativa';
    
    // Se temos um tipo esperado, buscar a sessão mais recente desse tipo
    if (tipoEsperado) {
        // Buscar todas as sessões do tipo e pegar a mais recente
        const sessions: Array<{token: string, lastAccess: number, userId: string}> = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith(`token_${tipoEsperado}_`)) {
                const userId = key.replace(`token_${tipoEsperado}_`, '');
                const token = localStorage.getItem(key);
                const lastAccessKey = `lastAccess_${tipoEsperado}_${userId}`;
                const lastAccess = parseInt(localStorage.getItem(lastAccessKey) || '0');
                
                if (token) {
                    sessions.push({ token, lastAccess, userId });
                }
            }
        }
        
        // Ordenar por último acesso (mais recente primeiro) e retornar o token mais recente
        if (sessions.length > 0) {
            sessions.sort((a, b) => b.lastAccess - a.lastAccess);
            return sessions[0].token;
        }
    }
    
    // Fallback: tentar token genérico (apenas se não encontrou por tipo)
    return localStorage.getItem('token');
};

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});