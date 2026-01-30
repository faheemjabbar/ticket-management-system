'use client';

import { useEffect, useState, memo } from 'react';
import { Clock, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNotifications } from '@/context/NotificationContext';
import { activitiesAPI, type Activity } from '@/lib/api';

interface ActivityPanelProps {
  userRole?: string;
  stats?: {
    name: string;
    value: number;
    color: string;
  }[] | null;
}

const ActivityPanel = memo(function ActivityPanel({ userRole, stats }: ActivityPanelProps) {
  const { notifications } = useNotifications();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent activities from the activities API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await activitiesAPI.getAll({ limit: 20 });
        setActivities(data.activities);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Listen for new notifications to refresh activities
  useEffect(() => {
    if (notifications.length > 0) {
      // Refresh activities when new notification arrives
      const refreshActivities = async () => {
        try {
          const data = await activitiesAPI.getAll({ limit: 20 });
          setActivities(data.activities);
        } catch (error) {
          console.error('Failed to refresh activities:', error);
        }
      };

      refreshActivities();
    }
  }, [notifications]);

  const getActivityIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('assign')) {
      return <User className="w-4 h-4 text-blue-600" />;
    } else if (lowerType.includes('close') || lowerType.includes('complete')) {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    } else if (lowerType.includes('create')) {
      return <AlertCircle className="w-4 h-4 text-orange-600" />;
    } else {
      return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* My Stats Card - Only for Developers */}
      {userRole === 'developer' && stats && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">My Stats</h3>
          
          <div className="flex items-center gap-4 mb-4">
            {/* Small Donut Chart */}
            <div style={{ width: '96px', height: '96px' }} className="flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Compact Legend */}
            <div className="flex flex-col gap-2">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-600">{stat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <p className="text-xs text-gray-600 mt-1">Latest updates and changes</p>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2 animate-spin" />
            <p className="text-sm text-gray-500">Loading activities...</p>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-tight mb-1">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  Ticket: {activity.ticketTitle}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">{activity.userName}</span>
                  <span>•</span>
                  <span>{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No recent activity</p>
            <p className="text-xs text-gray-400 mt-1">Activity will appear here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
});

export default ActivityPanel;
