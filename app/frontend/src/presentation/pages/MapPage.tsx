import { useAuth } from '../context/AuthContext';
import { MapComponent } from '../components/MapComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMap } from '@fortawesome/free-solid-svg-icons';

export const MapPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header Glassmorphism */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 p-4 flex justify-between items-center shadow-sm z-20 relative">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100/50 p-2 rounded-xl border border-indigo-200/50 text-indigo-600">
                        <FontAwesomeIcon icon={faMap} className="text-xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight hidden sm:block">
                        Panel de Usuario
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="flex items-center gap-3 bg-white/50 border border-white/60 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                            <img 
                                src={user.picture} 
                                alt={user.name} 
                                className="w-8 h-8 rounded-full border border-white shadow-sm"
                                referrerPolicy="no-referrer"
                            />
                            <span className="font-semibold text-slate-700 text-sm hidden sm:inline-block pr-2">
                                {user.name}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="bg-white/80 text-slate-700 border border-white/60 px-4 py-2 rounded-xl font-semibold shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
                        aria-label="Cerrar sesión"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-slate-500" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content con Mapa */}
            <main className="flex-1 p-4 relative z-10">
                <div className="h-full w-full border border-white/40 shadow-xl shadow-indigo-500/5 bg-white/60 backdrop-blur-lg rounded-3xl p-2 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-10 rounded-3xl"></div>
                    <div className="h-full w-full rounded-2xl overflow-hidden relative z-0">
                    <MapComponent />
                    </div>
                </div>
            </main>
        </div>
    );
};
