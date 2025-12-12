/**
 * Hook de Ubicaciones.
 * Gestiona las operaciones CRUD de ubicaciones.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Location_Model } from '../../domain/models';
import * as location_repository from '../../infrastructure/repositories/location_repository';

/**
 * Estado del hook de ubicaciones.
 */
interface Use_Locations_State {
    /** Lista de ubicaciones */
    locations: Location_Model[];
    /** Indica si está cargando */
    is_loading: boolean;
    /** Mensaje de error si existe */
    error: string | null;
}

/**
 * Retorno del hook de ubicaciones.
 */
interface Use_Locations_Return extends Use_Locations_State {
    /** Recarga la lista de ubicaciones */
    refresh: () => Promise<void>;
    /** Crea una nueva ubicación */
    create: (title: string, address: string, description?: string, image?: File) => Promise<Location_Model>;
    /** Actualiza una ubicación existente */
    update: (id: string, data: { title?: string; description?: string; address?: string }) => Promise<Location_Model>;
    /** Elimina una ubicación */
    remove: (id: string) => Promise<void>;
}

/**
 * Hook para gestionar las ubicaciones del mapa.
 * @param only_mine - Si es true, solo carga las ubicaciones propias.
 * @returns Estado y funciones de ubicaciones.
 */
export const use_locations = (only_mine: boolean = false): Use_Locations_Return => {
    const [state, set_state] = useState<Use_Locations_State>({
        locations: [],
        is_loading: true,
        error: null,
    });

    /**
     * Carga la lista de ubicaciones.
     */
    const refresh = useCallback(async () => {
        set_state(prev => ({ ...prev, is_loading: true, error: null }));

        try {
            const response = only_mine
                ? await location_repository.get_my_locations()
                : await location_repository.get_all_locations();

            set_state({
                locations: response.locations,
                is_loading: false,
                error: null,
            });
        } catch (err) {
            set_state(prev => ({
                ...prev,
                is_loading: false,
                error: 'Error al cargar las ubicaciones',
            }));
        }
    }, [only_mine]);

    /**
     * Crea una nueva ubicación.
     * @param title - Título del marcador.
     * @param address - Dirección a geocodificar.
     * @param description - Descripción opcional.
     * @param image - Imagen opcional.
     * @returns La ubicación creada.
     */
    const create = useCallback(async (
        title: string,
        address: string,
        description?: string,
        image?: File
    ): Promise<Location_Model> => {
        const location = await location_repository.create_location(title, address, description, image);
        set_state(prev => ({
            ...prev,
            locations: [location, ...prev.locations],
        }));
        return location;
    }, []);

    /**
     * Actualiza una ubicación existente.
     * @param id - ID de la ubicación.
     * @param data - Datos a actualizar.
     * @returns La ubicación actualizada.
     */
    const update = useCallback(async (
        id: string,
        data: { title?: string; description?: string; address?: string }
    ): Promise<Location_Model> => {
        const updated = await location_repository.update_location(id, data);
        set_state(prev => ({
            ...prev,
            locations: prev.locations.map(loc => loc.id === id ? updated : loc),
        }));
        return updated;
    }, []);

    /**
     * Elimina una ubicación.
     * @param id - ID de la ubicación a eliminar.
     */
    const remove = useCallback(async (id: string): Promise<void> => {
        await location_repository.delete_location(id);
        set_state(prev => ({
            ...prev,
            locations: prev.locations.filter(loc => loc.id !== id),
        }));
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        ...state,
        refresh,
        create,
        update,
        remove,
    };
};
