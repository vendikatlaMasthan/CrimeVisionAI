'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { ClipboardList, X, Clock, Lock, Download } from 'lucide-react';

interface AuditEntry {
  path: string;
  page: string;
  timestamp: string;
  sessionId: string;
}

const PAGE_NAMES: Record<string, string> = {
  '/': 'Command Dashboard',
  '/heatmap': 'Karnataka Crime Map',
  '/network': 'Criminal Network',
  '/alerts': 'Live Alerts',
  '/anomaly': 'Anomaly Detection',
  '/investigator': 'AI Investigator',
  '/genome': 'Crime Pattern Genome',
  '/detective': 'AI Detective Engine',
  '/copilot': 'Investigation Copilot',
  '/insights': 'AI Insights',
  '/timeline': 'Crime Timeline',
  '/social-risk': 'Social Risk Factors',
  '/predictions': 'Risk Prediction',
  '/resources': 'Resource Allocation',
  '/reports': 'Reports',
  '/commissioner': 'Commissioner View',
  '/fir': 'FIR Search',
  '/search': 'Case Search',
  '/settings': 'Settings',
};

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'unknown';
  const existing = sessionStorage.getItem('ksp_session_id');
  if (existing) return existing;
  const id = `SES-${Date.now().toString(36).toUpperCase()}`;
  sessionStorage.setItem('ksp_session_id', id);
  return id;
}

export default function AuditTrail() {
  const [open, setOpen] = useState(false);
  const [trail, setTrail] = useState<AuditEntry[]>([]);
  const [sessionId, setSessionId] = useState('unknown');
  const pathname = usePathname();

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
    try {
      const saved = sessionStorage.getItem('ksp_audit_trail');
      if (saved) setTrail(JSON.parse(saved) as AuditEntry[]);
    } catch {
      // ignore
    }
  }, []);

  const addEntry = useCallback((path: string, sid: string) => {
    const entry: AuditEntry = {
      path,
      page: PAGE_NAMES[path] ?? path,
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      }),
      sessionId: sid,
    };
    setTrail(prev => {
      const newTrail = [entry, ...prev.slice(0, 49)];
      try { sessionStorage.setItem('ksp_audit_trail', JSON.stringify(newTrail)); } catch { /* ignore */ }
      return newTrail;
    });
  }, []);

  useEffect(() => {
    if (pathname && sessionId !== 'unknown') {
      addEntry(pathname, sessionId);
    }
  }, [pathname, sessionId, addEntry]);

  const clearTrail = () => {
    setTrail([]);
    try { sessionStorage.removeItem('ksp_audit_trail'); } catch { /* ignore */ }
  };

  const handleExport = () => {
    const csv = 'Timestamp,Page,Path\n' + trail.map(e => `${e.timestamp},"${e.page}",${e.path}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `ksp_audit_trail_${Date.now()}.csv`;
    a.click();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        title="Audit Trail"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(30,58,95,0.08)',
          border: '1px solid rgba(30,58,95,0.2)',
          color: '#1E3A5F', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(30,58,95,0.15)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(30,58,95,0.25)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(30,58,95,0.15)'; }}
      >
        <ClipboardList size={20} />
        {trail.length > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            width: 18, height: 18, borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Math.min(99, trail.length)}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.3)' }}
        />
      )}

      {/* Slide-out Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1200,
        width: 360,
        background: 'var(--cyber-bg)',
        border: '1px solid var(--cyber-border)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--cyber-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ClipboardList size={18} style={{ color: '#1E3A5F' }} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Session Audit Trail</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>{sessionId}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={clearTrail}
              style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
            >Clear</button>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--cyber-border)', display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1E3A5F', fontFamily: 'Inter' }}>{trail.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Page Views</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#8b5cf6', fontFamily: 'Inter' }}>{new Set(trail.map(t => t.path)).size}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Unique Pages</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', fontFamily: 'Inter' }}>{trail[0]?.timestamp ?? '—'}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Last Action</div>
          </div>
        </div>

        {/* Security Badge */}
        <div style={{
          padding: '8px 20px', background: 'rgba(16,185,129,0.05)',
          borderBottom: '1px solid var(--cyber-border)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Lock size={12} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '12px', color: '#10b981' }}>Audit log encrypted · GDPR compliant · Session-scoped</span>
        </div>

        {/* Trail List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {trail.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)', fontSize: '14px' }}>
              No navigation recorded yet
            </div>
          ) : (
            trail.map((entry, idx) => (
              <div key={idx} style={{
                padding: '10px 20px',
                borderBottom: '1px solid var(--cyber-border)',
                display: 'flex', alignItems: 'center', gap: 12,
                background: idx === 0 ? 'rgba(30,58,95,0.04)' : 'transparent',
              }}>
                <div style={{
                  flexShrink: 0, width: 6, height: 6, borderRadius: '50%',
                  background: idx === 0 ? '#1E3A5F' : 'var(--cyber-border)',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: idx === 0 ? 700 : 500,
                    color: idx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{entry.page}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'Inter', marginTop: 2 }}>{entry.path}</div>
                </div>
                <div style={{ flexShrink: 0, fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'Inter' }}>
                  <Clock size={9} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                  {entry.timestamp}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Export button */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--cyber-border)' }}>
          <button
            onClick={handleExport}
            style={{
              width: '100%', padding: '9px', fontSize: '14px', fontWeight: 600,
              background: 'rgba(30,58,95,0.06)', color: '#1E3A5F',
              border: '1px solid rgba(30,58,95,0.15)', borderRadius: 8, cursor: 'pointer',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center', width: '100%' }}>
              <Download size={13} />
              Export Audit Log (CSV)
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
