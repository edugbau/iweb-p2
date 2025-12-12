from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class LocationModel(BaseModel):
    id: str | None = Field(None, alias="_id")
    title: str
    description: str | None = None
    address: str
    latitude: float | None = None
    longitude: float | None = None
    image_url: str | None = None
    owner_email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "title": "Torre Eiffel",
                "address": "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
                "latitude": 48.8584,
                "longitude": 2.2945,
                "image_url": "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
                "owner_email": "user@example.com"
            }
        }
    )
