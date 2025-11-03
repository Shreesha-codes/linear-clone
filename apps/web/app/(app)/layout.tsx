'use client';

import { CommandPalette } from '@/components/CommandPalette';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMockData } from '@/hooks/useMockData';
import { useAuthLoading, useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthLoading();
  const initializeSession = useAuthStore((state) => state.initializeSession);

  // Use ref to ensure session initialization only happens once
  const sessionInitialized = useRef(false);

  // Track if we've checked the session at least once to prevent premature redirects
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Initialize mock data (TODO: Remove when API is integrated)
  useMockData();

  // Check authentication - ONLY ONCE on mount
  useEffect(() => {
    if (!sessionInitialized.current) {
      sessionInitialized.current = true;

      // First, check if we have persisted auth in localStorage
      const persistedAuth = localStorage.getItem('auth-storage');
      const authToken = localStorage.getItem('authToken');

      if (persistedAuth || authToken) {
        console.log('[Layout] Found persisted auth, session should be valid');
        setHasCheckedSession(true);
      }

      initializeSession().then(() => {
        setHasCheckedSession(true);
      });
    }
  }, [initializeSession]); // Empty dependency array - run once on mount

  // Redirect to login if not authenticated - BUT ONLY AFTER we've checked the session
  useEffect(() => {
    // Don't redirect until we've actually checked if there's a session
    if (!hasCheckedSession) {
      console.log('[Layout] Waiting for session check before redirecting...');
      return;
    }

    if (!isLoading && !user && !token) {
      console.log('[Layout] No user/token found, redirecting to login');
      router.push('/login');
    }
  }, [user, token, isLoading, hasCheckedSession, router]);

  // Show loading state while checking auth OR if we haven't checked session yet
  if (isLoading || !hasCheckedSession) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user && !token) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <TopNav />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>

      {/* Command Palette (⌘K) */}
      <CommandPalette />
    </div>
  );
}
