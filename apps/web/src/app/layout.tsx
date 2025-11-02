import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

/**
 * Inter font - Modern, clean sans-serif matching Linear's aesthetic
 * Variable font for optimal performance and flexibility
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

/**
 * Application metadata
 * SEO-optimized with proper Open Graph and Twitter tags
 */
export const metadata: Metadata = {
  title: {
    default: 'Linear Clone - Modern Issue Tracking',
    template: '%s | Linear Clone',
  },
  description:
    'A high-fidelity Linear.app clone with real-time collaboration, issue tracking, and project management.',
  keywords: [
    'issue tracking',
    'project management',
    'agile',
    'scrum',
    'collaboration',
    'productivity',
  ],
  authors: [{ name: 'Linear Clone Team' }],
  creator: 'Linear Clone Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://linear-clone.app',
    siteName: 'Linear Clone',
    title: 'Linear Clone - Modern Issue Tracking',
    description:
      'A high-fidelity Linear.app clone with real-time collaboration, issue tracking, and project management.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linear Clone - Modern Issue Tracking',
    description:
      'A high-fidelity Linear.app clone with real-time collaboration, issue tracking, and project management.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root Layout Component
 *
 * Provides global configuration and providers for the entire application.
 * Includes theme management, font loading, and Radix UI tooltip provider.
 *
 * Architecture:
 * - ThemeProvider: Manages light/dark/system theme with persistence
 * - TooltipProvider: Required for all Radix UI tooltips
 * - Font optimization: Inter variable font with display swap
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider delayDuration={300} skipDelayDuration={100}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
