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
import { DemoAccount } from '@/lib/crimeData';
import { canAccessRoute, getPortalForRole, PortalType } from '@/lib/rbac';
import { Lock } from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isLoginPage = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/login'));
  const portalType: PortalType = user ? getPortalForRole(user.role) : 'officer';

  // 1. Initial boot and auth check — run exactly once on mount
  useEffect(() => {
    console.log('AuthGuard: Initial app mount check starting...');
    try {
      const stored = getStoredUser();
      setUser(stored);
      setAccessDenied(false);

      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }

      if (!stored && !isLoginPage) {
        console.log('AuthGuard: Guest user detected. Redirecting to login.');
        router.replace('/login');
      } else if (stored && !isLoginPage) {
        const seen = sessionStorage.getItem('ksp_intro_seen');
        if (!seen) {
          console.log('AuthGuard: Showing intro sequence.');
          setShowIntro(true);
        }
      }
    } catch (error) {
      console.error('AuthGuard: Initialization check error:', error);
    } finally {
      // Always set checked to true so the app is not stuck in a blank loader screen
      setChecked(true);
      console.log('AuthGuard: Initial loading completed.');
    }
  }, [router, isLoginPage]);

  // 2. Timeout fallback to guarantee loader is dismissed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!checked) {
        console.warn('AuthGuard: Initialization timeout fallback triggered after 3s.');
        setChecked(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [checked]);

  // 3. Page navigation and RBAC route guard
  useEffect(() => {
    if (isLoginPage) return;

    const stored = getStoredUser();
    if (!stored) {
      console.log('AuthGuard: Route changed but no session found. Forcing login.');
      router.replace('/login');
      return;
    }

    // Refresh state if user logged in or updated
    if (!user || user.username !== stored.username) {
      setUser(stored);
    }

    if (!canAccessRoute(stored.role, pathname)) {
      console.warn(`AuthGuard: Access denied for ${stored.role} to route ${pathname}`);
      setAccessDenied(true);
      const redirectTimer = setTimeout(() => {
        router.replace('/');
        setAccessDenied(false);
      }, 1500);
      return () => clearTimeout(redirectTimer);
    } else {
      setAccessDenied(false);
    }
  }, [pathname, isLoginPage, router, user]);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('ksp_intro_seen', '1');
    setShowIntro(false);
  }, []);

  // Synchronize isSidebarOpen state to body.classList (for mobile drawer styles)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isSidebarOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  }, [isSidebarOpen]);

  const storedUser = typeof window !== 'undefined' ? getStoredUser() : null;
  const introSeen = typeof window !== 'undefined' ? sessionStorage.getItem('ksp_intro_seen') : null;
  const showIntroLoader = storedUser && !isLoginPage && !introSeen;

  // Loading state
  if (!checked) {
    if (isLoginPage) {
      return <>{children}</>;
    }
    if (showIntroLoader) {
      return <AuthenticatingIntro onComplete={handleIntroComplete} />;
    }
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
          <span style={{ fontSize: '12px', color: '#6B7280', letterSpacing: '0.1em', fontWeight: 600 }}>
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={24} color="#ef4444" />
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#1F2937' }}>Access Denied</div>
        <div style={{ fontSize: '14px', color: '#475569', textAlign: 'center', maxWidth: 320 }}>
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
    setIsSidebarOpen(false);
  };

  return (
    <>
      {showIntro && <AuthenticatingIntro onComplete={handleIntroComplete} />}

      {/* Main layout container (without GovHeader padding) */}
      <div className="flex min-h-screen w-full overflow-hidden" style={{ paddingTop: '0px' }}>
        {/* Sidebar */}
        <Sidebar user={user} portalType={portalType} isOpen={isSidebarOpen} />
        <div className="mobile-sidebar-overlay" onClick={closeSidebar} />

        {/* Main content area */}
        <main 
          className="flex-1 min-h-screen min-w-0 flex flex-col" 
          style={{ 
            paddingLeft: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : '0px',
            transition: 'all 250ms ease',
          }}
        >
          <Topbar 
            user={user} 
            portalType={portalType} 
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
            isSidebarOpen={isSidebarOpen} 
          />
          <div className="flex-1 page-transition" key={pathname} style={{ paddingTop: `${TOPBAR_HEIGHT}px` }}>
            {children}
          </div>
          <GovFooter />
        </main>
      </div>
    </>
  );
}
