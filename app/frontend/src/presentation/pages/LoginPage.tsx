import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

/**
 * Página de inicio de sesión de la aplicación ReViews.
 * Permite autenticarse con Google OAuth.
 * @returns Página de login con botón de Google.
 */
export const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/reviews');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-teal-100">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl"></div>
                
                <div className="mb-8 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/30 mb-4">
                        <FontAwesomeIcon icon={faStar} className="text-4xl text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                        ReViews
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        Descubre y comparte reseñas de establecimientos
                    </p>
                </div>
                
                <div className="flex flex-col items-center space-y-6 relative z-10">
                    <div className="py-4 transform hover:scale-105 transition-transform duration-300">
                        <LoginButton />
                    </div>
                    
                    <div className="text-center text-sm text-slate-500 mt-4 space-y-2">
                        <p className="font-medium">✨ Crea reseñas con fotos</p>
                        <p className="font-medium">📍 Geocodificación automática</p>
                        <p className="font-medium">⭐ Valoraciones de 0 a 5</p>
                    </div>
                    
                    <p className="text-xs font-medium text-slate-400 text-center mt-4 border-t border-slate-200 pt-4 w-full">
                        IWEB - Parcial 2 • Aplicación de Reseñas
                    </p>
                </div>
            </div>
        </div>
    );
};
