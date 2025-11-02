import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Linear Clone',
  description: 'Login to your Linear Clone account',
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <p className="text-sm text-muted-foreground">Login form will be implemented here</p>
        {/* Login form will be added in Phase 4.4 */}
      </div>
    </div>
  );
}
