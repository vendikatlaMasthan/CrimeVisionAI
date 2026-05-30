'use client';

import { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Brain, ChevronDown, ChevronUp, Shield, AlertTriangle, Clock,
  MapPin, FileText, Zap, Activity, Network, TrendingUp, Eye, Target,
} from 'lucide-react';
import { AI_ALERTS, AI_INSIGHTS_SUMMARY, CRIME_CATEGORIES } from '@/lib/mockData';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#64748b',
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'badge badge-red',
  high: 'badge badge-amber',
  medium: 'badge',
  low: 'badge badge-gray',
};

const INSIGHT_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  red:    { color: '#f87171', bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.3)' },
  green:  { color: '#34d399', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.3)' },
  cyan:   { color: '#00f0ff', bg: 'rgba(0,240,255,0.08)',   border: 'rgba(0,240,255,0.3)' },
  purple: { color: '#a78bfa', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.3)' },
};

const radarData = [
  { dimension: 'Cybercrime',    score: 87 },
  { dimension: 'Violence',      score: 62 },
  { dimension: 'Narcotics',     score: 74 },
  { dimension: 'Organized',     score: 58 },
  { dimension: 'Financial',     score: 79 },
  { dimension: 'Sand Mining',   score: 45 },
];

const patternCards = [
  { icon: Clock,    title: 'Peak Hours Pattern',     value: '10PM – 2AM',              desc: '48% of violent crimes cluster in late-night hours across all districts.', color: '#ef4444' },
  { icon: MapPin,   title: 'Geographic Spread',      value: 'Urban → Semi-Urban',       desc: 'Cybercrime expanding from metro zones to semi-urban districts at 34% p.a.', color: '#00f0ff' },
  { icon: Network,  title: 'Network Growth',         value: '14 Clusters (+3)',         desc: '14 active criminal clusters monitored — 3 new clusters identified this week.', color: '#8b5cf6' },
  { icon: TrendingUp, title: 'Financial Indicators', value: '₹42 Cr Economy',          desc: 'Estimated ₹42 Crore suspected criminal economy active across the state.', color: '#f59e0b' },
  { icon: Shield,   title: 'Cross-District Links',   value: '8 Active Networks',        desc: '8 inter-district criminal networks operating across district boundaries.', color: '#e879f9' },
  { icon: Activity, title: 'Seasonal Prediction',   value: 'Oct–Dec Elevated Risk',    desc: 'Festival season risk window: Dasara-Diwali period projects +28% spike.', color: '#f97316' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <div style={{ color: '#00f0ff', fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: '#cbd5e1', fontSize: 13 }}>
            {p.name}: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  const [expandedAlerts, setExpandedAlerts] = useState<Record<number, boolean>>({
    1: true,
  });

  const toggleAlert = (id: number) => {
    setExpandedAlerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
            <Brain size={22} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title">AI Intelligence Insights</h1>
            <p className="page-subtitle">Explainable AI — Pattern Analysis with Evidence &amp; Confidence Metrics</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot" />
            <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>LIVE INTELLIGENCE</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: INSIGHT SUMMARY CARDS */}
      <div className="responsive-grid-4" style={{ marginBottom: 28 }}>
        {AI_INSIGHTS_SUMMARY.map((item) => {
          const palette = INSIGHT_COLORS[item.color] || INSIGHT_COLORS.cyan;
          return (
            <div
              key={item.title}
              className="glass-card"
              style={{ padding: 20, border: `1px solid ${palette.border}`, background: palette.bg }}
            >
              <div className="metric-label" style={{ marginBottom: 8 }}>{item.title}</div>
              <div className="metric-value" style={{ color: palette.color, marginBottom: 8 }}>{item.value}</div>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{item.description}</p>
            </div>
          );
        })}
      </div>

      {/* SECTION 2 + 3: XAI ALERTS + RADAR CHART */}
      <div className="responsive-grid-1-340" style={{ marginBottom: 28 }}>
        {/* LEFT: EXPLAINABLE AI ALERTS */}
        <div>
          <div className="section-header">
            <div className="section-header-line" />
            <span className="section-title">Explainable AI Alerts</span>
            <span className="badge badge-red" style={{ marginLeft: 4 }}>{AI_ALERTS.length} Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AI_ALERTS.map((alert) => {
              const isExpanded = expandedAlerts[alert.id] ?? false;
              const borderColor = SEVERITY_COLORS[alert.severity] ?? '#64748b';

              return (
                <div
                  key={alert.id}
                  className={alert.severity === 'critical' ? 'xai-card animate-alert-flash' : 'xai-card'}
                  style={{
                    borderLeftColor: borderColor,
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleAlert(alert.id)}
                >
                  {/* TOP ROW */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <span className={SEVERITY_BADGE[alert.severity]} style={
                      alert.severity === 'medium'
                        ? { background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.35)' }
                        : {}
                    }>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span style={{
                      flex: 1,
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#f1f5f9',
                      lineHeight: 1.4,
                    }}>
                      {alert.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span className="badge badge-cyan" style={{ fontSize: 10 }}>
                        {alert.confidence}% confident
                      </span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{alert.timestamp}</span>
                      <div style={{ color: '#64748b' }}>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 8 }}>
                    {alert.description}
                  </p>

                  {/* TAGS */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: isExpanded ? 12 : 0 }}>
                    {alert.tags.map(tag => (
                      <span key={tag} className="badge badge-gray" style={{ fontSize: 10 }}>{tag}</span>
                    ))}
                  </div>

                  {/* XAI DETAILS (expandable) */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 12,
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: 10,
                        padding: '14px 16px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Eye size={12} color="#00f0ff" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#00f0ff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          Why This Alert — XAI Explanation
                        </span>
                      </div>

                      <div className="xai-section">
                        <span className="xai-label">WHY:</span>
                        <span className="xai-value">{alert.why}</span>
                      </div>

                      <div className="xai-section">
                        <span className="xai-label">DISTRICTS:</span>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {alert.affectedDistricts.map(d => (
                            <span key={d} className="badge badge-purple" style={{ fontSize: 10 }}>{d}</span>
                          ))}
                        </div>
                      </div>

                      <div className="xai-section">
                        <span className="xai-label">EVIDENCE:</span>
                        <span className="xai-value">{alert.evidence}</span>
                      </div>

                      <div className="xai-section">
                        <span className="xai-label">CONFIDENCE:</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="confidence-track">
                            <div
                              className="confidence-fill"
                              style={{
                                width: `${alert.confidence}%`,
                                background: `linear-gradient(90deg, ${borderColor}, ${borderColor}88)`,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: borderColor, minWidth: 36 }}>
                            {alert.confidence}%
                          </span>
                        </div>
                      </div>

                      <div className="xai-section">
                        <span className="xai-label">ACTION:</span>
                        <span className="xai-value" style={{ color: '#34d399', fontWeight: 600 }}>
                          {alert.recommendation}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: RADAR + CRIME BARS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* RADAR CHART */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-header" style={{ marginBottom: 16 }}>
              <Target size={16} color="#00f0ff" />
              <span className="section-title">Threat Vector Analysis</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(0,240,255,0.1)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} tickCount={4} />
                <Radar
                  name="Threat Score"
                  dataKey="score"
                  stroke="#00f0ff"
                  fill="rgba(0,240,255,0.15)"
                  fillOpacity={0.8}
                  strokeWidth={2}
                  dot={{ fill: '#00f0ff', r: 4 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* CRIME CATEGORY BARS */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div className="section-header" style={{ marginBottom: 16 }}>
              <Activity size={16} color="#8b5cf6" />
              <span className="section-title">Category Volume</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={CRIME_CATEGORIES.slice(0, 6)}
                margin={{ top: 4, right: 8, left: -20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 9 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Cases" radius={[4, 4, 0, 0]}
                  fill="#8b5cf6" opacity={0.85}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 4: PATTERN MATRIX */}
      <div>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-header-line" />
          <span className="section-title">AI Pattern Matrix</span>
          <span className="badge badge-cyan" style={{ marginLeft: 4 }}>6 Patterns Identified</span>
        </div>
        <div className="responsive-grid-3">
          {patternCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="glass-card"
                style={{
                  padding: 20,
                  borderLeft: `3px solid ${card.color}`,
                  borderRadius: '0 14px 14px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: `${card.color}18`,
                    border: `1px solid ${card.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color={card.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: card.color, letterSpacing: '-0.02em', marginTop: 1 }}>
                      {card.value}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55 }}>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
