'use client';

import { X, Bell, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { LIVE_ALERTS } from '@/lib/mockData';

interface AlertPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertPanel({ isOpen, onClose }: AlertPanelProps) {
  // Filter alerts by severity
  const criticalAlerts = LIVE_ALERTS.filter(alert => alert.severity === 'critical');
  const mediumAlerts = LIVE_ALERTS.filter(alert => alert.severity === 'medium' || alert.severity === 'high');
  const resolvedAlerts = LIVE_ALERTS.filter(alert => alert.acknowledged);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col border-l`}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          background: 'var(--topbar-bg)',
          borderColor: 'var(--cyber-border)',
        }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--cyber-border)', background: 'rgba(0, 240, 255, 0.02)' }}
        >
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-[var(--cyber-cyan)] animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Intelligence Alerts
              </h2>
              <span className="text-[10px] text-[var(--text-dim)] font-bold tracking-wider uppercase">
                Real-Time Operations Feed
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--cyber-border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--cyber-border-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--cyber-border)';
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Critical Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Critical Alerts ({criticalAlerts.length})
              </span>
            </div>
            {criticalAlerts.length === 0 ? (
              <div className="p-3 text-center text-xs text-[var(--text-dim)] bg-slate-900/10 rounded-lg border border-dashed border-white/5">
                No active critical threats
              </div>
            ) : (
              <div className="space-y-2.5">
                {criticalAlerts.map(alert => (
                  <Link
                    key={alert.id}
                    href="/alerts"
                    onClick={onClose}
                    className="block p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 duration-200"
                    style={{
                      background: 'rgba(239, 68, 68, 0.03)',
                      borderColor: 'rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="font-bold text-red-500 text-xs tracking-wide uppercase">
                        {alert.category}
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)] font-mono">
                        {alert.timestamp}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="mt-2.5 pt-2.5 border-t border-red-500/10 flex justify-between items-center text-[10px] text-red-400 font-semibold">
                      <span>📍 {alert.district}</span>
                      <span className="flex items-center gap-0.5">
                        DISPATCH <ArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Medium/High Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={12} />
                Medium & High Alerts ({mediumAlerts.length})
              </span>
            </div>
            {mediumAlerts.length === 0 ? (
              <div className="p-3 text-center text-xs text-[var(--text-dim)] bg-slate-900/10 rounded-lg border border-dashed border-white/5">
                No active medium threats
              </div>
            ) : (
              <div className="space-y-2.5">
                {mediumAlerts.map(alert => (
                  <Link
                    key={alert.id}
                    href="/alerts"
                    onClick={onClose}
                    className="block p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 duration-200"
                    style={{
                      background: 'rgba(245, 158, 11, 0.03)',
                      borderColor: 'rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <span className="font-bold text-amber-500 text-xs tracking-wide uppercase">
                        {alert.category}
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)] font-mono">
                        {alert.timestamp}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {alert.description}
                    </p>
                    <div className="mt-2.5 pt-2.5 border-t border-amber-500/10 flex justify-between items-center text-[10px] text-amber-400 font-semibold">
                      <span>📍 {alert.district}</span>
                      <span className="flex items-center gap-0.5">
                        MONITOR <ArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Resolved/Acknowledged Alerts */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck size={12} />
                Resolved Operations ({resolvedAlerts.length})
              </span>
            </div>
            {resolvedAlerts.length === 0 ? (
              <div className="p-3 text-center text-xs text-[var(--text-dim)] bg-slate-900/10 rounded-lg border border-dashed border-white/5">
                No resolved events today
              </div>
            ) : (
              <div className="space-y-2.5">
                {resolvedAlerts.map(alert => (
                  <Link
                    key={alert.id}
                    href="/alerts"
                    onClick={onClose}
                    className="block p-3.5 rounded-xl border hover:-translate-y-0.5 transition-all duration-200"
                    style={{
                      background: 'rgba(16, 185, 129, 0.01)',
                      borderColor: 'rgba(16, 185, 129, 0.15)',
                      textDecoration: 'none',
                    }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-bold text-green-500 text-xs tracking-wide uppercase">
                        {alert.category}
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)] font-mono">
                        {alert.timestamp}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-muted)] leading-snug line-through">
                      {alert.title}
                    </h4>
                    <div className="mt-2 pt-2 border-t border-green-500/5 flex justify-between items-center text-[10px] text-green-500/70 font-semibold">
                      <span>📍 {alert.district}</span>
                      <span className="flex items-center gap-1">
                        ✓ SECURED
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t text-center"
          style={{ borderColor: 'var(--cyber-border)', background: 'rgba(0,0,0,0.05)' }}
        >
          <Link
            href="/alerts"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-lg text-xs font-bold text-[var(--cyber-cyan)] border border-[var(--cyber-border)] hover:bg-[rgba(30,58,95,0.06)] transition-all uppercase tracking-wider"
          >
            Go to Alert Command Center <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}
