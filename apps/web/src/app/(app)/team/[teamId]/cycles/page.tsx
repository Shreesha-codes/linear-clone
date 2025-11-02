'use client';

import { CycleCard, CycleForm } from '@/components/cycles';
import { Button } from '@/components/ui/button';
import {
  getActiveCycles,
  getPastCycles,
  getUpcomingCycles,
  useCycleStore,
  useCyclesByTeam,
} from '@/stores/cycle-store';
import { useTeamStore } from '@/stores/team-store';
import type { Cycle } from '@/types';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CycleFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

/**
 * Cycles List Page
 *
 * Displays all cycles for a team grouped by status (active, upcoming, past).
 * Features:
 * - Filter tabs (active, upcoming, past, all)
 * - Cycle cards with progress visualization
 * - Create new cycle button
 * - Empty state for no cycles
 *
 * @example Route: /team/[teamId]/cycles
 */
export default function CyclesPage() {
  const params = useParams();
  const teamId = params?.teamId as string;
  const activeTeam = useTeamStore((state) => state.activeTeam);
  const cycles = useCyclesByTeam(teamId);
  const addCycle = useCycleStore((state) => state.addCycle);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'upcoming' | 'past'>('all');

  // Mock data for development (remove when API is integrated)
  useEffect(() => {
    if (cycles.length === 0 && teamId) {
      // Add mock cycles
      const now = new Date();
      const mockCycles: Cycle[] = [
        {
          id: '1',
          teamId,
          name: 'Sprint 1',
          number: 1,
          startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          description: 'Initial sprint for Q1 2025',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          teamId,
          name: 'Sprint 2',
          number: 2,
          startDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
          endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
          description: 'Focus on authentication and user management',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          teamId,
          name: 'Q4 2024',
          number: 0,
          startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
          endDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          description: 'Final push for 2024 goals',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      for (const cycle of mockCycles) {
        addCycle(cycle);
      }
    }
  }, [teamId, cycles.length, addCycle]);

  // Filter cycles based on status
  const filteredCycles = (() => {
    switch (filterStatus) {
      case 'active':
        return getActiveCycles(cycles);
      case 'upcoming':
        return getUpcomingCycles(cycles);
      case 'past':
        return getPastCycles(cycles);
      default:
        return cycles;
    }
  })();

  const handleCreateCycle = async (data: CycleFormData) => {
    // TODO: Integrate with API (Phase 5)
    const newCycle: Cycle = {
      id: Math.random().toString(36).substr(2, 9),
      teamId,
      name: data.name,
      number: cycles.length + 1, // Auto-increment
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      description: data.description || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addCycle(newCycle);
    setIsCreateModalOpen(false);
  };

  const statusCounts = {
    all: cycles.length,
    active: getActiveCycles(cycles).length,
    upcoming: getUpcomingCycles(cycles).length,
    past: getPastCycles(cycles).length,
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {activeTeam?.name || 'Team'} Cycles
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage and track sprints and development cycles
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Cycle
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-800 bg-gray-950 px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            All <span className="ml-1 text-gray-500">({statusCounts.all})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            Active <span className="ml-1 text-gray-500">({statusCounts.active})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('upcoming')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === 'upcoming'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            Upcoming <span className="ml-1 text-gray-500">({statusCounts.upcoming})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('past')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterStatus === 'past'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            Past <span className="ml-1 text-gray-500">({statusCounts.past})</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
        {filteredCycles.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">No cycles found</h2>
              <p className="mt-2 text-sm text-gray-400">
                {filterStatus === 'all'
                  ? 'Create your first cycle to get started'
                  : `No ${filterStatus} cycles at the moment`}
              </p>
              {filterStatus === 'all' && (
                <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Cycle
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCycles.map((cycle) => (
              <CycleCard key={cycle.id} cycle={cycle} teamId={teamId} />
            ))}
          </div>
        )}
      </div>

      {/* Create Cycle Modal */}
      <CycleForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCycle}
        mode="create"
        nextCycleNumber={cycles.length + 1}
      />
    </div>
  );
}
