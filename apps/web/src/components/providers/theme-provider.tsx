'use client';

import * as React from 'react';
import { useUIStore } from '@/stores/ui-store';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

/**
 * ThemeProvider - Manages theme state and applies to document
 */
export function ThemeProvider({
  children,
  attribute: _attribute = 'class',
  defaultTheme: _defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange: _disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const theme = useUIStore((state) => state.theme);

  // Apply theme to document root
  React.useEffect(() => {
    setMounted(true);
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');

    // Apply new theme
    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, enableSystem]);

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
