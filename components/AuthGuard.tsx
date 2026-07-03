'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/AuthGuard.tsx
// CrimeVision AI v2.0 — Client-side Auth Guard with RBAC + Gov Header
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import GovHeader from './GovHeader';
import GovFooter from './GovFooter';
import AuthenticatingIntro from './AuthenticatingIntro';
import AuditTrail from './AuditTrail';
import { DemoAccount } from '@/lib/crimeData';
import { canAccessRoute, getPortalForRole, PortalType } from '@/lib/rbac';

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

// Layout constants
const GOV_HEADER_HEIGHT = 72;
const TOPBAR_HEIGHT = 72;
const SIDEBAR_WIDTH = 256;
const TOTAL_TOP_OFFSET = GOV_HEADER_HEIGHT + TOPBAR_HEIGHT; // 144px

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState<DemoAccount | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const isLoginPage = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/login'));
  const portalType: PortalType = user ? getPortalForRole(user.role) : 'officer';

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setAccessDenied(false);

    if (!stored && !isLoginPage) {
      router.replace('/login');
    } else if (stored && !isLoginPage) {
      if (!canAccessRoute(stored.role, pathname)) {
        setAccessDenied(true);
        setTimeout(() => {
          router.replace('/');
          setAccessDenied(false);
        }, 1500);
        setChecked(true);
        return;
      }
      const seen = sessionStorage.getItem('ksp_intro_seen');
      if (!seen) {
        setShowIntro(true);
      }
      setChecked(true);
    } else {
      setChecked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('ksp_intro_seen', '1');
    setShowIntro(false);
  }, []);

  // Loading state
  if (!checked) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFFFF',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: '3px solid rgba(166, 25, 46, 0.15)',
            borderTopColor: '#A6192E',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 12, color: '#6B7280', letterSpacing: '0.1em', fontWeight: 600 }}>
            LOADING CRIMEVISION AI...
          </span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Login page: no sidebar/topbar/govheader, full screen
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Access denied
  if (accessDenied) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFFFFF', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(220, 38, 38, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>🚫</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>Access Denied</div>
        <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', maxWidth: 320 }}>
          You do not have permission to access this page. Redirecting to your dashboard...
        </div>
        <div style={{ marginTop: 8, width: 200, height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: '100%', height: '100%', background: '#A6192E', borderRadius: 2,
            animation: 'shrink 1.5s linear forwards',
          }} />
        </div>
        <style>{`@keyframes shrink { from { transform: scaleX(1); transform-origin: left; } to { transform: scaleX(0); transform-origin: left; } }`}</style>
      </div>
    );
  }

  const closeSidebar = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('sidebar-open');
    }
  };

  return (
    <>
      {showIntro && <AuthenticatingIntro onComplete={handleIntroComplete} />}

      {/* Government Branding Header — fixed at top */}
      <GovHeader />

      <div className="flex min-h-screen w-full overflow-hidden" style={{ paddingTop: `${GOV_HEADER_HEIGHT}px` }}>
        {/* Sidebar — starts below GovHeader */}
        <Sidebar user={user} portalType={portalType} />
        <div className="mobile-sidebar-overlay" onClick={closeSidebar} />

        {/* Main content area */}
        <main className="flex-1 min-h-screen min-w-0 flex flex-col" style={{ paddingLeft: `${SIDEBAR_WIDTH}px` }}>
          <Topbar user={user} portalType={portalType} />
          <div className="flex-1" style={{ paddingTop: `${TOPBAR_HEIGHT}px` }}>
            {children}
          </div>
          <GovFooter />
        </main>
      </div>

      <AuditTrail />
    </>
  );
}
