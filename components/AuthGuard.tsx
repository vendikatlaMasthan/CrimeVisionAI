'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: components/AuthGuard.tsx
// CrimeVision AI — Client-side Auth Guard
// Redirects to /login if user is not authenticated via sessionStorage.
// On the login page, renders without Sidebar/Topbar (full screen).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { DemoAccount } from '@/lib/crimeData';

function getStoredUser(): DemoAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('ksp_user');
    return raw ? (JSON.parse(raw) as DemoAccount) : null;
  } catch {
    return null;
  }
}

const PUBLIC_PATHS = ['/login', '/login/'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<DemoAccount | null>(null);

  const isLoginPage = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/login'));

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);

    if (!stored && !isLoginPage) {
      // Not logged in and not on login page → redirect
      router.replace('/login');
    } else {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Don't render until check is done (prevents flash)
  if (!checked) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#020617',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '3px solid rgba(0,240,255,0.15)',
            borderTopColor: '#00f0ff',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 12, color: '#475569', letterSpacing: '0.1em' }}>
            AUTHENTICATING...
          </span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Login page: no sidebar/topbar, full screen
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Authenticated pages: sidebar + topbar layout
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 min-h-screen" style={{ marginLeft: '288px' }}>
        <Topbar user={user} />
        <div style={{ paddingTop: '64px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
