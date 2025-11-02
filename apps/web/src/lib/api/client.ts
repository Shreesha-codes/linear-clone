/**
 * API Client for Linear Clone
 * Handles all HTTP requests to the backend API with proper error handling,
 * authentication, and type safety.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Standard API error response
 */
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    totalPages: number;
    totalCount: number;
  };
}

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  code: string;
  details?: unknown;
  status: number;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/**
 * Request configuration options
 */
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Main request function with error handling and auth
 */
async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
  const { params, requiresAuth = true, headers = {}, ...fetchConfig } = config;

  // Build URL with query params
  const url = buildUrl(endpoint, params);

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add auth token if required
  if (requiresAuth) {
    // Dynamically import to avoid circular dependencies
    const { useAuthStore } = await import('../../stores/authStore');
    const token = useAuthStore.getState().token;
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers: requestHeaders,
    });

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: ApiError;

      try {
        const data = await response.json();
        errorData = data.error || {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred',
        };
      } catch {
        errorData = {
          code: 'PARSE_ERROR',
          message: 'Failed to parse error response',
        };
      }

      throw new APIError(errorData.message, errorData.code, response.status, errorData.details);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Re-throw API errors
    if (error instanceof APIError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new APIError('Network error. Please check your connection.', 'NETWORK_ERROR', 0);
    }

    // Handle other errors
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'UNEXPECTED_ERROR',
      0
    );
  }
}

/**
 * API Client with convenience methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
};

/**
 * Type-safe API client (extend this as you add more endpoints)
 */
export const api = {
  // Re-export base client for custom requests
  client: apiClient,

  /**
   * Health check
   */
  health: () =>
    apiClient.get<{ status: string; timestamp: string }>('/health', {
      requiresAuth: false,
    }),
};
