// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: app/layout.tsx  (REPLACE the existing file entirely)
// CrimeVision AI — Root Layout with Language Provider + Auth Guard
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageToggle';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'CrimeVision AI | Karnataka State Police Intelligence Command Center',
  description:
    'Advanced AI-powered crime analytics and visualization platform for Karnataka State Police. Real-time crime heatmaps, criminal network analysis, anomaly detection, and predictive intelligence.',
  keywords:
    'Karnataka Police, Crime Analytics, AI Intelligence, Crime Prediction, Law Enforcement, Criminal Network, Heatmap, KSP Datathon 2026',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="cyber-grid" style={{ fontFamily: "'Inter', sans-serif" }}>
        <LanguageProvider>
          <AuthGuard>{children}</AuthGuard>
        </LanguageProvider>
      </body>
    </html>
  );
}
