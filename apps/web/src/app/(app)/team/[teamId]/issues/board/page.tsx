'use client';

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LayoutGrid, List, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { IssueCard } from '@/components/issues/IssueCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIssueStore } from '@/stores/issue-store';
import { useTeamStore } from '@/stores/team-store';
import type { Issue, IssueStatus } from '@/types';

interface PageProps {
  params: {
    teamId: string;
  };
}

// Status columns configuration
const STATUS_COLUMNS: {
  id: IssueStatus;
  label: string;
  color: string;
}[] = [
  { id: 'backlog', label: 'Backlog', color: 'text-status-backlog' },
  { id: 'todo', label: 'Todo', color: 'text-status-todo' },
  { id: 'in_progress', label: 'In Progress', color: 'text-status-in-progress' },
  { id: 'done', label: 'Done', color: 'text-status-done' },
  { id: 'cancelled', label: 'Cancelled', color: 'text-status-cancelled' },
];

/**
 * Sortable Issue Card Component
 * Makes an issue card draggable
 */
function SortableIssueCard({ issue, teamId }: { issue: Issue; teamId: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IssueCard issue={issue} teamId={teamId} />
    </div>
  );
}

/**
 * Droppable Column Component
 * Wraps the column to make it a valid drop target
 */
function DroppableColumn({
  id,
  label,
  color,
  issues,
  teamId,
}: {
  id: IssueStatus;
  label: string;
  color: string;
  issues: Issue[];
  teamId: string;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="flex w-80 flex-shrink-0 flex-col">
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className={cn('text-sm font-semibold', color)}>{label}</h2>
          <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs text-text-tertiary">
            {issues.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Body - Drop Zone */}
      <SortableContext
        id={id}
        items={issues.map((issue) => issue.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-surface-secondary/50 p-2">
          {issues.map((issue) => (
            <SortableIssueCard key={issue.id} issue={issue} teamId={teamId} />
          ))}
          {issues.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-border">
              <p className="text-sm text-text-tertiary">Drop issues here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

/**
 * Kanban Board Page
 *
 * Features:
 * - Drag-and-drop between status columns
 * - Group by status
 * - Real-time updates (future WebSocket integration)
 * - Smooth animations
 * - Create issue in specific column
 */
export default function IssueBoardPage({ params }: PageProps) {
  const { teamId } = params;
  const issues = useIssueStore((state) => state.issues);
  const updateIssue = useIssueStore((state) => state.updateIssue);
  const team = useTeamStore((state) => state.teams.find((t) => t.id === teamId));

  const [activeId, setActiveId] = useState<string | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required to start drag
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Group issues by status
  const issuesByStatus = STATUS_COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = Array.from(issues.values()).filter((issue) => issue.status === column.id);
      return acc;
    },
    {} as Record<IssueStatus, Issue[]>
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which column the issue was dropped on
    const targetColumn = STATUS_COLUMNS.find((col) => overId === col.id);

    if (targetColumn) {
      // Update issue status
      updateIssue(activeId, { status: targetColumn.id });
    }

    setActiveId(null);
  };

  const activeIssue = activeId ? issues.get(activeId) : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {team?.name || 'Team'} Board
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {Array.from(issues.values()).length} issues
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <Link href={`/team/${teamId}/issues`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <List className="h-4 w-4" />
                  List
                </Button>
              </Link>
              <Button variant="primary" size="sm" className="gap-1">
                <LayoutGrid className="h-4 w-4" />
                Board
              </Button>
            </div>

            {/* Create Issue Button */}
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              New Issue
            </Button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4 p-6">
            {STATUS_COLUMNS.map((column) => (
              <DroppableColumn
                key={column.id}
                id={column.id}
                label={column.label}
                color={column.color}
                issues={issuesByStatus[column.id]}
                teamId={teamId}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeIssue ? (
              <div className="rotate-3 scale-105 transition-transform">
                <IssueCard issue={activeIssue} teamId={teamId} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
