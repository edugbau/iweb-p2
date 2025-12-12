import type { Location_Model } from "../models/Location";

export interface Location_Repository {
    get_all(): Promise<Location_Model[]>;
    create(location: FormData): Promise<Location_Model>;
}
