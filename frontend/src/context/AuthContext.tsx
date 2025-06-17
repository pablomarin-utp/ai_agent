import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  credits: number;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateCredits: (newCredits: number) => void;
  checkAuthOnLoad: () => void;
}

interface JWTPayload {
  id: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const checkAuthOnLoad = () => {
    setIsLoading(true);
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      try {
        const decoded = jwtDecode<JWTPayload>(storedToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          setToken(storedToken);
          setUser({
            id: decoded.id,
            email: decoded.email,
            is_admin: decoded.is_admin,
            is_active: decoded.is_active,
            created_at: new Date().toISOString(), // This would come from API in real app
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      const accessToken = data.access_token;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      
      const decoded = jwtDecode<JWTPayload>(accessToken);
      setUser({
        id: decoded.id,
        email: decoded.email,
        is_admin: decoded.is_admin,
        is_active: decoded.is_active,
        created_at: new Date().toISOString(),
      });

      // Initialize credits (this would typically come from the backend)
      setCredits(100);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCredits(0);
  };

  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  useEffect(() => {
    checkAuthOnLoad();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    credits,
    login,
    register,
    logout,
    updateCredits,
    checkAuthOnLoad,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};