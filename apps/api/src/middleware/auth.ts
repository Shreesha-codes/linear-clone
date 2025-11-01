import type { Context, Next } from 'hono';
import { verifyToken } from '../lib/auth';

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header and attaches user info to context
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authorization header is required',
          },
        },
        401,
      );
    }

    // Check if token is in Bearer format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authorization header must be in format: Bearer <token>',
          },
        },
        401,
      );
    }

    const token = parts[1];

    if (!token) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token is missing',
          },
        },
        401,
      );
    }

    // Verify token
    let decoded: { userId: string; email: string };
    try {
      decoded = verifyToken(token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message,
          },
        },
        401,
      );
    }

    // Attach user info to context for use in route handlers
    c.set('userId', decoded.userId);
    c.set('userEmail', decoded.email);

    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Authentication failed',
        },
      },
      500,
    );
  }
}

/**
 * Optional auth middleware
 * Attaches user info if token is valid, but doesn't block request if not
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  try {
    const authHeader = c.req.header('Authorization');

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer' && parts[1]) {
        try {
          const decoded = verifyToken(parts[1]);
          c.set('userId', decoded.userId);
          c.set('userEmail', decoded.email);
        } catch {
          // Token is invalid, but we don't block the request
        }
      }
    }

    await next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    await next();
  }
}
