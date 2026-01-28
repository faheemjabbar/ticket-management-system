import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Attach token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          toast.error('Session expired. Please login again.');
          
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if not already on login/register page
          if (typeof window !== 'undefined' && 
              !window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          toast.error('You do not have permission to perform this action');
          break;
          
        case 404:
          // Not found
          toast.error(data?.message || 'Resource not found');
          break;
          
        case 422:
          // Validation error
          toast.error(data?.message || 'Validation error');
          break;
          
        case 500:
        case 502:
        case 503:
          // Server errors
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors - show backend message if available
          toast.error(data?.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
