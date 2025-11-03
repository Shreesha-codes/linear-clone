'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ApiTestPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Test User');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const clearMessages = () => {
    setResult('');
    setError('');
  };

  const handleHealthCheck = async () => {
    clearMessages();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Health check failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApiInfo = async () => {
    clearMessages();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API info failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    clearMessages();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Registration failed');
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    clearMessages();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Login failed');
      setResult(JSON.stringify(data, null, 2));
      if (data.data?.token) localStorage.setItem('authToken', data.data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    clearMessages();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Get user failed');
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Get user failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🧪 API Client Test Lab</h1>
        <p className="text-muted-foreground">
          Test your Linear Clone API endpoints and see the type-safe client in action!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* Server Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🏥 Server Status</h2>
            <div className="space-y-3">
              <Button
                onClick={handleHealthCheck}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                Check Backend Health
              </Button>
              <Button
                onClick={handleApiInfo}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                Get API Info
              </Button>
            </div>
          </Card>

          {/* Authentication Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔐 Authentication</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="mt-1"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button onClick={handleRegister} disabled={loading} className="w-full">
                  Register New User
                </Button>
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full"
                  variant="secondary"
                >
                  Login
                </Button>
              </div>
            </div>
          </Card>

          {/* Protected Endpoints */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔒 Protected Endpoints</h2>
            <p className="text-sm text-muted-foreground mb-4">
              These require authentication (login first!)
            </p>
            <div className="space-y-2">
              <Button onClick={handleGetMe} disabled={loading} className="w-full" variant="outline">
                Get Current User
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {result && (
            <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                  ✅ Success Response
                </h3>
                <Button variant="ghost" size="sm" onClick={clearMessages}>
                  Clear
                </Button>
              </div>
              <pre className="text-xs bg-white dark:bg-gray-900 p-4 rounded overflow-auto max-h-96 border">
                {result}
              </pre>
            </Card>
          )}

          {error && (
            <Card className="p-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                  ❌ Error
                </h3>
                <Button variant="ghost" size="sm" onClick={clearMessages}>
                  Clear
                </Button>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200 font-mono">{error}</p>
            </Card>
          )}

          {loading && !result && !error && (
            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                <p className="text-blue-900 dark:text-blue-100">Loading...</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
