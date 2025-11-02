'use client';

import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import type { IssueStatus } from '@/types';

interface IssueStatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

const statusConfig: Record<
  IssueStatus,
  {
    label: string;
    variant: 'backlog' | 'todo' | 'inProgress' | 'done' | 'cancelled';
  }
> = {
  backlog: {
    label: 'Backlog',
    variant: 'backlog',
  },
  todo: {
    label: 'Todo',
    variant: 'todo',
  },
  in_progress: {
    label: 'In Progress',
    variant: 'inProgress',
  },
  done: {
    label: 'Done',
    variant: 'done',
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'cancelled',
  },
};

export const IssueStatusBadge: FC<IssueStatusBadgeProps> = ({ status, className = '' }) => {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
