'use client';

import type { Issue } from '@/types';
import { type CSSProperties, memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { IssueRow } from './IssueRow';

interface VirtualizedIssueListProps {
  issues: Issue[];
  teamId: string;
}

const ROW_HEIGHT = 64; // Height of each issue row in pixels

/**
 * Virtualized Issue List
 *
 * Uses react-window for efficient rendering of large issue lists.
 * Adapted from linear-app migration-temp with Next.js compatibility.
 *
 * Features:
 * - Virtual scrolling for performance (only renders visible rows)
 * - Auto-sized to fill available space
 * - Smooth scrolling
 * - Handles empty state
 */
export const VirtualizedIssueList = memo<VirtualizedIssueListProps>(({ issues, teamId }) => {
  if (issues.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-text-secondary">No issues found</p>
      </div>
    );
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={issues.length}
          itemSize={ROW_HEIGHT}
          itemData={{ issues, teamId }}
          className="scrollbar-thin"
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
});

VirtualizedIssueList.displayName = 'VirtualizedIssueList';

/**
 * Virtualized Row Component
 * Renders individual issue rows within the virtual list
 */
interface RowProps {
  index: number;
  style: CSSProperties;
  data: {
    issues: Issue[];
    teamId: string;
  };
}

const Row = memo<RowProps>(({ index, style, data }) => {
  const { issues, teamId } = data;
  const issue = issues[index];

  if (!issue) return null;

  return (
    <div style={style}>
      <IssueRow issue={issue} teamId={teamId} />
    </div>
  );
});

Row.displayName = 'VirtualizedIssueRow';
