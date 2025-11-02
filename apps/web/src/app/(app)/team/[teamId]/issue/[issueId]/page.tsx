'use client';

import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { IssuePriorityIcon } from '@/components/issues/IssuePriorityIcon';
import { IssueStatusBadge } from '@/components/issues/IssueStatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { useIssueStore } from '@/stores/issue-store';

interface PageProps {
  params: {
    teamId: string;
    issueId: string;
  };
}

/**
 * Issue Detail Page
 *
 * Features:
 * - Editable title (inline)
 * - Markdown description editor with preview
 * - Property panel (status, priority, assignee, labels, etc.)
 * - Comments section with threading
 * - Activity timeline
 * - Attachments section
 */
export default function IssueDetailPage({ params }: PageProps) {
  const { teamId, issueId } = params;

  const issue = useIssueStore((state) => state.issues.get(issueId));
  const updateIssue = useIssueStore((state) => state.updateIssue);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-text-primary">Issue not found</h1>
          <p className="mt-2 text-sm text-text-secondary">
            The issue you're looking for doesn't exist.
          </p>
          <Link href={`/team/${teamId}/issues`}>
            <Button variant="primary" className="mt-4">
              Back to Issues
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleTitleSave = () => {
    if (title.trim() && title !== issue.title) {
      updateIssue(issueId, { title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    if (description !== issue.description) {
      updateIssue(issueId, { description });
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <Link
            href={`/team/${teamId}/issues`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to issues
          </Link>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Issue Header */}
          <div className="flex items-start gap-4">
            <IssuePriorityIcon priority={issue.priority} showLabel={false} className="mt-1" />
            <div className="flex-1">
              {/* Issue Identifier */}
              <p className="text-sm font-medium text-text-tertiary">{issue.identifier}</p>

              {/* Editable Title */}
              {isEditingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTitleSave();
                    } else if (e.key === 'Escape') {
                      setTitle(issue.title);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="mt-1 text-2xl font-semibold"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  className="mt-1 text-2xl font-semibold text-text-primary cursor-text hover:bg-surface-secondary rounded px-2 -mx-2 text-left w-full"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {issue.title}
                </button>
              )}
            </div>

            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-text-secondary mb-2">Description</h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionSave}
              placeholder="Add a description..."
              className="min-h-[200px] resize-none"
            />
            <p className="mt-1 text-xs text-text-tertiary">Supports Markdown formatting</p>
          </div>

          {/* Comments Section (Placeholder) */}
          <div>
            <h2 className="text-sm font-semibold text-text-secondary mb-4">Comments</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback name="You" />
                </Avatar>
                <div className="flex-1">
                  <Textarea placeholder="Add a comment..." className="min-h-[80px] resize-none" />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm">
                      Comment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing comments would go here */}
              <p className="text-sm text-text-tertiary">No comments yet</p>
            </div>
          </div>

          {/* Activity Timeline (Placeholder) */}
          <div>
            <h2 className="text-sm font-semibold text-text-secondary mb-4">Activity</h2>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center text-text-tertiary">
                  <span className="text-xs">📝</span>
                </div>
                <div>
                  <p className="text-text-secondary">
                    <span className="font-medium text-text-primary">{issue.creator?.name}</span>{' '}
                    created this issue
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {formatRelativeTime(issue.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Properties */}
      <div className="w-80 border-l border-border p-6 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold text-text-tertiary uppercase mb-3">Properties</h3>

          <div className="space-y-4">
            {/* Status */}
            <div>
              <div className="text-sm text-text-secondary mb-2 block">Status</div>
              <IssueStatusBadge status={issue.status} />
            </div>

            {/* Priority */}
            <div>
              <div className="text-sm text-text-secondary mb-2 block">Priority</div>
              <IssuePriorityIcon priority={issue.priority} showLabel />
            </div>

            {/* Assignee */}
            <div>
              <div className="text-sm text-text-secondary mb-2 block">Assignee</div>
              {issue.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={issue.assignee.avatarUrl || undefined}
                      alt={issue.assignee.name}
                    />
                    <AvatarFallback name={issue.assignee.name} />
                  </Avatar>
                  <span className="text-sm text-text-primary">{issue.assignee.name}</span>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="justify-start w-full">
                  Assign to...
                </Button>
              )}
            </div>

            {/* Labels */}
            <div>
              <div className="text-sm text-text-secondary mb-2 block">Labels</div>
              {issue.labels && issue.labels.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {issue.labels.map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center rounded px-2 py-1 text-xs bg-surface-secondary text-text-primary"
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="justify-start w-full">
                  Add labels...
                </Button>
              )}
            </div>

            {/* Due Date */}
            <div>
              <div className="text-sm text-text-secondary mb-2 block">Due Date</div>
              {issue.dueDate ? (
                <p className="text-sm text-text-primary">{formatDate(issue.dueDate)}</p>
              ) : (
                <Button variant="ghost" size="sm" className="justify-start w-full">
                  Set due date...
                </Button>
              )}
            </div>

            {/* Estimate */}
            <div>
              <div className="text-sm text-text-secondary mb-2 block">Estimate</div>
              {issue.estimate ? (
                <p className="text-sm text-text-primary">{issue.estimate} points</p>
              ) : (
                <Button variant="ghost" size="sm" className="justify-start w-full">
                  Add estimate...
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="pt-6 border-t border-border">
          <div className="space-y-2 text-xs text-text-tertiary">
            <p>Created {formatRelativeTime(issue.createdAt)}</p>
            <p>Updated {formatRelativeTime(issue.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
