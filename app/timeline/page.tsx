'use client';

import { useState } from 'react';
import { 
  Clock, FileText, Share2, Calendar, Filter, ChevronDown, ChevronUp, MapPin, CheckCircle, Sparkles, UserCheck, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import AIRecommendationCard from '@/components/AIRecommendationCard';

// ─── Case Datasets with Timeline Events ──────────────────────────────────────

const CASES = [
  {
    id: "KA-2026-08821",
    title: "Sand Mafia Operations",
    category: "Sand Mafia",
    district: "Kalaburagi",
    progress: 72,
    severity: "CRITICAL",
    color: "#ef4444",
    statusBadge: "badge-red",
    events: [
      {
        time: "09:15 AM",
        title: "Crime Reported",
        subtitle: "Tungabhadra riverbank, Kalaburagi North",
        desc: "Reported by: Civilian tip-off. Large-scale illegal extraction spotted.",
        extra: "An anonymous caller reported multiple commercial trucks loading sand at the riverbed. Command center dispatched patrol unit to verify.",
        type: "fir",
        bulletColor: "#00D4FF", // Blue/Cyan
      },
      {
        time: "09:30 AM",
        title: "FIR Registered",
        subtitle: "FIR #KA-2026-08821",
        desc: "Officer: SI Mahesh Kumar, Kalaburagi North PS",
        extra: "Official FIR generated under IPC 379 and Section 21 of Mines & Minerals Act. Case assigned to Circle Inspector Mahesh.",
        type: "fir",
        bulletColor: "#f59e0b", // Amber
      },
      {
        time: "10:45 AM",
        title: "Evidence Uploaded",
        subtitle: "Tungabhadra sector logs",
        desc: "4 photographs, 2 witness statements, 1 forensic sample. Uploaded by: HC Ramu Patil.",
        extra: "Soil samples gathered from suspect trucks matched the riverbank soil profile. CCTV footage confirmed truck registration KA-32-Y-8821.",
        type: "officer",
        bulletColor: "#f59e0b", // Amber
      },
      {
        time: "12:10 PM",
        title: "Suspect Identified",
        subtitle: "AI match: 87% confidence",
        desc: "Suspect: Linked to 3 prior Sand Mafia cases. Criminal network: 5 associated individuals.",
        extra: "AI facial scan from checkpost cameras matched known offender Raju Naik. Social graphs link him to Raichur transportation hubs.",
        type: "ai",
        bulletColor: "#ef4444", // Red
      },
      {
        time: "13:20 PM",
        title: "AI Analysis Complete",
        subtitle: "Pattern matched: Raichur Sand Syndicate",
        desc: "Recommended action: Issue lookout + deploy patrol. Confidence: 92%.",
        extra: "System predicted exit route via NH-50 corridor at 15:00-16:00. Advised roadblock setup at checkpoint.",
        type: "ai",
        bulletColor: "#00D4FF", // Blue/Cyan
      },
      {
        time: "14:00 PM",
        title: "Officer Assigned",
        subtitle: "PI Ravi Shankar deployed",
        desc: "ETA: 25 minutes. Resources: 2 vehicles, 6 officers.",
        extra: "PI Ravi Shankar briefed and deployed to NH-50 checkpoint with spike strips and mobile interception unit.",
        type: "officer",
        bulletColor: "#10b981", // Green
      },
      {
        time: "15:30 PM",
        title: "Arrest Made",
        subtitle: "Suspect in custody",
        desc: "Location: NH-50 checkpoint, Kalaburagi.",
        extra: "Raju Naik and two co-conspirators intercepted at the checkpoint. 3 trucks seized. Booking reports logged.",
        type: "arrest",
        bulletColor: "#10b981", // Green
      }
    ],
    recommendation: {
      action: "Issue Lookout Notice + Deploy Patrol",
      rationale: "Historical pattern matches Raichur sand syndicate. Intercept vehicle route on NH-50 corridor immediately.",
      urgency: "CRITICAL",
      priority: 1
    }
  },
  {
    id: "KA-2026-08734",
    title: "Cyber Fraud Campaign",
    category: "Cyber Fraud",
    district: "Bengaluru",
    progress: 45,
    severity: "HIGH",
    color: "#f59e0b",
    statusBadge: "badge-amber",
    events: [
      {
        time: "10:05 AM",
        title: "Crime Reported",
        subtitle: "OTP phishing complaints, Bengaluru East",
        desc: "Reported by: Citizen victims. Large-scale bank account siphoning detected.",
        extra: "89 unique phishing complaints received within a 30-minute window in HSR Layout sector.",
        type: "fir",
        bulletColor: "#00D4FF",
      },
      {
        time: "10:30 AM",
        title: "FIR Registered",
        subtitle: "FIR #KA-2026-08734",
        desc: "Officer: Inspector Anil K, Cyber Crime PS, Bengaluru",
        extra: "FIR logged under IT Act Section 66D. Bank transaction logs requested.",
        type: "fir",
        bulletColor: "#f59e0b",
      },
      {
        time: "11:45 AM",
        title: "Evidence Uploaded",
        subtitle: "Gateway SMS logs and wallet headers",
        desc: "23 SMS Headers, 3 IP Logs, 1 Wallet Address. Uploaded by: Cyber Inspector Anil.",
        extra: "Phishing links traced back to virtual servers hosted in Delhi/NCR corridor. Intercept logs created.",
        type: "officer",
        bulletColor: "#f59e0b",
      },
      {
        time: "12:15 PM",
        title: "AI Analysis Initiated",
        subtitle: "Scanning gateway transaction logs",
        desc: "Traced transaction split patterns. Linked to known gateway emulator.",
        extra: "AI engine correlated transfer records with active money-mule accounts at 4 branches in Bengaluru Rural.",
        type: "ai",
        bulletColor: "#ef4444",
      },
      {
        time: "13:00 PM",
        title: "Accounts Frozen",
        subtitle: "AI Recommendation applied",
        desc: "Escrow hold applied to 4 money-mule bank accounts. Total ₹67L secured.",
        extra: "Directives dispatched to bank nodal officers. Suspect cash-out locations flagged in real-time.",
        type: "arrest",
        bulletColor: "#10b981",
      }
    ],
    recommendation: {
      action: "Freeze Target Bank Accounts",
      rationale: "Correlate gateway transactions with active wallets to prevent siphoning of ₹1.8Cr funds.",
      urgency: "HIGH",
      priority: 2
    }
  },
  {
    id: "KA-2026-08612",
    title: "SUV Relay Theft Ring",
    category: "Vehicle Theft",
    district: "Mysuru",
    progress: 91,
    severity: "LOW",
    color: "#10b981",
    statusBadge: "badge-green",
    events: [
      {
        time: "02:15 AM",
        title: "Crime Reported",
        subtitle: "Gokulam, Mysuru",
        desc: "Reported by: Owner. High-end SUV stolen from driveway.",
        extra: "The theft occurred within a 90-second window. CCTV caught relay attack signature targeting keyless entry fob.",
        type: "fir",
        bulletColor: "#00D4FF",
      },
      {
        time: "03:00 AM",
        title: "FIR Registered",
        subtitle: "FIR #KA-2026-08612",
        desc: "Officer: SI Sunitha Patel, Mysuru Central PS",
        extra: "FIR registered under IPC 379. Telemetry data broadcasted to highway checkposts.",
        type: "fir",
        bulletColor: "#f59e0b",
      },
      {
        time: "04:30 AM",
        title: "Evidence Uploaded",
        subtitle: "CCTV footage and RF logs",
        desc: "2 CCTV clips, 1 RF sniffer frequency log. Uploaded by: SI Sunitha.",
        extra: "Fob emulator frequency matched Bengaluru theft gang MO. Suspect vehicle KA-09-M-1120 flagged.",
        type: "officer",
        bulletColor: "#f59e0b",
      },
      {
        time: "06:15 AM",
        title: "Suspect Identified",
        subtitle: "AI match: 91% match Kiran Kumar",
        desc: "Toll booth camera captures. Linked to 4 prior vehicle thefts.",
        extra: "CCTV captures from NH-275 toll booth matched repeat offender Kiran Kumar driving the stolen SUV.",
        type: "ai",
        bulletColor: "#ef4444",
      },
      {
        time: "07:00 AM",
        title: "AI Route Forecast",
        subtitle: "Target: Nelamangala warehouse corridor",
        desc: "AI predicts route path with 96% confidence based on vehicle direction.",
        extra: "Syndicate de-registration site predicted. Request sent to Nelamangala division for tactical intercept.",
        type: "ai",
        bulletColor: "#00D4FF",
      },
      {
        time: "08:15 AM",
        title: "Raid Plan Formulated",
        subtitle: "Nelamangala warehouse coordinates mapped",
        desc: "Surveillance feeds integrated. Escape paths blocked.",
        extra: "Tactical maps prepared and shared with Mysuru and Bengaluru Rural dispatch networks.",
        type: "ai",
        bulletColor: "#ef4444",
      },
      {
        time: "09:30 AM",
        title: "Officers Assigned",
        subtitle: "PI Mahesh Kumar + 2 patrol units",
        desc: "Nelamangala division units deployed to surround scrapyard warehouse.",
        extra: "Units positioned at exits. Warehouse entry initiated. Telemetry confirms vehicle remains inside.",
        type: "officer",
        bulletColor: "#10b981",
      }
    ],
    recommendation: {
      action: "Raid Nelamangala Scrapyard Warehouse",
      rationale: "Vehicle telemetry and RF sniffer logs place vehicle inside the scrapyard. Intercept before dismantling.",
      urgency: "HIGH",
      priority: 1
    }
  },
  {
    id: "KA-2026-08590",
    title: "Border Meth Shipments",
    category: "Narcotics",
    district: "Raichur",
    progress: 28,
    severity: "CRITICAL",
    color: "#ef4444",
    statusBadge: "badge-red",
    events: [
      {
        time: "11:45 PM",
        title: "Crime Reported",
        subtitle: "Raichur Border Outpost",
        desc: "Reported by: Border informant. 8.2kg meth shipment transit.",
        extra: "Informant warned of interstate transport vehicle carrying illicit drugs crossing at midnight.",
        type: "fir",
        bulletColor: "#00D4FF",
      },
      {
        time: "00:15 AM",
        title: "FIR Registered",
        subtitle: "FIR #KA-2026-08590",
        desc: "Officer: SI Ramesh G, Raichur Rural PS",
        extra: "FIR registered under NDPS Act Section 22. Mobilized emergency checkpoint squads.",
        type: "fir",
        bulletColor: "#f59e0b",
      },
      {
        time: "01:00 AM",
        title: "Intel Correlation",
        subtitle: "AI maps suspect Venkat Reddy network",
        desc: "Linked to Raichur syndicate. Intercept target vehicle locked.",
        extra: "AI network model mapped Venkat Reddy and highlighted 3 potential border carrier plates. Sent blockades to NH-50 exit.",
        type: "ai",
        bulletColor: "#ef4444",
      }
    ],
    recommendation: {
      action: "Deploy Border Checkpoint Blockade",
      rationale: "NDPS intelligence indicates 8.2kg meth consignment is in transit via unregistered SUV. Block NH-50 exit.",
      urgency: "CRITICAL",
      priority: 1
    }
  }
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const { t, lang } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState(CASES[0].id);
  const [filter, setFilter] = useState<'all' | 'fir' | 'ai' | 'officer' | 'arrest'>('all');
  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({ 0: true, 3: true }); // Default expanded first and suspect steps
  const [isExporting, setIsExporting] = useState(false);

  const selectedCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];

  const filteredEvents = selectedCase.events.filter(e => {
    if (filter === 'all') return true;
    return e.type === filter;
  });

  const toggleEvent = (idx: number) => {
    setExpandedEvents(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageW = 210;
      let y = 20;

      // Restrictive Header
      doc.setFontSize(14);
      doc.setTextColor(239, 68, 68);
      doc.setFont('helvetica', 'bold');
      doc.text('CONFIDENTIAL — KSP INTEL DOSSIER', pageW / 2, y, { align: 'center' });
      y += 8;

      doc.setFontSize(15);
      doc.setTextColor(10, 22, 40);
      doc.text('CASE TIMELINE CHRONOLOGY LOG', pageW / 2, y, { align: 'center' });
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`FIR: #${selectedCase.id} · Category: ${selectedCase.category} · District: ${selectedCase.district}`, pageW / 2, y, { align: 'center' });
      y += 4;
      doc.line(15, y, pageW - 15, y);
      y += 8;

      // Event Timeline
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(10, 22, 40);
      doc.text('CHRONOLOGICAL EVENT REGISTRY:', 15, y);
      y += 6;

      filteredEvents.forEach((ev, idx) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 80, 160);
        doc.text(`🕐 ${ev.time} — ${ev.title}`, 15, y);
        y += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(`Location: ${ev.subtitle}`, 20, y);
        y += 4;
        
        doc.setTextColor(90, 90, 90);
        const descText = doc.splitTextToSize(ev.desc.replace(/[^\x00-\x7F]/g, ""), pageW - 30);
        doc.text(descText, 20, y);
        y += descText.length * 4 + 1;

        if (ev.extra) {
          doc.setFont('helvetica', 'oblique');
          doc.setTextColor(120, 120, 120);
          const extraText = doc.splitTextToSize(`Audit Log: ${ev.extra.replace(/[^\x00-\x7F]/g, "")}`, pageW - 35);
          doc.text(extraText, 20, y);
          y += extraText.length * 4 + 2;
        }
        y += 3;
      });

      doc.line(15, y, pageW - 15, y);
      y += 6;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('CrimeVision AI v6.0 Chronological Dossier · Generated on secure command terminal', pageW / 2, y, { align: 'center' });

      doc.save(`CrimeVision_Timeline_${selectedCase.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Make sure jsPDF is loaded.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="animate-page-fade" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <Clock size={22} className="text-[#00D4FF]" />
            {lang === 'en' ? 'CASE TIMELINE CHRONOLOGY' : 'ಪ್ರಕರಣದ ಕಾಲರೇಖೆ'}
          </h1>
          <p className="page-subtitle">
            {lang === 'en' 
              ? 'Chronological tracking database detailing incident logs, officer updates, and AI findings' 
              : 'ಘಟನೆ ದಾಖಲೆಗಳು, ಅಧಿಕಾರಿ ನವೀಕರಣಗಳು ಮತ್ತು AI ಸಂಶೋಧನೆಗಳನ್ನು ವಿವರಿಸುವ ಕಾಲಾನುಕ್ರಮದ ಟ್ರ್ಯಾಕಿಂಗ್ ಡೇಟಾಬೇಸ್'}
          </p>
        </div>

        {/* Action buttons top right */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="cyber-btn cyber-btn-cyan"
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', textTransform: 'none', fontWeight: 600 }}
          >
            <FileText size={14} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Simulation Banner */}
      <SimulationBanner />

      {/* ── Main Panel Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: Case Selector */}
        <aside
          className="glass-card"
          style={{
            padding: '20px 16px',
            height: 'fit-content',
            background: 'var(--cyber-surface)',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--cyber-border)', paddingBottom: '8px' }}>
            {lang === 'en' ? 'ACTIVE CASES' : 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CASES.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setExpandedEvents({ 0: true });
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isSelected ? 'var(--cyber-cyan)' : 'transparent'}`,
                    background: isSelected ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? 'var(--cyber-cyan)' : 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                      FIR #{c.id}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, paddingLeft: '16px' }}>
                    {c.title}
                  </div>
                  
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px', paddingLeft: '16px' }}>
                    {c.category} · {c.district}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '16px' }}>
                    <span>Progress:</span>
                    <span style={{ fontWeight: 800, color: isSelected ? 'var(--cyber-cyan)' : 'var(--text-primary)' }}>{c.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT PANEL: Chronological Event Log */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Timeline Filter Bar */}
          <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Filter size={15} style={{ color: 'var(--cyber-cyan)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>
              {lang === 'en' ? 'FILTER EVENTS:' : 'ಘಟನೆಗಳ ಫಿಲ್ಟರ್:'}
            </span>
            
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: lang === 'en' ? 'All Events' : 'ಎಲ್ಲಾ ಘಟನೆಗಳು' },
                { id: 'fir', label: lang === 'en' ? 'FIR Events' : 'FIR ಘಟನೆಗಳು' },
                { id: 'ai', label: lang === 'en' ? 'AI Events' : 'AI ಘಟನೆಗಳು' },
                { id: 'officer', label: lang === 'en' ? 'Officer Events' : 'ಅಧಿಕಾರಿ ಘಟನೆಗಳು' },
                { id: 'arrest', label: lang === 'en' ? 'Arrests' : 'ಬಂಧನಗಳು' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilter(btn.id as any)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: filter === btn.id ? 'var(--cyber-cyan)' : 'rgba(0, 240, 255, 0.05)',
                    color: filter === btn.id ? '#020617' : 'var(--cyber-cyan)',
                    border: `1px solid ${filter === btn.id ? 'var(--cyber-cyan)' : 'rgba(0, 240, 255, 0.2)'}`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Title Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              CHRONOLOGY LOG — FIR #{selectedCase.id}
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {selectedCase.title} · {selectedCase.district} North
            </h2>
          </div>

          {/* Vertical Timeline Tree */}
          <div style={{ position: 'relative', paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Vertical timeline connector line */}
            <div
              style={{
                position: 'absolute',
                left: '11px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                background: 'linear-gradient(180deg, var(--cyber-cyan), rgba(0,240,255,0.05))',
              }}
            />

            {filteredEvents.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic', padding: '10px 0' }}>
                No events matched the selected filter.
              </div>
            ) : (
              filteredEvents.map((ev, idx) => {
                const isExpanded = !!expandedEvents[idx];
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Circle Node */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#020617',
                        border: `2px solid ${ev.bulletColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 0 8px ${ev.bulletColor}`,
                        zIndex: 10,
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.bulletColor }} />
                    </div>

                    {/* Timeline Event Card */}
                    <div
                      className="glass-card"
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        background: isExpanded ? 'rgba(255,255,255,0.02)' : 'var(--cyber-card)',
                        borderColor: isExpanded ? 'rgba(0, 240, 255, 0.25)' : 'var(--glass-card-border)',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => toggleEvent(idx)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyber-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {ev.time}
                          </span>
                          <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
                            {ev.title}
                          </h3>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {ev.subtitle}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            className="badge"
                            style={{
                              fontSize: '8px',
                              padding: '2px 8px',
                              background: ev.type === 'fir' ? 'rgba(0, 240, 255, 0.1)' : ev.type === 'ai' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: ev.type === 'fir' ? 'var(--cyber-cyan)' : ev.type === 'ai' ? '#ef4444' : '#10b981',
                              border: `1px solid ${ev.type === 'fir' ? 'rgba(0, 240, 255, 0.25)' : ev.type === 'ai' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
                            }}
                          >
                            {ev.type.toUpperCase()}
                          </span>

                          <div style={{ color: 'var(--text-dim)' }}>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                        {ev.desc}
                      </p>

                      {/* Expandable Audit Log */}
                      {isExpanded && ev.extra && (
                        <div
                          className="animate-fadeInUp"
                          style={{
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px dashed var(--cyber-border)',
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6,
                          }}
                        >
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Calendar size={12} className="text-[var(--cyber-cyan)]" />
                            Official Case Log Record
                          </div>
                          <p style={{ margin: 0, paddingLeft: '18px' }}>
                            {ev.extra}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Recommendation Card */}
          <div style={{ marginTop: '10px' }}>
            <AIRecommendationCard
              action={selectedCase.recommendation.action}
              rationale={selectedCase.recommendation.rationale}
              urgency={selectedCase.recommendation.urgency}
              priority={selectedCase.recommendation.priority}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
