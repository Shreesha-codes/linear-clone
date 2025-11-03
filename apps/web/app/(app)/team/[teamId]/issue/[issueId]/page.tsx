'use client';

import { IssuePriorityIcon } from '@/components/issues/IssuePriorityIcon';
import { IssueStatusBadge } from '@/components/issues/IssueStatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { issueApi } from '@/lib/api';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { useIssueStore } from '@/stores/issue-store';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function IssueDetailPage() {
  const params = useParams();
  const teamId = params.teamId as string;
  const issueId = params.issueId as string;

  const issue = useIssueStore((state) => state.issues.get(issueId));
  const updateIssue = useIssueStore((state) => state.updateIssue);
  const addIssue = useIssueStore((state) => state.addIssue);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch issue from API if not in store
  useEffect(() => {
    if (!issue && !isLoading) {
      setIsLoading(true);
      issueApi
        .get(issueId)
        .then((response) => {
          const apiIssue = response.data;
          // Add to store (type coercion for date fields)
          addIssue(apiIssue as any);
        })
        .catch((error) => {
          console.error('Failed to fetch issue:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [issue, issueId, addIssue, isLoading]);

  // Update local state when issue changes
  useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description || '');
    }
  }, [issue]);

  if (!issue) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Issue not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The issue you're looking for doesn't exist.
          </p>
          <Link href={`/team/${teamId}/issues`}>
            <Button className="mt-4">Back to Issues</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleTitleSave = async () => {
    if (title.trim() && title !== issue.title) {
      // Optimistic update
      updateIssue(issueId, { title: title.trim() });

      // Persist to API
      try {
        await issueApi.update(issueId, { title: title.trim() });
      } catch (error) {
        // Rollback on error
        updateIssue(issueId, { title: issue.title });
        console.error('Failed to update issue title:', error);
      }
    }
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = async () => {
    if (description !== issue.description) {
      // Optimistic update
      updateIssue(issueId, { description });

      // Persist to API
      try {
        await issueApi.update(issueId, { description });
      } catch (error) {
        // Rollback on error
        updateIssue(issueId, { description: issue.description || '' });
        console.error('Failed to update issue description:', error);
      }
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
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
              <p className="text-sm font-medium text-muted-foreground">{issue.identifier}</p>

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
                  className="mt-1 text-2xl font-semibold cursor-text hover:bg-muted rounded px-2 -mx-2 text-left w-full"
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
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">Description</h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionSave}
              placeholder="Add a description..."
              className="min-h-[200px] resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">Supports Markdown formatting</p>
          </div>

          {/* Comments Section (Placeholder) */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">Comments</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>YO</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea placeholder="Add a comment..." className="min-h-[80px] resize-none" />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm">Post Comment</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline (Placeholder) */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">Activity</h2>
            <div className="text-sm text-muted-foreground">
              <p>Created {formatRelativeTime(issue.createdAt)}</p>
              {issue.updatedAt && (
                <p className="mt-1">Updated {formatRelativeTime(issue.updatedAt)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Sidebar */}
      <div className="w-80 border-l border-border overflow-y-auto">
        <div className="p-6 space-y-6">
          <h2 className="text-sm font-semibold">Properties</h2>

          {/* Status */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Status</label>
            <IssueStatusBadge status={issue.status} />
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Priority</label>
            <div className="flex items-center gap-2">
              <IssuePriorityIcon priority={issue.priority} showLabel={true} />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Assignee</label>
            {issue.assigneeId ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <span className="text-sm">Assignee Name</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Unassigned</p>
            )}
          </div>

          {/* Labels */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Labels</label>
            <div className="flex flex-wrap gap-1">
              {issue.labels && issue.labels.length > 0 ? (
                issue.labels.map((label, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {typeof label === 'string' ? label : label.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No labels</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          {issue.dueDate && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Due Date</label>
              <p className="text-sm">{formatDate(issue.dueDate)}</p>
            </div>
          )}

          {/* Estimate */}
          {issue.estimate && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Estimate</label>
              <p className="text-sm">{issue.estimate} points</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t border-border space-y-2">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Created</label>
              <p className="text-sm">{formatRelativeTime(issue.createdAt)}</p>
            </div>
            {issue.updatedAt && (
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Updated</label>
                <p className="text-sm">{formatRelativeTime(issue.updatedAt)}</p>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <div className="pt-4">
            <Button variant="destructive" size="sm" className="w-full">
              Delete Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
