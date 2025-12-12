/**
 * Modelo de Ubicación del dominio.
 * Representa un marcador en el mapa.
 */
export interface Location_Model {
    /** ID único de la ubicación */
    id: string;
    /** Email del propietario */
    owner_email: string;
    /** Título del marcador */
    title: string;
    /** Descripción del lugar (opcional) */
    description?: string;
    /** Dirección textual */
    address: string;
    /** Latitud geográfica */
    latitude: number;
    /** Longitud geográfica */
    longitude: number;
    /** URL de la imagen (opcional) */
    image_url?: string;
    /** Fecha de creación */
    created_at: string;
    /** Fecha de última actualización */
    updated_at: string;
}

/**
 * Datos para crear una nueva ubicación.
 */
export interface Location_Create {
    /** Título del marcador */
    title: string;
    /** Descripción del lugar (opcional) */
    description?: string;
    /** Dirección a geocodificar */
    address: string;
}

/**
 * Datos para actualizar una ubicación existente.
 */
export interface Location_Update {
    /** Nuevo título (opcional) */
    title?: string;
    /** Nueva descripción (opcional) */
    description?: string;
    /** Nueva dirección (opcional) */
    address?: string;
}

/**
 * Respuesta de lista de ubicaciones.
 */
export interface Location_List_Response {
    /** Lista de ubicaciones */
    locations: Location_Model[];
    /** Total de ubicaciones */
    total: number;
}
