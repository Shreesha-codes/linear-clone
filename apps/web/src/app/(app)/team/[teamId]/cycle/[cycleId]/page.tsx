'use client';

import { CycleForm } from '@/components/cycles';
import { IssueRow, IssueStatusBadge } from '@/components/issues';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { calculateCycleProgress, useCycle, useCycleStore } from '@/stores/cycle-store';
import { useIssues } from '@/stores/issue-store';
import type { Issue, IssueStatus } from '@/types';
import { ArrowLeft, Calendar, Edit2, TrendingUp } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface CycleFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

/**
 * Cycle Detail Page
 *
 * Displays comprehensive cycle information with progress visualization and issues.
 * Features:
 * - Cycle header with dates and status
 * - Progress visualization based on time
 * - Issues grouped by status
 * - Cycle statistics (total, backlog, todo, in_progress, done)
 * - Edit cycle button
 *
 * @example Route: /team/[teamId]/cycle/[cycleId]
 */
export default function CycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cycleId = params?.cycleId as string;
  const teamId = params?.teamId as string;
  const cycle = useCycle(cycleId);
  const allIssues = useIssues();
  const updateCycle = useCycleStore((state) => state.updateCycle);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter issues for this cycle
  const cycleIssues = allIssues.filter((issue) => issue.cycleId === cycleId);

  // Group issues by status
  const issuesByStatus: Record<IssueStatus, Issue[]> = {
    backlog: cycleIssues.filter((i) => i.status === 'backlog'),
    todo: cycleIssues.filter((i) => i.status === 'todo'),
    in_progress: cycleIssues.filter((i) => i.status === 'in_progress'),
    done: cycleIssues.filter((i) => i.status === 'done'),
    cancelled: cycleIssues.filter((i) => i.status === 'cancelled'),
  };

  // Calculate progress based on time
  const timeProgress = cycle ? calculateCycleProgress(cycle) : 0;

  // Calculate progress based on issues
  const totalIssues = cycleIssues.length;
  const doneIssues = issuesByStatus.done.length;
  const issueProgress = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

  const handleEditCycle = async (data: CycleFormData) => {
    if (!cycle) return;
    // TODO: Integrate with API (Phase 5)
    updateCycle(cycleId, {
      name: data.name,
      description: data.description || null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      updatedAt: new Date(),
    });
    setIsEditModalOpen(false);
  };

  if (!cycle) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Cycle not found</h2>
          <p className="mt-2 text-sm text-gray-400">The cycle you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Determine cycle status
  const now = new Date();
  const start = new Date(cycle.startDate);
  const end = new Date(cycle.endDate);
  const isActive = start <= now && now <= end;
  const isUpcoming = start > now;
  const isPast = end < now;

  const statusLabel = isActive ? 'Active' : isUpcoming ? 'Upcoming' : 'Past';
  const statusVariant = isActive ? 'inProgress' : isUpcoming ? 'backlog' : 'done';

  // Calculate days remaining
  const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950 px-6 py-4">
        <div className="mb-4 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-400">Back to Cycles</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{cycle.name}</h1>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            {cycle.description && <p className="mt-2 text-sm text-gray-400">{cycle.description}</p>}

            {/* Metadata */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
                </span>
              </div>
              {isActive && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {daysRemaining > 0
                      ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                      : 'Ending today'}
                  </span>
                </div>
              )}
              {isUpcoming && (
                <div className="flex items-center gap-2 text-blue-400">
                  <TrendingUp className="h-4 w-4" />
                  <span>Starts in {Math.abs(daysRemaining)} days</span>
                </div>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Progress Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Time Progress */}
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Time Progress</h2>
                <span className="text-2xl font-bold text-primary">{timeProgress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-400">
                {isActive && 'Based on time elapsed in the cycle'}
                {isUpcoming && 'Cycle has not started yet'}
                {isPast && 'Cycle has ended'}
              </p>
            </div>

            {/* Issue Progress */}
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Issue Completion</h2>
                <span className="text-2xl font-bold text-green-400">{issueProgress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{ width: `${issueProgress}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-gray-400">
                {doneIssues} of {totalIssues} issues completed
              </p>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-5 gap-4">
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
              <p className="text-2xl font-bold text-white">{totalIssues}</p>
              <p className="mt-1 text-sm text-gray-400">Total</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{issuesByStatus.backlog.length}</p>
              <p className="mt-1 text-sm text-gray-400">Backlog</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{issuesByStatus.todo.length}</p>
              <p className="mt-1 text-sm text-gray-400">To Do</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {issuesByStatus.in_progress.length}
              </p>
              <p className="mt-1 text-sm text-gray-400">In Progress</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950 p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{issuesByStatus.done.length}</p>
              <p className="mt-1 text-sm text-gray-400">Done</p>
            </div>
          </div>

          {/* Issues Grouped by Status */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Issues in this Cycle</h2>

            {totalIssues === 0 ? (
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-8 text-center">
                <p className="text-gray-400">No issues assigned to this cycle yet.</p>
              </div>
            ) : (
              <>
                {(['backlog', 'todo', 'in_progress', 'done', 'cancelled'] as IssueStatus[]).map(
                  (status) => {
                    const issues = issuesByStatus[status];
                    if (issues.length === 0) return null;

                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <IssueStatusBadge status={status} />
                          <span className="text-sm text-gray-400">
                            ({issues.length} issue{issues.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <div className="space-y-1">
                          {issues.map((issue) => (
                            <IssueRow key={issue.id} issue={issue} teamId={teamId} />
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </>
            )}
          </div>

          {/* Activity Feed Placeholder */}
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-6">
            <h2 className="text-lg font-semibold text-white">Activity</h2>
            <p className="mt-2 text-sm text-gray-400">
              Activity feed will be implemented in Phase 4.14
            </p>
          </div>
        </div>
      </div>

      {/* Edit Cycle Modal */}
      <CycleForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCycle}
        initialData={cycle}
        mode="edit"
      />
    </div>
  );
}
