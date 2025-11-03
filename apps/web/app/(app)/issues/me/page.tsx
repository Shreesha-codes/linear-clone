'use client';

import { IssueForm } from '@/components/issues/IssueForm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { issueApi } from '@/lib/api';
import { useIssueStore } from '@/stores/issueStore';
import { useTeamStore } from '@/stores/team-store';
import {
  AlertCircle,
  ArrowUp,
  CheckCircle2,
  Circle,
  Filter,
  LayoutGrid,
  List,
  Minus,
  Plus,
  Search,
} from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'list' | 'board';
type FilterType = 'all' | 'active' | 'completed';

export default function IssuesPage() {
  const { issues, addIssue } = useIssueStore();
  const teams = useTeamStore((state) => state.teams);
  const activeTeam = teams[0]; // Get first team for now
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock issues data (replace with real data from store)
  const mockIssues = [
    {
      id: '1',
      identifier: 'LIN-234',
      title: 'Add dark mode support',
      status: 'in_progress' as const,
      priority: 'high' as const,
      assigneeId: '1',
      assigneeName: 'Sarah Chen',
      assigneeAvatar: 'SC',
      labelsList: ['Feature', 'UI'],
    },
    {
      id: '2',
      identifier: 'LIN-233',
      title: 'Fix login authentication bug',
      status: 'done' as const,
      priority: 'urgent' as const,
      assigneeId: '2',
      assigneeName: 'Alex Kumar',
      assigneeAvatar: 'AK',
      labelsList: ['Bug'],
    },
    {
      id: '3',
      identifier: 'LIN-232',
      title: 'Update API documentation',
      status: 'todo' as const,
      priority: 'medium' as const,
      assigneeId: null,
      assigneeName: null,
      assigneeAvatar: null,
      labelsList: ['Documentation'],
    },
    {
      id: '4',
      identifier: 'LIN-231',
      title: 'Optimize database queries',
      status: 'in_progress' as const,
      priority: 'high' as const,
      assigneeId: '3',
      assigneeName: 'Maya Patel',
      assigneeAvatar: 'MP',
      labelsList: ['Performance'],
    },
    {
      id: '5',
      identifier: 'LIN-230',
      title: 'Design new onboarding flow',
      status: 'backlog' as const,
      priority: 'low' as const,
      assigneeId: '4',
      assigneeName: 'Jordan Lee',
      assigneeAvatar: 'JL',
      labelsList: ['Design', 'UX'],
    },
  ];

  const allIssues =
    Array.from(issues.values()).length > 0 ? Array.from(issues.values()) : mockIssues;

  const filteredIssues = allIssues.filter((issue) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
          ? issue.status !== 'done' && issue.status !== 'cancelled'
          : issue.status === 'done';

    const matchesSearch =
      searchQuery === '' ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.identifier.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <ArrowUp className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <ArrowUp className="h-4 w-4 text-blue-500 rotate-180" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'backlog' | 'todo' | 'inProgress' | 'done' | 'cancelled' | 'default'
    > = {
      backlog: 'backlog',
      todo: 'todo',
      in_progress: 'inProgress',
      done: 'done',
      cancelled: 'cancelled',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      backlog: 'Backlog',
      todo: 'Todo',
      in_progress: 'In Progress',
      done: 'Done',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            My Issues
          </h1>
          <p className="text-muted-foreground">
            {filteredIssues.length} {filteredIssues.length === 1 ? 'issue' : 'issues'}
          </p>
        </div>
        <Button
          className="gap-2 shadow-lg shadow-primary/20 group"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
          New Issue
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'active' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'completed' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
          >
            Completed
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'list' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'board' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
            }`}
            title="Board view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Issues List */}
      {filteredIssues.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {filteredIssues.map((issue, index) => (
              <div
                key={issue.id}
                className="p-4 hover:bg-muted/50 transition-all duration-200 group cursor-pointer animate-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Priority Icon */}
                  <div className="flex-shrink-0">{getPriorityIcon(issue.priority)}</div>

                  {/* Issue Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {issue.identifier}
                      </span>
                      <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                        {issue.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getStatusBadge(issue.status)} className="text-xs">
                        {getStatusLabel(issue.status)}
                      </Badge>
                      {'labelsList' in issue &&
                        issue.labelsList?.map((label: string) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  {/* Assignee */}
                  {'assigneeAvatar' in issue && issue.assigneeAvatar ? (
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {issue.assigneeAvatar}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <Circle className="h-3 w-3 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-card border border-border rounded-xl p-16 text-center space-y-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No issues found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? `No issues match "${searchQuery}". Try a different search term.`
                : filter === 'completed'
                  ? "You haven't completed any issues yet. Keep up the good work!"
                  : 'Create your first issue to get started'}
            </p>
          </div>
          {!searchQuery && (
            <Button className="gap-2 mt-4" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Issue
            </Button>
          )}
        </div>
      )}

      {/* Create Issue Modal */}
      {activeTeam && (
        <IssueForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            try {
              const response = await issueApi.create(activeTeam.id, data as any);
              addIssue(response.data as any);
              setIsCreateModalOpen(false);
            } catch (error) {
              console.error('Failed to create issue:', error);
            }
          }}
          mode="create"
          teamId={activeTeam.id}
        />
      )}
    </div>
  );
}
