'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { IssueFilters as IssueFiltersType } from '@/types';
import { X } from 'lucide-react';
import type { FC } from 'react';

interface IssueFiltersProps {
  filters: IssueFiltersType;
  onFilterChange: (filters: IssueFiltersType) => void;
  onClearFilters: () => void;
  className?: string;
}

/**
 * Issue filter panel component
 * Features:
 * - Multi-select filters for status, priority, assignee, labels
 * - Project and date range filters
 * - Active filter badges with remove option
 * - Clear all filters button
 */
export const IssueFilters: FC<IssueFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  className = '',
}) => {
  const hasActiveFilters =
    filters.status?.length ||
    filters.priority?.length ||
    filters.assigneeId?.length ||
    filters.labelId?.length ||
    filters.projectId ||
    filters.search;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-text-secondary">Filters:</span>

        {/* TODO: Add filter dropdowns here */}
        {/* Status multi-select */}
        {/* Priority multi-select */}
        {/* Assignee multi-select */}
        {/* Label multi-select */}
        {/* Project dropdown */}
        {/* Date range picker */}

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-auto">
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.status?.map((status) => (
            <Badge key={status} variant="outline" className="gap-1 pr-1">
              Status: {status}
              <button
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    status: filters.status?.filter((s) => s !== status),
                  });
                }}
                className="ml-1 hover:bg-surface-tertiary rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.priority?.map((priority) => (
            <Badge key={priority} variant="outline" className="gap-1 pr-1">
              Priority: {priority}
              <button
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    priority: filters.priority?.filter((p) => p !== priority),
                  });
                }}
                className="ml-1 hover:bg-surface-tertiary rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.search && (
            <Badge variant="outline" className="gap-1 pr-1">
              Search: {filters.search}
              <button
                type="button"
                onClick={() => {
                  onFilterChange({
                    ...filters,
                    search: undefined,
                  });
                }}
                className="ml-1 hover:bg-surface-tertiary rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
