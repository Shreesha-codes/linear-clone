'use client';

import type { IssuePriority } from '@/types';
import { AlertCircle, ArrowDown, ChevronUp, Circle, SignalHigh } from 'lucide-react';
import type { FC } from 'react';

interface IssuePriorityIconProps {
  priority: IssuePriority;
  className?: string;
  showLabel?: boolean;
}

const priorityConfig: Record<
  IssuePriority,
  {
    icon: FC<{ className?: string }>;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  urgent: {
    icon: AlertCircle,
    label: 'Urgent',
    color: 'text-priority-urgent',
    bgColor: 'bg-priority-urgent/10',
  },
  high: {
    icon: SignalHigh,
    label: 'High',
    color: 'text-priority-high',
    bgColor: 'bg-priority-high/10',
  },
  medium: {
    icon: ChevronUp,
    label: 'Medium',
    color: 'text-priority-medium',
    bgColor: 'bg-priority-medium/10',
  },
  low: {
    icon: ArrowDown,
    label: 'Low',
    color: 'text-priority-low',
    bgColor: 'bg-priority-low/10',
  },
  none: {
    icon: Circle,
    label: 'No priority',
    color: 'text-text-tertiary',
    bgColor: 'bg-surface-secondary',
  },
};

export const IssuePriorityIcon: FC<IssuePriorityIconProps> = ({
  priority,
  className = '',
  showLabel = false,
}) => {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  if (showLabel) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`rounded p-1 ${config.bgColor}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <span className="text-sm text-text-secondary">{config.label}</span>
      </div>
    );
  }

  return <Icon className={`h-4 w-4 ${config.color} ${className}`} />;
};
