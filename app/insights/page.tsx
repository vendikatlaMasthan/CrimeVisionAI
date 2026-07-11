'use client';

import { useState, useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Brain, ChevronDown, ChevronUp, Clock,
  MapPin, Network, TrendingUp, Activity,
  Calculator, Info, Layers,
} from 'lucide-react';
import { AI_ALERTS, AI_INSIGHTS_SUMMARY, KARNATAKA_DISTRICTS } from '@/lib/mockData';

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
  cyan:   { color: '#0F6B5C', bg: 'rgba(30, 58, 95,0.08)',   border: 'rgba(30, 58, 95,0.3)' },
  purple: { color: '#a78bfa', bg: 'rgba(139,92,246,0.1)',   border: 'rgba(139,92,246,0.3)' },
};

const radarData = [
  { dimension: 'Cybercrime',  score: 87 },
  { dimension: 'Violence',    score: 62 },
  { dimension: 'Narcotics',   score: 74 },
  { dimension: 'Organized',   score: 58 },
  { dimension: 'Financial',   score: 79 },
  { dimension: 'Sand Mining', score: 45 },
];

const patternCards = [
  { icon: Clock,      title: 'Peak Hours Pattern',    value: '10PM - 2AM',         desc: '48% of violent crimes cluster in late-night hours across all districts.',       color: '#ef4444' },
  { icon: MapPin,     title: 'Geographic Spread',     value: 'Urban to Semi-Urban', desc: 'Cybercrime expanding from metro zones to semi-urban districts at 34% p.a.',    color: '#0F6B5C' },
  { icon: Network,    title: 'Network Growth',        value: '14 Clusters (+3)',    desc: '14 active criminal clusters monitored. 3 new clusters identified this week.',   color: '#8b5cf6' },
  { icon: TrendingUp, title: 'Financial Indicators',  value: 'Rs 42 Cr Economy',   desc: 'Estimated Rs 42 Crore suspected criminal economy active across the state.',     color: '#f59e0b' },
  { icon: Layers,     title: 'Cross-District Links',  value: '8 Active Networks',   desc: '8 inter-district criminal networks operating across district boundaries.',       color: '#e879f9' },
  { icon: Activity,   title: 'Seasonal Prediction',   value: 'Oct-Dec Risk',        desc: 'Festival season risk window: Dasara-Diwali period projects +28% spike.',        color: '#f97316' },
];

// ─── AI EXPLAINABILITY: Weighted Scoring Model ─────────────────────────────────

const RISK_WEIGHTS = [
  { factor: 'Crime Rate (per 1000)',   weight: 0.30, description: 'Primary indicator of crime density relative to population.' },
  { factor: 'YoY Growth %',           weight: 0.25, description: 'Annual rate of change - rising trends compound risk significantly.' },
  { factor: 'Active Cases Ratio',      weight: 0.20, description: 'Ratio of unresolved cases to total crimes - indicates systemic backlog.' },
  { factor: 'Cybercrime Prevalence',   weight: 0.15, description: 'Cybercrime as % of total crimes - modern threat multiplier.' },
  { factor: 'Organized Crime Density', weight: 0.10, description: 'Organized crime clusters indicate coordinated criminal networks.' },
];

type DistrictType = typeof KARNATAKA_DISTRICTS[0];

function computeRiskScore(d: DistrictType): {
  total: number;
  breakdown: { factor: string; weight: number; rawScore: number; weightedScore: number }[];
} {
  const maxCrimeRate        = 50;
  const maxGrowth           = 15;
  const maxActiveCaseRatio  = 0.2;
  const maxCyberPct         = 0.4;
  const maxOrganizedDensity = 1200;

  const growthAbs       = Math.max(0, d.change);
  const activeCaseRatio = d.activeCases / d.crimeCount;
  const cyberPct        = d.cyberCrimes / d.crimeCount;

  const rawScores = [
    Math.min(100, (d.crimeRate / maxCrimeRate) * 100),
    Math.min(100, (growthAbs / maxGrowth) * 100),
    Math.min(100, (activeCaseRatio / maxActiveCaseRatio) * 100),
    Math.min(100, (cyberPct / maxCyberPct) * 100),
    Math.min(100, (d.organized / maxOrganizedDensity) * 100),
  ];

  const breakdown = RISK_WEIGHTS.map((rw, i) => ({
    factor:        rw.factor,
    weight:        rw.weight,
    rawScore:      Math.round(rawScores[i]),
    weightedScore: parseFloat((rawScores[i] * rw.weight).toFixed(1)),
  }));

  const total = Math.round(breakdown.reduce((s, b) => s + b.weightedScore, 0));
  return { total, breakdown };
}

type AlertType = {
  id: number | string;
  severity: string;
  title: string;
  confidence: number;
  timestamp: string;
  description: string;
  why?: string;
  affectedDistricts?: string[];
  evidence?: string;
  recommendation?: string;
  tags?: string[];
};

export default function InsightsPage() {
  const [expandedAlert, setExpandedAlert]     = useState<string | null>(null);
  const [xaiDistrict, setXaiDistrict]         = useState<DistrictType>(KARNATAKA_DISTRICTS[0]);
  const [showMethodology, setShowMethodology] = useState(false);

  const xaiResult = useMemo(() => computeRiskScore(xaiDistrict), [xaiDistrict]);

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
          <Brain size={22} style={{ color: '#0F6B5C' }} />
          AI INTELLIGENCE INSIGHTS
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 6 }}>
          Explainable AI — Pattern Analysis with Evidence, Confidence Metrics and Transparent Scoring Methodology
        </p>
      </div>

      {/* Insight Summary Cards */}
      {AI_INSIGHTS_SUMMARY && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
          {AI_INSIGHTS_SUMMARY.map((insight: { value: string; title: string; description: string; color: string }, idx: number) => {
            const colorKey = insight.color as keyof typeof INSIGHT_COLORS;
            const c = INSIGHT_COLORS[colorKey] || INSIGHT_COLORS.cyan;
            return (
              <div key={idx} className="glass-card" style={{ padding: 18, border: `1px solid ${c.border}`, background: c.bg }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: c.color, fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>{insight.value}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{insight.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{insight.description}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Two column layout: XAI Panel + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 28 }}>

        {/* AI EXPLAINABILITY PANEL */}
        <div className="glass-card" style={{ padding: 24, border: '1px solid rgba(30, 58, 95,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Calculator size={18} style={{ color: '#0F6B5C' }} />
                <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>AI EXPLAINABILITY PANEL</h2>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Transparent weighted scoring — see exactly HOW the risk score is computed</p>
            </div>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              style={{ fontSize: '12px', color: '#0F6B5C', background: 'rgba(30, 58, 95,0.08)', border: '1px solid rgba(30, 58, 95,0.25)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Info size={13} /> Methodology
            </button>
          </div>

          {/* District selector */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>SELECT DISTRICT TO ANALYZE:</label>
            <select
              value={xaiDistrict.id}
              onChange={e => {
                const found = KARNATAKA_DISTRICTS.find(d => d.id === parseInt(e.target.value));
                if (found) setXaiDistrict(found);
              }}
              style={{ background: 'var(--cyber-surface)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px', fontSize: '14px', width: '100%', cursor: 'pointer' }}
            >
              {KARNATAKA_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Risk Score Gauge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, padding: 16, background: 'var(--cyber-surface)', borderRadius: 10, border: '1px solid var(--cyber-border)' }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: `conic-gradient(${xaiResult.total > 70 ? '#ef4444' : xaiResult.total > 50 ? '#f59e0b' : '#10b981'} ${xaiResult.total * 3.6}deg, rgba(148,163,184,0.15) 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px',
              }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--cyber-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: xaiResult.total > 70 ? '#ef4444' : xaiResult.total > 50 ? '#f59e0b' : '#10b981', fontFamily: 'JetBrains Mono' }}>{xaiResult.total}</span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RISK SCORE</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{xaiDistrict.name}</div>
              <span className={`badge badge-${xaiDistrict.riskLevel === 'critical' ? 'red' : xaiDistrict.riskLevel === 'low' ? 'green' : 'amber'}`}>{xaiDistrict.riskLevel.toUpperCase()} RISK</span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.4 }}>
                Computed from {RISK_WEIGHTS.length} weighted factors using statistical scoring model.
              </p>
            </div>
          </div>

          {/* Weighted Factor Breakdown */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Factor Breakdown</div>
            {xaiResult.breakdown.map((b, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{b.factor}</span>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>raw: {b.rawScore}/100</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F6B5C', fontFamily: 'JetBrains Mono, monospace' }}>x{b.weight} = {b.weightedScore}</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: 'var(--cyber-surface)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.rawScore}%`, background: 'linear-gradient(90deg, #0F6B5C, #8b5cf6)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: 3 }}>{RISK_WEIGHTS[i].description}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ borderTop: '1px solid var(--cyber-border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Composite Risk Score:</span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: xaiResult.total > 70 ? '#ef4444' : xaiResult.total > 50 ? '#f59e0b' : '#10b981', fontFamily: 'JetBrains Mono, monospace' }}>{xaiResult.total} / 100</span>
          </div>

          {/* Methodology Modal */}
          {showMethodology && (
            <div style={{ marginTop: 16, padding: 16, background: 'rgba(148,163,184,0.06)', border: '1px solid var(--cyber-border)', borderRadius: 10 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F6B5C', marginBottom: 10 }}>Scoring Methodology</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px' }}>
                The risk score is computed using a <strong>weighted multi-factor linear model</strong> — no black box.
              </p>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#94a3b8', background: 'var(--cyber-surface)', padding: '10px 14px', borderRadius: 8, lineHeight: 1.7 }}>
                RiskScore = Sum(rawScore_i x weight_i)<br />
                rawScore_i = normalize(metric_i, max_i) x 100<br />
                Weights: CR=0.30, YoY=0.25, ACR=0.20, Cyber=0.15, OC=0.10
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '8px 0 0' }}>
                All thresholds calibrated against Karnataka State Police historical baselines (2018-2024).
              </p>
            </div>
          )}
        </div>

        {/* Radar Chart */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Layers size={16} style={{ color: '#8b5cf6' }} /> Threat Vector Analysis
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(148,163,184,0.15)" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: 'var(--text-muted)', fontSize: '12px' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-dim)', fontSize: '12px' }} />
              <Radar name="Threat Score" dataKey="score" stroke="#0F6B5C" fill="#0F6B5C" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12 }}>
            {radarData.map(r => (
              <div key={r.dimension} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{r.dimension}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 60, height: 4, borderRadius: 2, background: 'var(--cyber-surface)', overflow: 'hidden' }}>
                    <div style={{ width: `${r.score}%`, height: '100%', background: r.score > 75 ? '#ef4444' : r.score > 55 ? '#f59e0b' : '#10b981', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', minWidth: 26 }}>{r.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explainable AI Alerts */}
      {AI_ALERTS && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Explainable AI Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(AI_ALERTS as AlertType[]).map((alert) => {
              const color = SEVERITY_COLORS[alert.severity] || '#64748b';
              const alertKey = String(alert.id);
              const isExpanded = expandedAlert === alertKey;
              return (
                <div key={alertKey} className="glass-card" style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${color}` }}>
                  <div
                    onClick={() => setExpandedAlert(isExpanded ? null : alertKey)}
                    style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className={SEVERITY_BADGE[alert.severity] || 'badge'}>{alert.severity?.toUpperCase()}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '12px', color: '#10b981', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{alert.confidence}% confidence</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{alert.timestamp}</span>
                      {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--cyber-border)' }}>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '14px 0' }}>{alert.description}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        {alert.why && (
                          <div style={{ background: 'var(--cyber-surface)', borderRadius: 8, padding: 12, border: '1px solid var(--cyber-border)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: 6 }}>WHY THIS ALERT?</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{alert.why}</p>
                          </div>
                        )}
                        {alert.evidence && (
                          <div style={{ background: 'var(--cyber-surface)', borderRadius: 8, padding: 12, border: '1px solid var(--cyber-border)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F6B5C', marginBottom: 6 }}>EVIDENCE BASE</div>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{alert.evidence}</p>
                          </div>
                        )}
                      </div>
                      {alert.affectedDistricts && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>AFFECTED DISTRICTS:</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {alert.affectedDistricts.map((d: string) => (
                              <span key={d} className="badge">{d}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Confidence Bar */}
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>CONFIDENCE SCORE</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', fontFamily: 'JetBrains Mono' }}>{alert.confidence}%</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, background: 'var(--cyber-surface)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${alert.confidence}%`, background: 'linear-gradient(90deg, #10b981, #0F6B5C)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                      {alert.recommendation && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: 12 }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', marginBottom: 4 }}>RECOMMENDED ACTION</div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>{alert.recommendation}</p>
                        </div>
                      )}
                      {alert.tags && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                          {alert.tags.map((tag: string) => (
                            <span key={tag} style={{ fontSize: '12px', color: 'var(--text-dim)', background: 'var(--cyber-surface)', border: '1px solid var(--cyber-border)', borderRadius: 12, padding: '2px 8px' }}>#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pattern Matrix */}
      <div>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Intelligence Pattern Matrix</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          {patternCards.map((p, idx) => (
            <div key={idx} className="glass-card" style={{ padding: 20, borderLeft: `3px solid ${p.color}` }}>
              <p.icon size={20} style={{ color: p.color, marginBottom: 10 }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: p.color, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>{p.value}</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
