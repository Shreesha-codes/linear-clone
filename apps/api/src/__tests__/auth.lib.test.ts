import { describe, expect, it } from 'vitest';
import {
  authConfig,
  comparePassword,
  generateSessionToken,
  generateToken,
  getSessionExpiration,
  hashPassword,
  verifyToken,
} from '../lib/auth';

describe('Auth Library', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const result = await comparePassword('WrongPassword', hash);

      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user data in token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const payload = { userId: '123', email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded).toEqual(expect.objectContaining(payload));
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid token');
    });

    it('should throw error for malformed token', () => {
      expect(() => verifyToken('not.a.token')).toThrow();
    });
  });

  describe('generateSessionToken', () => {
    it('should generate a UUID session token', () => {
      const token = generateSessionToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      // UUID v4 format
      expect(token).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate unique tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('getSessionExpiration', () => {
    it('should return a date 7 days in the future', () => {
      const now = Date.now();
      const expiration = getSessionExpiration();
      const expectedExpiration = now + authConfig.session.expiresIn;

      // Allow 1 second tolerance for test execution time
      expect(expiration.getTime()).toBeGreaterThanOrEqual(expectedExpiration - 1000);
      expect(expiration.getTime()).toBeLessThanOrEqual(expectedExpiration + 1000);
    });
  });
});
