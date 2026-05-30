'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import {
  Shield, AlertTriangle, TrendingUp, TrendingDown, Activity,
  Users, FileText, MapPin, Zap, Eye, Clock, ChevronRight,
  Radio, Target, BarChart2, Bell, CheckCircle, AlertCircle,
} from 'lucide-react';
import {
  SUMMARY_METRICS, MONTHLY_CRIME_TRENDS, CRIME_CATEGORIES,
  RECENT_INCIDENTS, DISTRICT_RISK_SCORES, AI_ALERTS,
} from '@/lib/mockData';

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(5,12,28,0.97)',
      border: '1px solid rgba(0,240,255,0.22)',
      borderRadius: 10,
      padding: '12px 16px',
      fontSize: 13,
      color: '#f1f5f9',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <div style={{ color: '#00f0ff', fontWeight: 700, marginBottom: 6, fontSize: 11, letterSpacing: '0.08em' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
          <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Severity color helper ──────────────────────────────────────
function alertSeverityColor(severity: string) {
  if (severity === 'critical') return '#ef4444';
  if (severity === 'high') return '#f59e0b';
  if (severity === 'medium') return '#00f0ff';
  return '#94a3b8';
}

function alertSeverityBadgeClass(severity: string) {
  if (severity === 'critical') return 'badge badge-red';
  if (severity === 'high') return 'badge badge-amber';
  if (severity === 'medium') return 'badge badge-cyan';
  return 'badge badge-gray';
}

function statusBadgeClass(status: string) {
  if (status === 'investigating') return 'badge badge-amber';
  if (status === 'arrested') return 'badge badge-green';
  if (status === 'resolved') return 'badge badge-cyan';
  if (status === 'monitoring') return 'badge badge-purple';
  return 'badge badge-gray';
}

function priorityBadgeClass(priority: string) {
  if (priority === 'critical') return 'badge badge-red';
  if (priority === 'high') return 'badge badge-amber';
  if (priority === 'medium') return 'badge badge-cyan';
  return 'badge badge-gray';
}

// ── Main Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function tick() {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const chartData = MONTHLY_CRIME_TRENDS.slice(-12);

  // District risk bar color
  function riskBarColor(score: number) {
    if (score > 80) return '#ef4444';
    if (score > 60) return '#f59e0b';
    return '#00f0ff';
  }

  return (
    <div style={{ padding: '28px', minHeight: '100vh', background: 'transparent' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0,240,255,0.15)',
          }}>
            <Shield size={26} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title" style={{ letterSpacing: '0.06em', fontSize: 26 }}>COMMAND DASHBOARD</h1>
            <p className="page-subtitle">Karnataka State Police — Real-Time Intelligence Overview</p>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20, padding: '5px 14px',
          }}>
            <div className="status-dot" />
            <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
          </div>
          {mounted && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#00f0ff', letterSpacing: '0.06em', fontFamily: 'JetBrains Mono, monospace' }}>{currentTime}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{currentDate}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── PRIMARY METRIC CARDS ──────────────────────────── */}
      <div className="responsive-grid-4" style={{ marginBottom: 18 }}>
        {/* Total Crimes */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={20} color="#ef4444" />
            </div>
            <span className="badge badge-red" style={{ fontSize: 10 }}>+12.4%</span>
          </div>
          <div className="metric-value neon-red" style={{ fontSize: '2.6rem' }}>
            {SUMMARY_METRICS.totalCrimes.toLocaleString()}
          </div>
          <div className="metric-label" style={{ marginTop: 4 }}>Total Crimes Recorded</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <TrendingUp size={12} color="#ef4444" />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>YoY increase from 2024</span>
          </div>
        </div>

        {/* Active Cases */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity size={20} color="#f59e0b" />
            </div>
            <span className="badge badge-amber" style={{ fontSize: 10 }}>ACTIVE</span>
          </div>
          <div className="metric-value neon-amber" style={{ fontSize: '2.6rem' }}>
            {SUMMARY_METRICS.activeCases.toLocaleString()}
          </div>
          <div className="metric-label" style={{ marginTop: 4 }}>Active Investigations</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <Clock size={12} color="#f59e0b" />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Across 31 districts</span>
          </div>
        </div>

        {/* Clearance Rate */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle size={20} color="#10b981" />
            </div>
            <span className="badge badge-green" style={{ fontSize: 10 }}>HIGH EFFICIENCY</span>
          </div>
          <div className="metric-value neon-green" style={{ fontSize: '2.6rem' }}>
            {SUMMARY_METRICS.clearanceRate}%
          </div>
          <div className="metric-label" style={{ marginTop: 4 }}>Clearance Rate</div>
          <div style={{ marginTop: 8 }}>
            <div className="risk-bar-track">
              <div className="risk-bar-fill" style={{ width: `${SUMMARY_METRICS.clearanceRate}%`, background: '#10b981' }} />
            </div>
          </div>
        </div>

        {/* AI Alerts */}
        <div className="glass-card" style={{ padding: 22, border: '1px solid rgba(0,240,255,0.22)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} className="animate-pulse-glow">
              <Zap size={20} color="#00f0ff" />
            </div>
            <div className="status-dot" style={{ marginTop: 6 }} />
          </div>
          <div className="metric-value neon-cyan" style={{ fontSize: '2.6rem' }}>
            {SUMMARY_METRICS.aiAlertsToday}
          </div>
          <div className="metric-label" style={{ marginTop: 4 }}>AI Alerts Today</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <Radio size={12} color="#00f0ff" />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>Real-time monitoring active</span>
          </div>
        </div>
      </div>

      {/* ── SECONDARY METRICS ────────────────────────────── */}
      <div className="responsive-grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Arrests MTD', value: SUMMARY_METRICS.arrestsThisMonth.toLocaleString(), icon: <Users size={16} color="#8b5cf6" />, color: '#8b5cf6' },
          { label: 'Charges Filed', value: SUMMARY_METRICS.chargesFiledMTD.toLocaleString(), icon: <FileText size={16} color="#0ea5e9" />, color: '#0ea5e9' },
          { label: 'High Risk Districts', value: SUMMARY_METRICS.highRiskDistricts.toString(), icon: <AlertTriangle size={16} color="#ef4444" />, color: '#ef4444' },
          { label: 'Solved Cases', value: SUMMARY_METRICS.solvedCases.toLocaleString(), icon: <Target size={16} color="#10b981" />, color: '#10b981' },
        ].map((m) => (
          <div key={m.label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `rgba(${m.color === '#8b5cf6' ? '139,92,246' : m.color === '#0ea5e9' ? '14,165,233' : m.color === '#ef4444' ? '239,68,68' : '16,185,129'},0.12)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {m.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
              <div className="metric-label" style={{ fontSize: 11, marginTop: 3 }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CHARTS ROW ──────────────────────────────── */}
      <div className="responsive-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Area Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">Crime Trend Analysis — 18 Months</span>
            <div style={{ marginLeft: 'auto' }}>
              <span className="badge badge-cyan" style={{ fontSize: 10 }}>LIVE DATA</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={MONTHLY_CRIME_TRENDS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gcyber" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gviolence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gnarcotics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e879f9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#e879f9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gorganized" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Area type="monotone" dataKey="cybercrime" name="Cybercrime" stroke="#00f0ff" strokeWidth={2} fill="url(#gcyber)" fillOpacity={1} dot={false} />
              <Area type="monotone" dataKey="violence" name="Violence" stroke="#ef4444" strokeWidth={2} fill="url(#gviolence)" fillOpacity={1} dot={false} />
              <Area type="monotone" dataKey="narcotics" name="Narcotics" stroke="#e879f9" strokeWidth={2} fill="url(#gnarcotics)" fillOpacity={1} dot={false} />
              <Area type="monotone" dataKey="organized" name="Organized" stroke="#f59e0b" strokeWidth={2} fill="url(#gorganized)" fillOpacity={1} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">Crime Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={CRIME_CATEGORIES}
                dataKey="count"
                nameKey="name"
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                paddingAngle={3}
              >
                {CRIME_CATEGORIES.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
            {CRIME_CATEGORIES.map((cat) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0, boxShadow: `0 0 6px ${cat.color}` }} />
                  <span style={{ fontSize: 12, color: '#cbd5e1' }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.count.toLocaleString()}</span>
                  <span style={{ fontSize: 10, color: cat.trend?.startsWith('+') ? '#ef4444' : '#10b981', fontWeight: 600 }}>{cat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ───────────────────────────────────── */}
      <div className="responsive-grid-3-2" style={{ marginBottom: 24 }}>
        {/* Incidents Table */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">Recent Incidents</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="status-dot-red" />
              <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, letterSpacing: '0.08em' }}>LIVE FEED</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Incident ID</th>
                  <th>Type</th>
                  <th>District</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_INCIDENTS.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{inc.id}</td>
                    <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{inc.type}</td>
                    <td style={{ color: '#cbd5e1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={12} color="#64748b" />
                        {inc.district}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{inc.time}</td>
                    <td><span className={statusBadgeClass(inc.status)}>{inc.status}</span></td>
                    <td><span className={priorityBadgeClass(inc.priority)}>{inc.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* District Risk Index */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">District Risk Index</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DISTRICT_RISK_SCORES.map((d) => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={12} color={riskBarColor(d.score)} />
                    <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{d.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: riskBarColor(d.score) }}>{d.score}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: '#ef4444',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: 10, padding: '1px 7px',
                    }}>{d.predictedIncrease}</span>
                  </div>
                </div>
                <div className="risk-bar-track">
                  <div className="risk-bar-fill" style={{
                    width: `${d.score}%`,
                    background: `linear-gradient(90deg, ${riskBarColor(d.score)}, ${riskBarColor(d.score)}88)`,
                    boxShadow: `0 0 8px ${riskBarColor(d.score)}66`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI ALERT STRIP ───────────────────────────────── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div className="section-header-line" />
          <span className="section-title">
            <Bell size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} color="#f59e0b" />
            AI Intelligence Alerts
          </span>
          <span className="badge badge-amber" style={{ fontSize: 10 }}>{AI_ALERTS.length} ACTIVE</span>
        </div>
        <div className="responsive-grid-3">
          {AI_ALERTS.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="alert-card glass-card"
              style={{
                padding: '14px 18px',
                borderLeft: `3px solid ${alertSeverityColor(alert.severity)}`,
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <span className={alertSeverityBadgeClass(alert.severity)} style={{ fontSize: 10 }}>{alert.severity}</span>
                <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{alert.timestamp}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4, marginBottom: 4 }}>{alert.title}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{alert.description.substring(0, 100)}…</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={11} color="#00f0ff" />
                <span style={{ fontSize: 11, color: '#00f0ff', fontWeight: 600 }}>Confidence: {alert.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
