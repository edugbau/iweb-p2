import axios from "axios";

// Define Location Interface
export interface LocationModel {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    image_url?: string;
    owner_email: string;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api/v1",
});

export const locationApi = {
    getAll: async (): Promise<LocationModel[]> => {
        const response = await api.get("/locations/");
        return response.data;
    },

    create: async (formData: FormData): Promise<LocationModel> => {
        const response = await api.post("/locations/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
};
