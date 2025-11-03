'use client';

import { Editor } from '@/components/editor';
import { Button } from '@/components/ui/button';
import { AvatarEnhanced } from '@/components/ui/enhanced';
import { type Comment, issueApi } from '@/lib/api/issues';
import { formatRelativeTime } from '@/lib/utils';
import { useCallback, useState } from 'react';

interface CommentListProps {
  issueId: string;
}

/**
 * Comment List Component
 *
 * Displays threaded comments on an issue with create/edit/delete functionality.
 * Adapted from linear-app migration-temp with REST API integration.
 *
 * Features:
 * - List of comments with avatars and timestamps
 * - New comment form with markdown editor
 * - Optimistic updates
 * - Future: Threading, reactions, editing
 */
export function CommentList({ issueId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentBody, setNewCommentBody] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // TODO: Fetch comments from API on mount
  // useEffect(() => {
  //   issueApi.getComments(issueId).then(response => {
  //     setComments(response.data);
  //   });
  // }, [issueId]);

  const handlePost = useCallback(async () => {
    if (!newCommentBody.trim()) {
      return;
    }

    setIsPosting(true);

    try {
      const response = await issueApi.createComment(issueId, {
        body: newCommentBody,
      });

      // Add new comment to list (optimistic update)
      setComments((prev) => [...prev, response.data]);
      setNewCommentBody('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsPosting(false);
    }
  }, [issueId, newCommentBody]);

  return (
    <div className="flex flex-col gap-4">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex w-full flex-col rounded-lg border border-border bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <AvatarEnhanced name={comment.user?.name || 'Unknown'} size="sm" />
                <span className="text-sm text-text-secondary">
                  {comment.user?.name || 'Unknown'}
                </span>
                <span className="ml-auto text-xs text-text-tertiary">
                  {formatRelativeTime(new Date(comment.createdAt))}
                </span>
              </div>
              <div className="prose prose-sm max-w-full">
                <p className="text-sm text-text-primary">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Comment Form */}
      <div className="flex flex-col gap-2">
        <Editor
          value={newCommentBody}
          onChange={setNewCommentBody}
          placeholder="Add a comment..."
        />
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handlePost}
            disabled={!newCommentBody.trim() || isPosting}
          >
            {isPosting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {comments.length === 0 && (
        <p className="text-center text-sm text-text-tertiary">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
