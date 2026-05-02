import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'teacher' | 'student' | 'admin';
  studio?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'owner' | 'teacher' | 'student';
  studioName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('yogify_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('yogify_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('yogify_token', data.token);
    setUser(data.user);
  };

  const register = async (form: RegisterData) => {
    const { data } = await api.post('/auth/register', form);
    localStorage.setItem('yogify_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('yogify_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
