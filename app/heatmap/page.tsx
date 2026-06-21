'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Shield, Activity, Eye, Filter, Layers, Clock, X, Users } from 'lucide-react';
import { KARNATAKA_DISTRICTS } from '@/lib/mockData';

type FilterType = 'all' | 'cybercrime' | 'theft' | 'assault' | 'fraud' | 'narcotics' | 'organized';
type ViewMode = 'map' | 'grid';

type District = typeof KARNATAKA_DISTRICTS[0];

const RISK_COLORS: Record<string, { bg: string; border: string; text: string; leaflet: string }> = {
  critical: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#f87171', leaflet: '#ef4444' },
  high:     { bg: 'rgba(245,158,11,0.12)', border: '#f59e0b', text: '#fbbf24', leaflet: '#f59e0b' },
  medium:   { bg: 'rgba(234,179,8,0.1)',  border: '#eab308', text: '#facc15', leaflet: '#eab308' },
  low:      { bg: 'rgba(16,185,129,0.1)', border: '#10b981', text: '#34d399', leaflet: '#10b981' },
};

const FILTER_KEYS: Record<FilterType, keyof District> = {
  all: 'crimeCount',
  cybercrime: 'cyberCrimes',
  theft: 'theft',
  assault: 'assault',
  fraud: 'fraud',
  narcotics: 'narcotics',
  organized: 'organized',
};

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'All Crimes',
  cybercrime: 'Cybercrime',
  theft: 'Theft',
  assault: 'Assault',
  fraud: 'Fraud',
  narcotics: 'Narcotics',
  organized: 'Organized Crime',
};

export default function HeatmapPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [timeSlider, setTimeSlider] = useState(12);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  // Load Leaflet CSS + JS via CDN
  useEffect(() => {
    if (document.getElementById('leaflet-css')) {
      setLeafletLoaded(true);
      return;
    }
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || viewMode !== 'map') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    if (!L) return;

    if (mapInstanceRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mapInstanceRef.current as any).remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true }).setView([15.0, 75.5], 7);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    KARNATAKA_DISTRICTS.forEach((d) => {
      const colors = RISK_COLORS[d.riskLevel] || RISK_COLORS.low;
      const filterKey = FILTER_KEYS[activeFilter];
      const count = d[filterKey] as number;
      const radius = Math.max(8, Math.min(30, count / 200));

      const circle = L.circle([d.lat, d.lng], {
        radius: radius * 2000,
        color: colors.leaflet,
        fillColor: colors.leaflet,
        fillOpacity: 0.35,
        weight: 2,
      }).addTo(map);

      const popup = L.popup().setContent(`
        <div style="background:#0a1628;color:#f1f5f9;padding:12px;border-radius:8px;min-width:200px;font-family:Inter,sans-serif">
          <div style="font-weight:700;font-size:15px;margin-bottom:6px;color:#00f0ff">${d.name}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px">
            <span style="color:#94a3b8">Risk Level:</span><span style="color:${colors.leaflet};font-weight:700">${d.riskLevel.toUpperCase()}</span>
            <span style="color:#94a3b8">Total Crimes:</span><span style="font-weight:600">${d.crimeCount.toLocaleString()}</span>
            <span style="color:#94a3b8">Active Cases:</span><span style="font-weight:600">${d.activeCases.toLocaleString()}</span>
            <span style="color:#94a3b8">Crime Rate:</span><span style="font-weight:600">${d.crimeRate}/1000</span>
          </div>
        </div>
      `);
      circle.bindPopup(popup);
      circle.on('click', () => setSelectedDistrict(d));
    });

    return () => {
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded, viewMode, activeFilter]);

  const getFilteredCount = (d: District): number => {
    const key = FILTER_KEYS[activeFilter];
    return d[key] as number;
  };

  const getTimeAdjusted = (count: number): number => {
    const factor = 1 - timeSlider / 100;
    return Math.round(count * factor);
  };

  const sortedDistricts = [...KARNATAKA_DISTRICTS].sort((a, b) => getFilteredCount(b) - getFilteredCount(a));

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
            <MapPin size={22} style={{ color: '#00f0ff' }} />
            KARNATAKA CRIME INTELLIGENCE MAP
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Real-time district risk visualization · {KARNATAKA_DISTRICTS.length} districts monitored · Live OpenStreetMap
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setViewMode('map')}
            className={viewMode === 'map' ? 'btn-primary' : 'cyber-btn'}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none' }}
          >
            <Layers size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Map View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'btn-primary' : 'cyber-btn'}
            style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none' }}
          >
            <Eye size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Grid View
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Filter size={15} style={{ color: '#00f0ff' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>FILTER:</span>
        {(Object.keys(FILTER_LABELS) as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: activeFilter === f ? '#00f0ff' : 'rgba(0,240,255,0.08)',
              color: activeFilter === f ? '#020617' : '#00f0ff',
              border: `1px solid ${activeFilter === f ? '#00f0ff' : 'rgba(0,240,255,0.25)'}`,
              transition: 'all 0.2s',
            }}
          >{FILTER_LABELS[f]}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Clock size={13} style={{ color: '#94a3b8' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Time Filter: </span>
          <input
            type="range" min={0} max={50} value={timeSlider}
            onChange={(e) => setTimeSlider(Number(e.target.value))}
            style={{ width: 120, accentColor: '#00f0ff' }}
          />
          <span style={{ color: '#00f0ff', fontSize: 12, fontWeight: 600, minWidth: 60 }}>
            {timeSlider === 0 ? 'Current' : `-${timeSlider}% data`}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card" style={{ padding: '10px 16px', marginBottom: 16, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 700 }}>RISK LEVEL:</span>
        {Object.entries(RISK_COLORS).map(([level, c]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.leaflet }} />
            <span style={{ fontSize: 12, color: c.text, fontWeight: 600, textTransform: 'uppercase' }}>{level}</span>
          </div>
        ))}
        <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 'auto' }}>
          Showing: <span style={{ color: '#00f0ff', fontWeight: 700 }}>{FILTER_LABELS[activeFilter]}</span>
        </span>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedDistrict ? '1fr 340px' : '1fr', gap: 16 }}>
        {/* Map or Grid */}
        <div>
          {viewMode === 'map' ? (
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 12, height: 560, position: 'relative' }}>
              {!leafletLoaded && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', zIndex: 10, background: 'rgba(2,6,23,0.8)', borderRadius: 12,
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: '#00f0ff', fontSize: 24, marginBottom: 8 }}>⌛</div>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading OpenStreetMap...</div>
                  </div>
                </div>
              )}
              <div
                ref={mapRef}
                style={{ width: '100%', height: '100%', filter: 'hue-rotate(180deg) invert(90%) saturate(0.5)' }}
              />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
              {sortedDistricts.map((d) => {
                const colors = RISK_COLORS[d.riskLevel] || RISK_COLORS.low;
                const count = getFilteredCount(d);
                const adjCount = getTimeAdjusted(count);
                const isSelected = selectedDistrict?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDistrict(isSelected ? null : d)}
                    style={{
                      background: isSelected ? colors.bg : 'var(--cyber-card)',
                      border: `1px solid ${isSelected ? colors.border : 'var(--cyber-border)'}`,
                      borderRadius: 10, padding: '12px 10px', cursor: 'pointer',
                      boxShadow: isSelected ? `0 0 12px ${colors.border}40` : 'none',
                      transition: 'all 0.2s', transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: colors.text, marginBottom: 4, textTransform: 'uppercase' }}>{d.riskLevel}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.3 }}>{d.name}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: colors.text, fontFamily: 'JetBrains Mono, monospace' }}>{adjCount.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{FILTER_LABELS[activeFilter]}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                      🏢 {d.policeStations} stations
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* District Intelligence Panel */}
        {selectedDistrict && (() => {
          const d = selectedDistrict;
          const colors = RISK_COLORS[d.riskLevel] || RISK_COLORS.low;
          return (
            <div
              className="glass-card"
              style={{
                padding: 20, borderRadius: 12, border: `1px solid ${colors.border}`,
                position: 'sticky', top: 80, height: 'fit-content', maxHeight: '80vh', overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{d.name}</div>
                  <span
                    className={`badge badge-${d.riskLevel === 'critical' ? 'red' : d.riskLevel === 'low' ? 'green' : 'amber'}`}
                  >{d.riskLevel.toUpperCase()} RISK</span>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Total Crimes', value: d.crimeCount.toLocaleString(), color: '#ef4444' },
                  { label: 'Active Cases', value: d.activeCases.toLocaleString(), color: '#f59e0b' },
                  { label: 'Crime Rate', value: `${d.crimeRate}/1k`, color: '#00f0ff' },
                  { label: 'YoY Change', value: `${d.change > 0 ? '+' : ''}${d.change}%`, color: d.change > 0 ? '#ef4444' : '#10b981' },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: 'var(--cyber-surface)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--cyber-border)' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: stat.color, fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Crime Breakdown Bars */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crime Breakdown</div>
                {[
                  { label: 'Cybercrime', value: d.cyberCrimes, max: 5000, color: '#00f0ff' },
                  { label: 'Theft', value: d.theft, max: 4000, color: '#8b5cf6' },
                  { label: 'Assault', value: d.assault, max: 2000, color: '#ef4444' },
                  { label: 'Fraud', value: d.fraud, max: 2500, color: '#f59e0b' },
                  { label: 'Narcotics', value: d.narcotics, max: 1500, color: '#e879f9' },
                  { label: 'Organized', value: d.organized, max: 1200, color: '#f97316' },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>{item.value.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 4, background: 'var(--cyber-surface)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(100, (item.value / item.max) * 100)}%`, background: item.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              <div style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#00f0ff', marginBottom: 6 }}>🤖 AI ANALYSIS</div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {d.name} shows <strong style={{ color: colors.text }}>{d.riskLevel.toUpperCase()}</strong> risk with {d.crimeCount.toLocaleString()} total crimes.
                  {d.change > 0
                    ? ` Crime rate is rising +${d.change}% YoY — requires immediate resource reinforcement.`
                    : ` Crime rate is declining ${d.change}% YoY — maintain current strategy.`}
                  {d.cyberCrimes > 500
                    ? ' Cybercrime is the primary threat vector — specialized cyber unit deployment recommended.'
                    : ' Violence and narcotics are key concerns requiring targeted intervention.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1, padding: '8px', fontSize: 12, fontWeight: 600, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                  📋 View Report
                </button>
                <button style={{ flex: 1, padding: '8px', fontSize: 12, fontWeight: 600, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer' }}>
                  🚨 Deploy Resources
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 20 }}>
        {[
          { label: 'Critical Districts', value: KARNATAKA_DISTRICTS.filter((d) => d.riskLevel === 'critical').length, color: '#ef4444', icon: AlertTriangle },
          { label: 'High Risk Districts', value: KARNATAKA_DISTRICTS.filter((d) => d.riskLevel === 'high').length, color: '#f59e0b', icon: Shield },
          { label: 'Police Stations', value: KARNATAKA_DISTRICTS.reduce((s, d) => s + d.policeStations, 0), color: '#00f0ff', icon: Users },
          { label: 'Total Active Cases', value: KARNATAKA_DISTRICTS.reduce((s, d) => s + d.activeCases, 0).toLocaleString(), color: '#8b5cf6', icon: Activity },
        ].map((stat) => (
          <div key={stat.label} className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <stat.icon size={20} style={{ color: stat.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: 'JetBrains Mono, monospace' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
