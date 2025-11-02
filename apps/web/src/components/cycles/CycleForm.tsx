'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Cycle } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/**
 * Cycle Form Data Interface
 */
interface CycleFormData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

/**
 * Cycle Form Props
 */
interface CycleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CycleFormData) => Promise<void>;
  initialData?: Partial<Cycle>;
  mode?: 'create' | 'edit';
  nextCycleNumber?: number;
}

// Validation schema matching database constraints
const cycleFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(2000, 'Description too long').optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

/**
 * CycleForm Component
 *
 * Create/edit cycle modal with all cycle properties.
 * Uses React Hook Form + Zod for validation.
 *
 * Features:
 * - All 4 cycle fields (name, description, startDate, endDate)
 * - Auto-generated cycle name suggestion
 * - Date range validation
 * - Form validation with error messages
 * - Keyboard shortcut: Cmd/Ctrl+Enter to submit
 * - Reset on submit/close
 * - Create vs Edit modes
 *
 * @example
 * ```tsx
 * <CycleForm
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={handleSubmit}
 *   mode="create"
 *   nextCycleNumber={5}
 * />
 * ```
 */
export function CycleForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
  nextCycleNumber,
}: CycleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate suggested name based on cycle number
  const suggestedName =
    mode === 'create' && nextCycleNumber ? `Sprint ${nextCycleNumber}` : 'New Cycle';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CycleFormData>({
    resolver: zodResolver(cycleFormSchema),
    defaultValues: {
      name: initialData?.name || suggestedName,
      description: initialData?.description || '',
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split('T')[0]
        : '',
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split('T')[0]
        : '',
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || suggestedName,
        description: initialData?.description || '',
        startDate: initialData?.startDate
          ? new Date(initialData.startDate).toISOString().split('T')[0]
          : '',
        endDate: initialData?.endDate
          ? new Date(initialData.endDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [isOpen, initialData, reset, suggestedName]);

  const handleFormSubmit = useCallback(
    async (data: CycleFormData) => {
      try {
        setIsSubmitting(true);
        await onSubmit(data);
        reset();
      } catch (error) {
        console.error('Failed to submit cycle form:', error);
        // TODO: Show error toast (Phase 4.20)
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, reset]
  );

  // Handle Cmd/Ctrl+Enter to submit
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(handleFormSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleSubmit, handleFormSubmit]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Cycle' : 'Edit Cycle'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Cycle Name *
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Sprint 1, Q1 2025"
              className="mt-1"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of this cycle's goals"
              rows={3}
              className="mt-1"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Optional. Markdown supported.</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">
                Start Date *
              </label>
              <Input id="startDate" type="date" {...register('startDate')} className="mt-1" />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-400">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                End Date *
              </label>
              <Input id="endDate" type="date" {...register('endDate')} className="mt-1" />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-400">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Cycle Number Info (Create mode only) */}
          {mode === 'create' && nextCycleNumber && (
            <div className="rounded-md bg-gray-800 p-3">
              <p className="text-sm text-gray-400">
                This will be cycle{' '}
                <span className="font-medium text-white">#{nextCycleNumber}</span> for this team.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Cycle' : 'Save Changes'}
            </Button>
          </div>

          {/* Keyboard hint */}
          <p className="text-center text-xs text-gray-500">
            Press <kbd className="rounded bg-gray-800 px-1 py-0.5">Cmd</kbd> +{' '}
            <kbd className="rounded bg-gray-800 px-1 py-0.5">Enter</kbd> to submit
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
