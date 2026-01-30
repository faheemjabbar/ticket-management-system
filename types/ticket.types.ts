export enum TicketStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  AWAITING = 'awaiting',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'assigned' | 'awaiting' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project: string;
  projectId: string;
  labels: string[];
  author: string;
  authorId: string;
  assignedTo?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface HistoryEntry {
  id: string;
  ticketId: string;
  user: string;
  userId: string;
  action: string;
  timestamp: string;
  details?: string;
}