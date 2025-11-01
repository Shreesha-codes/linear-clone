import { db } from '@repo/database/client';
import { sessions, users, type SafeUser } from '@repo/database/schema';
import { eq } from 'drizzle-orm';
import {
  comparePassword,
  generateSessionToken,
  generateToken,
  getSessionExpiration,
  hashPassword,
} from '../lib/auth';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';

/**
 * Authentication Service
 * Handles user registration, login, logout, and session management
 * Following clean architecture: business logic separated from HTTP layer
 */

/**
 * Register a new user
 * @param input - User registration data
 * @returns User object (without password) and auth token
 * @throws Error if email already exists or database operation fails
 */
export async function registerUser(input: RegisterInput): Promise<{
  user: SafeUser;
  token: string;
  sessionToken: string;
}> {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: input.email,
        name: input.name,
        passwordHash,
      })
      .returning();

    if (!newUser) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiration();

    await db.insert(sessions).values({
      userId: newUser.id,
      token: sessionToken,
      expiresAt,
    });

    // Return user without password hash
    const { passwordHash: _, ...safeUser } = newUser;

    return {
      user: safeUser,
      token,
      sessionToken,
    };
  } catch (error) {
    console.error('Register user error:', error);
    throw error;
  }
}

/**
 * Login user with email and password
 * @param input - Login credentials
 * @returns User object (without password) and auth token
 * @throws Error if credentials are invalid
 */
export async function loginUser(input: LoginInput): Promise<{
  user: SafeUser;
  token: string;
  sessionToken: string;
}> {
  try {
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Create new session
    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiration();

    await db.insert(sessions).values({
      userId: user.id,
      token: sessionToken,
      expiresAt,
    });

    // Return user without password hash
    const { passwordHash: _, ...safeUser } = user;

    return {
      user: safeUser,
      token,
      sessionToken,
    };
  } catch (error) {
    console.error('Login user error:', error);
    throw error;
  }
}

/**
 * Logout user by deleting session
 * @param sessionToken - Session token to invalidate
 */
export async function logoutUser(sessionToken: string): Promise<void> {
  try {
    await db.delete(sessions).where(eq(sessions.token, sessionToken));
  } catch (error) {
    console.error('Logout user error:', error);
    throw error;
  }
}

/**
 * Get user by ID
 * @param userId - User ID
 * @returns User object (without password)
 * @throws Error if user not found
 */
export async function getUserById(userId: string): Promise<SafeUser> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password hash
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
}

/**
 * Clean up expired sessions
 * Should be run periodically (e.g., via cron job)
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await db.delete(sessions).where(eq(sessions.expiresAt, new Date()));
  } catch (error) {
    console.error('Cleanup expired sessions error:', error);
    throw error;
  }
}
