import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
}