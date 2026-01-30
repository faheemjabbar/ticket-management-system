'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { X, Plus, Tag, Calendar, User } from 'lucide-react';
import { ticketAPI, projectAPI, userAPI, type Project, type User as APIUser } from '@/lib/api';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: () => void;
}

const priorities = [
  { 
    value: 'low', 
    label: 'Low', 
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    activeColor: 'bg-slate-100 text-slate-900 border-slate-400'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    color: 'bg-blue-50 text-blue-700 border-blue-300',
    activeColor: 'bg-blue-100 text-blue-900 border-blue-500'
  },
  { 
    value: 'high', 
    label: 'High', 
    color: 'bg-orange-50 text-orange-700 border-orange-300',
    activeColor: 'bg-orange-100 text-orange-900 border-orange-500'
  },
  { 
    value: 'critical', 
    label: 'Critical', 
    color: 'bg-red-50 text-red-700 border-red-300',
    activeColor: 'bg-red-100 text-red-900 border-red-500'
  },
];

const suggestedLabels = ['Bug', 'Feature', 'Documentation', 'Question', 'Enhancement', 'UI/UX'];

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const router = useRouter();
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // State for projects and developers
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<APIUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    project: '',
    labels: [] as string[],
    assignedTo: '',
    deadline: '',
  });

  const [newLabel, setNewLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Load projects and developers when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          setLoading(true);
          const [projectsResponse, usersResponse] = await Promise.all([
            projectAPI.getAll({ limit: 100 }),
            userAPI.getAll({ role: 'developer', limit: 100 })
          ]);
          setProjects(projectsResponse.projects);
          setDevelopers(usersResponse.users);
        } catch {
          toast.error('Failed to load form data');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [isOpen]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsAnimating(true), 10);
      setTimeout(() => titleInputRef.current?.focus(), 200);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.project) {
      toast.error('Project is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create ticket via API
      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        projectId: formData.project,
        labels: formData.labels,
        deadline: formData.deadline || undefined,
      };

      const newTicket = await ticketAPI.create(ticketData);
      
      // If assigned to someone, assign the ticket
      if (formData.assignedTo) {
        const assignedUser = developers.find(d => d.id === formData.assignedTo);
        if (assignedUser) {
          await ticketAPI.assign(newTicket.id, {
            assignedToId: assignedUser.id,
            assignedToName: assignedUser.name,
          });
        }
      }
      
      toast.success('Ticket created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        project: '',
        labels: [],
        assignedTo: '',
        deadline: '',
      });
      
      handleClose();
      
      // Notify parent to refresh data
      if (onTicketCreated) {
        onTicketCreated();
      } else {
        router.refresh();
      }
    } catch {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLabel = (label?: string) => {
    const labelToAdd = label || newLabel.trim();
    if (labelToAdd && !formData.labels.includes(labelToAdd)) {
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, labelToAdd],
      }));
      setNewLabel('');
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.filter(label => label !== labelToRemove),
    }));
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto transition-all duration-300 ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-orange-600 px-5 py-3 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create New Ticket</h2>
                  <p className="text-[10px] text-orange-100 mt-0.5">Fill in the details below</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-60px)]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500 text-sm">Loading form data...</div>
              </div>
            ) : (
              <div className="space-y-3.5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  ref={titleInputRef}
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Login button not responding on mobile"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-black transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue or question in detail..."
                  rows={3}
                  className="w-full px-3 py-2 border-2 text-black border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-none transition-all"
                  required
                />
              </div>

              {/* Project and Priority */}
              <div className="grid grid-cols-2 gap-3">
                {/* Project */}
                <div>
                  <label htmlFor="project" className="block text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="project"
                    value={formData.project}
                    onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    className="w-full text-black px-3 py-2 border-2 border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none appearance-none bg-white cursor-pointer transition-all"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      paddingRight: '2rem'
                    }}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                    Priority
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: priority.value as any }))}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border-2 transition-all flex items-center justify-center ${
                          formData.priority === priority.value
                            ? priority.activeColor
                            : priority.color + ' hover:opacity-80'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assign To and Deadline */}
              <div className="grid grid-cols-2 gap-3">
                {/* Assign To */}
                <div>
                  <label htmlFor="assignedTo" className="flex items-center gap-1 text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                    <User className="w-3 h-3" />
                    Assign To
                  </label>
                  <select
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full text-black px-3 py-2 border-2 border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none appearance-none bg-white cursor-pointer transition-all"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      paddingRight: '2rem'
                    }}
                  >
                    <option value="">Unassigned</option>
                    {developers.map(dev => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline */}
                <div>
                  <label htmlFor="deadline" className="flex items-center gap-1 text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                    <Calendar className="w-3 h-3" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full text-black px-3 py-2 border-2 border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Labels */}
              <div>
                <label htmlFor="labels" className="flex items-center gap-1 text-[10px] font-bold text-gray-900 mb-1 uppercase tracking-wide">
                  <Tag className="w-3 h-3" />
                  Labels
                </label>
                
                {/* Suggested labels */}
                <div className="mb-2">
                  <p className="text-[10px] text-gray-500 mb-1">Quick add:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestedLabels.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleAddLabel(label)}
                        disabled={formData.labels.includes(label)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          formData.labels.includes(label)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300 cursor-not-allowed opacity-60'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-orange-100 hover:text-orange-700 hover:border-orange-300'
                        }`}
                      >
                        {formData.labels.includes(label) ? '✓ ' : '+ '}{label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    id="labels"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddLabel();
                      }
                    }}
                    placeholder="Custom label"
                    className="flex-1 px-2.5 py-1.5 text-black border-2 border-gray-200 rounded-lg text-xs focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddLabel()}
                    className="px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-bold transition-all"
                  >
                    Add
                  </button>
                </div>
                
                {/* Display Labels */}
                {formData.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-200"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          className="hover:text-blue-900 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-2.5 mt-5 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Create Ticket
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}