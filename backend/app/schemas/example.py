from pydantic import BaseModel, ConfigDict, Field

class ExampleSchema(BaseModel):
    name: str = Field(..., description="Name of the example")
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "My Example"
            }
        }
    )
