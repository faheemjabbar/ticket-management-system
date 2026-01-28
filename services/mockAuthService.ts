/**
 * Mock Authentication Service
 * Simulates backend API responses for testing without a real backend
 * 
 * To use mock mode:
 * 1. Set NEXT_PUBLIC_USE_MOCK_AUTH=true in .env.local
 * 2. Use the mock credentials from mocks/auth.mock.ts
 */

import { mockUsers, validateCredentials, emailExists, generateMockToken, MockUser } from '@/mocks/auth.mock';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'developer' | 'qa';
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'developer' | 'customer';
}

interface ErrorResponse {
  message: string;
}

/**
 * Mock login endpoint
 */
export const mockLogin = async (email: string, password: string): Promise<LoginResponse> => {
  await delay(800); // Simulate network delay

  const user = validateCredentials(email, password);

  if (!user) {
    throw {
      response: {
        status: 401,
        data: { message: 'Invalid email or password' }
      }
    };
  }

  // Generate mock token
  const token = generateMockToken(user);

  // Return user data (without password)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  };
};

/**
 * Mock register endpoint
 */
export const mockRegister = async (data: RegisterData): Promise<{ message: string }> => {
  await delay(800); // Simulate network delay

  // Check if email already exists
  if (emailExists(data.email)) {
    throw {
      response: {
        status: 422,
        data: { message: 'Email already exists' }
      }
    };
  }

  // Validate password length
  if (data.password.length < 6) {
    throw {
      response: {
        status: 422,
        data: { message: 'Password must be at least 6 characters' }
      }
    };
  }

  // In a real app, this would save to database
  // For mock, we just return success
  return {
    message: 'User created successfully'
  };
};

/**
 * Mock get current user endpoint
 */
export const mockGetCurrentUser = async (token: string): Promise<{ user: MockUser }> => {
  await delay(300); // Simulate network delay

  // Decode mock token
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== 'mock') {
      throw new Error('Invalid token');
    }

    const payload = JSON.parse(atob(parts[1]));

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      throw {
        response: {
          status: 401,
          data: { message: 'Token expired' }
        }
      };
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === payload.email);
    if (!user) {
      throw {
        response: {
          status: 401,
          data: { message: 'User not found' }
        }
      };
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
      }
    };
  } catch (error) {
    throw {
      response: {
        status: 401,
        data: { message: 'Invalid or expired token' }
      }
    };
  }
};

/**
 * Check if mock mode is enabled
 */
export const isMockMode = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';
};
