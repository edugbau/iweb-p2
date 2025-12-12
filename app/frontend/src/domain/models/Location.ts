export interface Location_Model {
    id: string;
    title: string;
    description?: string;
    address: string;
    latitude: number;
    longitude: number;
    image_url: string;
    owner_email: string;
    created_at: Date;
}
