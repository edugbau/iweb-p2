from odmantic import Model, Field
from typing import Optional

class Location(Model):
    name: str
    address: str
    latitude: float
    longitude: float
    image_url: Optional[str] = None
    owner_email: str
    
    model_config = {
        "collection": "locations"
    }
