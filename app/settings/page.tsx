'use client';

import { useState, useEffect } from 'react';
import { Lock, User, Key, Database, Cpu, Terminal, CheckCircle2, AlertTriangle, Server, Activity } from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/crimeData';

interface SystemLog {
  timestamp: string;
  category: 'SECURITY' | 'DATABASE' | 'SYSTEM' | 'AI';
  event: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

const INITIAL_LOGS: SystemLog[] = [
  { timestamp: '12:54:12', category: 'SECURITY', event: '256-Bit SSL Handshake established with KSP Core Gate', status: 'SUCCESS' },
  { timestamp: '12:54:10', category: 'DATABASE', event: 'Synced 82,089 FIR records across 31 districts', status: 'SUCCESS' },
  { timestamp: '12:51:00', category: 'AI', event: 'Gemini 1.5 Pro model initialized successfully', status: 'SUCCESS' },
  { timestamp: '12:45:32', category: 'SECURITY', event: 'DGP Officer session verified from IP 10.210.45.92', status: 'SUCCESS' },
  { timestamp: '12:30:15', category: 'SYSTEM', event: 'Memory buffer clean initiated by CPU supervisor', status: 'SUCCESS' },
  { timestamp: '12:12:04', category: 'DATABASE', event: 'Connection pool saturated, auto-scaled to 15 nodes', status: 'WARNING' },
];

export default function SettingsPage() {
  const [user, setUser] = useState<DemoAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'system'>('profile');
  const [customKey, setCustomKey] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get current user from sessionStorage
      try {
        const raw = sessionStorage.getItem('ksp_user');
        if (raw) {
          setUser(JSON.parse(raw) as DemoAccount);
        }
      } catch {}

      // Get API Key if set
      setCustomKey(localStorage.getItem('ksp_gemini_api_key') || '');
    }
  }, []);

  // Check hash on load to switch tabs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#profile') {
        setActiveTab('profile');
      } else if (window.location.hash === '#system') {
        setActiveTab('system');
      }
    }
  }, []);

  const handleSaveKey = () => {
    if (customKey.trim()) {
      localStorage.setItem('ksp_gemini_api_key', customKey);
    } else {
      localStorage.removeItem('ksp_gemini_api_key');
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getStatusColor = (status: SystemLog['status']) => {
    if (status === 'SUCCESS') return 'text-green-500';
    if (status === 'WARNING') return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="page-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
      
      {/* ── Page Header ───────────────────────────────────────────── */}
      <div className="section-header" style={{ marginBottom: 28 }}>
        <div className="section-header-line" />
        <div>
          <h1 className="page-title">SYSTEM SETTINGS & PROFILE</h1>
          <p className="page-subtitle">Manage intelligence officer credentials and platform status</p>
        </div>
      </div>

      {/* ── Tabs Toggle ───────────────────────────────────────────── */}
      <div className="flex gap-4 border-b border-[var(--cyber-border)] mb-8 pb-0.5">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[var(--cyber-cyan)] text-[var(--cyber-cyan)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <User size={15} />
            <span>Officer Profile</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'system'
              ? 'border-[var(--cyber-cyan)] text-[var(--cyber-cyan)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Server size={15} />
            <span>System Status & Keys</span>
          </div>
        </button>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
          
          {/* Card: Profile Credentials */}
          <div className="glass-card md:col-span-2 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--cyber-border)] pb-4">
              <Lock className="text-[var(--cyber-cyan)]" size={18} />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Credential Overview</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-2">Officer Name</label>
                <div className="py-2.5 px-3.5 border border-[var(--cyber-border)] rounded-lg text-xs font-semibold text-[var(--text-primary)] bg-[var(--cyber-bg)]">
                  {user?.name || 'Loading...'}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-2">Badge Number</label>
                <div className="py-2.5 px-3.5 border border-[var(--cyber-border)] rounded-lg text-xs font-mono font-bold text-[var(--text-primary)] bg-[var(--cyber-bg)]">
                  {user?.badgeNumber || 'Loading...'}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-2">Assigned Role</label>
                <div className="py-2.5 px-3.5 border border-[var(--cyber-border)] rounded-lg text-xs font-bold text-[var(--text-primary)] bg-[var(--cyber-bg)] uppercase">
                  {user?.role || 'Loading...'}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-2">Designation</label>
                <div className="py-2.5 px-3.5 border border-[var(--cyber-border)] rounded-lg text-xs font-semibold text-[var(--text-primary)] bg-[var(--cyber-bg)]">
                  {user?.designation || 'Loading...'}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--cyber-border)] pt-5">
              <h4 className="text-xs font-bold text-[var(--text-primary)] mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={13} className="text-amber-500" />
                Security Access Level
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Your role provides <span className="text-[var(--cyber-cyan)] font-bold">{user?.role === 'DGP' ? 'State DGP Authorization' : user?.role === 'Commissioner' ? 'District Commissioner Authorization' : 'Officer Field Access'}</span>.
                All activities on this terminal are encrypted under 256-BIT SSL and logged to the central command server for audit purposes.
              </p>
            </div>
          </div>

          {/* Card: Session Stats */}
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--cyber-border)] pb-4">
              <Activity className="text-[var(--cyber-cyan)]" size={18} />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Terminal Access</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-[var(--cyber-border)] bg-slate-900/10">
                <div className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-1">Session Status</div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold text-green-500 uppercase">ACTIVE & SECURE</span>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[var(--cyber-border)] bg-slate-900/10">
                <div className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-1">Last Login IP</div>
                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">10.210.45.92 (Intranet)</span>
              </div>
              <div className="p-3 rounded-lg border border-[var(--cyber-border)] bg-slate-900/10">
                <div className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-wider mb-1">Session Expiration</div>
                <span className="text-xs font-semibold text-[var(--text-muted)]">Auto-expires in 8 hours</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
          
          {/* Card: API Keys & Connection */}
          <div className="glass-card md:col-span-2 p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--cyber-border)] pb-4 justify-between">
              <div className="flex items-center gap-2.5">
                <Key className="text-[var(--cyber-cyan)]" size={18} />
                <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">API Configuration</h3>
              </div>
              
              {/* 256-BIT SSL badge moved here! */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/5 text-green-500 text-[10px] font-bold tracking-wider">
                <CheckCircle2 size={12} />
                <span>256-BIT SECURE</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Google Gemini API Key</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3">
                  This key is stored locally in your browser cache and enables the **AI Investigator** stream in the platform.
                </p>
                <div className="flex gap-3">
                  <input
                    type="password"
                    placeholder="AIzaSy... (Paste Gemini Key)"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="flex-1 py-2 px-3.5 border text-xs text-[var(--text-primary)] outline-none rounded-lg"
                    style={{
                      background: 'var(--cyber-bg)',
                      borderColor: 'var(--cyber-border)',
                    }}
                  />
                  <button
                    onClick={handleSaveKey}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[var(--cyber-cyan)]/10 border border-[var(--cyber-cyan)]/30 text-[var(--cyber-cyan)] cursor-pointer hover:bg-[var(--cyber-cyan)]/20 transition-all uppercase tracking-wider"
                  >
                    Save Key
                  </button>
                </div>
                {saveSuccess && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-green-500 text-xs font-bold">
                    <CheckCircle2 size={13} />
                    <span>Gemini key configuration updated successfully!</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--cyber-border)] pt-5">
                <h4 className="text-xs font-bold text-[var(--text-primary)] mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Database size={13} className="text-[var(--cyber-cyan)]" />
                  KSP Database Connection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 border border-[var(--cyber-border)] rounded-lg bg-[var(--cyber-bg)]">
                    <div className="text-[10px] font-black text-[var(--text-dim)] uppercase mb-0.5">Database Link</div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">ksp-intel-cluster-replica-01</span>
                  </div>
                  <div className="p-3 border border-[var(--cyber-border)] rounded-lg bg-[var(--cyber-bg)]">
                    <div className="text-[10px] font-black text-[var(--text-dim)] uppercase mb-0.5">Records Synced</div>
                    <span className="text-xs font-bold text-[var(--cyber-cyan)]">82,089 FIRs (Online)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: System Health & Performance */}
          <div className="glass-card p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2.5 border-b border-[var(--cyber-border)] pb-4">
              <Cpu className="text-[var(--cyber-cyan)]" size={18} />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Terminal Metrics</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  <span>SSL encryption strength</span>
                  <span className="font-bold text-[var(--cyber-cyan)]">256-Bit SSL</span>
                </div>
                <div className="h-2 rounded bg-slate-500/10 overflow-hidden">
                  <div className="h-full bg-green-500 w-full" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  <span>Intranet Node Latency</span>
                  <span className="font-bold text-green-500">14 ms</span>
                </div>
                <div className="h-2 rounded bg-slate-500/10 overflow-hidden">
                  <div className="h-full bg-[var(--cyber-cyan)] w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                  <span>Central CPU Load</span>
                  <span className="font-bold text-[var(--text-primary)]">24%</span>
                </div>
                <div className="h-2 rounded bg-slate-500/10 overflow-hidden">
                  <div className="h-full bg-[var(--cyber-cyan)] w-[24%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Terminal Logs Full-Width */}
          <div className="glass-card md:col-span-3 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 border-b border-[var(--cyber-border)] pb-4">
              <Terminal className="text-[var(--cyber-cyan)]" size={18} />
              <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">Restricted Security Audit Log</h3>
            </div>

            <div className="font-mono text-xs rounded-xl p-4 border border-[var(--cyber-border)] bg-[var(--cyber-bg)] overflow-x-auto space-y-2 max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-3 text-[var(--text-secondary)] leading-relaxed">
                  <span className="text-[var(--text-dim)] select-none">[{log.timestamp}]</span>
                  <span className="font-bold select-none text-[var(--cyber-cyan)]">[{log.category}]</span>
                  <span className="flex-1">{log.event}</span>
                  <span className={`font-bold select-none ${getStatusColor(log.status)}`}>{log.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
