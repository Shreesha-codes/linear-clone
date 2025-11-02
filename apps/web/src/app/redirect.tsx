'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeSession } = useAuthStore();

  useEffect(() => {
    // Initialize session on page load
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    } else if (!isLoading && !isAuthenticated) {
      // Redirect unauthenticated users to login
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
