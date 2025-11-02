/**
 * Workspace API endpoints
 */

import { type ApiResponse, apiClient } from './client';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  icon?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  slug?: string;
  icon?: string;
}

export interface AddWorkspaceMemberRequest {
  userId: string;
  role: 'admin' | 'member' | 'guest';
}

/**
 * Workspace API
 */
export const workspaceApi = {
  /**
   * List all workspaces for current user
   */
  list: () => apiClient.get<ApiResponse<Workspace[]>>('/workspaces'),

  /**
   * Create a new workspace
   */
  create: (data: CreateWorkspaceRequest) =>
    apiClient.post<ApiResponse<Workspace>>('/workspaces', data),

  /**
   * Get workspace by ID
   */
  get: (id: string) => apiClient.get<ApiResponse<Workspace>>(`/workspaces/${id}`),

  /**
   * Update workspace
   */
  update: (id: string, data: UpdateWorkspaceRequest) =>
    apiClient.patch<ApiResponse<Workspace>>(`/workspaces/${id}`, data),

  /**
   * Delete workspace
   */
  delete: (id: string) => apiClient.delete<void>(`/workspaces/${id}`),

  /**
   * Get workspace members
   */
  getMembers: (id: string) =>
    apiClient.get<ApiResponse<WorkspaceMember[]>>(`/workspaces/${id}/members`),

  /**
   * Add member to workspace
   */
  addMember: (id: string, data: AddWorkspaceMemberRequest) =>
    apiClient.post<ApiResponse<WorkspaceMember>>(`/workspaces/${id}/members`, data),

  /**
   * Remove member from workspace
   */
  removeMember: (id: string, userId: string) =>
    apiClient.delete<void>(`/workspaces/${id}/members/${userId}`),
};
