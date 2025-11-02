/**
 * Issue API endpoints
 */

import { type ApiResponse, apiClient } from './client';

export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';
export type IssuePriority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export interface Issue {
  id: string;
  teamId: string;
  projectId?: string | null;
  cycleId?: string | null;
  identifier: string;
  title: string;
  description?: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId?: string | null;
  creatorId: string;
  parentId?: string | null;
  dueDate?: string | null;
  estimate?: number | null;
  sortOrder: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFilters {
  status?: IssueStatus[];
  priority?: IssuePriority[];
  assigneeId?: string;
  projectId?: string;
  cycleId?: string;
  search?: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  projectId?: string;
  cycleId?: string;
  parentId?: string;
  dueDate?: string;
  estimate?: number;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  projectId?: string;
  cycleId?: string;
  parentId?: string;
  dueDate?: string;
  estimate?: number;
  sortOrder?: number;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  parentId?: string | null;
  body: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface ActivityLog {
  id: string;
  workspaceId: string;
  userId: string;
  entityType: string;
  entityId: string;
  action: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface CreateCommentRequest {
  body: string;
  parentId?: string;
}

/**
 * Issue API
 */
export const issueApi = {
  /**
   * List issues for a team with optional filters
   */
  list: (teamId: string, filters?: IssueFilters) =>
    apiClient.get<ApiResponse<Issue[]>>(`/teams/${teamId}/issues`, {
      params: filters as Record<string, string | number | boolean | undefined>,
    }),

  /**
   * Create a new issue
   */
  create: (teamId: string, data: CreateIssueRequest) =>
    apiClient.post<ApiResponse<Issue>>(`/teams/${teamId}/issues`, data),

  /**
   * Get issue by ID
   */
  get: (id: string) => apiClient.get<ApiResponse<Issue>>(`/issues/${id}`),

  /**
   * Update issue
   */
  update: (id: string, data: UpdateIssueRequest) =>
    apiClient.patch<ApiResponse<Issue>>(`/issues/${id}`, data),

  /**
   * Delete issue
   */
  delete: (id: string) => apiClient.delete<void>(`/issues/${id}`),

  /**
   * Archive issue
   */
  archive: (id: string) => apiClient.post<ApiResponse<Issue>>(`/issues/${id}/archive`),

  /**
   * Get issue comments
   */
  getComments: (id: string) => apiClient.get<ApiResponse<Comment[]>>(`/issues/${id}/comments`),

  /**
   * Create comment on issue
   */
  createComment: (id: string, data: CreateCommentRequest) =>
    apiClient.post<ApiResponse<Comment>>(`/issues/${id}/comments`, data),

  /**
   * Get issue activity
   */
  getActivity: (id: string) => apiClient.get<ApiResponse<ActivityLog[]>>(`/issues/${id}/activity`),
};
