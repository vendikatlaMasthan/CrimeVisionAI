'use client';

import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { 
  MapPin, AlertTriangle, Shield, Activity, Eye, Filter, Calendar, Users, 
  Map, TrendingUp, Info, ChevronRight, X, Sparkles, Plus, Clock
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import AIRecommendationCard from '@/components/AIRecommendationCard';

// ─── District Dataset with Lat/Lng & Crime Details ───────────────────────────

const DISTRICT_DATA: Record<string, {
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  crimes: number;
  color: string;
  lat: number;
  lng: number;
  policeStations: number;
  officers: number;
  arrests: number;
  solved: number;
  breakdown: { label: string; pct: number }[];
  recommendations: string[];
}> = {
  "Bidar": {
    score: 52, level: "MEDIUM", crimes: 1876, color: "#FFB300", lat: 17.91, lng: 77.52, policeStations: 32, officers: 45, arrests: 98, solved: 1400,
    breakdown: [{ label: "Narcotics", pct: 38 }, { label: "Theft", pct: 32 }, { label: "Cyber Fraud", pct: 18 }, { label: "Extortion", pct: 12 }],
    recommendations: ["Increase highway patrol on Bidar border", "Coordinate with MH Police checkpoint"]
  },
  "Kalaburagi": {
    score: 91, level: "CRITICAL", crimes: 4821, color: "#8B0000", lat: 17.33, lng: 76.82, policeStations: 48, officers: 87, arrests: 234, solved: 3102,
    breakdown: [{ label: "Sand Mafia", pct: 42 }, { label: "Narcotics", pct: 28 }, { label: "Land Grabbing", pct: 18 }, { label: "Extortion", pct: 12 }],
    recommendations: ["Deploy 12 additional units", "Increase riverbank surveillance", "Monitor NH-50 corridor"]
  },
  "Yadgir": {
    score: 58, level: "MEDIUM", crimes: 1612, color: "#FFB300", lat: 16.77, lng: 77.14, policeStations: 24, officers: 38, arrests: 74, solved: 1100,
    breakdown: [{ label: "Theft", pct: 44 }, { label: "Assault", pct: 32 }, { label: "Narcotics", pct: 14 }, { label: "Other", pct: 10 }],
    recommendations: ["Set up rural checkposts", "Audit local sand loading permits"]
  },
  "Raichur": {
    score: 87, level: "CRITICAL", crimes: 4102, color: "#8B0000", lat: 16.21, lng: 77.36, policeStations: 37, officers: 78, arrests: 198, solved: 2800,
    breakdown: [{ label: "Sand Mafia", pct: 46 }, { label: "Narcotics", pct: 24 }, { label: "Theft", pct: 18 }, { label: "Extortion", pct: 12 }],
    recommendations: ["Deploy river blockade units", "Monitor Tungabhadra sand docks"]
  },
  "Koppal": {
    score: 47, level: "MEDIUM", crimes: 1432, color: "#FFB300", lat: 15.35, lng: 76.16, policeStations: 28, officers: 42, arrests: 68, solved: 950,
    breakdown: [{ label: "Theft", pct: 48 }, { label: "Land Grabbing", pct: 22 }, { label: "Assault", pct: 20 }, { label: "Other", pct: 10 }],
    recommendations: ["Patrol irrigation canals", "Verify rural cooperative complaints"]
  },
  "Vijayapura": {
    score: 69, level: "HIGH", crimes: 3201, color: "#FF3B3B", lat: 16.83, lng: 75.72, policeStations: 39, officers: 58, arrests: 145, solved: 2100,
    breakdown: [{ label: "Narcotics", pct: 36 }, { label: "Theft", pct: 34 }, { label: "Assault", pct: 20 }, { label: "Extortion", pct: 10 }],
    recommendations: ["Reinforce NH-13 checkpoints", "Increase municipal night patrols"]
  },
  "Bagalkot": {
    score: 64, level: "HIGH", crimes: 2450, color: "#FF3B3B", lat: 16.18, lng: 75.70, policeStations: 36, officers: 48, arrests: 110, solved: 1700,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Sand Mafia", pct: 28 }, { label: "Assault", pct: 20 }, { label: "Cyber Fraud", pct: 10 }],
    recommendations: ["Monitor mining quarries", "Increase drone flyovers in rural sectors"]
  },
  "Belagavi": {
    score: 61, level: "HIGH", crimes: 2987, color: "#FF3B3B", lat: 15.85, lng: 74.50, policeStations: 67, officers: 84, arrests: 182, solved: 2000,
    breakdown: [{ label: "Narcotics", pct: 38 }, { label: "Theft", pct: 32 }, { label: "Land Grabbing", pct: 18 }, { label: "Other", pct: 12 }],
    recommendations: ["Deploy NH-48 mobile teams", "Brief border patrol checkpoints"]
  },
  "Dharwad": {
    score: 52, level: "MEDIUM", crimes: 1912, color: "#FFB300", lat: 15.46, lng: 74.99, policeStations: 31, officers: 44, arrests: 82, solved: 1300,
    breakdown: [{ label: "Cyber Fraud", pct: 34 }, { label: "Theft", pct: 32 }, { label: "Assault", pct: 22 }, { label: "Other", pct: 12 }],
    recommendations: ["Brief tech crime desk", "Install college zone cameras"]
  },
  "Hubli-Dharwad": {
    score: 49, level: "MEDIUM", crimes: 1654, color: "#FFB300", lat: 15.35, lng: 75.14, policeStations: 45, officers: 52, arrests: 88, solved: 1100,
    breakdown: [{ label: "Theft", pct: 40 }, { label: "Cyber Fraud", pct: 26 }, { label: "Assault", pct: 20 }, { label: "Extortion", pct: 14 }],
    recommendations: ["Increase city center patrols", "Deploy anti-snatching squads"]
  },
  "Gadag": {
    score: 44, level: "MEDIUM", crimes: 1320, color: "#FFB300", lat: 15.41, lng: 75.63, policeStations: 23, officers: 32, arrests: 48, solved: 900,
    breakdown: [{ label: "Theft", pct: 46 }, { label: "Assault", pct: 28 }, { label: "Land Grabbing", pct: 16 }, { label: "Other", pct: 10 }],
    recommendations: ["Deploy rural beat constables", "Audit crop theft reports"]
  },
  "Uttara Kannada": {
    score: 38, level: "LOW", crimes: 1120, color: "#27AE60", lat: 14.80, lng: 74.75, policeStations: 38, officers: 40, arrests: 54, solved: 800,
    breakdown: [{ label: "Theft", pct: 38 }, { label: "Assault", pct: 32 }, { label: "Smuggling", pct: 20 }, { label: "Other", pct: 10 }],
    recommendations: ["Increase port monitoring", "Check tourist transport manifests"]
  },
  "Haveri": {
    score: 46, level: "MEDIUM", crimes: 1512, color: "#FFB300", lat: 14.62, lng: 75.40, policeStations: 26, officers: 36, arrests: 62, solved: 1100,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Assault", pct: 30 }, { label: "Cyber Fraud", pct: 16 }, { label: "Other", pct: 12 }],
    recommendations: ["Patrol NH-4 corridors", "Setup emergency service booths"]
  },
  "Ballari": {
    score: 58, level: "MEDIUM", crimes: 2341, color: "#FFB300", lat: 15.14, lng: 76.92, policeStations: 41, officers: 62, arrests: 110, solved: 1600,
    breakdown: [{ label: "Organized Crime", pct: 38 }, { label: "Theft", pct: 30 }, { label: "Land Grabbing", pct: 20 }, { label: "Other", pct: 12 }],
    recommendations: ["Monitor mining syndicates", "Increase checkposts in steel town zones"]
  },
  "Vijayanagara": {
    score: 54, level: "MEDIUM", crimes: 1821, color: "#FFB300", lat: 15.34, lng: 76.46, policeStations: 30, officers: 42, arrests: 72, solved: 1300,
    breakdown: [{ label: "Theft", pct: 40 }, { label: "Assault", pct: 32 }, { label: "Land Grabbing", pct: 18 }, { label: "Other", pct: 10 }],
    recommendations: ["Brief tourist zone patrols", "Monitor heritage perimeter areas"]
  },
  "Davangere": {
    score: 47, level: "MEDIUM", crimes: 1567, color: "#FFB300", lat: 14.46, lng: 75.92, policeStations: 35, officers: 46, arrests: 64, solved: 1150,
    breakdown: [{ label: "Theft", pct: 44 }, { label: "Assault", pct: 28 }, { label: "Cyber Fraud", pct: 18 }, { label: "Other", pct: 10 }],
    recommendations: ["Setup commercial sector patrol", "Deploy market beat constables"]
  },
  "Chitradurga": {
    score: 49, level: "MEDIUM", crimes: 1720, color: "#FFB300", lat: 14.23, lng: 76.40, policeStations: 29, officers: 40, arrests: 78, solved: 1200,
    breakdown: [{ label: "Theft", pct: 40 }, { label: "Land Grabbing", pct: 26 }, { label: "Assault", pct: 20 }, { label: "Other", pct: 14 }],
    recommendations: ["Deploy highway patrol on NH-4", "Audit cooperative land listings"]
  },
  "Shivamogga": {
    score: 42, level: "MEDIUM", crimes: 1432, color: "#FFB300", lat: 13.93, lng: 75.56, policeStations: 33, officers: 39, arrests: 58, solved: 1000,
    breakdown: [{ label: "Theft", pct: 44 }, { label: "Assault", pct: 30 }, { label: "Land Grabbing", pct: 16 }, { label: "Other", pct: 10 }],
    recommendations: ["Monitor timber transport channels", "Setup forest outpost coordinates"]
  },
  "Udupi": {
    score: 33, level: "LOW", crimes: 1010, color: "#27AE60", lat: 13.35, lng: 74.75, policeStations: 19, officers: 28, arrests: 42, solved: 750,
    breakdown: [{ label: "Theft", pct: 36 }, { label: "Cyber Fraud", pct: 34 }, { label: "Assault", pct: 20 }, { label: "Other", pct: 10 }],
    recommendations: ["Coastal surveillance scans", "Student safety outreach drives"]
  },
  "Dakshina Kannada": {
    score: 35, level: "LOW", crimes: 1210, color: "#27AE60", lat: 12.84, lng: 75.30, policeStations: 31, officers: 36, arrests: 52, solved: 900,
    breakdown: [{ label: "Theft", pct: 38 }, { label: "Assault", pct: 34 }, { label: "Narcotics", pct: 18 }, { label: "Other", pct: 10 }],
    recommendations: ["Brief port custom checkpoints", "Establish border patrol squads"]
  },
  "Chikkamagaluru": {
    score: 31, level: "LOW", crimes: 980, color: "#27AE60", lat: 13.32, lng: 75.77, policeStations: 22, officers: 26, arrests: 34, solved: 700,
    breakdown: [{ label: "Theft", pct: 40 }, { label: "Assault", pct: 36 }, { label: "Land Grabbing", pct: 14 }, { label: "Other", pct: 10 }],
    recommendations: ["Monitor estate worker sectors", "Setup mountain pass patrol booths"]
  },
  "Hassan": {
    score: 24, level: "LOW", crimes: 743, color: "#27AE60", lat: 13.01, lng: 76.10, policeStations: 26, officers: 30, arrests: 38, solved: 550,
    breakdown: [{ label: "Theft", pct: 46 }, { label: "Assault", pct: 32 }, { label: "Other", pct: 22 }],
    recommendations: ["Deploy rural beat constables", "Increase highway patrol sweeps"]
  },
  "Tumakuru": {
    score: 35, level: "LOW", crimes: 1102, color: "#27AE60", lat: 13.34, lng: 77.10, policeStations: 41, officers: 44, arrests: 56, solved: 850,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Cyber Fraud", pct: 28 }, { label: "Assault", pct: 20 }, { label: "Other", pct: 10 }],
    recommendations: ["Establish city entry toll checkposts", "Monitor industrial corridors"]
  },
  "Chikkaballapur": {
    score: 38, level: "LOW", crimes: 1150, color: "#27AE60", lat: 13.43, lng: 77.73, policeStations: 25, officers: 32, arrests: 48, solved: 880,
    breakdown: [{ label: "Theft", pct: 40 }, { label: "Assault", pct: 32 }, { label: "Cyber Fraud", pct: 18 }, { label: "Other", pct: 10 }],
    recommendations: ["Check airport access routes", "Patrol national highway checkposts"]
  },
  "Kolar": {
    score: 41, level: "MEDIUM", crimes: 1340, color: "#FFB300", lat: 13.13, lng: 78.13, policeStations: 27, officers: 38, arrests: 62, solved: 1000,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Land Grabbing", pct: 24 }, { label: "Assault", pct: 22 }, { label: "Other", pct: 12 }],
    recommendations: ["Monitor mining borders", "Deploy checkposts on AP highway corridor"]
  },
  "Bengaluru Rural": {
    score: 33, level: "LOW", crimes: 876, color: "#27AE60", lat: 13.0, lng: 77.4, policeStations: 34, officers: 42, arrests: 48, solved: 680,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Cyber Fraud", pct: 28 }, { label: "Land Grabbing", pct: 20 }, { label: "Other", pct: 10 }],
    recommendations: ["Increase industrial sector surveillance", "Verify warehouse inventory records"]
  },
  "Bengaluru Urban": {
    score: 74, level: "HIGH", crimes: 9834, color: "#FF3B3B", lat: 12.97, lng: 77.59, policeStations: 114, officers: 185, arrests: 412, solved: 7800,
    breakdown: [{ label: "Cyber Fraud", pct: 54 }, { label: "Theft", pct: 26 }, { label: "Narcotics", pct: 12 }, { label: "Extortion", pct: 8 }],
    recommendations: ["Deploy specialized cyber task force", "Establish real-time OTP tracker logs", "Add 25 CCTV sites in Tech zones"]
  },
  "Ramanagara": {
    score: 36, level: "LOW", crimes: 1190, color: "#27AE60", lat: 12.71, lng: 77.28, policeStations: 22, officers: 30, arrests: 44, solved: 920,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Assault", pct: 30 }, { label: "Land Grabbing", pct: 18 }, { label: "Other", pct: 10 }],
    recommendations: ["Setup highway interception patrols", "Deploy rural beat constables"]
  },
  "Mandya": {
    score: 31, level: "LOW", crimes: 910, color: "#27AE60", lat: 12.52, lng: 76.89, policeStations: 29, officers: 34, arrests: 40, solved: 700,
    breakdown: [{ label: "Theft", pct: 44 }, { label: "Assault", pct: 36 }, { label: "Other", pct: 20 }],
    recommendations: ["Patrol agricultural terminals", "Increase highway safety awareness drives"]
  },
  "Kodagu": {
    score: 22, level: "LOW", crimes: 620, color: "#27AE60", lat: 12.33, lng: 75.78, policeStations: 14, officers: 20, arrests: 24, solved: 480,
    breakdown: [{ label: "Theft", pct: 40 }, { label: "Assault", pct: 38 }, { label: "Other", pct: 22 }],
    recommendations: ["Maintain current deployment", "Deploy tourist safety squads"]
  },
  "Mysuru": {
    score: 38, level: "LOW", crimes: 1203, color: "#27AE60", lat: 12.29, lng: 76.64, policeStations: 52, officers: 64, arrests: 98, solved: 950,
    breakdown: [{ label: "Theft", pct: 46 }, { label: "Cyber Fraud", pct: 24 }, { label: "Assault", pct: 18 }, { label: "Other", pct: 12 }],
    recommendations: ["Deploy night patrol units in Mysuru North", "Review CCTV logs on NH-275 corridor"]
  },
  "Chamarajanagar": {
    score: 28, level: "LOW", crimes: 820, color: "#27AE60", lat: 11.92, lng: 76.94, policeStations: 21, officers: 24, arrests: 30, solved: 620,
    breakdown: [{ label: "Theft", pct: 42 }, { label: "Assault", pct: 38 }, { label: "Other", pct: 20 }],
    recommendations: ["Coordinate border forest checkposts", "Setup wildlife reserve watchtowers"]
  }
};

// Map Projection helper
const getCoords = (lat: number, lng: number) => {
  const w = 450;
  const h = 550;
  // Latitude: 11.5 N (bottom) to 18.5 N (top)
  // Longitude: 74.0 E (left) to 78.5 E (right)
  const x = ((lng - 74.0) / (78.5 - 74.0)) * w;
  const y = h - ((lat - 11.5) / (18.5 - 11.5)) * h;
  return { x, y };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeatmapPage() {
  const { t, lang } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>("Kalaburagi");
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [geoJson, setGeoJson] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState(true);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/inosaint/StatesOfIndia/master/karnataka.geojson')
      .then(res => {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then(data => {
        setGeoJson(data);
        setLoadingMap(false);
      })
      .catch(err => {
        console.error("Failed to load Karnataka GeoJSON, using schematic fallback:", err);
        setLoadingMap(false);
      });
  }, []);

  const getDistrictKey = (name2: string) => {
    const name = name2.trim();
    const map: Record<string, string> = {
      'Bangalore Rural': 'Bengaluru Rural',
      'Bangalore Urban': 'Bengaluru Urban',
      'Chikmagalur': 'Chikkamagaluru',
      'Chikballapur': 'Chikkaballapur',
      'Mysore': 'Mysuru',
      'Shimoga': 'Shivamogga',
      'Gulbarga': 'Kalaburagi',
      'Bijapur': 'Vijayapura',
      'Bellary': 'Ballari',
      'Tumkur': 'Tumakuru',
      'Belgaum': 'Belagavi',
      'Dharwar': 'Dharwad',
      'North Kannada': 'Uttara Kannada',
      'Uttara Kannada': 'Uttara Kannada',
      'South Kannada': 'Dakshina Kannada',
      'Dakshina Kannada': 'Dakshina Kannada',
    };
    return map[name] || name;
  };

  const activeDistrict = selectedDistrict ? DISTRICT_DATA[selectedDistrict] : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="animate-page-fade" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      
      {/* Simulation Banner */}
      <SimulationBanner />

      {/* Floating Filter Bar */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '12px 20px', 
          marginBottom: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '14px', 
          flexWrap: 'wrap',
          background: '#FFFFFF',
          border: '1px solid var(--cyber-border)',
        }}
      >
        <Filter size={15} style={{ color: 'var(--cyber-cyan)' }} />
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Interactive Map filters:
        </span>
        
        <select style={{ background: 'var(--cyber-bg)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', outline: 'none' }}>
          <option>🗺 All Crime Types</option>
          <option>Sand Mafia</option>
          <option>Cyber Fraud</option>
          <option>Narcotics</option>
          <option>Vehicle Theft</option>
        </select>

        <select style={{ background: 'var(--cyber-bg)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', outline: 'none' }}>
          <option>📅 Date Range: 30 Days</option>
          <option>Last 7 Days</option>
          <option>This Quarter</option>
        </select>

        <select style={{ background: 'var(--cyber-bg)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', fontSize: '12px', padding: '4px 10px', borderRadius: '4px', outline: 'none' }}>
          <option>⚡ All Severities</option>
          <option>Critical Only</option>
          <option>High & Critical</option>
        </select>

        {/* View toggles */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', background: 'var(--cyber-bg)', padding: '2px', borderRadius: '6px', border: '1px solid var(--cyber-border)' }}>
          <button className="badge badge-cyan" style={{ fontSize: '10px', cursor: 'pointer', borderRadius: '4px' }}>Heatmap</button>
          <button className="badge" style={{ fontSize: '10px', cursor: 'pointer', background: 'transparent', color: 'var(--text-dim)', border: 'none' }} onClick={() => alert('Switching to Network layer...')}>Network</button>
          <button className="badge" style={{ fontSize: '10px', cursor: 'pointer', background: 'transparent', color: 'var(--text-dim)', border: 'none' }} onClick={() => alert('Switching to Deployment layer...')}>Deployment</button>
        </div>
      </div>

      {/* Main Grid: SVG Map left, Slide-in Panel right */}
      <div style={{ display: 'grid', gridTemplateColumns: activeDistrict ? '1fr 360px' : '1fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* MAP COLUMN */}
        <div className="glass-card relative" style={{ background: '#FFFFFF', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '620px', overflow: 'hidden' }}>
          
          {/* Statewide Stats Strip (Top Left Floating) */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: '#FFFFFF', border: '1px solid var(--cyber-border)', borderRadius: '12px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Statewide Overview</span>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Crimes: <strong style={{ color: 'var(--cyber-cyan)' }}>82,089</strong></div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High Risk Districts: <strong style={{ color: '#ef4444' }}>7</strong></div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Alerts: <strong style={{ color: '#f59e0b' }}>34</strong></div>
          </div>
 
          {/* SVG Map of Karnataka (Honeycomb representation centered on coordinates) */}
          {/* SVG Map of Karnataka (Real District Choropleth dynamically projected) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 520 600"
            style={{ width: '100%', maxHeight: '550px' }}
            onMouseMove={handleMouseMove}
          >
            {/* Background grid markings */}
            <defs>
              <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(30, 58, 95, 0.08)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
 
            {/* Map projection calculations */}
            {(() => {
              const mapWidth = 520;
              const mapHeight = 580;
              let projection: any = null;
              let pathGenerator: any = null;

              if (geoJson) {
                projection = d3.geoMercator().fitSize([mapWidth - 40, mapHeight - 40], geoJson);
                pathGenerator = d3.geoPath().projection(projection);
              }

              if (loadingMap) {
                return (
                  <g>
                    <text x="50%" y="45%" textAnchor="middle" fill="var(--text-primary)" fontSize="14px" fontWeight="700">
                      Initializing GIS Map Data...
                    </text>
                    <text x="50%" y="52%" textAnchor="middle" fill="var(--text-muted)" fontSize="11px">
                      Fetching official district coordinates chain from raw.githubusercontent.com
                    </text>
                  </g>
                );
              }

              if (!geoJson) {
                // FALLBACK: Honeycomb Cells
                return Object.entries(DISTRICT_DATA).map(([name, d]) => {
                  const { x, y } = getCoords(d.lat, d.lng);
                  const isSelected = selectedDistrict === name;
                  const isHovered = hoveredDistrict === name;
                  const r = 20;

                  const points = [];
                  for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    const px = x + r * Math.cos(angle);
                    const py = y + r * Math.sin(angle);
                    points.push(`${px},${py}`);
                  }
                  const pointsStr = points.join(' ');

                  return (
                    <g key={name}>
                      <polygon
                        points={pointsStr}
                        fill={d.color}
                        fillOpacity={isHovered ? 0.8 : isSelected ? 0.75 : 0.4}
                        stroke={isHovered || isSelected ? 'var(--primary-navy)' : 'rgba(30, 58, 95, 0.25)'}
                        strokeWidth={isHovered ? 2.5 : isSelected ? 2 : 1}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                        onClick={() => setSelectedDistrict(name)}
                        onMouseEnter={() => setHoveredDistrict(name)}
                        onMouseLeave={() => setHoveredDistrict(null)}
                      />
                      <text
                        x={x}
                        y={y + 3}
                        fill={isHovered || isSelected ? '#FFFFFF' : 'var(--text-muted)'}
                        fontSize="7.5px"
                        fontWeight="800"
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {name.substring(0, 5).toUpperCase()}
                      </text>
                    </g>
                  );
                });
              }

              // REAL CHOROPLETH RENDERING
              return geoJson.features.map((f: any, idx: number) => {
                const districtName = f.properties.NAME_2;
                const key = getDistrictKey(districtName);
                const d = DISTRICT_DATA[key] || {
                  score: 30, level: "LOW", color: "#27AE60",
                  crimes: 1000, lat: 0, lng: 0, policeStations: 10, officers: 10, arrests: 10, solved: 10,
                  breakdown: [], recommendations: ["General patrol reinforcement"]
                };
                const pathData = pathGenerator(f);
                const centroid = pathGenerator.centroid(f);
                const [cx, cy] = centroid || [0, 0];

                const isSelected = selectedDistrict === key;
                const isHovered = hoveredDistrict === key;

                return (
                  <g key={idx}>
                    <path
                      d={pathData}
                      fill={d.color}
                      fillOpacity={isHovered ? 0.85 : isSelected ? 0.8 : 0.45}
                      stroke={isHovered || isSelected ? 'var(--primary-navy)' : 'rgba(11, 31, 58, 0.15)'}
                      strokeWidth={isHovered ? 2 : isSelected ? 1.5 : 0.8}
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease-in-out' }}
                      onClick={() => setSelectedDistrict(key)}
                      onMouseEnter={() => setHoveredDistrict(key)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    />
                    {cx && cy && (
                      <text
                        x={cx}
                        y={cy + 3}
                        fill={isHovered || isSelected ? '#FFFFFF' : 'var(--text-muted)'}
                        fontSize="7px"
                        fontWeight="900"
                        textAnchor="middle"
                        pointerEvents="none"
                        style={{
                          textShadow: isHovered || isSelected 
                            ? '0px 0px 4px var(--primary-navy)' 
                            : '0px 0px 3px rgba(255,255,255,0.95)',
                          fontFamily: "'Inter', sans-serif",
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {key.substring(0, 5).toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              });
            })()}
          </svg>

          {/* Interactive Floating Tooltip HUD */}
          {hoveredDistrict && (() => {
            const hDist = DISTRICT_DATA[hoveredDistrict];
            return (
              <div
                className="tooltip"
                style={{
                  position: 'absolute',
                  left: tooltipPos.x + 15,
                  top: tooltipPos.y - 10,
                  zIndex: 100,
                  transform: 'translateY(-100%)',
                  background: '#FFFFFF',
                  borderColor: hDist.color,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '13px' }}>
                  {hoveredDistrict.toUpperCase()} DISTRICT
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Threat Score: <strong style={{ color: hDist.color }}>{hDist.score}/100 ({hDist.level})</strong>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Active Cases: <strong>{hDist.crimes.toLocaleString()}</strong>
                </div>
              </div>
            );
          })()}

          {/* Map Color Legend (Bottom Left Floating) */}
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '20px', 
              zIndex: 10, 
              background: '#FFFFFF', 
              border: '1px solid var(--cyber-border)', 
              borderRadius: '12px', 
              padding: '12px 16px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px' 
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LEGEND</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f87171' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b0000', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} />
              🔴 CRITICAL (81-100)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#fb923c' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF3B3B', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} />
              🟠 HIGH (61-80)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#fbbf24' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFB300', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} />
              🟡 MEDIUM (41-60)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#34d399' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27AE60', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} />
              🟢 LOW (0-40)
            </div>
          </div>

        </div>

        {/* RIGHT INTEL PANEL */}
        {selectedDistrict && activeDistrict ? (
          <aside
            className="glass-card flex flex-col justify-between animate-fadeInRight"
            style={{
              padding: '24px 20px',
              background: 'var(--cyber-surface)',
              borderLeft: `2.5px solid ${activeDistrict.color}`,
              height: '620px',
              overflowY: 'auto',
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedDistrict.toUpperCase()} INTEL
                  </h2>
                  <span 
                    className="badge" 
                    style={{ 
                      fontSize: '9px', 
                      marginTop: '4px',
                      background: activeDistrict.level === 'CRITICAL' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: activeDistrict.level === 'CRITICAL' ? '#ef4444' : '#fbbf24',
                      border: `1px solid ${activeDistrict.color}`,
                    }}
                  >
                    {activeDistrict.level} RISK SCORE
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDistrict(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Threat dial */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Calculated Threat Index:</span>
                  <span style={{ fontWeight: 800, color: activeDistrict.color }}>{activeDistrict.score}/100</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${activeDistrict.score}%`, background: activeDistrict.color }} />
                </div>
              </div>

              {/* Summary Stats list */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                  { label: 'Active Cases', val: activeDistrict.crimes },
                  { label: 'Arrests MTD', val: activeDistrict.arrests },
                  { label: 'Solved Cases', val: activeDistrict.solved },
                  { label: 'Officers Deployed', val: activeDistrict.officers }
                ].map((stat, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{stat.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                      <CountUp end={stat.val} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown Bars */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  TOP CRIME CATEGORIES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeDistrict.breakdown.map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 700 }}>{item.pct}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.pct}%`, background: 'var(--cyber-cyan)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations directives checklist list */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  AI RECOMMENDATIONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {activeDistrict.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--cyber-cyan)' }}>→</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommendation card bottom actions */}
            <div>
              <AIRecommendationCard
                action={activeDistrict.recommendations[0]}
                rationale={`AI models flagged high priority threat vectors inside ${selectedDistrict} requiring immediate tactical reinforcement.`}
                urgency={activeDistrict.level}
                priority={1}
              />
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button
                  onClick={() => alert(`District dossier generated for ${selectedDistrict}`)}
                  className="cyber-btn"
                  style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', textTransform: 'none' }}
                >
                  View Full Report
                </button>
                <button
                  onClick={() => alert(`Tactical officers dispatched to coordinates in ${selectedDistrict}`)}
                  className="cyber-btn cyber-btn-cyan"
                  style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', fontSize: '12px', textTransform: 'none' }}
                >
                  Assign Officers
                </button>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="glass-card flex items-center justify-center text-center p-6" style={{ height: '620px', color: 'var(--text-dim)', fontSize: '13px' }}>
            <div>
              <Map size={36} style={{ margin: '0 auto 12px', color: 'var(--cyber-cyan)' }} />
              Select a district hexagon on the map to display localized threat intelligence logs.
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
