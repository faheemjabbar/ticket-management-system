'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Search, Plus, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock projects
const projects = [
  { id: 'all', name: 'All Projects' },
  { id: 'ecommerce', name: 'E-Commerce Platform' },
  { id: 'mobile-app', name: 'Mobile App' },
  { id: 'api-service', name: 'API Service' },
  { id: 'dashboard', name: 'Dashboard Redesign' },
];

// Mock ticket data
const ticketColumns = [
  {
    id: 'pending',
    title: 'Pending',
    count: 8,
    tickets: [
      {
        id: '#17',
        title: 'How long should the demo be?',
        author: 'Bryan Student',
        time: 'Today at 08:33',
        labels: ['Assignment'],
        project: 'ecommerce',
      },
      {
        id: '#11',
        title: 'Should the SWEBÖK panel questions I answer...',
        author: 'Bryan Student',
        time: 'Yesterday at 23:23',
        labels: ['SWEBÖK', 'Individual Report', 'e-Journal'],
        project: 'mobile-app',
      },
      {
        id: '#10',
        title: 'Why are there no project proposals for e-Journal?',
        author: 'Bryan Student',
        time: 'Friday at 08:33',
        labels: ['e-Journal'],
        project: 'api-service',
      },
      {
        id: '#8',
        title: 'Is there a lecture on the day of the demo?',
        author: 'Bryan Student',
        time: 'Wednesday at 17:05',
        labels: ['Lecture', 'Individual Report'],
        project: 'dashboard',
      },
    ],
  },
  {
    id: 'assigned',
    title: 'Assigned',
    count: 4,
    tickets: [
      {
        id: '#3',
        title: 'What is the next SWEBÖK panel?',
        author: 'Yani Student',
        time: 'Today at 00:08',
        labels: ['SWEBÖK'],
        project: 'ecommerce',
      },
    ],
  },
  {
    id: 'awaiting',
    title: 'Awaiting response',
    count: 11,
    tickets: [
      {
        id: '#8',
        title: 'Was e-Journal founded during this inbox?',
        author: 'Bryan Student',
        time: 'Last Saturday at 07:08',
        labels: ['e-Journal'],
        project: 'mobile-app',
      },
      {
        id: '#77',
        title: 'Are the SWEBÖK panels related to the book or...',
        author: 'Bryan Student',
        time: 'Last Sunday at 06:36',
        labels: ['SWEBÖK'],
        project: 'api-service',
      },
      {
        id: '#6',
        title: 'What should the length of the individual report...',
        author: 'Yani Student',
        time: 'Last Friday at 08:43',
        labels: ['Individual Report'],
        project: 'dashboard',
      },
      {
        id: '#7',
        title: 'Discord does not work on my laptop!',
        author: 'Yani Student',
        time: 'Last Friday at 05:08',
        labels: ['Laptop'],
        project: 'ecommerce',
      },
      {
        id: '#5',
        title: 'Are there any assignments for this inbox?',
        author: 'Bryan Student',
        time: 'Last Wednesday at 23:33',
        labels: ['Assignment'],
        project: 'mobile-app',
      },
      {
        id: '#4',
        title: 'Do we have to read SWEBÖK completely?',
        author: 'Bryan Student',
        time: 'Last Tuesday at 17:00',
        labels: ['SWEBÖK'],
        project: 'api-service',
      },
      {
        id: '#6',
        title: 'What should be the content of the demo?',
        author: 'Yani Student',
        time: '08/01/2021 at 07:08',
        labels: ['Lecture'],
        project: 'dashboard',
      },
      {
        id: '#16',
        title: 'Should we write the individual report in the pa...',
        author: 'Bryan Student',
        time: '08/01/2021 at 03:08',
        labels: ['Individual Report', 'Assignment'],
        project: 'ecommerce',
      },
      {
        id: '#18',
        title: 'Should I mention the testing coverage in my r...',
        author: 'Yani Student',
        time: '07/04/2021 at 23:33',
        labels: ['Assignment', 'Individual Report'],
        project: 'mobile-app',
      },
    ],
  },
  {
    id: 'closed',
    title: 'Closed',
    count: 3,
    tickets: [
      {
        id: '#14',
        title: 'Do we have to make any smaller assignments?',
        author: 'Bryan Student',
        time: '09/27/2021 at 20:08',
        labels: ['Assignment'],
        project: 'api-service',
      },
      {
        id: '#13',
        title: 'Which parts of SWEBÖK do we have to read?',
        author: 'Bryan Student',
        time: '09/24/2021 at 07:08',
        labels: ['SWEBÖK'],
        project: 'dashboard',
      },
      {
        id: '#12',
        title: 'Where can I find the SWEBÖK?',
        author: 'Yani Student',
        time: 'Last Friday at 16:08',
        labels: ['SWEBÖK'],
        project: 'ecommerce',
      },
    ],
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State to track visible ticket count per column
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({
    pending: 5,
    assigned: 5,
    awaiting: 5,
    closed: 5,
  });

  // State for project filter
  const [selectedProject, setSelectedProject] = useState('all');
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  const handleSeeMore = (columnId: string) => {
    setVisibleCounts(prev => ({
      ...prev,
      [columnId]: prev[columnId] + 5,
    }));
  };

  // Filter tickets by selected project and search query
  const filteredColumns = useMemo(() => {
    return ticketColumns.map(column => {
      let tickets = column.tickets;
      
      // Filter by project
      if (selectedProject !== 'all') {
        tickets = tickets.filter(ticket => ticket.project === selectedProject);
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        tickets = tickets.filter(ticket => 
          ticket.title.toLowerCase().includes(query) ||
          ticket.author.toLowerCase().includes(query) ||
          ticket.labels.some(label => label.toLowerCase().includes(query))
        );
      }
      
      return {
        ...column,
        tickets,
      };
    });
  }, [selectedProject, searchQuery]);

  // Role-based column filtering
  // QA/Admin: See all columns
  // Developer: See all columns EXCEPT "Awaiting response"
  const roleBasedColumns = user?.role === 'developer'
    ? filteredColumns.filter(col => col.id !== 'awaiting')
    : filteredColumns;

  // Handle self-assignment for developers
  const handleSelfAssign = (ticketId: string) => {
    toast.success(`Ticket ${ticketId} assigned to you!`);
    // In production: await ticketService.assignTicket(ticketId, user.id);
  };
  
  // Handle ticket click
  const handleTicketClick = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-3">
          {/* Header with Search and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-black"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Project Filter Dropdown - Only for QA and Admin */}
              {user && (user.role === 'qa' || user.role === 'admin') && (
                <div className="relative">
                  <button 
                    onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs font-medium text-black">
                      {projects.find(p => p.id === selectedProject)?.name || 'All Projects'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-black" />
                  </button>
                  
                  {isProjectDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsProjectDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-black-200 rounded-lg shadow-lg z-20">
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project.id);
                              setIsProjectDropdownOpen(false);
                              // Reset visible counts when changing project
                              setVisibleCounts({
                                pending: 5,
                                assigned: 5,
                                awaiting: 5,
                                closed: 5,
                              });
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                              selectedProject === project.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {project.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* My Tickets button - Only for QA and Admin */}
              {user && (user.role === 'qa' || user.role === 'admin') && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">My Tickets</span>
                </button>
              )}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {roleBasedColumns.map((column) => (
              <div key={column.id} className="bg-gray-50 rounded-lg p-2.5">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {column.id === 'pending' && user?.role === 'developer' 
                      ? 'Available Tickets' 
                      : column.title} <span className="text-gray-500 text-xs">({column.tickets.length})</span>
                  </h3>
                </div>

                {/* Tickets */}
                <div className="space-y-2">
                  {column.tickets.slice(0, visibleCounts[column.id]).map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className="bg-white p-2.5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      {/* Ticket Title */}
                      <div className="flex items-start justify-between mb-1.5">
                        <h4 className="text-xs font-medium text-gray-900 line-clamp-2 flex-1 leading-tight">
                          {ticket.title}
                        </h4>
                        <span className="text-[10px] text-gray-500 ml-1.5">{ticket.id}</span>
                      </div>

                      {/* Ticket Meta */}
                      <div className="text-[10px] text-gray-500 mb-2">
                        <span className="font-medium">{ticket.author}</span>
                        <span className="mx-1">•</span>
                        <span>{ticket.time}</span>
                      </div>

                      {/* Labels */}
                      <div className="flex flex-wrap gap-1">
                        {ticket.labels.map((label, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700"
                          >
                            {label}
                          </span>
                        ))}
                      </div>

                      {/* Comment Icon / Self-Assign Link */}
                      <div className="mt-2 flex items-center justify-end">
                        {user?.role === 'developer' && column.id === 'pending' ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelfAssign(ticket.id);
                            }}
                            className="text-xs text-orange-600 hover:text-orange-700 underline font-medium"
                          >
                            assign yourself
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* See More Button */}
                  {visibleCounts[column.id] < column.tickets.length && (
                    <button
                      onClick={() => handleSeeMore(column.id)}
                      className="w-full py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      See more
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
