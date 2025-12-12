/**
 * Cliente HTTP configurado con Axios.
 * Gestiona las peticiones a la API del backend.
 */

import axios from 'axios';

/** URL base de la API del backend */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Instancia de Axios configurada para la API.
 * Incluye interceptores para autenticación y manejo de errores.
 */
const api_client = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

/**
 * Interceptor de peticiones para añadir token de autenticación.
 */
api_client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor de respuestas para manejar errores globalmente.
 */
api_client.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si es error 401, limpiar token y redirigir al login
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            // Redirigir solo si no estamos ya en login
            if (!window.location.pathname.includes('/auth')) {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default api_client;
export { API_BASE_URL };
