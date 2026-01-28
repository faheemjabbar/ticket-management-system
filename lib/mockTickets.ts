// Mock ticket data for development
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
  comments: Comment[];
  attachments: Attachment[];
  history: HistoryEntry[];
}

export interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface HistoryEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
}

export const mockTickets: Ticket[] = [
  {
    id: '#17',
    title: 'How long should the demo be?',
    description: 'I need clarification on the expected duration of the project demo. Should it cover all features or just the main functionality?',
    status: 'pending',
    priority: 'medium',
    project: 'E-Commerce Platform',
    projectId: 'ecommerce',
    labels: ['Assignment', 'Question'],
    author: 'Bryan Student',
    authorId: '1',
    createdAt: 'Today at 08:33',
    updatedAt: 'Today at 08:33',
    deadline: '2026-02-15',
    comments: [],
    attachments: [],
    history: [
      {
        id: 'h1',
        user: 'Bryan Student',
        action: 'created',
        timestamp: 'Today at 08:33',
      },
    ],
  },
  {
    id: '#11',
    title: 'Should the SWEBÖK panel questions I answer be related to my project?',
    description: 'I\'m working on the mobile app project, but some SWEBÖK questions seem more relevant to web development. Should I focus only on questions related to mobile development?',
    status: 'pending',
    priority: 'high',
    project: 'Mobile App',
    projectId: 'mobile-app',
    labels: ['SWEBÖK', 'Individual Report', 'e-Journal'],
    author: 'Bryan Student',
    authorId: '1',
    createdAt: 'Yesterday at 23:23',
    updatedAt: 'Yesterday at 23:23',
    comments: [
      {
        id: 'c1',
        author: 'Jane QA',
        authorId: '3',
        content: 'Good question! You should answer questions that are most relevant to your project domain.',
        createdAt: 'Today at 09:15',
      },
    ],
    attachments: [],
    history: [
      {
        id: 'h1',
        user: 'Bryan Student',
        action: 'created',
        timestamp: 'Yesterday at 23:23',
      },
      {
        id: 'h2',
        user: 'Jane QA',
        action: 'commented',
        timestamp: 'Today at 09:15',
      },
    ],
  },
  {
    id: '#10',
    title: 'Why are there no project proposals for e-Journal?',
    description: 'I noticed that the e-Journal section doesn\'t have any project proposals listed. Is this intentional or should we submit our own proposals?',
    status: 'assigned',
    priority: 'low',
    project: 'API Service',
    projectId: 'api-service',
    labels: ['e-Journal', 'Question'],
    author: 'Bryan Student',
    authorId: '1',
    assignedTo: 'John Developer',
    assignedToId: '2',
    createdAt: 'Friday at 08:33',
    updatedAt: 'Friday at 10:20',
    comments: [],
    attachments: [],
    history: [
      {
        id: 'h1',
        user: 'Bryan Student',
        action: 'created',
        timestamp: 'Friday at 08:33',
      },
      {
        id: 'h2',
        user: 'Jane QA',
        action: 'assigned to John Developer',
        timestamp: 'Friday at 10:20',
      },
    ],
  },
  {
    id: '#8',
    title: 'Is there a lecture on the day of the demo?',
    description: 'I want to plan my schedule accordingly. Will there be a regular lecture session on the day of the project demo, or is the entire day dedicated to presentations?',
    status: 'closed',
    priority: 'low',
    project: 'Dashboard Redesign',
    projectId: 'dashboard',
    labels: ['Lecture', 'Individual Report'],
    author: 'Bryan Student',
    authorId: '1',
    assignedTo: 'John Developer',
    assignedToId: '2',
    createdAt: 'Wednesday at 17:05',
    updatedAt: 'Thursday at 14:30',
    deadline: '2026-01-30',
    comments: [
      {
        id: 'c1',
        author: 'Jane QA',
        authorId: '3',
        content: 'No regular lecture on demo day. The entire day is reserved for presentations.',
        createdAt: 'Thursday at 14:30',
      },
    ],
    attachments: [],
    history: [
      {
        id: 'h1',
        user: 'Bryan Student',
        action: 'created',
        timestamp: 'Wednesday at 17:05',
      },
      {
        id: 'h2',
        user: 'Jane QA',
        action: 'assigned to John Developer',
        timestamp: 'Wednesday at 18:00',
      },
      {
        id: 'h3',
        user: 'Jane QA',
        action: 'commented',
        timestamp: 'Thursday at 14:30',
      },
      {
        id: 'h4',
        user: 'Jane QA',
        action: 'closed',
        timestamp: 'Thursday at 14:30',
      },
    ],
  },
  {
    id: '#3',
    title: 'What is the next SWEBÖK panel?',
    description: 'Could someone share the schedule for upcoming SWEBÖK panel discussions? I want to make sure I don\'t miss any important sessions.',
    status: 'assigned',
    priority: 'medium',
    project: 'E-Commerce Platform',
    projectId: 'ecommerce',
    labels: ['SWEBÖK'],
    author: 'Yani Student',
    authorId: '4',
    assignedTo: 'John Developer',
    assignedToId: '2',
    createdAt: 'Today at 00:08',
    updatedAt: 'Today at 08:00',
    comments: [],
    attachments: [],
    history: [
      {
        id: 'h1',
        user: 'Yani Student',
        action: 'created',
        timestamp: 'Today at 00:08',
      },
      {
        id: 'h2',
        user: 'Jane QA',
        action: 'assigned to John Developer',
        timestamp: 'Today at 08:00',
      },
    ],
  },
];

export const getTicketById = (id: string): Ticket | undefined => {
  return mockTickets.find(ticket => ticket.id === id);
};

export const getTicketsByProject = (projectId: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.projectId === projectId);
};

export const getTicketsByStatus = (status: string): Ticket[] => {
  return mockTickets.filter(ticket => ticket.status === status);
};

export const searchTickets = (query: string): Ticket[] => {
  const lowerQuery = query.toLowerCase();
  return mockTickets.filter(ticket => 
    ticket.title.toLowerCase().includes(lowerQuery) ||
    ticket.description.toLowerCase().includes(lowerQuery) ||
    ticket.labels.some(label => label.toLowerCase().includes(lowerQuery))
  );
};
