'use client';

import { useState } from 'react';
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ReferenceLine,
} from 'recharts';
import { Clock, Calendar, Star, Monitor, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  HOURLY_CRIMES,
  DAILY_CRIMES,
  SEASONAL_CRIMES,
  TIMELINE_INSIGHTS,
} from '@/lib/mockData';

const TABS = ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Seasonal'] as const;
type Tab = typeof TABS[number];

// Static weekly data (52 weeks)
const WEEKLY_DATA = Array.from({ length: 52 }, (_, i) => ({
  week: `W${i + 1}`,
  crimes: Math.floor(6800 + Math.sin(i * 0.3) * 1200 + Math.random() * 600 + i * 55),
}));

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  'Peak Crime Hours': <Clock size={20} />,
  'Weekend Spike': <Calendar size={20} />,
  'Festival Impact': <Star size={20} />,
  'Cyber Crime Peak': <Monitor size={20} />,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(10,22,40,0.98)',
        border: '1px solid rgba(0,240,255,0.25)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
        color: '#f1f5f9',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4, color: '#00f0ff' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color || '#f1f5f9' }}>
            {p.name}: <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

function HourlyBar() {
  // Hours 22,23,0,1,2 are "danger zone"
  const dangerHours = new Set(['10 PM', '11 PM', '12 AM', '1 AM', '2 AM']);
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
      }}>
        <span style={{
          background: 'rgba(239,68,68,0.15)', color: '#f87171',
          border: '1px solid rgba(239,68,68,0.35)', borderRadius: 6,
          padding: '3px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
        }}>⚠ DANGER ZONE: 10 PM – 2 AM</span>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>48% of violent crimes occur in this window</span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={HOURLY_CRIMES} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={1} angle={-45} textAnchor="end" height={55} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="crimes" name="Crimes" radius={[4, 4, 0, 0]}>
            {HOURLY_CRIMES.map((entry) => (
              <rect key={entry.hour} fill={dangerHours.has(entry.hour) ? '#ef4444' : '#00f0ff'} fillOpacity={dangerHours.has(entry.hour) ? 0.85 : 0.6} />
            ))}
          </Bar>
          <ReferenceLine x="10 PM" stroke="rgba(239,68,68,0.7)" strokeDasharray="4 2" label={{ value: '10 PM', fill: '#ef4444', fontSize: 10 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HourlyBarProper() {
  // We render with two data sets: danger and safe
  const data = HOURLY_CRIMES.map(d => {
    const isDanger = ['10 PM', '11 PM', '12 AM', '1 AM', '2 AM'].includes(d.hour);
    return { ...d, dangerCrimes: isDanger ? d.crimes : 0, safeCrimes: isDanger ? 0 : d.crimes };
  });
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span className="badge badge-red">⚠ DANGER ZONE: 10 PM – 2 AM</span>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>48% of violent crimes occur in this window</span>
        <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: '#00f0ff', opacity: 0.7 }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>Normal</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: '#ef4444' }} />
            <span style={{ color: '#94a3b8', fontSize: 12 }}>Danger Zone</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 50 }} stackOffset="none">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={55} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="safeCrimes" name="Crimes" fill="#00f0ff" fillOpacity={0.6} radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="dangerCrimes" name="Danger Zone" fill="#ef4444" fillOpacity={0.85} radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DailyChart() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span className="badge badge-amber">📅 WEEKEND SPIKE: +34% vs Weekdays</span>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>Saturday & Sunday show highest crime volumes</span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={DAILY_CRIMES} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Bar dataKey="cybercrime" name="Cybercrime" fill="#00f0ff" fillOpacity={0.7} stackId="a" />
          <Bar dataKey="theft" name="Theft" fill="#8b5cf6" fillOpacity={0.7} stackId="a" />
          <Bar dataKey="violence" name="Violence" fill="#ef4444" fillOpacity={0.7} stackId="a" />
          <Bar dataKey="narcotics" name="Narcotics" fill="#e879f9" fillOpacity={0.7} stackId="a" />
          <Bar dataKey="fraud" name="Fraud" fill="#f59e0b" fillOpacity={0.7} stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WeeklyChart() {
  const display = WEEKLY_DATA.filter((_, i) => i % 4 === 0 || i === 51);
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <span className="badge badge-cyan">52-Week Crime Trend — 2024–2025</span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={WEEKLY_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={3} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="crimes" name="Crimes" stroke="#00f0ff" strokeWidth={2} dot={false} />
          <ReferenceLine y={8000} stroke="rgba(245,158,11,0.5)" strokeDasharray="4 2" label={{ value: 'State Avg', fill: '#f59e0b', fontSize: 10 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function MonthlyChart() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span className="badge badge-purple">🎭 FESTIVAL SPIKE MONTHS MARKED</span>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>Oct (Dasara-Diwali) & Dec (New Year) are peak months</span>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={SEASONAL_CRIMES} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="season" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="crimes" name="Monthly Crimes" stroke="#8b5cf6" fill="url(#areaGrad)" strokeWidth={2} />
          {SEASONAL_CRIMES.filter(m => m.spike).map(m => (
            <ReferenceLine key={m.season} x={m.season} stroke="rgba(239,68,68,0.6)" strokeDasharray="3 2" label={{ value: '🎉', fill: '#ef4444', fontSize: 14 }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {SEASONAL_CRIMES.filter(m => m.spike).map(m => (
          <span key={m.season} style={{
            background: 'rgba(239,68,68,0.1)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
            padding: '2px 8px', fontSize: 11, fontWeight: 600,
          }}>{m.season}: {m.festivals}</span>
        ))}
      </div>
    </div>
  );
}

function SeasonalGrid() {
  const maxCrimes = Math.max(...SEASONAL_CRIMES.map(m => m.crimes));
  const getColor = (crimes: number, spike: boolean) => {
    const intensity = crimes / maxCrimes;
    if (spike && intensity > 0.8) return { bg: 'rgba(239,68,68,0.55)', text: '#fff' };
    if (spike) return { bg: 'rgba(239,68,68,0.35)', text: '#fca5a5' };
    if (intensity > 0.7) return { bg: 'rgba(245,158,11,0.35)', text: '#fbbf24' };
    if (intensity > 0.5) return { bg: 'rgba(0,240,255,0.15)', text: '#00f0ff' };
    return { bg: 'rgba(16,185,129,0.15)', text: '#34d399' };
  };
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="badge badge-purple">12-Month Crime Intensity Map</span>
        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94a3b8', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(16,185,129,0.4)', display: 'inline-block' }} /> Low
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(0,240,255,0.4)', display: 'inline-block' }} /> Medium
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(245,158,11,0.4)', display: 'inline-block' }} /> High
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239,68,68,0.6)', display: 'inline-block' }} /> Festival Spike
          </span>
        </div>
      </div>
      <div className="responsive-grid-6">
        {SEASONAL_CRIMES.map(m => {
          const { bg, text } = getColor(m.crimes, m.spike);
          return (
            <div key={m.season} style={{
              background: bg,
              border: `1px solid ${m.spike ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 12,
              padding: '18px 12px',
              textAlign: 'center',
              position: 'relative',
              transition: 'all 0.2s',
            }}>
              {m.spike && (
                <div style={{
                  position: 'absolute', top: -8, right: -6,
                  background: '#ef4444', borderRadius: '50%',
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#fff', fontWeight: 700,
                }}>🎉</div>
              )}
              <div style={{ fontSize: 18, fontWeight: 800, color: text, lineHeight: 1 }}>{m.season}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginTop: 6 }}>{m.crimes.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>crimes</div>
              {m.spike && (
                <div style={{ fontSize: 9, color: '#fca5a5', marginTop: 6, fontWeight: 600, lineHeight: 1.3 }}>
                  {m.festivals}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeatmapGrid() {
  const hours = HOURLY_CRIMES;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Simulated day-hour grid
  const dayMultipliers = [1.0, 0.95, 1.05, 0.97, 1.18, 1.48, 1.57];
  const maxVal = Math.max(...hours.map(h => h.crimes)) * 1.57;

  const getHeatColor = (val: number) => {
    const ratio = val / maxVal;
    if (ratio > 0.75) return { bg: 'rgba(239,68,68,0.85)', text: '#fff' };
    if (ratio > 0.5) return { bg: 'rgba(245,158,11,0.65)', text: '#fff' };
    if (ratio > 0.3) return { bg: 'rgba(0,240,255,0.35)', text: '#e2e8f0' };
    if (ratio > 0.15) return { bg: 'rgba(0,240,255,0.15)', text: '#94a3b8' };
    return { bg: 'rgba(255,255,255,0.04)', text: '#64748b' };
  };

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ width: 40, color: '#94a3b8', fontSize: 10, padding: '4px 6px', textAlign: 'left' }}>Day</th>
              {hours.map(h => (
                <th key={h.hour} style={{ fontSize: 8, color: '#64748b', padding: '4px 2px', fontWeight: 600, textAlign: 'center', minWidth: 36 }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, di) => (
              <tr key={day}>
                <td style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, padding: '3px 6px' }}>{day}</td>
                {hours.map((h) => {
                  const val = Math.round(h.crimes * dayMultipliers[di] * (0.9 + Math.random() * 0.2));
                  const { bg, text } = getHeatColor(val);
                  return (
                    <td key={h.hour} style={{
                      background: bg,
                      color: text,
                      fontSize: 9,
                      textAlign: 'center',
                      padding: '6px 2px',
                      borderRadius: 4,
                      fontWeight: 600,
                      margin: 1,
                      border: '1px solid rgba(0,0,0,0.2)',
                    }}>
                      {val > 500 ? val : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 11, color: '#94a3b8', flexWrap: 'wrap' }}>
        {[
          { label: 'Very Low (<15%)', bg: 'rgba(255,255,255,0.04)' },
          { label: 'Low (15–30%)', bg: 'rgba(0,240,255,0.15)' },
          { label: 'Medium (30–50%)', bg: 'rgba(0,240,255,0.35)' },
          { label: 'High (50–75%)', bg: 'rgba(245,158,11,0.65)' },
          { label: 'Critical (>75%)', bg: 'rgba(239,68,68,0.85)' },
        ].map(({ label, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, borderRadius: 2, background: bg, display: 'inline-block' }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Hourly');

  const weekdayAvg = Math.round(
    DAILY_CRIMES.filter(d => !['Saturday', 'Sunday'].includes(d.day))
      .reduce((s, d) => s + d.crimes, 0) / 5
  );
  const weekendAvg = Math.round(
    DAILY_CRIMES.filter(d => ['Saturday', 'Sunday'].includes(d.day))
      .reduce((s, d) => s + d.crimes, 0) / 2
  );

  const compData = [
    { label: 'Weekdays (Avg)', crimes: weekdayAvg, fill: '#00f0ff' },
    { label: 'Weekends (Avg)', crimes: weekendAvg, fill: '#ef4444' },
  ];

  const yoyData = [
    { period: 'Q1', y2024: 15899, y2025: 25577 },
    { period: 'Q2', y2024: 18470, y2025: 29692 },
    { period: 'Q3', y2024: 22368, y2025: 27121 },
    { period: 'Q4 (proj)', y2024: 25325, y2025: 30200 },
  ];

  return (
    <div className="page-content" style={{ padding: 28 }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(0,240,255,0.1)',
            border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock size={24} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title">Crime Timeline Intelligence</h1>
            <p className="page-subtitle">Temporal crime pattern analysis across Karnataka — hourly to seasonal</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="status-dot" />
          <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>LIVE DATA</span>
        </div>
      </div>

      {/* TAB SWITCHER */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        background: 'rgba(10,22,40,0.6)', borderRadius: 12,
        padding: 6, border: '1px solid rgba(0,240,255,0.1)',
        width: 'fit-content',
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
              transition: 'all 0.2s',
              background: activeTab === tab ? 'rgba(0,240,255,0.12)' : 'transparent',
              color: activeTab === tab ? '#00f0ff' : '#94a3b8',
              borderBottom: activeTab === tab ? '2px solid #00f0ff' : '2px solid transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* INSIGHT CARDS ROW */}
      <div className="responsive-grid-4" style={{ marginBottom: 24 }}>
        {TIMELINE_INSIGHTS.map(insight => (
          <div key={insight.title} className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `${insight.color}18`,
                border: `1px solid ${insight.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: insight.color,
              }}>
                {INSIGHT_ICONS[insight.title]}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {insight.title}
              </span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: insight.color, marginBottom: 6 }}>
              {insight.value}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{insight.description}</div>
          </div>
        ))}
      </div>

      {/* MAIN CHART */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 3, height: 22, background: '#00f0ff', borderRadius: 2 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>
            {activeTab} Crime Analysis
          </h2>
        </div>
        {activeTab === 'Hourly' && <HourlyBarProper />}
        {activeTab === 'Daily' && <DailyChart />}
        {activeTab === 'Weekly' && <WeeklyChart />}
        {activeTab === 'Monthly' && <MonthlyChart />}
        {activeTab === 'Seasonal' && <SeasonalGrid />}
      </div>

      {/* PEAK HOURS HEATMAP */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 3, height: 22, background: '#ef4444', borderRadius: 2 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Crime Activity Heatmap — Day × Hour</h2>
          <span className="badge badge-red" style={{ marginLeft: 'auto' }}>INTERACTIVE</span>
        </div>
        <HeatmapGrid />
      </div>

      {/* COMPARATIVE ANALYSIS */}
      <div className="responsive-grid-2">
        {/* Weekday vs Weekend */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 3, height: 22, background: '#f59e0b', borderRadius: 2 }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Weekday vs Weekend</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center', background: 'rgba(0,240,255,0.06)' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00f0ff' }}>{weekdayAvg.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Weekday</div>
            </div>
            <div className="glass-card" style={{ flex: 1, padding: '16px', textAlign: 'center', background: 'rgba(239,68,68,0.06)' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>{weekendAvg.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Weekend</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fbbf24',
          }}>
            📈 Weekend crimes are <strong>{Math.round(((weekendAvg - weekdayAvg) / weekdayAvg) * 100)}% higher</strong> than weekday average
          </div>
          <ResponsiveContainer width="100%" height={160} style={{ marginTop: 16 }}>
            <BarChart data={DAILY_CRIMES} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="crimes" name="Total Crimes" radius={[4, 4, 0, 0]}>
                {DAILY_CRIMES.map((entry) => (
                  <rect
                    key={entry.day}
                    fill={['Saturday', 'Sunday'].includes(entry.day) ? '#ef4444' : '#00f0ff'}
                    fillOpacity={['Saturday', 'Sunday'].includes(entry.day) ? 0.8 : 0.6}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Year over Year */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 3, height: 22, background: '#8b5cf6', borderRadius: 2 }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Year-over-Year Comparison</h2>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              {[{ label: '2024', color: '#94a3b8' }, { label: '2025', color: '#00f0ff' }].map(({ label, color }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={yoyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 11 }} />
              <Bar dataKey="y2024" name="2024" fill="#64748b" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
              <Bar dataKey="y2025" name="2025" fill="#00f0ff" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171', marginTop: 12,
          }}>
            ⚠ 2025 YTD shows <strong>+22.4% increase</strong> over same period in 2024
          </div>
        </div>
      </div>
    </div>
  );
}
