'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: components/Sidebar.tsx  (REPLACE existing file entirely)
// CrimeVision AI — Responsive Sidebar with Auth User Display
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Map, Network, Brain, TrendingUp, FileText,
  Shield, Zap, Radio, Bell, Clock, BarChart3, MessageSquare,
  AlertTriangle, Package, Eye, Search, Dna, Crosshair, Cpu,
  LogOut, User,
} from 'lucide-react';
import { useLanguage } from './LanguageToggle';
import { DemoAccount } from '@/lib/crimeData';

interface SidebarProps {
  user?: DemoAccount | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const NAV_GROUPS = [
    {
      label: t.group_command,
      items: [
        { href: '/', icon: LayoutDashboard, label: t.nav_dashboard, badge: null },
        { href: '/search', icon: Search, label: t.nav_case_search, badge: '55' },
        { href: '/commissioner', icon: Eye, label: t.nav_commissioner_view, badge: null },
      ],
    },
    {
      label: t.group_advanced_ai,
      items: [
        { href: '/genome', icon: Dna, label: t.nav_crime_genome, badge: 'NEW' },
        { href: '/detective', icon: Cpu, label: t.nav_ai_detective, badge: 'NEW' },
        { href: '/copilot', icon: Crosshair, label: t.nav_investigation_copilot, badge: 'NEW' },
      ],
    },
    {
      label: t.group_intelligence,
      items: [
        { href: '/heatmap', icon: Map, label: t.nav_karnataka_map, badge: null },
        { href: '/network', icon: Network, label: t.nav_criminal_network, badge: null },
        { href: '/alerts', icon: Bell, label: t.nav_live_alerts, badge: '10' },
        { href: '/anomaly', icon: AlertTriangle, label: t.nav_anomaly_detection, badge: '6' },
      ],
    },
    {
      label: t.group_analysis,
      items: [
        { href: '/insights', icon: Brain, label: t.nav_ai_insights, badge: null },
        { href: '/timeline', icon: Clock, label: t.nav_crime_timeline, badge: null },
        { href: '/social-risk', icon: BarChart3, label: t.nav_social_risk, badge: null },
        { href: '/predictions', icon: TrendingUp, label: t.nav_risk_prediction, badge: null },
      ],
    },
    {
      label: t.group_operations,
      items: [
        { href: '/investigator', icon: MessageSquare, label: t.nav_ai_investigator, badge: null },
        { href: '/resources', icon: Package, label: t.nav_resource_allocation, badge: null },
        { href: '/reports', icon: FileText, label: t.nav_reports, badge: null },
      ],
    },
  ];

  const handleLogout = () => {
    try { sessionStorage.removeItem('ksp_user'); } catch { /* ignore */ }
    router.replace('/login');
  };

  const roleColor = () => {
    if (!user) return '#00f0ff';
    if (user.role === 'DGP') return '#ef4444';
    if (user.role === 'Commissioner') return '#f59e0b';
    return '#00f0ff';
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-72 flex flex-col z-50"
      style={{
        background: 'rgba(2, 6, 23, 0.98)',
        borderRight: '1px solid rgba(0, 240, 255, 0.12)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(0, 240, 255, 0.35)',
              }}
            >
              <Shield size={22} style={{ color: '#00f0ff' }} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-black tracking-widest" style={{ color: '#00f0ff', letterSpacing: '0.15em' }}>
              CRIMEVISION
            </div>
            <div className="text-xs font-medium tracking-widest" style={{ color: '#64748b' }}>
              AI INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Status Bar ───────────────────────────────────────────── */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ background: 'rgba(16, 185, 129, 0.04)', borderBottom: '1px solid rgba(0, 240, 255, 0.06)' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#10b981', letterSpacing: '0.08em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          {t.live_feed}
        </span>
        <div className="flex items-center gap-1.5">
          <Radio size={10} style={{ color: '#00f0ff' }} className="animate-pulse" />
          <span className="text-xs font-semibold" style={{ color: '#475569' }}>v5.0</span>
        </div>
      </div>

      {/* ── Navigation Groups ─────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-2">
            <div
              className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase"
              style={group.label.includes('ADVANCED') || group.label.includes('ಸುಧಾರಿತ') ? {
                color: '#00f0ff',
                textShadow: '0 0 8px rgba(0,240,255,0.5)',
                borderLeft: '2px solid rgba(0,240,255,0.5)',
                paddingLeft: '10px', marginBottom: '4px',
                fontSize: 9,
              } : { color: '#334155', fontSize: 9 }}
            >
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 group"
                    style={{
                      background: isActive ? 'rgba(0,240,255,0.08)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(0,240,255,0.2)' : 'transparent'}`,
                      color: isActive ? '#00f0ff' : '#64748b',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                        (e.currentTarget as HTMLElement).style.color = '#94a3b8';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#64748b';
                      }
                    }}
                  >
                    <item.icon size={15} />
                    <span className="flex-1 text-[13px] font-medium">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={item.badge === 'NEW' ? {
                          background: 'rgba(0, 240, 255, 0.15)', color: '#00f0ff',
                          border: '1px solid rgba(0,240,255,0.4)', fontSize: '9px',
                          letterSpacing: '0.08em', boxShadow: '0 0 8px rgba(0,240,255,0.3)',
                        } : {
                          background: 'rgba(239, 68, 68, 0.2)', color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.3)', fontSize: '10px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Threat Level + Officer Info ───────────────────────────────── */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        {/* State threat bar */}
        <div className="p-3 rounded-xl mb-3" style={{
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Zap size={12} style={{ color: '#ef4444' }} />
              <span className="text-xs font-bold" style={{ color: '#f87171', fontSize: 9, letterSpacing: '0.08em' }}>
                {t.state_threat}
              </span>
            </div>
            <span className="text-xs font-black" style={{ color: '#ef4444', fontSize: 10 }}>HIGH</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 h-1.5 rounded-sm"
                style={{
                  background: i <= 4 ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  boxShadow: i <= 4 ? '0 0 4px rgba(239,68,68,0.5)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Officer info */}
        <div className="flex items-center gap-2.5 px-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, rgba(${user?.role === 'DGP' ? '239,68,68' : user?.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.15), rgba(139,92,246,0.15))`,
              color: roleColor(),
              border: `1px solid rgba(${user?.role === 'DGP' ? '239,68,68' : user?.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.3)`,
            }}
          >
            <User size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate" style={{ color: '#f1f5f9', fontSize: 12 }}>
              {user?.name ?? 'KSP Officer'}
            </div>
            <div className="text-xs truncate" style={{ color: '#64748b', fontSize: 10 }}>
              {user?.designation ?? 'Karnataka State Police'}
            </div>
            {user?.badgeNumber && (
              <div style={{ fontSize: 9, color: roleColor(), fontFamily: 'monospace', marginTop: 1 }}>
                {user.badgeNumber}
              </div>
            )}
          </div>
          {/* Logout */}
          <button
            onClick={handleLogout}
            title={t.btn_logout}
            style={{
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#ef4444',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
