import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Tipo extendido para el config con propiedades personalizadas
type ExtendedAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
  __slow_request_timer?: ReturnType<typeof setTimeout>;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 60000, // 60 segundos para dar tiempo a que Render despierte el servidor
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable global para el estado de "despertando servidor"
// Se actualiza desde el contexto cuando se detecta un timeout
let wake_state: { set_is_waking_up?: (value: boolean) => void; set_retry_count?: (value: number) => void } = {};

export const set_wake_state_callbacks = (callbacks: {
    set_is_waking_up: (value: boolean) => void;
    set_retry_count: (value: number) => void;
}) => {
    wake_state = callbacks;
};

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si la petición tarda más de 5 segundos, mostrar el banner de "despertando servidor"
    // Esto es útil porque Render puede tardar hasta 60 segundos en despertar
    const slow_request_timer = setTimeout(() => {
      if (wake_state.set_is_waking_up) {
        wake_state.set_is_waking_up(true);
      }
    }, 5000); // Mostrar banner después de 5 segundos

    // Guardar el timer en el config para poder limpiarlo si la petición termina antes
    const extended_config = config as ExtendedAxiosRequestConfig;
    extended_config.__slow_request_timer = slow_request_timer;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores de timeout y reintentos
api.interceptors.response.use(
  (response) => {
    // Limpiar el timer si la petición terminó antes de los 5 segundos
    const config = response.config as ExtendedAxiosRequestConfig;
    if (config.__slow_request_timer) {
      clearTimeout(config.__slow_request_timer);
    }

    // Si la petición fue exitosa, ocultar el banner de "despertando"
    if (wake_state.set_is_waking_up) {
      wake_state.set_is_waking_up(false);
      if (wake_state.set_retry_count) {
        wake_state.set_retry_count(0);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Limpiar el timer si existe
    if (originalRequest?.__slow_request_timer) {
      clearTimeout(originalRequest.__slow_request_timer);
    }

    // Detectar errores de timeout o conexión (servidor dormido)
    const is_timeout_error = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const is_connection_error = error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED';
    const is_server_error = error.response?.status === 503 || error.response?.status === 502;

    // Si hay un error de conexión o timeout, mostrar el banner inmediatamente
    if ((is_timeout_error || is_connection_error || is_server_error) && wake_state.set_is_waking_up) {
      wake_state.set_is_waking_up(true);
    }

    if ((is_timeout_error || is_connection_error || is_server_error) && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Incrementar contador de reintentos
      if (wake_state.set_retry_count) {
        const current_retry = (originalRequest._retryCount || 0) + 1;
        originalRequest._retryCount = current_retry;
        wake_state.set_retry_count(current_retry);
      }

      // Esperar antes de reintentar (exponencial backoff)
      const delay = Math.min(1000 * Math.pow(2, (originalRequest._retryCount || 0)), 10000); // Max 10 segundos
      await new Promise(resolve => setTimeout(resolve, delay));

      // Reintentar la petición (máximo 3 reintentos)
      if ((originalRequest._retryCount || 0) < 3) {
        return api(originalRequest);
      }
    }

    // Si falló después de todos los reintentos, ocultar el banner después de un tiempo
    if (wake_state.set_is_waking_up && (originalRequest?._retryCount || 0) >= 3) {
      setTimeout(() => {
        if (wake_state.set_is_waking_up) {
          wake_state.set_is_waking_up(false);
        }
        if (wake_state.set_retry_count) {
          wake_state.set_retry_count(0);
        }
      }, 5000);
    }

    return Promise.reject(error);
  }
);

export default api;
