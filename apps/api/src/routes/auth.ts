import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import {
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/auth.service';

/**
 * Authentication Routes
 * Handles user registration, login, logout, and session management
 */

// Define context type with auth variables
type AuthVariables = {
  userId: string;
  userEmail: string;
};

const auth = new Hono<{ Variables: AuthVariables }>();

/**
 * POST /api/auth/register
 * Register a new user
 */
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const validated = registerSchema.parse(body);

    // Register user
    const result = await registerUser(validated);

    return c.json(
      {
        data: {
          user: result.user,
          token: result.token,
        },
      },
      201,
    );
  } catch (error) {
    console.error('Register error:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === 'User with this email already exists') {
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

      // Validation errors from Zod
      if (error.name === 'ZodError') {
        return c.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid input data',
              details: error,
            },
          },
          422,
        );
      }
    }

    return c.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to register user',
        },
      },
      500,
    );
  }
});

/**
 * POST /api/auth/login
 * Login user with email and password
 */
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    const validated = loginSchema.parse(body);

    // Login user
    const result = await loginUser(validated);

    return c.json({
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message === 'Invalid email or password') {
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

      // Validation errors from Zod
      if (error.name === 'ZodError') {
        return c.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Invalid input data',
              details: error,
            },
          },
          422,
        );
      }
    }

    return c.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to login',
        },
      },
      500,
    );
  }
});

/**
 * POST /api/auth/logout
 * Logout user (requires authentication)
 */
auth.post('/logout', authMiddleware, async (c) => {
  try {
    // Get session token from request header or body
    const sessionToken = c.req.header('X-Session-Token');

    if (!sessionToken) {
      return c.json(
        {
          error: {
            code: 'BAD_REQUEST',
            message: 'Session token is required',
          },
        },
        400,
      );
    }

    // Logout user
    await logoutUser(sessionToken);

    return c.json(
      {
        data: {
          message: 'Logged out successfully',
        },
      },
      200,
    );
  } catch (error) {
    console.error('Logout error:', error);

    return c.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to logout',
        },
      },
      500,
    );
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
auth.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId') as string | undefined;

    if (!userId) {
      return c.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        },
        401,
      );
    }

    // Get user by ID
    const user = await getUserById(userId);

    return c.json({
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);

    if (error instanceof Error && error.message === 'User not found') {
      return c.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        404,
      );
    }

    return c.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get current user',
        },
      },
      500,
    );
  }
});

export default auth;
