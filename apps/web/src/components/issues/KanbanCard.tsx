'use client';

import { type Priority, PriorityMenu, type Status } from '@/components/menus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { issueApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useIssueStore } from '@/stores/issue-store';
import type { Issue } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import type { FC } from 'react';
import { IssuePriorityIcon } from './IssuePriorityIcon';

interface KanbanCardProps {
  issue: Issue;
  teamId: string;
  isDragging?: boolean;
}

/**
 * Draggable Kanban Card Component
 *
 * Enhanced version adapted from linear-app with:
 * - @dnd-kit/sortable for drag-and-drop
 * - Inline priority editing with PriorityMenu
 * - Click to navigate to issue detail
 * - Optimistic updates via Zustand
 *
 * Features:
 * - Drag handle on entire card
 * - Priority quick-edit dropdown
 * - Avatar with fallback initials
 * - Hover effects
 */
export const KanbanCard: FC<KanbanCardProps> = ({ issue, teamId, isDragging = false }) => {
  const { updateIssue } = useIssueStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handlePriorityChange = async (priority: Priority) => {
    // Optimistic update
    updateIssue(issue.id, { priority: priority as Issue['priority'] });

    try {
      await issueApi.update(issue.id, { priority: priority as Issue['priority'] });
    } catch (error) {
      // Rollback on error
      updateIssue(issue.id, { priority: issue.priority });
      console.error('Failed to update priority:', error);
    }
  };

  const _handleStatusChange = async (status: Status) => {
    // Optimistic update
    updateIssue(issue.id, { status: status as Issue['status'] });

    try {
      await issueApi.update(issue.id, { status: status as Issue['status'] });
    } catch (error) {
      // Rollback on error
      updateIssue(issue.id, { status: issue.status });
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'flex w-full cursor-default flex-col rounded-lg border border-border bg-white px-4 py-3',
        'hover:border-border-hover hover:shadow-md',
        'transition-all duration-150',
        {
          'opacity-40': isSortableDragging || isDragging,
          'shadow-lg': isDragging,
        }
      )}
    >
      {/* Title and Assignee */}
      <div className="mb-2 flex w-full items-start justify-between">
        <Link
          href={`/team/${teamId}/issue/${issue.id}`}
          className="flex-1 text-sm font-medium text-text-primary line-clamp-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {issue.title}
        </Link>
        {issue.assignee && (
          <div className="ml-2 flex-shrink-0">
            <Avatar className="h-6 w-6">
              <AvatarImage src={issue.assignee.avatarUrl || undefined} alt={issue.assignee.name} />
              <AvatarFallback name={issue.assignee.name} />
            </Avatar>
          </div>
        )}
      </div>

      {/* Footer: Priority and Status quick-edit */}
      <div className="flex items-center gap-2">
        <div onClick={(e) => e.stopPropagation()}>
          <PriorityMenu
            value={issue.priority as Priority}
            onSelect={handlePriorityChange}
            trigger={
              <button
                type="button"
                className="inline-flex items-center rounded-sm border border-border p-0.5 hover:border-border-hover hover:bg-surface"
              >
                <IssuePriorityIcon priority={issue.priority} />
              </button>
            }
          />
        </div>

        {/* Identifier */}
        <span className="text-xs text-text-tertiary">{issue.identifier}</span>
      </div>
    </div>
  );
};
