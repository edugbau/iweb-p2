/**
 * Modelo de Interacción del dominio.
 * Representa comentarios y visitas a ubicaciones.
 */

/** Tipos de interacción disponibles */
export type Interaction_Type = 'comment' | 'visit';

export interface Interaction_Model {
    /** ID único de la interacción */
    id: string;
    /** ID de la ubicación relacionada */
    location_id: string;
    /** Email del usuario que interactúa */
    user_email: string;
    /** Tipo de interacción */
    interaction_type: Interaction_Type;
    /** Contenido del comentario (opcional) */
    content?: string;
    /** Fecha de creación */
    created_at: string;
}

/**
 * Datos para crear una nueva interacción.
 */
export interface Interaction_Create {
    /** ID de la ubicación */
    location_id: string;
    /** Tipo de interacción */
    interaction_type: Interaction_Type;
    /** Contenido del comentario (opcional) */
    content?: string;
}

/**
 * Respuesta de lista de interacciones.
 */
export interface Interaction_List_Response {
    /** Lista de interacciones */
    interactions: Interaction_Model[];
    /** Total de interacciones */
    total: number;
}
