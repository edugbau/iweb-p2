from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class InteractionModel(BaseModel):
    """Generic interaction: Comment, Like, Visit, Review"""
    id: str | None = Field(None, alias="_id")
    location_id: str
    user_email: str
    type: str = "generic" # 'comment', 'visit', 'like'
    content: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)

