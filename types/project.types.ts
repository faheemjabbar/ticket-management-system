export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  createdBy: string;
  teamMembers: TeamMember[];
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  ticketCount?: {
    total: number;
    pending: number;
    assigned: number;
    closed: number;
  };
}

export interface TeamMember {
  userId: string;
  userName: string;
  role: 'admin' | 'qa' | 'developer';
  assignedAt?: string;
}
