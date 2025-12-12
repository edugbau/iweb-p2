# IWEB Exam Template

Plantilla genérica para exámenes de Ingeniería Web con Maps, Images y OAuth.

## 🚀 Tecnologías

### Backend
- **FastAPI** con Python 3.11+
- **MongoDB Atlas** (Motor async)
- **Cloudinary** para imágenes
- **Google OAuth 2.0**

### Frontend
- **React 18** + TypeScript + Vite
- **TailwindCSS** (Glassmorphism)
- **Leaflet** para mapas
- **Clean Architecture**

## 📁 Estructura

```
├── backend/
│   ├── api/v1/          # Endpoints REST
│   ├── core/            # Config y DB
│   ├── models/          # Modelos MongoDB
│   ├── schemas/         # Pydantic V2
│   ├── repositories/    # Acceso a datos
│   ├── services/        # Lógica de negocio
│   └── main.py
├── frontend/
│   └── src/
│       ├── domain/      # Interfaces
│       ├── infrastructure/  # API client
│       ├── application/ # Hooks
│       └── presentation/    # Componentes
└── docker-compose.yml
```

## ⚡ Inicio rápido

### Con Docker (recomendado)
```bash
docker-compose up
```

### Sin Docker
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 🔗 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Docs API**: http://localhost:8000/docs

## 🔐 Variables de entorno

Copiar `.env.example` a `.env` con valores reales:

| Variable | Descripción |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_*` | Credenciales Cloudinary |
| `GOOGLE_CLIENT_*` | OAuth credentials |
