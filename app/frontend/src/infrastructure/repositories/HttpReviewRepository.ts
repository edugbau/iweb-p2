import type { Review_Repository } from "../../domain/repositories/ReviewRepository";
import type { Review_Model, Geocoding_Result } from "../../domain/models/Review";
import api from "../api/axios_client";

/**
 * Implementación HTTP del repositorio de reseñas.
 * Utiliza Axios para comunicarse con la API REST del backend.
 */
export class Http_Review_Repository implements Review_Repository {
    /**
     * Obtiene todas las reseñas desde la API.
     * @returns Promesa con la lista de reseñas.
     */
    async get_all(): Promise<Review_Model[]> {
        const response = await api.get('/reviews');
        return response.data;
    }

    /**
     * Obtiene una reseña específica por su ID.
     * @param id ID de la reseña.
     * @returns Promesa con la reseña o null si no existe.
     */
    async get_by_id(id: string): Promise<Review_Model | null> {
        try {
            const response = await api.get(`/reviews/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching review:', error);
            return null;
        }
    }

    /**
     * Crea una nueva reseña enviando FormData al servidor.
     * @param form_data Datos del formulario con imágenes.
     * @returns Promesa con la reseña creada.
     */
    async create(form_data: FormData): Promise<Review_Model> {
        const response = await api.post('/reviews', form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    /**
     * Elimina una reseña por su ID.
     * @param id ID de la reseña a eliminar.
     * @returns Promesa con boolean indicando éxito.
     */
    async delete(id: string): Promise<boolean> {
        try {
            await api.delete(`/reviews/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            return false;
        }
    }

    /**
     * Geocodifica una dirección postal.
     * @param address Dirección a geocodificar.
     * @returns Promesa con las coordenadas obtenidas.
     */
    async geocode(address: string): Promise<Geocoding_Result> {
        const form_data = new FormData();
        form_data.append('address', address);
        
        const response = await api.post('/reviews/geocode', form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}
