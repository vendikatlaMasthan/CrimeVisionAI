'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff, Fingerprint, CreditCard, Loader, FileText, Target, ShieldAlert } from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/crimeData';

const LOADING_STEPS = [
  'Checking Credentials…',
  'Connecting to Intelligence Server…',
  'Loading AI Modules…',
  'Loading Crime Database…',
  'Authorizing Officer…',
  'Access Granted'
];

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [selectedRole, setSelectedRole] = useState<'Officer' | 'Admin'>('Officer');
  const [badgeId, setBadgeId] = useState('PI2026001');
  const [password, setPassword] = useState('officer@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [bioScanning, setBioScanning] = useState(false);
  
  // Transition steps
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Auto-login check
    const existing = sessionStorage.getItem('ksp_user');
    if (existing) {
      router.replace('/');
    }
  }, [router]);

  // Handle role pre-fills
  const handleRoleChange = (role: 'Officer' | 'Admin') => {
    setSelectedRole(role);
    setError('');
    if (role === 'Officer') {
      setBadgeId('PI2026001');
      setPassword('officer@123');
    } else {
      setBadgeId('DGP2026001');
      setPassword('admin@123');
    }
  };

  // Success flow
  const executeSuccessFlow = (matchedAccount: DemoAccount) => {
    sessionStorage.setItem('ksp_user', JSON.stringify(matchedAccount));
    setIsSuccess(true);

    // Cycle steps
    let step = 0;
    const stepInterval = setInterval(() => {
      if (step < LOADING_STEPS.length - 1) {
        step++;
        setStepIdx(step);
      } else {
        clearInterval(stepInterval);
      }
    }, 600);

    // Progress bar
    let prog = 0;
    const progressInterval = setInterval(() => {
      if (prog < 100) {
        prog += 2.5;
        setProgress(prog);
      } else {
        clearInterval(progressInterval);
        // Unified routing: all roles go to Home. RBAC sidebar handles portal differences.
        router.replace('/');
      }
    }, 90);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const matched = DEMO_ACCOUNTS.find(
      (a) => a.username.toLowerCase() === badgeId.trim().toLowerCase() && a.password === password
    );

    if (matched) {
      setLoading(false);
      executeSuccessFlow(matched);
    } else {
      setLoading(false);
      setError('⚠ Invalid credentials. Access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const triggerBiometricScan = async () => {
    setBioScanning(true);
    setError('');
    
    // Simulate biometric scan
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const targetUsername = selectedRole === 'Officer' ? 'pi2026001' : 'dgp2026001';
    const matched = DEMO_ACCOUNTS.find((a) => a.username === targetUsername);

    if (matched) {
      setBioScanning(false);
      executeSuccessFlow(matched);
    } else {
      setBioScanning(false);
      setError('⚠ Biometric verification failed. Enrolled prints not found.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!mounted) return null;

  return (
    <div className="login-wrapper">
      
      {/* ── SUCCESS LOADING SCREEN OVERLAY ──────────────────────── */}
      {isSuccess && (
        <div className="success-overlay">
          <div className="success-content">
            <div className="success-shield-box">
              <Shield size={38} style={{ color: '#A6192E' }} />
            </div>
            <h2 className="success-title">{LOADING_STEPS[stepIdx].toUpperCase()}</h2>
            <p className="success-subtitle">CrimeVision Secure Authorization Protocol</p>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-percentage">{Math.min(Math.round(progress), 100)}%</div>
          </div>
        </div>
      )}

      {/* ── TWO-PANEL SPLIT CONTAINER ────────────────────────── */}
      <div className={`login-container ${isSuccess ? 'fade-out' : ''}`}>
        
        {/* LEFT PANEL: HERO + BRANDING */}
        <div className="left-panel">
          
          {/* Logo Block (circular gold-bordered shield emblem) */}
          <div className="brand-header">
            <div className="emblem-container">
              <Shield size={24} className="text-[#FFFFFF]" />
            </div>
            <div>
              <h1 className="brand-title">CRIMEVISION AI</h1>
              <p className="brand-tagline">AI INTELLIGENCE PLATFORM</p>
              <p className="brand-governance">KARNATAKA STATE POLICE</p>
            </div>
          </div>

          {/* Karnataka Map Outline & Pulsing City Nodes */}
          <div className="map-wrapper">
            <svg viewBox="0 0 300 360" className="map-svg">
              <path
                d="M 170,40 L 195,65 L 180,95 L 215,115 L 205,150 L 190,170 L 225,230 L 210,270 L 230,305 L 220,325 L 210,320 L 200,345 L 175,375 L 155,365 L 165,340 L 130,335 L 115,345 L 90,320 L 85,270 L 75,235 L 68,190 L 80,140 L 75,120 L 105,115 L 125,80 Z"
                fill="none"
                stroke="rgba(45, 212, 191, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Network Connection Lines */}
              <line x1="205" y1="280" x2="150" y2="310" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="205" y1="280" x2="205" y2="125" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="180" y1="80" x2="205" y2="125" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="85" y1="135" x2="180" y2="80" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="85" y1="135" x2="150" y2="310" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="205" y1="125" x2="85" y2="135" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="1" className="animated-line" />
              
              {/* 6 nodes: Belagavi, Kalaburagi, Raichur, Bengaluru, Mysuru, Dharwad (connector) */}
              {/* Bengaluru */}
              <g transform="translate(205, 280)">
                <circle r="8" className="pulse-ring ring-1" fill="none" stroke="var(--brand-cyan)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-cyan)" />
              </g>
              {/* Kalaburagi */}
              <g transform="translate(180, 80)">
                <circle r="8" className="pulse-ring ring-2" fill="none" stroke="var(--brand-cyan)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-cyan)" />
              </g>
              {/* Mysuru */}
              <g transform="translate(150, 310)">
                <circle r="8" className="pulse-ring ring-3" fill="none" stroke="var(--brand-cyan)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-cyan)" />
              </g>
              {/* Raichur */}
              <g transform="translate(205, 125)">
                <circle r="8" className="pulse-ring ring-4" fill="none" stroke="var(--brand-cyan)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-cyan)" />
              </g>
              {/* Belagavi */}
              <g transform="translate(85, 135)">
                <circle r="8" className="pulse-ring ring-5" fill="none" stroke="var(--brand-cyan)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-cyan)" />
              </g>
              {/* Dharwad */}
              <g transform="translate(115, 180)">
                <circle r="8" className="pulse-ring ring-6" fill="none" stroke="var(--brand-cyan)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-cyan)" />
              </g>
            </svg>

            {/* Stat Row */}
            <div className="stats-container">
              <div className="glass-stat-card">
                <FileText size={14} className="text-[#FFFFFF]/70" />
                <span>82,089 CASES</span>
              </div>
              <div className="glass-stat-card">
                <Target size={14} className="text-[#FFFFFF]/70" />
                <span>94.7% ACCURACY</span>
              </div>
              <div className="glass-stat-card">
                <ShieldAlert size={14} className="text-[#FFFFFF]/70" />
                <span>HIGH ALERT LEVEL</span>
              </div>
            </div>
          </div>

          {/* Mission Quote & gold accent */}
          <div className="quote-box">
            <span style={{ color: 'var(--brand-gold)', fontSize: '14px', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.02em', display: 'block', marginBottom: '8px' }}>
              &ldquo;Protecting Karnataka through Intelligence and Technology&rdquo;
            </span>
            <div className="quote-divider" />
            <span className="quote-tagline">
              Data Driven. AI Powered. Safer Karnataka.
            </span>
          </div>

          {/* Persistent Government Watermark (Vidhana Soudha Outline bottom left) */}
          <div className="government-watermark">
            <svg viewBox="0 0 160 80" width="160" height="80">
              <path d="M10,75 L150,75 M20,75 L20,60 L140,60 L140,75 M30,60 L30,45 L130,45 L130,60 M50,45 L50,20 L110,20 L110,45 M80,20 A15,15 0 0 1 80,5 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <line x1="80" y1="5" x2="80" y2="0" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Simulation mode disclosure bottom-left */}
          <div className="left-panel-footer">
            <div className="simulation-pill">
              ⚠️ SIMULATION MODE | Synthetic Demonstration Data
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: SECURE FORM CARD */}
        <div className="right-panel">
          
          {/* Mobile-only logo */}
          <div className="mobile-header">
            <div className="emblem-container" style={{ width: '36px', height: '36px', border: '1px solid var(--brand-gold)' }}>
              <Shield size={16} style={{ color: 'var(--brand-gold)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-teal-900)', margin: 0 }}>CRIMEVISION AI</h2>
              <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>KARNATAKA STATE POLICE</p>
            </div>
          </div>

          <div className="form-card">
            
            {/* Header Lock Icon Badge */}
            <div className="form-portal-header">
              <div className="lock-icon-badge">
                <Lock size={16} className="text-[var(--brand-teal-600)]" />
              </div>
              <h2 className="portal-title">Secure Access Portal</h2>
              <p className="portal-subtitle">Please login to continue</p>
            </div>

            {/* Role Selectors */}
            <div className="role-selector-container">
              <button
                type="button"
                onClick={() => handleRoleChange('Officer')}
                className={`role-tab-btn ${selectedRole === 'Officer' ? 'active' : ''}`}
              >
                Officer Login
                <span className="role-tab-sub">Field Operations</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('Admin')}
                className={`role-tab-btn ${selectedRole === 'Admin' ? 'active' : ''}`}
              >
                Admin / Commissioner
                <span className="role-tab-sub">Command Access</span>
              </button>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleLoginSubmit} className={`login-form ${shake ? 'shake-anim' : ''}`}>
              
              {/* Badge ID Input */}
              <div className="input-group">
                <label className="input-label">BADGE / SERVICE ID</label>
                <div className="input-field-wrapper">
                  <CreditCard className="input-field-icon" size={15} />
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => { setBadgeId(e.target.value); setError(''); }}
                    placeholder="Enter badge number..."
                    className="input-field"
                    disabled={loading || bioScanning}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label className="input-label">PASSWORD</label>
                <div className="input-field-wrapper">
                  <Lock className="input-field-icon" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter secure password..."
                    className="input-field"
                    disabled={loading || bioScanning}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="input-password-toggle"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error messages */}
              {error && <div className="form-error-msg">{error}</div>}

              {/* Remember + Forgot row */}
              <div className="form-utility-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-checkbox-input"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please contact the KSP IT Command Desk to request credential assistance.")}
                  className="forgot-pass-btn"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary button */}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={loading || bioScanning}
              >
                {loading ? (
                  <>
                    <Loader size={16} className="spinner" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>

              {/* OR Divider */}
              <div className="form-or-divider">
                <div className="or-line" />
                <span className="or-text">OR</span>
                <div className="or-line" />
              </div>

              {/* Biometric Button */}
              <button
                type="button"
                onClick={triggerBiometricScan}
                className="biometric-login-btn"
                disabled={loading || bioScanning}
              >
                {bioScanning ? (
                  <>
                    <Loader size={15} className="spinner" style={{ color: 'var(--brand-teal-600)' }} />
                    <span>VERIFYING ENROLLMENT...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={15} />
                    <span>Login with Biometric</span>
                  </>
                )}
              </button>

            </form>

            {/* Portal Footer */}
            <div className="form-portal-footer">
              <Shield size={12} className="text-teal-800" />
              <span>Karnataka State Police · Government of Karnataka · Est. 1963</span>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          background: #F5F7FA;
          position: relative;
        }

        .login-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: row;
          transition: opacity 0.3s ease;
        }

        .fade-out {
          opacity: 0.15;
          pointer-events: none;
        }

        /* LEFT PANEL: HERO SECTION */
        .left-panel {
          width: 45%;
          background: linear-gradient(135deg, var(--brand-teal-900), var(--brand-teal-700));
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          box-sizing: border-box;
          position: relative;
          color: #FFFFFF;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .emblem-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid var(--brand-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
        }

        .brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.05em;
          margin: 0;
          color: #FFFFFF;
          line-height: 1;
        }

        .brand-tagline {
          font-size: 9px;
          font-weight: 700;
          color: var(--brand-gold);
          margin: 4px 0 0;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .brand-governance {
          font-size: 9px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin: 2px 0 0;
          letter-spacing: 0.05em;
        }

        .map-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin: 24px 0;
          position: relative;
          width: 100%;
        }

        .map-svg {
          max-width: 280px;
          max-height: 280px;
          width: 100%;
          opacity: 0.95;
        }

        /* Animated connection lines */
        .animated-line {
          stroke-dasharray: 6 3;
          animation: march 15s linear infinite;
        }

        @keyframes march {
          to {
            stroke-dashoffset: -60;
          }
        }

        /* Pulse Nodes Rings */
        .pulse-ring {
          animation: ringPulse 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          transform-origin: center;
        }

        .ring-1 { animation-delay: 0s; }
        .ring-2 { animation-delay: 0.4s; }
        .ring-3 { animation-delay: 0.8s; }
        .ring-4 { animation-delay: 1.2s; }
        .ring-5 { animation-delay: 1.6s; }
        .ring-6 { animation-delay: 2.0s; }

        @keyframes ringPulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* Stats Row */
        .stats-container {
          display: flex;
          gap: 10px;
          width: 100%;
          justify-content: center;
          margin-top: 24px;
        }

        .glass-stat-card {
          background: rgba(15, 76, 76, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 999px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .glass-stat-card:hover {
          transform: translateY(-2px);
          background: rgba(15, 76, 76, 0.65);
          border-color: rgba(255, 255, 255, 0.15);
        }

        /* Quote Box */
        .quote-box {
          border-left: 2px solid var(--brand-gold);
          padding-left: 16px;
          margin-bottom: 24px;
          max-width: 420px;
        }

        .quote-divider {
          width: 40px;
          height: 1px;
          background: rgba(255, 255, 255, 0.25);
          margin: 8px 0;
        }

        .quote-tagline {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.65);
          letter-spacing: 0.05em;
        }

        /* Government building watermark */
        .government-watermark {
          position: absolute;
          bottom: 20px;
          left: 48px;
          opacity: 0.04;
          color: #FFFFFF;
          pointer-events: none;
        }

        .left-panel-footer {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .simulation-pill {
          background: rgba(244, 161, 0, 0.15);
          border: 1px solid rgba(244, 161, 0, 0.35);
          color: var(--status-warning);
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* RIGHT PANEL: SECURE FORM CARD */
        .right-panel {
          width: 55%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface-bg);
          box-sizing: border-box;
          padding: 32px;
          position: relative;
        }

        .mobile-header {
          display: none;
          position: absolute;
          top: 24px;
          left: 24px;
          align-items: center;
          gap: 12px;
        }

        .form-card {
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(27, 38, 59, 0.04);
          border: 1px solid var(--surface-border);
          width: 100%;
          max-width: 480px;
          padding: 48px;
          box-sizing: border-box;
        }

        .form-portal-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          text-align: center;
        }

        .lock-icon-badge {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--brand-teal-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .portal-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .portal-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin: 4px 0 0;
        }

        /* Role Selector */
        .role-selector-container {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 8px;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .role-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          transition: all 150ms ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .role-tab-btn.active {
          background: #FFFFFF;
          border-color: var(--brand-teal-600);
          color: var(--brand-teal-600);
          box-shadow: 0 4px 10px rgba(15, 107, 92, 0.05);
        }

        .role-tab-sub {
          font-size: 9px;
          font-weight: 500;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Inputs form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }

        .input-field-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-field-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }

        .input-field {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          border: 1px solid var(--surface-border);
          background: #F8FAFC;
          padding: 0 14px 0 42px;
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
          transition: all 150ms ease;
        }

        .input-field:focus {
          border-color: var(--brand-teal-600);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(15, 107, 92, 0.08);
        }

        .input-password-toggle {
          position: absolute;
          right: 14px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-password-toggle:hover {
          color: var(--text-primary);
        }

        .form-error-msg {
          font-size: 12px;
          font-weight: 600;
          color: var(--status-danger);
          margin-top: -4px;
        }

        .form-utility-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .remember-checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
          font-weight: 500;
          cursor: pointer;
        }

        .remember-checkbox-input {
          accent-color: var(--brand-teal-600);
        }

        .forgot-pass-btn {
          background: transparent;
          border: none;
          color: var(--brand-teal-600);
          font-weight: 600;
          cursor: pointer;
        }

        .forgot-pass-btn:hover {
          text-decoration: underline;
        }

        .login-submit-btn {
          background: var(--brand-teal-600);
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          height: 42px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 200ms ease;
          width: 100%;
        }

        .login-submit-btn:hover {
          background: #0D594C;
          transform: translateY(-1px);
        }

        .form-or-divider {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 12px;
          margin: 4px 0;
        }

        .or-line {
          flex: 1;
          height: 1px;
          background: var(--surface-border);
        }

        .or-text {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
        }

        .biometric-login-btn {
          background: transparent;
          border: 1px solid var(--surface-border);
          border-radius: 10px;
          height: 42px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 200ms ease;
          width: 100%;
        }

        .biometric-login-btn:hover {
          border-color: var(--brand-teal-600);
          color: var(--brand-teal-600);
        }

        .form-portal-footer {
          margin-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 9px;
          font-weight: 500;
          color: var(--text-muted);
          text-align: center;
        }

        /* SUCCESS OVERLAY */
        .success-overlay {
          position: fixed;
          inset: 0;
          background: #FFFFFF;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlayFadeIn 0.3s ease forwards;
        }

        .success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 320px;
          width: 100%;
        }

        .success-shield-box {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(166, 25, 46, 0.08);
          border: 2px solid #A6192E;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .success-title {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #1E3A5F;
          margin: 0;
        }

        .success-subtitle {
          font-size: 11px;
          color: #475569;
          margin: 6px 0 16px;
        }

        .progress-track {
          width: 100%;
          height: 4px;
          background: #E5E7EB;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #A6192E;
          transition: width 0.1s linear;
        }

        .progress-percentage {
          font-size: 10px;
          font-weight: 700;
          font-family: monospace;
          color: #A6192E;
          margin-top: 8px;
        }

        /* Animations */
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .shake-anim {
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* RESPONSIVE LAYOUT */
        @media (max-width: 1024px) {
          .left-panel {
            display: none;
          }
          .right-panel {
            width: 100%;
          }
          .mobile-header {
            display: flex;
          }
        }
      `}</style>

    </div>
  );
}
