'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/heatmap/page.tsx — Karnataka District Heatmap with Risk Levels
// Red/Yellow/Green color-coded, AI Deployment Recommendations
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MapPin, Brain, Download, Zap, Shield, AlertTriangle, Loader,
  RefreshCw, ChevronRight, Activity, Users, Building
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { DISTRICTS, RESOURCE_ALLOCATION, SUMMARY_METRICS, type District } from '@/lib/crimeData';
import { getAnthropicApiKey, hasAnthropicApiKey } from '@/lib/apiKey';

// ─── Risk color mapping ───────────────────────────────────────────────────────

function getRiskColor(score: number): { fill: string; text: string; label: string; glow: string } {
  if (score >= 80) return { fill: 'rgba(239,68,68,0.85)', text: '#ef4444', label: 'CRITICAL', glow: 'rgba(239,68,68,0.4)' };
  if (score >= 60) return { fill: 'rgba(245,158,11,0.8)',  text: '#f59e0b', label: 'HIGH',     glow: 'rgba(245,158,11,0.35)' };
  if (score >= 40) return { fill: 'rgba(234,179,8,0.65)',  text: '#eab308', label: 'MEDIUM',   glow: 'rgba(234,179,8,0.25)' };
  return               { fill: 'rgba(16,185,129,0.7)',    text: '#10b981', label: 'LOW',      glow: 'rgba(16,185,129,0.25)' };
}

// ─── jsPDF loader ─────────────────────────────────────────────────────────────

async function loadJsPDF() {
  if ((window as unknown as Record<string, unknown>).jspdf) {
    return (window as unknown as Record<string, unknown>).jspdf as { jsPDF: new (o?: Record<string, unknown>) => JPDF };
  }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => resolve(); s.onerror = () => reject(new Error('jsPDF failed'));
    document.head.appendChild(s);
  });
  return (window as unknown as Record<string, unknown>).jspdf as { jsPDF: new (o?: Record<string, unknown>) => JPDF };
}

interface JPDF {
  setFontSize: (n: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  setFillColor: (r: number, g: number, b: number) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setFont: (f: string, style?: string) => void;
  text: (t: string, x: number, y: number, opts?: Record<string, unknown>) => void;
  rect: (x: number, y: number, w: number, h: number, s?: string) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  addPage: () => void;
  splitTextToSize: (t: string, w: number) => string[];
  save: (name: string) => void;
}

// ─── AI Deployment Generator ──────────────────────────────────────────────────

async function generateDeployment(district: District, apiKey: string): Promise<string> {
  const rc = RESOURCE_ALLOCATION.find(r => r.district === district.name);
  const riskColor = getRiskColor(district.riskScore);

  const prompt = `You are the Karnataka State Police AI Resource Optimization Engine. Generate a specific police deployment recommendation for:

District: ${district.name}
Risk Level: ${riskColor.label} (Score: ${district.riskScore}/100)
Crime Count: ${district.crimeCount.toLocaleString()} (Jan 2024–Jun 2025)
Top Crime: ${district.topCrimeType} | Trend: ${district.trend === 'up' ? '↑' : district.trend === 'down' ? '↓' : '→'} ${district.trendPercent}%
Crime Breakdown: Cybercrime ${district.cybercrime} | Theft ${district.theft} | Assault ${district.assault} | Narcotics ${district.narcotics} | Sand Mining ${district.sandMining} | Organized Crime ${district.organizedCrime}
Active Cases: ${district.activeCases} | Population: ${(district.population / 100000).toFixed(1)}L
Current Officers: ${district.officerCount} | Police Stations: ${district.stationCount}
Current Adequacy: ${rc ? `${rc.adequacyScore}/100` : 'Not assessed'}
Current Recommendation: ${rc?.recommendation ?? 'N/A'}

Write a 3-paragraph actionable deployment recommendation:
1. **Immediate Actions** (next 48 hours): Specific officer numbers, checkpoint locations, unit types
2. **Tactical Deployment** (next 30 days): Patrol schedules, special units, surveillance tech
3. **Strategic Recommendation** (3-6 months): Capacity building, inter-agency coordination

Be precise with numbers and specific Karnataka geography. Format as plain text paragraphs with section headers.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API Error ${response.status}`);
  const data = await response.json() as { content: { type: string; text: string }[] };
  return data.content?.[0]?.text ?? 'No recommendation generated.';
}

// ─── District Grid Cell ───────────────────────────────────────────────────────

function DistrictCell({ d, isSelected, onClick }: { d: District; isSelected: boolean; onClick: () => void }) {
  const rc = getRiskColor(d.riskScore);
  return (
    <button
      onClick={onClick}
      title={`${d.name} — Risk: ${d.riskScore}/100`}
      style={{
        padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
        background: isSelected ? rc.fill : `rgba(${d.riskScore > 80 ? '239,68,68' : d.riskScore > 60 ? '245,158,11' : d.riskScore > 40 ? '234,179,8' : '16,185,129'},${isSelected ? '0.85' : '0.15'})`,
        border: `1.5px solid ${isSelected ? rc.text : `rgba(${d.riskScore > 80 ? '239,68,68' : d.riskScore > 60 ? '245,158,11' : d.riskScore > 40 ? '234,179,8' : '16,185,129'},0.4)`}`,
        textAlign: 'center', transition: 'all 0.2s', fontFamily: 'inherit',
        boxShadow: isSelected ? `0 0 16px ${rc.glow}` : 'none',
        transform: isSelected ? 'scale(1.04)' : 'scale(1)',
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
    >
      <div style={{ fontSize: 9, fontWeight: 900, color: isSelected ? '#fff' : rc.text, lineHeight: 1.2, marginBottom: 3 }}>
        {d.name.replace('Bengaluru Urban', 'BLR Urban').replace('Bengaluru Rural', 'BLR Rural')
          .replace('Hubballi-Dharwad', 'Hubballi').replace('Chamarajanagar', 'Chamaraja')
          .replace('Chikkamagaluru', 'Chikkamagal.').replace('Chikkaballapur', 'Chikkaballa.')}
      </div>
      <div style={{ fontSize: 14, fontWeight: 900, color: isSelected ? '#fff' : rc.text }}>{d.riskScore}</div>
      <div style={{ fontSize: 7, color: isSelected ? 'rgba(255,255,255,0.8)' : '#64748b', fontWeight: 700 }}>RISK</div>
    </button>
  );
}

// ─── Main page content ────────────────────────────────────────────────────────

function HeatmapContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initName = searchParams.get('district');
  const initDistrict = initName ? DISTRICTS.find(d => d.name === initName) : DISTRICTS[0];

  const [selectedDistrict, setSelectedDistrict] = useState<District>(initDistrict ?? DISTRICTS[0]);
  const [deploymentRec, setDeploymentRec] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filterRisk, setFilterRisk] = useState('All');
  const [isDownloading, setIsDownloading] = useState(false);

  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const rc = getRiskColor(selectedDistrict.riskScore);
  const resource = RESOURCE_ALLOCATION.find(r => r.district === selectedDistrict.name);

  // Check key on mount
  useEffect(() => {
    setApiKeyMissing(!hasAnthropicApiKey());
  }, []);

  const filteredDistricts = filterRisk === 'All' ? DISTRICTS :
    filterRisk === 'Critical' ? DISTRICTS.filter(d => d.riskScore >= 80) :
    filterRisk === 'High' ? DISTRICTS.filter(d => d.riskScore >= 60 && d.riskScore < 80) :
    DISTRICTS.filter(d => d.riskScore < 60);

  const sortedDistricts = [...DISTRICTS].sort((a, b) => b.riskScore - a.riskScore);

  const handleGenerateDeployment = useCallback(async () => {
    const activeKey = getAnthropicApiKey();
    if (!activeKey) { setDeploymentRec('⚠️ API key not configured. Please enter your API key in the Investigator page first.'); return; }
    setIsGenerating(true);
    setDeploymentRec('');
    try {
      const rec = await generateDeployment(selectedDistrict, activeKey);
      setDeploymentRec(rec);
    } catch (err) {
      setDeploymentRec(`⚠️ Error: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedDistrict]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const lib = await loadJsPDF();
      const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = 210;

      // Header
      doc.setFillColor(2, 6, 23); doc.rect(0, 0, pw, 30, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
      doc.text('KARNATAKA STATE POLICE — DISTRICT HEATMAP REPORT', pw / 2, 12, { align: 'center' });
      doc.setFontSize(8); doc.setTextColor(0, 200, 220);
      doc.text('CrimeVision AI v5.0 | Risk Intelligence', pw / 2, 20, { align: 'center' });
      doc.setFontSize(7); doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST`, pw / 2, 27, { align: 'center' });

      let y = 40;
      // Title
      doc.setFont('helvetica', 'bold'); doc.setFontSize(14);
      doc.setTextColor(selectedDistrict.riskScore > 80 ? 200 : selectedDistrict.riskScore > 60 ? 180 : 0, 0, 0);
      doc.text(`${selectedDistrict.name.toUpperCase()} DISTRICT`, pw / 2, y, { align: 'center' }); y += 7;
      doc.setFontSize(10); doc.setTextColor(100, 100, 100);
      doc.text(`Risk Score: ${selectedDistrict.riskScore}/100 | ${rc.label}`, pw / 2, y, { align: 'center' }); y += 10;
      doc.setDrawColor(0, 200, 220); doc.line(15, y, pw - 15, y); y += 8;

      // Stats
      doc.setFillColor(240, 248, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 80, 140);
      doc.text('DISTRICT CRIME INTELLIGENCE', 18, y + 2); y += 12;

      const stats = [
        ['Total Crimes', selectedDistrict.crimeCount.toLocaleString()],
        ['Active Cases', selectedDistrict.activeCases.toLocaleString()],
        ['Top Crime', selectedDistrict.topCrimeType],
        ['Trend', `${selectedDistrict.trend === 'up' ? '▲' : selectedDistrict.trend === 'down' ? '▼' : '→'} ${selectedDistrict.trendPercent}%`],
        ['Officer Count', selectedDistrict.officerCount.toLocaleString()],
        ['Police Stations', selectedDistrict.stationCount.toString()],
        ['Population', `${(selectedDistrict.population / 100000).toFixed(1)}L`],
        ...(resource ? [['Adequacy Score', `${resource.adequacyScore}/100`]] : []),
      ];
      stats.forEach(([k, v], idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        if (idx % 2 === 0) doc.setFillColor(248, 252, 255);
        else doc.setFillColor(255, 255, 255);
        doc.rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFont('helvetica', 'bold'); doc.setTextColor(60, 60, 60); doc.setFontSize(8);
        doc.text(k, 18, y);
        doc.setFont('helvetica', 'normal'); doc.text(v, 90, y);
        y += 8;
      });

      // Crime breakdown
      y += 4;
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFillColor(240, 248, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 80, 140);
      doc.text('CRIME CATEGORY BREAKDOWN', 18, y + 2); y += 12;
      const breakdown = [
        ['Cybercrime', selectedDistrict.cybercrime],
        ['Theft', selectedDistrict.theft],
        ['Assault', selectedDistrict.assault],
        ['Narcotics', selectedDistrict.narcotics],
        ['Sand Mining', selectedDistrict.sandMining],
        ['Organized Crime', selectedDistrict.organizedCrime],
      ];
      breakdown.forEach(([k, v], idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        if (idx % 2 === 0) doc.setFillColor(248, 248, 255);
        else doc.setFillColor(255, 255, 255);
        doc.rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFont('helvetica', 'bold'); doc.setTextColor(60, 60, 60); doc.setFontSize(8);
        doc.text(k as string, 18, y);
        doc.setFont('helvetica', 'normal'); doc.text((v as number).toLocaleString(), 90, y);
        doc.text(`${(((v as number) / selectedDistrict.crimeCount) * 100).toFixed(1)}%`, 130, y);
        y += 8;
      });

      // AI Deployment
      if (deploymentRec) {
        y += 4;
        if (y > 245) { doc.addPage(); y = 20; }
        doc.setFillColor(230, 245, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 100, 60);
        doc.text('AI POLICE DEPLOYMENT RECOMMENDATION (CrimeNet AI)', 18, y + 2); y += 12;
        doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40); doc.setFontSize(8);
        const lines = doc.splitTextToSize(deploymentRec.replace(/\*\*/g, ''), pw - 30);
        for (const line of lines) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 15, y); y += 5;
        }
      }

      // All districts ranking
      doc.addPage(); y = 20;
      doc.setFillColor(240, 248, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 80, 140);
      doc.text('ALL 31 KARNATAKA DISTRICTS — RISK RANKING', 18, y + 2); y += 10;
      doc.setFillColor(0, 30, 60); doc.rect(15, y - 3, pw - 30, 7, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(8);
      ['Rank', 'District', 'Risk Score', 'Level', 'Top Crime'].forEach((h, i) => {
        doc.text(h, [15, 30, 80, 110, 135][i], y + 1);
      });
      y += 8;
      sortedDistricts.forEach((d, idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        const cr = getRiskColor(d.riskScore);
        if (idx % 2 === 0) doc.setFillColor(248, 252, 255);
        else doc.setFillColor(255, 255, 255);
        doc.rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
        doc.setTextColor(80, 80, 80); doc.text(`#${idx + 1}`, 15, y);
        doc.text(d.name, 30, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(d.riskScore > 80 ? 200 : d.riskScore > 60 ? 180 : 0, 0, 0);
        doc.text(`${d.riskScore}/100`, 80, y);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(80, 80, 80);
        doc.text(cr.label, 110, y);
        doc.text(d.topCrimeType, 135, y);
        y += 8;
      });

      // Footer
      doc.setDrawColor(200, 200, 200); doc.line(15, 283, pw - 15, 283);
      doc.setFontSize(7); doc.setTextColor(150, 150, 150);
      doc.text('CrimeVision AI v5.0 | KSP Datathon 2026 | Karnataka State Police | RESTRICTED', pw / 2, 289, { align: 'center' });

      doc.save(`KSP_Heatmap_${selectedDistrict.name.replace(/ /g, '_')}_${Date.now()}.pdf`);
    } catch (err) {
      alert(`PDF failed: ${(err as Error).message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} color="#ef4444" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>
              {t.page_heatmap ?? 'District Risk Heatmap'}
            </h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              31 Karnataka districts · Click any district for AI deployment recommendation
            </p>
          </div>
        </div>
        <button onClick={handleDownloadPDF} disabled={isDownloading}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10,
            background: 'rgba(0,240,255,0.08)', border: '1px solid rgba(0,240,255,0.3)',
            color: '#00f0ff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {isDownloading ? <><Loader size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating...</> : <><Download size={13} /> Download Heatmap PDF</>}
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Critical (80–100)', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
          { label: 'High (60–79)', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
          { label: 'Medium (40–59)', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
          { label: 'Low (0–39)', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 20, background: item.bg, border: `1px solid ${item.border}` }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {['All', 'Critical', 'High', 'Low'].map(f => (
            <button key={f} onClick={() => setFilterRisk(f)}
              style={{ padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${filterRisk === f ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: filterRisk === f ? 'rgba(0,240,255,0.1)' : 'transparent',
                color: filterRisk === f ? '#00f0ff' : '#64748b' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Heatmap Grid */}
        <div style={{ flex: 1 }}>
          <div style={{
            padding: 20, borderRadius: 16, background: 'rgba(2,6,23,0.9)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: 16 }}>
              Karnataka — 31 Districts by Risk Score (click to select)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 6 }}>
              {(filterRisk === 'All' ? sortedDistricts : filteredDistricts.sort((a, b) => b.riskScore - a.riskScore)).map(d => (
                <DistrictCell key={d.id} d={d} isSelected={selectedDistrict.id === d.id} onClick={() => { setSelectedDistrict(d); setDeploymentRec(''); }} />
              ))}
            </div>

            {/* Color bar at bottom */}
            <div style={{ marginTop: 20, height: 6, borderRadius: 3, background: 'linear-gradient(to right, #10b981, #eab308, #f59e0b, #ef4444)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: '#475569' }}>
              <span>Low Risk (0)</span>
              <span style={{ color: '#eab308' }}>Medium (40)</span>
              <span style={{ color: '#f59e0b' }}>High (60)</span>
              <span style={{ color: '#ef4444' }}>Critical (80–100)</span>
            </div>
          </div>
        </div>

        {/* District Detail Panel */}
        <div style={{ width: 340, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Selected District Header */}
          <div style={{
            padding: 18, borderRadius: 14,
            background: 'rgba(2,6,23,0.95)', border: `1px solid ${rc.text}40`,
            boxShadow: `0 0 24px ${rc.glow}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>SELECTED DISTRICT</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9' }}>{selectedDistrict.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: rc.text }}>{selectedDistrict.riskScore}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: rc.text, letterSpacing: '0.1em' }}>{rc.label}</div>
              </div>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: `${selectedDistrict.riskScore}%`, background: rc.text, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { icon: <Activity size={11} />, label: 'Total Crimes', value: selectedDistrict.crimeCount.toLocaleString() },
                { icon: <AlertTriangle size={11} />, label: 'Active Cases', value: selectedDistrict.activeCases.toLocaleString() },
                { icon: <Users size={11} />, label: 'Officers', value: selectedDistrict.officerCount.toLocaleString() },
                { icon: <Building size={11} />, label: 'Stations', value: selectedDistrict.stationCount.toString() },
              ].map(item => (
                <div key={item.label} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', marginBottom: 3 }}>
                    {item.icon}
                    <span style={{ fontSize: 9 }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Crime Breakdown */}
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              Crime Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Cybercrime', val: selectedDistrict.cybercrime, color: '#00f0ff' },
                { label: 'Theft', val: selectedDistrict.theft, color: '#8b5cf6' },
                { label: 'Assault', val: selectedDistrict.assault, color: '#ef4444' },
                { label: 'Narcotics', val: selectedDistrict.narcotics, color: '#e879f9' },
                { label: 'Sand Mining', val: selectedDistrict.sandMining, color: '#f97316' },
                { label: 'Org. Crime', val: selectedDistrict.organizedCrime, color: '#f59e0b' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 11 }}>
                    <span style={{ color: '#94a3b8' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.val.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(item.val / selectedDistrict.crimeCount) * 100}%`,
                      background: item.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Recommendation */}
          {resource && (
            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                Current Resource Assessment
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>Adequacy Score</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: resource.adequacyScore < 55 ? '#ef4444' : resource.adequacyScore < 70 ? '#f59e0b' : '#10b981' }}>
                  {resource.adequacyScore}/100
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, margin: 0, padding: '8px 10px',
                background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                {resource.recommendation}
              </p>
            </div>
          )}

          {/* AI Deployment */}
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: deploymentRec ? 12 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Brain size={13} color="#a78bfa" />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  AI Deployment Plan
                </span>
              </div>
              <button onClick={handleGenerateDeployment} disabled={isGenerating}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7,
                  background: isGenerating ? 'rgba(139,92,246,0.04)' : 'rgba(139,92,246,0.12)',
                  border: '1px solid rgba(139,92,246,0.35)', color: isGenerating ? '#64748b' : '#a78bfa',
                  fontSize: 10, fontWeight: 700, cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {isGenerating ? <><Loader size={10} style={{ animation: 'spin 0.8s linear infinite' }} /> Analyzing...</> : <><Zap size={10} /> Generate</>}
              </button>
            </div>

            {deploymentRec ? (
              <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{deploymentRec}</div>
            ) : !isGenerating && (
              <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>
                Generate AI-powered deployment recommendations specific to {selectedDistrict.name} district.
              </div>
            )}
          </div>

          {/* Trend comparison */}
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              State Context
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#64748b' }}>Rank (by risk)</span>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>
                  #{sortedDistricts.findIndex(d => d.id === selectedDistrict.id) + 1} of 31
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#64748b' }}>Trend</span>
                <span style={{ fontWeight: 700, color: selectedDistrict.trend === 'up' ? '#ef4444' : selectedDistrict.trend === 'down' ? '#10b981' : '#64748b' }}>
                  {selectedDistrict.trend === 'up' ? '↑' : selectedDistrict.trend === 'down' ? '↓' : '→'} {selectedDistrict.trendPercent}% YoY
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#64748b' }}>Top Crime</span>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{selectedDistrict.topCrimeType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: '#64748b' }}>% of State Total</span>
                <span style={{ fontWeight: 700, color: '#00f0ff' }}>
                  {((selectedDistrict.crimeCount / SUMMARY_METRICS.totalCrimes) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function HeatmapPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#64748b', fontSize: 14 }}>Loading heatmap...</div>}>
      <HeatmapContent />
    </Suspense>
  );
}
