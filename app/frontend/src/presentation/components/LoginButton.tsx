import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../../infrastructure/api/axios_client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente de botón de login con Google OAuth.
 * Maneja el flujo de autenticación y muestra estados de carga y error.
 */
export const LoginButton = () => {
    const { login } = useAuth();
    const [is_loading, set_is_loading] = useState(false);
    const [error_message, set_error_message] = useState<string | null>(null);

    /**
     * Maneja el éxito de la autenticación con Google.
     * Envía el token al backend y actualiza el contexto de autenticación.
     * @param credentialResponse - Respuesta de Google con el token de autenticación
     */
    const handleSuccess = async (credentialResponse: any) => {
        set_is_loading(true);
        set_error_message(null);
        
        try {
            // 1. Enviar Google Token al Backend para verificar y obtener JWT de sesión
            const res = await api.post('/auth/login', {
                google_token: credentialResponse.credential
            });

            // 2. Decodificar info del usuario desde el token o obtenerla de la respuesta
            console.log("Login response:", res.data);
            const { access_token, user } = res.data;
            
            // 3. Actualizar Context
            login(access_token, user);
            
        } catch (error: any) {
            console.error("Login failed", error);
            
            // Mostrar mensaje de error apropiado
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                set_error_message('El servidor está tardando mucho en responder. Por favor, espera...');
            } else if (error.code === 'ERR_NETWORK') {
                set_error_message('No se pudo conectar con el servidor. Verifica tu conexión.');
            } else if (error.response?.status === 401) {
                set_error_message('Error de autenticación. Por favor, intenta nuevamente.');
            } else {
                set_error_message('Error al iniciar sesión. Por favor, intenta nuevamente.');
            }
            
            // Limpiar el error después de 5 segundos
            setTimeout(() => set_error_message(null), 5000);
        } finally {
            set_is_loading(false);
        }
    };

    /**
     * Maneja errores en el flujo de Google OAuth.
     */
    const handleError = () => {
        console.error('Google OAuth Login Failed');
        set_error_message('Error al conectar con Google. Por favor, intenta nuevamente.');
        setTimeout(() => set_error_message(null), 5000);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl p-2 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all duration-300">
                {is_loading ? (
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/80 rounded-xl border border-white/50">
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-indigo-600" />
                        <span className="font-bold text-slate-700">Conectando...</span>
                    </div>
                ) : (
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        shape="pill"
                        theme="outline"
                        size="large"
                        text="signin_with"
                    />
                )}
            </div>
            
            {error_message && (
                <div className="bg-red-50/90 backdrop-blur-md border border-red-200 rounded-xl p-3 max-w-md shadow-sm">
                    <div className="flex items-start gap-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mt-1" />
                        <p className="text-sm font-medium text-red-800">{error_message}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
