'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Error state for validation feedback
   */
  error?: boolean;
  /**
   * Helper text displayed below textarea
   */
  helperText?: string;
}

/**
 * Textarea Component
 *
 * Multi-line text input with auto-resize support.
 * Used for descriptions, comments, and longer text content.
 *
 * @example
 * ```tsx
 * <Textarea
 *   placeholder="Enter description..."
 *   rows={4}
 * />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, ...props }, ref) => {
    const textareaId = React.useId();
    const helperTextId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-[var(--border-primary)] bg-[var(--surface-primary)] px-3 py-2',
            'text-sm text-[var(--text-primary)] shadow-sm',
            'placeholder:text-[var(--text-tertiary)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-none',
            error && 'border-[var(--error)] focus-visible:ring-[var(--error)]',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? helperTextId : undefined}
          {...props}
        />
        {helperText && (
          <p
            id={helperTextId}
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-[var(--error)]' : 'text-[var(--text-secondary)]'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
