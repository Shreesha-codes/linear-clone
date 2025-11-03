'use client';

import { IssueFilters } from '@/components/issues/IssueFilters';
import { IssueForm } from '@/components/issues/IssueForm';
import { VirtualizedIssueList } from '@/components/issues/VirtualizedIssueList';
import { Button } from '@/components/ui/button';
import { issueApi } from '@/lib/api';
import { useIssueStore } from '@/stores/issue-store';
import { useTeamStore } from '@/stores/team-store';
import { LayoutGrid, List, Plus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TeamIssuesPage() {
  const params = useParams();
  const teamId = params.teamId as string;

  const teams = useTeamStore((state) => state.teams);
  const team = teams.find((t) => t.id === teamId);
  const { issues, filters, setFilters, clearFilters, addIssue } = useIssueStore();
  const [_filteredIssues, _setFilteredIssues] = useState<any[]>([]);
  const [_view, _setView] = useState<'list' | 'board'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch issues from API
  useEffect(() => {
    if (teamId && !isLoading) {
      setIsLoading(true);
      issueApi
        .list(teamId)
        .then((response) => {
          response.data.forEach((issue) => {
            addIssue(issue as any);
          });
        })
        .catch((error) => {
          console.error('Failed to fetch issues:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [teamId, addIssue, isLoading]);

  // Convert Map to Array and filter by team
  const issueList = Array.from(issues.values())
    .filter((issue) => issue.teamId === teamId)
    .filter((issue) => {
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{team?.name || 'Team'} Issues</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {issueList.length} {issueList.length === 1 ? 'issue' : 'issues'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <Button variant="primary" size="sm" className="gap-1">
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
            <Button className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New Issue
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4">
          <IssueFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        {/* Table Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[100px_1fr_140px_120px_140px_180px_120px] gap-4 border-b border-border bg-background px-4 py-2">
          <div className="text-xs font-medium text-muted-foreground uppercase">ID</div>
          <div className="text-xs font-medium text-muted-foreground uppercase">Title</div>
          <div className="text-xs font-medium text-muted-foreground uppercase">Status</div>
          <div className="text-xs font-medium text-muted-foreground uppercase">Priority</div>
          <div className="text-xs font-medium text-muted-foreground uppercase">Assignee</div>
          <div className="text-xs font-medium text-muted-foreground uppercase">Labels</div>
          <div className="text-xs font-medium text-muted-foreground uppercase">Due Date</div>
        </div>

        {/* Table Body - Virtualized */}
        <div className="flex-1">
          {issueList.length > 0 ? (
            <VirtualizedIssueList issues={issueList} teamId={teamId} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No issues found</p>
              <Button variant="ghost" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Issue Modal */}
      <IssueForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => {
          try {
            const response = await issueApi.create(teamId, data as any);
            addIssue(response.data as any);
            setIsCreateModalOpen(false);
          } catch (error) {
            console.error('Failed to create issue:', error);
          }
        }}
        mode="create"
        teamId={teamId}
      />
    </div>
  );
}
