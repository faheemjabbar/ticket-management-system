'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('admin' | 'developer' | 'qa')[];
  fallbackPath?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles,
  fallbackPath = '/dashboard' 
}: RoleGuardProps) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !hasRole(allowedRoles)) {
      toast.error('You do not have permission to access this page');
      router.push(fallbackPath);
    }
  }, [user, loading, allowedRoles, fallbackPath, hasRole, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user doesn't have required role
  if (!user || !hasRole(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}
