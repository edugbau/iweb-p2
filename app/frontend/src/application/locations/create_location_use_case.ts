import type { Location_Repository } from "../../domain/repositories/LocationRepository";
import type { Location_Model } from "../../domain/models/Location";

export class Create_Location_Use_Case {
    private repository: Location_Repository;

    constructor(repository: Location_Repository) {
        this.repository = repository;
    }

    async execute(data: FormData): Promise<Location_Model> {
        return await this.repository.create(data);
    }
}

