'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { ticketAPI, commentAPI, historyAPI, type Ticket, type Comment, type HistoryEntry } from '@/lib/api';
import PriorityBadge from '@/components/ui/PriorityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = params.id as string;
  
  // State
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Load ticket data
  useEffect(() => {
    const loadTicketData = async () => {
      try {
        setLoading(true);
        
        // Load ticket, comments, and history in parallel
        const [ticketData, commentsData, historyData] = await Promise.all([
          ticketAPI.getById(ticketId),
          commentAPI.getByTicketId(ticketId),
          historyAPI.getByTicketId(ticketId)
        ]);

        setTicket(ticketData);
        setComments(commentsData);
        setHistory(historyData);
        setSelectedStatus(ticketData.status);
        
      } catch {
        toast.error('Failed to load ticket data');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      loadTicketData();
    }
  }, [ticketId]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <LoadingSpinner size="lg" text="Loading ticket..." />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!ticket) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold text-black mb-2">Ticket Not Found</h2>
            <p className="text-black mb-4">The ticket you're looking for doesn't exist.</p>
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

  const handleDelete = async () => {
    try {
      await ticketAPI.delete(ticketId);
      toast.success('Ticket deleted successfully');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to delete ticket');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await ticketAPI.updateStatus(ticketId, newStatus);
      setSelectedStatus(newStatus);
      setTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
      toast.success(`Status updated to ${newStatus}`);
      
      // Reload history to show the status change
      const updatedHistory = await historyAPI.getByTicketId(ticketId);
      setHistory(updatedHistory);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      const comment = await commentAPI.create(ticketId, {
        content: newComment.trim(),
        attachments: []
      });
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
                  className="flex items-center text-black gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Edit className="w-4 h-4 text-black" />
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
                <h1 className="text-2xl font-bold text-black">{ticket.title}</h1>
                <span className="text-sm text-black">{ticket.id}</span>
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
                <div className="text-xs text-black mb-1">Project</div>
                <div className="text-sm font-medium text-black">{ticket.projectName}</div>
              </div>
              <div>
                <div className="text-xs text-black mb-1">Created By</div>
                <div className="text-sm font-medium text-black">{ticket.authorName}</div>
              </div>
              <div>
                <div className="text-xs text-black mb-1">Assigned To</div>
                <div className="text-sm font-medium text-black">
                  {ticket.assignedToName || 'Unassigned'}
                </div>
              </div>
              <div>
                <div className="text-xs text-black mb-1">Deadline</div>
                <div className="text-sm font-medium text-black">
                  {ticket.deadline ? formatDate(ticket.deadline) : 'No deadline'}
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
                  className="px-3 py-2 border text-black border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="awaiting">Awaiting Response</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}

            {/* Attachments - Note: API doesn't support attachments yet */}
            {/* 
            {ticket.attachments && ticket.attachments.length > 0 && (
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
            */}
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">
              Comments ({comments.length})
            </h3>

            {/* Existing Comments */}
            <div className="space-y-4 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-black">{comment.authorName}</span>
                    <span className="text-xs text-black">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-black">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-black text-center py-4">No comments yet</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="border-t border-gray-200 pt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submittingComment}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Send className="w-4 h-4" />
                  {submittingComment ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{entry.userName}</span> {entry.action}
                      {entry.details && <span className="text-gray-600"> - {entry.details}</span>}
                    </p>
                    <p className="text-xs text-black mt-0.5">{formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-sm text-black text-center py-4">No activity history</p>
              )}
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
