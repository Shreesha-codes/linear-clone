'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { useAuthStore } from '../../../stores/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logoutUser, initializeSession } = useAuthStore();

  useEffect(() => {
    // Initialize session on page load
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You're successfully logged in to your Linear Clone dashboard
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sign out
          </Button>
        </div>

        {/* User Info Card */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-base text-gray-900 dark:text-white">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-base text-gray-900 dark:text-white">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</p>
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Created
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>Current session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <p className="text-sm text-gray-900 dark:text-white">Authenticated</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Session Type</p>
                <p className="text-base text-gray-900 dark:text-white">JWT Token</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</p>
                <p className="text-base text-gray-900 dark:text-white">LocalStorage (Dev)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with Linear Clone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" disabled>
                Create Workspace
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Create Team
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Create Issue
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                Coming soon!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Authentication Test Info */}
        <Card>
          <CardHeader>
            <CardTitle>🎉 Authentication Working!</CardTitle>
            <CardDescription>
              Your auth system is fully operational. Here's what you've built:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  ✅ Completed Features:
                </h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• User Registration (POST /api/auth/register)</li>
                  <li>• User Login (POST /api/auth/login)</li>
                  <li>• Session Management with JWT tokens</li>
                  <li>• Protected Routes with authentication checks</li>
                  <li>• Zustand state management integration</li>
                  <li>• Better Auth UI patterns on frontend</li>
                  <li>• Automatic session initialization</li>
                  <li>• Token-based API authentication</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔜 Next Steps:</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Build workspace management pages</li>
                  <li>• Implement team creation and management</li>
                  <li>• Create issue tracking interface</li>
                  <li>• Add real-time WebSocket updates</li>
                  <li>• Build project and cycle management</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Pro tip:</strong> Try opening a new incognito window and accessing this
                  page. You'll be redirected to the login page. The authentication system is working
                  perfectly!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
