# Guía de Configuración e Instrucciones (Setup)

Esta guía explica cómo configurar y ejecutar el proyecto genérico de IWEB (Mapas + Imágenes + OAuth).

## 1. Requisitos Previos

- **Docker Desktop** instalado y corriendo.
- **Node.js 18+** y **Python 3.11+** (opcional si usas Docker, pero útil para desarrollo local).

---

## 2. Obtención de Credenciales (API Keys)

Para que la aplicación funcione, necesitas obtener credenciales de tres servicios externos.

### A. MongoDB Atlas (Base de Datos)
1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crea una cuenta y un clúster gratuito (M0).
3. En **Database Access**, crea un usuario y contraseña.
4. En **Network Access**, permite el acceso desde cualquier IP (`0.0.0.0/0`).
5. Ve a **Database** -> **Connect** -> **Drivers** y copia la "Connection String".
   - Formato: `mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority`

### B. Cloudinary (Imágenes)
1. Regístrate en [Cloudinary](https://cloudinary.com/).
2. En el **Dashboard**, copia:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

### C. Google Cloud Console (OAuth Login)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto.
3. Ve a **APIs & Services** -> **OAuth consent screen**.
   - User Type: **External**.
   - Rellena los datos básicos.
4. Ve a **Credentials** -> **Create Credentials** -> **OAuth client ID**.
   - Application type: **Web application**.
   - **Authorized JavaScript origins**: `http://localhost:5173`
   - **Authorized redirect URIs**: `http://localhost:5173`
5. Copia el **Client ID** y el **Client Secret**.

---

## 3. Configuración de Variables de Entorno (.env)

Debes crear **dos** archivos `.env`, uno para el backend y otro para el frontend.

### Backend (`app/backend/.env`)

Crea este archivo y rellena con tus datos:

```env
# Tu cadena de conexión de MongoDB Atlas
MONGO_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/midb
DATABASE_NAME=exam_db

# Credenciales de Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Credenciales de Google (Solo ID y Secret)
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### Frontend (`app/frontend/.env`)

Crea este archivo y rellena con tus datos:

```env
# URL del Backend API (dejar tal cual para Docker/Local)
VITE_API_URL=http://localhost:8000/api/v1

# El mismo Client ID de Google que pusiste en el backend
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
```

---

## 4. Ejecución del Proyecto (Docker)

La forma más fácil de arrancar todo es usando Docker Compose.

1. Abre una terminal en la raíz del proyecto (donde está `docker-compose.yml`).
2. Ejecuta:
   ```bash
   docker-compose up --build
   ```
3. Espera a que se construyan los contenedores.
4. Abre el navegador:
   - **Frontend**: http://localhost:5173
   - **Backend Docs (Swagger)**: http://localhost:8000/docs
   - **Backend Docs (ReDoc)**: http://localhost:8000/redoc
   - **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## 5. Ejecución Manual (Sin Docker)

Si prefieres correrlo manualmente:

### Backend
```bash
cd app/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd app/frontend
npm install
npm run dev
```

---

## 6. Resumen de Tareas (TODO)

- [ ] Crear Clúster en MongoDB Atlas.
- [ ] Crear cuenta en Cloudinary.
- [ ] Crear proyecto en Google Cloud y configurar OAuth.
- [ ] Crear archivo `app/backend/.env`.
- [ ] Crear archivo `app/frontend/.env`.
- [ ] Ejecutar `docker-compose up`.

