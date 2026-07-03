'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  ShieldAlert, ShieldCheck, Users, MapPin, BarChart3, Clock,
  CheckCircle, Radio, Sparkles, FileDown, Printer, AlertTriangle, RefreshCw, Zap
} from 'lucide-react';
import {
  COMMISSIONER_METRICS, COMMISSIONER_THREATS,
  COMMISSIONER_RECOMMENDATIONS
} from '@/lib/mockData';

// Chart data mapping: top 8 districts from mockData
const chartData = [
  { name: 'Bengaluru Urban', score: 94, crimes: 14823, color: '#ef4444' },
  { name: 'Kalaburagi', score: 87, crimes: 7891, color: '#ef4444' },
  { name: 'Raichur', score: 84, crimes: 5678, color: '#f59e0b' },
  { name: 'Ballari', score: 81, crimes: 6789, color: '#f59e0b' },
  { name: 'Belagavi', score: 76, crimes: 6234, color: '#f59e0b' },
  { name: 'Mangaluru', score: 72, crimes: 4321, color: '#8b5cf6' },
  { name: 'Hubballi', score: 69, crimes: 5432, color: '#8b5cf6' },
  { name: 'Vijayapura', score: 64, crimes: 4567, color: '#0F6B5C' }
].sort((a, b) => b.crimes - a.crimes);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#FFFFFF', border: '1px solid rgba(30, 58, 95,0.22)',
        borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9'
      }}>
        <div style={{ color: '#0F6B5C', fontWeight: 700, marginBottom: 4 }}>{payload[0].payload.name}</div>
        <div style={{ color: '#cbd5e1' }}>Crimes: <strong style={{ color: '#fff' }}>{payload[0].value.toLocaleString()}</strong></div>
        <div style={{ color: '#cbd5e1' }}>Risk Score: <strong style={{ color: '#fff' }}>{payload[0].payload.score}/100</strong></div>
      </div>
    );
  }
  return null;
};

export default function CommissionerPage() {
  const [approvedRecs, setApprovedRecs] = useState<Set<number>>(new Set());
  const [printing, setPrinting] = useState(false);

  const handleApprove = (id: number) => {
    setApprovedRecs(prev => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
  };

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 1000);
  };

  // Threat Dial Circumference calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.32
  const threatVal = 84;
  const strokeOffset = circumference - (threatVal / 100) * circumference;

  return (
    <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20 }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              background: 'rgba(239,68,68,0.12)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.4)', borderRadius: 6,
              padding: '4px 10px', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em'
            }}>CONFIDENTIAL</span>
            <span style={{
              background: 'rgba(30, 58, 95,0.1)', color: '#0F6B5C',
              border: '1px solid rgba(30, 58, 95,0.3)', borderRadius: 6,
              padding: '4px 10px', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em'
            }}>DGP COMMAND CENTER</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '0.03em', margin: 0 }}>
            STATE COMMAND CENTER VIEW
          </h1>
          <p className="page-subtitle" style={{ margin: '2px 0 0', fontSize: 12 }}>
            Karnataka State Police — Director General of Police Briefing Interface
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handlePrint}
            className="cyber-btn cyber-btn-cyan"
            style={{ padding: '8px 16px', fontSize: 12 }}
            disabled={printing}
          >
            {printing ? <RefreshCw size={14} style={{ animation: 'spin-slow 1.8s linear infinite' }} /> : <Printer size={14} />}
            <span>PRINT BRIEFING</span>
          </button>
          <button
            onClick={handlePrint}
            className="cyber-btn cyber-btn-amber"
            style={{ padding: '8px 16px', fontSize: 12 }}
          >
            <FileDown size={14} />
            <span>EXPORT SUMMARY</span>
          </button>
        </div>
      </div>

      {/* ── THREAT DIAL & SHORTAGE ALERTS ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 20, flexWrap: 'wrap' }}>
        
        {/* State Threat Level Indicator */}
        <div className="glass-card" style={{ padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  filter: 'drop-shadow(0 0 6px #ef4444)',
                  transition: 'stroke-dashoffset 0.8s ease'
                }}
              />
              <text x="50" y="47" textAnchor="middle" fill="#ef4444" fontSize="18" fontWeight="900" fontFamily="JetBrains Mono">84%</text>
              <text x="50" y="65" textAnchor="middle" fill="#f87171" fontSize="7" fontWeight="bold" letterSpacing="0.08em">STATE THREAT</text>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <ShieldAlert size={14} color="#ef4444" />
              <span style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', letterSpacing: '0.05em' }}>INTELLIGENCE ALERT STATUS</span>
            </div>
            <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
              State Threat Matrix index calculated at <strong>CRITICAL (84%)</strong>. High activity anomalies registered across 5 major districts.
              Tactical reinforcements active.
            </p>
          </div>
        </div>

        {/* Resource Shortage Alerts Panel */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={14} color="#f59e0b" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Resource Shortage Alerts
            </span>
            <span className="badge badge-amber" style={{ marginLeft: 'auto', fontSize: 9 }}>5 DISTRICTS BELOW LIMIT</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { district: 'Raichur', score: 48, shortage: '115 Officers', color: '#ef4444' },
              { district: 'Koppal', score: 52, shortage: '95 Officers', color: '#ef4444' },
              { district: 'Kalaburagi', score: 54, shortage: '230 Officers', color: '#f59e0b' },
              { district: 'Ballari', score: 51, shortage: '145 Officers', color: '#ef4444' },
              { district: 'Bidar', score: 56, shortage: '85 Officers', color: '#f59e0b' }
            ].map(s => (
              <div key={s.district} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 'bold', color: '#f1f5f9' }}>{s.district}</div>
                  <div style={{ fontSize: 10, color: '#64748b' }}>Short: <span style={{ color: s.color, fontWeight: 'bold' }}>{s.shortage}</span></div>
                </div>
                <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 'bold', color: s.color }}>{s.score}% Adequacy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXECUTIVE STATS CARDS ROW ── */}
      <div className="responsive-grid-4">
        {[
          { label: 'State YTD Crimes', value: COMMISSIONER_METRICS.totalCrimes.toLocaleString(), sub: 'Recorded Year-to-Date', color: '#0F6B5C', icon: BarChart3 },
          { label: 'Active Case Registry', value: COMMISSIONER_METRICS.activeCases.toLocaleString(), sub: 'Across 31 Districts', color: '#f59e0b', icon: Users },
          { label: 'Force Clearance Index', value: `${COMMISSIONER_METRICS.clearanceRate}%`, sub: 'Cleared & closed rate', color: '#10b981', icon: ShieldCheck, badge: 'STABLE' },
          { label: 'Critical Risk Districts', value: COMMISSIONER_METRICS.criticalDistricts.toString(), sub: 'Immediate resource focus', color: '#ef4444', icon: ShieldAlert },
        ].map((m, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              padding: '18px 20px',
              border: `1px solid ${m.color}25`,
              background: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</span>
              <m.icon size={16} color={m.color} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: m.color, fontFamily: 'monospace' }}>{m.value}</div>
              {m.badge && (
                <span className="badge badge-green" style={{ fontSize: 9 }}>{m.badge}</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── DISTRICT COMPARISON DASHBOARD ── */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="section-header-line" style={{ background: '#0F6B5C' }} />
          <h2 className="section-title">District Comparison Dashboard</h2>
          <span className="badge badge-cyan" style={{ marginLeft: 'auto' }}>STATE INTEL PROFILE</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cyber-table">
            <thead>
              <tr>
                <th>District</th>
                <th>YTD Crimes</th>
                <th>Risk Score</th>
                <th>Active Cases</th>
                <th>Clearance Rate</th>
                <th>Officer Allocation</th>
                <th>Adequacy Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Bengaluru Urban', crimes: 14823, risk: 94, active: 2341, clearance: 81.9, officers: 4820, adequacy: 72 },
                { name: 'Kalaburagi', crimes: 7891, risk: 87, active: 1234, clearance: 79.4, officers: 2480, adequacy: 54 },
                { name: 'Ballari', crimes: 6789, risk: 81, active: 1087, clearance: 78.1, officers: 1620, adequacy: 51 },
                { name: 'Raichur', crimes: 5678, risk: 84, active: 876, clearance: 76.5, officers: 1480, adequacy: 48 },
                { name: 'Belagavi', crimes: 6234, risk: 76, active: 934, clearance: 82.2, officers: 2120, adequacy: 62 },
                { name: 'Mysuru', crimes: 5678, risk: 62, active: 823, clearance: 84.8, officers: 1780, adequacy: 67 },
                { name: 'Mangaluru', crimes: 4321, risk: 72, active: 612, clearance: 83.1, officers: 1340, adequacy: 65 },
                { name: 'Vijayapura', crimes: 4567, risk: 64, active: 698, clearance: 80.7, officers: 1390, adequacy: 60 }
              ].map(d => {
                const statusColor = d.adequacy < 55 ? '#ef4444' : d.adequacy < 65 ? '#f59e0b' : '#10b981';
                const statusLabel = d.adequacy < 55 ? 'CRITICAL SHORTAGE' : d.adequacy < 65 ? 'UNDER-RESOURCED' : 'SUFFICIENT';
                return (
                  <tr key={d.name}>
                    <td style={{ fontWeight: 'bold' }}>{d.name}</td>
                    <td>{d.crimes.toLocaleString()}</td>
                    <td style={{ color: d.risk > 80 ? '#ef4444' : d.risk > 60 ? '#f59e0b' : '#0F6B5C', fontWeight: 'bold' }}>{d.risk}/100</td>
                    <td>{d.active.toLocaleString()}</td>
                    <td>{d.clearance}%</td>
                    <td>{d.officers.toLocaleString()}</td>
                    <td style={{ color: statusColor, fontWeight: 'bold', fontSize: 11 }}>{statusLabel} ({d.adequacy}%)</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MIDDLE ROW: STATE OVERVIEW + ACTIVE THREATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 20, flexWrap: 'wrap' }}>
        
        {/* District Crime Volume */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div className="section-header-line" />
            <h2 className="section-title">District Crime Volume Chart</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#f1f5f9', fontSize: 11, fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="crimes" name="Crimes YTD" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <rect key={index} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active threats list */}
        <div className="glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div className="section-header-line" style={{ background: '#ef4444' }} />
            <h2 className="section-title">Active Threats Monitor</h2>
            <span className="badge badge-red" style={{ marginLeft: 'auto' }}>4 ALARMS</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto' }}>
            {COMMISSIONER_THREATS.map((t) => {
              const isCrit = t.severity === 'critical';
              return (
                <div
                  key={t.id}
                  style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: isCrit ? 'rgba(239,68,68,0.05)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${isCrit ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex', flexDirection: 'column', gap: 4
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9' }}>{t.type}</div>
                    <span className={isCrit ? 'badge badge-red' : 'badge badge-amber'} style={{ fontSize: 9 }}>
                      {t.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#cbd5e1' }}>
                    <MapPin size={9} color="#64748b" />
                    <span>Districts: <strong>{t.districts}</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: '#64748b', marginTop: 4 }}>
                    <span>Status: <strong style={{ color: isCrit ? '#ef4444' : '#f59e0b' }}>{t.status}</strong></span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} /> Active {t.since}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── AI RECOMMENDATIONS SECTION ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div className="section-header-line" style={{ background: '#0F6B5C' }} />
          <h2 className="section-title">AI Suggested Executive Decisions</h2>
          <span className="badge badge-cyan" style={{ marginLeft: 8 }}>PREVENTIVE ACTION LIST</span>
        </div>

        <div className="responsive-grid-3">
          {COMMISSIONER_RECOMMENDATIONS.map((rec) => {
            const isApproved = approvedRecs.has(rec.id);
            return (
              <div
                key={rec.id}
                className="glass-card"
                style={{
                  padding: 20,
                  border: isApproved ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  background: isApproved ? 'rgba(16,185,129,0.04)' : '#FFFFFF',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(30, 58, 95,0.08)', border: '1px solid rgba(30, 58, 95,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900, color: '#0F6B5C'
                  }}>
                    {rec.priority}
                  </div>
                  <span className={rec.urgency === '48 Hours' ? 'badge badge-red' : rec.urgency === 'This Week' ? 'badge badge-amber' : 'badge badge-cyan'} style={{ fontSize: 9 }}>
                    {rec.urgency}
                  </span>
                </div>

                <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', marginBottom: 6, lineHeight: 1.4 }}>
                  {rec.action}
                </div>
                
                <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                  {rec.rationale}
                </p>

                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  {isApproved ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 11, fontWeight: 700, margin: '6px auto 0' }}>
                      <CheckCircle size={13} /> APPROVED &amp; DISPATCHED ✓
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(rec.id)}
                        className="cyber-btn cyber-btn-green"
                        style={{ flex: 1, fontSize: 11, padding: '7px 10px', justifyContent: 'center' }}
                      >
                        <Zap size={11} /> APPROVE DIRECTIVE
                      </button>
                      <button
                        className="cyber-btn"
                        style={{ flex: 1, fontSize: 11, padding: '7px 10px', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        REVIEW INTEL
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RESOURCE STATUS SUMMARY ── */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="section-header-line" />
          <h2 className="section-title">State specialized Force Status</h2>
        </div>
        <div className="responsive-grid-4" style={{ marginBottom: 14 }}>
          {[
            { label: 'Deployed Officers', value: '28,450', color: '#10b981' },
            { label: 'Active Cyber Units', value: '589 units', color: '#0F6B5C' },
            { label: 'Active Investigations', value: '14,823', color: '#f59e0b' },
            { label: 'SIT Crime Teams', value: '6 active', color: '#8b5cf6' },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)',
              padding: '10px 14px', borderRadius: 10, textAlign: 'center'
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{
          background: 'rgba(30, 58, 95,0.04)', border: '1px solid rgba(30, 58, 95,0.15)',
          borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#cbd5e1', lineHeight: 1.6
        }}>
          🎯 <strong>Executive Security Summary:</strong> Response time indices indicate that redeploying 1,200 personnel from the low-activity southern corridor to northern districts (Raichur, Kalaburagi) will yield a <strong>23% increase in state-wide crime resolution efficiency</strong>. SIT Teams have successfully disrupted 3 nodes of the Ballari gang ring in the last 48 hours.
        </div>
      </div>

      {/* ── PLANNED FUTURE INTEGRATIONS ── */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div className="section-header-line" style={{ background: '#f59e0b' }} />
          <h2 className="section-title">PLANNED FUTURE INTEGRATIONS</h2>
          <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>PENDING AUTHORIZATION</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
          {[
            '📹 CCTV Network', '🚁 Drone Feed', '🚦 Traffic Cameras',
            '📞 Emergency 112', '🗄 CCTNS Database', '📊 NCRB Portal',
            '👤 Face Recognition', '🚗 Vehicle ANPR', '📡 IoT Sensors'
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255, 255, 255, 0.04)',
              padding: '12px 16px', borderRadius: 8, textAlign: 'center',
              fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)'
            }}>
              {item}
            </div>
          ))}
        </div>
        <div style={{
          textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', fontStyle: 'italic',
          borderTop: '1px dashed var(--cyber-border)', paddingTop: 12
        }}>
          Pending Government API Authorization
        </div>
      </div>

    </div>
  );
}
