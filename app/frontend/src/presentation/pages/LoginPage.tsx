import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

export const LoginPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/map');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-500/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl"></div>
                
                <div className="mb-8 text-center relative z-10">
                    <div className="text-5xl mb-4 text-indigo-600 drop-shadow-sm">
                        <FontAwesomeIcon icon={faMapLocationDot} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
                        MiMapa
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Explora el mundo con estilo</p>
                </div>
                
                <div className="flex flex-col items-center space-y-6 relative z-10">
                    <div className="py-4 transform hover:scale-105 transition-transform duration-300">
                        <LoginButton />
                    </div>
                    
                    <p className="text-xs font-medium text-slate-400 text-center mt-4 border-t border-slate-200 pt-4 w-full">
                        Por Eduardo Gonzalez Bautista • v1.0
                    </p>
                </div>
            </div>
        </div>
    );
};
