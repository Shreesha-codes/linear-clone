'use client';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { calculateCycleProgress, getCycleDaysRemaining } from '@/stores/cycle-store';
import type { Cycle } from '@/types';
import { Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface CycleCardProps {
  cycle: Cycle;
  teamId: string;
  className?: string;
}

/**
 * CycleCard Component
 *
 * Displays a cycle card with progress visualization, dates, and metadata.
 * Used in the cycles list view (grid layout).
 *
 * Features:
 * - Progress bar based on time elapsed
 * - Status badge (active, upcoming, past)
 * - Start/end date display
 * - Days remaining indicator
 * - Hover effects with elevation
 * - Click to navigate to cycle detail page
 *
 * @example
 * ```tsx
 * <CycleCard cycle={cycle} teamId={teamId} />
 * ```
 */
export function CycleCard({ cycle, teamId, className = '' }: CycleCardProps) {
  const progress = calculateCycleProgress(cycle);
  const daysRemaining = getCycleDaysRemaining(cycle);

  // Determine cycle status
  const now = new Date();
  const start = new Date(cycle.startDate);
  const end = new Date(cycle.endDate);
  const isActive = start <= now && now <= end;
  const isUpcoming = start > now;

  const statusLabel = isActive ? 'Active' : isUpcoming ? 'Upcoming' : 'Past';
  const statusVariant = isActive ? 'inProgress' : isUpcoming ? 'backlog' : 'done';

  return (
    <Link
      href={`/team/${teamId}/cycle/${cycle.id}`}
      className={`block rounded-lg border border-gray-800 bg-gray-900 p-5 transition-all hover:scale-[1.02] hover:shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{cycle.name}</h3>
          {cycle.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-400">{cycle.description}</p>
          )}
        </div>
        <Badge variant={statusVariant} className="ml-2 shrink-0">
          {statusLabel}
        </Badge>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-medium text-white">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2">
        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
          </span>
        </div>

        {/* Days Remaining */}
        {isActive && daysRemaining > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="h-4 w-4" />
            <span>
              {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
            </span>
          </div>
        )}

        {isActive && daysRemaining <= 0 && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <TrendingUp className="h-4 w-4" />
            <span>Ending today</span>
          </div>
        )}

        {isUpcoming && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <TrendingUp className="h-4 w-4" />
            <span>Starts in {Math.abs(daysRemaining)} days</span>
          </div>
        )}
      </div>

      {/* Quick Stats (Placeholder) */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-3">
        <div className="text-sm text-gray-400">
          <span className="font-medium text-white">0</span> issues
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-medium text-white">0</span> completed
        </div>
      </div>
    </Link>
  );
}
