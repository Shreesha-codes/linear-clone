import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

/**
 * Authentication configuration
 * Centralized auth settings and constants
 */
export const authConfig = {
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d', // Access token expires in 7 days
  },

  // Session settings
  session: {
    expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  },

  // Password hashing
  bcrypt: {
    saltRounds: 12, // Cost factor for bcrypt (higher = more secure but slower)
  },
} as const;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
}

/**
 * Compare a password with its hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches hash
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 * @param payload - Token payload (user data)
 * @returns JWT token string
 */
export function generateToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, authConfig.jwt.secret, {
    expiresIn: authConfig.jwt.expiresIn,
  });
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): { userId: string; email: string } {
  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}

/**
 * Generate a secure session token
 * @returns Random UUID v4
 */
export function generateSessionToken(): string {
  return randomUUID();
}

/**
 * Calculate session expiration date
 * @returns Date when session expires (7 days from now)
 */
export function getSessionExpiration(): Date {
  return new Date(Date.now() + authConfig.session.expiresIn);
}
