import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register | Linear Clone',
  description: 'Create a Linear Clone account',
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Get started with Linear Clone</p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <p className="text-sm text-muted-foreground">Registration form will be implemented here</p>
        {/* Registration form will be added in Phase 4.4 */}
      </div>
    </div>
  );
}
