import type { Context } from 'hono';

/**
 * Global error handler middleware
 * Catches and formats errors consistently across the API
 */

/**
 * Handle application errors and return consistent error responses
 * @param error - Error object
 * @param c - Hono context
 */
export function errorHandler(error: Error, c: Context) {
  console.error('Error:', error);

  // Handle specific error types
  if (error.message.includes('not found')) {
    return c.json(
      {
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        },
      },
      404,
    );
  }

  if (error.message.includes('already exists')) {
    return c.json(
      {
        error: {
          code: 'CONFLICT',
          message: error.message,
        },
      },
      409,
    );
  }

  if (error.message.includes('unauthorized') || error.message.includes('Invalid')) {
    return c.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: error.message,
        },
      },
      401,
    );
  }

  if (error.message.includes('forbidden')) {
    return c.json(
      {
        error: {
          code: 'FORBIDDEN',
          message: error.message,
        },
      },
      403,
    );
  }

  // Default error response
  return c.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    },
    500,
  );
}

/**
 * Not found handler
 * Returns 404 for routes that don't exist
 */
export function notFoundHandler(c: Context) {
  return c.json(
    {
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    },
    404,
  );
}
