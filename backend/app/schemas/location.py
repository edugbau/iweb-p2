from pydantic import BaseModel, ConfigDict

class LocationBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    image_url: str | None = None
    owner_email: str

class LocationCreate(BaseModel):
    name: str
    address: str

class LocationResponse(LocationBase):
    id: str

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "name": "Eiffel Tower",
                "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris, France",
                "latitude": 48.8584,
                "longitude": 2.2945,
                "image_url": "https://res.cloudinary.com/...",
                "owner_email": "user@example.com",
                "id": "60f1b5b5..."
            }
        }
    )
