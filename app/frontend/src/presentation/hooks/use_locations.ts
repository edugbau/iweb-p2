import { useState, useEffect } from "react";
import { Get_Locations_Use_Case } from "../../application/locations/get_locations_use_case";
import { Create_Location_Use_Case } from "../../application/locations/create_location_use_case";
import { Http_Location_Repository } from "../../infrastructure/repositories/HttpLocationRepository";
import type { Location_Model } from "../../domain/models/Location";

// Dependency Injection
const repository = new Http_Location_Repository();
const get_locations_use_case = new Get_Locations_Use_Case(repository);
const create_location_use_case = new Create_Location_Use_Case(repository);

export const use_locations = () => {
    const [locations, set_locations] = useState<Location_Model[]>([]);
    const [loading, set_loading] = useState(false);
    const [error, set_error] = useState<string | null>(null);

    const fetch_locations = async () => {
        set_loading(true);
        try {
            const data = await get_locations_use_case.execute();
            set_locations(data);
        } catch (err) {
            set_error("Error fetching locations");
            console.error(err);
        } finally {
            set_loading(false);
        }
    };

    const create_location = async (data: FormData) => {
        set_loading(true);
        try {
            const new_location = await create_location_use_case.execute(data);
            set_locations([...locations, new_location]);
            return new_location;
        } catch (err) {
            set_error("Error creating location");
            console.error(err);
            throw err;
        } finally {
            set_loading(false);
        }
    };

    useEffect(() => {
        fetch_locations();
    }, []);

    return { locations, loading, error, refresh: fetch_locations, create_location };
};

