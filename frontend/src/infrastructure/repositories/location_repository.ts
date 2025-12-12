/**
 * Repositorio de Ubicaciones.
 * Gestiona las operaciones CRUD de ubicaciones con el backend.
 */

import api_client from '../api_client';
import type {
    Location_Model,
    Location_List_Response
} from '../../domain/models';

/**
 * Obtiene todas las ubicaciones.
 * @param owner_email - Email del propietario para filtrar (opcional).
 * @returns Promesa con la lista de ubicaciones.
 */
export const get_all_locations = async (owner_email?: string): Promise<Location_List_Response> => {
    const params = owner_email ? { owner_email } : {};
    const response = await api_client.get<Location_List_Response>('/locations', { params });
    return response.data;
};

/**
 * Obtiene las ubicaciones del usuario autenticado.
 * @returns Promesa con la lista de ubicaciones propias.
 */
export const get_my_locations = async (): Promise<Location_List_Response> => {
    const response = await api_client.get<Location_List_Response>('/locations/my');
    return response.data;
};

/**
 * Obtiene una ubicación por su ID.
 * @param location_id - ID de la ubicación.
 * @returns Promesa con los detalles de la ubicación.
 */
export const get_location_by_id = async (location_id: string): Promise<Location_Model> => {
    const response = await api_client.get<Location_Model>(`/locations/${location_id}`);
    return response.data;
};

/**
 * Crea una nueva ubicación con imagen opcional.
 * @param title - Título del marcador.
 * @param address - Dirección a geocodificar.
 * @param description - Descripción opcional.
 * @param image - Archivo de imagen opcional.
 * @returns Promesa con la ubicación creada.
 */
export const create_location = async (
    title: string,
    address: string,
    description?: string,
    image?: File
): Promise<Location_Model> => {
    const form_data = new FormData();
    form_data.append('title', title);
    form_data.append('address', address);

    if (description) {
        form_data.append('description', description);
    }

    if (image) {
        form_data.append('image', image);
    }

    const response = await api_client.post<Location_Model>('/locations', form_data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

/**
 * Actualiza una ubicación existente.
 * @param location_id - ID de la ubicación a actualizar.
 * @param data - Datos a actualizar.
 * @returns Promesa con la ubicación actualizada.
 */
export const update_location = async (
    location_id: string,
    data: { title?: string; description?: string; address?: string }
): Promise<Location_Model> => {
    const response = await api_client.put<Location_Model>(`/locations/${location_id}`, data);
    return response.data;
};

/**
 * Elimina una ubicación.
 * @param location_id - ID de la ubicación a eliminar.
 * @returns Promesa que se resuelve cuando se elimina.
 */
export const delete_location = async (location_id: string): Promise<void> => {
    await api_client.delete(`/locations/${location_id}`);
};
