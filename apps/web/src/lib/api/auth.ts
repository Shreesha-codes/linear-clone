/**
 * Authentication API endpoints
 */

import { type ApiResponse, apiClient } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register a new user
   */
  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data, {
      requiresAuth: false,
    }),

  /**
   * Login with email and password
   */
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data, {
      requiresAuth: false,
    }),

  /**
   * Logout current user
   */
  logout: () => apiClient.post<void>('/auth/logout'),

  /**
   * Get current authenticated user
   */
  me: () => apiClient.get<ApiResponse<User>>('/auth/me'),
};
