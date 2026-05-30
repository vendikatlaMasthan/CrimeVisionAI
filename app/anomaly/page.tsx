'use client';

import { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Eye, MapPin, Clock,
  RefreshCw, BarChart2, Shield, Activity, HelpCircle
} from 'lucide-react';
import { ANOMALIES, ANOMALY_TIMELINE } from '@/lib/mockData';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#10b981',
};

const SEVERITY_BADGES: Record<string, string> = {
  critical: 'badge badge-red',
  high: 'badge badge-amber',
  medium: 'badge',
  low: 'badge badge-green',
};

const STATUS_BADGES: Record<string, string> = {
  'Under Investigation': 'badge badge-amber',
  'Confirmed': 'badge badge-red',
  'False Positive': 'badge badge-gray',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,22,40,0.98)', border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#f1f5f9'
      }}>
        <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Time: {label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, margin: '2px 0' }}>
            <span style={{ color: p.color, fontWeight: 600 }}>{p.name}:</span>
            <span style={{ fontWeight: 700 }}>{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnomalyPage() {
  const [anomalyList, setAnomalyList] = useState(ANOMALIES);
  const [actions, setActions] = useState<Record<string, string>>({});

  const handleAction = (id: string, newStatus: string) => {
    setActions(prev => ({ ...prev, [id]: newStatus }));
    setAnomalyList(prev =>
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
  };

  const activeCount = anomalyList.filter(a => a.status !== 'False Positive').length;
  const criticalCount = anomalyList.filter(a => a.severity === 'critical' && a.status !== 'False Positive').length;
  const falseCount = anomalyList.filter(a => a.status === 'False Positive').length;

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }}>
      
      {/* ── ALERT BANNER HEADER ── */}
      <div style={{
        background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="animate-alert-flash" style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldAlert size={22} color="#ef4444" />
          </div>
          <div>
            <h1 className="page-title" style={{ color: '#ef4444' }}>Anomaly Detection Engine</h1>
            <p className="page-subtitle">Real-time threat pattern analysis — unusual spikes and deviations</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge badge-red animate-pulse-glow" style={{ padding: '6px 14px', fontSize: 11, fontWeight: 800 }}>
            ANOMALY ALERT ACTIVE
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>State Threat Level: <strong style={{ color: '#ef4444' }}>ELEVATED</strong></span>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="responsive-grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Active Anomalies', value: activeCount, sub: 'Triggered alarms', color: '#ef4444', icon: AlertTriangle, bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
          { label: 'Critical Spikes', value: criticalCount, sub: 'Immediate attention', color: '#f59e0b', icon: ShieldAlert, bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
          { label: 'Under Investigation', value: anomalyList.filter(a => a.status === 'Under Investigation').length, sub: 'Dispatched teams', color: '#00f0ff', icon: Clock, bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.18)' },
          { label: 'False Positives', value: falseCount, sub: 'Dismissed signals', color: '#94a3b8', icon: CheckCircle2, bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.18)' },
        ].map((item, i) => (
          <div key={i} className="glass-card" style={{ padding: 20, background: item.bg, border: `1px solid ${item.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span className="metric-label">{item.label}</span>
              <item.icon size={16} color={item.color} />
            </div>
            <div className="metric-value" style={{ color: item.color }}>{item.value}</div>
            <div className="metric-sub">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* CHART ROW */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24, border: '1px solid rgba(239,68,68,0.15)' }}>
        <div className="section-header" style={{ marginBottom: 18 }}>
          <div className="section-header-line" style={{ background: '#ef4444' }} />
          <span className="section-title">Crime Activity Deviation vs Baseline (Today)</span>
          <span className="badge badge-red" style={{ marginLeft: 'auto' }}>14:00 SPIKE DETECTED</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={ANOMALY_TIMELINE} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            <ReferenceLine x="14:00" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" label={{ value: 'ANOMALY DETECTED', fill: '#ef4444', fontSize: 10, fontWeight: 700 }} />
            <Line type="monotone" dataKey="baseline" name="Expected Baseline" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={1.5} />
            <Area type="monotone" dataKey="actual" name="Actual Crime Volume" stroke="#ef4444" fill="url(#actualGrad)" strokeWidth={2.5} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ANOMALY CARDS GRID */}
      <div>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-header-line" style={{ background: '#ef4444' }} />
          <span className="section-title">Active Anomaly Flags</span>
        </div>
        <div className="responsive-grid-2">
          {anomalyList.map((anom) => {
            const isCritical = anom.severity === 'critical';
            const isDismissed = anom.status === 'False Positive';
            const cardBorder = SEVERITY_COLORS[anom.severity] || '#64748b';
            
            return (
              <div
                key={anom.id}
                className={isCritical && !isDismissed ? 'anomaly-critical' : 'glass-card'}
                style={{
                  borderLeft: `4px solid ${cardBorder}`,
                  opacity: isDismissed ? 0.6 : 1,
                  padding: 22,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span className="badge badge-gray" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
                    {anom.id}
                  </span>
                  <span className={SEVERITY_BADGES[anom.severity]} style={
                    anom.severity === 'medium'
                      ? { background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.35)' }
                      : {}
                  }>
                    {anom.severity.toUpperCase()}
                  </span>
                  <span className={STATUS_BADGES[anom.status] || 'badge'}>
                    {anom.status}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {anom.timestamp}
                  </span>
                  <span style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} color="#64748b" /> {anom.district}
                  </span>
                </div>

                {/* Body */}
                <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 6 }}>
                  {anom.crimeType} — {anom.type}
                </div>
                
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55, marginBottom: 12 }}>
                  {anom.description}
                </p>

                {/* Metrics */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)',
                  padding: '10px 14px', borderRadius: 8, marginBottom: 12
                }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Baseline</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8', marginTop: 1 }}>{anom.baseline}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Detected</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginTop: 1 }}>{anom.actual}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Deviation</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: cardBorder, marginTop: 1 }}>
                      +{anom.spikePercent}%
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                    Trigger Indicators
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {anom.indicators.map((ind, i) => (
                      <span key={i} className="badge badge-gray" style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                        • {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <button
                    className="cyber-btn cyber-btn-cyan"
                    style={{ fontSize: 11, padding: '6px 12px' }}
                    onClick={() => handleAction(anom.id, 'Under Investigation')}
                    disabled={anom.status === 'Under Investigation' || isDismissed}
                  >
                    Investigate
                  </button>
                  <button
                    className="cyber-btn cyber-btn-red"
                    style={{ fontSize: 11, padding: '6px 12px' }}
                    onClick={() => handleAction(anom.id, 'Confirmed')}
                    disabled={anom.status === 'Confirmed' || isDismissed}
                  >
                    Confirm Threat
                  </button>
                  <button
                    className="cyber-btn"
                    style={{
                      fontSize: 11, padding: '6px 12px',
                      background: isDismissed ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                      color: isDismissed ? '#10b981' : '#64748b',
                      border: `1px solid ${isDismissed ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`
                    }}
                    onClick={() => handleAction(anom.id, isDismissed ? 'Under Investigation' : 'False Positive')}
                  >
                    {isDismissed ? 'Re-open Flag' : 'False Positive'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
