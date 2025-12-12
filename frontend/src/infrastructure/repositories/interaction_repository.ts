/**
 * Repositorio de Interacciones.
 * Gestiona comentarios y visitas a ubicaciones.
 */

import api_client from '../api_client';
import type {
    Interaction_Model,
    Interaction_Create,
    Interaction_List_Response
} from '../../domain/models';

/**
 * Obtiene las interacciones de una ubicación.
 * @param location_id - ID de la ubicación.
 * @returns Promesa con la lista de interacciones.
 */
export const get_location_interactions = async (
    location_id: string
): Promise<Interaction_List_Response> => {
    const response = await api_client.get<Interaction_List_Response>(
        `/interactions/location/${location_id}`
    );
    return response.data;
};

/**
 * Crea una nueva interacción (comentario o visita).
 * @param data - Datos de la interacción a crear.
 * @returns Promesa con la interacción creada.
 */
export const create_interaction = async (
    data: Interaction_Create
): Promise<Interaction_Model> => {
    const response = await api_client.post<Interaction_Model>('/interactions', data);
    return response.data;
};

/**
 * Elimina una interacción.
 * @param interaction_id - ID de la interacción a eliminar.
 * @returns Promesa que se resuelve cuando se elimina.
 */
export const delete_interaction = async (interaction_id: string): Promise<void> => {
    await api_client.delete(`/interactions/${interaction_id}`);
};
