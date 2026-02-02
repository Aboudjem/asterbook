import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import Script from 'next/script';

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
    <html lang="en" data-bs-theme="dark" className="dark">
      <head>
        <link rel="stylesheet" href="/assets/fonts/inter/inter.css" />
        <link rel="stylesheet" href="/assets/fonts/phosphor/duotone/style.css" />
        <link rel="stylesheet" href="/assets/fonts/tabler-icons.min.css" />
        <link rel="stylesheet" href="/assets/fonts/feather.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome.css" />
        <link rel="stylesheet" href="/assets/fonts/material.css" />
      </head>
      <body
        data-pc-preset="preset-1"
        data-pc-sidebar-caption="true"
        data-pc-layout="vertical"
        data-pc-direction="ltr"
        data-pc-theme="dark"
      >
        <Providers>
          {/* Animated Background */}
          <div className="night-sky-container">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
          </div>

          {/* Sidebar */}
          <Sidebar isPremium={true} />

          {/* Header */}
          <Header />

          {/* Main Content */}
          {children}
        </Providers>

        {/* Bootstrap JS */}
        <Script src="/assets/js/plugins/popper.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/plugins/bootstrap.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
