'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import {
  TrendingUp, AlertTriangle, Brain, Target, Calendar,
  ChevronUp, ChevronDown, Minus, MapPin, Zap,
} from 'lucide-react';
import { RISK_FORECAST, DISTRICT_RISK_SCORES, MONTHLY_CRIME_TRENDS } from '@/lib/mockData';

// Merge historical + forecast data for the chart
const historicalData = MONTHLY_CRIME_TRENDS.map(d => ({
  month: d.month,
  actual: d.crimes,
  predicted: null as number | null,
  low: null as number | null,
  high: null as number | null,
  type: 'historical',
}));
const forecastData = RISK_FORECAST.map(d => ({
  month: d.month,
  actual: null as number | null,
  predicted: d.predicted,
  low: d.low,
  high: d.high,
  type: 'forecast',
}));
const combinedData = [...historicalData, ...forecastData];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <div style={{ color: '#00f0ff', fontWeight: 700, marginBottom: 6 }}>{label}</div>
        {payload.map((p: any, i: number) => p.value != null && (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>{p.name}:</span>
            <span style={{ color: p.color || '#f1f5f9', fontWeight: 700, fontSize: 13 }}>
              {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function getRiskColor(score: number): string {
  if (score >= 85) return '#ef4444';
  if (score >= 70) return '#f59e0b';
  if (score >= 55) return '#eab308';
  return '#00f0ff';
}

function getRiskBadgeClass(score: number): string {
  if (score >= 85) return 'badge badge-red';
  if (score >= 70) return 'badge badge-amber';
  if (score >= 55) return 'badge';
  return 'badge badge-cyan';
}

const topMetrics = [
  {
    label: 'Highest Risk District',
    value: 'Bengaluru Urban',
    sub: 'Risk Score: 94/100',
    color: '#ef4444',
    icon: MapPin,
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
  },
  {
    label: 'Predicted Peak',
    value: 'Dec 2025',
    sub: '13,600 projected crimes',
    color: '#f59e0b',
    icon: Calendar,
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    label: 'Model Accuracy',
    value: '91.2%',
    sub: 'Q1 2025 — Validated',
    color: '#10b981',
    icon: Target,
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
  },
  {
    label: 'Next 30-Day Risk',
    value: 'HIGH',
    sub: 'Jul 2025 — 10,800 predicted',
    color: '#f59e0b',
    icon: AlertTriangle,
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
  },
];

const aiInsights = [
  {
    icon: Calendar,
    color: '#ef4444',
    border: 'rgba(239,68,68,0.3)',
    bg: 'rgba(239,68,68,0.06)',
    title: 'Festival Season Alert: Oct–Dec 2025',
    desc: 'AI model projects a 28% crime spike during the Dasara-Diwali window (Oct–Dec 2025). Historical data from 2022–2024 confirms consistent festival-season surges in Mysuru, Bengaluru, and Belagavi districts.',
    badge: '+28% Spike',
    badgeClass: 'badge badge-red',
  },
  {
    icon: TrendingUp,
    color: '#00f0ff',
    border: 'rgba(0,240,255,0.3)',
    bg: 'rgba(0,240,255,0.05)',
    title: 'Cybercrime Trajectory',
    desc: 'AI projects a 34% annual increase in cybercrime if current trends continue unchecked. Bengaluru Urban remains the primary epicenter, with semi-urban districts seeing accelerating adoption.',
    badge: '+34% Annual',
    badgeClass: 'badge badge-cyan',
  },
  {
    icon: AlertTriangle,
    color: '#f59e0b',
    border: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.05)',
    title: 'Northern Districts Risk Corridor',
    desc: 'The Kalaburagi-Raichur corridor is showing accelerating crime rates, with 11.2% and 13.8% YoY increases respectively. Model identifies under-resourcing as the key risk amplifier in this region.',
    badge: 'CRITICAL CORRIDOR',
    badgeClass: 'badge badge-amber',
  },
];

export default function PredictionsPage() {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={22} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title">Risk Prediction Intelligence</h1>
            <p className="page-subtitle">AI-Powered Crime Forecasting — 2024–2025 Karnataka State Model</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={14} color="#8b5cf6" />
            <span style={{ color: '#8b5cf6', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>AI FORECAST ACTIVE</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: TOP METRICS */}
      <div className="responsive-grid-4" style={{ marginBottom: 28 }}>
        {topMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="glass-card" style={{
              padding: 20, background: m.bg, border: `1px solid ${m.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Icon size={15} color={m.color} />
                <span className="metric-label">{m.label}</span>
              </div>
              <div className="metric-value" style={{ color: m.color, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: FORECAST CHART */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-header-line" />
          <span className="section-title">Crime Volume Forecast — 2024–2025 with AI Prediction</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 3, background: '#00f0ff', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Historical</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 3, background: '#8b5cf6', borderRadius: 2, borderTop: '2px dashed #8b5cf6' }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Predicted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 8, background: 'rgba(139,92,246,0.2)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>Confidence Band</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={combinedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="predictGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} interval={1} angle={-30} textAnchor="end" height={50} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x="Jun 25"
              stroke="rgba(245,158,11,0.7)"
              strokeDasharray="6 3"
              label={{ value: 'FORECAST →', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10, fontWeight: 700 }}
            />
            <Area type="monotone" dataKey="high" stroke="none" fill="url(#bandGrad)" name="High Estimate" />
            <Area type="monotone" dataKey="low" stroke="none" fill="#020617" name="Low Estimate" />
            <Area
              type="monotone" dataKey="actual" stroke="#00f0ff" strokeWidth={2.5}
              fill="url(#actualGrad)" name="Actual Crimes" dot={false} activeDot={{ r: 5, fill: '#00f0ff' }}
            />
            <Area
              type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2.5}
              strokeDasharray="8 4" fill="url(#predictGrad)" name="Predicted Crimes"
              dot={false} activeDot={{ r: 5, fill: '#8b5cf6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* SECTION 3 + 4: DISTRICT RISK + CONFIDENCE TABLE */}
      <div className="responsive-grid-2-1" style={{ marginBottom: 24 }}>
        {/* DISTRICT RISK FORECAST */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header" style={{ marginBottom: 18 }}>
            <div className="section-header-line" />
            <span className="section-title">District Risk Forecast</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {DISTRICT_RISK_SCORES.map((d, i) => {
              const color = getRiskColor(d.score);
              const isPositive = d.predictedIncrease.startsWith('+');
              return (
                <div
                  key={d.name}
                  style={{ cursor: 'default' }}
                  onMouseEnter={() => setHoveredDistrict(d.name)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700, minWidth: 18 }}>#{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{d.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isPositive ? <ChevronUp size={13} color="#ef4444" /> : <ChevronDown size={13} color="#10b981" />}
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: isPositive ? '#f87171' : '#34d399',
                      }}>
                        {d.predictedIncrease}
                      </span>
                    </div>
                    <span className={getRiskBadgeClass(d.score)} style={
                      d.score >= 55 && d.score < 70
                        ? { background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.35)' }
                        : {}
                    }>
                      {d.score}
                    </span>
                  </div>
                  <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, height: '100%',
                      width: `${d.score}%`,
                      background: `linear-gradient(90deg, ${color}cc, ${color})`,
                      borderRadius: 4,
                      boxShadow: hoveredDistrict === d.name ? `0 0 10px ${color}88` : 'none',
                      transition: 'box-shadow 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MONTHLY CONFIDENCE TABLE */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header" style={{ marginBottom: 18 }}>
            <div className="section-header-line" />
            <span className="section-title">Monthly Confidence</span>
          </div>
          <table className="cyber-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ fontSize: 10 }}>Month</th>
                <th style={{ fontSize: 10 }}>Predicted</th>
                <th style={{ fontSize: 10 }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {RISK_FORECAST.map((r) => (
                <tr key={r.month}>
                  <td style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 12 }}>{r.month}</td>
                  <td>
                    <div style={{ color: '#8b5cf6', fontWeight: 700, fontSize: 12 }}>
                      {r.predicted.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>
                      {r.low.toLocaleString()}–{r.high.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${r.confidence}%`,
                          background: r.confidence >= 70 ? '#10b981' : r.confidence >= 60 ? '#f59e0b' : '#ef4444',
                        }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', minWidth: 28 }}>{r.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: AI PREDICTION INSIGHTS */}
      <div>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-header-line" />
          <span className="section-title">AI Prediction Insights</span>
        </div>
        <div className="responsive-grid-3">
          {aiInsights.map((ins) => {
            const Icon = ins.icon;
            return (
              <div
                key={ins.title}
                className="glass-card"
                style={{ padding: 20, background: ins.bg, border: `1px solid ${ins.border}` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: `${ins.color}18`, border: `1px solid ${ins.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={17} color={ins.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, lineHeight: 1.4 }}>
                      {ins.title}
                    </div>
                    <span className={ins.badgeClass}>{ins.badge}</span>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{ins.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
