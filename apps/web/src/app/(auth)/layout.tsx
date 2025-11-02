import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Linear Clone',
  description: 'Login to your Linear Clone account',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">{children}</div>
    </div>
  );
}
