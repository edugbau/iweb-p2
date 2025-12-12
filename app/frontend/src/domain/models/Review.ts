/**
 * Modelo de dominio para representar una reseña de establecimiento.
 * Contiene toda la información de una reseña según los requisitos del examen.
 */
export interface Review_Model {
    /** ID único de la reseña en MongoDB */
    id: string;
    /** Nombre del establecimiento reseñado */
    establishment_name: string;
    /** Dirección postal del establecimiento */
    address: string;
    /** Latitud obtenida por geocoding */
    latitude: number;
    /** Longitud obtenida por geocoding */
    longitude: number;
    /** Valoración de 0 a 5 puntos */
    rating: number;
    /** URLs de las imágenes en Cloudinary */
    image_urls: string[];
    /** Email del autor de la reseña */
    author_email: string;
    /** Nombre del autor de la reseña */
    author_name: string;
    /** Token OAuth usado para crear la reseña */
    auth_token?: string;
    /** Fecha y hora de creación */
    created_at: Date;
    /** Fecha y hora de caducidad del token */
    expires_at?: Date;
}

/**
 * Datos para crear una nueva reseña.
 * Solo incluye los campos que el usuario proporciona directamente.
 */
export interface Review_Create_Data {
    /** Nombre del establecimiento */
    establishment_name: string;
    /** Dirección postal para geocodificación */
    address: string;
    /** Valoración de 0 a 5 */
    rating: number;
    /** Archivos de imagen a subir */
    images?: File[];
}

/**
 * Respuesta del servicio de geocodificación.
 */
export interface Geocoding_Result {
    /** Latitud encontrada */
    latitude: number;
    /** Longitud encontrada */
    longitude: number;
    /** Nombre completo de la dirección */
    display_name?: string;
    /** Mensaje de advertencia si se usaron coordenadas por defecto */
    warning?: string;
    /** Indica si las coordenadas son por defecto (fallback) */
    is_default?: boolean;
}
