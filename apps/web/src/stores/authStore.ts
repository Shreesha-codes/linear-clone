import { authAdapter } from '@/lib/auth-client';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// SECURITY NOTE: JWT Token Storage
// Current implementation stores tokens in localStorage for development convenience.
// ⚠️ SECURITY RISK: localStorage is vulnerable to XSS attacks
//
// For production deployment, consider one of these secure alternatives:
// 1. httpOnly cookies (recommended) - immune to XSS, managed by backend
// 2. sessionStorage - cleared on tab close, still vulnerable to XSS
// 3. Memory-only storage - lost on refresh, most secure but poor UX
//
// Migration path for production:
// - Move token management to httpOnly cookies set by backend
// - Remove token from persist configuration
// - Use cookie-based authentication for API requests
// - Keep user info in localStorage for UI display only

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  // Better Auth integration methods
  initializeSession: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        // Actions
        setUser: (user) => set({ user, isAuthenticated: user !== null }),

        setToken: (token) => set({ token }),

        login: (user, token) =>
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          }),

        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          }),

        setLoading: (isLoading) => set({ isLoading }),

        // Better Auth integration methods
        initializeSession: async () => {
          const currentState = useAuthStore.getState();

          // If we already have user and token from persisted state, we're good
          if (currentState.user && currentState.token) {
            console.log('[Auth] Session restored from localStorage');
            set({ isLoading: false, isAuthenticated: true });
            return;
          }

          // Otherwise, try to fetch from API if we have a token
          set({ isLoading: true });
          try {
            const user = await authAdapter.getCurrentUser();
            if (user) {
              console.log('[Auth] Session initialized from API');
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              console.log('[Auth] No active session found');
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error('Failed to initialize session:', error);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },

        loginWithEmail: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const response = await authAdapter.login({ email, password });
            const { user, token } = response.data;

            // Store token in localStorage
            localStorage.setItem('authToken', token);

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        registerWithEmail: async (email: string, password: string, name: string) => {
          set({ isLoading: true });
          try {
            const response = await authAdapter.register({ email, password, name });
            const { user, token } = response.data;

            // Store token in localStorage
            localStorage.setItem('authToken', token);

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logoutUser: async () => {
          set({ isLoading: true });
          try {
            await authAdapter.logout();
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token, // TODO: Remove from localStorage in production, use httpOnly cookies
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// Selector hooks for better TypeScript inference
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
