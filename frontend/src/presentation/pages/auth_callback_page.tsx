/**
 * Página de callback de autenticación OAuth.
 * Procesa el token recibido de Google y redirige.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../context';
import { Loading } from '../components';

/**
 * Página de callback OAuth.
 * @returns Componente JSX de la página de callback.
 */
export const AuthCallbackPage = () => {
    const [search_params] = useSearchParams();
    const navigate = useNavigate();
    const { handle_callback } = useAuthContext();
    const [error, set_error] = useState<string | null>(null);

    useEffect(() => {
        const process_callback = async () => {
            const token = search_params.get('token');

            if (!token) {
                set_error('No se recibió token de autenticación');
                return;
            }

            try {
                await handle_callback(token);
                // Redirigir a la página principal
                navigate('/', { replace: true });
            } catch (err) {
                set_error('Error al procesar la autenticación');
            }
        };

        process_callback();
    }, [search_params, handle_callback, navigate]);

    if (error) {
        return (
            <main className="main-container flex items-center justify-center">
                <div className="glass-card p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-exclamation-triangle text-red-500 text-2xl" aria-hidden="true"></i>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 mb-2">
                        Error de autenticación
                    </h1>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <a
                        href="/"
                        className="btn-primary inline-flex"
                    >
                        <i className="fas fa-home" aria-hidden="true"></i>
                        Volver al inicio
                    </a>
                </div>
            </main>
        );
    }

    return (
        <main className="main-container flex items-center justify-center">
            <div className="glass-card p-8 text-center">
                <Loading message="Procesando autenticación..." />
                <p className="text-slate-500 mt-4">
                    Serás redirigido automáticamente
                </p>
            </div>
        </main>
    );
};
