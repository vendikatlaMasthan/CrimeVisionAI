'use client';

import { useState } from 'react';
import Topbar from '@/components/Topbar';
import { DISTRICT_RISK_SCORES, MONTHLY_CRIME_TRENDS, RISK_FORECAST, KARNATAKA_DISTRICTS } from '@/lib/mockData';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell, Legend
} from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Target, Cpu, ChevronUp, ChevronDown } from 'lucide-react';

const combinedData = [
  ...MONTHLY_CRIME_TRENDS.slice(-6).map(d => ({ ...d, type: 'actual' })),
  ...RISK_FORECAST.map(d => ({ month: d.month, crimes: d.predicted, predicted: d.predicted, low: d.low, high: d.high, confidence: d.confidence, type: 'forecast' })),
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isForecast = payload[0]?.payload?.type === 'forecast';
    return (
      <div className="tooltip">
        <p className="font-bold mb-1" style={{ color: isForecast ? '#8b5cf6' : '#00f0ff', fontSize: '11px' }}>
          {label} {isForecast ? '(AI Forecast)' : '(Actual)'}
        </p>
        {payload.map((p: any, i: number) => p.value && (
          <p key={i} style={{ color: p.color || '#94a3b8', fontSize: '11px' }}>{p.name}: {p.value?.toLocaleString?.() ?? p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PredictionsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const topRisk = KARNATAKA_DISTRICTS
    .sort((a, b) => {
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return riskOrder[b.riskLevel as keyof typeof riskOrder] - riskOrder[a.riskLevel as keyof typeof riskOrder] || b.change - a.change;
    })
    .slice(0, 8);

  const forecastBarData = DISTRICT_RISK_SCORES.map(d => ({
    name: d.name.split(' ')[0],
    current: d.score,
    predicted: Math.min(100, d.score + parseFloat(d.predictedIncrease) * 1.5),
  }));

  return (
    <div className="min-h-screen">
      <Topbar title="Risk Prediction Dashboard" subtitle="AI-powered crime forecasting and district risk assessment" />
      <div className="p-6 space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Predicted Crimes (Jul)', value: '10,800', change: '+5.5%', color: '#ef4444', icon: AlertTriangle },
            { label: 'AI Forecast Accuracy', value: '91.2%', change: '+2.1%', color: '#10b981', icon: Target },
            { label: 'Critical Zones', value: '4', change: 'unchanged', color: '#f59e0b', icon: Shield },
            { label: 'Model Confidence', value: '78%', change: 'High', color: '#8b5cf6', icon: Cpu },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4" style={{ borderColor: `${item.color}22` }}>
              <div className="flex items-center justify-between mb-3">
                <item.icon size={16} style={{ color: item.color }} />
                <span className="text-xs font-semibold" style={{ color: item.change.startsWith('+') ? '#ef4444' : item.change.startsWith('-') ? '#10b981' : '#64748b' }}>
                  {item.change}
                </span>
              </div>
              <div className="text-2xl font-black" style={{ color: item.color }}>{item.value}</div>
              <div className="text-xs mt-1" style={{ color: '#475569' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Crime Forecast Chart */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>CRIME TREND FORECAST</h2>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Historical vs. AI-predicted crime trajectory</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5" style={{ background: '#00f0ff' }} /><span className="text-xs" style={{ color: '#475569' }}>Actual</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: '#8b5cf6' }} /><span className="text-xs" style={{ color: '#475569' }}>Forecast</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={combinedData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x="Jan 25" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                <ReferenceLine x="Jul 25" stroke="rgba(139,92,246,0.3)" strokeDasharray="4 4" label={{ value: 'FORECAST ▶', fill: '#8b5cf6', fontSize: 9, position: 'insideTopLeft' }} />
                <Area type="monotone" dataKey="crimes" name="Total Crimes" stroke="#00f0ff" strokeWidth={2} fill="url(#gradActual)" />
                <Area type="monotone" dataKey="predicted" name="AI Forecast" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6 3" fill="url(#gradForecast)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Confidence by Month */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>MONTHLY FORECAST DETAIL</h2>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Jul – Dec 2025 predicted crime volumes</p>
              </div>
            </div>
            <div className="space-y-3">
              {RISK_FORECAST.map((item, i) => (
                <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{item.month}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: '#64748b' }}>Range: {item.low.toLocaleString()}–{item.high.toLocaleString()}</span>
                      <span className="badge badge-purple">±{100 - item.confidence}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 risk-bar-track">
                      <div className="risk-bar-fill" style={{
                        width: `${(item.predicted / 16000) * 100}%`,
                        background: `linear-gradient(90deg, #8b5cf680, #8b5cf6)`,
                      }} />
                    </div>
                    <span className="text-sm font-black" style={{ color: '#8b5cf6' }}>{item.predicted.toLocaleString()}</span>
                    <span className="text-xs" style={{ color: '#475569' }}>predicted</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="text-xs" style={{ color: '#475569' }}>Confidence:</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <div key={j} className="w-3 h-1 rounded-sm" style={{ background: j < Math.round(item.confidence / 10) ? '#10b981' : 'rgba(255,255,255,0.08)' }} />
                      ))}
                    </div>
                    <div className="text-xs font-bold" style={{ color: '#10b981' }}>{item.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* District Risk Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bar Chart */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>DISTRICT RISK SCORE FORECAST</h2>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Current vs. predicted risk scores (next 90 days)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={forecastBarData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="current" name="Current Score" fill="#00f0ff" opacity={0.7} radius={[4, 4, 0, 0]} />
                <Bar dataKey="predicted" name="Predicted Score" fill="#ef4444" opacity={0.7} radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* High Risk District List */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>HIGH-RISK DISTRICTS</h2>
              <span className="badge badge-red">AI ALERT</span>
            </div>
            <div className="space-y-2">
              {topRisk.map((d, i) => {
                const riskColor = { critical: '#ef4444', high: '#f59e0b', medium: '#0ea5e9', low: '#10b981' }[d.riskLevel] || '#64748b';
                return (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: selectedDistrict === d.name ? `${riskColor}10` : 'rgba(15,23,42,0.3)',
                      border: `1px solid ${selectedDistrict === d.name ? riskColor + '30' : 'rgba(255,255,255,0.05)'}`,
                    }}
                    onClick={() => setSelectedDistrict(selectedDistrict === d.name ? null : d.name)}>
                    <div className="text-xs font-black w-5" style={{ color: '#334155' }}>#{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate" style={{ color: '#e2e8f0' }}>{d.name}</span>
                        <span className={`badge ${d.riskLevel === 'critical' ? 'badge-red' : d.riskLevel === 'high' ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '9px' }}>
                          {d.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs" style={{ color: '#475569' }}>{d.crimeCount.toLocaleString()} crimes</span>
                        <span className="text-xs" style={{ color: '#475569' }}>Rate: {d.crimeRate}/lakh</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        {d.change > 0 ? <ChevronUp size={12} style={{ color: '#ef4444' }} /> : <ChevronDown size={12} style={{ color: '#10b981' }} />}
                        <span className="text-xs font-bold" style={{ color: d.change > 0 ? '#ef4444' : '#10b981' }}>
                          {d.change > 0 ? '+' : ''}{d.change}%
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: '#475569' }}>YoY</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
