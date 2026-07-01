'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Fingerprint, CreditCard, Loader } from 'lucide-react';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/crimeData';

const quotes = [
  "Protecting Karnataka through Intelligence and Technology",
  "Real-time crime intelligence for a safer state",
  "AI-powered investigations for Karnataka State Police",
  "Data-driven policing. Precision. Speed. Justice."
];

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form states
  const [selectedRole, setSelectedRole] = useState<'Officer' | 'Commissioner'>('Officer');
  const [badgeId, setBadgeId] = useState('inspector');
  const [accessCode, setAccessCode] = useState('KSP@2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [bioActive, setBioActive] = useState(false);
  const [bioScanning, setBioScanning] = useState(false);

  // Quote rotation
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Auto-login check
    const existing = sessionStorage.getItem('ksp_user');
    if (existing) {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % quotes.length);
        setQuoteFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update credentials based on role selector
  const handleRoleChange = (role: 'Officer' | 'Commissioner') => {
    setSelectedRole(role);
    setError('');
    if (role === 'Officer') {
      setBadgeId('inspector');
      setAccessCode('KSP@2025');
    } else {
      setBadgeId('commissioner');
      setAccessCode('KSP@2025');
    }
  };

  const executeSuccessFlow = async (matchedAccount: DemoAccount) => {
    sessionStorage.setItem('ksp_user', JSON.stringify(matchedAccount));
    setIsSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.replace('/');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const matched = DEMO_ACCOUNTS.find(
      (a) => a.username.toLowerCase() === badgeId.trim().toLowerCase() && a.password === accessCode
    );

    if (matched) {
      await executeSuccessFlow(matched);
    } else {
      setLoading(false);
      setError('⚠ Invalid credentials. 2 attempts remaining.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const triggerBiometricScan = async () => {
    setBioScanning(true);
    setError('');
    // Simulate fingerprint scanning
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // Authenticate based on role selector
    const matched = DEMO_ACCOUNTS.find(
      (a) => a.role.toLowerCase() === (selectedRole === 'Officer' ? 'inspector' : 'commissioner')
    );

    if (matched) {
      setBioScanning(false);
      await executeSuccessFlow(matched);
    } else {
      setBioScanning(false);
      setError('⚠ Biometric verification failed. User not enrolled.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!mounted) return null;

  return (
    <div className="login-wrapper">
      
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* SUCCESS TRANSITION SCREEN                                                */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {isSuccess && (
        <div className="success-overlay">
          <div className="success-content">
            <svg className="shield-success-svg" viewBox="0 0 100 120" width="80" height="96">
              <path
                d="M 50,5 L 85,25 L 85,65 C 85,85 70,105 50,115 C 30,105 15,85 15,65 L 15,25 Z"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="4"
              />
              <path
                d="M 50,15 L 75,32 L 75,62 C 75,77 64,92 50,100 C 36,92 25,77 25,62 L 25,32 Z"
                fill="rgba(0, 212, 255, 0.1)"
                stroke="#00D4FF"
                strokeWidth="1"
              />
              <polygon points="50,35 53,45 64,45 55,52 58,62 50,55 42,62 45,52 36,45 47,45" fill="#00D4FF" />
            </svg>
            <h2 className="success-title">IDENTITY VERIFIED</h2>
            <p className="success-subtitle">Initializing Secure Intelligence Module...</p>
            <div className="progress-track">
              <div className="progress-fill" />
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* TWO PANEL SPLIT LAYOUT                                                   */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className={`login-container ${isSuccess ? 'fade-out-all' : ''}`}>
        
        {/* LEFT PANEL: BRANDING + ILLUSTRATION */}
        <div className="left-panel">
          
          {/* Top-left branding */}
          <div className="brand-header">
            <svg viewBox="0 0 100 120" width="40" height="48" style={{ marginRight: '14px' }}>
              <path
                d="M 50,5 L 85,25 L 85,65 C 85,85 70,105 50,115 C 30,105 15,85 15,65 L 15,25 Z"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="5"
              />
              <polygon points="50,30 54,42 66,42 56,50 60,62 50,54 40,62 44,50 34,42 46,42" fill="#00D4FF" />
            </svg>
            <div>
              <h1 className="brand-title">CRIMEVISION AI</h1>
              <p className="brand-tagline">AI INTELLIGENCE PLATFORM</p>
              <p className="brand-governance">KARNATAKA STATE POLICE · GOVERNMENT OF KARNATAKA</p>
            </div>
          </div>

          {/* Custom Animated Map SVG Area */}
          <div className="map-illustration">
            <svg viewBox="0 0 300 400" className="karnataka-map-svg">
              {/* Karnataka Outlines */}
              <path
                d="M 170,40 L 195,65 L 180,95 L 215,115 L 205,150 L 190,170 L 225,230 L 210,270 L 230,305 L 220,325 L 210,320 L 200,345 L 175,375 L 155,365 L 165,340 L 130,335 L 115,345 L 90,320 L 85,270 L 75,235 L 68,190 L 80,140 L 75,120 L 105,115 L 125,80 Z"
                fill="none"
                stroke="rgba(0, 212, 255, 0.18)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              
              {/* Network Connections */}
              <line x1="205" y1="320" x2="150" y2="350" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" />
              <line x1="205" y1="320" x2="205" y2="125" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" />
              <line x1="180" y1="80" x2="205" y2="125" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" />
              <line x1="85" y1="135" x2="180" y2="80" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" />
              <line x1="85" y1="135" x2="150" y2="350" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" />
              <line x1="205" y1="125" x2="85" y2="135" stroke="rgba(0, 212, 255, 0.15)" strokeWidth="1" />

              {/* Major Cities Dots with staggered pulses */}
              {/* Bengaluru */}
              <g transform="translate(205, 320)">
                <circle r="10" className="pulse-ring ring-1" fill="none" stroke="#00D4FF" strokeWidth="1.5" />
                <circle r="4" fill="#00D4FF" />
              </g>
              {/* Kalaburagi */}
              <g transform="translate(180, 80)">
                <circle r="10" className="pulse-ring ring-2" fill="none" stroke="#00D4FF" strokeWidth="1.5" />
                <circle r="4" fill="#00D4FF" />
              </g>
              {/* Mysuru */}
              <g transform="translate(150, 350)">
                <circle r="10" className="pulse-ring ring-3" fill="none" stroke="#00D4FF" strokeWidth="1.5" />
                <circle r="4" fill="#00D4FF" />
              </g>
              {/* Raichur */}
              <g transform="translate(205, 125)">
                <circle r="10" className="pulse-ring ring-4" fill="none" stroke="#00D4FF" strokeWidth="1.5" />
                <circle r="4" fill="#00D4FF" />
              </g>
              {/* Belagavi */}
              <g transform="translate(85, 135)">
                <circle r="10" className="pulse-ring ring-5" fill="none" stroke="#00D4FF" strokeWidth="1.5" />
                <circle r="4" fill="#00D4FF" />
              </g>
            </svg>

            {/* Stats pills */}
            <div className="stats-row">
              <span className="stats-pill"><span className="bullet bullet-blue">🔵</span> 82,089 CASES</span>
              <span className="stats-pill"><span className="bullet bullet-green">🟢</span> 94.7% ACCURACY</span>
              <span className="stats-pill"><span className="bullet bullet-red">🔴</span> HIGH ALERT</span>
            </div>
          </div>

          {/* Quote Rotation Area */}
          <div className="quotes-area">
            <p className={`quote-text ${quoteFade ? 'quote-in' : 'quote-out'}`}>
              "{quotes[quoteIdx]}"
            </p>
            <p className="quote-attribution">
              Karnataka State Police  ·  Government of Karnataka  ·  Est. 1963
            </p>
          </div>

          {/* Simulation Badge */}
          <div className="sim-mode-badge">
            ⚠️ SIMULATION MODE  |  Synthetic Demonstration Data
          </div>

        </div>

        {/* RIGHT PANEL: SECURE LOGIN FORM */}
        <div className="right-panel">
          
          {/* Logo block for mobile screen sizes (hidden on desktop) */}
          <div className="mobile-only-logo">
            <svg viewBox="0 0 100 120" width="36" height="44" style={{ marginBottom: '8px' }}>
              <path
                d="M 50,5 L 85,25 L 85,65 C 85,85 70,105 50,115 C 30,105 15,85 15,65 L 15,25 Z"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="5"
              />
              <polygon points="50,30 54,42 66,42 56,50 60,62 50,54 40,62 44,50 34,42 46,42" fill="#00D4FF" />
            </svg>
            <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#F0F8FF', margin: 0, letterSpacing: '1px' }}>CRIMEVISION AI</h1>
            <p style={{ fontSize: '9px', fontWeight: 500, color: '#6B8CAE', margin: 0, letterSpacing: '1.5px' }}>KARNATAKA STATE POLICE</p>
          </div>

          <div className="login-card">
            
            {/* Header */}
            <div className="portal-header">
              <h2 className="portal-title">SECURE ACCESS PORTAL</h2>
              <p className="portal-subtitle">Officer Authentication Required</p>
              <div className="title-bar-accent" />
            </div>

            {/* Role Selectors */}
            <div className="role-grid">
              <button
                type="button"
                onClick={() => handleRoleChange('Officer')}
                className={`role-btn ${selectedRole === 'Officer' ? 'selected' : ''}`}
              >
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>👮</div>
                <div className="role-btn-title">Officer</div>
                <div className="role-btn-sub">Field Units</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('Commissioner')}
                className={`role-btn ${selectedRole === 'Commissioner' ? 'selected' : ''}`}
              >
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>🎖️</div>
                <div className="role-btn-title">Commissioner</div>
                <div className="role-btn-sub">Senior Command</div>
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleLoginSubmit} className={`form-fields ${shake ? 'shake-anim' : ''}`}>
              
              {/* Badge ID Input */}
              <div className="field-group">
                <label className="field-label">BADGE / SERVICE ID</label>
                <div className="input-icon-wrapper">
                  <CreditCard className="input-icon-left" size={16} />
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => { setBadgeId(e.target.value); setError(''); }}
                    placeholder="Enter your badge number..."
                    className={`form-input ${error ? 'input-error' : ''}`}
                    disabled={loading || bioScanning}
                    required
                  />
                </div>
              </div>

              {/* Access Code Input */}
              <div className="field-group">
                <label className="field-label">ACCESS CODE</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon-left" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={accessCode}
                    onChange={(e) => { setAccessCode(e.target.value); setError(''); }}
                    placeholder="Enter your access code..."
                    className={`form-input ${error ? 'input-error' : ''}`}
                    disabled={loading || bioScanning}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error messages */}
              {error && <div className="error-message">{error}</div>}

              {/* Remember + Forgot Row */}
              <div className="utility-row">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="remember-checkbox"
                  />
                  <span>Remember this device</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please contact the KSP Admin Desk to reset your access credentials.")}
                  className="forgot-btn"
                >
                  Forgot Access Code?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="authenticate-btn"
                disabled={loading || bioScanning}
              >
                {loading ? (
                  <>
                    <Loader size={18} className="spinner" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>🔐 AUTHENTICATE & ACCESS</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="or-divider">
                <div className="or-line" />
                <span className="or-text">OR ACCESS VIA</span>
                <div className="or-line" />
              </div>

              {/* Biometric trigger button */}
              <button
                type="button"
                onClick={triggerBiometricScan}
                className="biometric-btn"
                disabled={loading || bioScanning}
              >
                {bioScanning ? (
                  <>
                    <Loader size={16} className="spinner" style={{ color: '#00D4FF' }} />
                    <span style={{ color: '#00D4FF' }}>SCANNING FINGERPRINT...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={16} />
                    <span>Biometric Authentication</span>
                  </>
                )}
              </button>

            </form>

            {/* Security Footer */}
            <div className="security-info">
              <div className="info-title">🔒 256-bit Encrypted · Government Secured · Session Monitored</div>
              <div className="info-sub">Karnataka State Police · CrimeVision AI v2.0</div>
              <div className="info-sub text-[#FF3B3B]/70 font-semibold" style={{ marginTop: '2px' }}>Authorized Personnel Only</div>
            </div>

          </div>

        </div>

      </div>

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* DESIGN SYSTEM CSS                                                        */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          background: #0A1628;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .login-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          transition: opacity 0.4s ease;
        }

        .fade-out-all {
          opacity: 0.1;
          pointer-events: none;
        }

        /* LEFT PANEL styling */
        .left-panel {
          width: 60%;
          background: #0A1628;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          border-right: 1px solid #1A3A5C;
          box-sizing: border-box;
          position: relative;
          opacity: 0;
          animation: leftPanelIn 0.6s ease-out 0.2s forwards;
        }

        .brand-header {
          display: flex;
          align-items: center;
        }

        .brand-title {
          font-size: 22px;
          font-weight: 800;
          color: #F0F8FF;
          margin: 0;
          letter-spacing: 1px;
        }

        .brand-tagline {
          font-size: 11px;
          font-weight: 500;
          color: #6B8CAE;
          margin: 2px 0 0;
          letter-spacing: 2px;
        }

        .brand-governance {
          font-size: 9px;
          font-weight: 400;
          color: #4A6A8A;
          margin: 4px 0 0;
          letter-spacing: 0.5px;
        }

        /* SVG Map illustration */
        .map-illustration {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-height: 50%;
        }

        .karnataka-map-svg {
          width: 100%;
          max-width: 250px;
          height: auto;
          filter: drop-shadow(0 0 15px rgba(0, 212, 255, 0.1));
        }

        /* Pulsing dot animations */
        .pulse-ring {
          transform-origin: center;
        }
        
        .ring-1 { animation: mapPulse 2s infinite; }
        .ring-2 { animation: mapPulse 2s infinite 0.3s; }
        .ring-3 { animation: mapPulse 2s infinite 0.6s; }
        .ring-4 { animation: mapPulse 2s infinite 0.9s; }
        .ring-5 { animation: mapPulse 2s infinite 1.2s; }

        @keyframes mapPulse {
          0% { transform: scale(0.6); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.6); opacity: 0; }
        }

        /* Stats pills */
        .stats-row {
          display: flex;
          gap: 10px;
          margin-top: 24px;
        }

        .stats-pill {
          background: rgba(0, 212, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.2);
          color: #00D4FF;
          font-size: 11px;
          font-weight: 600;
          border-radius: 20px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .bullet {
          font-size: 9px;
        }

        /* Rotating quotes area */
        .quotes-area {
          text-align: center;
          margin: 0 auto;
          max-width: 440px;
        }

        .quote-text {
          font-size: 16px;
          font-weight: 300;
          color: #8899AA;
          font-style: italic;
          margin: 0 0 12px;
          line-height: 1.5;
          min-height: 48px;
          transition: opacity 0.3s ease;
        }

        .quote-in { opacity: 1; }
        .quote-out { opacity: 0; }

        .quote-attribution {
          font-size: 10px;
          color: #4A6A8A;
          margin: 0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .sim-mode-badge {
          position: absolute;
          bottom: 24px;
          left: 40px;
          font-size: 10px;
          color: #FFB300;
          background: rgba(255, 179, 0, 0.08);
          border: 1px solid rgba(255, 179, 0, 0.15);
          border-radius: 4px;
          padding: 4px 10px;
          letter-spacing: 0.5px;
        }

        /* RIGHT PANEL styling */
        .right-panel {
          width: 40%;
          background: #0D1B2E;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          box-sizing: border-box;
          transform: translateX(40px);
          opacity: 0;
          animation: rightPanelIn 0.5s ease-out forwards;
        }

        .mobile-only-logo {
          display: none;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .login-card {
          width: 100%;
          max-width: 360px;
        }

        .portal-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .portal-title {
          font-size: 18px;
          font-weight: 700;
          color: #F0F8FF;
          margin: 0;
          letter-spacing: 1.5px;
        }

        .portal-subtitle {
          font-size: 13px;
          font-weight: 400;
          color: #6B8CAE;
          margin: 6px 0 0;
        }

        .title-bar-accent {
          width: 40px;
          height: 2px;
          background: #00D4FF;
          margin: 12px auto 0;
        }

        /* Role Selector */
        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .role-btn {
          background: #0A1628;
          border: 1px solid #1A3A5C;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          outline: none;
        }

        .role-btn:hover {
          border-color: rgba(0, 212, 255, 0.4);
        }

        .role-btn.selected {
          border-color: #00D4FF;
          background: rgba(0, 212, 255, 0.06);
        }

        .role-btn-title {
          font-size: 13px;
          font-weight: 600;
          color: #F0F8FF;
        }

        .role-btn-sub {
          font-size: 11px;
          color: #6B8CAE;
          margin-top: 2px;
        }

        /* Input styling */
        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
        }

        .field-label {
          font-size: 11px;
          font-weight: 600;
          color: #6B8CAE;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .input-icon-wrapper {
          position: relative;
        }

        .input-icon-left {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6B8CAE;
        }

        .form-input {
          width: 100%;
          background: #0A1628;
          border: 1px solid #1A3A5C;
          border-radius: 8px;
          height: 48px;
          padding: 0 16px 0 44px;
          color: #F0F8FF;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: #00D4FF;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        .form-input.input-error {
          border-color: #FF3B3B;
          box-shadow: 0 0 0 3px rgba(255, 59, 59, 0.1);
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6B8CAE;
          padding: 4px;
        }

        .password-toggle-btn:hover {
          color: #F0F8FF;
        }

        .error-message {
          font-size: 12px;
          color: #FF3B3B;
          margin-top: -8px;
          font-weight: 600;
        }

        /* Checkbox & Forgot */
        .utility-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #8899AA;
          cursor: pointer;
        }

        .remember-checkbox {
          accent-color: #00D4FF;
          cursor: pointer;
        }

        .forgot-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: #00D4FF;
          cursor: pointer;
          padding: 2px;
        }

        .forgot-btn:hover {
          text-decoration: underline;
        }

        /* Authenticate Button */
        .authenticate-btn {
          width: 100%;
          height: 52px;
          background: #00D4FF;
          color: #0A1628;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.5px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .authenticate-btn:hover {
          background: #00B8D9;
          transform: translateY(-1px);
        }

        .authenticate-btn:active {
          transform: translateY(0);
        }

        .spinner {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* OR Divider */
        .or-divider {
          display: flex;
          align-items: center;
          margin-top: 8px;
        }

        .or-line {
          flex: 1;
          height: 1px;
          background: rgba(26, 58, 92, 0.6);
        }

        .or-text {
          font-size: 11px;
          color: #4A6A8A;
          padding: 0 12px;
          letter-spacing: 1px;
        }

        /* Biometric Button */
        .biometric-btn {
          width: 100%;
          height: 44px;
          background: transparent;
          border: 1px solid #1A3A5C;
          color: #8899AA;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .biometric-btn:hover {
          border-color: #00D4FF;
          color: #00D4FF;
        }

        /* Security Info Panel */
        .security-info {
          text-align: center;
          margin-top: 32px;
        }

        .info-title {
          font-size: 10px;
          color: #4A6A8A;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .info-sub {
          font-size: 10px;
          color: #3A5A7A;
          letter-spacing: 0.2px;
          line-height: 1.4;
        }

        /* SUCCESS OVERLAY */
        .success-overlay {
          position: fixed;
          inset: 0;
          background: #0A1628;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: successBgIn 0.3s ease-out;
        }

        .success-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .shield-success-svg {
          filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.4));
          margin-bottom: 24px;
          animation: shieldSuccessPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .success-title {
          font-size: 24px;
          font-weight: 900;
          color: #F0F8FF;
          letter-spacing: 2px;
          margin: 0 0 8px;
          animation: fadeInUp 0.4s ease-out 0.2s forwards;
          opacity: 0;
        }

        .success-subtitle {
          font-size: 14px;
          color: #6B8CAE;
          margin: 0 0 32px;
          animation: fadeInUp 0.4s ease-out 0.3s forwards;
          opacity: 0;
        }

        .progress-track {
          width: 240px;
          height: 4px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
          animation: fadeInUp 0.4s ease-out 0.4s forwards;
          opacity: 0;
        }

        .progress-fill {
          height: 100%;
          background: #00D4FF;
          width: 0%;
          animation: fillProgress 1.6s ease-in-out 0.5s forwards;
          box-shadow: 0 0 8px #00D4FF;
        }

        /* Animations declarations */
        @keyframes leftPanelIn {
          to { opacity: 1; }
        }

        @keyframes rightPanelIn {
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes successBgIn {
          from { background: transparent; }
          to { background: #0A1628; }
        }

        @keyframes shieldSuccessPop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes fillProgress {
          to { width: 100%; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Shake animation for errors */
        .shake-anim {
          animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }

        /* RESPONSIVE MEDIA QUERIES */
        @media (max-width: 1024px) {
          .left-panel {
            width: 45%;
            padding: 30px;
          }
          .right-panel {
            width: 55%;
            padding: 30px;
          }
          .karnataka-map-svg {
            max-width: 200px;
          }
          .stats-row {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .left-panel {
            display: none !important;
          }
          .right-panel {
            width: 100%;
            padding: 40px 24px;
          }
          .mobile-only-logo {
            display: flex;
          }
          .portal-header {
            margin-bottom: 24px;
          }
          .role-grid {
            margin-bottom: 20px;
          }
        }
      `}</style>

    </div>
  );
}
