import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface AuthState {
  token: string | null;
  mustChangePassword: boolean;
  role: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const mustChangePassword = sessionStorage.getItem('mustChangePassword') === 'true';
    return { token, role, mustChangePassword };
  });

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    sessionStorage.setItem('token', data.accessToken);
    sessionStorage.setItem('role', data.role);
    sessionStorage.setItem('mustChangePassword', String(data.mustChangePassword));
    setAuth({ token: data.accessToken, role: data.role, mustChangePassword: data.mustChangePassword });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('mustChangePassword');
    setAuth({ token: null, role: null, mustChangePassword: false });
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) throw new Error('Failed to change password');
    sessionStorage.setItem('mustChangePassword', 'false');
    setAuth((prev) => ({ ...prev, mustChangePassword: false }));
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
