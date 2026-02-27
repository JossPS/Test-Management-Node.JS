import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { LoginResponse, User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshMe = async () => {
    const stored = localStorage.getItem('token');
    if (!stored) {
      setUser(null);
      setToken(null);
      return;
    }

    const res = await api.get<User>('/api/users/me');
    setUser(res.data);
    setToken(stored);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post<LoginResponse>('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch {
        // token inválido o expirado
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}