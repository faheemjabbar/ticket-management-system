'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { getTicketById } from '@/lib/mockTickets';
import PriorityBadge from '@/components/ui/PriorityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Clock, 
  Paperclip,
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.id as string;
  
  const ticket = getTicketById(ticketId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'pending');

  if (!ticket) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-600 mb-4">The ticket you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Back to Dashboard
            </button>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const canEdit = user?.role === 'qa' || user?.role === 'admin';
  const canDelete = user?.role === 'admin';
  const canUpdateStatus = user?.role === 'developer' || user?.role === 'qa' || user?.role === 'admin';

  const handleDelete = () => {
    toast.success('Ticket deleted successfully');
    router.push('/dashboard');
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus as any);
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    toast.success('Comment added successfully');
    setNewComment('');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  onClick={() => router.push(`/tickets/${ticketId}/edit`)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Title and ID */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                <span className="text-sm text-gray-500">{ticket.id}</span>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                {ticket.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta Information */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
              <div>
                <div className="text-xs text-gray-500 mb-1">Project</div>
                <div className="text-sm font-medium text-gray-900">{ticket.project}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Created By</div>
                <div className="text-sm font-medium text-gray-900">{ticket.author}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Assigned To</div>
                <div className="text-sm font-medium text-gray-900">
                  {ticket.assignedTo || 'Unassigned'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Deadline</div>
                <div className="text-sm font-medium text-gray-900">
                  {ticket.deadline || 'No deadline'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Status Update (Developer/QA/Admin) */}
            {canUpdateStatus && (
              <div className="py-4 border-t border-gray-200">
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Update Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="awaiting">Awaiting Response</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}

            {/* Attachments */}
            {ticket.attachments.length > 0 && (
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments ({ticket.attachments.length})
                </h3>
                <div className="space-y-2">
                  {ticket.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{attachment.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(attachment.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({ticket.comments.length})
            </h3>

            {/* Existing Comments */}
            <div className="space-y-4 mb-4">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))}
              {ticket.comments.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="border-t border-gray-200 pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Send className="w-4 h-4" />
                  Add Comment
                </button>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
            <div className="space-y-3">
              {ticket.history.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{entry.user}</span> {entry.action}
                      {entry.details && <span className="text-gray-600"> - {entry.details}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{entry.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDelete}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
