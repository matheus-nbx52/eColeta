import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
});

const getToken = (): string | null => {
    const pathname = window.location.pathname;
    let tipoEsperado: 'morador' | 'ecoletor' | 'cooperativa' | null = null;
    
    if (pathname.includes('morador')) tipoEsperado = 'morador';
    else if (pathname.includes('coletor')) tipoEsperado = 'ecoletor';
    else if (pathname.includes('cooperativa')) tipoEsperado = 'cooperativa';
    
    if (tipoEsperado) {
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
        
        if (sessions.length > 0) {
            sessions.sort((a, b) => b.lastAccess - a.lastAccess);
            return sessions[0].token;
        }
    }
    
    return localStorage.getItem('token');
};

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});