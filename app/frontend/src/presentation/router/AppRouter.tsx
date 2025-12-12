import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { MapPage } from '../pages/MapPage';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
            path="/map" 
            element={
                <ProtectedRoute>
                    <MapPage />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/map/:email" 
            element={
                <ProtectedRoute>
                    <div>User Map Page (Protected)</div>
                </ProtectedRoute>
            } 
        />
      </Routes>
    </BrowserRouter>
  );
};

