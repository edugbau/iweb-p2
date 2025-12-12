import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    login: () => void;
    logout: () => void;
    setToken: (token: string) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setTokenState] = useState<string | null>(localStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    const setToken = (newToken: string) => {
        setTokenState(newToken);
    };

    const login = () => {
        // Redirect to backend login
        window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/login`;
    };

    const logout = () => {
        setTokenState(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, setToken, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
