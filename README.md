# ReViews - Aplicación de Reseñas

Aplicación web de reseñas de establecimientos similar a TripAdvisor, desarrollada para el parcial de IWEB.

## 🌟 Funcionalidades

### Identificación (OAuth 2.0)
- Login/logout con Google OAuth
- Autenticación requerida para todas las operaciones
- Token JWT para comunicación con backend

### Visualización de Reseñas
- Listado de reseñas con:
  - Nombre del establecimiento
  - Dirección postal
  - Coordenadas GPS (lon, lat)
  - Valoración de 0 a 5 puntos
- Vista detallada con:
  - Email y nombre del autor
  - Fechas de emisión y caducidad del token
  - Token OAuth usado para crear la reseña
  - Galería de imágenes

### Creación de Reseñas
- Formulario con:
  - Nombre del establecimiento
  - Dirección postal (geocodificación automática)
  - Valoración (0-5 estrellas)
  - Múltiples imágenes (Cloudinary)

### Mapas y Geocoding
- Mapa interactivo con marcadores de reseñas
- Buscador de direcciones (geocoding)
- Centrado automático en dirección buscada

## 🛠 Tecnologías

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS (Glassmorphism)
- React-Leaflet (mapas)
- Axios (HTTP client)
- Clean Architecture

### Backend
- Python 3.11 + FastAPI
- MongoDB Atlas (Motor async)
- Cloudinary (imágenes)
- OpenStreetMap/Nominatim (geocoding)
- Google OAuth 2.0

## 🚀 Instalación

### Requisitos
- Docker y Docker Compose
- Cuenta de Google Cloud (OAuth)
- Cuenta de Cloudinary
- Cluster de MongoDB Atlas

### Variables de Entorno

#### Backend (`app/backend/.env`)
```env
MONGO_URI=mongodb+srv://...
DATABASE_NAME=reviews_db
GOOGLE_CLIENT_ID=your-client-id
SECRET_KEY=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

#### Frontend (`app/frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GOOGLE_CLIENT_ID=your-client-id
```

### Ejecución con Docker
```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Docs API: http://localhost:8000/docs

## 📚 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login con Google |
| GET | `/api/v1/reviews` | Listar reseñas |
| GET | `/api/v1/reviews/{id}` | Detalle de reseña |
| POST | `/api/v1/reviews` | Crear reseña |
| DELETE | `/api/v1/reviews/{id}` | Eliminar reseña |
| POST | `/api/v1/reviews/geocode` | Geocodificar dirección |

## 📁 Estructura del Proyecto

```
app/
├── backend/
│   ├── api/v1/endpoints/    # Endpoints REST
│   ├── models/              # Modelos MongoDB
│   ├── schemas/             # Schemas Pydantic
│   ├── repositories/        # Acceso a datos
│   ├── services/            # Lógica de negocio
│   └── core/                # Configuración
└── frontend/
    └── src/
        ├── domain/          # Modelos e interfaces
        ├── application/     # Casos de uso (hooks)
        ├── infrastructure/  # APIs y repositorios
        └── presentation/    # Componentes React
```

## 👤 Autor

Eduardo González Bautista - IWEB Parcial 2
