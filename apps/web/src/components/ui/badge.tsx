'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge variants for status indicators, labels, and tags
 * Follows Linear's badge design system
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--surface-tertiary)] text-[var(--text-primary)] border border-[var(--border-primary)]',
        primary: 'bg-[var(--primary)] text-[var(--primary-foreground)]',
        secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)]',
        success: 'bg-[var(--success)] text-[var(--success-foreground)]',
        warning: 'bg-[var(--warning)] text-[var(--warning-foreground)]',
        error: 'bg-[var(--error)] text-[var(--error-foreground)]',
        outline: 'border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)]',
        // Issue status variants
        backlog:
          'bg-[var(--status-backlog)]/10 text-[var(--status-backlog)] border border-[var(--status-backlog)]/20',
        todo: 'bg-[var(--status-todo)]/10 text-[var(--status-todo)] border border-[var(--status-todo)]/20',
        inProgress:
          'bg-[var(--status-in-progress)]/10 text-[var(--status-in-progress)] border border-[var(--status-in-progress)]/20',
        done: 'bg-[var(--status-done)]/10 text-[var(--status-done)] border border-[var(--status-done)]/20',
        cancelled:
          'bg-[var(--status-cancelled)]/10 text-[var(--status-cancelled)] border border-[var(--status-cancelled)]/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Icon to display on the left
   */
  icon?: React.ReactNode;
  /**
   * Whether the badge is removable (shows close button)
   */
  onRemove?: () => void;
}

/**
 * Badge Component
 *
 * Versatile badge for status indicators, labels, and tags.
 * Includes issue status variants matching Linear's design.
 *
 * @example
 * ```tsx
 * <Badge variant="primary">New</Badge>
 * <Badge variant="done">Completed</Badge>
 * <Badge icon={<Icon />}>With Icon</Badge>
 * <Badge onRemove={() => {}}>Removable</Badge>
 * ```
 */
function Badge({ className, variant, icon, onRemove, children, ...props }: BadgeProps) {
  const titleId = React.useId();

  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 flex-shrink-0 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
          aria-label="Remove"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-labelledby={titleId}
          >
            <title id={titleId}>Remove badge</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
