// Mock users data for development
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'qa';
  avatar?: string;
  projects: string[]; // Array of project IDs
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@tickflo.com',
    role: 'admin',
    projects: ['ecommerce', 'mobile-app', 'api-service', 'dashboard'],
    isActive: true,
    createdAt: '2024-01-15',
    lastLogin: '2026-01-28',
  },
  {
    id: '2',
    name: 'John Developer',
    email: 'john@tickflo.com',
    role: 'developer',
    projects: ['ecommerce', 'mobile-app'],
    isActive: true,
    createdAt: '2024-02-01',
    lastLogin: '2026-01-28',
  },
  {
    id: '3',
    name: 'Jane QA',
    email: 'qa@tickflo.com',
    role: 'qa',
    projects: ['ecommerce', 'api-service', 'dashboard'],
    isActive: true,
    createdAt: '2024-02-10',
    lastLogin: '2026-01-27',
  },
  {
    id: '4',
    name: 'Sarah Developer',
    email: 'sarah@tickflo.com',
    role: 'developer',
    projects: ['mobile-app', 'dashboard'],
    isActive: true,
    createdAt: '2024-03-05',
    lastLogin: '2026-01-28',
  },
  {
    id: '5',
    name: 'Mike Developer',
    email: 'mike@tickflo.com',
    role: 'developer',
    projects: ['api-service'],
    isActive: true,
    createdAt: '2024-03-20',
    lastLogin: '2026-01-26',
  },
  {
    id: '6',
    name: 'Emily QA',
    email: 'emily@tickflo.com',
    role: 'qa',
    projects: ['mobile-app', 'dashboard'],
    isActive: true,
    createdAt: '2024-04-01',
    lastLogin: '2026-01-28',
  },
  {
    id: '7',
    name: 'David Developer',
    email: 'david@tickflo.com',
    role: 'developer',
    projects: ['ecommerce'],
    isActive: false,
    createdAt: '2024-05-10',
    lastLogin: '2026-01-20',
  },
];

export const mockProjects = [
  { id: 'ecommerce', name: 'E-Commerce Platform' },
  { id: 'mobile-app', name: 'Mobile App' },
  { id: 'api-service', name: 'API Service' },
  { id: 'dashboard', name: 'Dashboard Redesign' },
];

// Helper functions
export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: string): MockUser[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getActiveUsers = (): MockUser[] => {
  return mockUsers.filter(user => user.isActive);
};

export const searchUsers = (query: string): MockUser[] => {
  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(user =>
    user.name.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery) ||
    user.role.toLowerCase().includes(lowerQuery)
  );
};
