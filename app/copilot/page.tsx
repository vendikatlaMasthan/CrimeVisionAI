'use client';
import { useState } from 'react';
import {
  Crosshair, FileText, ChevronRight, Clock, MapPin, Phone, Car,
  Building2, Users, AlertTriangle, CheckSquare, Square, Zap, Eye,
  ArrowRight, Shield, Brain, Star, PlayCircle, Target
} from 'lucide-react';
import Link from 'next/link';
import { FIR_RECORDS, CRIMINAL_PROFILES, AI_ALERTS, FIRRecord } from '@/lib/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | 'investigating' | 'arrested' | 'monitoring' | 'resolved';

interface Lead {
  id: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  details: string;
  timeEstimate: string;
  Icon: React.ElementType;
  category: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f59e0b',
  MEDIUM:   '#0F6B5C',
  LOW:      '#64748b',
};

const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: 'badge badge-red',
  HIGH:     'badge badge-amber',
  MEDIUM:   'badge badge-cyan',
  LOW:      'badge badge-gray',
};

const STATUS_BADGE: Record<string, string> = {
  investigating: 'badge badge-amber',
  arrested:      'badge badge-cyan',
  monitoring:    'badge badge-purple',
  resolved:      'badge badge-green',
};

const STATUS_COLORS: Record<string, string> = {
  investigating: '#f59e0b',
  arrested:      '#0F6B5C',
  monitoring:    '#8b5cf6',
  resolved:      '#10b981',
};

function getRiskBadge(level: string) {
  if (level === 'Critical') return 'badge badge-red';
  if (level === 'High')     return 'badge badge-amber';
  if (level === 'Medium')   return 'badge badge-cyan';
  return 'badge badge-gray';
}

function generateLeads(fir: FIRRecord): Lead[] {
  const s = fir.suspectDetails;
  const isCyber = fir.crimeCategory.toLowerCase().includes('cyber') ||
                  fir.crimeCategory.toLowerCase().includes('fraud') ||
                  fir.crimeCategory.toLowerCase().includes('financial');

  const leads: Lead[] = [
    {
      id: 1,
      priority: fir.riskScore > 80 ? 'CRITICAL' : 'HIGH',
      action: `Obtain CDR for mobile ${s.mobileNumbers[0] ?? '+91-XXXXXXXXXX'}`,
      details: `Call Detail Records from the last 30 days may reveal contact patterns with known associates. Request from service provider under Section 91 CrPC. Focus on calls between ${fir.date} ± 7 days.`,
      timeEstimate: '2–4 hours',
      Icon: Phone,
      category: 'MOBILE INTELLIGENCE',
    },
    {
      id: 2,
      priority: 'HIGH',
      action: `Trace vehicle ${s.vehiclesUsed[0] ?? 'KA-XX-XX-XXXX'} ownership history`,
      details: `RTO database query for full ownership chain and transfer history. Check toll booth CCTV records along ${fir.district} corridor. Verify insurance and pollution certificate validity.`,
      timeEstimate: '4–6 hours',
      Icon: Car,
      category: 'VEHICLE TRACING',
    },
    {
      id: 3,
      priority: 'HIGH',
      action: `Audit bank account ${s.bankAccounts[0] ?? 'Account on file'}`,
      details: `Request 6-month transaction statement. Look for structured cash deposits, hawala patterns, or peer-to-peer transfers to flagged accounts. Coordinate with ED if threshold crossed.`,
      timeEstimate: '24–48 hours',
      Icon: Building2,
      category: 'FINANCIAL AUDIT',
    },
    {
      id: 4,
      priority: 'MEDIUM',
      action: `Surveil known associate: ${s.knownAssociates[0] ?? 'Associate on record'}`,
      details: `Subject identified as close associate in criminal network. Cross-reference their mobile CDR and location data with incident timeline. Request surveillance authorization from DCP.`,
      timeEstimate: '6–12 hours',
      Icon: Users,
      category: 'ASSOCIATE SURVEILLANCE',
    },
    {
      id: 5,
      priority: 'HIGH',
      action: `Request CCTV footage from ${fir.district} incident zone`,
      details: `Identify all cameras within 500m radius of reported location. Collect footage from incident day ± 2 hours. Focus on entry/exit routes and parking areas. Coordinate with traffic police.`,
      timeEstimate: '2–3 hours',
      Icon: Eye,
      category: 'CCTV ANALYSIS',
    },
    {
      id: 6,
      priority: 'MEDIUM',
      action: `Interview witness/complainant for case ${fir.firNumber}`,
      details: `Formal statement under Section 161 CrPC. Focus on: exact timeline of events, vehicle description, suspect physical description, and any previous encounters with accused.`,
      timeEstimate: '1–2 hours',
      Icon: Users,
      category: 'WITNESS INTERVIEW',
    },
    ...(isCyber ? [{
      id: 7,
      priority: 'CRITICAL' as const,
      action: 'Submit devices for digital forensics analysis',
      details: `Extract IMEI, email logs, transaction history, browsing history from seized devices. Coordinate with Cyber Crime Cell, Bengaluru. Priority forensic queue — mark as urgent.`,
      timeEstimate: '48–72 hours',
      Icon: Shield,
      category: 'DIGITAL FORENSICS',
    }] : []),
    {
      id: isCyber ? 8 : 7,
      priority: 'LOW',
      action: `Cross-reference with similar cases in ${fir.district}`,
      details: `Search FIR database for cases with matching MO: same crime category (${fir.crimeCategory}), similar victim profile, and same district. Check for pattern-linked suspects.`,
      timeEstimate: '1 hour',
      Icon: FileText,
      category: 'CROSS-REFERENCE',
    },
  ];

  return leads;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function InvestigationCopilotPage() {
  const [selectedFir, setSelectedFir] = useState<FIRRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [checkedLeads, setCheckedLeads] = useState<Set<number>>(new Set());

  const filteredFIRs = FIR_RECORDS.filter(f =>
    statusFilter === 'all' || f.investigationStatus === statusFilter
  );

  const toggleLead = (id: number) => {
    setCheckedLeads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectFir = (fir: FIRRecord) => {
    setSelectedFir(fir);
    setCheckedLeads(new Set());
  };

  const leads = selectedFir ? generateLeads(selectedFir) : [];
  const completedCount = leads.filter(l => checkedLeads.has(l.id)).length;
  const totalLeads = leads.length;

  // Right panel calculations
  const suspect = selectedFir?.suspectDetails;
  const recidivismRisk = suspect
    ? Math.min(100, suspect.arrestCount * 15 + suspect.profileScore * 0.5)
    : 0;
  const flightRisk =
    suspect?.riskLevel === 'Critical' ? 85 :
    suspect?.riskLevel === 'High' ? 62 :
    suspect?.riskLevel === 'Medium' ? 38 : 20;
  const networkDanger = suspect
    ? Math.min(100, suspect.knownAssociates.length * 20 + 20)
    : 0;

  const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Investigating', value: 'investigating' },
    { label: 'Arrested', value: 'arrested' },
    { label: 'Monitoring', value: 'monitoring' },
    { label: 'Resolved', value: 'resolved' },
  ];

  return (
    <div className="page-content" style={{ padding: '28px' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(30, 58, 95,0.08)', border: '1px solid rgba(30, 58, 95,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <Crosshair size={24} color="#0F6B5C" />
          </div>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              INVESTIGATION COPILOT
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                background: 'rgba(30, 58, 95,0.12)', color: '#0F6B5C',
                border: '1px solid rgba(30, 58, 95,0.3)', borderRadius: 4,
                padding: '2px 8px', verticalAlign: 'middle',
              }}>AI</span>
            </h1>
            <p className="page-subtitle">AI-generated investigation leads, next best actions & evidence suggestions</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* COPILOT ACTIVE */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 20, padding: '5px 12px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#10b981',
              animation: 'pulse-green 1.5s ease-in-out infinite',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.08em' }}>
              COPILOT ACTIVE
            </span>
          </div>

          <div style={{
            background: 'rgba(30, 58, 95,0.08)', border: '1px solid rgba(30, 58, 95,0.25)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 11, fontWeight: 700, color: '#0F6B5C', letterSpacing: '0.07em',
          }}>
            LEADS GENERATED: AI
          </div>

          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.07em',
          }}>
            PRIORITY RANKING: AUTO
          </div>
        </div>
      </div>

      {/* ── THREE-COLUMN LAYOUT ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '30% 1fr 25%', gap: 18, alignItems: 'start' }}>

        {/* ════════════════════════════════════════════════════════════════
            LEFT PANEL: CASE SELECTOR
        ════════════════════════════════════════════════════════════════ */}
        <div className="glass-card" style={{ padding: 18, minHeight: '80vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FileText size={14} color="#0F6B5C" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Select Case File
            </span>
            <span className="badge badge-cyan" style={{ marginLeft: 'auto', fontSize: 10 }}>
              {filteredFIRs.length} cases
            </span>
          </div>

          {/* STATUS FILTER PILLS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  padding: '4px 10px', borderRadius: 14, fontSize: 10, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase',
                  border: `1px solid ${statusFilter === f.value ? 'rgba(30, 58, 95,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  background: statusFilter === f.value ? 'rgba(30, 58, 95,0.12)' : 'rgba(255,255,255,0.03)',
                  color: statusFilter === f.value ? '#0F6B5C' : '#64748b',
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* CASE LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '72vh', overflowY: 'auto', paddingRight: 2 }}>
            {filteredFIRs.map(fir => {
              const isSelected = selectedFir?.id === fir.id;
              const isCritical = fir.riskScore > 80;
              const isHigh = fir.riskScore > 60;

              return (
                <div
                  key={fir.id}
                  onClick={() => handleSelectFir(fir)}
                  style={{
                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                    border: isSelected
                      ? '1px solid rgba(30, 58, 95,0.55)'
                      : '1px solid rgba(255,255,255,0.06)',
                    background: isSelected
                      ? 'rgba(30, 58, 95,0.07)'
                      : 'rgba(255,255,255,0.025)',
                    boxShadow: isSelected ? '0 0 16px rgba(30, 58, 95,0.1)' : 'none',
                    transition: 'all 0.18s ease',
                    position: 'relative',
                  }}
                >
                  {/* Priority dot */}
                  {(isCritical || isHigh) && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 7, height: 7, borderRadius: '50%',
                      background: isCritical ? '#ef4444' : '#f59e0b',
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      animation: isCritical ? 'pulse-red 1.5s ease-in-out infinite' : 'none',
                    }} />
                  )}

                  {/* FIR Number */}
                  <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, color: '#0F6B5C', marginBottom: 4, letterSpacing: '0.04em' }}>
                    {fir.firNumber}
                  </div>

                  {/* Crime Category Badge */}
                  <div style={{ marginBottom: 6 }}>
                    <span className="badge badge-gray" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {fir.crimeCategory}
                    </span>
                  </div>

                  {/* Suspect Name */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                    {fir.suspectDetails.name}
                  </div>

                  {/* District + Date */}
                  <div style={{ display: 'flex', gap: 10, fontSize: 10, color: '#64748b', marginBottom: 7 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={9} /> {fir.district}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={9} /> {fir.date}
                    </span>
                  </div>

                  {/* Status + Risk */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={STATUS_BADGE[fir.investigationStatus]} style={{ fontSize: 9, textTransform: 'uppercase' }}>
                      {fir.investigationStatus}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
                      color: fir.riskScore > 80 ? '#ef4444' : fir.riskScore > 60 ? '#f59e0b' : '#64748b',
                    }}>
                      Risk {fir.riskScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            CENTER PANEL: INVESTIGATION LEADS
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {!selectedFir ? (
            /* ── EMPTY STATE ── */
            <div className="glass-card" style={{
              padding: 60, textAlign: 'center', minHeight: '70vh',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Radar sweep animation */}
              <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 28 }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '1px solid rgba(30, 58, 95,0.2)',
                }} />
                <div style={{
                  position: 'absolute', inset: 8, borderRadius: '50%',
                  border: '1px solid rgba(30, 58, 95,0.15)',
                }} />
                <div style={{
                  position: 'absolute', inset: 20, borderRadius: '50%',
                  border: '1px solid rgba(30, 58, 95,0.1)',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'conic-gradient(rgba(30, 58, 95,0.15) 0deg, transparent 60deg, transparent 360deg)',
                  animation: 'spin 3s linear infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Crosshair size={32} color="#0F6B5C" style={{ opacity: 0.8 }} />
                </div>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#cbd5e1', marginBottom: 10 }}>
                Select a case to activate Investigation Copilot
              </h3>
              <p style={{ fontSize: 13, color: '#475569', maxWidth: 340, lineHeight: 1.6 }}>
                Choose any FIR from the case file panel. The AI will instantly generate top investigation leads and next best actions.
              </p>

              <div style={{
                marginTop: 24, display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(30, 58, 95,0.06)', border: '1px solid rgba(30, 58, 95,0.15)',
                borderRadius: 10, padding: '10px 20px',
              }}>
                <Brain size={14} color="#0F6B5C" />
                <span style={{ fontSize: 12, color: '#0F6B5C', fontWeight: 600 }}>
                  {FIR_RECORDS.length} case files indexed • AI copilot ready
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* ── CASE BRIEF BAR ── */}
              <div className="glass-card" style={{
                padding: '12px 18px',
                background: 'rgba(30, 58, 95,0.04)',
                border: '1px solid rgba(30, 58, 95,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 11 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F6B5C', fontSize: 12 }}>
                    {selectedFir.firNumber}
                  </span>
                  <span style={{ color: '#64748b' }}>|</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{selectedFir.crimeCategory}</span>
                  <span style={{ color: '#64748b' }}>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8' }}>
                    <MapPin size={10} /> {selectedFir.district}
                  </span>
                  <span style={{ color: '#64748b' }}>|</span>
                  <span style={{ color: '#94a3b8' }}>{selectedFir.assignedOfficer}</span>
                  <span style={{ marginLeft: 'auto' }}>
                    <span className={STATUS_BADGE[selectedFir.investigationStatus]} style={{ fontSize: 10, textTransform: 'uppercase' }}>
                      {selectedFir.investigationStatus}
                    </span>
                  </span>
                </div>
              </div>

              {/* ── INVESTIGATION LEADS SECTION ── */}
              <div className="glass-card" style={{ padding: 20 }}>
                {/* Section Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={15} color="#0F6B5C" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      TOP INVESTIGATION LEADS
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 800, background: 'rgba(30, 58, 95,0.12)',
                      color: '#0F6B5C', border: '1px solid rgba(30, 58, 95,0.3)',
                      borderRadius: 4, padding: '1px 6px', letterSpacing: '0.08em',
                    }}>AI GENERATED</span>
                  </div>

                  {/* Progress Counter */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: completedCount === totalLeads
                      ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.25)',
                    border: `1px solid ${completedCount === totalLeads ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 8, padding: '5px 12px',
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      color: completedCount === totalLeads ? '#10b981' : '#94a3b8',
                    }}>
                      Leads Completed: {completedCount}/{totalLeads}
                    </span>
                    {completedCount === totalLeads && (
                      <span style={{ fontSize: 12 }}>✓</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 18 }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${totalLeads > 0 ? (completedCount / totalLeads) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #00b4cc, #0F6B5C)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>

                {/* Lead Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {leads.map(lead => {
                    const isChecked = checkedLeads.has(lead.id);
                    const borderColor = PRIORITY_COLOR[lead.priority];

                    return (
                      <div
                        key={lead.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '0 10px 10px 0',
                          borderLeft: `3px solid ${isChecked ? '#334155' : borderColor}`,
                          background: isChecked ? 'rgba(255,255,255,0.015)' : '#FFFFFF',
                          border: `1px solid ${isChecked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)'}`,
                          borderLeftColor: isChecked ? '#334155' : borderColor,
                          borderLeftWidth: 3,
                          borderLeftStyle: 'solid',
                          opacity: isChecked ? 0.48 : 1,
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleLead(lead.id)}
                            style={{
                              flexShrink: 0, background: 'none', border: 'none',
                              cursor: 'pointer', padding: 2, marginTop: 1,
                              color: isChecked ? '#10b981' : '#64748b',
                              transition: 'color 0.2s',
                            }}
                          >
                            {isChecked
                              ? <CheckSquare size={17} color="#10b981" />
                              : <Square size={17} color="#475569" />}
                          </button>

                          {/* Icon circle */}
                          <div style={{
                            flexShrink: 0,
                            width: 34, height: 34, borderRadius: 8,
                            background: isChecked ? 'rgba(255,255,255,0.04)' : `${borderColor}15`,
                            border: `1px solid ${isChecked ? 'rgba(255,255,255,0.08)' : `${borderColor}35`}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginTop: 2,
                          }}>
                            <lead.Icon size={16} color={isChecked ? '#475569' : borderColor} />
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, flexWrap: 'wrap' }}>
                              <span className={PRIORITY_BADGE[lead.priority]} style={{ fontSize: 9, letterSpacing: '0.06em' }}>
                                {lead.priority}
                              </span>
                              <span style={{ fontSize: 10, color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>
                                #{lead.id}
                              </span>
                              <span style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                {lead.category}
                              </span>
                              <div style={{
                                marginLeft: 'auto',
                                display: 'flex', alignItems: 'center', gap: 4,
                                background: 'rgba(0,0,0,0.2)', borderRadius: 5, padding: '2px 7px',
                                fontSize: 10, color: '#64748b', fontWeight: 600,
                              }}>
                                <Clock size={10} /> {lead.timeEstimate}
                              </div>
                            </div>

                            <div style={{
                              fontSize: 13, fontWeight: 700, color: isChecked ? '#475569' : '#e2e8f0',
                              marginBottom: 5, lineHeight: 1.4,
                              textDecoration: isChecked ? 'line-through' : 'none',
                            }}>
                              {lead.action}
                            </div>

                            <div style={{ fontSize: 12, color: isChecked ? '#334155' : '#64748b', lineHeight: 1.55 }}>
                              {lead.details}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── NEXT BEST ACTIONS ── */}
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Zap size={14} color="#f59e0b" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    RECOMMENDED NEXT ACTIONS
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {/* Generate Report */}
                  <Link href="/reports" style={{ textDecoration: 'none' }}>
                    <button className="cyber-btn cyber-btn-cyan" style={{
                      width: '100%', justifyContent: 'center', padding: '13px 16px',
                      fontSize: 12, fontWeight: 700, flexDirection: 'column', gap: 6, height: 'auto',
                    }}>
                      <FileText size={18} />
                      <span>Generate Full</span>
                      <span>Investigation Report</span>
                    </button>
                  </Link>

                  {/* Network View */}
                  <Link href="/network" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', padding: '13px 16px',
                      borderRadius: 10, cursor: 'pointer',
                      background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.35)',
                      color: '#a78bfa', fontSize: 12, fontWeight: 700,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 6, transition: 'all 0.2s ease',
                    }}>
                      <Users size={18} />
                      <span>View Criminal</span>
                      <span>Network</span>
                    </button>
                  </Link>

                  {/* AI Detective */}
                  <Link href="/detective" style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%', padding: '13px 16px',
                      borderRadius: 10, cursor: 'pointer',
                      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)',
                      color: '#f87171', fontSize: 12, fontWeight: 700,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 6, transition: 'all 0.2s ease',
                    }}>
                      <Brain size={18} />
                      <span>Run AI Detective</span>
                      <span>Analysis</span>
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT PANEL: CASE INTELLIGENCE SUMMARY
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {!selectedFir ? (
            <div className="glass-card" style={{
              padding: 32, textAlign: 'center', minHeight: 220,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={32} color="#1e293b" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: '#334155', fontWeight: 600 }}>
                Case intelligence will appear here after selection
              </p>
            </div>
          ) : (
            <>
              {/* ── SUSPECT THREAT CARD ── */}
              <div className="glass-card" style={{ padding: 18, border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                  <AlertTriangle size={13} color="#ef4444" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Accused Profile
                  </span>
                </div>

                {/* Name + risk */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>👤</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>
                      {suspect?.name}
                    </div>
                    <span className={getRiskBadge(suspect?.riskLevel ?? 'Low')} style={{ fontSize: 9, marginTop: 2 }}>
                      {suspect?.riskLevel?.toUpperCase()} RISK
                    </span>
                  </div>
                </div>

                {/* Risk Score Bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Risk Score
                    </span>
                    <span style={{
                      fontFamily: 'monospace', fontSize: 13, fontWeight: 800,
                      color: (suspect?.profileScore ?? 0) > 80 ? '#ef4444' : (suspect?.profileScore ?? 0) > 60 ? '#f59e0b' : '#64748b',
                    }}>
                      {suspect?.profileScore}/100
                    </span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 6,
                      width: `${suspect?.profileScore ?? 0}%`,
                      background: (suspect?.profileScore ?? 0) > 80
                        ? 'linear-gradient(90deg, #b91c1c, #ef4444)'
                        : (suspect?.profileScore ?? 0) > 60
                          ? 'linear-gradient(90deg, #b45309, #f59e0b)'
                          : 'linear-gradient(90deg, #334155, #64748b)',
                      transition: 'width 1s ease',
                      boxShadow: (suspect?.profileScore ?? 0) > 80 ? '0 0 8px rgba(239,68,68,0.5)' : 'none',
                    }} />
                  </div>
                </div>

                {/* Key facts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Arrests', value: suspect?.arrestCount ?? 0, color: '#ef4444' },
                    { label: 'Associates', value: suspect?.knownAssociates?.length ?? 0, color: '#f59e0b' },
                    { label: 'Vehicles', value: suspect?.vehiclesUsed?.length ?? 0, color: '#8b5cf6' },
                    { label: 'Mobiles', value: suspect?.mobileNumbers?.length ?? 0, color: '#0F6B5C' },
                  ].map(fact => (
                    <div key={fact.label} style={{
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 8, padding: '8px 10px', textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: fact.color, fontFamily: 'monospace' }}>
                        {fact.value}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{fact.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── EVIDENCE CHECKLIST ── */}
              <div className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                  <CheckSquare size={13} color="#10b981" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Evidence Secured
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                      {selectedFir.evidenceCount} / 10 exhibits
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981' }}>
                      {Math.round((selectedFir.evidenceCount / 10) * 100)}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${(selectedFir.evidenceCount / 10) * 100}%`,
                      background: 'linear-gradient(90deg, #059669, #10b981)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>

                {/* Exhibit list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 160, overflowY: 'auto' }}>
                  {Array.from({ length: selectedFir.evidenceCount }).map((_, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 6, padding: '5px 9px',
                    }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
                        EXHIBIT-KSP-{String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                        ✓ Secured
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── AI RISK ASSESSMENT ── */}
              <div className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                  <Brain size={13} color="#8b5cf6" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    AI Risk Analysis
                  </span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 9, fontWeight: 700,
                    background: 'rgba(139,92,246,0.12)', color: '#8b5cf6',
                    border: '1px solid rgba(139,92,246,0.3)', borderRadius: 4, padding: '1px 6px',
                  }}>COMPUTED</span>
                </div>

                {[
                  {
                    label: 'Recidivism Risk',
                    score: Math.round(recidivismRisk),
                    color: recidivismRisk > 70 ? '#ef4444' : recidivismRisk > 45 ? '#f59e0b' : '#10b981',
                    note: `Based on ${suspect?.arrestCount} prior arrests`,
                  },
                  {
                    label: 'Flight Risk',
                    score: flightRisk,
                    color: flightRisk > 70 ? '#ef4444' : flightRisk > 45 ? '#f59e0b' : '#10b981',
                    note: `${suspect?.riskLevel} threat profile`,
                  },
                  {
                    label: 'Network Danger',
                    score: Math.round(networkDanger),
                    color: networkDanger > 60 ? '#ef4444' : networkDanger > 35 ? '#f59e0b' : '#10b981',
                    note: `${suspect?.knownAssociates?.length} known associates`,
                  },
                ].map(factor => (
                  <div key={factor.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#cbd5e1' }}>{factor.label}</span>
                        <span style={{ fontSize: 9, color: '#475569', display: 'block', marginTop: 1 }}>{factor.note}</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: factor.color }}>
                        {factor.score}
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        width: `${factor.score}%`,
                        background: `linear-gradient(90deg, ${factor.color}88, ${factor.color})`,
                        transition: 'width 1s ease',
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── CASE TIMELINE ── */}
              <div className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                  <Clock size={13} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Investigation Timeline
                  </span>
                </div>

                <div style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid rgba(255,255,255,0.06)', marginLeft: 6 }}>
                  {selectedFir.timeline.slice(-3).map((step, i) => (
                    <div key={i} style={{ marginBottom: 14, position: 'relative' }}>
                      {/* Node dot */}
                      <div style={{
                        position: 'absolute', left: -27, top: 2,
                        width: 12, height: 12, borderRadius: '50%',
                        background: i === selectedFir.timeline.slice(-3).length - 1
                          ? '#f59e0b'
                          : '#10b981',
                        border: '2px solid #020617',
                        boxShadow: i === selectedFir.timeline.slice(-3).length - 1
                          ? '0 0 8px rgba(245,158,11,0.5)'
                          : '0 0 6px rgba(16,185,129,0.4)',
                      }} />

                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#475569', marginBottom: 2 }}>
                        {step.timestamp}
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 700, color: '#cbd5e1', marginBottom: 2,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        {step.status}
                        {i === selectedFir.timeline.slice(-3).length - 1 && (
                          <span style={{
                            fontSize: 8, fontWeight: 800, background: 'rgba(245,158,11,0.15)',
                            color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)',
                            borderRadius: 3, padding: '0 5px', letterSpacing: '0.06em',
                          }}>LATEST</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.4 }}>{step.notes}</div>
                    </div>
                  ))}
                </div>

                {/* View full FIR link */}
                <Link
                  href={`/fir?id=${selectedFir.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    marginTop: 6, padding: '7px 0',
                    borderRadius: 7, border: '1px solid rgba(30, 58, 95,0.15)',
                    background: 'rgba(30, 58, 95,0.04)', cursor: 'pointer',
                    fontSize: 11, fontWeight: 700, color: '#0F6B5C',
                    transition: 'all 0.2s',
                  }}>
                    <FileText size={11} /> View Full FIR <ArrowRight size={11} />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── INLINE ANIMATION STYLES ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.88); }
        }
        @keyframes pulse-red {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
