'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
// import { isMockMode, mockLogin, mockRegister, mockGetCurrentUser } from '@/services/mockAuthService';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'qa';
  isActive: boolean;
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
      // let response;

      // if (isMockMode()) {
      //   // Use mock service
      //   response = await mockLogin(email, password);
      // } else {
        // Use real API
        console.log('🔐 Login attempt:', { email, password: '***' });
        const res = await axiosInstance.post('/auth/login', {
          email,
          password,
        });
        console.log('✅ Login response:', res.data);
        const response = res.data;
      // }

      const { access_token: token, user } = response;

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
      // Log detailed error for debugging
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Show error message
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      // if (isMockMode()) {
      //   // Use mock service
      //   await mockRegister({ name, email, password, role: role as any });
      // } else {
        // Use real API
        console.log('📝 Register attempt:', { name, email, role, password: '***' });
        const res = await axiosInstance.post('/auth/register', {
          name,
          email,
          password,
          role,
        });
        console.log('✅ Register response:', res.data);
      // }

      // Show success message
      toast.success('Account created successfully!');

      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error: any) {
      // Log detailed error for debugging
      console.error('❌ Register error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
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
