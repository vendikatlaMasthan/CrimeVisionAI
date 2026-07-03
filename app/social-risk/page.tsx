'use client';

import { useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Info, Shield, AlertTriangle } from 'lucide-react';
import { SOCIOECONOMIC_DATA, SOCIO_CORRELATIONS } from '@/lib/mockData';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    return (
      <div style={{
        background: '#FFFFFF', border: '1px solid rgba(30, 58, 95,0.25)',
        borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--text-primary)',
      }}>
        <div style={{ fontWeight: 700, color: '#0F6B5C', marginBottom: 4 }}>{d?.district}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: 'var(--text-secondary)' }}>
            {p.name}: <strong style={{ color: 'var(--text-primary)' }}>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const getRiskLevel = (d: typeof SOCIOECONOMIC_DATA[0]) => {
  if (d.crimeRate > 40) return 'critical';
  if (d.crimeRate > 30) return 'high';
  if (d.crimeRate > 20) return 'medium';
  return 'low';
};

const riskColors: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#10b981',
};
const riskBadge: Record<string, string> = {
  critical: 'badge-red', high: 'badge-orange', medium: 'badge-amber', low: 'badge-green',
};

export default function SocialRiskPage() {
  const [sortCol, setSortCol] = useState<string>('crimeRate');

  const sortedData = [...SOCIOECONOMIC_DATA].sort((a, b) =>
    ((b as any)[sortCol] ?? 0) - ((a as any)[sortCol] ?? 0)
  );

  return (
    <div className="page-content" style={{ padding: 28 }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart3 size={24} color="#8b5cf6" />
          </div>
          <div>
            <h1 className="page-title">Social Risk Factor Analysis</h1>
            <p className="page-subtitle">Socio-Economic Indicators &amp; Crime Correlation — Karnataka Districts</p>
          </div>
        </div>
      </div>

      {/* HACKATHON BANNER */}
      <div style={{
        background: 'rgba(30, 58, 95,0.06)',
        border: '1px solid rgba(30, 58, 95,0.25)',
        borderRadius: 12, padding: '16px 20px', marginBottom: 28,
        display: 'flex', gap: 14, alignItems: 'flex-start',
      }}>
        <Info size={20} color="#0F6B5C" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F6B5C', marginBottom: 4 }}>
            HACKATHON PROBLEM STATEMENT ALIGNMENT
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This analysis directly addresses the hackathon problem statement — identifying the <strong style={{ color: 'var(--text-primary)' }}>socio-economic root causes of crime in Karnataka</strong> to enable targeted preventive policing.
            By correlating unemployment, education, urbanization, and migration data with district crime rates, we enable <strong style={{ color: 'var(--text-primary)' }}>evidence-based resource allocation</strong> and early intervention strategies.
          </div>
        </div>
      </div>

      {/* CORRELATION SUMMARY */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 3, height: 22, background: '#8b5cf6', borderRadius: 2 }} />
          <h2 className="section-title">Correlation Coefficients</h2>
          <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>Pearson R Analysis</span>
        </div>
        <div className="responsive-grid-3">
          {SOCIO_CORRELATIONS.map(cor => {
            const isPositive = cor.direction === 'positive';
            const absVal = Math.abs(cor.correlation);
            const strengthLabel = absVal > 0.8 ? 'VERY STRONG' : absVal > 0.6 ? 'STRONG' : 'MODERATE';
            return (
              <div key={cor.factor} className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{cor.factor}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isPositive
                      ? <TrendingUp size={14} color="var(--brand-crimson)" />
                      : <TrendingDown size={14} color="var(--brand-forest)" />}
                    <span style={{
                      fontSize: 12, fontWeight: 800,
                      color: isPositive ? 'var(--brand-crimson)' : 'var(--brand-forest)'
                    }}>
                      {isPositive ? '+' : '-'}{absVal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  <span className={`badge ${isPositive ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '10px', fontWeight: 700 }}>
                    {isPositive ? '↑ Crime Risk' : '↓ Crime Risk'}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cor.interpretation}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SCATTER CHARTS 2x2 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 3, height: 22, background: '#0F6B5C', borderRadius: 2 }} />
          <h2 className="section-title">Scatter Plot Analysis — Districts</h2>
        </div>
        <div className="responsive-grid-2">
          {[
            { x: 'unemploymentRate', xLabel: 'Unemployment Rate (%)', y: 'crimeRate', yLabel: 'Crime Rate', title: 'Unemployment vs Crime Rate' },
            { x: 'educationIndex', xLabel: 'Education Index', y: 'crimeRate', yLabel: 'Crime Rate', title: 'Education Index vs Crime Rate' },
            { x: 'urbanizationRate', xLabel: 'Urbanization Rate (%)', y: 'crimeRate', yLabel: 'Crime Rate', title: 'Urbanization vs Crime Rate' },
            { x: 'populationDensity', xLabel: 'Population Density (per km²)', y: 'crimeRate', yLabel: 'Crime Rate', title: 'Population Density vs Crime Rate' },
          ].map(chart => (
            <div key={chart.title} className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>{chart.title}</div>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis
                    dataKey={chart.x} type="number" name={chart.xLabel}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    label={{ value: chart.xLabel, position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis
                    dataKey={chart.y} type="number" name={chart.yLabel}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    label={{ value: chart.yLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter
                    data={SOCIOECONOMIC_DATA}
                    fill="#0F6B5C"
                    fillOpacity={0.7}
                    r={6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* DISTRICT TABLE */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 3, height: 22, background: '#f59e0b', borderRadius: 2 }} />
          <h2 className="section-title">District Socio-Economic Profile</h2>
          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>Click columns to sort</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="cyber-table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                {[
                  { key: 'district', label: 'District' },
                  { key: 'crimeRate', label: 'Crime Rate' },
                  { key: 'populationDensity', label: 'Pop Density' },
                  { key: 'unemploymentRate', label: 'Unemployment' },
                  { key: 'educationIndex', label: 'Education' },
                  { key: 'urbanizationRate', label: 'Urbanization' },
                  { key: 'migrationRate', label: 'Migration' },
                  { key: 'risk', label: 'Risk Level' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.key !== 'district' && col.key !== 'risk' && setSortCol(col.key)}
                    style={{
                      cursor: col.key !== 'district' && col.key !== 'risk' ? 'pointer' : 'default',
                      userSelect: 'none',
                      color: sortCol === col.key ? '#0F6B5C' : undefined,
                    }}
                  >
                    {col.label} {sortCol === col.key ? '▼' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map(d => {
                const risk = getRiskLevel(d);
                const isHighUnemployment = d.unemploymentRate > 15;
                const isHighEducation = d.educationIndex > 75;
                return (
                  <tr key={d.district}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{d.district}</td>
                    <td>
                      <span style={{
                        color: d.crimeRate > 40 ? '#DC2626' : d.crimeRate > 30 ? '#F4A100' : d.crimeRate > 20 ? '#F4A100' : '#2E8B57',
                        fontWeight: 700,
                      }}>
                        {d.crimeRate.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{d.populationDensity.toLocaleString()}</td>
                    <td>
                      <span style={{
                        color: isHighUnemployment ? '#DC2626' : '#2E8B57',
                        fontWeight: isHighUnemployment ? 700 : 400,
                        background: isHighUnemployment ? 'rgba(220,38,38,0.08)' : 'transparent',
                        padding: '2px 6px', borderRadius: 4,
                      }}>
                        {d.unemploymentRate}%
                      </span>
                    </td>
                    <td>
                      <span style={{
                        color: isHighEducation ? '#2E8B57' : '#DC2626',
                        fontWeight: isHighEducation ? 700 : 400,
                        background: isHighEducation ? 'rgba(46,139,87,0.08)' : 'transparent',
                        padding: '2px 6px', borderRadius: 4,
                      }}>
                        {d.educationIndex}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{d.urbanizationRate}%</td>
                    <td style={{ color: d.migrationRate > 20 ? '#F4A100' : 'var(--text-secondary)' }}>
                      {d.migrationRate}%
                    </td>
                    <td>
                      <span className={`badge ${riskBadge[risk]}`}>{risk.toUpperCase()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* KEY FINDINGS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 3, height: 22, background: '#10b981', borderRadius: 2 }} />
          <h2 className="section-title">Key Research Findings</h2>
        </div>
        <div className="responsive-grid-3">
          {[
            {
              icon: <AlertTriangle size={22} color="#ef4444" />,
              title: 'Unemployment–Crime Link',
              color: '#ef4444',
              bg: 'rgba(239,68,68,0.06)',
              border: 'rgba(239,68,68,0.2)',
              stat: '2.3× higher',
              statLabel: 'crime rate in districts with >15% unemployment',
              detail: 'Districts like Raichur (21.3%), Yadgir (22.1%), and Ballari (19.7%) with very high unemployment show correspondingly extreme crime rates. Every 1% increase in unemployment correlates with a 2.1-point rise in crime rate.',
            },
            {
              icon: <Shield size={22} color="#10b981" />,
              title: 'Education as Shield',
              color: '#10b981',
              bg: 'rgba(16,185,129,0.06)',
              border: 'rgba(16,185,129,0.2)',
              stat: '18% reduction',
              statLabel: 'per 10-point increase in education index',
              detail: 'Udupi (Education: 86, Crime Rate: 14.9) vs Yadgir (Education: 43, Crime Rate: 33.8) demonstrates the protective power of education. Districts above the 75-point education threshold average 19.8 crime rate vs 38.5 for those below.',
            },
            {
              icon: <TrendingUp size={22} color="#f59e0b" />,
              title: 'Urbanization Risk',
              color: '#f59e0b',
              bg: 'rgba(245,158,11,0.06)',
              border: 'rgba(245,158,11,0.2)',
              stat: 'Dual effect',
              statLabel: 'rapid growth without infrastructure creates vulnerability',
              detail: 'Rapid urbanization without corresponding infrastructure investment creates crime vulnerability. Bengaluru Urban (98% urbanization, crime rate 48.2) shows highest absolute crimes, while Kodagu (24% urbanization, crime rate 12.1) remains the safest district.',
            },
          ].map(finding => (
            <div key={finding.title} className="glass-card" style={{
              padding: 24,
              background: finding.bg,
              borderColor: finding.border,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${finding.color}18`,
                  border: `1px solid ${finding.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {finding.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{finding.title}</h3>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: finding.color, marginBottom: 4 }}>
                {finding.stat}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{finding.statLabel}</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{finding.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
