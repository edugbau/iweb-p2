import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const { setToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setToken(token);
            navigate("/"); // Redirect to home/map
        } else {
            navigate("/login");
        }
    }, [searchParams, setToken, navigate]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xl font-medium text-slate-600">Authenticating...</p>
        </div>
    );
};
