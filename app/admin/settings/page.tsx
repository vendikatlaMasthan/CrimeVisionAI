'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/admin/settings/page.tsx
// CrimeVision AI v2.0 — Platform Settings (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Settings, Lock, Monitor, Brain, Bell, FileText, Check } from 'lucide-react';

export default function PlatformSettingsPage() {
  const [activeCategory, setActiveCategory] = useState<'dashboard' | 'ai' | 'alerts' | 'reports'>('dashboard');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form States
  // Dashboard
  const [defaultDistrict, setDefaultDistrict] = useState('Bengaluru Urban');
  const [refreshRate, setRefreshRate] = useState('30s');
  const [showSimBanner, setShowSimBanner] = useState(true);
  
  // AI
  const [aiModel, setAiModel] = useState('gemini-2.0-flash');
  const [temperature, setTemperature] = useState(0.2);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [sysPrompt, setSysPrompt] = useState('You are the KSP Intelligence Platform Assistant...');

  // Alerts
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(false);
  const [alertRadius, setAlertRadius] = useState(5); // km

  // Reports
  const [showEmblem, setShowEmblem] = useState(true);
  const [signatureText, setSignatureText] = useState('OFFICE OF THE DGP, KARNATAKA');
  const [reportFormat, setReportFormat] = useState('government-restricted');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#475569' }}>
        <span>Home</span>
        <span>/</span>
        <span>Administration</span>
        <span>/</span>
        <span style={{ color: '#1F2937', fontWeight: 600 }}>Platform Settings</span>
      </div>

      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(166, 25, 46, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Settings size={22} style={{ color: '#A6192E' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Platform &amp; System Configuration
            </h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Configure dashboard defaults, AI inference tuning parameters, and notification policies.
            </p>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8,
          background: 'rgba(166, 25, 46, 0.08)',
          border: '1px solid rgba(166, 25, 46, 0.15)',
          fontSize: 11, fontWeight: 700, color: '#A6192E',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <Lock size={14} />
          Admin Only
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>
        
        {/* Left Side: Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'dashboard', label: 'Dashboard Settings', icon: Monitor },
            { id: 'ai', label: 'AI Configuration', icon: Brain },
            { id: 'alerts', label: 'Alert Management', icon: Bell },
            { id: 'reports', label: 'Report Settings', icon: FileText },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                background: activeCategory === cat.id ? '#FFFFFF' : 'transparent',
                border: activeCategory === cat.id ? '1px solid #E5E7EB' : '1px solid transparent',
                borderRadius: 8, color: activeCategory === cat.id ? '#1E3A5F' : '#475569',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                boxShadow: activeCategory === cat.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right Side: Form Panel */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSave}>
            
            {activeCategory === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 4, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>Dashboard Preferences</h3>
                
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Default District Focus</label>
                  <select 
                    value={defaultDistrict}
                    onChange={e => setDefaultDistrict(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, background: '#FFFFFF' }}
                  >
                    {['Bengaluru Urban', 'Kalaburagi', 'Raichur', 'Ballari', 'Belagavi'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Auto Refresh Interval</label>
                  <select 
                    value={refreshRate} 
                    onChange={e => setRefreshRate(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, background: '#FFFFFF' }}
                  >
                    <option value="15s">15 Seconds</option>
                    <option value="30s">30 Seconds</option>
                    <option value="60s">1 Minute</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Show Simulation Banner</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Display warning that dataset contains mock records.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={showSimBanner} 
                    onChange={e => setShowSimBanner(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#1E3A5F', cursor: 'pointer' }}
                  />
                </div>
              </div>
            )}

            {activeCategory === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 4, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>AI Configuration tuning</h3>
                
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Active Large Language Model</label>
                  <select 
                    value={aiModel} 
                    onChange={e => setAiModel(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, background: '#FFFFFF' }}
                  >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Temperature (Inference Creativity)</label>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>{temperature}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={temperature} 
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#1E3A5F', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Target Prediction Confidence Threshold</label>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>{confidenceThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="95" 
                    step="5" 
                    value={confidenceThreshold} 
                    onChange={e => setConfidenceThreshold(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#1E3A5F', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Intelligence System Prompt Guidelines</label>
                  <textarea 
                    rows={3}
                    value={sysPrompt}
                    onChange={e => setSysPrompt(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            {activeCategory === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 4, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>Alert Management</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Email Alerts for Critical Anomalies</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Send instant briefing to SPs on statistical spikes.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts} 
                    onChange={e => setEmailAlerts(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#1E3A5F', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Escalate via SMS Dispatch</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Send SMS coordinates to patrolling officers.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={criticalSms} 
                    onChange={e => setCriticalSms(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#1E3A5F', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Proximity Alert Radius (km)</label>
                  <input 
                    type="number" 
                    value={alertRadius} 
                    onChange={e => setAlertRadius(parseInt(e.target.value))}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
                  />
                </div>
              </div>
            )}

            {activeCategory === 'reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 4, borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>Report Settings</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>Display KSP Logo Emblem in Headers</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>Attach KSP insignia to PDF exports.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={showEmblem} 
                    onChange={e => setShowEmblem(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: '#1E3A5F', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Digital Signature Header</label>
                  <input 
                    type="text" 
                    value={signatureText} 
                    onChange={e => setSignatureText(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Standard Classification Label</label>
                  <select 
                    value={reportFormat} 
                    onChange={e => setReportFormat(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, background: '#FFFFFF' }}
                  >
                    <option value="government-restricted">RESTRICTED — FOR OFFICIAL USE ONLY</option>
                    <option value="confidential">CONFIDENTIAL — KSP INTEL SECURE</option>
                    <option value="secret">SECRET — KSP HIGHER OPERATIONS</option>
                  </select>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', marginTop: 24, borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
              {saveSuccess && (
                <span style={{ fontSize: 12, color: '#065F46', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                  <Check size={14} /> Settings Saved Successfully
                </span>
              )}
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  padding: '10px 24px', background: '#1E3A5F', color: '#FFFFFF', border: 'none',
                  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer'
                }}
              >
                {isSaving ? 'Saving Configurations...' : 'Save Configuration'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
