'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/AuthGuard.tsx
// CrimeVision AI — Client-side Auth Guard with Animated Intro + Audit Trail
// Redirects to /login if user is not authenticated via sessionStorage.
// On the login page, renders without Sidebar/Topbar (full screen).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AuthenticatingIntro from './AuthenticatingIntro';
import AuditTrail from './AuditTrail';
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
  const [showIntro, setShowIntro] = useState(false);

  const isLoginPage = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/login'));

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);

    if (!stored && !isLoginPage) {
      // Not logged in and not on login page → redirect
      router.replace('/login');
    } else {
      // Show intro once per session (only for authenticated users on protected pages)
      if (stored && !isLoginPage) {
        const seen = sessionStorage.getItem('ksp_intro_seen');
        if (!seen) {
          setShowIntro(true);
        }
      }
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('ksp_intro_seen', '1');
    setShowIntro(false);
  }, []);

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

  // Authenticated pages: sidebar + topbar layout + intro + audit trail
  const closeSidebar = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('sidebar-open');
    }
  };

  return (
    <>
      {/* Animated boot-up intro — shown once per session */}
      {showIntro && <AuthenticatingIntro onComplete={handleIntroComplete} />}

      <div className="flex min-h-screen w-full overflow-hidden">
        <Sidebar user={user} />
        <div className="mobile-sidebar-overlay" onClick={closeSidebar} />
        <main className="flex-1 min-h-screen min-w-0" style={{ paddingLeft: '280px' }}>
          <Topbar user={user} />
          <div style={{ paddingTop: '64px' }}>
            {children}
          </div>
        </main>
      </div>

      {/* Floating audit trail button — always visible on authenticated pages */}
      <AuditTrail />
    </>
  );
}
