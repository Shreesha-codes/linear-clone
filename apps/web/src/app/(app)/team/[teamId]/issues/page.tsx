'use client';

import { IssueFilters } from '@/components/issues/IssueFilters';
import { IssueRow } from '@/components/issues/IssueRow';
import { Button } from '@/components/ui/button';
import { useIssueStore } from '@/stores/issue-store';
import { useTeamStore } from '@/stores/team-store';
import type { IssueFilters as IssueFiltersType } from '@/types';
import { LayoutGrid, List, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PageProps {
  params: {
    teamId: string;
  };
}

/**
 * Issue List Page - Table View
 *
 * Features:
 * - Table layout with sortable columns
 * - Inline editing (future)
 * - Bulk selection and actions (future)
 * - Keyboard shortcuts (c for create)
 * - Filter and search
 * - Switch to board view
 */
export default function IssuesPage({ params }: PageProps) {
  const { teamId } = params;
  const issues = useIssueStore((state) => state.issues);
  const filters = useIssueStore((state) => state.filters);
  const setFilters = useIssueStore((state) => state.setFilters);
  const clearFilters = useIssueStore((state) => state.clearFilters);
  const team = useTeamStore((state) => state.teams.find((t) => t.id === teamId));

  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  // Convert Map to Array and filter
  const issueList = Array.from(issues.values()).filter((issue) => {
    if (!filters.status?.length && !filters.priority?.length && !filters.search) {
      return true;
    }

    let matches = true;

    if (filters.status?.length) {
      matches = matches && filters.status.includes(issue.status);
    }

    if (filters.priority?.length) {
      matches = matches && filters.priority.includes(issue.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      matches =
        matches &&
        (issue.title.toLowerCase().includes(searchLower) ||
          issue.identifier.toLowerCase().includes(searchLower));
    }

    return matches;
  });

  const handleFilterChange = (newFilters: IssueFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {team?.name || 'Team'} Issues
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {issueList.length} {issueList.length === 1 ? 'issue' : 'issues'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-1"
              >
                <List className="h-4 w-4" />
                List
              </Button>
              <Link href={`/team/${teamId}/issues/board`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <LayoutGrid className="h-4 w-4" />
                  Board
                </Button>
              </Link>
            </div>

            {/* Create Issue Button */}
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              New Issue
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4">
          <IssueFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {/* Table Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[100px_1fr_140px_120px_140px_180px_120px] gap-4 border-b border-border bg-surface px-4 py-2">
          <div className="text-xs font-medium text-text-tertiary uppercase">ID</div>
          <div className="text-xs font-medium text-text-tertiary uppercase">Title</div>
          <div className="text-xs font-medium text-text-tertiary uppercase">Status</div>
          <div className="text-xs font-medium text-text-tertiary uppercase">Priority</div>
          <div className="text-xs font-medium text-text-tertiary uppercase">Assignee</div>
          <div className="text-xs font-medium text-text-tertiary uppercase">Labels</div>
          <div className="text-xs font-medium text-text-tertiary uppercase">Due Date</div>
        </div>

        {/* Table Body */}
        <div>
          {issueList.length > 0 ? (
            issueList.map((issue) => <IssueRow key={issue.id} issue={issue} teamId={teamId} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-text-secondary">No issues found</p>
              <Button variant="ghost" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
