'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Crosshair, FileText, Clock, MapPin, Phone, Car,
  Building2, Users, AlertTriangle, CheckSquare, Square, Zap, Eye,
  ArrowRight, Brain, Target, Check, Send,
  MessageSquare, Download, Share2,
  CalendarDays, Lightbulb, ShieldAlert, User, BarChart2,
  Network, Route,
} from 'lucide-react';
import Link from 'next/link';
import { FIR_RECORDS, FIRRecord } from '@/lib/mockData';

type StatusFilter = 'all' | 'investigating' | 'arrested' | 'monitoring' | 'resolved';
type TabMode = 'leads' | 'chat';

interface Lead {
  id: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  details: string;
  timeEstimate: string;
  Icon: React.ElementType;
  category: string;
}

interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f59e0b', MEDIUM: '#0F6B5C', LOW: '#64748b',
};
const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: 'badge badge-red', HIGH: 'badge badge-amber', MEDIUM: 'badge badge-cyan', LOW: 'badge badge-gray',
};
const STATUS_BADGE: Record<string, string> = {
  investigating: 'badge badge-amber', arrested: 'badge badge-cyan',
  monitoring: 'badge badge-purple', resolved: 'badge badge-green',
};

function getRiskBadge(level: string) {
  if (level === 'Critical') return 'badge badge-red';
  if (level === 'High') return 'badge badge-amber';
  if (level === 'Medium') return 'badge badge-cyan';
  return 'badge badge-gray';
}

function nowTs() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

// ── LOCAL AI RESPONSE ENGINE ──────────────────────────────────────────────────
function generateResponse(query: string, fir: FIRRecord): string {
  const q = query.toLowerCase();
  const s = fir.suspectDetails;
  const isCyber = fir.crimeCategory.toLowerCase().includes('cyber') || fir.crimeCategory.toLowerCase().includes('fraud') || fir.crimeCategory.toLowerCase().includes('financial');
  const isDrug = fir.crimeCategory.toLowerCase().includes('narcotic') || fir.crimeCategory.toLowerCase().includes('drug');
  const isTheft = fir.crimeCategory.toLowerCase().includes('theft') || fir.crimeCategory.toLowerCase().includes('robbery');
  const recidivismRisk = Math.min(100, s.arrestCount * 15 + s.profileScore * 0.5);
  const flightRisk = s.riskLevel === 'Critical' ? 85 : s.riskLevel === 'High' ? 62 : s.riskLevel === 'Medium' ? 38 : 20;
  const networkDanger = Math.min(100, s.knownAssociates.length * 20 + 20);
  const riskColor = s.profileScore > 80 ? 'CRITICAL' : s.profileScore > 65 ? 'HIGH' : s.profileScore > 45 ? 'MEDIUM' : 'LOW';

  if (q.includes('why') || q.includes('target') || q.includes('suspect') || q.includes('accused')) {
    return `**Targeting Rationale — ${s.name}** (${fir.firNumber})\n\n**Case:** ${fir.crimeCategory} | ${fir.district} | ${fir.date}\n**Officer:** ${fir.assignedOfficer}\n\n**Grounds:**\n• ${s.crimeHistory.length} verified criminal record(s): ${s.crimeHistory.join('; ')}\n• Prior arrests: ${s.arrestCount}\n• Risk Matrix Score: **${s.profileScore}/100** (${riskColor})\n• ${s.knownAssociates.length} known criminal associates\n• Status: **${s.status}**\n\n**AI Threat Assessment:**\n• Recidivism Risk: ${Math.round(recidivismRisk)}%\n• Flight Risk: ${flightRisk}%\n• Network Danger: ${Math.round(networkDanger)}%\n• Recent Activity: ${s.recentActivity}${isCyber ? '\n\n**Note:** Cyber/financial crime — digital forensics and financial trail are priority vectors.' : ''}${isDrug ? '\n\n**Note:** Narcotics — NDPS Act applies. Coordinate with NCB if inter-state network confirmed.' : ''}`;
  }
  if (q.includes('network') || q.includes('relationship') || q.includes('associate') || q.includes('linked')) {
    return `**Criminal Network Analysis — ${fir.firNumber}**\n\n**Primary Suspect:** ${s.name} | ${s.riskLevel} Risk\n\n**Known Associates (${s.knownAssociates.length} mapped):**\n${s.knownAssociates.map((a, i) => `  ${i + 1}. ${a}`).join('\n')}\n\n**Network Danger Index:** ${Math.round(networkDanger)}% — ${networkDanger > 60 ? 'HIGH collective threat' : networkDanger > 35 ? 'MODERATE activity' : 'Limited footprint'}\n\n**Vehicles (possible relay network):**\n${s.vehiclesUsed.map(v => `  • ${v}`).join('\n')}\n\n**Mobile Numbers (for CDR cross-reference):**\n${s.mobileNumbers.map(m => `  • ${m}`).join('\n')}\n\n**Action:** Cross-reference all associates against active FIRs in ${fir.district}.\n\n→ For interactive graph, visit the **Criminal Network** page.`;
  }
  if (q.includes('gps') || q.includes('location') || q.includes('route') || q.includes('track') || q.includes('map') || q.includes('tactical')) {
    return `**Tactical Location Profile — ${fir.firNumber}**\n\n**District:** ${fir.district}\n**Incident Date:** ${fir.date}\n**Last Known Location:** ${s.recentActivity}\n\n**Vehicles of Interest:**\n${s.vehiclesUsed.map(v => `  • ${v} — verify at RTO and toll booths in ${fir.district} corridor`).join('\n')}\n\n**Recommended Actions:**\n1. Pull CCTV from 500m radius of incident zone in ${fir.district}\n2. Request toll booth records on NH through ${fir.district}\n3. Tower dump for device: ${s.mobileNumbers[0] ?? 'on file'}\n4. Cross-check vehicle sighting logs: ${s.vehiclesUsed[0] ?? 'on file'}\n\n**Status:** Investigation is **${fir.investigationStatus}**\n\n→ For interactive map, visit the **Crime Map** page.`;
  }
  if (q.includes('timeline') || q.includes('chronolog') || q.includes('when') || q.includes('sequence') || q.includes('event')) {
    return `**Investigation Chronology — ${fir.firNumber}**\n\n**Case:** ${fir.crimeCategory} | ${fir.district}\n\n${fir.timeline.map((step, i) => `**Step ${i + 1} — ${step.status}**\n  Time: ${step.timestamp}\n  Officer: ${step.officerName}\n  Notes: ${step.notes}`).join('\n\n')}\n\n**Current Status:** Case is **${fir.investigationStatus.toUpperCase()}**\n${fir.investigationStatus === 'resolved' ? '\n**Case resolved.** Chargesheet filed.' : fir.investigationStatus === 'arrested' ? '\n**Suspect in custody.** Chargesheet in progress.' : fir.investigationStatus === 'investigating' ? '\n**Active investigation.** Next: suspect identification and arrest.' : '\n**Active surveillance.** Network mapping complete.'}\n\n→ For full timeline, visit the **Timeline** page.`;
  }
  if (q.includes('next') || q.includes('step') || q.includes('recommend') || q.includes('action') || q.includes('operational')) {
    const urgency = s.profileScore > 80 ? 'IMMEDIATE' : s.profileScore > 60 ? 'HIGH PRIORITY' : 'STANDARD';
    return `**Operational Recommendations — ${fir.firNumber}** [${urgency}]\n\n**Suspect:** ${s.name} | Risk Score: ${s.profileScore}/100\n\n**Immediate (0–24 hrs):**\n1. ${isCyber ? 'Submit digital devices to Cyber Cell forensics — priority queue' : isTheft ? 'Recover stolen property via pawn shop and marketplace trace' : 'Secure all physical evidence exhibits'}\n2. Obtain CDR for ${s.mobileNumbers[0] ?? 'suspect mobile'} — 30-day lookback\n3. Request CCTV footage from ${fir.district} incident zone (±500m, ±2 hrs)\n${s.arrestCount > 2 ? `4. Issue Look Out Circular (LOC) — repeat offender (${s.arrestCount} arrests)` : '4. Maintain active surveillance on suspect'}\n\n**Short-term (24–72 hrs):**\n• Audit bank account: ${s.bankAccounts[0] ?? 'on file'}\n• Trace vehicle ${s.vehiclesUsed[0] ?? 'on file'} via RTO\n• Interview associates: ${s.knownAssociates.slice(0, 2).join(', ')}\n• Brief SP — risk score ${s.profileScore} warrants escalation${isCyber ? '\n\n**Cyber-Specific:**\n• Contact CERT-In if digital infrastructure affected\n• Request ED financial intelligence for amounts above Rs.10 lakh' : ''}${isDrug ? '\n\n**Narcotics-Specific:**\n• Notify NCB district unit\n• Apply NDPS Act Section 42 (search without warrant if required)' : ''}\n\n**Evidence:** ${fir.evidenceCount} exhibits secured | Officer: ${fir.assignedOfficer}`;
  }
  if (q.includes('risk') || q.includes('threat') || q.includes('danger') || q.includes('score')) {
    return `**Threat Matrix — ${fir.firNumber}**\n\n**Suspect:** ${s.name}\n\nRisk Score: ${s.profileScore}/100 (${riskColor})\nRecidivism Risk: ${Math.round(recidivismRisk)}%\nFlight Risk: ${flightRisk}%\nNetwork Danger: ${Math.round(networkDanger)}%\n\n**Basis:**\n• ${s.arrestCount} prior arrest(s)\n• History: ${s.crimeHistory.join('; ')}\n• ${s.knownAssociates.length} known criminal associates\n• Current status: ${s.status}\n\n**FIR Risk Score: ${fir.riskScore}/100** — ${fir.riskScore > 80 ? 'CRITICAL — escalate to SP/DCP immediately' : fir.riskScore > 60 ? 'HIGH — daily status review required' : 'STANDARD — weekly review cycle'}`;
  }
  if (q.includes('evidence') || q.includes('exhibit') || q.includes('forensic') || q.includes('proof')) {
    return `**Evidence Summary — ${fir.firNumber}**\n\n**Exhibits Secured:** ${fir.evidenceCount} items (${Math.round((fir.evidenceCount / 10) * 100)}% of target)\n\n**Registry:**\n${Array.from({ length: fir.evidenceCount }, (_, i) => `  • EXHIBIT-KSP-${String(i + 1).padStart(2, '0')} — SECURED`).join('\n')}\n\n**Gap Analysis:** ${fir.evidenceCount < 5 ? 'Insufficient evidence — urgent CCTV and digital forensics collection required.' : fir.evidenceCount < 8 ? 'Moderate base — supplement with CDR and financial records.' : 'Strong evidence base — chargesheet preparation can proceed.'}\n\n**Priority Forensics:** ${isCyber ? 'Digital device forensics (IMEI, transactions, email)' : isTheft ? 'Stolen property recovery and fingerprints' : isDrug ? 'Narcotics quantity testing and chain-of-custody' : 'Physical evidence verification'}\n\n**Case Officer:** ${fir.assignedOfficer}`;
  }
  if (q.includes('officer') || q.includes('assigned') || q.includes('investigator')) {
    return `**Case Assignment — ${fir.firNumber}**\n\n**Investigating Officer:** ${fir.assignedOfficer}\n**District:** ${fir.district}\n**Status:** ${fir.investigationStatus}\n\n**Progress:**\n• ${fir.timeline.length} timeline milestones recorded\n• ${fir.evidenceCount} exhibits secured\n• Latest action: "${fir.timeline[fir.timeline.length - 1]?.status}" — ${fir.timeline[fir.timeline.length - 1]?.timestamp}\n\n**Escalation Path:** Sub-Inspector → Inspector → DySP → SP → IGP (${fir.district} Range)\n\nRisk Score ${s.profileScore} ${s.profileScore > 80 ? '→ Immediate DySP notification recommended' : '→ Standard reporting cycle'}`;
  }
  if (q.includes('who') || q.includes('profile') || q.includes('detail') || q.includes('about') || q.includes('information')) {
    return `**Accused Profile — ${fir.firNumber}**\n\n**Name:** ${s.name}\n**Age:** ${s.age} | **Gender:** ${s.gender}\n**Home District:** ${s.district}\n**Status:** ${s.status} | **Risk Level:** ${s.riskLevel} (${s.profileScore}/100)\n\n**Criminal History (${s.crimeHistory.length} records):**\n${s.crimeHistory.map(h => `  • ${h}`).join('\n')}\n\n**Active Case:** ${fir.crimeCategory} | ${fir.firNumber} | ${fir.date}\n\n**Contact Identifiers:**\n• Mobile: ${s.mobileNumbers.join(', ')}\n• Vehicle: ${s.vehiclesUsed.join(', ')}\n• Bank: ${s.bankAccounts.join(', ')}\n\n**Last Known Activity:** ${s.recentActivity}`;
  }
  return `**Case Summary — ${fir.firNumber}**\n\n**Type:** ${fir.crimeCategory} | **District:** ${fir.district} | **Date:** ${fir.date}\n**Status:** ${fir.investigationStatus.toUpperCase()} | **Officer:** ${fir.assignedOfficer}\n**Suspect:** ${s.name} | Age ${s.age} | ${s.riskLevel} Risk (${s.profileScore}/100)\n**Evidence:** ${fir.evidenceCount} exhibits | **Prior Cases:** ${s.crimeHistory.length} | **Arrests:** ${s.arrestCount}\n\nI can answer more specific questions. Try:\n• "Why is this suspect targeted?"\n• "Show the investigation timeline"\n• "What are the next operational steps?"\n• "Show the suspect network"\n• "Risk assessment"\n• "Evidence summary"\n\nQuery: "${query.substring(0, 60)}${query.length > 60 ? '...' : ''}" — showing case overview.`;
}

function generateLeads(fir: FIRRecord): Lead[] {
  const s = fir.suspectDetails;
  const isCyber = fir.crimeCategory.toLowerCase().includes('cyber') || fir.crimeCategory.toLowerCase().includes('fraud') || fir.crimeCategory.toLowerCase().includes('financial');
  const leads: Lead[] = [
    { id: 1, priority: fir.riskScore > 80 ? 'CRITICAL' : 'HIGH', action: `Obtain CDR for mobile ${s.mobileNumbers[0] ?? '+91-XXXXXXXXXX'}`, details: `Call Detail Records from last 30 days. Request under Section 91 CrPC. Focus on calls around ${fir.date} ± 7 days.`, timeEstimate: '2–4 hours', Icon: Phone, category: 'MOBILE INTELLIGENCE' },
    { id: 2, priority: 'HIGH', action: `Trace vehicle ${s.vehiclesUsed[0] ?? 'KA-XX-XX-XXXX'} ownership`, details: `RTO database query for full ownership chain. Check toll booth CCTV in ${fir.district} corridor.`, timeEstimate: '4–6 hours', Icon: Car, category: 'VEHICLE TRACING' },
    { id: 3, priority: 'HIGH', action: `Audit bank account ${s.bankAccounts[0] ?? 'Account on file'}`, details: `Request 6-month transaction statement. Check structured deposits, hawala patterns, flagged peer transfers.`, timeEstimate: '24–48 hours', Icon: Building2, category: 'FINANCIAL AUDIT' },
    { id: 4, priority: 'MEDIUM', action: `Surveil associate: ${s.knownAssociates[0] ?? 'Associate on record'}`, details: `Cross-reference their CDR and location with incident timeline. Request surveillance authorization from DCP.`, timeEstimate: '6–12 hours', Icon: Users, category: 'ASSOCIATE SURVEILLANCE' },
    { id: 5, priority: 'HIGH', action: `Request CCTV from ${fir.district} incident zone`, details: `All cameras within 500m. Footage from incident day ± 2 hours. Coordinate with traffic police.`, timeEstimate: '2–3 hours', Icon: Eye, category: 'CCTV ANALYSIS' },
    { id: 6, priority: 'MEDIUM', action: `Interview complainant — case ${fir.firNumber}`, details: `Section 161 CrPC statement. Focus on timeline, vehicle description, suspect description.`, timeEstimate: '1–2 hours', Icon: Users, category: 'WITNESS INTERVIEW' },
    ...(isCyber ? [{ id: 7, priority: 'CRITICAL' as const, action: 'Submit devices for digital forensics', details: `Extract IMEI, email logs, transaction history from seized devices. Coordinate with Cyber Crime Cell, Bengaluru.`, timeEstimate: '48–72 hours', Icon: Target, category: 'DIGITAL FORENSICS' }] : []),
    { id: isCyber ? 8 : 7, priority: 'LOW', action: `Cross-reference similar cases in ${fir.district}`, details: `Search FIR database for matching MO: ${fir.crimeCategory}, similar victim profile, same district.`, timeEstimate: '1 hour', Icon: FileText, category: 'CROSS-REFERENCE' },
  ];
  return leads;
}

const SUGGESTED_PROMPTS = [
  { label: 'Why is this suspect targeted?', query: 'Why is this suspect targeted?', Icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  { label: 'Show suspect relationship network.', query: 'Show suspect relationship network.', Icon: Network, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
  { label: 'Show GPS tracking routes.', query: 'Show GPS tracking routes.', Icon: Route, color: '#0F6B5C', bg: 'rgba(15,107,92,0.08)', border: 'rgba(15,107,92,0.25)' },
  { label: 'Show chronological timeline.', query: 'Show chronological timeline.', Icon: CalendarDays, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  { label: 'What next operational steps are recommended?', query: 'What next operational steps are recommended?', Icon: Lightbulb, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
];

export default function InvestigationCopilotPage() {
  const [selectedFir, setSelectedFir] = useState<FIRRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [checkedLeads, setCheckedLeads] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<TabMode>('leads');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredFIRs = FIR_RECORDS.filter(f => statusFilter === 'all' || f.investigationStatus === statusFilter);

  const handleSelectFir = (fir: FIRRecord) => {
    setSelectedFir(fir);
    setCheckedLeads(new Set());
    setMessages([{
      id: crypto.randomUUID(),
      role: 'system',
      content: `AI investigative workspace initialized for case **${fir.firNumber}** — ${fir.crimeCategory}, ${fir.district}. Suspect: **${fir.suspectDetails.name}** | Risk Score: ${fir.riskScore}/100 | Status: ${fir.investigationStatus.toUpperCase()}. How can I assist?`,
      timestamp: nowTs(),
    }]);
    setInputText('');
    setActiveTab('leads');
  };

  const leads = selectedFir ? generateLeads(selectedFir) : [];
  const completedCount = leads.filter(l => checkedLeads.has(l.id)).length;
  const suspect = selectedFir?.suspectDetails;
  const recidivismRisk = suspect ? Math.min(100, suspect.arrestCount * 15 + suspect.profileScore * 0.5) : 0;
  const flightRisk = suspect?.riskLevel === 'Critical' ? 85 : suspect?.riskLevel === 'High' ? 62 : suspect?.riskLevel === 'Medium' ? 38 : 20;
  const networkDanger = suspect ? Math.min(100, suspect.knownAssociates.length * 20 + 20) : 0;

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const sendMessage = (queryText: string) => {
    if (!selectedFir || !queryText.trim()) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: queryText.trim(), timestamp: nowTs() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      const assistantMsg: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', content: generateResponse(queryText, selectedFir), timestamp: nowTs() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleExport = () => {
    if (!selectedFir) return;
    const s = selectedFir.suspectDetails;
    const lines = [
      `INTELLIGENCE DOSSIER — ${selectedFir.firNumber}`, '='.repeat(60),
      `Crime: ${selectedFir.crimeCategory}`, `District: ${selectedFir.district}`,
      `Date: ${selectedFir.date}`, `Status: ${selectedFir.investigationStatus.toUpperCase()}`,
      `Officer: ${selectedFir.assignedOfficer}`, '',
      'ACCUSED PROFILE', '-'.repeat(40),
      `Name: ${s.name}`, `Age: ${s.age} | Gender: ${s.gender}`,
      `Risk: ${s.riskLevel} (${s.profileScore}/100)`, `Arrests: ${s.arrestCount}`,
      `Associates: ${s.knownAssociates.join(', ')}`,
      `Vehicles: ${s.vehiclesUsed.join(', ')}`, `Mobile: ${s.mobileNumbers.join(', ')}`, '',
      'EVIDENCE', '-'.repeat(40), `Exhibits Secured: ${selectedFir.evidenceCount}`, '',
      'TIMELINE', '-'.repeat(40),
      ...selectedFir.timeline.map(t => `[${t.timestamp}] ${t.status}: ${t.notes}`),
      '', `Generated by CrimeVision AI Copilot | ${new Date().toISOString()}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Dossier_${selectedFir.firNumber.replace(/\//g, '_')}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncCommand = () => {
    if (!selectedFir) return;
    alert(`Command Desk Sync initiated for ${selectedFir.firNumber}.\n\nDispatched to:\n• District Control Room — ${selectedFir.district}\n• Officer: ${selectedFir.assignedOfficer}\n• Synced at ${nowTs()}`);
  };

  const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' }, { label: 'Investigating', value: 'investigating' },
    { label: 'Arrested', value: 'arrested' }, { label: 'Monitoring', value: 'monitoring' },
    { label: 'Resolved', value: 'resolved' },
  ];

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(15,107,92,0.08)', border: '1px solid rgba(15,107,92,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crosshair size={24} color="#0F6B5C" />
          </div>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              INVESTIGATION COPILOT
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', background: 'rgba(15,107,92,0.1)', color: '#0F6B5C', border: '1px solid rgba(15,107,92,0.25)', borderRadius: 4, padding: '2px 8px' }}>AI</span>
            </h1>
            <p className="page-subtitle">AI investigation leads, chat workspace and operational recommendations — no external API required</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '5px 12px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulse-green 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', letterSpacing: '0.08em' }}>COPILOT ACTIVE</span>
          </div>
          <div style={{ background: 'rgba(15,107,92,0.08)', border: '1px solid rgba(15,107,92,0.2)', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: '#0F6B5C' }}>LOCAL AI ENGINE</div>
          {selectedFir && (
            <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#f59e0b', cursor: 'pointer' }}>
              <Download size={12} /> Export Dossier
            </button>
          )}
          {selectedFir && (
            <button onClick={handleSyncCommand} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#8b5cf6', cursor: 'pointer' }}>
              <Share2 size={12} /> Sync Command Desk
            </button>
          )}
        </div>
      </div>

      {/* THREE-COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '26% 1fr 25%', gap: 18, alignItems: 'start' }}>

        {/* LEFT: CASE SELECTOR */}
        <div className="glass-card" style={{ padding: 18, minHeight: '80vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FileText size={14} color="#0F6B5C" />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Load Case Dossier</span>
            <span className="badge badge-cyan" style={{ marginLeft: 'auto', fontSize: 10 }}>{filteredFIRs.length} cases</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {STATUS_FILTERS.map(f => (
              <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{ padding: '4px 10px', borderRadius: 14, fontSize: 10, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', border: `1px solid ${statusFilter === f.value ? 'rgba(15,107,92,0.4)' : 'var(--border-default)'}`, background: statusFilter === f.value ? 'rgba(15,107,92,0.08)' : 'var(--neutral-light)', color: statusFilter === f.value ? '#0F6B5C' : 'var(--text-muted)', transition: 'all 0.2s' }}>
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '72vh', overflowY: 'auto', paddingRight: 2 }}>
            {filteredFIRs.map(fir => {
              const isSelected = selectedFir?.id === fir.id;
              return (
                <div key={fir.id} onClick={() => handleSelectFir(fir)} style={{ padding: '12px 14px', borderRadius: 10, cursor: 'pointer', border: `1px solid ${isSelected ? 'rgba(15,107,92,0.4)' : 'var(--border-default)'}`, background: isSelected ? 'rgba(15,107,92,0.05)' : 'var(--bg-card)', boxShadow: isSelected ? '0 0 10px rgba(15,107,92,0.08)' : 'none', transition: 'all 0.18s', position: 'relative' }}>
                  {fir.riskScore > 60 && <div style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 7, borderRadius: '50%', background: fir.riskScore > 80 ? '#ef4444' : '#f59e0b', animation: fir.riskScore > 80 ? 'pulse-red 1.5s infinite' : 'none' }} />}
                  <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, color: '#0F6B5C', marginBottom: 4 }}>{fir.firNumber}</div>
                  <div style={{ marginBottom: 6 }}><span className="badge badge-gray" style={{ fontSize: 9 }}>{fir.crimeCategory}</span></div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{fir.suspectDetails.name}</div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--text-muted)', marginBottom: 7 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={9} /> {fir.district}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={9} /> {fir.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className={STATUS_BADGE[fir.investigationStatus]} style={{ fontSize: 9 }}>{fir.investigationStatus}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'monospace', color: fir.riskScore > 80 ? '#ef4444' : fir.riskScore > 60 ? '#f59e0b' : '#64748b' }}>Risk {fir.riskScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER: TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {!selectedFir ? (
            <div className="glass-card" style={{ padding: 60, textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 28 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(15,107,92,0.2)' }} />
                <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1px solid rgba(15,107,92,0.15)' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(rgba(15,107,92,0.15) 0deg, transparent 60deg, transparent 360deg)', animation: 'spin 3s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Crosshair size={32} color="#0F6B5C" /></div>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Select a case to activate Investigation Copilot</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 340, lineHeight: 1.6 }}>Choose any FIR from the panel. The AI copilot generates investigation leads and opens a chat workspace — no external API required.</p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15,107,92,0.06)', border: '1px solid rgba(15,107,92,0.15)', borderRadius: 10, padding: '10px 20px' }}>
                <Brain size={14} color="#0F6B5C" />
                <span style={{ fontSize: 12, color: '#0F6B5C', fontWeight: 600 }}>{FIR_RECORDS.length} case files indexed • Local AI engine ready</span>
              </div>
            </div>
          ) : (
            <>
              {/* CASE BRIEF */}
              <div className="glass-card" style={{ padding: '10px 18px', marginBottom: 12, background: 'rgba(15,107,92,0.03)', border: '1px solid rgba(15,107,92,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', fontSize: 11 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0F6B5C', fontSize: 12 }}>{selectedFir.firNumber}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedFir.crimeCategory}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-secondary)' }}><MapPin size={10} /> {selectedFir.district}</span>
                  <span style={{ color: 'var(--text-muted)' }}>|</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{selectedFir.assignedOfficer}</span>
                  <span style={{ marginLeft: 'auto' }}><span className={STATUS_BADGE[selectedFir.investigationStatus]} style={{ fontSize: 10 }}>{selectedFir.investigationStatus}</span></span>
                </div>
              </div>

              {/* TABS */}
              <div style={{ display: 'flex', marginBottom: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                {([{ id: 'leads', label: 'Investigation Leads', Icon: Target }, { id: 'chat', label: 'AI Chat Workspace', Icon: MessageSquare }] as { id: TabMode; label: string; Icon: React.ElementType }[]).map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: activeTab === tab.id ? 'rgba(15,107,92,0.08)' : 'var(--bg-card)', color: activeTab === tab.id ? '#0F6B5C' : 'var(--text-muted)', borderBottom: activeTab === tab.id ? '2px solid #0F6B5C' : '2px solid transparent', transition: 'all 0.2s' }}>
                    <tab.Icon size={14} />
                    {tab.label}
                    {tab.id === 'chat' && messages.length > 1 && (
                      <span style={{ fontSize: 9, fontWeight: 800, background: '#0F6B5C', color: '#fff', borderRadius: 10, padding: '1px 6px' }}>{messages.length - 1}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* LEADS TAB */}
              {activeTab === 'leads' && (
                <>
                  <div className="glass-card" style={{ padding: 20, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={15} color="#0F6B5C" />
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TOP INVESTIGATION LEADS</span>
                        <span style={{ fontSize: 9, fontWeight: 800, background: 'rgba(15,107,92,0.08)', color: '#0F6B5C', border: '1px solid rgba(15,107,92,0.2)', borderRadius: 4, padding: '1px 6px' }}>AI GENERATED</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: completedCount === leads.length ? 'rgba(16,185,129,0.08)' : 'var(--neutral-light)', border: `1px solid ${completedCount === leads.length ? 'rgba(16,185,129,0.2)' : 'var(--border-default)'}`, borderRadius: 8, padding: '5px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: completedCount === leads.length ? '#10b981' : 'var(--text-secondary)' }}>{completedCount}/{leads.length} Completed</span>
                        {completedCount === leads.length && <Check size={12} color="#10b981" />}
                      </div>
                    </div>
                    <div style={{ height: 4, background: 'var(--neutral-light)', borderRadius: 3, overflow: 'hidden', marginBottom: 18, border: '1px solid var(--border-default)' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${leads.length > 0 ? (completedCount / leads.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #059669, #10b981)', transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {leads.map(lead => {
                        const isChecked = checkedLeads.has(lead.id);
                        const bc = PRIORITY_COLOR[lead.priority];
                        return (
                          <div key={lead.id} style={{ padding: '14px 16px', borderRadius: '0 10px 10px 0', borderLeft: `3px solid ${isChecked ? 'var(--border-default)' : bc}`, background: isChecked ? 'var(--neutral-light)' : 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeftColor: isChecked ? 'var(--border-default)' : bc, borderLeftWidth: 3, opacity: isChecked ? 0.55 : 1, transition: 'all 0.25s' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                              <button onClick={() => setCheckedLeads(prev => { const n = new Set(prev); n.has(lead.id) ? n.delete(lead.id) : n.add(lead.id); return n; })} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginTop: 1 }}>
                                {isChecked ? <CheckSquare size={17} color="#10b981" /> : <Square size={17} color="#94a3b8" />}
                              </button>
                              <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 8, background: isChecked ? 'var(--neutral-light)' : `${bc}10`, border: `1px solid ${isChecked ? 'var(--border-default)' : `${bc}30`}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                                <lead.Icon size={16} color={isChecked ? '#94a3b8' : bc} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, flexWrap: 'wrap' }}>
                                  <span className={PRIORITY_BADGE[lead.priority]} style={{ fontSize: 9 }}>{lead.priority}</span>
                                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'monospace' }}>#{lead.id}</span>
                                  <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{lead.category}</span>
                                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, background: 'var(--neutral-light)', border: '1px solid var(--border-default)', borderRadius: 5, padding: '2px 7px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                                    <Clock size={10} /> {lead.timeEstimate}
                                  </div>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)', marginBottom: 5, lineHeight: 1.4, textDecoration: isChecked ? 'line-through' : 'none' }}>{lead.action}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55 }}>{lead.details}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <Zap size={14} color="#f59e0b" />
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>RECOMMENDED NEXT ACTIONS</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      <Link href="/reports" style={{ textDecoration: 'none' }}><button className="cyber-btn cyber-btn-cyan" style={{ width: '100%', justifyContent: 'center', padding: '13px 16px', fontSize: 12, flexDirection: 'column', gap: 6, height: 'auto' }}><FileText size={18} /><span>Generate Full</span><span>Report</span></button></Link>
                      <Link href="/network" style={{ textDecoration: 'none' }}><button style={{ width: '100%', padding: '13px 16px', borderRadius: 10, cursor: 'pointer', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', color: '#7c3aed', fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Users size={18} /><span>Criminal</span><span>Network</span></button></Link>
                      <Link href="/detective" style={{ textDecoration: 'none' }}><button style={{ width: '100%', padding: '13px 16px', borderRadius: 10, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', fontSize: 12, fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Brain size={18} /><span>AI Detective</span><span>Analysis</span></button></Link>
                    </div>
                  </div>
                </>
              )}

              {/* CHAT TAB */}
              {activeTab === 'chat' && (
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '72vh' }}>
                  {/* Chat header */}
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Brain size={15} color="#0F6B5C" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>AI INVESTIGATIVE CHAT</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-green 1.5s infinite' }} />
                      LOCAL ENGINE — No API Key Needed
                    </span>
                  </div>

                  {/* Suggested Prompts */}
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {SUGGESTED_PROMPTS.map(p => (
                      <button key={p.label} onClick={() => { setActiveTab('chat'); sendMessage(p.query); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', background: p.bg, border: `1px solid ${p.border}`, fontSize: 11, fontWeight: 700, color: p.color, transition: 'opacity 0.15s', whiteSpace: 'nowrap' }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
                        <p.Icon size={11} /> {p.label}
                      </button>
                    ))}
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 8px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {messages.map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: msg.role === 'user' ? 'rgba(30,58,95,0.08)' : msg.role === 'system' ? 'rgba(245,158,11,0.08)' : 'rgba(15,107,92,0.08)', border: `1px solid ${msg.role === 'user' ? 'rgba(30,58,95,0.2)' : msg.role === 'system' ? 'rgba(245,158,11,0.2)' : 'rgba(15,107,92,0.2)'}` }}>
                          {msg.role === 'user' ? <User size={14} color="#1e3a5f" /> : msg.role === 'system' ? <Zap size={13} color="#f59e0b" /> : <Brain size={14} color="#0F6B5C" />}
                        </div>
                        <div style={{ maxWidth: '82%' }}>
                          <div style={{ padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: msg.role === 'user' ? 'rgba(30,58,95,0.06)' : msg.role === 'system' ? 'rgba(245,158,11,0.04)' : 'var(--bg-card)', border: `1px solid ${msg.role === 'user' ? 'rgba(30,58,95,0.12)' : msg.role === 'system' ? 'rgba(245,158,11,0.15)' : 'var(--border-default)'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                            <div style={{ fontSize: 12.5, color: 'var(--text-primary)', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {msg.content.split(/\*\*(.*?)\*\*/g).map((part, i) =>
                                i % 2 === 1 ? <strong key={i} style={{ color: msg.role === 'assistant' ? '#0F6B5C' : 'inherit' }}>{part}</strong> : part
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', padding: '0 4px' }}>
                            {msg.role === 'system' ? 'SYSTEM' : msg.role === 'user' ? 'YOU' : 'COPILOT AI'} • {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,107,92,0.08)', border: '1px solid rgba(15,107,92,0.2)' }}>
                          <Brain size={14} color="#0F6B5C" />
                        </div>
                        <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', display: 'flex', gap: 5, alignItems: 'center' }}>
                          {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F6B5C', animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`, display: 'inline-block' }} />)}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--neutral-light)' }}>
                    <input ref={inputRef} type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); } }} placeholder={`Ask about ${selectedFir.suspectDetails.name} or case ${selectedFir.firNumber}...`} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} onFocus={e => { e.target.style.borderColor = '#0F6B5C'; e.target.style.boxShadow = '0 0 0 2px rgba(15,107,92,0.1)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }} />
                    <button onClick={() => sendMessage(inputText)} disabled={!inputText.trim() || isTyping} style={{ width: 42, height: 42, borderRadius: 10, border: 'none', background: inputText.trim() && !isTyping ? '#0F6B5C' : 'var(--border-default)', color: inputText.trim() && !isTyping ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0 }}>
                      <Send size={17} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: INTELLIGENCE SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!selectedFir ? (
            <div className="glass-card" style={{ padding: 32, textAlign: 'center', minHeight: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Case intelligence will appear here after selection</p>
            </div>
          ) : (
            <>
              <div className="glass-card" style={{ padding: 18, border: '1px solid rgba(239,68,68,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
                  <AlertTriangle size={13} color="#ef4444" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Accused Profile</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={16} color="#ef4444" /></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{suspect?.name}</div>
                    <span className={getRiskBadge(suspect?.riskLevel ?? 'Low')} style={{ fontSize: 9, marginTop: 2 }}>{suspect?.riskLevel?.toUpperCase()} RISK</span>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Risk Score</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: (suspect?.profileScore ?? 0) > 80 ? '#ef4444' : '#f59e0b' }}>{suspect?.profileScore}/100</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--neutral-light)', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                    <div style={{ height: '100%', borderRadius: 6, width: `${suspect?.profileScore ?? 0}%`, background: (suspect?.profileScore ?? 0) > 80 ? 'linear-gradient(90deg,#b91c1c,#ef4444)' : 'linear-gradient(90deg,#b45309,#f59e0b)', transition: 'width 1s ease' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ label: 'Arrests', value: suspect?.arrestCount ?? 0, color: '#ef4444' }, { label: 'Associates', value: suspect?.knownAssociates?.length ?? 0, color: '#f59e0b' }, { label: 'Vehicles', value: suspect?.vehiclesUsed?.length ?? 0, color: '#8b5cf6' }, { label: 'Mobiles', value: suspect?.mobileNumbers?.length ?? 0, color: '#0F6B5C' }].map(f => (
                    <div key={f.label} style={{ background: 'var(--neutral-light)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: f.color, fontFamily: 'monospace' }}>{f.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
                  <CheckSquare size={13} color="#10b981" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Evidence Secured</span>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{selectedFir.evidenceCount} / 10 exhibits</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981' }}>{Math.round((selectedFir.evidenceCount / 10) * 100)}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--neutral-light)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                    <div style={{ height: '100%', borderRadius: 4, width: `${(selectedFir.evidenceCount / 10) * 100}%`, background: 'linear-gradient(90deg,#059669,#10b981)', transition: 'width 1s ease' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 130, overflowY: 'auto' }}>
                  {Array.from({ length: selectedFir.evidenceCount }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--neutral-light)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '5px 9px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700 }}>EXHIBIT-KSP-{String(i + 1).padStart(2, '0')}</span>
                      <span style={{ fontSize: 9, color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><Check size={9} /> Secured</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
                  <BarChart2 size={13} color="#8b5cf6" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Risk Analysis</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 4, padding: '1px 6px' }}>COMPUTED</span>
                </div>
                {[{ label: 'Recidivism Risk', score: Math.round(recidivismRisk), color: recidivismRisk > 70 ? '#ef4444' : recidivismRisk > 45 ? '#f59e0b' : '#10b981', note: `${suspect?.arrestCount} prior arrests` }, { label: 'Flight Risk', score: flightRisk, color: flightRisk > 70 ? '#ef4444' : flightRisk > 45 ? '#f59e0b' : '#10b981', note: `${suspect?.riskLevel} profile` }, { label: 'Network Danger', score: Math.round(networkDanger), color: networkDanger > 60 ? '#ef4444' : networkDanger > 35 ? '#f59e0b' : '#10b981', note: `${suspect?.knownAssociates?.length} associates` }].map(factor => (
                  <div key={factor.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                      <div><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{factor.label}</span><span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block', marginTop: 1 }}>{factor.note}</span></div>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: factor.color }}>{factor.score}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--neutral-light)', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                      <div style={{ height: '100%', borderRadius: 4, width: `${factor.score}%`, background: `linear-gradient(90deg,${factor.color}60,${factor.color})`, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, borderBottom: '1px solid var(--border-default)', paddingBottom: 10 }}>
                  <Clock size={13} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Investigation Timeline</span>
                </div>
                <div style={{ position: 'relative', paddingLeft: 20, borderLeft: '2px solid var(--border-default)', marginLeft: 6 }}>
                  {selectedFir.timeline.slice(-3).map((step, i) => (
                    <div key={i} style={{ marginBottom: 14, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -27, top: 2, width: 12, height: 12, borderRadius: '50%', background: i === selectedFir.timeline.slice(-3).length - 1 ? '#f59e0b' : '#10b981', border: '2px solid var(--bg-card)', boxShadow: i === selectedFir.timeline.slice(-3).length - 1 ? '0 0 5px rgba(245,158,11,0.4)' : 'none' }} />
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)', marginBottom: 2 }}>{step.timestamp}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {step.status}
                        {i === selectedFir.timeline.slice(-3).length - 1 && <span style={{ fontSize: 8, fontWeight: 800, background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 3, padding: '0 5px' }}>LATEST</span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{step.notes}</div>
                    </div>
                  ))}
                </div>
                <Link href={`/fir?id=${selectedFir.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 6, padding: '7px 0', borderRadius: 7, border: '1px solid var(--border-default)', background: 'var(--neutral-light)', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#0F6B5C' }}>
                    <FileText size={11} /> View Full FIR <ArrowRight size={11} />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-green { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes pulse-red { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes typingDot { 0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
