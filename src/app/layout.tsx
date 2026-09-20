import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solarithm QuoteCraft',
  description: 'Enterprise-grade tool for generating professional quotations for solar power plant projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#121212] text-white antialiased">{children}</body>
    </html>
  );
}
