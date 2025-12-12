/**
 * Componente principal de la aplicación.
 * Configura el routing y los proveedores de contexto.
 */

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './presentation/context';
import { Navbar } from './presentation/components';
import { HomePage, AuthCallbackPage } from './presentation/pages';

/**
 * Aplicación principal con routing.
 * @returns Componente JSX de la aplicación.
 */
function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen">
                {/* Navbar global */}
                <Navbar />

                {/* Rutas de la aplicación */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
