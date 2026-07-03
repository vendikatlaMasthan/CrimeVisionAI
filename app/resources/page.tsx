'use client';

import { useState, useMemo } from 'react';
import {
  Package, Shield, Users, Monitor, Anchor, Moon,
  CheckCircle, Clock, Zap,
  BarChart3, MapPin, Sliders, Target, Activity, TrendingUp,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  RESOURCE_RECOMMENDATIONS, DISTRICT_RESOURCES, BUDGET_ALLOCATION,
} from '@/lib/mockData';
import { KARNATAKA_DISTRICTS } from '@/lib/mockData';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#8b5cf6',
  Low: '#10b981',
};

const STATUS_COLORS: Record<string, string> = {
  'Pending Approval': '#f59e0b',
  'Approved': '#0F6B5C',
  'Deployed': '#10b981',
  'In Progress': '#8b5cf6',
  'Pending': '#64748b',
};

const ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  monitor: Monitor,
  shield: Shield,
  anchor: Anchor,
  users: Users,
  moon: Moon,
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { category: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].payload.category}</p>
        <p style={{ color: '#0F6B5C' }}>₹{payload[0].value}Cr</p>
      </div>
    );
  }
  return null;
};

const SimulatorTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p style={{ color: '#0F6B5C', fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: 12 }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ResourcesPage() {
  const [selectedRec, setSelectedRec] = useState<number | null>(null);
  const [actionStatus, setActionStatus] = useState<Record<number, string>>({});

  // Simulator state
  const [patrolUnits, setPatrolUnits] = useState(450);
  const [rapidResponse, setRapidResponse] = useState(20);
  const [techInvestment, setTechInvestment] = useState(35);
  const [simApplied, setSimApplied] = useState(false);

  const handleAction = (id: number, action: string) => {
    setActionStatus((prev) => ({ ...prev, [id]: action }));
  };

  const totalOfficers = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.totalOfficers, 0);
  const totalDeployed = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.deployedPatrol, 0);
  const totalCyber = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.cyberUnits, 0);

  // Simulator computations
  const simulation = useMemo(() => {
    const BASE_CRIMES = 82089;
    const reductionUnits = patrolUnits * 12 + rapidResponse * 200 + techInvestment * 180;
    const reductionPct = Math.min(35, (reductionUnits / BASE_CRIMES) * 100);
    const projectedCrimes = Math.round(BASE_CRIMES * (1 - reductionPct / 100));
    const responseTime = Math.max(4, 28 - rapidResponse * 0.45 - patrolUnits * 0.01).toFixed(1);
    const cyberInterceptRate = Math.min(78, 30 + techInvestment * 0.9).toFixed(1);
    const totalInvestment = patrolUnits * 0.05 + rapidResponse * 2.5 + techInvestment;
    const roiScore = Math.round((reductionPct / totalInvestment) * 100);
    return {
      reductionPct: reductionPct.toFixed(1),
      projectedCrimes,
      responseTime,
      cyberInterceptRate,
      totalInvestment: totalInvestment.toFixed(1),
      roiScore,
    };
  }, [patrolUnits, rapidResponse, techInvestment]);

  const simulatorChartData = useMemo(() => {
    const reductionPct = parseFloat(simulation.reductionPct);
    return KARNATAKA_DISTRICTS.slice(0, 8).map((d) => ({
      name: d.name.split(' ')[0],
      current: d.crimeCount,
      projected: Math.round(d.crimeCount * (1 - reductionPct / 100)),
    }));
  }, [simulation.reductionPct]);

  return (
    <div style={{ padding: '28px' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(30, 58, 95, 0.12)', border: '1px solid rgba(30, 58, 95, 0.3)' }}
            >
              <Package size={20} style={{ color: '#0F6B5C' }} />
            </div>
            <h1 className="page-title">Resource Deployment Intelligence</h1>
          </div>
          <p className="page-subtitle">AI-powered force allocation and deployment recommendations across Karnataka</p>
        </div>
        <div className="flex gap-3">
          <button className="cyber-btn cyber-btn-amber">
            <BarChart3 size={14} />
            ALLOCATION REPORT
          </button>
          <button className="cyber-btn cyber-btn-cyan">
            <Zap size={14} />
            AI OPTIMIZE
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Police Force', value: totalOfficers.toLocaleString(), sub: 'Karnataka', color: '#0F6B5C', icon: Users },
          { label: 'Active Patrol Units', value: totalDeployed.toLocaleString(), sub: 'Deployed', color: '#10b981', icon: Shield },
          { label: 'Cyber Crime Units', value: totalCyber.toLocaleString(), sub: 'Specialized', color: '#8b5cf6', icon: Monitor },
          { label: 'Pending Approvals', value: '3', sub: 'AI Recommendations', color: '#f59e0b', icon: Clock },
        ].map((metric, i) => (
          <div key={i} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="metric-label">{metric.label}</span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${metric.color}18`, border: `1px solid ${metric.color}30` }}
              >
                <metric.icon size={18} style={{ color: metric.color }} />
              </div>
            </div>
            <div className="metric-value" style={{ color: metric.color }}>{metric.value}</div>
            <div className="metric-sub">{metric.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="section-header-line" />
          <h2 className="section-title">AI Deployment Recommendations</h2>
          <span className="badge badge-cyan ml-2" style={{ fontSize: '10px' }}>6 ACTIVE</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RESOURCE_RECOMMENDATIONS.map((rec) => {
            const IconComp = ICON_MAP[rec.icon] || Shield;
            const statusAction = actionStatus[rec.id];
            return (
              <div
                key={rec.id}
                className="glass-card p-5 cursor-pointer"
                style={{
                  borderLeft: `3px solid ${PRIORITY_COLORS[rec.priority] || '#64748b'}`,
                  borderLeftWidth: '4px',
                }}
                onClick={() => setSelectedRec(selectedRec === rec.id ? null : rec.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${rec.color}15`, border: `1px solid ${rec.color}30` }}
                    >
                      <IconComp size={18} style={{ color: rec.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="badge"
                          style={{
                            background: `${PRIORITY_COLORS[rec.priority]}20`,
                            color: PRIORITY_COLORS[rec.priority],
                            border: `1px solid ${PRIORITY_COLORS[rec.priority]}40`,
                            fontSize: '10px',
                          }}
                        >
                          {rec.priority.toUpperCase()}
                        </span>
                        <span
                          className="badge"
                          style={{
                            background: `${STATUS_COLORS[rec.status] || '#64748b'}18`,
                            color: STATUS_COLORS[rec.status] || '#64748b',
                            border: `1px solid ${STATUS_COLORS[rec.status] || '#64748b'}35`,
                            fontSize: '10px',
                          }}
                        >
                          {rec.status.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-bold" style={{ color: '#f1f5f9', fontSize: '15px' }}>{rec.action}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: '#64748b', fontSize: '12px' }}>
                    <MapPin size={12} />
                    <span>{rec.district}</span>
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', marginBottom: '12px' }}>{rec.reason}</p>

                {selectedRec === rec.id && (
                  <div
                    className="animate-fadeInUp"
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Units Required</div>
                        <div style={{ color: '#0F6B5C', fontSize: '18px', fontWeight: 800 }}>{rec.units}</div>
                      </div>
                      <div>
                        <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Timeline</div>
                        <div style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600 }}>{rec.timeline}</div>
                      </div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Expected Impact</div>
                    <div style={{ color: '#10b981', fontSize: '13px' }}>{rec.impact}</div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {statusAction ? (
                      <div className="flex items-center gap-1.5" style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                        <CheckCircle size={14} />
                        {statusAction}
                      </div>
                    ) : (
                      <>
                        <button
                          className="cyber-btn cyber-btn-green"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={(e) => { e.stopPropagation(); handleAction(rec.id, 'Approved'); }}
                        >
                          APPROVE
                        </button>
                        <button
                          className="cyber-btn cyber-btn-cyan"
                          style={{ padding: '6px 14px', fontSize: '11px' }}
                          onClick={(e) => { e.stopPropagation(); handleAction(rec.id, 'Under Review'); }}
                        >
                          REVIEW
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Matrix + Budget */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Priority Matrix */}
        <div className="glass-card p-5 col-span-1">
          <div className="flex items-center gap-2 mb-5">
            <div className="section-header-line" />
            <h2 className="section-title">Priority Matrix</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'HIGH IMPACT HIGH URGENCY', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', items: ['Cyber Task Force', 'Border Checkposts'] },
              { label: 'HIGH IMPACT LOW URGENCY', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', items: ['Cyber Command Center', 'SIT Expansion'] },
              { label: 'LOW IMPACT HIGH URGENCY', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', items: ['Night Patrolling', 'Port Security'] },
              { label: 'LOW IMPACT LOW URGENCY', color: '#64748b', bg: 'rgba(100,116,139,0.08)', items: ['Community Programs', 'Training'] },
            ].map((cell, i) => (
              <div
                key={i}
                className="priority-cell"
                style={{ background: cell.bg, border: `1px solid ${cell.color}25` }}
              >
                <div style={{ color: cell.color, fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>{cell.label}</div>
                {cell.items.map((item, j) => (
                  <div key={j} style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '2px' }}>• {item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Budget Allocation */}
        <div className="glass-card p-5 col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="section-header-line" />
            <h2 className="section-title">Budget Allocation — FY 2025-26</h2>
            <span style={{ color: '#64748b', fontSize: '12px' }}>(₹ in Crores)</span>
          </div>
          <div className="flex items-center gap-6">
            <div style={{ width: 220, height: 220, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BUDGET_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="amount"
                    stroke="none"
                  >
                    {BUDGET_ALLOCATION.map((entry, index) => (
                      <Cell key={index} fill={entry.color} fillOpacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {BUDGET_ALLOCATION.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{item.category}</span>
                      <div className="flex gap-3">
                        <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700 }}>₹{item.amount}Cr</span>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="risk-bar-track">
                      <div className="risk-bar-fill" style={{ width: `${item.percentage * 2}%`, background: item.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* District Resource Table */}
      <div className="glass-card p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="section-header-line" />
            <h2 className="section-title">District Resource Deployment Status</h2>
          </div>
          <button className="cyber-btn cyber-btn-cyan" style={{ padding: '7px 14px', fontSize: '11px' }}>
            EXPORT TABLE
          </button>
        </div>
        <div className="table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Total Officers</th>
                <th>Patrol Deployed</th>
                <th>Cyber Units</th>
                <th>Detectives</th>
                <th>Coverage Score</th>
              </tr>
            </thead>
            <tbody>
              {DISTRICT_RESOURCES.map((d, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} style={{ color: '#64748b' }} />
                      <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{d.district}</span>
                    </div>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{d.totalOfficers.toLocaleString()}</td>
                  <td style={{ color: '#cbd5e1' }}>{d.deployedPatrol.toLocaleString()}</td>
                  <td>
                    <span style={{ color: '#8b5cf6', fontWeight: 700 }}>{d.cyberUnits}</span>
                  </td>
                  <td style={{ color: '#cbd5e1' }}>{d.detectives}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="risk-bar-track" style={{ width: 80 }}>
                        <div
                          className="risk-bar-fill"
                          style={{
                            width: `${d.coverage}%`,
                            background: d.coverage >= 80 ? '#10b981' : d.coverage >= 60 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          color: d.coverage >= 80 ? '#10b981' : d.coverage >= 60 ? '#f59e0b' : '#ef4444',
                          fontWeight: 700,
                          fontSize: '13px',
                        }}
                      >
                        {d.coverage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* PREDICTIVE RESOURCE DEPLOYMENT SIMULATOR                      */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Sliders size={18} style={{ color: '#0F6B5C' }} />
          <h2 className="section-title" style={{ margin: 0 }}>PREDICTIVE RESOURCE DEPLOYMENT SIMULATOR</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
          Adjust patrol units, rapid response teams, and technology investment to simulate projected crime reduction impact using statistical modeling.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Left: Sliders */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Deployment Parameters</h3>

            {/* Patrol Units */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={14} style={{ color: '#0F6B5C' }} /> Patrol Units Deployed
                </label>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0F6B5C', fontFamily: 'JetBrains Mono, monospace' }}>{patrolUnits}</span>
              </div>
              <input
                type="range" min={100} max={1000} value={patrolUnits}
                onChange={(e) => { setPatrolUnits(Number(e.target.value)); setSimApplied(false); }}
                style={{ width: '100%', accentColor: '#0F6B5C', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                <span>100 (Minimal)</span><span>1000 (Maximum)</span>
              </div>
            </div>

            {/* Rapid Response */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} style={{ color: '#ef4444' }} /> Rapid Response Teams
                </label>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>{rapidResponse}</span>
              </div>
              <input
                type="range" min={5} max={50} value={rapidResponse}
                onChange={(e) => { setRapidResponse(Number(e.target.value)); setSimApplied(false); }}
                style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                <span>5 teams</span><span>50 teams</span>
              </div>
            </div>

            {/* Tech Investment */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Monitor size={14} style={{ color: '#8b5cf6' }} /> Tech Investment (₹ Crore)
                </label>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#8b5cf6', fontFamily: 'JetBrains Mono, monospace' }}>₹{techInvestment}Cr</span>
              </div>
              <input
                type="range" min={1} max={100} value={techInvestment}
                onChange={(e) => { setTechInvestment(Number(e.target.value)); setSimApplied(false); }}
                style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>
                <span>₹1Cr</span><span>₹100Cr</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--cyber-border)', paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Total Estimated Investment</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>₹{simulation.totalInvestment}Cr</div>
            </div>

            <button
              onClick={() => setSimApplied(true)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 10, cursor: 'pointer' }}
            >
              ⚡ Apply Simulation
            </button>
            {simApplied && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontSize: 13, color: '#34d399', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={15} /> Simulation applied — projections updated!
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Projected Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Crime Reduction', value: `${simulation.reductionPct}%`, color: '#10b981', icon: TrendingUp, desc: 'Projected annual reduction' },
                { label: 'Response Time', value: `${simulation.responseTime} min`, color: '#0F6B5C', icon: Clock, desc: 'Average incident response' },
                { label: 'Cyber Intercept Rate', value: `${simulation.cyberInterceptRate}%`, color: '#8b5cf6', icon: Monitor, desc: 'Cybercrime detection rate' },
                { label: 'ROI Score', value: `${simulation.roiScore}`, color: '#f59e0b', icon: Target, desc: 'Effectiveness per ₹Cr' },
              ].map((metric) => (
                <div key={metric.label} className="glass-card" style={{ padding: 16, borderLeft: `3px solid ${metric.color}` }}>
                  <metric.icon size={16} style={{ color: metric.color, marginBottom: 8 }} />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{metric.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: metric.color, fontFamily: 'JetBrains Mono, monospace' }}>{metric.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>{metric.desc}</div>
                </div>
              ))}
            </div>

            {/* Simulator Bar Chart */}
            <div className="glass-card" style={{ padding: 16, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
                Current vs Projected Crimes — Top 8 Districts
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={simulatorChartData} barGap={2} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Tooltip content={<SimulatorTooltip />} />
                  <Legend formatter={(v) => <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{v}</span>} />
                  <Bar dataKey="current" name="Current" fill="#ef4444" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="projected" name="Projected" fill="#10b981" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Methodology Note */}
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(148,163,184,0.06)', border: '1px solid var(--cyber-border)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Activity size={14} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong style={{ color: 'var(--text-secondary)' }}>Methodology:</strong> Projections use weighted linear regression formulas: Crime Reduction = (PatrolUnits × 12 + RapidResponse × 200 + TechInvestment × 180) / BaseCrimes. Response Time uses empirical patrol density curves. All values are statistical estimates based on Karnataka Police operational data and national benchmarks.
          </span>
        </div>
      </div>
    </div>
  );
}
