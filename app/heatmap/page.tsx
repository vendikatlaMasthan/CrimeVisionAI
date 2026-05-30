'use client';

import { useState, useMemo } from 'react';
import {
  MapPin, Shield, AlertTriangle, TrendingUp, TrendingDown,
  Building2, Users, X, ChevronRight, Activity, Target,
  ArrowUpRight, ArrowDownRight, Cpu, Eye,
} from 'lucide-react';
import { KARNATAKA_DISTRICTS } from '@/lib/mockData';

// ── Types ──────────────────────────────────────────────────────
type District = typeof KARNATAKA_DISTRICTS[0];

type CrimeFilter = 'all' | 'theft' | 'cybercrime' | 'fraud' | 'assault' | 'narcotics' | 'organized';

// ── Helper functions ───────────────────────────────────────────
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

function getFilterLabel(filter: CrimeFilter): string {
  if (filter === 'all') return 'Total Crimes';
  if (filter === 'cybercrime') return 'Cyber Crimes';
  if (filter === 'theft') return 'Theft Cases';
  if (filter === 'fraud') return 'Fraud Cases';
  if (filter === 'assault') return 'Assault Cases';
  if (filter === 'narcotics') return 'Narcotics Cases';
  if (filter === 'organized') return 'Organized Crime';
  return 'Crimes';
}

// ── Hotspots per district ──────────────────────────────────────
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

// ── AI Summary generator ───────────────────────────────────────
function generateAISummary(d: District): string {
  const trend = d.change > 0 ? `rising ${d.change}% YoY` : `declining ${Math.abs(d.change)}% YoY`;
  const topCrime = d.cyberCrimes > d.theft ? 'cybercrime' : 'theft';
  return `${d.name} registers a ${d.riskLevel.toUpperCase()} risk profile with ${d.activeCases.toLocaleString()} active investigations. Crime is ${trend}, driven primarily by ${topCrime} incidents. Crime rate stands at ${d.crimeRate} per 1,000 residents — ${d.crimeRate > 35 ? 'significantly above' : 'near'} state average. AI recommends ${d.riskLevel === 'critical' || d.riskLevel === 'high' ? 'immediate resource deployment and SIT formation' : 'continued monitoring with targeted patrols'}.`;
}

// ── Filter bar ─────────────────────────────────────────────────
const FILTERS: { key: CrimeFilter; label: string }[] = [
  { key: 'all', label: 'All Crimes' },
  { key: 'theft', label: 'Theft' },
  { key: 'cybercrime', label: 'Cybercrime' },
  { key: 'fraud', label: 'Fraud' },
  { key: 'assault', label: 'Assault' },
  { key: 'narcotics', label: 'Narcotics' },
  { key: 'organized', label: 'Organized' },
];

// ── Category bar component ─────────────────────────────────────
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

// ── Main Component ─────────────────────────────────────────────
export default function HeatmapPage() {
  const [activeFilter, setActiveFilter] = useState<CrimeFilter>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const sortedForList = useMemo(
    () => [...KARNATAKA_DISTRICTS].sort((a, b) => b.crimeCount - a.crimeCount).slice(0, 8),
    []
  );

  const totalCrimesAll = useMemo(() => KARNATAKA_DISTRICTS.reduce((s, d) => s + d.crimeCount, 0), []);

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }}>

      {/* ── PAGE HEADER ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={24} color="#ef4444" />
          </div>
          <div>
            <h1 className="page-title" style={{ letterSpacing: '0.04em', fontSize: 24 }}>
              Karnataka Crime Intelligence Map
            </h1>
            <p className="page-subtitle">Interactive District Risk Analysis — All 31 Districts</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            background: 'rgba(10,22,40,0.88)', border: '1px solid rgba(0,240,255,0.14)',
            borderRadius: 10, padding: '10px 18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>4</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Critical</div>
          </div>
          <div style={{
            background: 'rgba(10,22,40,0.88)', border: '1px solid rgba(0,240,255,0.14)',
            borderRadius: 10, padding: '10px 18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b' }}>11</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>High</div>
          </div>
          <div style={{
            background: 'rgba(10,22,40,0.88)', border: '1px solid rgba(0,240,255,0.14)',
            borderRadius: 10, padding: '10px 18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#eab308' }}>10</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Medium</div>
          </div>
          <div style={{
            background: 'rgba(10,22,40,0.88)', border: '1px solid rgba(0,240,255,0.14)',
            borderRadius: 10, padding: '10px 18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>6</div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Low</div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────── */}
      <div className="responsive-map-layout" style={{ alignItems: 'start' }}>

        {/* ── LEFT: MAP GRID ──────────────────────────────── */}
        <div>
          {/* Filter Buttons */}
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
                  boxShadow: activeFilter === f.key ? '0 0 16px rgba(0,240,255,0.2)' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* District Grid */}
          <div className="responsive-grid-6">
            {KARNATAKA_DISTRICTS.map((d) => {
              const count = getCrimeCount(d, activeFilter);
              const isSelected = selectedDistrict?.id === d.id;
              const isHovered = hoveredId === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDistrict(isSelected ? null : d)}
                  onMouseEnter={() => setHoveredId(d.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: isSelected
                      ? `rgba(0,240,255,0.12)`
                      : riskBg(d.riskLevel),
                    border: `1px solid ${isSelected ? 'rgba(0,240,255,0.5)' : riskBorder(d.riskLevel)}`,
                    borderRadius: 10,
                    padding: '10px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isSelected || isHovered ? 'scale(1.06)' : 'scale(1)',
                    boxShadow: isSelected
                      ? '0 0 20px rgba(0,240,255,0.3)'
                      : isHovered
                      ? riskGlow(d.riskLevel)
                      : 'none',
                    zIndex: isHovered || isSelected ? 10 : 1,
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {/* Risk dot */}
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: riskColor(d.riskLevel),
                    boxShadow: `0 0 6px ${riskColor(d.riskLevel)}`,
                    margin: '0 auto 5px',
                  }} />
                  {/* Name */}
                  <div style={{
                    fontSize: 10, fontWeight: 700,
                    color: isSelected ? '#00f0ff' : '#f1f5f9',
                    lineHeight: 1.2,
                    marginBottom: 4,
                    wordBreak: 'break-word',
                  }}>
                    {d.name.length > 12 ? d.name.substring(0, 11) + '…' : d.name}
                  </div>
                  {/* Count */}
                  <div style={{
                    fontSize: 11, fontWeight: 800,
                    color: riskColor(d.riskLevel),
                    lineHeight: 1,
                  }}>
                    {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
                  </div>
                  {/* Police stations */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginTop: 4 }}>
                    <Shield size={8} color="#64748b" />
                    <span style={{ fontSize: 9, color: '#64748b' }}>{d.policeStations}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 16, padding: '12px 18px',
            background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(0,240,255,0.1)',
            borderRadius: 10, flexWrap: 'wrap', alignItems: 'center',
          }}>
            {[
              { label: 'Critical', color: '#ef4444' },
              { label: 'High', color: '#f59e0b' },
              { label: 'Medium', color: '#eab308' },
              { label: 'Low', color: '#10b981' },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{l.label}</span>
              </div>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
              <Shield size={11} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} color="#64748b" />
              = Police Stations Count
            </div>
            <div style={{ fontSize: 12, color: '#00f0ff', fontWeight: 700 }}>
              Total: {totalCrimesAll.toLocaleString()} crimes across Karnataka
            </div>
          </div>
        </div>

        {/* ── RIGHT: INTELLIGENCE PANEL ────────────────────── */}
        <div style={{ position: 'sticky', top: 20 }}>
          {selectedDistrict ? (
            /* District Intelligence View */
            <div className="glass-card" style={{ padding: 24 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <MapPin size={18} color={riskColor(selectedDistrict.riskLevel)} />
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>{selectedDistrict.name}</h2>
                  </div>
                  <span className={riskBadgeClass(selectedDistrict.riskLevel)} style={{ fontSize: 11 }}>
                    {selectedDistrict.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '6px', cursor: 'pointer', color: '#94a3b8',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Risk Score Gauge */}
              <div style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: 10,
                padding: '14px 18px', marginBottom: 18,
                border: `1px solid ${riskBorder(selectedDistrict.riskLevel)}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Crime Rate</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: riskColor(selectedDistrict.riskLevel) }}>
                    {selectedDistrict.crimeRate}/1000
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(selectedDistrict.crimeRate * 2, 100)}%`,
                    background: `linear-gradient(90deg, ${riskColor(selectedDistrict.riskLevel)}, ${riskColor(selectedDistrict.riskLevel)}88)`,
                    borderRadius: 4,
                    boxShadow: `0 0 10px ${riskColor(selectedDistrict.riskLevel)}66`,
                  }} />
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 18 }}>
                {[
                  { label: 'Total Crimes', value: selectedDistrict.crimeCount.toLocaleString(), color: '#ef4444' },
                  { label: 'Active Cases', value: selectedDistrict.activeCases.toLocaleString(), color: '#f59e0b' },
                  { label: 'Population', value: `${(selectedDistrict.population / 1000000).toFixed(2)}M`, color: '#00f0ff' },
                  { label: 'YoY Change', value: `${selectedDistrict.change > 0 ? '+' : ''}${selectedDistrict.change}%`, color: selectedDistrict.change > 0 ? '#ef4444' : '#10b981' },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                    padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Crime Categories */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Crime Breakdown
                </div>
                <CrimeCategoryBar label="Cybercrime" value={selectedDistrict.cyberCrimes} max={selectedDistrict.crimeCount} color="#00f0ff" />
                <CrimeCategoryBar label="Theft & Burglary" value={selectedDistrict.theft} max={selectedDistrict.crimeCount} color="#8b5cf6" />
                <CrimeCategoryBar label="Assault" value={selectedDistrict.assault} max={selectedDistrict.crimeCount} color="#ef4444" />
                <CrimeCategoryBar label="Fraud" value={selectedDistrict.fraud} max={selectedDistrict.crimeCount} color="#f59e0b" />
                <CrimeCategoryBar label="Narcotics" value={selectedDistrict.narcotics} max={selectedDistrict.crimeCount} color="#e879f9" />
                <CrimeCategoryBar label="Organized" value={selectedDistrict.organized} max={selectedDistrict.crimeCount} color="#f97316" />
              </div>

              {/* AI Summary */}
              <div style={{
                background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.15)',
                borderRadius: 10, padding: '12px 14px', marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Cpu size={13} color="#00f0ff" />
                  <span style={{ fontSize: 11, color: '#00f0ff', fontWeight: 700, letterSpacing: '0.08em' }}>AI INTELLIGENCE SUMMARY</span>
                </div>
                <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>{generateAISummary(selectedDistrict)}</p>
              </div>

              {/* Hotspots */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                  High-Activity Hotspots
                </div>
                {(DISTRICT_HOTSPOTS[selectedDistrict.name] || ['Zone A', 'Zone B', 'Zone C']).map((spot, i) => (
                  <div key={spot} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: '#ef4444', flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                      <MapPin size={11} color="#64748b" />
                      <span style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 600 }}>{spot}</span>
                    </div>
                    <ChevronRight size={14} color="#64748b" />
                  </div>
                ))}
              </div>

              {/* Police Stations */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              }}>
                <Shield size={16} color="#8b5cf6" />
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>
                  <span style={{ fontWeight: 800, color: '#a78bfa', fontSize: 16 }}>{selectedDistrict.policeStations}</span> Police Stations
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button className="cyber-btn cyber-btn-cyan" style={{ justifyContent: 'center', fontSize: 11 }}>
                  <Eye size={13} />
                  View Report
                </button>
                <button className="cyber-btn cyber-btn-red" style={{ justifyContent: 'center', fontSize: 11 }}>
                  <Target size={13} />
                  Deploy Resources
                </button>
              </div>
            </div>
          ) : (
            /* Top Districts List */
            <div className="glass-card" style={{ padding: 24 }}>
              <div className="section-header" style={{ marginBottom: 18 }}>
                <div className="section-header-line" />
                <span className="section-title">Top Risk Districts</span>
                <span className="badge badge-red" style={{ marginLeft: 'auto', fontSize: 10 }}>PRIORITY</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
                Click any district card on the map to view detailed intelligence.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sortedForList.map((d, idx) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(d)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px',
                      background: 'rgba(0,0,0,0.2)',
                      border: `1px solid ${riskBorder(d.riskLevel)}`,
                      borderRadius: 10, cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,240,255,0.04)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.2)'; }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: idx < 3 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800,
                      color: idx < 3 ? '#ef4444' : '#f59e0b',
                      flexShrink: 0,
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{d.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          {d.crimeCount.toLocaleString()} crimes
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>•</span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          {d.activeCases.toLocaleString()} active
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: riskColor(d.riskLevel) }}>
                        {d.crimeRate}/1k
                      </div>
                      <div style={{
                        fontSize: 10, fontWeight: 700,
                        color: d.change > 0 ? '#ef4444' : '#10b981',
                        display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', marginTop: 2,
                      }}>
                        {d.change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {d.change > 0 ? '+' : ''}{d.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary stats */}
              <div style={{
                marginTop: 18, padding: '14px 16px',
                background: 'rgba(0,240,255,0.04)', borderRadius: 10,
                border: '1px solid rgba(0,240,255,0.12)',
              }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                  State Overview
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Total Districts', value: '31' },
                    { label: 'Total Crimes', value: totalCrimesAll.toLocaleString() },
                    { label: 'Avg Crime Rate', value: '28.4/1k' },
                    { label: 'Total Stations', value: '1,114' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#00f0ff' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
