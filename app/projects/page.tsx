'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockProjects, getProjectStats, type Project } from '@/lib/mockProjects';
import ProjectModal from '@/components/projects/ProjectModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { 
  Search, 
  Plus, 
  Folder,
  Users,
  Calendar,
  CheckCircle2,
  Archive,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects] = useState<Project[]>(mockProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const stats = getProjectStats();

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(project => project.status === filterStatus);
    }

    return filtered;
  }, [projects, searchQuery, filterStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-10 py-1 text-green-700 rounded-lg text-xs font-bold ">
            <Clock className="w-3 h-3" />
            Active
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-300">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold border border-gray-300">
            <Archive className="w-3 h-3" />
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const handleViewProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    setModalMode('create');
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Project "${projectToDelete.name}" deleted successfully!`);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'qa']}>
        <DashboardLayout>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and organize your projects
                </p>
              </div>

              <button
                onClick={handleCreateProject}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold transition-all"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Completed</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completed}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase">Archived</p>
                    <p className="text-2xl font-bold text-gray-600 mt-1">{stats.archived}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Archive className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleViewProject(project.id)}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Folder className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {project.name}
                          </h3>
                          {getStatusBadge(project.status)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-4">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Team Members */}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {project.teamMembers.length} team member{project.teamMembers.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {project.startDate} {project.endDate && `- ${project.endDate}`}
                      </span>
                    </div>

                    {/* Ticket Stats */}
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{project.ticketCount.total}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">{project.ticketCount.pending}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{project.ticketCount.assigned}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Assigned</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{project.ticketCount.closed}</p>
                        <p className="text-[10px] text-gray-500 uppercase">Closed</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProject(project.id);
                      }}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first project'}
                </p>
                <button
                  onClick={handleCreateProject}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Create Project
                </button>
              </div>
            )}
          </div>

          {/* Project Modal */}
          <ProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            project={selectedProject}
            mode={modalMode}
          />

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Project"
            message={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="danger"
          />
        </DashboardLayout>
      </RoleGuard>
    </ProtectedRoute>
  );
}
