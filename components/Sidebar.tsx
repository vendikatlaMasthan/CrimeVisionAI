'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Network,
  Brain,
  TrendingUp,
  FileText,
  Shield,
  Zap,
  Radio,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/heatmap', icon: Map, label: 'Karnataka Map' },
  { href: '/network', icon: Network, label: 'Criminal Network' },
  { href: '/insights', icon: Brain, label: 'AI Insights' },
  { href: '/predictions', icon: TrendingUp, label: 'Risk Prediction' },
  { href: '/reports', icon: FileText, label: 'Reports' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{
        background: 'rgba(5, 10, 25, 0.95)',
        borderRight: '1px solid rgba(0, 240, 255, 0.1)',
        backdropFilter: 'blur(20px)',
      }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
              <Shield size={20} style={{ color: '#00f0ff' }} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 animate-pulse-glow" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider" style={{ color: '#00f0ff' }}>CRIMEVISION</div>
            <div className="text-xs tracking-widest" style={{ color: '#64748b' }}>AI • KARNATAKA SP</div>
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="px-6 py-3 border-b" style={{ borderColor: 'rgba(0, 240, 255, 0.05)', background: 'rgba(0, 240, 255, 0.03)' }}>
        <div className="flex items-center justify-between">
          <span className="status-live">
            <span className="status-dot" />
            LIVE FEED
          </span>
          <div className="flex items-center gap-1">
            <Radio size={10} style={{ color: '#00f0ff' }} className="animate-pulse" />
            <span className="text-xs" style={{ color: '#64748b' }}>v4.2.1</span>
          </div>
        </div>
        <div className="mt-2 text-xs" style={{ color: '#475569' }}>
          <span>Karnataka State Police</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#334155' }}>NAVIGATION</div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-nav-item"
              style={isActive ? {
                background: 'rgba(0, 240, 255, 0.08)',
                color: '#00f0ff',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.08)',
              } : {}}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#00f0ff', boxShadow: '0 0 6px #00f0ff' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Status */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(0, 240, 255, 0.1)' }}>
        <div className="glass-card p-3" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={12} style={{ color: '#ef4444' }} />
            <span className="text-xs font-bold" style={{ color: '#ef4444' }}>THREAT LEVEL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-4 h-2 rounded-sm" style={{ background: i <= 3 ? '#ef4444' : 'rgba(255,255,255,0.1)' }} />
              ))}
              <div className="w-4 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            <span className="text-xs font-bold" style={{ color: '#ef4444' }}>HIGH</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            SP
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#94a3b8' }}>Supt. Prakash</div>
            <div className="text-xs" style={{ color: '#475569' }}>Commanding Officer</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
