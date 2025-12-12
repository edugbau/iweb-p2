/**
 * Hook de Autenticación.
 * Gestiona el estado de autenticación del usuario.
 */

import { useState, useEffect, useCallback } from 'react';
import type { User_Model } from '../../domain/models';
import * as auth_repository from '../../infrastructure/repositories/auth_repository';

/**
 * Estado del hook de autenticación.
 */
interface Use_Auth_State {
    /** Usuario autenticado o null */
    user: User_Model | null;
    /** Indica si está cargando */
    is_loading: boolean;
    /** Indica si está autenticado */
    is_authenticated: boolean;
    /** Mensaje de error si existe */
    error: string | null;
}

/**
 * Retorno del hook de autenticación.
 */
interface Use_Auth_Return extends Use_Auth_State {
    /** Función para iniciar el login con Google */
    login: () => void;
    /** Función para cerrar sesión */
    logout: () => void;
    /** Función para procesar el callback de OAuth */
    handle_callback: (token: string) => Promise<void>;
}

/**
 * Hook para gestionar la autenticación del usuario.
 * @returns Estado y funciones de autenticación.
 */
export const use_auth = (): Use_Auth_Return => {
    const [state, set_state] = useState<Use_Auth_State>({
        user: null,
        is_loading: true,
        is_authenticated: false,
        error: null,
    });

    /**
     * Verifica si el usuario está autenticado al cargar.
     */
    const check_auth = useCallback(async () => {
        const token = auth_repository.get_auth_token();

        if (!token) {
            set_state({
                user: null,
                is_loading: false,
                is_authenticated: false,
                error: null,
            });
            return;
        }

        try {
            const user = await auth_repository.get_current_user();
            set_state({
                user,
                is_loading: false,
                is_authenticated: true,
                error: null,
            });
        } catch {
            auth_repository.remove_auth_token();
            set_state({
                user: null,
                is_loading: false,
                is_authenticated: false,
                error: null,
            });
        }
    }, []);

    /**
     * Inicia el flujo de login con Google OAuth.
     */
    const login = useCallback(() => {
        window.location.href = auth_repository.get_login_url();
    }, []);

    /**
     * Cierra la sesión del usuario.
     */
    const logout = useCallback(() => {
        auth_repository.remove_auth_token();
        set_state({
            user: null,
            is_loading: false,
            is_authenticated: false,
            error: null,
        });
    }, []);

    /**
     * Procesa el token recibido del callback de OAuth.
     * @param token - Token JWT recibido.
     */
    const handle_callback = useCallback(async (token: string) => {
        auth_repository.save_auth_token(token);

        try {
            const user = await auth_repository.get_current_user();
            set_state({
                user,
                is_loading: false,
                is_authenticated: true,
                error: null,
            });
        } catch (err) {
            auth_repository.remove_auth_token();
            set_state({
                user: null,
                is_loading: false,
                is_authenticated: false,
                error: 'Error al autenticar usuario',
            });
        }
    }, []);

    useEffect(() => {
        check_auth();
    }, [check_auth]);

    return {
        ...state,
        login,
        logout,
        handle_callback,
    };
};
