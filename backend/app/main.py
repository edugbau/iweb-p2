from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Startup: Connecting to database...")
    yield
    # Shutdown
    print("Shutdown: Disconnecting from database...")

app = FastAPI(
    title="IWEB Backend",
    description="Backend for IWEB Exam",
    version="1.0.0",
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Locations", "description": "Operations with locations"},
        {"name": "Auth", "description": "Authentication operations"}
    ]
)

# CORS code for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

# TODO: Include routers
from app.api.endpoints import locations, auth
app.include_router(locations.router, prefix="/api/v1/locations", tags=["Locations"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
