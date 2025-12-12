import type { Location_Repository } from "../../domain/repositories/LocationRepository";
import type { Location_Model } from "../../domain/models/Location";
import api from "../api/axios_client";

export class Http_Location_Repository implements Location_Repository {
    async get_all(): Promise<Location_Model[]> {
        const response = await api.get('/locations');
        return response.data;
    }

    async create(location_data: FormData): Promise<Location_Model> {
        const response = await api.post('/locations', location_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}
