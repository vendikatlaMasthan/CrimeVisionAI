'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/Sidebar.tsx
// CrimeVision AI v2.0 — Role-Based Sidebar Navigation (Light Theme)
// Labels renamed per §7, groups restructured per §6
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Map, Network, Brain, TrendingUp, FileText,
  Bell, Clock, BarChart3, MessageSquare,
  AlertTriangle, Package, Eye, User, Users, Search,
  Settings, Database, ScrollText, LogOut
} from 'lucide-react';
import { useLanguage } from './LanguageToggle';
import { DemoAccount } from '@/lib/crimeData';
import { LIVE_ALERTS } from '@/lib/mockData';
import { PortalType } from '@/lib/rbac';

interface SidebarProps {
  user?: DemoAccount | null;
  portalType: PortalType;
  isOpen?: boolean;
}

interface SidebarItemProps {
  href: string;
  icon: any;
  label: string;
  badge?: string | null;
}

function SidebarItem({ href, icon: Icon, label, badge }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={() => {
        if (typeof document !== 'undefined') {
          document.body.classList.remove('sidebar-open');
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '11px 20px',
        height: '44px',
        textDecoration: 'none',
        borderRadius: isActive ? '0 10px 10px 0' : '0',
        borderLeft: isActive ? '3px solid var(--primary-navy)' : '3px solid transparent',
        background: isActive ? 'rgba(11, 31, 58, 0.08)' : 'transparent',
        color: isActive ? 'var(--primary-navy)' : '#475569',
        userSelect: 'none',
        transition: 'all 200ms ease-in-out',
        marginRight: isActive ? '8px' : '0',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = '#F1F5F9';
          e.currentTarget.style.color = '#0F172A';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#475569';
        }
      }}
    >
      <Icon size={20} style={{ flexShrink: 0, color: isActive ? 'var(--primary-navy)' : '#94A3B8', strokeWidth: 1.8 }} />
      <span style={{ flex: 1, fontSize: '14px', fontWeight: isActive ? 600 : 500, letterSpacing: '0.01em' }}>{label}</span>
      {badge && (
        <span style={{
          minWidth: '20px', height: '20px', borderRadius: '10px',
          background: 'var(--alert-red)', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, padding: '0 6px', flexShrink: 0,
        }}>
          {badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ padding: '0 20px', marginBottom: '10px', marginTop: '12px' }}>
      <div style={{
        fontSize: '12px', textTransform: 'uppercase', fontWeight: 700,
        color: '#94A3B8', letterSpacing: '0.1em',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function Sidebar({ user, portalType, isOpen = true }: SidebarProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const unreadAlertsCount = LIVE_ALERTS.filter(alert => !alert.acknowledged).length;

  let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!basePath && typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/CrimeVisionAI')) {
      basePath = '/CrimeVisionAI';
    }
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-50 select-none"
      style={{
        width: isOpen ? '256px' : '0px',
        background: '#FFFFFF',
        borderRight: isOpen ? '1px solid #E5E7EB' : 'none',
        top: '0px',
        height: '100vh',
        transition: 'all 250ms ease',
        overflow: 'hidden',
      }}
    >
      {/* ── Logo Block ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 20px',
        borderBottom: '1px solid #E5E7EB',
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img src={`${basePath}/crimevision_logo.png`} alt="CrimeVision AI Logo" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
        </div>
        <div>
          <div className="logo-wordmark" style={{ fontSize: '14px', color: 'var(--primary-navy)', letterSpacing: '-0.01em', lineHeight: 1 }}>
            CrimeVision AI
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', marginTop: 4, textTransform: 'uppercase' }}>
            {portalType === 'admin' ? 'Admin Portal' : 'Officer Portal'}
          </div>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 12, paddingBottom: 12 }}>

        {/* ── Home ──────────────────────────────────────────────── */}
        <div style={{ marginBottom: 8 }}>
          <SidebarItem href="/" icon={LayoutDashboard} label={lang === 'en' ? 'Dashboard' : 'ಮುಖಪುಟ'} />
        </div>

        {/* State Overview (Admin only) */}
        {portalType === 'admin' && (
          <div style={{ marginBottom: 8 }}>
            <SidebarItem href="/commissioner" icon={Eye} label={lang === 'en' ? 'State Overview' : 'ರಾಜ್ಯ ಅವಲೋಕನ'} />
          </div>
        )}

        {/* ── Investigation ──────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <SectionLabel label={lang === 'en' ? 'INVESTIGATION' : 'ತನಿಖೆ'} />
          <div>
            <SidebarItem href="/fir" icon={Search} label={lang === 'en' ? 'Cases / FIR Search' : 'ಪ್ರಕರಣಗಳು'} />
            <SidebarItem href="/ai-investigator" icon={MessageSquare} label={lang === 'en' ? 'AI Investigator' : 'AI ತನಿಖಾಧಿಕಾರಿ'} />
            <SidebarItem href="/map" icon={Map} label={lang === 'en' ? 'Crime Map' : 'ಅಪರಾಧ ನಕ್ಷೆ'} />
            <SidebarItem href="/criminal-network" icon={Network} label={lang === 'en' ? 'Suspect Network' : 'ಶಂಕಿತ ಜಾಲ'} />
          </div>
        </div>

        {/* ── Crime Analysis ─────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <SectionLabel label={lang === 'en' ? 'CRIME ANALYSIS' : 'ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ'} />
          <div>
            <SidebarItem href="/genome" icon={Brain} label={lang === 'en' ? 'Crime Insights' : 'ಅಪರಾಧ ಒಳನೋಟಗಳು'} />
            <SidebarItem href="/predictions" icon={TrendingUp} label={lang === 'en' ? 'Crime Forecast' : 'ಅಪರಾಧ ಮುನ್ಸೂಚನೆ'} />
            <SidebarItem href="/timeline" icon={Clock} label={lang === 'en' ? 'Crime Timeline' : 'ಅಪರಾಧ ಸಮಯರೇಖೆ'} />
            <SidebarItem href="/social-risk" icon={BarChart3} label={lang === 'en' ? 'Social Risk Factors' : 'ಸಾಮಾಜಿಕ ಅಪಾಯ'} />
          </div>
        </div>

        {/* ── Alerts ─────────────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <SectionLabel label={lang === 'en' ? 'ALERTS' : 'ಎಚ್ಚರಿಕೆಗಳು'} />
          <div>
            <SidebarItem href="/alerts" icon={Bell} label={lang === 'en' ? 'Live Alerts' : 'ನೇರ ಎಚ್ಚರಿಕೆಗಳು'} badge={unreadAlertsCount > 0 ? String(unreadAlertsCount) : null} />
            <SidebarItem href="/anomaly" icon={AlertTriangle} label={lang === 'en' ? 'Anomaly Detection' : 'ವೈಪರೀತ್ಯ ಪತ್ತೆ'} />
          </div>
        </div>

        {/* ── Operations ────────────────────────────────────────── */}
        <div style={{ marginTop: 28 }}>
          <SectionLabel label={lang === 'en' ? 'OPERATIONS' : 'ಕಾರ್ಯಾಚರಣೆ'} />
          <div>
            <SidebarItem href="/resources" icon={Package} label={lang === 'en' ? 'Officer Deployment' : 'ಸಂಪನ್ಮೂಲ ನಿಯೋಜನೆ'} />
            <SidebarItem href="/reports" icon={FileText} label={lang === 'en' ? 'Reports' : 'ವರದಿಗಳು'} />
            <SidebarItem href="/audit-log" icon={ScrollText} label={lang === 'en' ? 'Audit Trail' : 'ಆಡಿಟ್ ದಾಖಲೆಗಳು'} />
          </div>
        </div>

        {/* ── Administration (Admin only) ───────────────────────── */}
        {portalType === 'admin' && (
          <div style={{ marginTop: 28 }}>
            <SectionLabel label={lang === 'en' ? 'ADMINISTRATION' : 'ಆಡಳಿತ'} />
            <div>
              <SidebarItem href="/admin/officers" icon={Users} label={lang === 'en' ? 'Officer Management' : 'ಅಧಿಕಾರಿ ನಿರ್ವಹಣೆ'} />
              <SidebarItem href="/admin/database" icon={Database} label={lang === 'en' ? 'Database' : 'ಡೇಟಾಬೇಸ್'} />
              <SidebarItem href="/admin/settings" icon={Settings} label={lang === 'en' ? 'Settings' : 'ಸಂಯೋಜನೆಗಳು'} />
            </div>
          </div>
        )}
      </nav>

      {/* ── Bottom Section ─────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid #E5E7EB',
        padding: '12px 16px',
        flexShrink: 0,
      }}>
        {/* Settings & Logout Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 12 }}>
          <Link
            href="/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#475569',
              textDecoration: 'none',
              borderRadius: '6px',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F5F6F8'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Settings size={14} style={{ color: '#94A3B8' }} />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem('ksp_user');
              } catch {}
              router.replace('/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#DC2626',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={14} style={{ color: '#DC2626' }} />
            <span>Logout</span>
          </button>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(11, 31, 58, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(11, 31, 58, 0.15)',
          }}>
            <User size={16} style={{ color: 'var(--primary-navy)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name ?? 'KSP Officer'}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.designation ?? 'Karnataka Police'}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
