import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
    const { login } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-purple-100 to-teal-100">
            <div className="rounded-2xl border border-white/40 bg-white/80 p-8 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
                <h1 className="mb-6 text-2xl font-bold text-slate-800 tracking-tight text-center">
                    IWEB Exam Template
                </h1>
                <p className="mb-8 text-slate-600 text-center">
                    Sign in to access the map and share locations.
                </p>
                <button
                    onClick={login}
                    className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};
