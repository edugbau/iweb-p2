/**
 * Contexto de Autenticación.
 * Provee el estado de autenticación a toda la aplicación.
 */

import { createContext, useContext, ReactNode } from 'react';
import { use_auth } from '../../application/hooks';
import type { User_Model } from '../../domain/models';

/**
 * Tipo del contexto de autenticación.
 */
interface Auth_Context_Type {
    user: User_Model | null;
    is_loading: boolean;
    is_authenticated: boolean;
    error: string | null;
    login: () => void;
    logout: () => void;
    handle_callback: (token: string) => Promise<void>;
}

const AuthContext = createContext<Auth_Context_Type | undefined>(undefined);

/**
 * Props del proveedor de autenticación.
 */
interface Auth_Provider_Props {
    children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación.
 * @param props - Props con children.
 * @returns Componente proveedor.
 */
export const AuthProvider = ({ children }: Auth_Provider_Props) => {
    const auth = use_auth();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook para acceder al contexto de autenticación.
 * @returns Estado y funciones de autenticación.
 * @throws Error si se usa fuera del AuthProvider.
 */
export const useAuthContext = (): Auth_Context_Type => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuthContext debe usarse dentro de un AuthProvider');
    }

    return context;
};
