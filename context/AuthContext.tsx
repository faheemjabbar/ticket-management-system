'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { isMockMode, mockLogin, mockRegister, mockGetCurrentUser } from '@/services/mockAuthService';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'qa';
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        // Parse stored user
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Optionally verify token with backend
        try {
          if (isMockMode()) {
            // Use mock service
            const response = await mockGetCurrentUser(token);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
            // Use real API
            const response = await axiosInstance.get('/api/auth/me');
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          // Token invalid, clear auth state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      let response;

      if (isMockMode()) {
        // Use mock service
        response = await mockLogin(email, password);
      } else {
        // Use real API
        const res = await axiosInstance.post('/api/auth/login', {
          email,
          password,
        });
        response = res.data;
      }

      const { token, user } = response;

      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);

      // Show success message
      toast.success('Login successful!');

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      // Show error message
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      if (isMockMode()) {
        // Use mock service
        await mockRegister({ name, email, password, role: role as any });
      } else {
        // Use real API
        await axiosInstance.post('/api/auth/register', {
          name,
          email,
          password,
          role,
        });
      }

      // Show success message
      toast.success('Account created successfully!');

      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error: any) {
      // Show error message
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setUser(null);

    // Show message
    toast.success('Logged out successfully');

    // Redirect to login
    router.push('/login');
  };

  // Check if user has specific role(s)
  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
