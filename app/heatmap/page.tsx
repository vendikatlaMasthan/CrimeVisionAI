'use client';

import { useState } from 'react';
import Topbar from '@/components/Topbar';
import { KARNATAKA_DISTRICTS } from '@/lib/mockData';
import { AlertTriangle, MapPin, TrendingUp, Shield, Filter, Layers } from 'lucide-react';

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#0ea5e9',
  low: '#10b981',
};

const RISK_GLOW: Record<string, string> = {
  critical: 'rgba(239, 68, 68, 0.4)',
  high: 'rgba(245, 158, 11, 0.3)',
  medium: 'rgba(14, 165, 233, 0.25)',
  low: 'rgba(16, 185, 129, 0.2)',
};

// Karnataka districts positioned on a grid approximating their geographic layout
const DISTRICT_POSITIONS = [
  { id: 25, x: 320, y: 30, name: "Bidar" },
  { id: 6, x: 360, y: 70, name: "Kalaburagi" },
  { id: 14, x: 295, y: 95, name: "Yadgir" },
  { id: 12, x: 360, y: 130, name: "Raichur" },
  { id: 5, x: 95, y: 50, name: "Belagavi" },
  { id: 22, x: 165, y: 80, name: "Gadag" },
  { id: 7, x: 130, y: 110, name: "Hubballi-Dharwad" },
  { id: 24, x: 200, y: 130, name: "Bagalkot" },
  { id: 9, x: 245, y: 140, name: "Vijayapura" },
  { id: 8, x: 295, y: 160, name: "Ballari" },
  { id: 13, x: 340, y: 175, name: "Koppal" },
  { id: 31, x: 270, y: 200, name: "Vijayanagara" },
  { id: 23, x: 110, y: 155, name: "Dharwad" },
  { id: 21, x: 205, y: 180, name: "Davangere" },
  { id: 20, x: 250, y: 230, name: "Chitradurga" },
  { id: 10, x: 155, y: 225, name: "Shivamogga" },
  { id: 11, x: 280, y: 270, name: "Tumakuru" },
  { id: 2, x: 315, y: 300, name: "Bengaluru Rural" },
  { id: 1, x: 350, y: 320, name: "Bengaluru Urban" },
  { id: 30, x: 295, y: 340, name: "Ramanagara" },
  { id: 28, x: 375, y: 285, name: "Kolar" },
  { id: 27, x: 375, y: 255, name: "Chikkaballapur" },
  { id: 17, x: 105, y: 300, name: "Dakshina Kannada" },
  { id: 18, x: 75, y: 265, name: "Udupi" },
  { id: 4, x: 70, y: 300, name: "Mangaluru" },
  { id: 16, x: 185, y: 290, name: "Hassan" },
  { id: 15, x: 140, y: 275, name: "Chikkamagaluru" },
  { id: 3, x: 230, y: 345, name: "Mysuru" },
  { id: 29, x: 270, y: 370, name: "Mandya" },
  { id: 19, x: 170, y: 355, name: "Kodagu" },
  { id: 26, x: 290, y: 400, name: "Chamarajanagar" },
];

export default function HeatmapPage() {
  const [selected, setSelected] = useState<typeof KARNATAKA_DISTRICTS[0] | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const getDistrict = (id: number) => KARNATAKA_DISTRICTS.find(d => d.id === id);

  const filteredPositions = DISTRICT_POSITIONS.filter(pos => {
    const d = getDistrict(pos.id);
    if (!d) return false;
    return filter === 'all' || d.riskLevel === filter;
  });

  const riskCounts = {
    critical: KARNATAKA_DISTRICTS.filter(d => d.riskLevel === 'critical').length,
    high: KARNATAKA_DISTRICTS.filter(d => d.riskLevel === 'high').length,
    medium: KARNATAKA_DISTRICTS.filter(d => d.riskLevel === 'medium').length,
    low: KARNATAKA_DISTRICTS.filter(d => d.riskLevel === 'low').length,
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Karnataka Crime Heatmap" subtitle="District-wise crime hotspots and risk zone visualization" />
      <div className="p-6 space-y-6">

        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: '#475569' }} />
            <span className="text-xs font-semibold tracking-wider" style={{ color: '#475569' }}>RISK FILTER:</span>
          </div>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(level => (
            <button key={level} onClick={() => setFilter(level)}
              className="cyber-btn text-xs py-1.5 px-3 capitalize"
              style={{
                background: filter === level ? `${RISK_COLORS[level] || '#00f0ff'}22` : 'rgba(15,23,42,0.4)',
                color: filter === level ? (RISK_COLORS[level] || '#00f0ff') : '#64748b',
                border: `1px solid ${filter === level ? (RISK_COLORS[level] || '#00f0ff') + '44' : 'rgba(255,255,255,0.06)'}`,
              }}>
              {level === 'all' ? 'ALL DISTRICTS' : `${level.toUpperCase()} (${riskCounts[level]})`}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4">
            {Object.entries(RISK_COLORS).map(([level, color]) => (
              <div key={level} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="text-xs capitalize" style={{ color: '#64748b' }}>{level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Map */}
          <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden" style={{ minHeight: 520 }}>
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.01) 2px, rgba(0,240,255,0.01) 4px)'
            }} />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers size={14} style={{ color: '#00f0ff' }} />
                <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>KARNATAKA DISTRICT MAP</h2>
              </div>
              <div className="status-live"><span className="status-dot" />LIVE FEED</div>
            </div>

            {/* SVG Map */}
            <div className="relative" style={{ height: 460 }}>
              <svg viewBox="0 0 480 450" className="w-full h-full" style={{ overflow: 'visible' }}>
                <defs>
                  {Object.entries(RISK_COLORS).map(([level, color]) => (
                    <filter key={level} id={`glow-${level}`} x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  ))}
                </defs>

                {/* Grid lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 40} x2="480" y2={i * 40} stroke="rgba(0,240,255,0.04)" strokeWidth="1" />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="450" stroke="rgba(0,240,255,0.04)" strokeWidth="1" />
                ))}

                {/* Karnataka outline suggestion */}
                <path d="M 80,30 L 200,15 L 390,20 L 420,80 L 410,160 L 390,230 L 360,350 L 310,420 L 240,440 L 170,420 L 100,380 L 60,310 L 50,220 L 65,130 Z"
                  fill="rgba(0, 240, 255, 0.02)" stroke="rgba(0, 240, 255, 0.15)" strokeWidth="1.5" strokeDasharray="8 4" />

                {/* District nodes */}
                {DISTRICT_POSITIONS.map(pos => {
                  const d = getDistrict(pos.id);
                  if (!d) return null;
                  const color = RISK_COLORS[d.riskLevel];
                  const isVisible = filter === 'all' || d.riskLevel === filter;
                  const isHovered = hoveredId === d.id;
                  const isSelected = selected?.id === d.id;

                  if (!isVisible) return null;

                  const radius = d.riskLevel === 'critical' ? 14 : d.riskLevel === 'high' ? 11 : d.riskLevel === 'medium' ? 9 : 7;

                  return (
                    <g key={d.id} style={{ cursor: 'pointer' }}
                      onClick={() => setSelected(selected?.id === d.id ? null : d)}
                      onMouseEnter={() => setHoveredId(d.id)}
                      onMouseLeave={() => setHoveredId(null)}>
                      {/* Pulse ring */}
                      {(d.riskLevel === 'critical' || isSelected) && (
                        <circle cx={pos.x} cy={pos.y} r={radius + 8} fill="none"
                          stroke={color} strokeWidth="1" opacity="0.4"
                          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                      )}
                      {/* Main node */}
                      <circle cx={pos.x} cy={pos.y} r={isHovered || isSelected ? radius + 3 : radius}
                        fill={`${color}22`} stroke={color}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        filter={`url(#glow-${d.riskLevel})`}
                        style={{ transition: 'all 0.2s ease' }} />
                      {/* Inner dot */}
                      <circle cx={pos.x} cy={pos.y} r={3} fill={color} />
                      {/* Label */}
                      {(isHovered || isSelected || d.riskLevel === 'critical') && (
                        <text x={pos.x} y={pos.y - radius - 6} textAnchor="middle"
                          fill={color} fontSize="9" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                          {d.name.length > 10 ? d.code : d.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* District Summary Cards */}
            <div className="glass-card p-4">
              <h3 className="font-bold text-xs tracking-widest mb-4" style={{ color: '#00f0ff' }}>RISK SUMMARY</h3>
              <div className="space-y-3">
                {Object.entries(riskCounts).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: `${RISK_COLORS[level]}10`, border: `1px solid ${RISK_COLORS[level]}22` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_COLORS[level], boxShadow: `0 0 8px ${RISK_COLORS[level]}` }} />
                      <span className="text-xs font-semibold capitalize" style={{ color: RISK_COLORS[level] }}>{level} RISK</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black" style={{ color: RISK_COLORS[level] }}>{count}</span>
                      <span className="text-xs" style={{ color: '#475569' }}>districts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected District Detail */}
            {selected ? (
              <div className="glass-card p-4 animate-fadeInUp" style={{ borderColor: `${RISK_COLORS[selected.riskLevel]}30` }}>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} style={{ color: RISK_COLORS[selected.riskLevel] }} />
                  <h3 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>{selected.name}</h3>
                  <span className={`badge ml-auto ${selected.riskLevel === 'critical' ? 'badge-red' : selected.riskLevel === 'high' ? 'badge-amber' : 'badge-cyan'}`}>
                    {selected.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Total Crimes', value: selected.crimeCount.toLocaleString(), color: '#ef4444' },
                    { label: 'Active Cases', value: selected.activeCases.toLocaleString(), color: '#00f0ff' },
                    { label: 'Crime Rate', value: `${selected.crimeRate}/lakh`, color: '#f59e0b' },
                    { label: 'YoY Change', value: `${selected.change > 0 ? '+' : ''}${selected.change}%`, color: selected.change > 0 ? '#ef4444' : '#10b981' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-xs mb-1" style={{ color: '#475569' }}>{item.label}</div>
                      <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-4 text-center" style={{ borderColor: 'rgba(0,240,255,0.08)' }}>
                <MapPin size={24} className="mx-auto mb-2" style={{ color: '#334155' }} />
                <p className="text-xs" style={{ color: '#475569' }}>Click on a district node on the map to view detailed crime statistics</p>
              </div>
            )}

            {/* Top High-Risk Districts */}
            <div className="glass-card p-4">
              <h3 className="font-bold text-xs tracking-widest mb-3" style={{ color: '#f59e0b' }}>TOP HIGH-RISK ZONES</h3>
              <div className="space-y-2">
                {KARNATAKA_DISTRICTS
                  .filter(d => d.riskLevel === 'critical' || d.riskLevel === 'high')
                  .sort((a, b) => b.crimeCount - a.crimeCount)
                  .slice(0, 5)
                  .map((d, i) => (
                    <div key={d.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all"
                      style={{ background: selected?.id === d.id ? 'rgba(0,240,255,0.06)' : 'transparent' }}
                      onClick={() => setSelected(d)}>
                      <div className="text-xs font-black w-5" style={{ color: '#334155' }}>#{i + 1}</div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold" style={{ color: '#94a3b8' }}>{d.name}</div>
                        <div className="text-xs" style={{ color: '#475569' }}>{d.crimeCount.toLocaleString()} crimes</div>
                      </div>
                      <div className="w-2 h-2 rounded-full" style={{ background: RISK_COLORS[d.riskLevel], boxShadow: `0 0 6px ${RISK_COLORS[d.riskLevel]}` }} />
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
