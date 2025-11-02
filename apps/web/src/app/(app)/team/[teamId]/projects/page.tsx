'use client';

import { ProjectCard, ProjectForm } from '@/components/projects';
import { Button } from '@/components/ui/button';
import { useProjectStore, useProjectsByTeam } from '@/stores/project-store';
import { useTeamStore } from '@/stores/team-store';
import type { Project, ProjectStatus } from '@/types';

interface ProjectFormData {
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: string;
  targetDate?: string;
  leadId?: string;
  color: string;
}

import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Projects List Page
 *
 * Displays all projects for a team in a grid/list view with filters.
 * Features:
 * - Grid view with project cards
 * - Filter by status (all, planned, in_progress, completed, cancelled)
 * - Sort by name, status, target date
 * - Create new project button
 * - Empty state for no projects
 *
 * @example Route: /team/[teamId]/projects
 */
export default function ProjectsPage() {
  const params = useParams();
  const teamId = params?.teamId as string;
  const activeTeam = useTeamStore((state) => state.activeTeam);
  const projects = useProjectsByTeam(teamId);
  const addProject = useProjectStore((state) => state.addProject);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  // Mock data for development (remove when API is integrated)
  useEffect(() => {
    if (projects.length === 0 && teamId) {
      // Add mock projects
      const mockProjects: Project[] = [
        {
          id: '1',
          teamId,
          name: 'Website Redesign',
          description: 'Complete redesign of the company website',
          status: 'in_progress',
          startDate: new Date('2025-01-01'),
          targetDate: new Date('2025-03-31'),
          leadId: null,
          color: '#6366f1',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          teamId,
          name: 'Mobile App Launch',
          description: 'Launch mobile app for iOS and Android',
          status: 'planned',
          startDate: null,
          targetDate: new Date('2025-06-30'),
          leadId: null,
          color: '#8b5cf6',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          teamId,
          name: 'Q4 Performance Improvements',
          description: 'Optimize backend performance and reduce latency',
          status: 'completed',
          startDate: new Date('2024-10-01'),
          targetDate: new Date('2024-12-31'),
          leadId: null,
          color: '#10b981',
          archived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      for (const project of mockProjects) {
        addProject(project);
      }
    }
  }, [teamId, projects.length, addProject]);

  const filteredProjects =
    statusFilter === 'all'
      ? projects
      : projects.filter((project) => project.status === statusFilter);

  const handleCreateProject = async (data: ProjectFormData) => {
    // TODO: Integrate with API (Phase 5)
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      name: data.name,
      description: data.description || null,
      status: data.status || 'planned',
      startDate: data.startDate ? new Date(data.startDate) : null,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      leadId: data.leadId || null,
      color: data.color || '#6366f1',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addProject(newProject);
    setIsCreateModalOpen(false);
  };

  const statusCounts = {
    all: projects.length,
    planned: projects.filter((p) => p.status === 'planned').length,
    in_progress: projects.filter((p) => p.status === 'in_progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    cancelled: projects.filter((p) => p.status === 'cancelled').length,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {activeTeam?.name || 'Team'} Projects
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage and track all projects for your team
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-800 bg-gray-950 px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('planned')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === 'planned'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            Planned ({statusCounts.planned})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_progress')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === 'in_progress'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            In Progress ({statusCounts.in_progress})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === 'completed'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            Completed ({statusCounts.completed})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('cancelled')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === 'cancelled'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            Cancelled ({statusCounts.cancelled})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
        {filteredProjects.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-white">No projects found</h3>
              <p className="mt-1 text-sm text-gray-400">
                {statusFilter === 'all'
                  ? 'Get started by creating your first project'
                  : `No projects with status "${statusFilter}"`}
              </p>
              {statusFilter === 'all' && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Project
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} teamId={teamId} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <ProjectForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        mode="create"
      />
    </div>
  );
}
