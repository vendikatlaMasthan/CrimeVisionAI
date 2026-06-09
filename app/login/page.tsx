'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: app/login/page.tsx
// CrimeVision AI — KSP Secure Login Page
// 3 demo accounts, sessionStorage auth, role-based access
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, Eye, EyeOff, AlertTriangle, CheckCircle, Radio, Zap } from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/crimeData';
import { useLanguage } from '@/components/LanguageToggle';

// ─── Auth helpers (call from any page) ────────────────────────────────────────

export function getStoredUser(): DemoAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem('ksp_user');
    return raw ? (JSON.parse(raw) as DemoAccount) : null;
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('ksp_user');
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if already logged in
  useEffect(() => {
    setMounted(true);
    const user = getStoredUser();
    if (user) {
      router.replace('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief auth check
    await new Promise(r => setTimeout(r, 800));

    const match = DEMO_ACCOUNTS.find(
      a => a.username === username.trim() && a.password === password
    );

    if (match) {
      sessionStorage.setItem('ksp_user', JSON.stringify(match));
      setLoginSuccess(true);
      await new Promise(r => setTimeout(r, 1200));
      router.replace('/');
    } else {
      setError(t.login_error);
      setLoading(false);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[number]) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError('');
  };

  const roleColor = (role: string) => {
    if (role === 'DGP') return '#ef4444';
    if (role === 'Commissioner') return '#f59e0b';
    return '#00f0ff';
  };

  const accessLabel = (role: string) => {
    if (role === 'DGP') return 'Full Access';
    if (role === 'Commissioner') return 'Commissioner View';
    return 'Inspector Access';
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(0,240,255,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 60%), #020617',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>

        {/* ── KSP Logo Header ─────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(139,92,246,0.15))',
                border: '2px solid rgba(0,240,255,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 40px rgba(0,240,255,0.2), inset 0 0 40px rgba(0,240,255,0.05)',
                position: 'relative',
              }}
            >
              <Shield size={40} color="#00f0ff" />
              <div style={{
                position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 12px #10b981',
                animation: 'pulse 2s infinite',
              }} />
            </div>
          </div>

          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.25em',
            color: '#64748b', marginBottom: 8, textTransform: 'uppercase',
          }}>
            Karnataka State Police
          </div>
          <div style={{
            fontSize: 20, fontWeight: 900, letterSpacing: '0.12em',
            color: '#f1f5f9', marginBottom: 6, textTransform: 'uppercase',
          }}>
            CrimeVision AI
          </div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
            color: '#00f0ff', textTransform: 'uppercase',
          }}>
            ⚡ SECURE INTELLIGENCE COMMAND SYSTEM
          </div>

          {/* Live status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, marginTop: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981',
                boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, letterSpacing: '0.1em' }}>
                SYSTEM ONLINE
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)' }}>
              <Radio size={9} color="#00f0ff" style={{ animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 10, color: '#00f0ff', fontWeight: 700, letterSpacing: '0.1em' }}>
                v5.0 • 256-BIT SSL
              </span>
            </div>
          </div>
        </div>

        {/* ── Success Screen ───────────────────────────────────────────── */}
        {loginSuccess && (
          <div style={{
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.35)',
            borderRadius: 16, padding: 32, textAlign: 'center',
          }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>
              ACCESS GRANTED
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Redirecting to Command Dashboard...
            </div>
            <div style={{
              width: '100%', height: 3, background: 'rgba(16,185,129,0.15)',
              borderRadius: 2, marginTop: 20, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', background: '#10b981',
                animation: 'loadBar 1.2s ease forwards',
              }} />
            </div>
          </div>
        )}

        {/* ── Login Form ───────────────────────────────────────────────── */}
        {!loginSuccess && (
          <>
            <form
              onSubmit={handleLogin}
              style={{
                background: 'rgba(2,6,23,0.9)',
                border: '1px solid rgba(0,240,255,0.15)',
                borderRadius: 16, padding: 28,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lock size={12} color="#00f0ff" />
                  Authorized Personnel Only
                </div>

                {/* Username */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700,
                    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    {t.login_username}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={e => { setUsername(e.target.value); setError(''); }}
                      autoComplete="username"
                      placeholder="Enter username or badge number"
                      required
                      style={{
                        width: '100%', padding: '12px 14px 12px 40px',
                        background: 'rgba(10,22,40,0.8)',
                        border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(0,240,255,0.2)'}`,
                        borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.5)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(0,240,255,0.2)'; }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700,
                    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    {t.login_password}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} style={{ position: 'absolute', left: 14, top: '50%',
                      transform: 'translateY(-50%)', color: '#475569' }} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      autoComplete="current-password"
                      placeholder="Enter your secure password"
                      required
                      style={{
                        width: '100%', padding: '12px 44px 12px 40px',
                        background: 'rgba(10,22,40,0.8)',
                        border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(0,240,255,0.2)'}`,
                        borderRadius: 10, color: '#f1f5f9', fontSize: 14,
                        outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.5)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(0,240,255,0.2)'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%',
                        transform: 'translateY(-50%)', background: 'none', border: 'none',
                        cursor: 'pointer', color: '#475569', padding: 4 }}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                }}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <span style={{ fontSize: 13, color: '#ef4444' }}>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: loading
                    ? 'rgba(0,240,255,0.05)'
                    : 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(139,92,246,0.15))',
                  border: '1px solid rgba(0,240,255,0.35)',
                  borderRadius: 10, color: loading ? '#64748b' : '#00f0ff',
                  fontSize: 13, fontWeight: 800, letterSpacing: '0.12em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'all 0.2s',
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      border: '2px solid rgba(0,240,255,0.2)',
                      borderTopColor: '#00f0ff',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {t.btn_login}
                  </>
                )}
              </button>
            </form>

            {/* ── Demo Accounts ──────────────────────────────────────── */}
            <div style={{
              marginTop: 20,
              background: 'rgba(2,6,23,0.7)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: 20,
            }}>
              <div style={{
                fontSize: 10, fontWeight: 800, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{ width: 14, height: 1, background: 'rgba(100,116,139,0.4)' }} />
                {t.login_demo_accounts} — Click to fill
                <div style={{ flex: 1, height: 1, background: 'rgba(100,116,139,0.4)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.username}
                    id={`demo-${acc.username}`}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    style={{
                      padding: '12px 16px', borderRadius: 10,
                      background: username === acc.username
                        ? `rgba(${acc.role === 'DGP' ? '239,68,68' : acc.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.06)`
                        : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${username === acc.username
                        ? `rgba(${acc.role === 'DGP' ? '239,68,68' : acc.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.3)`
                        : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
                        {acc.name}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 10,
                        background: `rgba(${acc.role === 'DGP' ? '239,68,68' : acc.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.12)`,
                        color: roleColor(acc.role),
                        border: `1px solid rgba(${acc.role === 'DGP' ? '239,68,68' : acc.role === 'Commissioner' ? '245,158,11' : '0,240,255'},0.3)`,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                        {acc.role}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                      <span style={{ color: '#64748b' }}>
                        User: <span style={{ color: '#00f0ff', fontFamily: 'monospace', fontWeight: 600 }}>{acc.username}</span>
                      </span>
                      <span style={{ color: '#64748b' }}>
                        Pass: <span style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 600 }}>{acc.password}</span>
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                      {acc.designation} · Badge: {acc.badgeNumber} · {accessLabel(acc.role)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer note */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.6 }}>
                This system is restricted to authorized Karnataka State Police personnel.<br />
                Unauthorized access is a punishable offence under IT Act 2000.
              </p>
              <p style={{ fontSize: 10, color: '#1e293b', marginTop: 4 }}>
                KSP Datathon 2026 • CrimeVision AI v5.0
              </p>
            </div>
          </>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
