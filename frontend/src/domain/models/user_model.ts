/**
 * Modelo de Usuario del dominio.
 * Representa un usuario autenticado en la aplicación.
 */
export interface User_Model {
    /** Email único del usuario */
    email: string;
    /** Nombre completo del usuario */
    name: string;
    /** URL de la foto de perfil (opcional) */
    picture?: string;
    /** Fecha de registro */
    created_at: string;
}

/**
 * Respuesta de autenticación con token.
 */
export interface Token_Response {
    /** Token JWT de acceso */
    access_token: string;
    /** Tipo de token (siempre 'bearer') */
    token_type: string;
    /** Datos del usuario */
    user: User_Model;
}
