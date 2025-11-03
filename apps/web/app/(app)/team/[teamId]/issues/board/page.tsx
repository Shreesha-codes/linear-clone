'use client';

import { IssueFilters } from '@/components/issues/IssueFilters';
import { KanbanBoard } from '@/components/issues/KanbanBoard';
import { useIssueStore } from '@/stores/issue-store';
import type { Issue } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Kanban Board Page
 *
 * Enhanced board view with drag-and-drop functionality using @dnd-kit.
 * Replaces react-beautiful-dnd with modern DnD Kit architecture.
 * Uses Zustand store instead of Electric SQL for state management.
 */
export default function BoardPage() {
  const params = useParams();
  const teamId = params.teamId as string;

  const { issues, filters, setFilters, clearFilters } = useIssueStore();
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  // Apply filters to issues
  useEffect(() => {
    const allIssues = Array.from(issues.values());
    let filtered = allIssues.filter((issue) => issue.teamId === teamId);

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((issue) => filters.status?.includes(issue.status));
    }

    // Filter by priority
    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter((issue) => filters.priority?.includes(issue.priority));
    }

    // Filter by assignee
    if (filters.assigneeId && filters.assigneeId.length > 0) {
      filtered = filtered.filter(
        (issue) => issue.assigneeId && filters.assigneeId?.includes(issue.assigneeId)
      );
    }

    // Filter by project
    if (filters.projectId) {
      filtered = filtered.filter((issue) => issue.projectId === filters.projectId);
    }

    // Filter by cycle
    if (filters.cycleId) {
      filtered = filtered.filter((issue) => issue.cycleId === filters.cycleId);
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(query) ||
          issue.identifier.toLowerCase().includes(query) ||
          issue.description?.toLowerCase().includes(query)
      );
    }

    setFilteredIssues(filtered);
  }, [issues, filters, teamId]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Top Filter Bar */}
      <div className="flex-shrink-0 border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-text-primary">Board</h1>
            <span className="text-sm text-text-tertiary">{filteredIssues.length} issues</span>
          </div>
          <IssueFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard issues={filteredIssues} teamId={teamId} />
      </div>
    </div>
  );
}
