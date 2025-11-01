import { z } from 'zod';

/**
 * Validation schemas for authentication requests
 * Using Zod for runtime type safety and validation
 */

/**
 * User registration schema
 * Validates email, password, and name
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(3, 'Email must be at least 3 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters')
    .trim(),
});

/**
 * User login schema
 * Validates email and password
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Inferred TypeScript types from schemas
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
