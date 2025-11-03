import type { User } from '@/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Authentication State Interface
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Authentication Actions Interface
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Authentication Store
 *
 * Manages user authentication state with persistent storage.
 * Uses Zustand with devtools for Redux DevTools integration.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuthStore();
 *
 * // Login
 * login(userData, accessToken);
 *
 * // Logout
 * logout();
 * ```
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setUser: (user) => set({ user, isAuthenticated: !!user }, false, 'auth/setUser'),

        setToken: (token) => set({ token }, false, 'auth/setToken'),

        login: (user, token) =>
          set(
            {
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            },
            false,
            'auth/login'
          ),

        logout: () =>
          set(
            {
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            },
            false,
            'auth/logout'
          ),

        setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),
      }),
      {
        name: 'linear-clone-auth',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

/**
 * Selector hooks for better performance
 * Use these instead of accessing the full store
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthToken = () => useAuthStore((state) => state.token);
