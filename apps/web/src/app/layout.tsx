import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'Asterbook - Gaming/DeFi Platform',
  description: 'A simple & fluid gateway to explore the Aster Ecosystem',
  icons: {
    icon: '/assets/img/favicons/favicon.ico',
    apple: '/assets/img/favicons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/fonts/tabler-icons.min.css" />
      </head>
      <body>
        <Providers>
          <Sidebar isPremium={true} />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
