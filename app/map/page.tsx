'use client';

import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import * as d3 from 'd3';
import { 
  MapPin, AlertTriangle, Activity, Eye, Filter, Calendar, Users, 
  Map, TrendingUp, Info, ChevronRight, X, Sparkles, Plus, Clock, Search
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { TranslationSet } from '@/lib/translations';
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

const SOCIO_ECONOMIC_DATA: Record<string, { unemployment: number; density: number; urbanization: string }> = {
  "Bidar": { unemployment: 7.2, density: 210, urbanization: "Medium" },
  "Kalaburagi": { unemployment: 12.4, density: 160, urbanization: "Low" },
  "Yadgir": { unemployment: 9.8, density: 140, urbanization: "Low" },
  "Raichur": { unemployment: 11.2, density: 180, urbanization: "Low" },
  "Koppal": { unemployment: 6.8, density: 190, urbanization: "Low" },
  "Vijayapura": { unemployment: 8.5, density: 200, urbanization: "Medium" },
  "Bagalkot": { unemployment: 7.6, density: 220, urbanization: "Medium" },
  "Belagavi": { unemployment: 6.1, density: 360, urbanization: "Medium" },
  "Dharwad": { unemployment: 5.8, density: 440, urbanization: "High" },
  "Hubli-Dharwad": { unemployment: 5.6, density: 980, urbanization: "High" },
  "Gadag": { unemployment: 6.4, density: 200, urbanization: "Low" },
  "Uttara Kannada": { unemployment: 4.8, density: 130, urbanization: "Low" },
  "Haveri": { unemployment: 5.9, density: 230, urbanization: "Low" },
  "Ballari": { unemployment: 10.5, density: 390, urbanization: "High" },
  "Vijayanagara": { unemployment: 6.2, density: 180, urbanization: "Low" },
  "Davangere": { unemployment: 6.0, density: 310, urbanization: "Medium" },
  "Chitradurga": { unemployment: 7.1, density: 190, urbanization: "Low" },
  "Shivamogga": { unemployment: 5.2, density: 210, urbanization: "Medium" },
  "Udupi": { unemployment: 3.8, density: 300, urbanization: "Medium" },
  "Dakshina Kannada": { unemployment: 4.2, density: 450, urbanization: "High" },
  "Chikkamagaluru": { unemployment: 5.0, density: 160, urbanization: "Low" },
  "Hassan": { unemployment: 4.4, density: 280, urbanization: "Medium" },
  "Tumakuru": { unemployment: 5.1, density: 250, urbanization: "Medium" },
  "Chikkaballapur": { unemployment: 5.8, density: 310, urbanization: "Medium" },
  "Kolar": { unemployment: 6.7, density: 380, urbanization: "Medium" },
  "Bengaluru Rural": { unemployment: 4.9, density: 430, urbanization: "High" },
  "Bengaluru Urban": { unemployment: 5.2, density: 4380, urbanization: "Critical" },
  "Ramanagara": { unemployment: 5.4, density: 320, urbanization: "Medium" },
  "Mandya": { unemployment: 4.6, density: 360, urbanization: "Medium" },
  "Kodagu": { unemployment: 3.1, density: 130, urbanization: "Low" },
  "Mysuru": { unemployment: 5.3, density: 470, urbanization: "High" },
  "Chamarajanagar": { unemployment: 6.9, density: 180, urbanization: "Low" }
};

const getStationsForDistrict = (districtName: string) => {
  return [
    { name: `${districtName} Town Station`, latOffset: 0.12, lngOffset: -0.08, activeAlerts: 2, officers: 15 },
    { name: `${districtName} Rural Station`, latOffset: -0.10, lngOffset: 0.12, activeAlerts: 0, officers: 8 },
    { name: `${districtName} Industrial Zone Station`, latOffset: 0.04, lngOffset: 0.06, activeAlerts: 3, officers: 12 },
  ];
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


// Cache Karnataka GeoJSON globally to prevent reloading on navigations
let cachedGeoJson: any = null;

class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Map rendering crash caught by Boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: 'rgba(239,68,68,0.05)',
          border: '1.5px solid rgba(239,68,68,0.2)',
          borderRadius: '16px',
          margin: '20px 0',
          width: '100%'
        }}>
          <AlertTriangle size={36} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
            Map Visualizer Engine Failed
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            The WebGL / SVG projection rendering encountered a temporary memory or browser context issue.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Reset Engine
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HeatmapPage() {
  const { t, lang } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>("Kalaburagi");
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [geoJson, setGeoJson] = useState<any>(null);
  const [loadingMap, setLoadingMap] = useState(true);

  // New spatiotemporal drill-down, heatmap, and overlay states
  const [viewLevel, setViewLevel] = useState<'state' | 'district' | 'station'>('state');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'night'>('night');
  const [socialOverlay, setSocialOverlay] = useState<'none' | 'density' | 'unemployment'>('none');

  useEffect(() => {
    let active = true;
    if (cachedGeoJson) {
      setGeoJson(cachedGeoJson);
      setLoadingMap(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    fetch('https://raw.githubusercontent.com/inosaint/StatesOfIndia/master/karnataka.geojson', { signal: controller.signal })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then(data => {
        if (active) {
          cachedGeoJson = data;
          setGeoJson(data);
          setLoadingMap(false);
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error("Failed to load Karnataka GeoJSON, using schematic fallback:", err);
        if (active) {
          setLoadingMap(false);
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
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

      {/* Dynamic Drill-Down Breadcrumbs */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '12px 20px', 
          marginBottom: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        <span 
          style={{ color: '#2563EB', cursor: 'pointer' }} 
          onClick={() => { setViewLevel('state'); setSelectedStation(null); }}
        >
          Karnataka State
        </span>
        
        {viewLevel !== 'state' && selectedDistrict && (
          <>
            <span style={{ color: '#94A3B8' }}>/</span>
            <span 
              style={{ color: viewLevel === 'district' ? 'var(--text-primary)' : '#2563EB', cursor: 'pointer' }}
              onClick={() => { setViewLevel('district'); setSelectedStation(null); }}
            >
              {selectedDistrict} District
            </span>
          </>
        )}

        {viewLevel === 'station' && selectedStation && (
          <>
            <span style={{ color: '#94A3B8' }}>/</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {selectedStation}
            </span>
          </>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge badge-gray text-[10px] uppercase font-bold">
            Level: {viewLevel}
          </span>
        </div>
      </div>

      {/* Floating Controls Bar */}
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
          border: '1px solid #E5E7EB',
        }}
      >
        {/* Time of Day Heatmap Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={14} className="text-slate-500" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time of Day:</span>
          <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {(['morning', 'afternoon', 'night'] as const).map(time => (
              <button
                key={time}
                onClick={() => setTimeOfDay(time)}
                className="text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer"
                style={{
                  background: timeOfDay === time ? 'var(--primary-navy)' : 'transparent',
                  color: timeOfDay === time ? '#FFFFFF' : '#475569',
                  border: 'none',
                }}
              >
                {time.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: '#E5E7EB' }} />

        {/* Socio-Economic Overlay Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={14} className="text-slate-500" />
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Social Overlay:</span>
          <div className="flex gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {[
              { id: 'none', label: 'None' },
              { id: 'density', label: 'Pop. Density' },
              { id: 'unemployment', label: 'Unemployment' }
            ].map(overlay => (
              <button
                key={overlay.id}
                onClick={() => setSocialOverlay(overlay.id as any)}
                className="text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer"
                style={{
                  background: socialOverlay === overlay.id ? 'var(--primary-navy)' : 'transparent',
                  color: socialOverlay === overlay.id ? '#FFFFFF' : '#475569',
                  border: 'none',
                }}
              >
                {overlay.label}
              </button>
            ))}
          </div>
        </div>

        {/* Camera Export Snapshot Button */}
        <button
          onClick={() => {
            alert(`Map snapshot exported! Current filters: Time=${timeOfDay.toUpperCase()}, SocioOverlay=${socialOverlay.toUpperCase()}, ViewLevel=${viewLevel.toUpperCase()}`);
          }}
          className="cyber-btn flex-shrink-0"
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 800,
            background: 'rgba(15,107,92,0.08)',
            border: '1px solid rgba(15,107,92,0.2)',
            color: '#0F6B5C',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          <Camera size={12} />
          Export Snapshot
        </button>
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
 
          {/* SVG Map of Karnataka (Real District Choropleth dynamically projected) */}
          <MapErrorBoundary>
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

              if (geoJson) {
                if ((viewLevel === 'district' || viewLevel === 'station') && selectedDistrict) {
                  const selectedFeature = geoJson.features.find((f: any) => getDistrictKey(f.properties.NAME_2) === selectedDistrict);
                  if (selectedFeature) {
                    projection = d3.geoMercator().fitSize([mapWidth - 40, mapHeight - 40], selectedFeature);
                  } else {
                    projection = d3.geoMercator().fitSize([mapWidth - 40, mapHeight - 40], geoJson);
                  }
                } else {
                  projection = d3.geoMercator().fitSize([mapWidth - 40, mapHeight - 40], geoJson);
                }
                pathGenerator = d3.geoPath().projection(projection);
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
                        onDoubleClick={() => { setSelectedDistrict(name); setViewLevel('district'); }}
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
              if (viewLevel === 'state') {
                return (
                  <>
                    {geoJson.features.map((f: any, idx: number) => {
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
                      const hasSocialOverlay = socialOverlay !== 'none';

                      // Pulsing Red-Zone spikes (Kalaburagi, Raichur, Bengaluru Urban)
                      const hasCriticalSpike = key === 'Kalaburagi' || key === 'Raichur' || key === 'Bengaluru Urban';

                      return (
                        <g key={idx}>
                          <path
                            d={pathData}
                            fill={d.color}
                            fillOpacity={isHovered ? 0.85 : isSelected ? 0.8 : 0.45}
                            stroke={isHovered || isSelected ? 'var(--primary-navy)' : 'rgba(11, 31, 58, 0.15)'}
                            strokeWidth={isHovered ? 2 : isSelected ? 1.5 : 0.8}
                            onClick={() => setSelectedDistrict(key)}
                            onDoubleClick={() => { setSelectedDistrict(key); setViewLevel('district'); }}
                            onMouseEnter={() => setHoveredDistrict(key)}
                            onMouseLeave={() => setHoveredDistrict(null)}
                            style={{ cursor: 'pointer' }}
                          />
                          {hasCriticalSpike && cx && cy && (
                            <foreignObject x={cx - 15} y={cy - 15} width={30} height={30} style={{ pointerEvents: 'none' }}>
                              <div 
                                className="redzone-marker"
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  background: 'var(--color-red)',
                                  margin: '10px',
                                  boxShadow: '0 0 10px var(--color-red)'
                                }}
                              />
                            </foreignObject>
                          )}
                          {/* Socio-Economic Overlay Visual Layer */}
                          {hasSocialOverlay && cx && cy && (() => {
                            const sDist = SOCIO_ECONOMIC_DATA[key] || { density: 100, unemployment: 5 };
                            let overlayRadius = 0;
                            let overlayColor = '';
                            let overlayLabel = '';
                            if (socialOverlay === 'density') {
                              overlayRadius = Math.min(20, 6 + (sDist.density / 200));
                              overlayColor = '#7c3AED'; // Purple
                              overlayLabel = `${sDist.density}`;
                            } else if (socialOverlay === 'unemployment') {
                              overlayRadius = Math.min(20, 6 + (sDist.unemployment * 1.5));
                              overlayColor = '#f59e0b'; // Orange
                              overlayLabel = `${sDist.unemployment}%`;
                            }
                            return (
                              <g style={{ pointerEvents: 'none' }}>
                                <circle
                                  cx={cx}
                                  cy={cy + 18}
                                  r={overlayRadius}
                                  fill="none"
                                  stroke={overlayColor}
                                  strokeWidth={1.5}
                                  strokeDasharray="3 2"
                                  strokeOpacity={0.8}
                                />
                                <circle
                                  cx={cx}
                                  cy={cy + 18}
                                  r={3}
                                  fill={overlayColor}
                                  fillOpacity={0.9}
                                />
                                <text
                                  x={cx}
                                  y={cy + 18 - overlayRadius - 3}
                                  fill={overlayColor}
                                  fontSize="6px"
                                  fontWeight="900"
                                  textAnchor="middle"
                                >
                                  {overlayLabel}
                                </text>
                              </g>
                            );
                          })()}
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
                    })}

                    {/* Time of Day Heatmap Layer Overlay */}
                    {(() => {
                      const hotspots = [
                        { district: 'Kalaburagi', lat: 17.33, lng: 76.82, radius: timeOfDay === 'night' ? 36 : timeOfDay === 'afternoon' ? 24 : 12, color: timeOfDay === 'night' ? '#ef4444' : timeOfDay === 'afternoon' ? '#f59e0b' : '#10b981', opacity: 0.6 },
                        { district: 'Bengaluru Urban', lat: 12.97, lng: 77.59, radius: timeOfDay === 'night' ? 44 : timeOfDay === 'afternoon' ? 32 : 18, color: timeOfDay === 'night' ? '#ef4444' : timeOfDay === 'afternoon' ? '#f59e0b' : '#10b981', opacity: 0.55 },
                        { district: 'Raichur', lat: 16.21, lng: 77.36, radius: timeOfDay === 'night' ? 30 : timeOfDay === 'afternoon' ? 20 : 10, color: timeOfDay === 'night' ? '#ef4444' : timeOfDay === 'afternoon' ? '#f59e0b' : '#10b981', opacity: 0.6 },
                        { district: 'Vijayapura', lat: 16.83, lng: 75.72, radius: timeOfDay === 'night' ? 25 : timeOfDay === 'afternoon' ? 18 : 8, color: timeOfDay === 'night' ? '#ef4444' : timeOfDay === 'afternoon' ? '#f59e0b' : '#10b981', opacity: 0.5 },
                      ];

                      return hotspots.map((spot, i) => {
                        const coords = projection([spot.lng, spot.lat]);
                        if (!coords) return null;
                        const [x, y] = coords;
                        return (
                          <g key={`hotspot-${i}`} style={{ pointerEvents: 'none' }}>
                            <circle
                              cx={x}
                              cy={y}
                              r={spot.radius}
                              fill={spot.color}
                              fillOpacity={spot.opacity}
                            >
                              <animate attributeName="fill-opacity" values={`${spot.opacity};${spot.opacity * 0.4};${spot.opacity}`} dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle
                              cx={x}
                              cy={y}
                              r={spot.radius + 8}
                              fill="none"
                              stroke={spot.color}
                              strokeWidth={1.5}
                              strokeOpacity={0.4}
                            >
                              <animate attributeName="r" values={`${spot.radius};${spot.radius + 12}`} dur="2s" repeatCount="indefinite" />
                              <animate attributeName="stroke-opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                            </circle>
                          </g>
                        );
                      });
                    })()}
                  </>
                );
              }

              // Otherwise render ONLY selected district at zoomed view!
              const selectedFeature = geoJson.features.find((f: any) => getDistrictKey(f.properties.NAME_2) === selectedDistrict);
              if (!selectedFeature) return null;

              const pathData = pathGenerator(selectedFeature);
              const centroid = pathGenerator.centroid(selectedFeature);
              const [cx, cy] = centroid || [0, 0];
              const d = DISTRICT_DATA[selectedDistrict!] || { color: '#27AE60' };

              // Simulate police station coordinates around the centroid
              const stations = getStationsForDistrict(selectedDistrict!).map((s) => {
                const baseLng = selectedFeature.geometry.coordinates[0][0][0][0] || 76.8;
                const baseLat = selectedFeature.geometry.coordinates[0][0][0][1] || 17.3;
                const stationCoords = projection([
                  baseLng + s.lngOffset,
                  baseLat + s.latOffset
                ]);
                const [sx, sy] = stationCoords || [cx + s.lngOffset * 500, cy - s.latOffset * 500];
                return { ...s, sx, sy };
              });

              return (
                <g>
                  {/* District Boundary Zoomed Outline */}
                  <path
                    d={pathData}
                    fill={d.color}
                    fillOpacity={0.2}
                    stroke="var(--primary-navy)"
                    strokeWidth={3}
                  />

                  {/* Title overlay */}
                  <text
                    x={cx}
                    y={cy - 120}
                    textAnchor="middle"
                    fill="var(--primary-navy)"
                    fontSize="18px"
                    fontWeight="800"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {selectedDistrict!.toUpperCase()} DISTRICT MAP
                  </text>
                  <text
                    x={cx}
                    y={cy - 100}
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="11px"
                    fontWeight="600"
                  >
                    POLICE STATION-LEVEL DISPATCH GRID
                  </text>

                  {/* Police Station Marker dots */}
                  {stations.map((station, i) => {
                    const isStationSelected = selectedStation === station.name;
                    const isStationDimmed = viewLevel === 'station' && !isStationSelected;
                    
                    return (
                      <g 
                        key={i} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedStation(station.name);
                          setViewLevel('station');
                        }}
                      >
                        {/* Glow ring */}
                        <circle
                          cx={station.sx}
                          cy={station.sy}
                          r={14}
                          fill="none"
                          stroke={isStationSelected ? '#ef4444' : 'var(--primary-navy)'}
                          strokeWidth={2}
                          strokeOpacity={isStationDimmed ? 0.15 : 0.6}
                        >
                          <animate attributeName="r" values="8;18" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="stroke-opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        {/* Center marker */}
                        <circle
                          cx={station.sx}
                          cy={station.sy}
                          r={7}
                          fill={isStationSelected ? '#ef4444' : 'var(--primary-navy)'}
                          fillOpacity={isStationDimmed ? 0.2 : 1}
                        />
                        {/* Label */}
                        <text
                          x={station.sx}
                          y={station.sy + 20}
                          textAnchor="middle"
                          fill="var(--text-primary)"
                          fontSize="9px"
                          fontWeight="700"
                          fillOpacity={isStationDimmed ? 0.3 : 1}
                          style={{
                            textShadow: '0px 0px 3px #FFFFFF',
                          }}
                        >
                          {station.name.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })()}
          </svg>
          </MapErrorBoundary>

          {/* Interactive Floating Tooltip HUD */}
          {hoveredDistrict && (() => {
            const hDist = DISTRICT_DATA[hoveredDistrict];
            const sDist = SOCIO_ECONOMIC_DATA[hoveredDistrict] || { unemployment: 5.0, density: 200, urbanization: 'Medium' };
            return (
              <div
                className="tooltip animate-fadeIn"
                style={{
                  position: 'absolute',
                  left: tooltipPos.x + 15,
                  top: tooltipPos.y - 10,
                  zIndex: 100,
                  transform: 'translateY(-100%)',
                  background: '#FFFFFF',
                  borderColor: hDist.color,
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  pointerEvents: 'none',
                  borderRadius: '16px',
                  padding: '16px',
                  border: `1.5px solid ${hDist.color}`
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
                {/* Social Overlay stats */}
                {socialOverlay === 'density' && (
                  <div style={{ fontSize: '11px', color: '#7C3AED', marginTop: '4px', fontWeight: 600 }}>
                    Pop. Density: <strong>{sDist.density}/km²</strong>
                  </div>
                )}
                {socialOverlay === 'unemployment' && (
                  <div style={{ fontSize: '11px', color: '#f97316', marginTop: '4px', fontWeight: 600 }}>
                    Unemployment: <strong>{sDist.unemployment}%</strong>
                  </div>
                )}
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
              border: '1px solid #E5E7EB', 
              borderRadius: '16px', 
              padding: '12px 16px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              minWidth: '200px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>CRIME DENSITY SCALE</span>
            <div style={{ height: '8px', borderRadius: '4px', background: 'linear-gradient(to right, var(--color-green), var(--color-gold), var(--color-red))' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)' }}>
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

        </div>

        {/* RIGHT INTEL PANEL */}
        {viewLevel === 'station' && selectedStation ? (
          <aside
            className="glass-card flex flex-col justify-between animate-fadeInRight"
            style={{
              padding: '24px 20px',
              background: '#FFFFFF',
              borderLeft: '4px solid #ef4444',
              height: '620px',
              overflowY: 'auto',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedStation.toUpperCase()}
                  </h2>
                  <span className="badge badge-red text-[9px] mt-1.5 font-bold uppercase">
                    STATION LEVEL INTEL
                  </span>
                </div>
                <button
                  onClick={() => { setSelectedStation(null); setViewLevel('district'); }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Officers on Beat</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>12 Active</div>
                </div>
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Clearance MTD</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A34A', marginTop: '2px' }}>87.5%</div>
                </div>
              </div>

              {/* Active Patrol Teams */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Active Beat Patrols
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px', background: '#F9FAFB' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Patrol Team Alpha</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>Sector 3 Sand Quarries · Active Route NH-50</div>
                  </div>
                  <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px', background: '#F9FAFB' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Patrol Team Beta</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>Town Checkpost 4 · Border Route</div>
                  </div>
                </div>
              </div>

              {/* Localized AI Recommendations */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  LOCAL STATION DIRECTIVE
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={11} /> <strong>Patrol Priority:</strong></span> Increase presence at Sector 3 docks during 10 PM - 2 AM. AI model detects a 45% spike risk of unauthorized extractions.
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => alert(`Station logs exported for ${selectedStation}`)}
                className="cyber-btn"
                style={{ width: '100%', justifyContent: 'center', borderRadius: '16px', fontSize: '12px', background: '#E2E8F0', color: '#475569', border: 'none', padding: '8px', cursor: 'pointer', fontWeight: 700 }}
              >
                Export Station Logs
              </button>
            </div>
          </aside>
        ) : selectedDistrict && activeDistrict ? (
          <aside
            className="glass-card flex flex-col justify-between animate-fadeInRight"
            style={{
              padding: '24px 20px',
              background: 'var(--cyber-surface)',
              borderLeft: `4px solid ${activeDistrict.color}`,
              height: '620px',
              overflowY: 'auto',
            }}
          >
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    {selectedDistrict.toUpperCase()} {lang === 'kn' ? 'ಮಾಹಿತಿ' : 'INTEL'}
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
                    {(lang === 'kn' ? (activeDistrict.level === 'CRITICAL' ? t.priority_critical : t.priority_high) : activeDistrict.level)} {lang === 'kn' ? 'ಅಪಾಯ ಸೂಚ್ಯಂಕ' : 'RISK SCORE'}
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
                  <span>{lang === 'kn' ? 'ಲೆಕ್ಕಾಚಾರದ ಬೆದರಿಕೆ ಸೂಚ್ಯಂಕ:' : 'Calculated Threat Index:'}</span>
                  <span style={{ fontWeight: 800, color: activeDistrict.color }}>{activeDistrict.score}/100</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${activeDistrict.score}%`, background: activeDistrict.color }} />
                </div>
              </div>

              {/* Summary Stats list */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {[
                  { label: lang === 'kn' ? t.stat_active_cases : 'Active Cases', val: activeDistrict.crimes },
                  { label: lang === 'kn' ? t.stat_arrests_mtd : 'Arrests MTD', val: activeDistrict.arrests },
                  { label: lang === 'kn' ? t.stat_solved_cases : 'Solved Cases', val: activeDistrict.solved },
                  { label: lang === 'kn' ? t.stat_total_officers : 'Officers Deployed', val: activeDistrict.officers }
                ].map((stat, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '10px' }}>
                     <div style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{stat.label}</div>
                     <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                       <CountUp end={stat.val} />
                     </div>
                  </div>
                ))}
              </div>

              {/* Proactive Deployment Suggestion Badge */}
              {selectedDistrict === 'Kalaburagi' && (
                <div style={{
                  background: 'rgba(245,158,11,0.08)',
                  border: '1.5px solid rgba(245,158,11,0.25)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  marginBottom: '16px',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  color: '#b45309',
                  fontWeight: 700
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Sparkles size={11} /> <strong>Proactive Suggestion:</strong></span> Recommend dispatching +8 officers between 10 PM - 2 AM near river banks.
                </div>
              )}

              {/* Police Station List/Table */}
              <div style={{ marginBottom: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Police Stations in {selectedDistrict}
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E2E8F0', color: 'var(--text-dim)' }}>
                        <th style={{ padding: '6px 4px', fontWeight: 800 }}>Station Name</th>
                        <th style={{ padding: '6px 4px', fontWeight: 800, textAlign: 'center' }}>Active Cases</th>
                        <th style={{ padding: '6px 4px', fontWeight: 800, textAlign: 'center' }}>Risk Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStationsForDistrict(selectedDistrict).map((station, sIdx) => {
                        const stationRisk = activeDistrict.score - (sIdx * 10);
                        return (
                          <tr 
                            key={sIdx} 
                            style={{ 
                              borderBottom: '1px solid #F1F5F9', 
                              cursor: 'pointer',
                              background: selectedStation === station.name ? 'rgba(37,99,235,0.05)' : 'transparent'
                            }}
                            onClick={() => {
                              setSelectedStation(station.name);
                              setViewLevel('station');
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                            onMouseLeave={e => e.currentTarget.style.background = selectedStation === station.name ? 'rgba(37,99,235,0.05)' : 'transparent'}
                          >
                            <td style={{ padding: '8px 4px', fontWeight: 700, color: 'var(--text-primary)' }}>{station.name}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700 }}>{station.activeAlerts + 4}</td>
                            <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 700, color: activeDistrict.score - (sIdx * 10) > 80 ? '#ef4444' : activeDistrict.score - (sIdx * 10) > 60 ? '#f59e0b' : '#0F6B5C' }}>{stationRisk}/100</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Socio-Economic Factors Overlay analysis */}
              {selectedDistrict && SOCIO_ECONOMIC_DATA[selectedDistrict] && (
                <div style={{ marginBottom: '20px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    Socio-Economic Overlay
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    <div style={{ background: '#F9FAFB', padding: '8px 10px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Unemployment</span>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#f97316', marginTop: '2px' }}>
                        {SOCIO_ECONOMIC_DATA[selectedDistrict].unemployment}%
                      </div>
                    </div>
                    <div style={{ background: '#F9FAFB', padding: '8px 10px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: '9px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Pop. Density</span>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#7C3AED', marginTop: '2px' }}>
                        {SOCIO_ECONOMIC_DATA[selectedDistrict].density}/km²
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown Bars */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  {lang === 'kn' ? 'ಮುಖ್ಯ ಅಪರಾಧ ವಿಭಾಗಗಳು' : 'TOP CRIME CATEGORIES'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeDistrict.breakdown.map((item, idx) => {
                    let key = 'crime_other';
                    const l = item.label.toLowerCase();
                    if (l.includes('cyber') || l.includes('fraud')) key = 'crime_cybercrime';
                    else if (l.includes('theft')) key = 'crime_theft';
                    else if (l.includes('narcotics')) key = 'crime_narcotics';
                    else if (l.includes('assault')) key = 'crime_assault';
                    else if (l.includes('sand') || l.includes('mining') || l.includes('mafia')) key = 'crime_sand_mining';
                    else if (l.includes('organized')) key = 'crime_organized';

                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          <span>{t[key as keyof TranslationSet] || item.label}</span>
                          <span style={{ fontWeight: 700 }}>{item.pct}%</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.pct}%`, background: 'var(--cyber-cyan)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations directives checklist list */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  {lang === 'kn' ? 'AI ಶಿಫಾರಸುಗಳು' : 'AI RECOMMENDATIONS'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {activeDistrict.recommendations.map((rec, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--cyber-cyan)' }}>→</span>
                      <span>{lang === 'kn' ? 'ತಕ್ಷಣದ ಭದ್ರತಾ ಕಾರ್ಯವಿಧಾನವನ್ನು ನಿಯೋಜಿಸಿ' : rec}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommendation card bottom actions */}
            <div>
              <AIRecommendationCard
                action={lang === 'kn' ? 'ಗಸ್ತು ಹೆಚ್ಚಿಸಿ' : activeDistrict.recommendations[0]}
                rationale={lang === 'kn' ? `AI ವ್ಯವಸ್ಥೆಯು ${selectedDistrict} ನಲ್ಲಿ ಹೆಚ್ಚಿನ ಅಪಾಯದ ಅಂಶಗಳನ್ನು ಗುರುತಿಸಿದೆ.` : `AI models flagged high priority threat vectors inside ${selectedDistrict} requiring immediate tactical reinforcement.`}
                urgency={activeDistrict.level}
                priority={1}
              />
              
              {viewLevel === 'state' && (
                <button
                  onClick={() => setViewLevel('district')}
                  className="cyber-btn cyber-btn-cyan animate-pulse"
                  style={{ width: '100%', justifyContent: 'center', borderRadius: '16px', fontSize: '13px', padding: '10px', fontWeight: 700, marginTop: '12px', background: '#2563EB', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Search size={13} />
                    DRILL DOWN TO {selectedDistrict.toUpperCase()} DISTRICT
                  </span>
                </button>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button
                  onClick={() => alert(`District dossier generated for ${selectedDistrict}`)}
                  className="cyber-btn"
                  style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', textTransform: 'none' }}
                >
                  {lang === 'kn' ? 'ವರದಿ ನೋಡಿ' : 'View Full Report'}
                </button>
                <button
                  onClick={() => alert(`Tactical officers dispatched to coordinates in ${selectedDistrict}`)}
                  className="cyber-btn cyber-btn-cyan"
                  style={{ flex: 1, justifyContent: 'center', borderRadius: '8px', fontSize: '12px', textTransform: 'none' }}
                >
                  {lang === 'kn' ? 'ಅಧಿಕಾರಿಗಳನ್ನು ನಿಯೋಜಿಸಿ' : 'Assign Officers'}
                </button>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="glass-card flex items-center justify-center text-center p-6" style={{ height: '620px', color: 'var(--text-dim)', fontSize: '13px' }}>
            <div>
              <Map size={36} style={{ margin: '0 auto 12px', color: 'var(--cyber-cyan)' }} />
              {lang === 'kn' ? 'ಸ್ಥಳೀಯ ಬೆದರಿಕೆ ಗುಪ್ತಚರ ಲಾಗ್‌ಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು ನಕ್ಷೆಯಲ್ಲಿ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Select a district on the map to display localized threat intelligence logs.'}
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
