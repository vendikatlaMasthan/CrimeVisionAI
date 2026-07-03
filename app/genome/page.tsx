'use client';
import { useState, useMemo } from 'react';
import {
  Dna, Search, Zap, Eye, ChevronRight, AlertTriangle, Clock,
  MapPin, Shield, Link2, Fingerprint, Target, Activity, User
} from 'lucide-react';
import { FIR_RECORDS, CRIMINAL_PROFILES, FIRRecord } from '@/lib/mockData';
import { SearchInput } from '@/components/SearchInput';

// ─────────────────────────────────────────────
// DNA COMPUTATION UTILITIES
// ─────────────────────────────────────────────

type TimeCode = 'N' | 'D' | 'E' | 'M';
type MethodCode = 'CY' | 'TH' | 'AS' | 'NA' | 'OR' | 'FR' | 'RP' | 'MR' | 'DR' | 'FN' | 'SM';
type TargetCode = 'YTH' | 'ADL' | 'SNR' | 'ELD';

interface CrimeDNA {
  timeCode: TimeCode;
  locationCode: string;
  methodCode: MethodCode;
  targetCode: TargetCode;
  fullDNA: string;
}

function getTimeCode(dateStr: string): TimeCode {
  const day = parseInt(dateStr.split('-')[2], 10);
  const mod = day % 4;
  if (mod === 1) return 'N';
  if (mod === 2) return 'D';
  if (mod === 3) return 'E';
  return 'M';
}

function getLocationCode(district: string): string {
  return district.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
}

function getMethodCode(category: string): MethodCode {
  const map: Record<string, MethodCode> = {
    'Cybercrime': 'CY',
    'Theft & Burglary': 'TH',
    'Assault & Violence': 'AS',
    'Narcotic Trafficking': 'NA',
    'Organized Crime': 'OR',
    'Fraud': 'FR',
    'Rape': 'RP',
    'Murder': 'MR',
    'Drug Cases': 'DR',
    'Financial Fraud': 'FN',
    'Sand Mining': 'SM',
  };
  return map[category] ?? 'FR';
}

function getTargetCode(age: number): TargetCode {
  if (age <= 25) return 'YTH';
  if (age <= 50) return 'ADL';
  if (age <= 70) return 'SNR';
  return 'ELD';
}

function computeDNA(fir: FIRRecord): CrimeDNA {
  const timeCode = getTimeCode(fir.date);
  const locationCode = getLocationCode(fir.district);
  const methodCode = getMethodCode(fir.crimeCategory);
  const targetCode = getTargetCode(fir.victimDetails.age);
  return {
    timeCode,
    locationCode,
    methodCode,
    targetCode,
    fullDNA: `${timeCode}-${locationCode}-${methodCode}-${targetCode}`,
  };
}

function computeSimilarity(a: CrimeDNA, b: CrimeDNA): number {
  let score = 0;
  if (a.timeCode === b.timeCode) score += 25;
  if (a.locationCode === b.locationCode) score += 25;
  if (a.methodCode === b.methodCode) score += 25;
  if (a.targetCode === b.targetCode) score += 25;
  return score;
}

// ─────────────────────────────────────────────
// LABEL MAPS
// ─────────────────────────────────────────────

const TIME_LABELS: Record<TimeCode, string> = {
  N: 'Night',
  D: 'Day',
  E: 'Evening',
  M: 'Morning',
};

const METHOD_LABELS: Record<MethodCode, string> = {
  CY: 'Cybercrime',
  TH: 'Theft',
  AS: 'Assault',
  NA: 'Narcotics',
  OR: 'Organized',
  FR: 'Fraud',
  RP: 'Rape',
  MR: 'Murder',
  DR: 'Drug Cases',
  FN: 'Fin. Fraud',
  SM: 'Sand Mining',
};

const TARGET_LABELS: Record<TargetCode, string> = {
  YTH: 'Youth (≤25)',
  ADL: 'Adult (26-50)',
  SNR: 'Senior (51-70)',
  ELD: 'Elderly (71+)',
};

const CLUSTER_NAMES: Record<string, string> = {
  CY: 'Cybercrime Ring',
  NA: 'Narcotics Network',
  OR: 'Organized Syndicate',
  TH: 'Theft Gang',
  FR: 'Fraud Network',
  AS: 'Assault Cluster',
  RP: 'Assault Ring',
  MR: 'Violent Syndicate',
  DR: 'Drug Cartel',
  FN: 'Financial Network',
  SM: 'Mining Mafia',
};

const HIGH_RISK_METHODS: MethodCode[] = ['CY', 'NA', 'OR', 'MR'];

// ─────────────────────────────────────────────
// STAT CARD COMPONENT
// ─────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card p-4 flex flex-col items-center gap-1 min-w-[130px]">
      <span className="text-2xl font-bold font-mono" style={{ color }}>{value}</span>
      <span className="metric-label text-xs text-center">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// DNA BADGE
// ─────────────────────────────────────────────

function DNABadge({ dna }: { dna: string }) {
  return (
    <span className="font-mono text-amber-400 text-xs tracking-wider">
      🧬 {dna}
    </span>
  );
}

// ─────────────────────────────────────────────
// SIMILARITY BAR
// ─────────────────────────────────────────────

function SimilarityBar({ score }: { score: number }) {
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#0F6B5C';

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span
        className="text-xs font-bold font-mono px-2 py-0.5 rounded border"
        style={{ color, borderColor: color }}
      >
        {score}% MATCH
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// DNA VECTOR BLOCK
// ─────────────────────────────────────────────

interface VectorBlockProps {
  code: string;
  label: string;
  sublabel: string;
  bgColor: string;
  glowColor?: string;
  barHeight: number;
}

function VectorBlock({ code, label, sublabel, bgColor, barHeight }: VectorBlockProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Bar visualization */}
      <div
        className="w-10 rounded-t-sm transition-all duration-500"
        style={{
          height: `${barHeight}px`,
          backgroundColor: bgColor,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      />
      {/* Code block */}
      <div
        className="px-4 py-3 rounded-lg text-center min-w-[80px]"
        style={{
          backgroundColor: `${bgColor}20`,
          border: `1px solid ${bgColor}60`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="text-xl font-black font-mono tracking-widest"
          style={{ color: bgColor }}
        >
          {code}
        </div>
        <div className="text-[9px] font-semibold tracking-[0.15em] mt-1 text-slate-400 uppercase">
          {label}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">{sublabel}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CATEGORY BADGE
// ─────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    'Cybercrime': 'badge-cyan',
    'Theft & Burglary': 'badge-purple',
    'Sand Mining': 'badge-amber',
    'Assault & Violence': 'badge-red',
    'Narcotic Trafficking': 'badge-red',
    'Organized Crime': 'badge-amber',
    'Fraud': 'badge-amber',
    'Rape': 'badge-red',
    'Murder': 'badge-red',
    'Drug Cases': 'badge-red',
    'Financial Fraud': 'badge-amber',
  };
  return (
    <span className={`badge ${colorMap[category] ?? 'badge-gray'} text-[10px]`}>
      {category}
    </span>
  );
}

// ─────────────────────────────────────────────
// RISK BADGE
// ─────────────────────────────────────────────

function RiskBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Critical: 'badge-red',
    High: 'badge-amber',
    Medium: 'badge-cyan',
    Low: 'badge-green',
  };
  return (
    <span className={`badge ${colorMap[level] ?? 'badge-gray'} text-[10px]`}>
      {level}
    </span>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function GenomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState<'matches' | 'clusters'>('matches');

  // Pre-compute DNA for all records
  const dnaMap = useMemo(() => {
    const map: Record<string, CrimeDNA> = {};
    FIR_RECORDS.forEach((fir) => {
      map[fir.id] = computeDNA(fir);
    });
    return map;
  }, []);

  // Filtered cases
  const filteredRecords = useMemo(() => {
    const q = filterText.toLowerCase();
    if (!q) return FIR_RECORDS;
    return FIR_RECORDS.filter(
      (f) =>
        f.firNumber.toLowerCase().includes(q) ||
        f.crimeCategory.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        dnaMap[f.id]?.fullDNA.toLowerCase().includes(q)
    );
  }, [filterText, dnaMap]);

  // Selected FIR
  const selectedFIR = useMemo(
    () => FIR_RECORDS.find((f) => f.id === selectedId) ?? null,
    [selectedId]
  );
  const selectedDNA = selectedFIR ? dnaMap[selectedFIR.id] : null;

  const deviations = useMemo(() => {
    if (!selectedFIR || !selectedDNA) return null;
    const timeDev = 15 + (selectedDNA.timeCode.charCodeAt(0) % 7) * 11;
    const geoDev = 20 + (selectedDNA.locationCode.charCodeAt(0) % 9) * 8;
    const methodDev = 10 + (selectedDNA.methodCode.charCodeAt(0) % 8) * 12;
    const targetDev = 25 + (selectedDNA.targetCode.charCodeAt(0) % 6) * 13;
    const isAnomaly = (timeDev + geoDev + methodDev + targetDev) / 4 > 52;
    return { timeDev, geoDev, methodDev, targetDev, isAnomaly };
  }, [selectedFIR, selectedDNA]);

  // Top 5 similar FIRs (excluding the selected one)
  const topMatches = useMemo(() => {
    if (!selectedFIR || !selectedDNA) return [];
    return FIR_RECORDS.filter((f) => f.id !== selectedFIR.id)
      .map((f) => ({
        fir: f,
        dna: dnaMap[f.id],
        score: computeSimilarity(selectedDNA, dnaMap[f.id]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [selectedFIR, selectedDNA, dnaMap]);

  // DNA risk level
  const dnaRiskLevel = useMemo(() => {
    if (!selectedDNA) return 'Medium';
    return HIGH_RISK_METHODS.includes(selectedDNA.methodCode) ? 'High' : 'Medium';
  }, [selectedDNA]);

  // Pattern clusters from top matches (grouped by method code)
  const patternClusters = useMemo(() => {
    if (!selectedDNA) return [];
    const allRelated = [
      ...(selectedFIR ? [{ fir: selectedFIR, dna: selectedDNA, score: 100 }] : []),
      ...topMatches,
    ];
    const clusterMap: Record<string, { count: number; score: number }> = {};
    allRelated.forEach(({ dna }) => {
      const key = dna.methodCode;
      if (!clusterMap[key]) clusterMap[key] = { count: 0, score: 0 };
      clusterMap[key].count += 1;
      clusterMap[key].score += 1;
    });
    return Object.entries(clusterMap).map(([method, { count }]) => ({
      method: method as MethodCode,
      name: CLUSTER_NAMES[method] ?? 'Unknown Cluster',
      count,
      riskScore: HIGH_RISK_METHODS.includes(method as MethodCode) ? 87 + count * 2 : 55 + count * 5,
    }));
  }, [selectedFIR, selectedDNA, topMatches]);

  // Associates chain from selected suspect
  const associateChain = useMemo(() => {
    if (!selectedFIR) return [];
    const associates = selectedFIR.suspectDetails.knownAssociates ?? [];
    return associates;
  }, [selectedFIR]);

  const statusColorMap: Record<string, string> = {
    investigating: '#f59e0b',
    arrested: '#ef4444',
    resolved: '#10b981',
    monitoring: '#0F6B5C',
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-app)', padding: '24px' }}>
      {/* ── HEADER ── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0F6B5C20, #0F6B5C40)',
                border: '1px solid #0F6B5C60',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <Dna size={28} className="neon-cyan" />
            </div>
            <div>
              <h1 className="page-title flex items-center gap-3">
                CRIME PATTERN GENOME
                <span className="badge badge-red text-[11px] tracking-widest">
                  🔒 CLASSIFIED SYSTEM
                </span>
              </h1>
              <p className="page-subtitle mt-0.5">
                AI-powered crime DNA fingerprinting &amp; pattern matching engine
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mt-4">
          <StatCard label="Total Cases Analyzed" value={55} color="#0F6B5C" />
          <StatCard label="Genome Matches Found" value={23} color="#10b981" />
          <StatCard label="Pattern Clusters" value={8} color="#8b5cf6" />
          <StatCard label="Accuracy" value="94.7%" color="#f59e0b" />
        </div>
      </div>

      {/* ── GENOME BUILDER HEADER ── */}
      <div
        className="glass-card p-4 mb-6"
        style={{
          border: '1px solid #0F6B5C30',
          background: 'linear-gradient(135deg, #0F6B5C08, #8b5cf608)',
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Fingerprint size={18} className="neon-cyan" />
            <span className="section-title text-sm">GENOME DNA FORMULA</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm">
            <span
              className="px-3 py-1 rounded"
              style={{ background: '#8b5cf620', border: '1px solid #8b5cf660', color: '#a78bfa' }}
            >
              TIME_CODE
            </span>
            <span className="text-slate-500">+</span>
            <span
              className="px-3 py-1 rounded"
              style={{ background: '#3b82f620', border: '1px solid #3b82f660', color: '#60a5fa' }}
            >
              LOCATION_CODE
            </span>
            <span className="text-slate-500">+</span>
            <span
              className="px-3 py-1 rounded"
              style={{ background: '#ef444420', border: '1px solid #ef444460', color: '#f87171' }}
            >
              METHOD_CODE
            </span>
            <span className="text-slate-500">+</span>
            <span
              className="px-3 py-1 rounded"
              style={{ background: '#f59e0b20', border: '1px solid #f59e0b60', color: '#fcd34d' }}
            >
              TARGET_CODE
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Activity size={14} className="neon-green" />
            <span className="text-xs text-green-400">Pattern Engine ONLINE</span>
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div className="flex gap-6" style={{ minHeight: '72vh' }}>
        {/* ─── LEFT: CASE LIST (40%) ─── */}
        <div className="flex flex-col" style={{ width: '40%', minWidth: 0 }}>
          <div className="glass-card flex flex-col h-full" style={{ border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            {/* Panel header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1.5px solid var(--border-default)' }}
            >
              <div className="flex items-center gap-2">
                <Target size={16} className="neon-cyan" />
                <span className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>FIR Case Registry</span>
                <span className="badge badge-cyan text-[10px]">{filteredRecords.length}</span>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3" style={{ borderBottom: '1.5px solid var(--border-default)' }}>
              <SearchInput
                placeholder="Search FIR, category, district, DNA..."
                value={filterText}
                onChange={setFilterText}
              />
            </div>

            {/* Case list */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {filteredRecords.length === 0 && (
                <div className="text-center text-slate-500 py-8 text-sm">
                  No cases match your filter.
                </div>
              )}
              {filteredRecords.map((fir) => {
                const dna = dnaMap[fir.id];
                const isSelected = fir.id === selectedId;
                return (
                  <button
                    key={fir.id}
                    onClick={() => setSelectedId(fir.id)}
                    className="w-full text-left p-3 rounded-xl"
                    style={{
                      background: isSelected ? 'rgba(11, 31, 58, 0.05)' : 'var(--bg-card)',
                      border: isSelected ? '1.5px solid var(--primary-navy)' : '1.5px solid var(--border-default)',
                      borderLeft: isSelected ? '4px solid var(--primary-navy)' : '1.5px solid var(--border-default)',
                      boxShadow: isSelected ? 'var(--shadow-card)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: isSelected ? 'var(--primary-navy)' : 'var(--text-primary)' }}
                      >
                        {fir.firNumber}
                      </span>
                      <CategoryBadge category={fir.crimeCategory} />
                    </div>
                    <div className="mb-1.5">
                      <DNABadge dna={dna.fullDNA} />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={10} />
                        {fir.district}
                      </div>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          color: statusColorMap[fir.investigationStatus],
                          background: `${statusColorMap[fir.investigationStatus]}18`,
                          border: `1px solid ${statusColorMap[fir.investigationStatus]}40`,
                        }}
                      >
                        {fir.investigationStatus}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── RIGHT: GENOME ANALYSIS (60%) ─── */}
        <div className="flex flex-col gap-5" style={{ width: '60%', minWidth: 0 }}>
          {!selectedFIR ? (
            /* ── EMPTY STATE ── */
            <div
              className="glass-card flex-1 flex flex-col items-center justify-center gap-6 p-12"
              style={{ border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', minHeight: '300px' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(11, 31, 58, 0.05)',
                  border: '1.5px solid var(--border-default)',
                }}
              >
                <Dna size={40} style={{ color: 'var(--primary-navy)' }} />
              </div>
              <div className="text-center">
                <h2 className="section-title mb-2" style={{ color: 'var(--text-primary)' }}>SELECT A CASE</h2>
                <p className="text-slate-500 text-sm max-w-sm">
                  Select a case from the registry to generate its Crime Pattern Genome
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Selected Case Header */}
              <div 
                className="glass-card p-4 mb-4" 
                style={{ 
                  border: '1.5px solid var(--border-default)', 
                  background: 'var(--bg-card)', 
                  boxShadow: 'var(--shadow-card)' 
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Fingerprint size={18} style={{ color: 'var(--primary-navy)' }} />
                    <span className="font-bold text-sm text-[var(--text-primary)]" style={{ fontSize: '15px' }}>
                      CASE DETAILS — {selectedFIR.firNumber}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(11, 31, 58, 0.05)', color: 'var(--primary-navy)' }}>
                    Risk Score: {selectedFIR.riskScore}/100
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {selectedFIR.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {selectedFIR.district}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={11} /> {selectedFIR.assignedOfficer}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={11} /> Category: {selectedFIR.crimeCategory}
                  </span>
                </div>
              </div>

              {/* Tab Header Bar */}
              <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border-default)', marginBottom: '16px' }}>
                <button
                  onClick={() => setActiveTab('matches')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: activeTab === 'matches' ? 'var(--primary-navy)' : 'var(--text-muted)',
                    borderBottom: activeTab === 'matches' ? '3px solid var(--primary-navy)' : '3px solid transparent',
                    background: 'transparent',
                    borderLeft: 'none', borderRight: 'none', borderTop: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    marginBottom: '-1.5px',
                  }}
                >
                  <Zap size={14} style={{ color: activeTab === 'matches' ? 'var(--primary-navy)' : 'var(--text-muted)' }} />
                  <span>Pattern Matches & Anomalies</span>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '10px', 
                      background: activeTab === 'matches' ? 'var(--primary-navy)' : 'var(--border-default)', 
                      color: activeTab === 'matches' ? '#FFFFFF' : 'var(--text-secondary)' 
                    }}
                  >
                    {topMatches.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('clusters')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: activeTab === 'clusters' ? 'var(--primary-navy)' : 'var(--text-muted)',
                    borderBottom: activeTab === 'clusters' ? '3px solid var(--primary-navy)' : '3px solid transparent',
                    background: 'transparent',
                    borderLeft: 'none', borderRight: 'none', borderTop: 'none',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    marginBottom: '-1.5px',
                  }}
                >
                  <Link2 size={14} style={{ color: activeTab === 'clusters' ? 'var(--primary-navy)' : 'var(--text-muted)' }} />
                  <span>Forensic Link & Clusters</span>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '10px', 
                      background: activeTab === 'clusters' ? 'var(--primary-navy)' : 'var(--border-default)', 
                      color: activeTab === 'clusters' ? '#FFFFFF' : 'var(--text-secondary)' 
                    }}
                  >
                    {patternClusters.length}
                  </span>
                </button>
              </div>

              {/* Tab 1: Pattern Matches & Anomalies */}
              {activeTab === 'matches' && (
                <>
                  {/* Consolidated Alert Banner & Anomaly Explainability Panel */}
                  {deviations && (
                    <div className="glass-card p-5 mb-4" style={{ border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
                      
                      {/* Consolidated Alert Banner */}
                      {(() => {
                        const averageDeviation = Math.round((deviations.timeDev + deviations.geoDev + deviations.methodDev + deviations.targetDev) / 4);
                        const isAnomaly = deviations.isAnomaly;
                        const riskLevel = selectedFIR.riskScore > 80 ? 'CRITICAL' : selectedFIR.riskScore > 60 ? 'HIGH' : 'MEDIUM';
                        const alertColor = isAnomaly ? 'var(--alert-red)' : 'var(--success-green)';
                        const alertBg = isAnomaly ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)';
                        
                        return (
                          <div 
                            style={{ 
                              padding: '12px 16px', 
                              borderRadius: '8px', 
                              background: alertBg,
                              border: `1.5px solid ${alertColor}`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '20px'
                            }}
                          >
                            <AlertTriangle size={20} style={{ color: alertColor }} />
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: alertColor }}>
                                {isAnomaly ? 'ANOMALOUS PATTERN DETECTED' : 'TYPICAL PATTERN VERIFIED'} — RISK: {riskLevel}
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                                {isAnomaly 
                                  ? `Case shows an atypical modus operandi with an average DNA profile deviation of ${averageDeviation}%.`
                                  : `Case pattern is consistent with standard historical baselines.`}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex items-center gap-2 mb-4">
                        <Fingerprint size={18} style={{ color: 'var(--primary-navy)' }} />
                        <span className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>CRIME DNA DEVIATION PROFILE</span>
                      </div>

                      {/* Unified Visualization: 4 Vertical Bars */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '24px 0', alignItems: 'end' }}>
                        {[
                          { label: 'TIME', code: selectedDNA!.timeCode, sub: TIME_LABELS[selectedDNA!.timeCode], val: deviations.timeDev },
                          { label: 'GEO', code: selectedDNA!.locationCode, sub: selectedFIR.district.substring(0, 10), val: deviations.geoDev },
                          { label: 'METHOD', code: selectedDNA!.methodCode, sub: METHOD_LABELS[selectedDNA!.methodCode], val: deviations.methodDev },
                          { label: 'TARGET', code: selectedDNA!.targetCode, sub: TARGET_LABELS[selectedDNA!.targetCode], val: deviations.targetDev },
                        ].map((vector, idx) => {
                          const barColor = vector.val > 60 
                            ? 'var(--alert-red)' 
                            : vector.val > 30 
                              ? 'var(--warning-amber)' 
                              : 'var(--success-green)';
                          
                          return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: barColor }}>{vector.val}%</span>
                              <div style={{ width: '28px', height: '100px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                <div 
                                  style={{ 
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${Math.max(8, vector.val)}%`, 
                                    background: barColor, 
                                    borderRadius: '4px',
                                    transition: 'all 0.3s ease'
                                  }} 
                                />
                              </div>
                              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)' }}>{vector.label}: {vector.code}</div>
                                <div 
                                  style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px' }} 
                                  title={vector.sub}
                                >
                                  {vector.sub}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Vector Explanation Text list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', borderTop: '1px solid var(--border-default)', paddingTop: '16px' }}>
                        {[
                          { label: 'Time Code Deviation', val: deviations.timeDev, desc: 'Hour of occurrence deviates from expected typical peak hours (11 PM - 3 AM).' },
                          { label: 'Geo Location Deviation', val: deviations.geoDev, desc: 'Crime registered in a low-incident sector for this category.' },
                          { label: 'Method Code Deviation', val: deviations.methodDev, desc: 'Modus operandi (method code) is rarely seen in this type of offense.' },
                          { label: 'Target Code Deviation', val: deviations.targetDev, desc: 'Victim profile or property target class is atypical for this region.' }
                        ].map((item, i) => {
                          const barColor = item.val > 60 
                            ? 'var(--alert-red)' 
                            : item.val > 30 
                              ? 'var(--warning-amber)' 
                              : 'var(--success-green)';
                          return (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: barColor }} />
                              <div className="flex-1 text-xs">
                                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{item.label} ({item.val}%):</span>{' '}
                                <span style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── 2. DNA MATCH ANALYSIS ── */}
                  <div
                    className="glass-card p-5"
                    style={{ border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Zap size={18} style={{ color: 'var(--warning-amber)' }} />
                      <span className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>PATTERN MATCH RESULTS — SIMILAR CRIME DNA</span>
                    </div>

                    {topMatches.length === 0 ? (
                      <p className="text-slate-500 text-sm">No matches found.</p>
                    ) : (
                      <div className="space-y-3">
                        {topMatches.map(({ fir, dna, score }) => (
                          <div
                            key={fir.id}
                            className="p-3 rounded-xl"
                            style={{
                              background: 'var(--neutral-light)',
                              border: '1px solid var(--border-default)',
                            }}
                          >
                            {/* Similarity bar */}
                            <div className="mb-2">
                              <SimilarityBar score={score} />
                            </div>
                            {/* FIR + DNA row */}
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="font-mono text-xs text-slate-700 font-bold">
                                {fir.firNumber}
                              </span>
                              <DNABadge dna={dna.fullDNA} />
                              <CategoryBadge category={fir.crimeCategory} />
                            </div>
                            {/* Component match indicators */}
                            <div className="flex gap-3 mb-2">
                              {(
                                [
                                  {
                                    label: 'TIME',
                                    match: dna.timeCode === selectedDNA!.timeCode,
                                  },
                                  {
                                    label: 'GEO',
                                    match: dna.locationCode === selectedDNA!.locationCode,
                                  },
                                  {
                                    label: 'METHOD',
                                    match: dna.methodCode === selectedDNA!.methodCode,
                                  },
                                  {
                                    label: 'TARGET',
                                    match: dna.targetCode === selectedDNA!.targetCode,
                                  },
                                ] as { label: string; match: boolean }[]
                              ).map(({ label, match }) => (
                                <div
                                  key={label}
                                  className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded"
                                  style={{
                                    background: match ? 'rgba(46, 139, 87, 0.08)' : 'rgba(211, 47, 47, 0.08)',
                                    border: `1px solid ${match ? 'rgba(46, 139, 87, 0.2)' : 'rgba(211, 47, 47, 0.2)'}`,
                                    color: match ? 'var(--success-green)' : 'var(--alert-red)',
                                  }}
                                >
                                  {match ? '✓' : '✗'} {label}
                                </div>
                              ))}
                            </div>
                            {/* District + suspect */}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={10} /> {fir.district}
                              </span>
                              <span className="flex items-center gap-1">
                                <User size={10} /> {fir.suspectDetails.name}
                              </span>
                              <RiskBadge level={fir.suspectDetails.riskLevel} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tab 2: Forensic Link & Clusters */}
              {activeTab === 'clusters' && (
                <>
                  {/* ── 3. PATTERN CLUSTER INTELLIGENCE ── */}
                  <div
                    className="glass-card p-5"
                    style={{ border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Link2 size={18} style={{ color: 'var(--primary-navy)' }} />
                      <span className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>ORGANIZED CRIME PATTERN CLUSTER</span>
                    </div>
                    <div className="space-y-3">
                      {patternClusters.map(({ method, name, count, riskScore }) => {
                        const isCurrent = selectedDNA?.methodCode === method;
                        const clusterColor = HIGH_RISK_METHODS.includes(method)
                          ? 'var(--alert-red)'
                          : 'var(--warning-amber)';
                        return (
                          <div
                            key={method}
                            className="p-4 rounded-xl"
                            style={{
                              background: isCurrent ? 'rgba(11, 31, 58, 0.03)' : 'var(--neutral-light)',
                              border: `1px solid ${isCurrent ? 'var(--primary-navy)' : 'var(--border-default)'}`,
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                                  style={{
                                    background: 'var(--neutral-white)',
                                    color: 'var(--primary-navy)',
                                    border: '1px solid var(--border-default)',
                                  }}
                                >
                                  {method}
                                </span>
                                <span className="text-sm font-semibold text-slate-800">{name}</span>
                                {isCurrent && (
                                  <span className="badge badge-cyan text-[10px]" style={{ background: 'var(--primary-navy)', color: '#fff' }}>ACTIVE</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">{count} cases</span>
                                <span
                                  className="text-xs font-bold font-mono"
                                  style={{ color: clusterColor }}
                                >
                                  Risk: {riskScore}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600">
                              Pattern analysis suggests{' '}
                              <span style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>{name}</span> with{' '}
                              <strong>{count}</strong> connected case{count !== 1 ? 's' : ''}. High
                              probability of coordinated activity. Recommend cross-referencing with
                              existing SIT investigation files.
                            </p>
                            <button
                              onClick={() =>
                                console.log(`Investigate cluster: ${name} (method=${method})`)
                              }
                              className="cyber-btn mt-3 text-xs flex items-center gap-1"
                              style={{ border: '1px solid var(--border-default)', padding: '6px 12px', background: '#fff', cursor: 'pointer' }}
                            >
                              <Target size={11} />
                              Investigate Cluster
                              <ChevronRight size={11} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── 4. FORENSIC LINK CHAIN ── */}
                  <div
                    className="glass-card p-5"
                    style={{ border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle size={18} style={{ color: 'var(--alert-red)' }} />
                      <span className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>FORENSIC LINK CHAIN</span>
                      <span className="text-xs text-slate-500 ml-auto font-bold">
                        Associate network — {selectedFIR.suspectDetails.name}
                      </span>
                    </div>

                    {/* Chain visualization */}
                    <div className="overflow-x-auto pb-2">
                      <div className="flex items-center gap-0 min-w-max">
                        {/* Primary suspect bubble */}
                        <div className="flex flex-col items-center">
                          <div
                            className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-center"
                            style={{
                              background: 'rgba(211, 47, 47, 0.05)',
                              border: '2px solid var(--alert-red)',
                              boxShadow: 'var(--shadow-card)',
                            }}
                          >
                            <Shield size={16} className="text-red-600 mb-1" />
                            <span className="text-[9px] font-bold text-red-600 leading-tight px-1 text-center">
                              {selectedFIR.suspectDetails.name.split(' ')[0]}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-col items-center gap-1">
                            <RiskBadge level={selectedFIR.suspectDetails.riskLevel} />
                            <span className="text-[9px] text-slate-500">PRIMARY</span>
                          </div>
                        </div>

                        {/* Chain links + associate bubbles */}
                        {associateChain.map((assocName, idx) => {
                          const assocProfile = CRIMINAL_PROFILES.find(
                            (p) => p.name === assocName
                          );
                          return (
                            <div key={idx} className="flex items-center">
                              {/* Connector line */}
                              <div className="flex items-center">
                                <div
                                  className="h-0.5 w-8"
                                  style={{
                                    background:
                                      'linear-gradient(90deg, rgba(211,47,47,0.3), rgba(245,158,11,0.3))',
                                  }}
                                />
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center"
                                  style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                  }}
                                >
                                  <Link2 size={8} className="text-amber-600" />
                                </div>
                                <div
                                  className="h-0.5 w-8"
                                  style={{
                                    background:
                                      'linear-gradient(90deg, rgba(245,158,11,0.3), rgba(11,31,58,0.2))',
                                  }}
                                />
                              </div>
                              {/* Associate bubble */}
                              <div className="flex flex-col items-center">
                                <div
                                  className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-center"
                                  style={{
                                    background: assocProfile
                                      ? 'rgba(245, 158, 11, 0.05)'
                                      : 'rgba(11, 31, 58, 0.02)',
                                    border: assocProfile
                                      ? '2px solid var(--warning-amber)'
                                      : '2px dashed var(--neutral-medium)',
                                  }}
                                >
                                  <Eye
                                    size={14}
                                    style={{
                                      color: assocProfile ? 'var(--warning-amber)' : 'var(--text-muted)',
                                      marginBottom: 4,
                                    }}
                                  />
                                  <span
                                    className="text-[9px] font-bold leading-tight px-1 text-center"
                                    style={{
                                      color: assocProfile ? 'var(--warning-amber)' : 'var(--text-secondary)',
                                    }}
                                  >
                                    {assocName.split(' ')[0]}
                                  </span>
                                </div>
                                <div className="mt-2 flex flex-col items-center gap-1">
                                  {assocProfile ? (
                                    <RiskBadge level={assocProfile.riskLevel} />
                                  ) : (
                                    <span className="badge badge-gray text-[10px]">KNOWN</span>
                                  )}
                                  <span className="text-[9px] text-slate-500">ASSOCIATE</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Unknown final node */}
                        <div className="flex items-center">
                          <div
                            className="h-0.5 w-8"
                            style={{
                              background: 'linear-gradient(90deg, rgba(11,31,58,0.2), rgba(211,47,47,0.2))',
                            }}
                          />
                          <div
                            className="w-4 h-4 rounded-full flex items-center justify-center"
                            style={{
                              background: 'rgba(211, 47, 47, 0.1)',
                              border: '1px solid rgba(211, 47, 47, 0.3)',
                            }}
                          >
                            <AlertTriangle size={8} className="text-red-600" />
                          </div>
                          <div
                            className="h-0.5 w-8"
                            style={{
                              background: 'linear-gradient(90deg, rgba(211,47,47,0.2), var(--alert-red))',
                            }}
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <div
                            className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-center animate-pulse"
                            style={{
                              background: 'rgba(211, 47, 47, 0.05)',
                              border: '2px dashed var(--alert-red)',
                            }}
                          >
                            <AlertTriangle size={14} className="text-red-600 mb-1" />
                            <span className="text-[8px] font-bold text-red-600 leading-tight text-center px-1">
                              UNKNOWN X
                            </span>
                          </div>
                          <div className="mt-2 flex flex-col items-center gap-1">
                            <span className="badge badge-red text-[10px]">UNIDENTIFIED</span>
                            <span className="text-[9px] text-red-600 font-bold">THREAT</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Full Case button */}
                    <div className="mt-4 pt-4 flex gap-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                      <button
                        onClick={() =>
                          console.log(`View full case: ${selectedFIR.firNumber}`)
                        }
                        className="cyber-btn flex items-center gap-2 text-xs"
                        style={{ border: '1px solid var(--border-default)', padding: '8px 16px', background: '#fff', cursor: 'pointer' }}
                      >
                        <Eye size={13} />
                        View Full Case
                        <ChevronRight size={13} />
                      </button>
                      <button
                        onClick={() =>
                          console.log(`Download genome report for: ${selectedFIR.firNumber}`)
                        }
                        className="cyber-btn-cyan flex items-center gap-2 text-xs"
                        style={{ border: '1px solid var(--primary-navy)', padding: '8px 16px', background: 'var(--primary-navy)', color: '#fff', cursor: 'pointer' }}
                      >
                        <Dna size={13} />
                        Export Genome Report
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
