import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { ReviewsPage } from '../pages/ReviewsPage';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de ruta protegida.
 * Redirige a login si el usuario no está autenticado.
 * @param children Componentes hijos a renderizar si autenticado.
 * @returns Componente hijo o redirección a login.
 */
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};

/**
 * Router principal de la aplicación ReViews.
 * Define las rutas públicas y protegidas.
 * @returns Componente Router con todas las rutas.
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Ruta protegida - Página principal de reseñas */}
        <Route 
            path="/reviews" 
            element={
                <ProtectedRoute>
                    <ReviewsPage />
                </ProtectedRoute>
            } 
        />
        
        {/* Redirigir rutas antiguas */}
        <Route path="/map" element={<Navigate to="/reviews" replace />} />
        
        {/* Fallback - Redirigir a inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

