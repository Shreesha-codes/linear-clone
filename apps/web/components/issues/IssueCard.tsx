'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Issue } from '@/types';
import Link from 'next/link';
import type { FC } from 'react';
import { IssuePriorityIcon } from './IssuePriorityIcon';

interface IssueCardProps {
  issue: Issue;
  teamId: string;
  className?: string;
}

/**
 * Compact issue card for Kanban board view
 * Features:
 * - Identifier, title, priority, assignee, labels
 * - Hover state with elevation
 * - Click to open detail view
 */
export const IssueCard: FC<IssueCardProps> = ({ issue, teamId, className }) => {
  return (
    <Link
      href={`/team/${teamId}/issue/${issue.id}`}
      className={cn(
        'block rounded-lg border border-border bg-surface p-3',
        'hover:border-border-hover hover:shadow-md',
        'transition-all duration-150',
        'cursor-pointer',
        className
      )}
    >
      {/* Header: Identifier + Priority */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-medium text-text-tertiary">{issue.identifier}</span>
        <IssuePriorityIcon priority={issue.priority} />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-sm font-medium text-text-primary line-clamp-2">{issue.title}</h3>

      {/* Labels */}
      {issue.labels && issue.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {issue.labels.map((label) => (
            <Badge key={label.id} variant="outline" className="text-xs">
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer: Assignee */}
      {issue.assignee && (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={issue.assignee.avatarUrl || undefined} alt={issue.assignee.name} />
            <AvatarFallback name={issue.assignee.name} />
          </Avatar>
          <span className="text-xs text-text-secondary">{issue.assignee.name}</span>
        </div>
      )}
    </Link>
  );
};
