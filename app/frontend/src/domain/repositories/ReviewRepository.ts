import type { Review_Model, Geocoding_Result } from "../models/Review";

/**
 * Interfaz del repositorio de reseñas.
 * Define el contrato para operaciones CRUD de reseñas.
 */
export interface Review_Repository {
    /**
     * Obtiene todas las reseñas del sistema.
     * @returns Promesa con la lista de reseñas.
     */
    get_all(): Promise<Review_Model[]>;
    
    /**
     * Obtiene una reseña por su ID.
     * @param id ID de la reseña.
     * @returns Promesa con la reseña o null si no existe.
     */
    get_by_id(id: string): Promise<Review_Model | null>;
    
    /**
     * Crea una nueva reseña.
     * @param data Datos del formulario de creación.
     * @returns Promesa con la reseña creada.
     */
    create(data: FormData): Promise<Review_Model>;
    
    /**
     * Elimina una reseña por su ID.
     * @param id ID de la reseña a eliminar.
     * @returns Promesa con boolean indicando éxito.
     */
    delete(id: string): Promise<boolean>;
    
    /**
     * Geocodifica una dirección postal.
     * @param address Dirección a geocodificar.
     * @returns Promesa con las coordenadas.
     */
    geocode(address: string): Promise<Geocoding_Result>;
}
