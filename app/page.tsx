'use client';

import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import {
  SUMMARY_METRICS, MONTHLY_CRIME_TRENDS, CRIME_CATEGORIES, RECENT_INCIDENTS, DISTRICT_RISK_SCORES
} from '@/lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import {
  AlertTriangle, Shield, Activity, Users, TrendingUp, TrendingDown,
  Eye, Zap, ChevronRight, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p className="font-bold mb-1" style={{ color: '#00f0ff', fontSize: '11px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, fontSize: '11px' }}>{p.name}: {p.value?.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

function MetricCard({ icon: Icon, label, value, change, color, glow }: any) {
  const isPositive = change > 0;
  return (
    <div className="glass-card p-5 animate-fadeInUp" style={{ borderColor: `${color}22` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-red-400' : 'text-green-400'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="metric-value mb-1" style={{ color }}>{value}</div>
      <div className="text-xs font-medium" style={{ color: '#64748b' }}>{label}</div>
    </div>
  );
}

function RiskBar({ name, score, index }: { name: string; score: number; index: number }) {
  const color = score >= 85 ? '#ef4444' : score >= 70 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-3" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="text-xs w-32 truncate" style={{ color: '#94a3b8' }}>{name}</div>
      <div className="flex-1 risk-bar-track">
        <div className="risk-bar-fill" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
      </div>
      <div className="text-xs font-bold w-8 text-right" style={{ color }}>{score}</div>
    </div>
  );
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const metrics = [
    { icon: Activity, label: 'Total Crimes (2025)', value: SUMMARY_METRICS.totalCrimes.toLocaleString(), change: 8.4, color: '#ef4444' },
    { icon: Eye, label: 'Active Cases', value: SUMMARY_METRICS.activeCases.toLocaleString(), change: 4.2, color: '#00f0ff' },
    { icon: AlertTriangle, label: 'High Risk Districts', value: SUMMARY_METRICS.highRiskDistricts, change: 16.7, color: '#f59e0b' },
    { icon: Shield, label: 'Arrests This Month', value: SUMMARY_METRICS.arrestsThisMonth.toLocaleString(), change: -3.1, color: '#10b981' },
    { icon: Users, label: 'Charges Filed (MTD)', value: SUMMARY_METRICS.chargesFiledMTD.toLocaleString(), change: -5.2, color: '#8b5cf6' },
    { icon: Zap, label: 'AI Alerts Today', value: SUMMARY_METRICS.aiAlertsToday, change: 27.8, color: '#e879f9' },
    { icon: TrendingUp, label: 'Cases Solved', value: SUMMARY_METRICS.solvedCases.toLocaleString(), change: -2.1, color: '#10b981' },
    { icon: Activity, label: 'Clearance Rate', value: `${SUMMARY_METRICS.clearanceRate}%`, change: -1.4, color: '#0ea5e9' },
  ];

  const statusColor = (s: string) => {
    const map: Record<string, string> = { investigating: '#f59e0b', arrested: '#10b981', resolved: '#0ea5e9', monitoring: '#8b5cf6' };
    return map[s] || '#64748b';
  };

  const priorityBadge = (p: string) => {
    const map: Record<string, string> = { critical: 'badge-red', high: 'badge-amber', medium: 'badge-cyan', low: 'badge-green' };
    return map[p] || 'badge-cyan';
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Command Dashboard" subtitle="Karnataka State Police Intelligence Platform — Real-time Operations" />
      <div className="p-6 space-y-6">

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} style={{ animationDelay: `${i * 0.07}s` }}>
              <MetricCard {...m} />
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Crime Trend */}
          <div className="lg:col-span-2 glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>CRIME TREND ANALYSIS</h2>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Jan 2024 – Jun 2025 • Monthly Incidents</p>
              </div>
              <div className="badge badge-red">↑ 12.4% YoY</div>
            </div>
            {mounted && (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={MONTHLY_CRIME_TRENDS} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCrimes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCyber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="crimes" name="Total Crimes" stroke="#00f0ff" strokeWidth={2} fill="url(#gradCrimes)" />
                  <Area type="monotone" dataKey="cybercrime" name="Cybercrime" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gradCyber)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Crime Categories */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>CRIME CATEGORIES</h2>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Distribution 2025</p>
              </div>
            </div>
            {mounted && (
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={CRIME_CATEGORIES} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                    dataKey="count" stroke="none">
                    {CRIME_CATEGORIES.map((entry, index) => (
                      <Cell key={index} fill={entry.color} opacity={0.85} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="space-y-2 mt-2">
              {CRIME_CATEGORIES.slice(0, 5).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs" style={{ color: '#94a3b8' }}>{cat.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: cat.color }}>{cat.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Incidents */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>RECENT INCIDENTS</h2>
              <div className="status-live">
                <span className="status-dot" />
                LIVE
              </div>
            </div>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Type</th>
                  <th>District</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_INCIDENTS.map((incident) => (
                  <tr key={incident.id}>
                    <td className="font-mono text-xs" style={{ color: '#00f0ff' }}>{incident.id.slice(-6)}</td>
                    <td>{incident.type}</td>
                    <td style={{ color: '#64748b' }}>{incident.district}</td>
                    <td><span className={`badge ${priorityBadge(incident.priority)}`}>{incident.priority.toUpperCase()}</span></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(incident.status) }} />
                        <span className="text-xs capitalize" style={{ color: statusColor(incident.status) }}>{incident.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* District Risk Scores */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>DISTRICT RISK INDEX</h2>
              <span className="text-xs" style={{ color: '#475569' }}>AI Computed Score (0–100)</span>
            </div>
            <div className="space-y-3">
              {DISTRICT_RISK_SCORES.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="text-xs w-36 truncate" style={{ color: '#94a3b8' }}>{d.name}</div>
                  <div className="flex-1 risk-bar-track">
                    <div className="risk-bar-fill" style={{
                      width: `${d.score}%`,
                      background: d.score >= 85 ? 'linear-gradient(90deg, #ef444480, #ef4444)' :
                        d.score >= 70 ? 'linear-gradient(90deg, #f59e0b80, #f59e0b)' :
                          'linear-gradient(90deg, #10b98180, #10b981)'
                    }} />
                  </div>
                  <div className="text-xs font-bold w-6" style={{ color: d.score >= 85 ? '#ef4444' : d.score >= 70 ? '#f59e0b' : '#10b981' }}>{d.score}</div>
                  <div className="text-xs w-14 text-right" style={{ color: '#ef4444' }}>{d.predictedIncrease}</div>
                </div>
              ))}
            </div>

            {/* Category Bar Chart */}
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(0,240,255,0.08)' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: '#475569' }}>CRIME BY CATEGORY — 2025</div>
              {mounted && (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={CRIME_CATEGORIES.slice(0, 6)} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                      {CRIME_CATEGORIES.slice(0, 6).map((entry, index) => (
                        <Cell key={index} fill={entry.color} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
