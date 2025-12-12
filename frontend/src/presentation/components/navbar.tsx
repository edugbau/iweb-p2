/**
 * Componente Navbar con estilo glassmorphism.
 * Barra de navegación principal de la aplicación.
 */

import { useAuthContext } from '../context';

/**
 * Barra de navegación con autenticación.
 * @returns Componente JSX de la navbar.
 */
export const Navbar = () => {
    const { user, is_authenticated, login, logout } = useAuthContext();

    return (
        <nav className="navbar" role="navigation" aria-label="Navegación principal">
            <div className="navbar-content">
                {/* Logo y título */}
                <a
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors"
                    aria-label="Ir a inicio"
                >
                    <i className="fas fa-map-marked-alt text-indigo-600" aria-hidden="true"></i>
                    <span>IWEB Maps</span>
                </a>

                {/* Acciones de usuario */}
                <div className="flex items-center gap-4">
                    {is_authenticated && user ? (
                        <>
                            {/* Perfil del usuario */}
                            <div className="flex items-center gap-3">
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={`Foto de perfil de ${user.name}`}
                                        className="user-avatar"
                                    />
                                ) : (
                                    <div
                                        className="user-avatar flex items-center justify-center bg-indigo-100 text-indigo-600"
                                        aria-hidden="true"
                                    >
                                        <i className="fas fa-user"></i>
                                    </div>
                                )}
                                <span className="hidden md:inline text-sm font-medium text-slate-700">
                                    {user.name}
                                </span>
                            </div>

                            {/* Botón de logout */}
                            <button
                                onClick={logout}
                                className="btn-secondary text-sm"
                                aria-label="Cerrar sesión"
                            >
                                <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                                <span className="hidden sm:inline">Salir</span>
                            </button>
                        </>
                    ) : (
                        /* Botón de login */
                        <button
                            onClick={login}
                            className="btn-primary"
                            aria-label="Iniciar sesión con Google"
                        >
                            <i className="fab fa-google" aria-hidden="true"></i>
                            <span>Iniciar sesión</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};
