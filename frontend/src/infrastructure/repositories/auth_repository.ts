/**
 * Repositorio de Autenticación.
 * Gestiona las operaciones de autenticación con el backend.
 */

import api_client, { API_BASE_URL } from '../api_client';
import type { User_Model } from '../../domain/models';

/**
 * Obtiene la URL de login de Google OAuth.
 * @returns URL para redirigir al usuario al login de Google.
 */
export const get_login_url = (): string => {
    return `${API_BASE_URL}/api/v1/auth/login`;
};

/**
 * Obtiene la información del usuario autenticado.
 * @returns Promesa con los datos del usuario.
 */
export const get_current_user = async (): Promise<User_Model> => {
    const response = await api_client.get<User_Model>('/auth/me');
    return response.data;
};

/**
 * Guarda el token de autenticación en localStorage.
 * @param token - Token JWT a guardar.
 */
export const save_auth_token = (token: string): void => {
    localStorage.setItem('auth_token', token);
};

/**
 * Obtiene el token de autenticación guardado.
 * @returns Token JWT o null si no existe.
 */
export const get_auth_token = (): string | null => {
    return localStorage.getItem('auth_token');
};

/**
 * Elimina el token de autenticación (logout).
 */
export const remove_auth_token = (): void => {
    localStorage.removeItem('auth_token');
};

/**
 * Verifica si el usuario está autenticado.
 * @returns True si hay token guardado.
 */
export const is_authenticated = (): boolean => {
    return !!get_auth_token();
};
