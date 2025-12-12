import { useState, useEffect, useCallback } from 'react';
import type { Review_Model, Geocoding_Result } from '../../domain/models/Review';
import { Http_Review_Repository } from '../../infrastructure/repositories/HttpReviewRepository';

const review_repository = new Http_Review_Repository();

/**
 * Hook personalizado para gestionar las reseñas.
 * Proporciona estado y operaciones CRUD para reseñas.
 * @returns Objeto con reviews, loading, error y funciones de gestión.
 */
export const use_reviews = () => {
    const [reviews, set_reviews] = useState<Review_Model[]>([]);
    const [loading, set_loading] = useState<boolean>(true);
    const [error, set_error] = useState<string | null>(null);

    /**
     * Carga todas las reseñas desde el servidor.
     */
    const fetch_reviews = useCallback(async () => {
        try {
            set_loading(true);
            set_error(null);
            const data = await review_repository.get_all();
            set_reviews(data);
        } catch (err) {
            set_error('Error al cargar las reseñas');
            console.error('Error fetching reviews:', err);
        } finally {
            set_loading(false);
        }
    }, []);

    /**
     * Crea una nueva reseña.
     * @param form_data FormData con los datos de la reseña.
     * @returns La reseña creada.
     */
    const create_review = async (form_data: FormData): Promise<Review_Model> => {
        const new_review = await review_repository.create(form_data);
        set_reviews(prev => [new_review, ...prev]);
        return new_review;
    };

    /**
     * Elimina una reseña por su ID.
     * @param id ID de la reseña a eliminar.
     * @returns Boolean indicando éxito.
     */
    const delete_review = async (id: string): Promise<boolean> => {
        const success = await review_repository.delete(id);
        if (success) {
            set_reviews(prev => prev.filter(review => review.id !== id));
        }
        return success;
    };

    /**
     * Obtiene una reseña por su ID.
     * @param id ID de la reseña.
     * @returns La reseña o null.
     */
    const get_review_by_id = async (id: string): Promise<Review_Model | null> => {
        return await review_repository.get_by_id(id);
    };

    /**
     * Geocodifica una dirección.
     * @param address Dirección a geocodificar.
     * @returns Coordenadas de la dirección.
     */
    const geocode_address = async (address: string): Promise<Geocoding_Result> => {
        return await review_repository.geocode(address);
    };

    useEffect(() => {
        fetch_reviews();
    }, [fetch_reviews]);

    return {
        reviews,
        loading,
        error,
        fetch_reviews,
        create_review,
        delete_review,
        get_review_by_id,
        geocode_address
    };
};
