'use client';

import type { Issue, IssueStatus } from '@/types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { CSSProperties, FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { IssueStatusBadge } from './IssueStatusBadge';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: IssueStatus;
  title: string;
  issues: Issue[];
  teamId: string;
}

const ITEM_HEIGHT = 120; // Height of each issue card + spacing
const ITEM_SPACING = 8;

/**
 * Virtualized Kanban Column
 *
 * Uses react-window for efficient rendering of large issue lists.
 * Implements @dnd-kit droppable for drag-and-drop.
 *
 * Features:
 * - Virtual scrolling for performance
 * - Drag-and-drop enabled
 * - Issue count badge
 */
export const KanbanColumn: FC<KanbanColumnProps> = ({ id, title, issues, teamId }) => {
  const { setNodeRef } = useDroppable({
    id: `column-${id}`,
  });

  const issueIds = issues.map((issue) => issue.id);

  return (
    <div className="flex w-90 flex-shrink-0 flex-col select-none" ref={setNodeRef}>
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <IssueStatusBadge status={id} />
          <span className="font-medium text-sm text-text-primary">{title}</span>
          <span className="text-sm text-text-tertiary">{issues.length}</span>
        </div>
      </div>

      {/* Virtualized Issue List */}
      <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-hidden rounded-lg border border-border bg-surface">
          {issues.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-text-tertiary">
              No issues
            </div>
          ) : (
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  itemCount={issues.length}
                  itemSize={ITEM_HEIGHT + ITEM_SPACING}
                  width={width}
                  itemData={issues}
                  className="scrollbar-thin"
                >
                  {Row}
                </FixedSizeList>
              )}
            </AutoSizer>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

/**
 * Virtualized Row Component
 * Renders individual issue cards within the virtual list
 */
interface RowProps {
  index: number;
  style: CSSProperties;
  data: Issue[];
}

const Row: FC<RowProps> = ({ index, style, data }) => {
  const issue = data[index];
  if (!issue) return null;

  return (
    <div
      style={{
        ...style,
        height: `${ITEM_HEIGHT}px`,
        paddingBottom: `${ITEM_SPACING}px`,
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: index === 0 ? '12px' : '0px',
      }}
    >
      <KanbanCard issue={issue} teamId={issue.teamId} />
    </div>
  );
};
