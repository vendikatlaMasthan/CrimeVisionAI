'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from 'recharts';
import {
  ShieldAlert, ShieldCheck, Star, Users, MapPin, BarChart3, Clock,
  CheckCircle, Radio, Sparkles, FileDown, Printer, AlertTriangle, RefreshCw
} from 'lucide-react';
import {
  COMMISSIONER_METRICS, COMMISSIONER_THREATS,
  COMMISSIONER_RECOMMENDATIONS, DISTRICT_RISK_SCORES
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
  { name: 'Vijayapura', score: 64, crimes: 4567, color: '#00f0ff' }
].sort((a, b) => b.crimes - a.crimes);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,22,40,0.98)', border: '1px solid rgba(0,240,255,0.22)',
        borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9'
      }}>
        <div style={{ color: '#00f0ff', fontWeight: 700, marginBottom: 4 }}>{payload[0].payload.name}</div>
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

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{
              background: 'rgba(239,68,68,0.12)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.4)', borderRadius: 6,
              padding: '4px 10px', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em'
            }}>CONFIDENTIAL</span>
            <span style={{
              background: 'rgba(0,240,255,0.1)', color: '#00f0ff',
              border: '1px solid rgba(0,240,255,0.3)', borderRadius: 6,
              padding: '4px 10px', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em'
            }}>EXECUTIVE LEVEL</span>
          </div>
          <h1 className="page-title" style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '0.06em' }}>
            COMMISSIONER COMMAND VIEW
          </h1>
          <p className="page-subtitle">Karnataka State Police — Executive Intelligence Briefing Screen</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handlePrint}
            className="cyber-btn cyber-btn-cyan"
            style={{ padding: '10px 18px', fontSize: 12 }}
            disabled={printing}
          >
            {printing ? <RefreshCw size={14} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <Printer size={14} />}
            <span>PRINT BRIEFING</span>
          </button>
          <button
            onClick={handlePrint}
            className="cyber-btn cyber-btn-amber"
            style={{ padding: '10px 18px', fontSize: 12 }}
          >
            <FileDown size={14} />
            <span>EXPORT SUMMARY</span>
          </button>
        </div>
      </div>

      {/* ── EXECUTIVE STATS ROW ── */}
      <div className="responsive-grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total State Crimes', value: COMMISSIONER_METRICS.totalCrimes.toLocaleString(), sub: 'Recorded Year-to-Date', color: '#00f0ff', icon: BarChart3 },
          { label: 'Active Investigation Cases', value: COMMISSIONER_METRICS.activeCases.toLocaleString(), sub: 'Across 31 Districts', color: '#f59e0b', icon: Users },
          { label: 'State Clearance Rate', value: `${COMMISSIONER_METRICS.clearanceRate}%`, sub: 'EXCELLENT efficiency', color: '#10b981', icon: ShieldCheck, badge: 'EXCELLENT' },
          { label: 'Critical Districts', value: COMMISSIONER_METRICS.criticalDistricts.toString(), sub: 'Immediate action required', color: '#ef4444', icon: ShieldAlert, pulse: true },
        ].map((m, i) => (
          <div
            key={i}
            className="glass-card"
            style={{
              padding: '24px 28px',
              border: `1px solid ${m.color}25`,
              background: m.pulse ? 'rgba(239,68,68,0.06)' : 'rgba(10,22,40,0.85)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="metric-label" style={{ fontSize: 12, fontWeight: 700 }}>{m.label}</span>
              <m.icon size={18} color={m.color} className={m.pulse ? 'animate-alert-flash' : ''} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div className="metric-value" style={{ color: m.color, fontSize: '2.5rem' }}>{m.value}</div>
              {m.badge && (
                <span className="badge badge-green" style={{ fontSize: 9 }}>{m.badge}</span>
              )}
            </div>
            <div className="metric-sub" style={{ fontSize: 12, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── MIDDLE ROW: STATE OVERVIEW + ACTIVE THREATS ── */}
      <div className="responsive-grid-2-1" style={{ marginBottom: 24 }}>
        
        {/* District Crime Volume */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div className="section-header-line" />
            <h2 className="section-title">District Crime Volume &amp; Risk Rank</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            {COMMISSIONER_THREATS.map((t) => {
              const isCrit = t.severity === 'critical';
              return (
                <div
                  key={t.id}
                  style={{
                    padding: '12px 14px', borderRadius: 8,
                    background: isCrit ? 'rgba(239,68,68,0.05)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${isCrit ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'}`,
                    display: 'flex', flexDirection: 'column', gap: 6
                  }}
                  className={isCrit ? 'anomaly-critical' : ''}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>{t.type}</div>
                    <span className={isCrit ? 'badge badge-red' : 'badge badge-amber'} style={{ fontSize: 9 }}>
                      {t.severity.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#cbd5e1' }}>
                    <MapPin size={10} color="#64748b" />
                    <span>Districts: <strong>{t.districts}</strong></span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: '#64748b', marginTop: 8 }}>
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
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div className="section-header-line" style={{ background: '#00f0ff' }} />
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
                  padding: 22,
                  border: isApproved ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  background: isApproved ? 'rgba(16,185,129,0.04)' : 'rgba(10,22,40,0.85)',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 900, color: '#00f0ff'
                  }}>
                    {rec.priority}
                  </div>
                  <span className={rec.urgency === '48 Hours' ? 'badge badge-red' : rec.urgency === 'This Week' ? 'badge badge-amber' : 'badge badge-cyan'} style={{ fontSize: 9 }}>
                    {rec.urgency}
                  </span>
                </div>

                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.4 }}>
                  {rec.action}
                </div>
                
                <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                  {rec.rationale}
                </p>

                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  {isApproved ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 12, fontWeight: 700, margin: '6px auto 0' }}>
                      <CheckCircle size={14} /> APPROVED &amp; DISPATCHED
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(rec.id)}
                        className="cyber-btn cyber-btn-green"
                        style={{ flex: 1, fontSize: 11, padding: '7px 10px', justifyContent: 'center' }}
                      >
                        APPROVE DIRECTIVE
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
        <div className="responsive-grid-4" style={{ marginBottom: 16 }}>
          {[
            { label: 'Deployed Officers', value: '28,450', color: '#10b981' },
            { label: 'Active Cyber Units', value: '589 units', color: '#00f0ff' },
            { label: 'Active Investigations', value: '14,823', color: '#f59e0b' },
            { label: 'SIT Crime Teams', value: '6 active', color: '#8b5cf6' },
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)',
              padding: '14px 18px', borderRadius: 10, textAlign: 'center'
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: item.color }}>{item.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{
          background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)',
          borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#cbd5e1', lineHeight: 1.6
        }}>
          🎯 <strong>Executive Security Summary:</strong> Response time indices indicate that redeploying 1,200 personnel from the low-activity southern corridor to northern districts (Raichur, Kalaburagi) will yield a <strong>23% increase in state-wide crime resolution efficiency</strong>. SIT Teams have successfully disrupted 3 nodes of the Ballari gang ring in the last 48 hours.
        </div>
      </div>

    </div>
  );
}
