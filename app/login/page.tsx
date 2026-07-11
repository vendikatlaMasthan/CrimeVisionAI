'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Fingerprint, CreditCard, Loader, FileText, Target, ShieldAlert, Search, Award, Settings, Users, User } from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/crimeData';

import CountUp from '@/components/CountUp';
import { InputWithIcon } from '@/components/InputWithIcon';

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
  const [selectedRole, setSelectedRole] = useState<'Officer_Commissioner' | 'Admin_Investigator'>('Officer_Commissioner');
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
  const handleRoleChange = (role: 'Officer_Commissioner' | 'Admin_Investigator') => {
    setSelectedRole(role);
    setError('');
    if (role === 'Officer_Commissioner') {
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
    sessionStorage.setItem('ksp_intro_seen', '1');
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
      setError('Invalid credentials. Access denied.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const triggerBiometricScan = async () => {
    setBioScanning(true);
    setError('');
    
    // Simulate biometric scan
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const targetUsername = selectedRole === 'Officer_Commissioner' ? 'pi2026001' : 'dgp2026001';
    const matched = DEMO_ACCOUNTS.find((a) => a.username === targetUsername);

    if (matched) {
      setBioScanning(false);
      executeSuccessFlow(matched);
    } else {
      setBioScanning(false);
      setError('Biometric verification failed. Enrolled prints not found.');
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
            <div style={{
              width: '72px',
              height: '72px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'logoPulse 2s infinite ease-in-out',
            }}>
              <img src="/crimevision_logo.png" alt="CrimeVision AI Logo" style={{ width: '72px', height: '72px', objectFit: 'contain' }} />
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
            <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/crimevision_logo.png" alt="CrimeVision AI Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            </div>
            <div>
              <h1 className="brand-title">CRIMEVISION AI</h1>
              <p className="brand-tagline">AI Intelligence Platform &bull; Karnataka State Police</p>
            </div>
          </div>

          {/* Karnataka Map Outline & Pulsing City Nodes */}
          <div className="map-wrapper">
            <svg viewBox="0 0 300 360" className="map-svg">
              <path
                d="M 170,40 L 195,65 L 180,95 L 215,115 L 205,150 L 190,170 L 225,230 L 210,270 L 230,305 L 220,325 L 210,320 L 200,345 L 175,375 L 155,365 L 165,340 L 130,335 L 115,345 L 90,320 L 85,270 L 75,235 L 68,190 L 80,140 L 75,120 L 105,115 L 125,80 Z"
                fill="none"
                stroke="rgba(217, 164, 65, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {/* Floating background particles */}
              <circle cx="50" cy="80" r="1.5" fill="rgba(217, 164, 65, 0.4)" className="floating-particle-1" />
              <circle cx="260" cy="140" r="1.2" fill="rgba(217, 164, 65, 0.3)" className="floating-particle-2" />
              <circle cx="120" cy="240" r="2" fill="rgba(217, 164, 65, 0.5)" className="floating-particle-3" />
              <circle cx="220" cy="50" r="1" fill="rgba(217, 164, 65, 0.3)" className="floating-particle-4" />

              {/* Network Connection Lines */}
              <line x1="205" y1="280" x2="150" y2="310" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="205" y1="280" x2="205" y2="125" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="180" y1="80" x2="205" y2="125" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="85" y1="135" x2="180" y2="80" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="85" y1="135" x2="150" y2="310" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" className="animated-line" />
              <line x1="205" y1="125" x2="85" y2="135" stroke="rgba(217, 164, 65, 0.15)" strokeWidth="1" className="animated-line" />
              
              {/* 6 nodes: Belagavi, Kalaburagi, Raichur, Bengaluru, Mysuru, Dharwad (connector) */}
              {/* Bengaluru */}
              <g transform="translate(205, 280)">
                <circle r="8" className="pulse-ring ring-1" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-gold)" className="map-dot-pulse map-dot-pulse-1" />
              </g>
              {/* Kalaburagi */}
              <g transform="translate(180, 80)">
                <circle r="8" className="pulse-ring ring-2" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-gold)" className="map-dot-pulse map-dot-pulse-2" />
              </g>
              {/* Mysuru */}
              <g transform="translate(150, 310)">
                <circle r="8" className="pulse-ring ring-3" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-gold)" className="map-dot-pulse map-dot-pulse-3" />
              </g>
              {/* Raichur */}
              <g transform="translate(205, 125)">
                <circle r="8" className="pulse-ring ring-4" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-gold)" className="map-dot-pulse map-dot-pulse-4" />
              </g>
              {/* Belagavi */}
              <g transform="translate(85, 135)">
                <circle r="8" className="pulse-ring ring-5" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-gold)" className="map-dot-pulse map-dot-pulse-5" />
              </g>
              {/* Dharwad */}
              <g transform="translate(115, 180)">
                <circle r="8" className="pulse-ring ring-6" fill="none" stroke="var(--brand-gold)" strokeWidth="1.5" />
                <circle r="3.5" fill="var(--brand-gold)" className="map-dot-pulse map-dot-pulse-6" />
              </g>
            </svg>
 
            {/* Stat Cards Grid (Frosted Glassmorphism, Multi-colored Accent Icons) */}
            <div className="stats-grid">
              <div className="glass-stat-card neutral">
                <FileText size={18} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value"><CountUp end={82089} /></span>
                  <span className="stat-label">Total Cases</span>
                </div>
              </div>
              <div className="glass-stat-card success">
                <Target size={18} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value"><CountUp end={94.7} decimals={1} suffix="%" /></span>
                  <span className="stat-label">AI Accuracy</span>
                </div>
              </div>
              <div className="glass-stat-card warning">
                <ShieldAlert size={18} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value"><CountUp end={4} /> Active</span>
                  <span className="stat-label">Critical Alerts</span>
                </div>
              </div>
              <div className="glass-stat-card info">
                <Users size={18} className="stat-icon" />
                <div className="stat-info">
                  <span className="stat-value"><CountUp end={184} /> Online</span>
                  <span className="stat-label">Active Officers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Quote & gold accent */}
          <div className="quote-box">
            <span style={{ color: '#F3C65F', fontSize: '14px', fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.02em', display: 'block', marginBottom: '8px' }}>
              &ldquo;Protecting Karnataka through Intelligence and Technology&rdquo;
            </span>
            <div className="quote-divider" style={{ background: 'rgba(243, 198, 95, 0.3)', width: '40px', height: '1px', margin: '8px 0' }} />
            <span className="quote-tagline" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Data Driven &bull; AI Powered &bull; Safer Karnataka
            </span>
          </div>

          {/* Persistent Government Watermark (Vidhana Soudha Outline bottom left) */}
          <div className="government-watermark">
            <svg viewBox="0 0 160 80" width="160" height="80">
              <path d="M10,75 L150,75 M20,75 L20,60 L140,60 L140,75 M30,60 L30,45 L130,45 L130,60 M50,45 L50,20 L110,20 L110,45 M80,20 A15,15 0 0 1 80,5 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <line x1="80" y1="5" x2="80" y2="0" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>



        </div>

        {/* RIGHT PANEL: SECURE FORM CARD */}
        <div className="right-panel">
          
          {/* Mobile-only logo */}
          <div className="mobile-header">
            <div style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/crimevision_logo.png" alt="CrimeVision AI Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--brand-crimson)', margin: 0 }}>CRIMEVISION AI</h2>
              <p style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>KARNATAKA STATE POLICE</p>
            </div>
          </div>

          <div className="form-card">
            
            {/* Header Lock Icon Badge */}
            <div className="form-portal-header">
              <div className="lock-icon-badge">
                <Lock size={16} className="text-[#8B1E1E]" />
              </div>
              <h2 className="portal-title">Secure Access Portal</h2>
              <p className="portal-subtitle">Please login to continue</p>
            </div>

            {/* Role selector cards */}
            <div style={{ marginBottom: '20px' }}>
              <label className="input-label" style={{ marginBottom: '8px', display: 'block', color: 'var(--text-muted)' }}>SELECT ACCESS LEVEL</label>
              <div className="role-grid">
                <button
                  type="button"
                  onClick={() => handleRoleChange('Officer_Commissioner')}
                  className={`role-card-btn ${selectedRole === 'Officer_Commissioner' ? 'active' : ''}`}
                >
                  <User size={16} className="role-card-icon" />
                  <div className="role-card-text">
                    <span className="role-card-title">Officer / Commissioner</span>
                    <span className="role-card-sub">Field Operations & Command</span>
                  </div>
                  <div className="radio-container">
                    <div className="radio-circle">
                      {selectedRole === 'Officer_Commissioner' && <div className="radio-dot" />}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('Admin_Investigator')}
                  className={`role-card-btn ${selectedRole === 'Admin_Investigator' ? 'active' : ''}`}
                >
                  <Settings size={16} className="role-card-icon" />
                  <div className="role-card-text">
                    <span className="role-card-title">Admin / Investigator</span>
                    <span className="role-card-sub">Administration & Analytics</span>
                  </div>
                  <div className="radio-container">
                    <div className="radio-circle">
                      {selectedRole === 'Admin_Investigator' && <div className="radio-dot" />}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleLoginSubmit} className={`login-form ${shake ? 'shake-anim' : ''}`}>
              
              {/* Badge ID Input */}
              <div className="input-group">
                <label className="input-label">BADGE / SERVICE ID</label>
                <InputWithIcon
                  icon={User}
                  value={badgeId}
                  onChange={(val) => { setBadgeId(val); setError(''); }}
                  placeholder="Enter badge number..."
                  disabled={loading || bioScanning}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label className="input-label">PASSWORD</label>
                <div className="input-field-wrapper input-with-icon">
                  <Lock className="input-field-icon icon" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter secure password..."
                    className="input-field password-input"
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
                  <span>SECURE LOGIN</span>
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
                    <Loader size={15} className="spinner" style={{ color: 'var(--brand-crimson)' }} />
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
              <img src="/crimevision_logo.png" alt="Logo" style={{ width: '12px', height: '12px', marginRight: '6px', objectFit: 'contain' }} />
              <span>Karnataka State Police · Government of Karnataka · Est. 1963</span>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .login-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          overflow-y: auto;
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

        /* LEFT PANEL: BRANDING & VISUALIZATION */
        .left-panel {
          width: 60%;
          background: linear-gradient(135deg, #0B1E3D, #1E3A8A, #0B1F3B);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          box-sizing: border-box;
          position: relative;
          color: #FFFFFF;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 10;
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
          font-size: 10px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin: 4px 0 0;
          letter-spacing: 0.02em;
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
          z-index: 10;
        }

        .map-svg {
          max-width: 280px;
          max-height: 280px;
          width: 100%;
          opacity: 0.95;
        }

        /* Floating background particles */
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-15px) translateX(10px); opacity: 0.8; }
        }
        .floating-particle-1 { animation: floatParticle 8s ease-in-out infinite; }
        .floating-particle-2 { animation: floatParticle 12s ease-in-out infinite 2s; }
        .floating-particle-3 { animation: floatParticle 10s ease-in-out infinite 1s; }
        .floating-particle-4 { animation: floatParticle 7s ease-in-out infinite 3s; }

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

        @keyframes ringPulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* Stat Grid (2x2 Glassmorphism layout) */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 24px;
          width: 100%;
          max-width: 500px;
        }

        .glass-stat-card {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .glass-stat-card:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .stat-icon {
          flex-shrink: 0;
          padding: 8px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
        }

        .glass-stat-card.neutral .stat-icon { color: #FFFFFF; background: rgba(255, 255, 255, 0.15); }
        .glass-stat-card.success .stat-icon { color: #10B981; background: rgba(16, 185, 129, 0.15); }
        .glass-stat-card.warning .stat-icon { color: #F59E0B; background: rgba(245, 158, 11, 0.15); }
        .glass-stat-card.info .stat-icon { color: #3B82F6; background: rgba(59, 130, 246, 0.15); }

        .stat-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        /* Quote Box */
        .quote-box {
          border-left: 2px solid var(--brand-gold);
          padding-left: 16px;
          margin-bottom: 24px;
          max-width: 420px;
          z-index: 10;
          text-align: left;
        }

        /* Government building watermark */
        .government-watermark {
          position: absolute;
          bottom: 20px;
          left: 48px;
          opacity: 0.025;
          color: #FFFFFF;
          pointer-events: none;
        }

        .left-panel-footer {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          z-index: 10;
        }

        .simulation-pill {
          background: rgba(244, 161, 0, 0.15);
          border: 1px solid rgba(244, 161, 0, 0.35);
          color: #FFB020;
          border-radius: 999px;
          padding: 6px 14px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* RIGHT PANEL: SECURE FORM CARD */
        .right-panel {
          width: 40%;
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
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(11, 30, 61, 0.08);
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
          background: rgba(139, 30, 30, 0.08);
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

        /* Role Selector Cards Grid (2x2) */
        .role-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .role-card-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          gap: 10px;
          padding: 16px 12px;
          border-radius: 10px;
          border: 1.5px solid var(--neutral-border);
          background: #FFFFFF;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
          height: 145px;
          box-sizing: border-box;
        }

        .role-card-btn:hover {
          border-color: #2563EB;
          background: #F8FAFC;
        }

        .role-card-icon {
          color: var(--text-secondary);
          flex-shrink: 0;
          transition: color 0.2s ease;
        }

        .role-card-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .role-card-title {
          font-size: 13px;
          font-weight: 700;
          line-height: 1.2;
        }

        .role-card-sub {
          font-size: 9.5px;
          color: var(--text-muted);
          font-weight: 500;
          line-height: 1.3;
        }

        /* Radio button indicator centered at the bottom of the card */
        .radio-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: auto;
        }

        .radio-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          transition: all 0.2s ease;
        }

        .radio-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563EB;
        }

        /* ACTIVE STATE: light blue background and blue border */
        .role-card-btn.active {
          background: #EFF6FF !important;
          border-color: #2563EB !important;
          color: #1E40AF !important;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
        }

        .role-card-btn.active .role-card-icon {
          color: #2563EB !important;
        }

        .role-card-btn.active .role-card-sub {
          color: #1E40AF !important;
          opacity: 0.85;
        }

        .role-card-btn.active .radio-circle {
          border-color: #2563EB;
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
          text-align: left;
        }

        .input-field-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--text-muted);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-field-wrapper input.input-field {
          width: 100%;
          height: 42px;
          border-radius: 10px;
          border: 1px solid var(--neutral-border) !important;
          background: #F8FAFC !important;
          padding-right: 48px !important;
          font-size: 13px !important;
          color: var(--text-primary) !important;
          outline: none;
          transition: all 150ms ease;
        }

        .input-field-wrapper input.input-field:focus {
          border-color: var(--brand-crimson) !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 3px rgba(181, 52, 43, 0.08) !important;
        }

        .input-field-wrapper input.input-field.password-input {
          padding-left: 47px !important;
        }
 
        .input-password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
 
        .input-password-toggle:hover {
          color: var(--text-primary);
        }
 
        .form-error-msg {
          font-size: 12px;
          font-weight: 600;
          color: var(--status-danger);
          margin-top: -4px;
          text-align: left;
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
          accent-color: var(--brand-crimson);
        }
 
        .forgot-pass-btn {
          background: transparent;
          border: none;
          color: var(--brand-crimson);
          font-weight: 600;
          cursor: pointer;
        }
 
        .forgot-pass-btn:hover {
          text-decoration: underline;
        }
 
        .login-submit-btn {
          background: linear-gradient(135deg, var(--brand-crimson), #A22222);
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          height: 44px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 150ms ease;
          width: 100%;
          box-shadow: 0 4px 12px rgba(139, 30, 30, 0.15);
        }
 
        .login-submit-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(139, 30, 30, 0.25);
        }

        .login-submit-btn:active {
          transform: translateY(1px);
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
          border: 1.5px solid var(--neutral-border);
          border-radius: 10px;
          height: 44px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 150ms ease;
          width: 100%;
        }
 
        .biometric-login-btn:hover {
          background: rgba(139, 30, 30, 0.04);
          border-color: var(--brand-crimson);
          color: var(--brand-crimson);
        }

        .biometric-login-btn:active {
          transform: translateY(1px);
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
          background: rgba(181, 52, 43, 0.08);
          border: 2px solid var(--brand-crimson);
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
          background: var(--brand-crimson);
          transition: width 0.1s linear;
        }
 
        .progress-percentage {
          font-size: 10px;
          font-weight: 700;
          font-family: monospace;
          color: var(--brand-crimson);
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
          color: var(--brand-gold);
        }
 
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
 
        /* Map Dots Pulse Stagger Animations */
        @keyframes mapDotPulse {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
 
        .map-dot-pulse {
          animation: mapDotPulse 2.5s ease-in-out infinite;
          transform-origin: center;
        }
 
        .map-dot-pulse-1 { animation-delay: 0s; }
        .map-dot-pulse-2 { animation-delay: 0.4s; }
        .map-dot-pulse-3 { animation-delay: 0.8s; }
        .map-dot-pulse-4 { animation-delay: 1.2s; }
        .map-dot-pulse-5 { animation-delay: 1.6s; }
        .map-dot-pulse-6 { animation-delay: 2.0s; }

        /* RESPONSIVE LAYOUT */
        @media (max-width: 1024px) {
          .login-wrapper {
            padding-top: 0;
            overflow-y: auto;
          }
          .login-container {
            flex-direction: column-reverse;
            min-height: 100vh;
          }
          .left-panel {
            width: 100%;
            height: auto;
            padding: 40px 24px;
          }
          .right-panel {
            width: 100%;
            height: auto;
            min-height: 100vh;
            padding: 40px 24px;
          }
          .stats-grid {
            max-width: 100%;
          }
          .mobile-header {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
