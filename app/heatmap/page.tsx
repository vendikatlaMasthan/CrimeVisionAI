'use client';

import { useState, useMemo } from 'react';
import {
  MapPin, Shield, AlertTriangle, TrendingUp, TrendingDown,
  Building2, Users, X, ChevronRight, Activity, Target,
  ArrowUpRight, ArrowDownRight, Cpu, Eye, Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { KARNATAKA_DISTRICTS } from '@/lib/mockData';

type District = typeof KARNATAKA_DISTRICTS[0];
type CrimeFilter = 'all' | 'theft' | 'cybercrime' | 'fraud' | 'assault' | 'narcotics' | 'organized';

function riskColor(level: string): string {
  if (level === 'critical') return '#ef4444';
  if (level === 'high') return '#f59e0b';
  if (level === 'medium') return '#eab308';
  return '#10b981';
}

function riskBg(level: string): string {
  if (level === 'critical') return 'rgba(239,68,68,0.12)';
  if (level === 'high') return 'rgba(245,158,11,0.1)';
  if (level === 'medium') return 'rgba(234,179,8,0.08)';
  return 'rgba(16,185,129,0.08)';
}

function riskBorder(level: string): string {
  if (level === 'critical') return 'rgba(239,68,68,0.4)';
  if (level === 'high') return 'rgba(245,158,11,0.35)';
  if (level === 'medium') return 'rgba(234,179,8,0.3)';
  return 'rgba(16,185,129,0.3)';
}

function riskGlow(level: string): string {
  if (level === 'critical') return '0 0 18px rgba(239,68,68,0.3)';
  if (level === 'high') return '0 0 14px rgba(245,158,11,0.2)';
  if (level === 'medium') return '0 0 10px rgba(234,179,8,0.15)';
  return '0 0 8px rgba(16,185,129,0.1)';
}

function riskBadgeClass(level: string): string {
  if (level === 'critical') return 'badge badge-red';
  if (level === 'high') return 'badge badge-amber';
  if (level === 'medium') return 'badge badge-amber';
  return 'badge badge-green';
}

function getCrimeCount(d: District, filter: CrimeFilter): number {
  if (filter === 'theft') return d.theft;
  if (filter === 'cybercrime') return d.cyberCrimes;
  if (filter === 'fraud') return d.fraud;
  if (filter === 'assault') return d.assault;
  if (filter === 'narcotics') return d.narcotics;
  if (filter === 'organized') return d.organized;
  return d.crimeCount;
}

const DISTRICT_HOTSPOTS: Record<string, string[]> = {
  'Bengaluru Urban': ['Koramangala', 'Whitefield', 'Shivajinagar'],
  'Bengaluru Rural': ['Devanahalli', 'Doddaballapur', 'Nelamangala'],
  'Mysuru': ['Vijayanagar', 'Kuvempunagar', 'Hebbal Mysuru'],
  'Mangaluru': ['Bunder', 'Hampankatta', 'Urwa'],
  'Belagavi': ['Shahpur', 'Camp Area', 'Khanapur'],
  'Kalaburagi': ['Aland Road', 'Super Market Area', 'Sedam'],
  'Hubballi-Dharwad': ['Old Hubli', 'Gokul Road', 'Vidyanagar'],
  'Ballari': ['Siruguppa', 'Bellary Camp', 'Toranagallu'],
  'Vijayapura': ['Bijapur Old Town', 'Solapur Road', 'Indi'],
  'Shivamogga': ['Gandhi Nagar', 'Vidyanagar Shimoga', 'Bhadravati'],
  'Tumakuru': ['Siddartha Nagar', 'NH-4 Corridor', 'Tiptur'],
  'Raichur': ['Raichur Naka', 'Deosugur', 'Sindhanur'],
  'Koppal': ['Gangavathi', 'Yelburga', 'Koppal Old Town'],
  'Yadgir': ['Yadgir Town', 'Shorapur', 'Gurumitkal'],
  'Chikkamagaluru': ['Coffee Estate Zone', 'Mudigere', 'Kadur'],
  'Hassan': ['Hassan Town', 'Arsikere', 'Channarayapatna'],
  'Dakshina Kannada': ['Surathkal', 'Bantwal', 'Puttur'],
  'Udupi': ['Manipal', 'Karkala', 'Kundapur'],
  'Kodagu': ['Madikeri', 'Somwarpet', 'Virajpet'],
  'Chitradurga': ['Chitradurga Town', 'Hiriyur', 'Holalkere'],
  'Davangere': ['Kondajji', 'Basha Nagar', 'Harihar'],
  'Gadag': ['Gadag Town', 'Mundargi', 'Ron'],
  'Dharwad': ['Dharwad City', 'Alnavar', 'Hubli-Dharwad NH'],
  'Bagalkot': ['Bagalkot Town', 'Badami', 'Jamkhandi'],
  'Bidar': ['Bidar Town', 'Basavakalyan', 'Bhalki'],
  'Chamarajanagar': ['Chamarajanagar Town', 'Gundlupet', 'Kollegal'],
  'Chikkaballapur': ['Chikkaballapur Town', 'Gauribidanur', 'Gudibande'],
  'Kolar': ['Kolar Gold Fields', 'Malur', 'Srinivaspur'],
  'Mandya': ['Mandya Town', 'Srirangapatna', 'Maddur'],
  'Ramanagara': ['Ramanagara Town', 'Kanakapura', 'Channapatna'],
  'Vijayanagara': ['Hospet', 'Hampi Zone', 'Kudligi'],
};

function generateAISummary(d: District): string {
  const trend = d.change > 0 ? `rising ${d.change}% YoY` : `declining ${Math.abs(d.change)}% YoY`;
  const topCrime = d.cyberCrimes > d.theft ? 'cybercrime' : 'theft';
  return `${d.name} registers a ${d.riskLevel.toUpperCase()} risk profile with ${d.activeCases.toLocaleString()} active investigations. Crime is ${trend}, driven primarily by ${topCrime} incidents. Crime rate stands at ${d.crimeRate} per 1,000 residents — ${d.crimeRate > 35 ? 'significantly above' : 'near'} state average. AI recommends ${d.riskLevel === 'critical' || d.riskLevel === 'high' ? 'immediate resource deployment and SIT formation' : 'continued monitoring with targeted patrols'}.`;
}

const FILTERS: { key: CrimeFilter; label: string }[] = [
  { key: 'all', label: 'All Crimes' },
  { key: 'theft', label: 'Theft' },
  { key: 'cybercrime', label: 'Cybercrime' },
  { key: 'fraud', label: 'Fraud' },
  { key: 'assault', label: 'Assault' },
  { key: 'narcotics', label: 'Narcotics' },
  { key: 'organized', label: 'Organized' },
];

function CrimeCategoryBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: '#cbd5e1' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: `0 0 6px ${color}66`,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
}

export default function HeatmapPage() {
  const [activeFilter, setActiveFilter] = useState<CrimeFilter>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const sortedForList = useMemo(
    () => [...KARNATAKA_DISTRICTS].sort((a, b) => b.crimeCount - a.crimeCount).slice(0, 8),
    []
  );

  const totalCrimesAll = useMemo(() => KARNATAKA_DISTRICTS.reduce((s, d) => s + d.crimeCount, 0), []);

  const districtTrendData = useMemo(() => {
    if (!selectedDistrict) return [];
    return [
      { month: 'Jan', crimes: Math.round(selectedDistrict.crimeCount / 12 * 0.9) },
      { month: 'Feb', crimes: Math.round(selectedDistrict.crimeCount / 12 * 0.95) },
      { month: 'Mar', crimes: Math.round(selectedDistrict.crimeCount / 12 * 1.05) },
      { month: 'Apr', crimes: Math.round(selectedDistrict.crimeCount / 12 * 1.0) },
      { month: 'May', crimes: Math.round(selectedDistrict.crimeCount / 12 * (1 + selectedDistrict.change/100)) }
    ];
  }, [selectedDistrict]);

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: '11px'
          }}>
            <MapPin size={18} color="#ef4444" />
          </div>
          <div>
            <h1 className="page-title">Karnataka Crime Intelligence Map</h1>
            <p className="page-subtitle">Real-Time District Risk Analytics, Hotspots &amp; Tactical Dispatch Recommendations</p>
          </div>
        </div>
      </div>

      {/* LAYOUT */}
      <div className="responsive-map-layout" style={{ alignItems: 'start' }}>
        
        {/* LEFT: MAP GRID */}
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className="cyber-btn"
                style={{
                  padding: '7px 16px',
                  fontSize: 12,
                  background: activeFilter === f.key ? 'rgba(0,240,255,0.15)' : 'rgba(10,22,40,0.8)',
                  color: activeFilter === f.key ? '#00f0ff' : '#94a3b8',
                  border: activeFilter === f.key ? '1px solid rgba(0,240,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="responsive-grid-6">
            {KARNATAKA_DISTRICTS.map((d) => {
              const count = getCrimeCount(d, activeFilter);
              const isSelected = selectedDistrict?.id === d.id;
              const isHovered = hoveredId === d.id;
              
              // Simulated alerts count
              const alertsCount = d.id % 5;
              const solvedCount = Math.round(d.crimeCount - d.activeCases);

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDistrict(isSelected ? null : d)}
                  onMouseEnter={() => setHoveredId(d.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: isSelected ? 'rgba(0,240,255,0.12)' : riskBg(d.riskLevel),
                    border: `1px solid ${isSelected ? 'rgba(0,240,255,0.5)' : riskBorder(d.riskLevel)}`,
                    borderRadius: 10,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isSelected || isHovered ? 'scale(1.06)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 20px rgba(0,240,255,0.3)' : isHovered ? riskGlow(d.riskLevel) : 'none',
                    zIndex: isHovered || isSelected ? 10 : 1,
                    position: 'relative',
                  }}
                >
                  {/* Alert notification badge inside cell */}
                  {alertsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                      {alertsCount}
                    </span>
                  )}

                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: riskColor(d.riskLevel),
                    boxShadow: `0 0 6px ${riskColor(d.riskLevel)}`,
                    margin: '0 auto 5px',
                  }} />

                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    color: isSelected ? '#00f0ff' : '#f1f5f9',
                    lineHeight: 1.2,
                    marginBottom: 4,
                    textAlign: 'center',
                  }}>
                    {d.name.length > 12 ? d.name.substring(0, 11) + '…' : d.name}
                  </div>

                  <div style={{
                    fontSize: 11, fontWeight: 800,
                    color: riskColor(d.riskLevel),
                    lineHeight: 1,
                    textAlign: 'center',
                  }}>
                    {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                  </div>

                  {/* Stations & Active investigations stats */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 4, fontSize: 8, color: '#64748b' }}>
                    <Shield size={7} />
                    <span>{d.policeStations}</span>
                    <span>|</span>
                    <Activity size={7} color="#ef4444" />
                    <span>{d.activeCases}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map legend */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 16, padding: '12px 18px',
            background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(0,240,255,0.1)',
            borderRadius: 10, flexWrap: 'wrap', alignItems: 'center',
          }}>
            {['Critical', 'High', 'Medium', 'Low'].map((label, idx) => {
              const color = riskColor(label.toLowerCase());
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{label}</span>
                </div>
              );
            })}
            <div style={{ marginLeft: 'auto', fontSize: 12, color: '#00f0ff', fontWeight: 700 }}>
              State Total: {totalCrimesAll.toLocaleString()} registered incidents
            </div>
          </div>
        </div>

        {/* RIGHT: DETAIL INTELLIGENCE PANEL */}
        <div>
          {selectedDistrict ? (
            <div className="glass-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <MapPin size={18} color={riskColor(selectedDistrict.riskLevel)} />
                    <h2 style={{ fontSize: 16, fontWeight: 900, color: '#f1f5f9' }}>{selectedDistrict.name} Intel</h2>
                  </div>
                  <span className={riskBadgeClass(selectedDistrict.riskLevel)} style={{ fontSize: 10 }}>
                    {selectedDistrict.riskLevel.toUpperCase()} RISK INDEX
                  </span>
                </div>
                <button onClick={() => setSelectedDistrict(null)} className="text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Active cases', value: selectedDistrict.activeCases.toLocaleString(), color: '#ef4444' },
                  { label: 'Solved cases', value: (selectedDistrict.crimeCount - selectedDistrict.activeCases).toLocaleString(), color: '#10b981' },
                ].map(s => (
                  <div key={s.label} className="bg-black/25 p-3 rounded-lg border border-white/5">
                    <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Crime category bars */}
              <div className="mb-4">
                <CrimeCategoryBar label="Cybercrime" value={selectedDistrict.cyberCrimes} max={selectedDistrict.crimeCount} color="#00f0ff" />
                <CrimeCategoryBar label="Assault" value={selectedDistrict.assault} max={selectedDistrict.crimeCount} color="#ef4444" />
                <CrimeCategoryBar label="Theft" value={selectedDistrict.theft} max={selectedDistrict.crimeCount} color="#8b5cf6" />
              </div>

              {/* Local Crime Trend Line Chart (Phase 6) */}
              <div className="bg-black/25 p-3 rounded-xl border border-white/5 mb-4">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 10 }}>
                  Crime Trend Forecast
                </div>
                <div style={{ height: 110 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={districtTrendData}>
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" tick={{ fill: '#64748b', fontSize: 9 }} />
                      <YAxis hide />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="crimes" stroke="#00f0ff" fill="rgba(0,240,255,0.06)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hotspots (Phase 6) */}
              <div className="mb-4">
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                  High-Activity Hotspots
                </div>
                {(DISTRICT_HOTSPOTS[selectedDistrict.name] || ['Zone A', 'Zone B']).map((spot, i) => (
                  <div key={spot} className="flex items-center gap-2 py-1 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{spot}</span>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div style={{ background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div className="flex items-center gap-1 mb-1.5">
                  <Cpu size={12} color="#00f0ff" />
                  <span style={{ fontSize: 10, color: '#00f0ff', fontWeight: 800 }}>AI RECOMMENDATION</span>
                </div>
                <p style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.5 }}>{generateAISummary(selectedDistrict)}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="cyber-btn cyber-btn-cyan flex-1 justify-center py-2 text-xs">
                  <Eye size={12} /> Full Report
                </button>
                <button className="cyber-btn cyber-btn-red flex-1 justify-center py-2 text-xs">
                  <Target size={12} /> Deploy SIT
                </button>
              </div>
            </div>
          ) : (
            /* General summary lists */
            <div className="glass-card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 18 }}>
                <div className="section-header-line" />
                <span className="section-title">Top Risk Districts</span>
              </div>
              <div className="space-y-2">
                {sortedForList.map((d, idx) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    className="flex justify-between items-center p-3 bg-black/20 border border-white/5 hover:border-[#00f0ff]/30 rounded-xl cursor-pointer transition-all"
                  >
                    <div>
                      <div className="font-bold text-slate-200 text-xs">{d.name}</div>
                      <div className="text-[10px] text-slate-500">{d.activeCases} active cases</div>
                    </div>
                    <span className="font-mono font-bold" style={{ color: riskColor(d.riskLevel) }}>
                      {d.crimeRate}/1k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
