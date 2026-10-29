import type { Metadata } from 'next';
import './globals.css';
import { SiteNavigation } from '@/components/site-navigation';

// Next.js requires route metadata to live beside the root layout.
// oxlint-disable-next-line react/only-export-components
export const metadata: Metadata = {
  title: {
    default: 'BrewBook — Find a cafe that fits your moment',
    template: '%s | BrewBook',
  },
  description: 'Discovery-first prototype for choosing cafes by context, group size, and practical information.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <SiteNavigation />
        {children}
      </body>
    </html>
  );
}
