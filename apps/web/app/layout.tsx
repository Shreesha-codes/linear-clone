import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Linear Clone',
  description: 'A high-fidelity clone of Linear.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
