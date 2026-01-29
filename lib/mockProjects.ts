// Mock projects data for development
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdBy: string; // User ID
  teamMembers: {
    userId: string;
    userName: string;
    role: 'admin' | 'qa' | 'developer';
  }[];
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  ticketCount: {
    total: number;
    pending: number;
    assigned: number;
    closed: number;
  };
}

export const mockProjects: Project[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js. Features include product catalog, shopping cart, payment integration, and order management.',
    status: 'active',
    createdBy: '1',
    teamMembers: [
      { userId: '1', userName: 'Admin User', role: 'admin' },
      { userId: '2', userName: 'John Developer', role: 'developer' },
      { userId: '3', userName: 'Jane QA', role: 'qa' },
      { userId: '7', userName: 'David Developer', role: 'developer' },
    ],
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    createdAt: '2024-01-10',
    updatedAt: '2026-01-28',
    ticketCount: {
      total: 12,
      pending: 3,
      assigned: 5,
      closed: 4,
    },
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Cross-platform mobile application using React Native. Includes user authentication, real-time notifications, and offline support.',
    status: 'active',
    createdBy: '1',
    teamMembers: [
      { userId: '1', userName: 'Admin User', role: 'admin' },
      { userId: '2', userName: 'John Developer', role: 'developer' },
      { userId: '4', userName: 'Sarah Developer', role: 'developer' },
      { userId: '6', userName: 'Emily QA', role: 'qa' },
    ],
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    createdAt: '2024-01-25',
    updatedAt: '2026-01-27',
    ticketCount: {
      total: 8,
      pending: 2,
      assigned: 3,
      closed: 3,
    },
  },
  {
    id: 'api-service',
    name: 'API Service',
    description: 'RESTful API service with GraphQL support. Microservices architecture with Docker and Kubernetes deployment.',
    status: 'active',
    createdBy: '1',
    teamMembers: [
      { userId: '1', userName: 'Admin User', role: 'admin' },
      { userId: '3', userName: 'Jane QA', role: 'qa' },
      { userId: '5', userName: 'Mike Developer', role: 'developer' },
    ],
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    createdAt: '2024-02-20',
    updatedAt: '2026-01-26',
    ticketCount: {
      total: 6,
      pending: 1,
      assigned: 2,
      closed: 3,
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard Redesign',
    description: 'Complete redesign of the admin dashboard with modern UI/UX. Includes data visualization, real-time analytics, and customizable widgets.',
    status: 'active',
    createdBy: '1',
    teamMembers: [
      { userId: '1', userName: 'Admin User', role: 'admin' },
      { userId: '3', userName: 'Jane QA', role: 'qa' },
      { userId: '4', userName: 'Sarah Developer', role: 'developer' },
      { userId: '6', userName: 'Emily QA', role: 'qa' },
    ],
    startDate: '2024-04-01',
    createdAt: '2024-03-25',
    updatedAt: '2026-01-28',
    ticketCount: {
      total: 5,
      pending: 2,
      assigned: 2,
      closed: 1,
    },
  },
  {
    id: 'legacy-migration',
    name: 'Legacy System Migration',
    description: 'Migrating legacy PHP application to modern tech stack. Data migration, API integration, and user training.',
    status: 'completed',
    createdBy: '1',
    teamMembers: [
      { userId: '1', userName: 'Admin User', role: 'admin' },
      { userId: '2', userName: 'John Developer', role: 'developer' },
      { userId: '3', userName: 'Jane QA', role: 'qa' },
    ],
    startDate: '2023-09-01',
    endDate: '2023-12-31',
    createdAt: '2023-08-15',
    updatedAt: '2024-01-05',
    ticketCount: {
      total: 25,
      pending: 0,
      assigned: 0,
      closed: 25,
    },
  },
  {
    id: 'internal-tools',
    name: 'Internal Tools',
    description: 'Collection of internal tools and utilities for team productivity. Includes time tracking, resource management, and reporting tools.',
    status: 'archived',
    createdBy: '1',
    teamMembers: [
      { userId: '1', userName: 'Admin User', role: 'admin' },
      { userId: '5', userName: 'Mike Developer', role: 'developer' },
    ],
    startDate: '2023-06-01',
    endDate: '2023-11-30',
    createdAt: '2023-05-20',
    updatedAt: '2023-12-01',
    ticketCount: {
      total: 15,
      pending: 0,
      assigned: 0,
      closed: 15,
    },
  },
];

// Helper functions
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getProjectsByStatus = (status: string): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

export const getActiveProjects = (): Project[] => {
  return mockProjects.filter(project => project.status === 'active');
};

export const searchProjects = (query: string): Project[] => {
  const lowerQuery = query.toLowerCase();
  return mockProjects.filter(project =>
    project.name.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery)
  );
};

export const getProjectStats = () => {
  return {
    total: mockProjects.length,
    active: mockProjects.filter(p => p.status === 'active').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    archived: mockProjects.filter(p => p.status === 'archived').length,
  };
};
