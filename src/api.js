import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Per aggiungere il token Clerk alle richieste,
 * i componenti chiamano setAuthToken dopo aver ottenuto il token.
 * Es: const { getToken } = useAuth(); setAuthToken(await getToken());
 */
let authTokenGetter = null;

export function setAuthTokenGetter(getter) {
  authTokenGetter = getter;
}

// Request interceptor: aggiunge Bearer token se disponibile
api.interceptors.request.use(
  async (config) => {
    if (authTokenGetter) {
      try {
        const token = await authTokenGetter();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        // Token non disponibile, continua senza auth
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: redirect su 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/accedi' && window.location.pathname !== '/registrazione') {
        window.location.href = '/accedi';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
