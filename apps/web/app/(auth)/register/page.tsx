'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { registerWithEmail, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  ];

  const getPasswordStrength = () => {
    if (!formData.password) return null;
    const passed = passwordRequirements.filter((req) => req.test(formData.password)).length;
    if (passed <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (passed === 2) return { label: 'Fair', color: 'bg-orange-500', width: '50%' };
    if (passed === 3) return { label: 'Good', color: 'bg-yellow-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const validateField = (field: keyof typeof formData): string | null => {
    if (field === 'name') {
      if (!formData.name.trim()) return 'Name is required';
      if (formData.name.trim().length < 2) return 'Name must be at least 2 characters';
    }
    if (field === 'email') {
      if (!formData.email.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    }
    if (field === 'password') {
      if (!formData.password) return 'Password is required';
      if (formData.password.length < 8) return 'Password must be at least 8 characters';
    }
    if (field === 'confirmPassword') {
      if (!formData.confirmPassword) return 'Please confirm your password';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const errors = Object.keys(formData).map((key) => validateField(key as keyof typeof formData));
    const firstError = errors.find((e) => e !== null);
    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      await registerWithEmail(formData.email.trim(), formData.password, formData.name.trim());
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        const errorMsg = err.message.toLowerCase();
        if (errorMsg.includes('already exists') || errorMsg.includes('conflict')) {
          setError('Email already registered. Try logging in instead.');
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          setError('Connection error. Please check your internet.');
        } else {
          setError('Unable to create account. Please try again.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError(null);
    };

  const handleBlur = (field: keyof typeof formData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Create your account
        </h1>
        <p className="text-muted-foreground">Get started with Linear Clone today — it's free</p>
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
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange('name')}
              onBlur={handleBlur('name')}
              disabled={isLoading}
              autoComplete="name"
              autoFocus
              className={`pl-10 pr-10 h-11 transition-all ${
                touched.name && validateField('name')
                  ? 'border-destructive focus-visible:ring-destructive'
                  : formData.name && !validateField('name')
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
              }`}
            />
            {formData.name && !validateField('name') && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
        </div>

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
              className={`pl-10 pr-10 h-11 transition-all ${
                touched.email && validateField('email')
                  ? 'border-destructive focus-visible:ring-destructive'
                  : formData.email && !validateField('email')
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
              }`}
            />
            {formData.email && !validateField('email') && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange('password')}
              onBlur={handleBlur('password')}
              disabled={isLoading}
              autoComplete="new-password"
              className="pl-10 pr-10 h-11"
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

          {/* Password Strength */}
          {formData.password && strength && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300 ease-out`}
                    style={{ width: strength.width }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    strength.label === 'Weak'
                      ? 'text-red-500'
                      : strength.label === 'Fair'
                        ? 'text-orange-500'
                        : strength.label === 'Good'
                          ? 'text-yellow-500'
                          : 'text-green-500'
                  }`}
                >
                  {strength.label}
                </span>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {passwordRequirements.map((req, idx) => {
                  const passed = req.test(formData.password);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-1.5 transition-colors ${
                        passed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`}
                    >
                      {passed ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-current" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              disabled={isLoading}
              autoComplete="new-password"
              className={`pl-10 pr-10 h-11 transition-all ${
                touched.confirmPassword && validateField('confirmPassword')
                  ? 'border-destructive focus-visible:ring-destructive'
                  : formData.confirmPassword && !validateField('confirmPassword')
                    ? 'border-green-500 focus-visible:ring-green-500'
                    : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.confirmPassword && !validateField('confirmPassword') && (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || Object.values(formData).some((v) => !v)}
          className="w-full h-11 text-base font-medium relative overflow-hidden group"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            <span className="relative z-10">Create account</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </form>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{' '}
        <Link
          href="/terms"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="/privacy"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Privacy Policy
        </Link>
      </p>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground font-medium">
            Already have an account?
          </span>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
        >
          Sign in instead
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
