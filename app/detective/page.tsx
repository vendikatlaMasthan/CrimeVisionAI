'use client';
import { useState, useMemo } from 'react';
import {
  Brain, Search, Network, AlertTriangle, Eye, Shield, Users, Phone,
  Car, Building2, FileText, Zap, CheckCircle, Clock, MapPin, ArrowRight,
  ChevronRight, Crosshair, Star, Lock, Radio
} from 'lucide-react';
import { CRIMINAL_PROFILES, FIR_RECORDS, type CriminalProfile } from '@/lib/mockData';

// ─── helpers ──────────────────────────────────────────────────────────────────

function riskColor(level: string) {
  if (level === 'Critical') return '#ef4444';
  if (level === 'High') return '#f59e0b';
  if (level === 'Medium') return '#00f0ff';
  return '#64748b';
}

function riskBadgeClass(level: string) {
  if (level === 'Critical') return 'badge badge-red';
  if (level === 'High') return 'badge badge-amber';
  if (level === 'Medium') return 'badge badge-cyan';
  return 'badge badge-gray';
}

function statusBadgeClass(status: string) {
  if (status === 'Wanted') return 'badge badge-red';
  if (status === 'Under Surveillance') return 'badge badge-amber';
  return 'badge badge-cyan';
}

function firStatusBadgeClass(status: string) {
  if (status === 'investigating') return 'badge badge-amber';
  if (status === 'arrested') return 'badge badge-red';
  if (status === 'resolved') return 'badge badge-green';
  return 'badge badge-cyan';
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function getAvatarBg(riskLevel: string) {
  if (riskLevel === 'Critical') return 'linear-gradient(135deg, #ef4444, #b91c1c)';
  if (riskLevel === 'High') return 'linear-gradient(135deg, #f59e0b, #d97706)';
  if (riskLevel === 'Medium') return 'linear-gradient(135deg, #00f0ff, #0891b2)';
  return 'linear-gradient(135deg, #64748b, #475569)';
}

function generateAIAssessment(p: CriminalProfile): string {
  const threat = p.riskLevel === 'Critical' ? 'CRITICAL THREAT' : p.riskLevel === 'High' ? 'HIGH-RISK SUBJECT' : 'MODERATE RISK SUBJECT';
  return `${threat}: Subject has ${p.arrestCount} documented arrest${p.arrestCount > 1 ? 's' : ''} with ${p.knownAssociates.length} known associates. Pattern analysis indicates ${p.riskLevel === 'Critical' ? 'HIGH probability of organized crime involvement. Immediate action advised.' : p.riskLevel === 'High' ? 'elevated criminal network engagement. Enhanced surveillance recommended.' : 'moderate criminal activity. Standard monitoring protocol applies.'}`;
}

function getRecommendedAction(p: CriminalProfile): string {
  if (p.riskLevel === 'Critical') return 'Arrest Warrant';
  if (p.riskLevel === 'High') return 'Enhanced Surveillance';
  return 'Interview & Monitoring';
}

function getEvidenceCount(p: CriminalProfile): number {
  return p.crimeHistory.length + p.knownAssociates.length + p.vehiclesUsed.length + p.bankAccounts.length + p.mobileNumbers.length;
}

// ─── reasoning steps ─────────────────────────────────────────────────────────

interface ReasoningStep {
  num: number;
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  evidence: string;
  confidence: number;
  label: string;
}

function buildReasoningSteps(p: CriminalProfile): ReasoningStep[] {
  const steps: ReasoningStep[] = [
    {
      num: 1,
      title: 'IDENTITY ESTABLISHED',
      icon: <Shield size={16} />,
      iconColor: '#10b981',
      evidence: `Subject identified in police database as ${p.name}. ${p.arrestCount} prior arrest${p.arrestCount > 1 ? 's' : ''} on record across ${p.crimeHistory.length} documented crime categor${p.crimeHistory.length > 1 ? 'ies' : 'y'}.`,
      confidence: 98,
      label: 'VERIFIED',
    },
    {
      num: 2,
      title: 'MOBILE INTELLIGENCE',
      icon: <Phone size={16} />,
      iconColor: '#00f0ff',
      evidence: `Mobile number ${p.mobileNumbers[0] || '+91-XXXXX-XXXXX'} flagged in active database. IMEI tracked across ${2 + p.arrestCount} incident locations in ${p.district} corridor. Multiple SIM-swap events detected.`,
      confidence: 87,
      label: 'CORROBORATING EVIDENCE',
    },
    {
      num: 3,
      title: 'VEHICLE TRACKING',
      icon: <Car size={16} />,
      iconColor: '#f59e0b',
      evidence: `Vehicle ${p.vehiclesUsed[0] || 'KA-XX-XX-XXXX'} registered and flagged. Spotted near ${p.arrestCount + 1} crime scenes matching suspect profile. CCTV correlation confirmed at 2 locations.`,
      confidence: 79,
      label: 'CORROBORATING EVIDENCE',
    },
    {
      num: 4,
      title: 'FINANCIAL INTELLIGENCE',
      icon: <Building2 size={16} />,
      iconColor: '#8b5cf6',
      evidence: `Bank account ${p.bankAccounts[0] || 'SBI ****XXXX'} shows suspicious transaction pattern. Cross-referenced with ${Math.max(2, p.arrestCount)} fraud FIRs filed in ${p.district}. ED notification issued.`,
      confidence: 82,
      label: 'CORROBORATING EVIDENCE',
    },
    {
      num: 5,
      title: 'ASSOCIATE NETWORK',
      icon: <Network size={16} />,
      iconColor: '#ef4444',
      evidence: `${p.knownAssociates[0] || 'Unknown Associate A'} and ${p.knownAssociates[1] || 'Unknown Associate B'} identified as known associates. All ${p.knownAssociates.length + 1} appear in overlapping FIRs. Criminal nexus confirmed.`,
      confidence: 91,
      label: 'VERIFIED',
    },
  ];

  if (p.riskLevel === 'Critical' || p.riskLevel === 'High') {
    steps.push({
      num: 6,
      title: 'ORGANIZED CRIME LINK',
      icon: <AlertTriangle size={16} />,
      iconColor: '#ef4444',
      evidence: `Risk profile analysis and connection matrix indicates HIGH probability of organized crime group membership. Subject profile score ${p.profileScore}/100 exceeds threshold for gang classification. Intelligence corroborated by ${p.arrestCount} field reports.`,
      confidence: 76,
      label: 'CORROBORATING EVIDENCE',
    });
  }

  return steps;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function ConfidenceMeter({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`, height: '100%',
          background: color,
          boxShadow: `0 0 6px ${color}`,
          transition: 'width 0.8s ease',
        }} />
      </div>
      <span style={{ color, fontWeight: 700, fontSize: 12, minWidth: 38 }}>{value}%</span>
    </div>
  );
}

function SuspectCard({ profile, selected, onClick }: {
  profile: CriminalProfile;
  selected: boolean;
  onClick: () => void;
}) {
  const color = riskColor(profile.riskLevel);
  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(0,240,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: selected ? `0 0 18px ${color}33, inset 0 0 8px ${color}11` : 'none',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: getAvatarBg(profile.riskLevel),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13, color: '#fff',
            flexShrink: 0,
          }}>{getInitials(profile.name)}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>{profile.name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{profile.district} · Age {profile.age}</div>
          </div>
        </div>
        <span className={riskBadgeClass(profile.riskLevel)} style={{ fontSize: 10 }}>{profile.riskLevel}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span className={statusBadgeClass(profile.status)} style={{ fontSize: 10 }}>{profile.status}</span>
        <span style={{ color: '#64748b', fontSize: 11 }}>Score: <span style={{ color, fontWeight: 700 }}>{profile.profileScore}</span></span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          width: `${profile.profileScore}%`,
          height: '100%',
          background: color,
          boxShadow: `0 0 4px ${color}`,
        }} />
      </div>
    </div>
  );
}

function ReasoningStepCard({ step, isLast }: { step: ReasoningStep; isLast: boolean }) {
  const isPulsing = step.title === 'ORGANIZED CRIME LINK';
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', gap: 14,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${step.iconColor}33`,
        borderRadius: 12,
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${step.iconColor}66, transparent)`
        }} />

        {/* Number + icon column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `${step.iconColor}22`,
            border: `2px solid ${step.iconColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 12px ${step.iconColor}55`,
            animation: isPulsing ? 'pulse 2s infinite' : undefined,
            color: step.iconColor,
            flexShrink: 0,
          }}>
            {step.icon}
          </div>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(0,240,255,0.15)',
            border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: '#00f0ff',
          }}>{step.num}</div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: step.iconColor, letterSpacing: '0.1em' }}>
              {step.title}
            </div>
            <span style={{
              background: `${step.iconColor}22`,
              border: `1px solid ${step.iconColor}55`,
              color: step.iconColor,
              fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 4,
            }}>CONF. {step.confidence}%</span>
          </div>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 10, margin: '0 0 10px 0' }}>
            {step.evidence}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {step.label === 'VERIFIED' ? (
              <CheckCircle size={12} color="#10b981" />
            ) : (
              <Eye size={12} color="#f59e0b" />
            )}
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              color: step.label === 'VERIFIED' ? '#10b981' : '#f59e0b',
            }}>{step.label}</span>
            <div style={{ flex: 1 }}>
              <ConfidenceMeter value={step.confidence} color={step.iconColor} />
            </div>
          </div>
        </div>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div style={{
          position: 'absolute',
          left: 32, top: '100%',
          width: 2, height: 16,
          background: 'linear-gradient(to bottom, rgba(0,240,255,0.4), rgba(0,240,255,0.1))',
          borderLeft: '2px dashed rgba(0,240,255,0.35)',
          zIndex: 1,
        }} />
      )}
      {!isLast && <div style={{ height: 16 }} />}
    </div>
  );
}

function EmptyState() {
  const ghosts = [
    { name: 'Rajesh Kumar', risk: 'Critical', score: 94, district: 'Bengaluru Urban' },
    { name: 'Imran Sheikh', risk: 'Critical', score: 96, district: 'Kalaburagi' },
    { name: 'Suresh Nayak', risk: 'High', score: 87, district: 'Raichur' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40, minHeight: 500 }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(0,240,255,0.08)',
        border: '2px solid rgba(0,240,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
        boxShadow: '0 0 30px rgba(0,240,255,0.15)',
      }}>
        <Brain size={36} color="#00f0ff" />
      </div>
      <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
        Select a Suspect to Run AI Detective Analysis
      </h2>
      <p style={{ color: '#64748b', fontSize: 13, textAlign: 'center', maxWidth: 340, marginBottom: 32 }}>
        The AI Detective Engine will generate a full reasoning chain, connection analysis, evidence dossier, and verdict for the selected subject.
      </p>

      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ fontSize: 11, color: '#00f0ff', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>
          SAMPLE ANALYSIS PREVIEWS
        </div>
        {ghosts.map((g, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 10,
            opacity: 0.5 + (i * 0.1),
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#94a3b8' }}>{g.name}</div>
              <span className={riskBadgeClass(g.risk)} style={{ fontSize: 10 }}>{g.risk}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#475569' }}>{g.district}</span>
              <span style={{ fontSize: 11, color: '#475569' }}>Score: {g.score}</span>
            </div>
            <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 1, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: `${g.score}%`, height: '100%', background: 'rgba(255,255,255,0.12)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function DetectivePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CriminalProfile | null>(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [flagged, setFlagged] = useState(false);

  const sortedProfiles = useMemo(() => {
    return [...CRIMINAL_PROFILES].sort((a, b) => b.profileScore - a.profileScore);
  }, []);

  const filteredProfiles = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return sortedProfiles;
    return sortedProfiles.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  }, [search, sortedProfiles]);

  const linkedFIRs = useMemo(() => {
    if (!selected) return [];
    return FIR_RECORDS.filter(fir =>
      fir.suspectDetails.name === selected.name ||
      fir.suspectDetails.knownAssociates.includes(selected.name)
    ).slice(0, 5);
  }, [selected]);

  const reasoningSteps = useMemo(() => {
    if (!selected) return [];
    return buildReasoningSteps(selected);
  }, [selected]);

  const verdictLabel = selected
    ? selected.riskLevel === 'Critical' ? 'CRITICAL SUSPECT'
    : selected.riskLevel === 'High' ? 'HIGH RISK SUBJECT'
    : selected.riskLevel === 'Medium' ? 'MODERATE RISK'
    : 'LOW RISK SUBJECT'
    : '';

  const verdictColor = selected ? riskColor(selected.riskLevel) : '#64748b';

  return (
    <div style={{ minHeight: '100vh', background: '#020617', padding: 28, fontFamily: 'inherit' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(0,240,255,0.12)',
            border: '2px solid rgba(0,240,255,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,240,255,0.2)',
          }}>
            <Brain size={26} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: 26, marginBottom: 2 }}>
              AI DETECTIVE ENGINE
            </h1>
            <p className="page-subtitle" style={{ marginBottom: 0 }}>
              Explainable suspect analysis with connection reasoning &amp; evidence chain
            </p>
          </div>
        </div>

        {/* Status badges row */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
          {[
            { label: 'NEURAL NET: ACTIVE', color: '#10b981', icon: <Radio size={11} /> },
            { label: 'LINK ANALYSIS: RUNNING', color: '#00f0ff', icon: <Network size={11} /> },
            { label: 'CONFIDENCE: 94.2%', color: '#f59e0b', icon: <Zap size={11} /> },
            { label: 'CLASSIFIED: LEVEL 4', color: '#ef4444', icon: <Lock size={11} /> },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: `${s.color}18`,
              border: `1px solid ${s.color}44`,
              borderRadius: 6, padding: '5px 12px',
              fontSize: 11, fontWeight: 700, color: s.color,
              letterSpacing: '0.06em',
            }}>
              {s.icon} {s.label}
              {i < 2 && (
                <span style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: s.color, marginLeft: 4,
                  boxShadow: `0 0 6px ${s.color}`,
                  animation: 'pulse 1.5s infinite',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── LEFT PANEL: SUSPECT REGISTRY ───────────────────────────────── */}
        <div style={{ width: '35%', flexShrink: 0 }}>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Panel header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(0,240,255,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={16} color="#00f0ff" />
                  <span style={{ fontWeight: 800, fontSize: 13, color: '#00f0ff', letterSpacing: '0.08em' }}>
                    SUSPECT REGISTRY
                  </span>
                </div>
                <span style={{
                  background: 'rgba(0,240,255,0.15)',
                  border: '1px solid rgba(0,240,255,0.3)',
                  color: '#00f0ff', fontSize: 11, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 4,
                }}>{filteredProfiles.length} SUBJECTS</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#64748b" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search by name or district..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, padding: '8px 12px 8px 32px',
                    color: '#f1f5f9', fontSize: 13, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Suspect list */}
            <div style={{ padding: 12, maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
              {filteredProfiles.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#475569', padding: 32, fontSize: 13 }}>
                  No suspects match your search.
                </div>
              ) : (
                filteredProfiles.map(p => (
                  <SuspectCard
                    key={p.id}
                    profile={p}
                    selected={selected?.id === p.id}
                    onClick={() => {
                      setSelected(p);
                      setReportGenerated(false);
                      setFlagged(false);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: ANALYSIS ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selected ? (
            <div className="glass-card">
              <EmptyState />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* ── SECTION 1: INTELLIGENCE DOSSIER ─────────────────────── */}
              <div className="glass-card" style={{
                border: `1px solid ${verdictColor}44`,
                boxShadow: `0 0 30px ${verdictColor}18`,
              }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ flexShrink: 0 }}>
                    <div style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: getAvatarBg(selected.riskLevel),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: 24, color: '#fff',
                      boxShadow: `0 0 24px ${verdictColor}55`,
                      border: `3px solid ${verdictColor}`,
                    }}>{getInitials(selected.name)}</div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h2 style={{ color: '#f1f5f9', fontWeight: 900, fontSize: 22, margin: 0, letterSpacing: '0.02em' }}>
                          {selected.name}
                        </h2>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>ID: {selected.id.toUpperCase()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: verdictColor, fontSize: 42, fontWeight: 900, lineHeight: 1, textShadow: `0 0 20px ${verdictColor}` }}>
                          {selected.profileScore}
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>PROFILE SCORE</div>
                      </div>
                    </div>

                    {/* Tags row */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
                        <Clock size={12} color="#64748b" /> Age {selected.age}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
                        <Users size={12} color="#64748b" /> {selected.gender}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8' }}>
                        <MapPin size={12} color="#64748b" /> {selected.district}
                      </div>
                      <span className={statusBadgeClass(selected.status)} style={{ fontSize: 11 }}>{selected.status}</span>
                      <span className={riskBadgeClass(selected.riskLevel)} style={{ fontSize: 11 }}>{selected.riskLevel} RISK</span>
                    </div>

                    {/* Threat bar */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.06em' }}>THREAT ASSESSMENT</span>
                        <span style={{ fontSize: 11, color: verdictColor, fontWeight: 700 }}>{selected.profileScore}/100</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          width: `${selected.profileScore}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${verdictColor}99, ${verdictColor})`,
                          boxShadow: `0 0 10px ${verdictColor}`,
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>

                    {/* AI Assessment */}
                    <div style={{
                      background: `${verdictColor}0d`,
                      border: `1px solid ${verdictColor}33`,
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Brain size={13} color={verdictColor} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: verdictColor, letterSpacing: '0.08em' }}>AI ASSESSMENT</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                        {generateAIAssessment(selected)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick stats row */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16,
                }}>
                  {[
                    { label: 'ARRESTS', value: selected.arrestCount, color: '#ef4444' },
                    { label: 'CRIMES ON RECORD', value: selected.crimeHistory.length, color: '#f59e0b' },
                    { label: 'KNOWN ASSOCIATES', value: selected.knownAssociates.length, color: '#8b5cf6' },
                    { label: 'EVIDENCE PIECES', value: getEvidenceCount(selected), color: '#00f0ff' },
                  ].map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 26, fontWeight: 900, color: stat.color, textShadow: `0 0 12px ${stat.color}` }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, letterSpacing: '0.06em' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── SECTION 2: REASONING CHAIN ───────────────────────────── */}
              <div className="glass-card">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(0,240,255,0.12)',
                      border: '1px solid rgba(0,240,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Network size={16} color="#00f0ff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>
                        Connection Reasoning Chain — AI Evidence Analysis
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        How this suspect is linked to criminal networks
                      </div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Crosshair size={13} color="#00f0ff" />
                      <span style={{ fontSize: 12, color: '#00f0ff', fontWeight: 700 }}>
                        {reasoningSteps.length} STEPS
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{
                    height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1,
                    marginTop: 8, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: '100%', height: '100%',
                      background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
                      boxShadow: '0 0 8px #00f0ff',
                    }} />
                  </div>
                </div>

                {/* Steps */}
                <div style={{ position: 'relative' }}>
                  {reasoningSteps.map((step, idx) => (
                    <ReasoningStepCard
                      key={step.num}
                      step={step}
                      isLast={idx === reasoningSteps.length - 1}
                    />
                  ))}
                </div>

                {/* AI confidence summary */}
                <div style={{
                  marginTop: 16,
                  background: 'rgba(0,240,255,0.05)',
                  border: '1px solid rgba(0,240,255,0.2)',
                  borderRadius: 10, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <Brain size={18} color="#00f0ff" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#00f0ff', fontWeight: 700, marginBottom: 2 }}>
                      OVERALL AI CONFIDENCE
                    </div>
                    <ConfidenceMeter
                      value={Math.round(reasoningSteps.reduce((a, s) => a + s.confidence, 0) / reasoningSteps.length)}
                      color="#00f0ff"
                    />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#00f0ff', textShadow: '0 0 12px #00f0ff' }}>
                    {Math.round(reasoningSteps.reduce((a, s) => a + s.confidence, 0) / reasoningSteps.length)}%
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: LINKED FIR CASES ──────────────────────────── */}
              <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(239,68,68,0.12)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={16} color="#ef4444" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>Linked Case Files</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>FIR records connected to this subject</div>
                    </div>
                  </div>
                  <span style={{
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#ef4444', fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 5,
                  }}>{linkedFIRs.length} CASES FOUND</span>
                </div>

                {linkedFIRs.length === 0 ? (
                  <div style={{
                    textAlign: 'center', padding: 24,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px dashed rgba(255,255,255,0.08)',
                    borderRadius: 10,
                  }}>
                    <FileText size={24} color="#334155" style={{ marginBottom: 8 }} />
                    <div style={{ color: '#475569', fontSize: 13 }}>No directly linked FIRs found. Check associate network.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {linkedFIRs.map(fir => (
                      <div key={fir.id} style={{
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10, padding: '12px 14px',
                        display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'border-color 0.2s',
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 8,
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <FileText size={18} color="#ef4444" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>{fir.firNumber}</span>
                            <span className={firStatusBadgeClass(fir.investigationStatus)} style={{ fontSize: 10 }}>
                              {fir.investigationStatus.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{fir.date}</span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{fir.crimeCategory}</span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>{fir.district}</span>
                            <span style={{ fontSize: 11, color: '#64748b' }}>Evidence: {fir.evidenceCount} items</span>
                          </div>
                        </div>
                        <a
                          href={`/fir?id=${fir.id}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: 'rgba(0,240,255,0.1)',
                            border: '1px solid rgba(0,240,255,0.3)',
                            color: '#00f0ff', fontSize: 11, fontWeight: 700,
                            padding: '6px 12px', borderRadius: 6,
                            textDecoration: 'none', whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          Open Case <ChevronRight size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── SECTION 4: AI VERDICT ─────────────────────────────────── */}
              <div className="glass-card" style={{
                border: `2px solid ${verdictColor}55`,
                boxShadow: `0 0 40px ${verdictColor}1a, inset 0 0 30px ${verdictColor}08`,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Background accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${verdictColor}, transparent)`,
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 200, height: 200, borderRadius: '50%',
                  background: `radial-gradient(circle, ${verdictColor}0d, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${verdictColor}22`,
                    border: `2px solid ${verdictColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 16px ${verdictColor}55`,
                  }}>
                    <Star size={18} color={verdictColor} />
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: '#f1f5f9', letterSpacing: '0.06em' }}>
                    AI DETECTIVE VERDICT
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <span style={{
                      fontSize: 11, background: `${verdictColor}22`,
                      border: `1px solid ${verdictColor}55`,
                      color: verdictColor, padding: '3px 10px', borderRadius: 5, fontWeight: 700,
                    }}>CLASSIFIED LEVEL 4</span>
                  </div>
                </div>

                {/* Verdict label */}
                <div style={{
                  textAlign: 'center', marginBottom: 24,
                  padding: '16px 20px',
                  background: `${verdictColor}0d`,
                  border: `1px solid ${verdictColor}33`,
                  borderRadius: 12,
                }}>
                  <div style={{
                    fontSize: 36, fontWeight: 900, color: verdictColor,
                    textShadow: `0 0 30px ${verdictColor}`,
                    letterSpacing: '0.05em', marginBottom: 4,
                  }}>
                    {verdictLabel}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    AI-generated verdict based on multi-factor analysis of {reasoningSteps.length} evidence streams
                  </div>
                </div>

                {/* Conclusion points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {[
                    {
                      icon: <Users size={15} color="#8b5cf6" />,
                      label: 'Criminal Association',
                      value: `${selected.knownAssociates.length} documented connections to known offenders`,
                      color: '#8b5cf6',
                    },
                    {
                      icon: <Eye size={15} color="#00f0ff" />,
                      label: 'Evidence Chain',
                      value: `${getEvidenceCount(selected)} pieces of corroborating evidence identified across ${reasoningSteps.length} intelligence streams`,
                      color: '#00f0ff',
                    },
                    {
                      icon: <Crosshair size={15} color={verdictColor} />,
                      label: 'Recommended Action',
                      value: `${getRecommendedAction(selected)} recommended based on risk profile score of ${selected.profileScore}/100`,
                      color: verdictColor,
                    },
                  ].map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      background: `${c.color}0a`,
                      border: `1px solid ${c.color}22`,
                      borderRadius: 10, padding: '12px 14px',
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 6,
                        background: `${c.color}18`,
                        border: `1px solid ${c.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 1,
                      }}>{c.icon}</div>
                      <div>
                        <div style={{ fontSize: 11, color: c.color, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 3 }}>
                          {c.label.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{c.value}</div>
                      </div>
                      <ArrowRight size={14} color={c.color} style={{ marginLeft: 'auto', flexShrink: 0, marginTop: 6, opacity: 0.6 }} />
                    </div>
                  ))}
                </div>

                {/* Recent activity */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '10px 14px',
                }}>
                  <MapPin size={13} color="#64748b" />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{selected.recentActivity}</span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setReportGenerated(true)}
                    className="cyber-btn cyber-btn-cyan"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}
                  >
                    {reportGenerated ? (
                      <><CheckCircle size={15} /> REPORT GENERATED</>
                    ) : (
                      <><FileText size={15} /> Generate Full Report</>
                    )}
                  </button>
                  <button
                    onClick={() => setFlagged(true)}
                    className="cyber-btn cyber-btn-red"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}
                  >
                    {flagged ? (
                      <><CheckCircle size={15} /> FLAGGED FOR PRIORITY</>
                    ) : (
                      <><AlertTriangle size={15} /> Flag for Priority Investigation</>
                    )}
                  </button>
                </div>

                {reportGenerated && (
                  <div style={{
                    marginTop: 12,
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                      Full intelligence report for {selected.name} generated and queued for classified distribution. Report ID: KSPAI-{selected.id.toUpperCase()}-{Date.now().toString().slice(-6)}
                    </span>
                  </div>
                )}
                {flagged && (
                  <div style={{
                    marginTop: flagged && !reportGenerated ? 12 : 6,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <AlertTriangle size={14} color="#ef4444" />
                    <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                      {selected.name} flagged for priority investigation. ACP Chandrashekar and SIT team notified. Priority tracker ID: PRI-{selected.profileScore}-{selected.id.slice(-4).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
