'use client';

import { useState } from 'react';
import Topbar from '@/components/Topbar';
import { AI_ALERTS, AI_INSIGHTS_SUMMARY, CRIME_CATEGORIES, MONTHLY_CRIME_TRENDS } from '@/lib/mockData';
import { Brain, AlertTriangle, TrendingUp, Shield, Zap, ChevronRight, Activity, Target, Clock, Cpu } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const SEVERITY_STYLES: Record<string, { color: string; bg: string; border: string; badge: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: '#ef4444', badge: 'badge-red' },
  high: { color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: '#f59e0b', badge: 'badge-amber' },
  medium: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.06)', border: '#8b5cf6', badge: 'badge-purple' },
  low: { color: '#10b981', bg: 'rgba(16,185,129,0.06)', border: '#10b981', badge: 'badge-green' },
};

const INSIGHT_COLORS: Record<string, string> = {
  red: '#ef4444', green: '#10b981', cyan: '#00f0ff', purple: '#8b5cf6',
};

const radarData = CRIME_CATEGORIES.slice(0, 6).map(c => ({
  category: c.name.split(' ')[0],
  count: Math.round(c.count / 100),
  trend: c.percentage * 2,
}));

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

function AlertCard({ alert }: { alert: typeof AI_ALERTS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const style = SEVERITY_STYLES[alert.severity];

  return (
    <div className="alert-card rounded-xl p-4 cursor-pointer transition-all"
      style={{ background: style.bg, borderColor: style.color, borderLeftColor: style.color }}
      onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `${style.color}15`, border: `1px solid ${style.color}30` }}>
          <AlertTriangle size={14} style={{ color: style.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`badge ${style.badge}`}>{alert.severity.toUpperCase()}</span>
            <span className="text-xs font-bold" style={{ color: '#e2e8f0' }}>{alert.title}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs" style={{ color: '#475569' }}>{alert.timestamp}</span>
            <span className="text-xs font-semibold" style={{ color: style.color }}>
              Confidence: {alert.confidence}%
            </span>
          </div>
        </div>
        <ChevronRight size={14} className={`flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} style={{ color: '#475569' }} />
      </div>

      {expanded && (
        <div className="mt-3 pl-11 animate-fadeInUp">
          <p className="text-sm mb-3" style={{ color: '#94a3b8' }}>{alert.description}</p>
          <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(15,23,42,0.5)', border: `1px solid ${style.color}20` }}>
            <div className="text-xs font-bold mb-1" style={{ color: style.color }}>AI RECOMMENDATION</div>
            <p className="text-xs" style={{ color: '#94a3b8' }}>{alert.recommendation}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {alert.tags.map(tag => (
              <span key={tag} className="badge badge-cyan" style={{ fontSize: '10px' }}>#{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all' ? AI_ALERTS : AI_ALERTS.filter(a => a.severity === activeFilter);

  return (
    <div className="min-h-screen">
      <Topbar title="AI Insights" subtitle="Pattern analysis, emerging threats, and intelligence summary" />
      <div className="p-6 space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_INSIGHTS_SUMMARY.map((item, i) => {
            const color = INSIGHT_COLORS[item.color];
            return (
              <div key={i} className="glass-card p-5 animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s`, borderColor: `${color}22` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#475569' }}>{item.title}</div>
                  <Cpu size={14} style={{ color }} />
                </div>
                <div className="text-2xl font-black mb-2" style={{ color }}>{item.value}</div>
                <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{item.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Alerts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: '#f59e0b' }} />
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>INTELLIGENCE ALERTS</h2>
                <div className="status-live ml-2">
                  <span className="status-dot" />
                  LIVE
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'critical', 'high', 'medium', 'low'].map(f => (
                  <button key={f} onClick={() => setActiveFilter(f)}
                    className="text-xs py-1 px-2.5 rounded-lg capitalize transition-all"
                    style={{
                      background: activeFilter === f ? 'rgba(0,240,255,0.1)' : 'transparent',
                      color: activeFilter === f ? '#00f0ff' : '#475569',
                      border: `1px solid ${activeFilter === f ? 'rgba(0,240,255,0.2)' : 'transparent'}`,
                    }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* Crime Pattern Radar */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} style={{ color: '#8b5cf6' }} />
                <h3 className="font-bold text-xs tracking-widest" style={{ color: '#e2e8f0' }}>CRIME PATTERN RADAR</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="Crime Count" dataKey="count" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.15} strokeWidth={1.5} />
                  <Radar name="Trend %" dataKey="trend" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={1.5} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Activity Monitor */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} style={{ color: '#10b981' }} />
                <h3 className="font-bold text-xs tracking-widest" style={{ color: '#e2e8f0' }}>AI SCAN ACTIVITY</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Pattern Detection', value: 91, color: '#10b981' },
                  { label: 'Network Mapping', value: 78, color: '#00f0ff' },
                  { label: 'Threat Assessment', value: 85, color: '#f59e0b' },
                  { label: 'Predictive Modeling', value: 72, color: '#8b5cf6' },
                  { label: 'Anomaly Detection', value: 94, color: '#ef4444' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: '#64748b' }}>{item.label}</span>
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
                    </div>
                    <div className="risk-bar-track">
                      <div className="risk-bar-fill" style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${item.color}60, ${item.color})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Threats */}
            <div className="glass-card p-4" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                <h3 className="font-bold text-xs tracking-widest" style={{ color: '#ef4444' }}>EMERGING THREATS</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { threat: 'AI-powered deepfake fraud', trend: '+240%', district: 'Bengaluru' },
                  { threat: 'Crypto-based money laundering', trend: '+180%', district: 'Statewide' },
                  { threat: 'Dark web drug marketplaces', trend: '+95%', district: 'Bengaluru, Mysuru' },
                  { threat: 'Remote-access cyberattacks', trend: '+67%', district: 'Urban Centers' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
                    <div className="w-1 h-full rounded-full flex-shrink-0 mt-1" style={{ background: '#ef4444', minHeight: 6 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold" style={{ color: '#94a3b8' }}>{t.threat}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{t.district}</div>
                    </div>
                    <div className="text-xs font-bold flex-shrink-0" style={{ color: '#ef4444' }}>{t.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
