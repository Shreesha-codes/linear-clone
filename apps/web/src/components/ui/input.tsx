'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Icon to display on the left side
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right side
   */
  rightIcon?: React.ReactNode;
  /**
   * Error state for validation feedback
   */
  error?: boolean;
  /**
   * Helper text displayed below input
   */
  helperText?: string;
}

/**
 * Input Component
 *
 * Accessible text input with icon support and error states.
 * Follows Linear's minimal design with proper focus indicators.
 *
 * @example
 * ```tsx
 * <Input placeholder="Enter email" type="email" />
 *
 * <Input
 *   leftIcon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * <Input
 *   error
 *   helperText="This field is required"
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, helperText, disabled, ...props }, ref) => {
    const inputId = React.useId();
    const helperTextId = `${inputId}-helper`;

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-9 w-full rounded-md border border-[var(--border-primary)] bg-[var(--surface-primary)] px-3 py-1 text-sm text-[var(--text-primary)] shadow-sm transition-colors',
              'placeholder:text-[var(--text-tertiary)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-[var(--error)] focus-visible:ring-[var(--error)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperText ? helperTextId : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </div>
          )}
        </div>
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

Input.displayName = 'Input';

export { Input };
