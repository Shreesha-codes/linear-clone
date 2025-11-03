'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Issue, IssuePriority, IssueStatus } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// Validation schema matching database constraints
const issueFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'done', 'cancelled']),
  priority: z.enum(['none', 'low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().uuid().nullable().optional(),
  projectId: z.string().uuid().nullable().optional(),
  cycleId: z.string().uuid().nullable().optional(),
  dueDate: z.string().nullable().optional(), // ISO date string
  estimate: z
    .number({ invalid_type_error: 'Estimate must be a number' })
    .int()
    .min(0)
    .max(100)
    .nullable()
    .optional(),
  labelIds: z.array(z.string().uuid()),
});

type IssueFormData = z.infer<typeof issueFormSchema>;

interface IssueFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IssueFormData) => Promise<void>;
  initialData?: Partial<Issue>;
  mode: 'create' | 'edit';
  teamId: string;
}

const STATUS_OPTIONS: { value: IssueStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS: { value: IssuePriority; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

/**
 * IssueForm Component
 *
 * Features:
 * - Create/edit issue modal with Dialog
 * - React Hook Form + Zod validation
 * - All issue properties (title, description, status, priority, assignee, etc.)
 * - Keyboard shortcut (⌘Enter to save)
 * - Markdown support note for description
 * - Type-safe with proper error handling
 */
export function IssueForm({ isOpen, onClose, onSubmit, initialData, mode }: IssueFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'backlog',
      priority: initialData?.priority || 'none',
      assigneeId: initialData?.assignee?.id || null,
      projectId: initialData?.project?.id || null,
      cycleId: initialData?.cycle?.id || null,
      dueDate: initialData?.dueDate
        ? typeof initialData.dueDate === 'string'
          ? initialData.dueDate
          : new Date(initialData.dueDate).toISOString().split('T')[0]
        : null,
      estimate: initialData?.estimate || null,
      labelIds: initialData?.labels?.map((l) => l.id) || [],
    },
  });

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      reset({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'backlog',
        priority: initialData?.priority || 'none',
        assigneeId: initialData?.assignee?.id || null,
        projectId: initialData?.project?.id || null,
        cycleId: initialData?.cycle?.id || null,
        dueDate: initialData?.dueDate
          ? typeof initialData.dueDate === 'string'
            ? initialData.dueDate
            : new Date(initialData.dueDate).toISOString().split('T')[0]
          : null,
        estimate: initialData?.estimate || null,
        labelIds: initialData?.labels?.map((l) => l.id) || [],
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = useCallback(
    async (data: IssueFormData) => {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
        reset();
        onClose();
      } catch (error) {
        console.error('Failed to submit issue:', error);
        // TODO: Show error toast notification (Phase 4.20)
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, reset, onClose]
  );

  // Keyboard shortcut: Cmd/Ctrl+Enter to submit
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Issue' : 'Edit Issue'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-text-primary">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Issue title"
              className={errors.title ? 'border-red-500' : ''}
              autoFocus
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-text-primary">
              Description
            </label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Add a description... (Markdown supported)"
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-text-tertiary">Markdown formatting is supported</p>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Field */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-text-primary">
                Status <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium text-text-primary">
                Priority <span className="text-red-500">*</span>
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
            </div>
          </div>

          {/* Assignee and Estimate Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assignee Field - Placeholder for now */}
            <div className="space-y-2">
              <label htmlFor="assigneeId" className="text-sm font-medium text-text-primary">
                Assignee
              </label>
              <Input
                id="assigneeId"
                {...register('assigneeId')}
                placeholder="No assignee"
                disabled
                className="cursor-not-allowed opacity-50"
              />
              <p className="text-xs text-text-tertiary">Assignee picker coming in Phase 4.9</p>
            </div>

            {/* Estimate Field */}
            <div className="space-y-2">
              <label htmlFor="estimate" className="text-sm font-medium text-text-primary">
                Estimate (points)
              </label>
              <Input
                id="estimate"
                type="number"
                min="0"
                max="100"
                {...register('estimate', {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === '' ? null : Number(v)),
                })}
                placeholder="0"
              />
              {errors.estimate && <p className="text-sm text-red-500">{errors.estimate.message}</p>}
            </div>
          </div>

          {/* Project and Cycle Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Project Field - Placeholder */}
            <div className="space-y-2">
              <label htmlFor="projectId" className="text-sm font-medium text-text-primary">
                Project
              </label>
              <Input
                id="projectId"
                {...register('projectId')}
                placeholder="No project"
                disabled
                className="cursor-not-allowed opacity-50"
              />
              <p className="text-xs text-text-tertiary">Project picker coming in Phase 4.9</p>
            </div>

            {/* Cycle Field - Placeholder */}
            <div className="space-y-2">
              <label htmlFor="cycleId" className="text-sm font-medium text-text-primary">
                Cycle
              </label>
              <Input
                id="cycleId"
                {...register('cycleId')}
                placeholder="No cycle"
                disabled
                className="cursor-not-allowed opacity-50"
              />
              <p className="text-xs text-text-tertiary">Cycle picker coming in Phase 4.10</p>
            </div>
          </div>

          {/* Due Date Field */}
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium text-text-primary">
              Due Date
            </label>
            <div className="relative">
              <Input id="dueDate" type="date" {...register('dueDate')} className="pl-10" />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary pointer-events-none" />
            </div>
            {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
          </div>

          {/* Labels Field - Placeholder */}
          <div className="space-y-2">
            <label htmlFor="labels" className="text-sm font-medium text-text-primary">
              Labels
            </label>
            <Input
              id="labels"
              placeholder="No labels"
              disabled
              className="cursor-not-allowed opacity-50"
            />
            <p className="text-xs text-text-tertiary">Label multi-select coming in Phase 4.9</p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Issue' : 'Save Changes'}
            </Button>
          </div>

          {/* Keyboard Hint */}
          <p className="text-xs text-center text-text-tertiary">
            Press{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-surface-secondary rounded">
              ⌘
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-surface-secondary rounded">
              Enter
            </kbd>{' '}
            to save
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
