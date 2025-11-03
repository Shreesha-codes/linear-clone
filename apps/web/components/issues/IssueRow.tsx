'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate } from '@/lib/utils';
import type { Issue } from '@/types';
import Link from 'next/link';
import type { FC } from 'react';
import { IssuePriorityIcon } from './IssuePriorityIcon';
import { IssueStatusBadge } from './IssueStatusBadge';

interface IssueRowProps {
  issue: Issue;
  teamId: string;
  className?: string;
  onUpdate?: (id: string, updates: Partial<Issue>) => void;
}

/**
 * Table row component for issue list view
 * Features:
 * - All issue properties in columns
 * - Click to open detail view
 * - Hover state with background
 */
export const IssueRow: FC<IssueRowProps> = ({ issue, teamId, className }) => {
  return (
    <Link
      href={`/team/${teamId}/issue/${issue.id}`}
      className={cn(
        'grid grid-cols-[100px_1fr_140px_120px_140px_180px_120px] gap-4 items-center',
        'px-4 py-3 border-b border-border',
        'hover:bg-surface-secondary',
        'transition-colors duration-150',
        className
      )}
    >
      {/* Identifier + Priority */}
      <div className="flex items-center gap-2">
        <IssuePriorityIcon priority={issue.priority} />
        <span className="text-sm font-medium text-text-secondary">{issue.identifier}</span>
      </div>

      {/* Title */}
      <div className="truncate">
        <span className="text-sm text-text-primary">{issue.title}</span>
      </div>

      {/* Status */}
      <div>
        <IssueStatusBadge status={issue.status} />
      </div>

      {/* Priority */}
      <div>
        <IssuePriorityIcon priority={issue.priority} showLabel />
      </div>

      {/* Assignee */}
      <div>
        {issue.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={issue.assignee.avatarUrl || undefined} alt={issue.assignee.name} />
              <AvatarFallback name={issue.assignee.name} />
            </Avatar>
            <span className="text-sm text-text-secondary truncate">{issue.assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-text-tertiary">Unassigned</span>
        )}
      </div>

      {/* Labels */}
      <div className="flex gap-1 overflow-hidden">
        {issue.labels && issue.labels.length > 0 ? (
          issue.labels.slice(0, 2).map((label) => (
            <Badge key={label.id} variant="outline" className="text-xs">
              {label.name}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-text-tertiary">No labels</span>
        )}
        {issue.labels && issue.labels.length > 2 && (
          <span className="text-xs text-text-tertiary">+{issue.labels.length - 2}</span>
        )}
      </div>

      {/* Due Date */}
      <div>
        {issue.dueDate ? (
          <span className="text-sm text-text-secondary">{formatDate(issue.dueDate)}</span>
        ) : (
          <span className="text-sm text-text-tertiary">No due date</span>
        )}
      </div>
    </Link>
  );
};
