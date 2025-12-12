# IWEB Exam Template

## Overview
This is a base template for Web Engineering (IWEB) exams, featuring:
- **Frontend**: React, TypeScript, TailwindCSS (Glassmorphism), Leaflet.
- **Backend**: FastAPI, MongoDB (Motor), Pydantic.
- **Services**: Cloudinary (Image Upload), OpenStreetMap (Geocoding), Google OAuth.

## Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Environment Variables
Create a `.env` file in the root directory (based on `.env.example` if available) or set these variables:

#### Backend
- `MONGO_URI`: MongoDB connection string.
- `DATABASE_NAME`: Database name.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name.
- `CLOUDINARY_API_KEY`: Cloudinary API Key.
- `CLOUDINARY_API_SECRET`: Cloudinary API Secret.
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID.

#### Frontend
- `VITE_API_URL`: Backend API URL.

### Running with Docker
```bash
docker-compose up --build
```

### Local Development

#### Backend
```bash
#### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
