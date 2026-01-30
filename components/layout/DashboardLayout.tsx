'use client';

import { useState, memo } from 'react';
import Sidebar from './Sidebar';
import ActivityPanel from './ActivityPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showActivityPanel?: boolean;
  userRole?: string;
  activityStats?: {
    name: string;
    value: number;
    color: string;
  }[] | null;
}

const DashboardLayout = memo(function DashboardLayout({ 
  children, 
  showActivityPanel = false,
  userRole,
  activityStats
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Left Column */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area - Middle Column */}
      <div className={`flex-1 flex flex-col ${showActivityPanel ? 'lg:mr-80' : ''} lg:ml-64`}>
        {/* Page Content */}
        <main className="flex-1 p-3 md:p-4 lg:p-5">
          {children}
        </main>
      </div>

      {/* Activity Panel - Right Column (only on dashboard) */}
      {showActivityPanel && (
        <aside className="hidden lg:block fixed right-0 top-0 w-80 h-screen">
          <ActivityPanel userRole={userRole} stats={activityStats} />
        </aside>
      )}
    </div>
  );
});

export default DashboardLayout;
