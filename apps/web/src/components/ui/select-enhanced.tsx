'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export default function Select({
  children,
  label,
  error,
  className,
  fullWidth = false,
  ...props
}: SelectProps) {
  const selectClasses = cn(
    'appearance-none bg-muted/50 border-0 rounded-md px-3 py-1.5 pr-8 text-sm text-foreground',
    'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background',
    'transition-colors cursor-pointer',
    {
      'w-full': fullWidth,
      'border-red-500': error,
    },
    className
  );

  return (
    <div className={cn('inline-block relative', { 'w-full': fullWidth })}>
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
      <div className="relative">
        <select {...props} className={selectClasses}>
          {children}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
