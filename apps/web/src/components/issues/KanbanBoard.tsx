'use client';

import { issueApi } from '@/lib/api';
import { useIssueStore } from '@/stores/issue-store';
import type { Issue, IssueStatus } from '@/types';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { generateKeyBetween } from 'fractional-indexing';
import { useMemo, useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  issues: Issue[];
  teamId: string;
}

const STATUS_COLUMNS: { id: IssueStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
  { id: 'cancelled', title: 'Cancelled' },
];

/**
 * Enhanced Kanban Board Component
 *
 * Replaces Electric SQL/PGlite with Zustand store and REST API.
 * Uses @dnd-kit for modern drag-and-drop (replacing react-beautiful-dnd).
 * Implements fractional indexing for efficient issue ordering.
 *
 * Features:
 * - Drag & drop between status columns
 * - Virtualized columns with react-window
 * - Optimistic updates with rollback
 * - Keyboard navigation
 */
export function KanbanBoard({ issues, teamId }: KanbanBoardProps) {
  const { updateIssue } = useIssueStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for drag operations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group issues by status
  const issuesByStatus = useMemo(() => {
    const grouped: Record<IssueStatus, Issue[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      done: [],
      cancelled: [],
    };

    issues.forEach((issue) => {
      if (grouped[issue.status]) {
        grouped[issue.status].push(issue);
      }
    });

    // Sort each column by sortOrder
    Object.keys(grouped).forEach((status) => {
      grouped[status as IssueStatus].sort((a, b) => {
        if (a.sortOrder < b.sortOrder) return -1;
        if (a.sortOrder > b.sortOrder) return 1;
        // Use ID as tiebreaker for stability
        return a.id.localeCompare(b.id);
      });
    });

    return grouped;
  }, [issues]);

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  // Handle drag end - update issue status and sortOrder
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const draggedIssueId = active.id as string;
    const targetColumnId = over.id as string;

    // Extract status from droppable ID (format: 'column-{status}' or 'issue-{id}')
    const targetStatus = targetColumnId.startsWith('column-')
      ? (targetColumnId.replace('column-', '') as IssueStatus)
      : issues.find((i) => i.id === targetColumnId)?.status;

    if (!targetStatus) return;

    const draggedIssue = issues.find((i) => i.id === draggedIssueId);
    if (!draggedIssue) return;

    // If status changed or position changed within same column
    const targetColumnIssues = issuesByStatus[targetStatus];
    const draggedIndex = targetColumnIssues.findIndex((i) => i.id === draggedIssueId);
    const overIndex = targetColumnIssues.findIndex((i) => i.id === (over.id as string));

    let newSortOrderStr: string;

    if (draggedIndex === -1) {
      // Moved to different column
      if (overIndex >= 0) {
        // Dropped on another issue - calculate sort order between issues
        const prevIssue = targetColumnIssues[overIndex - 1];
        const nextIssue = targetColumnIssues[overIndex];
        newSortOrderStr = generateKeyBetween(
          prevIssue?.sortOrder.toString() || null,
          nextIssue?.sortOrder.toString() || null
        );
      } else {
        // Dropped at end of column
        const lastIssue = targetColumnIssues[targetColumnIssues.length - 1];
        newSortOrderStr = generateKeyBetween(lastIssue?.sortOrder.toString() || null, null);
      }
    } else {
      // Moved within same column
      if (overIndex === draggedIndex) return; // Same position

      const prevIssue =
        overIndex < draggedIndex
          ? targetColumnIssues[overIndex - 1]
          : targetColumnIssues[overIndex];
      const nextIssue =
        overIndex < draggedIndex
          ? targetColumnIssues[overIndex]
          : targetColumnIssues[overIndex + 1];

      newSortOrderStr = generateKeyBetween(
        prevIssue?.sortOrder.toString() || null,
        nextIssue?.sortOrder.toString() || null
      );
    }

    // Optimistic update
    updateIssue(draggedIssueId, {
      status: targetStatus,
      sortOrder: Number.parseFloat(newSortOrderStr),
    });

    // Persist to API
    try {
      await issueApi.update(draggedIssueId, {
        status: targetStatus,
        sortOrder: Number.parseFloat(newSortOrderStr),
      });
    } catch (error) {
      // Rollback on error
      updateIssue(draggedIssueId, {
        status: draggedIssue.status,
        sortOrder: draggedIssue.sortOrder,
      });
      console.error('Failed to update issue position:', error);
    }
  }

  const activeIssue = activeId ? issues.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto bg-surface-secondary p-6">
        {STATUS_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            issues={issuesByStatus[column.id]}
            teamId={teamId}
          />
        ))}
      </div>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeIssue ? (
          <div className="rotate-3 opacity-90">
            <KanbanCard issue={activeIssue} teamId={teamId} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
