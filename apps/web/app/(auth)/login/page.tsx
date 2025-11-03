'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateField = (field: 'email' | 'password'): string | null => {
    if (field === 'email') {
      if (!formData.email.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) return 'Invalid email format';
    }
    if (field === 'password') {
      if (!formData.password) return 'Password is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ email: true, password: true });

    const emailError = validateField('email');
    const passwordError = validateField('password');

    if (emailError || passwordError) {
      setError(emailError || passwordError);
      return;
    }

    try {
      await loginWithEmail(formData.email.trim(), formData.password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('invalid') || errorMsg.includes('unauthorized')) {
          setError('Invalid email or password. Please try again.');
        } else if (errorMsg.includes('not found')) {
          setError('No account found. Please sign up first.');
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          setError('Connection error. Please check your internet.');
        } else {
          setError('Unable to sign in. Please try again later.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleInputChange =
    (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const handleBlur = (field: 'email' | 'password') => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const emailError = touched.email ? validateField('email') : null;
  const passwordError = touched.password ? validateField('password') : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Welcome back
        </h1>
        <p className="text-muted-foreground">Sign in to your account to continue your work</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              onBlur={handleBlur('email')}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
              className={`pl-10 pr-10 h-11 transition-all ${
                emailError
                  ? 'border-destructive focus-visible:ring-destructive'
                  : formData.email && !emailError
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
              }`}
            />
            {formData.email && !emailError && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
          {emailError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {emailError}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              onBlur={handleBlur('password')}
              disabled={isLoading}
              autoComplete="current-password"
              className={`pl-10 pr-10 h-11 transition-all ${
                passwordError ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {passwordError}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.email || !formData.password}
          className="w-full h-11 text-base font-medium relative overflow-hidden group"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <span className="relative z-10">Sign in</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground font-medium">
            New to Linear Clone?
          </span>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <Link
          href="/register"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
        >
          Create an account
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
