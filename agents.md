# IWEB Exam Generic Template (Maps + Images + OAuth)

## Project Overview

This is a **base template** designed for Web Engineering (IWEB) exams that require:

1.  **Maps**: Visualization and geocoding (OpenStreetMap).
2.  **Images**: Upload and cloud storage (Cloudinary).
3.  **Authentication**: Social Login (Google OAuth).
4.  **Deployment**: Backend on Render, Frontend on Vercel, Database on MongoDB Atlas.

## Technology Stack

### Frontend (Clean Architecture)

-   **Core**: React 18+, TypeScript 5.0+, Vite.
-   **UI**: TailwindCSS (Minimalist Neobrutalism Style), Font Awesome.
-   **State Management**: React Context / Hooks (Clean Architecture adaptation).
-   **HTTP Client**: Axios.
-   **Maps**: `react-leaflet` + `leaflet`.
-   **Structure**:
    -   `presentation/`: UI Components, Pages, Context.
    -   `application/`: Custom Hooks (Use Cases).
    -   `domain/`: Interfaces and Models.
    -   `infrastructure/`: Axios and API calls.

### Backend (Modular Monolith)

-   **Core**: Python 3.11+, FastAPI.
-   **Database**: MongoDB Atlas (Motor - Async).
-   **Validation**: Pydantic V2.
-   **Structure**:
    -   `api/`: Routers and Endpoints.
    -   `services/`: Business Logic (Geocoding, Cloudinary, Auth).
    -   `repositories/`: Database Access.
    -   `models/`: Database Schemas (MongoDB documents).
    -   `schemas/`: API Request/Response Validation (Pydantic).
    -   `core/`: Configuration and Database connection.

## Development Requirements

### General Rules

1.  **Containerization**: Everything must be dockerized.
2.  **Naming Convention**: Use `snake_case` for **ALL** variables, functions, and file names (except React Components which use `PascalCase`).
3.  **Documentation**:
    -   All methods/functions must have docstrings (both backend and frontend).
    -   **Code**: English.
    -   **Comments/Docstrings**: Spanish (as per course requirements).

### Backend Specific Rules

1.  **Python 3.11+ Modern Syntax**:
    -   Use `|` for union types (e.g., `str | None` instead of `Optional[str]`).
    -   Use generic types directly (e.g., `list[str]`, `dict[str, int]`).
2.  **Pydantic V2**:
    -   Use `model_config = ConfigDict(...)` instead of `class Config:`.
    -   Use `json_schema_extra` in `ConfigDict` to define example requests for OpenAPI.
3.  **OpenAPI Documentation**:
    -   Ensure `FastAPI` auto-generates documentation based on docstrings and Pydantic schemas.
    -   All schemas must include `json_schema_extra` with realistic examples.
    -   All endpoint decorators must include `summary`, `description`, and `responses`.
    -   Main app must have metadata: `title`, `description`, `version`, `openapi_tags`.
4.  **Schemas vs Models**:
    -   **Schemas** (`schemas/`): API contracts for request/response validation.
    -   **Models** (`models/`): Database document representation (MongoDB).

### Frontend Specific Rules

1.  **Strict Clean Architecture**:
    -   **UI Layer** (Components/Pages) MUST NOT import repositories or make API calls directly.
    -   UI uses Custom Hooks (Use Cases) from the **Application Layer**.
    -   **Domain Layer** (Models/Interfaces) MUST NOT have external dependencies (no Axios, no React).
2.  **JSDoc**:
    -   All functions must have JSDoc docstrings with `@param` and `@returns` descriptions in Spanish.
3.  **Responsive Design**:
    -   The application MUST be fully responsive and work correctly on mobile, tablet, and desktop devices.
    -   Use TailwindCSS responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) to adapt layouts.
    -   Test on multiple screen sizes (320px, 768px, 1024px, 1920px minimum).
    -   Ensure touch-friendly interactions on mobile devices (minimum 44x44px touch targets).
4.  **Accessibility (WCAG 2.1 Level AA)**:
    -   **Semantic HTML**: Use proper HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
    -   **ARIA Labels**: Add `aria-label`, `aria-labelledby`, `aria-describedby` where necessary.
    -   **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Space, Escape).
    -   **Focus Management**: Visible focus indicators for keyboard navigation.
    -   **Alt Text**: All images must have descriptive `alt` attributes.
    -   **Color Contrast**: Minimum contrast ratio of 4.5:1 for text, 3:1 for UI components.
    -   **Form Labels**: All form inputs must have associated `<label>` elements.
    -   **Error Messages**: Form validation errors must be clearly announced to screen readers.
    -   **Skip Links**: Provide skip navigation links for keyboard users.

5.  **Modern Glassmorphism Style (Detailed Specification)**:
    - **Concept**: Airy, layered, depth-focused. Modern OS aesthetic (like macOS or iOS). Elements function as physical glass layers.
    - **Structure & Materials**:
        - **Base Layer**: Backgrounds should not be flat. Use subtle mesh gradients or soft animated blobs.
          `bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-teal-100`
        - **Glass Cards**:
          `bg-white/80` (Light Mode) or `bg-slate-900/80` (Dark Mode) for better contrast/accessibility.
          `backdrop-blur-xl` (Heavy blur for depth).
    - **Borders & Separation (The crisp edge)**:
        - **Outer Border**: `border border-white/40` (Simulates light catching the edge).
        - **Inner Highlight**: Use inner shadows to create volume. `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]`.
    - **Rounding**:
        - **Generous**: `rounded-2xl` (1rem) or even `rounded-3xl` for distinct floating panels.
    - **Typography**:
        - **Headings**: `text-slate-800 font-bold tracking-tight`.
        - **Body**: `text-slate-600 font-medium`.
    - **Shadows & Elevation**:
        - **Colored Shadows**: Avoid pure black shadows. Use colored shadows derived from the accent color.
          `shadow-xl shadow-indigo-500/10`
    - **Interactions**:
        - **Hover**: Lift and brighten. `hover:-translate-y-1 hover:bg-white/80 transition-all duration-300`.
        - **Active**: Press effect. `active:scale-95`.
    - **Example Component (Glass Card)**:
      > **Note**: Use decorative background blobs sparingly, only for main feature cards, not for every UI element.
      ```html
      <div class="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl transition-all hover:bg-white/90">
        <div class="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl group-hover:bg-purple-500/30 transition-colors"></div>
        <h3 class="text-lg font-bold text-slate-800 tracking-tight">Glass Card</h3>
        <p class="mt-2 text-slate-600 font-medium">Content floats on a blurred surface.</p>
      </div>
      ```

### Code Style Example

**Python (Backend):**

```python
async def get_locations(self, owner_email: str) -> list[Location]:
    """
    Obtiene todas las ubicaciones creadas por un usuario.
    :param owner_email: Email del propietario.
    :return: Lista de objetos Location.
    """
    pass
```

**TypeScript (Frontend):**

```typescript
/**
 * Obtiene la lista de ubicaciones del mapa.
 * @returns Promesa con la lista de modelos de ubicación.
 */
const get_locations = async (): Promise<Location_Model[]> => {
    // ... implementation
}
```

## Key Services (Backend)

### Geocoding (OpenStreetMap)

The service must receive an address/text and return latitude/longitude.

-   **API**: Nominatim (OSM).
-   **Endpoint**: `GET https://nominatim.openstreetmap.org/search?q={query}&format=json`

### Images (Cloudinary)

The service receives a binary file and returns a public URL.

-   **Library**: `cloudinary` (Python SDK).

### Authentication (Google OAuth)

The service handles user authentication via Google Identity Platform.

-   **Library**: `google-auth` / `fastapi-sso`.
-   **Flow**:
    1.  Frontend sends Google ID Token.
    2.  Backend verifies with Google.
    3.  Backend issues JWT Session.
    4.  **Important**: Frontend must send this JWT in the `Authorization` header (`Bearer <token>`) for ALL subsequent protected requests.

## Base Endpoints (`/api/v1`)

-   `POST /auth/login`: Receives Google token, returns session/JWT.
-   `GET /locations`: Lists points on the map.
-   `POST /locations`: Creates point (Auto Geocoding + Image Upload).
-   `GET /locations/{id}`: Details.
-   `POST /interactions`: Creates comment/visit.

## Quick Deployment Guide

1.  **MongoDB Atlas**: Create Cluster -> Database `exam_db` -> Get Connection String.
2.  **Cloudinary**: Get `CLOUD_NAME`, `API_KEY`, `API_SECRET`.
3.  **Google Cloud**: Create project -> Web OAuth Credentials -> Add domains.
4.  **Backend (Render)**:
    -   New Web Service -> Docker.
    -   Env Vars: `MONGO_URI`, `DATABASE_NAME`, Cloudinary vars, Google vars.
5.  **Frontend (Vercel)**:
    -   Import Project.
    -   Env Var: `VITE_API_URL` (Backend URL on Render).
