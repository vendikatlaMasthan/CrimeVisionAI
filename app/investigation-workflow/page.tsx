'use client';

import { useState } from 'react';
import { 
  FileText, Share2, AlertOctagon, CheckCircle2, Play, Circle, ChevronDown, ChevronUp, MapPin, Clock, ArrowRight, BookOpen
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import AIRecommendationCard from '@/components/AIRecommendationCard';

// ─── Case Datasets ────────────────────────────────────────────────────────────

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
    activeStep: 4, // 0-indexed (Step 5 is active: AI Investigation)
    steps: [
      {
        title: "Crime Reported",
        details: "Kalaburagi North · Tungabhadra riverbank",
        time: "09:15 AM, 21 Jun 2026",
        meta: "Category: Sand Mafia | Severity: CRITICAL",
        extra: "Reported by: Anonymous Civilian helpline tip-off. Active mining operations detected on the riverbanks. Logged at District Command Center.",
        status: "completed"
      },
      {
        title: "FIR Generated",
        details: "FIR #KA-2026-08821",
        time: "09:30 AM",
        meta: "Registering Officer: SI Mahesh Kumar | Station: Kalaburagi North PS",
        extra: "Registered under Section 379 IPC (Theft) and Section 21 of Mines and Minerals Act. Assigned to Circle Inspector Mahesh.",
        status: "completed"
      },
      {
        title: "Evidence Collection",
        details: "4 Photos · 2 Witness Statements · 1 Forensic Report",
        time: "10:45 AM",
        meta: "Uploaded by: HC Ramu Patil",
        extra: "Forensic soil sample collected from riverbank matches sand texture of stockpiled trucks. Witness statements confirm vehicle registration plates.",
        status: "completed"
      },
      {
        title: "Suspect Analysis",
        details: "AI Match Score: 87% · Linked to 3 prior cases",
        time: "12:10 PM",
        meta: "Network connections: 5 suspects",
        extra: "Facial match score of 87% with primary suspect Raju Naik. Identified in CCTV logs at NH-50 corridor. Social network matches 5 repeat associates.",
        status: "completed"
      },
      {
        title: "AI Investigation",
        details: "Pattern match in progress... Confidence building: 92%",
        time: "13:20 PM",
        meta: "Intel matches Raichur Sand Mafia syndicate",
        extra: "Neural network models indicate 92% confidence of coordinated sand transport route towards Raichur sector. Recommended lookout alert deployment.",
        status: "active"
      },
      {
        title: "Risk Assessment",
        details: "Expected recurrence rating: HIGH (78%)",
        time: "Pending",
        meta: "Awaiting next dispatch threshold",
        extra: "Risk assessment model is waiting for deployment indicators to update risk metrics. Re-routing probability is elevated if checkpoints are left unmonitored.",
        status: "pending"
      },
      {
        title: "Officer Assignment",
        details: "PI Ravi Shankar designated for interception",
        time: "Pending",
        meta: "Deploy pending alert release",
        extra: "Tactical squad on standby at NH-50 checkpoint. Dispatch awaiting final signature from Commissioner.",
        status: "pending"
      },
      {
        title: "Case Closed / Escalated",
        details: "Incident resolution dossier compilation",
        time: "Pending",
        meta: "Pending arrest verification",
        extra: "Case will be closed upon suspect booking and property recovery log verification. Legal cells notified.",
        status: "pending"
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
    activeStep: 2,
    steps: [
      {
        title: "Crime Reported",
        details: "Bengaluru East · HSR Layout. Multiple OTP fraud complaints.",
        time: "10:05 AM, 21 Jun 2026",
        meta: "Category: Cyber Fraud | Severity: HIGH",
        extra: "Citizens reported fake KYC SMS links leading to account drainages. Technical cell deployed to monitor active towers.",
        status: "completed"
      },
      {
        title: "FIR Generated",
        details: "FIR #KA-2026-08734",
        time: "10:30 AM",
        meta: "Registering Officer: Inspector Anil K. | Station: Cyber Crime PS, Bengaluru",
        extra: "Registered under Section 66D IT Act and 420 IPC. Bank transaction logs subpoenaed.",
        status: "completed"
      },
      {
        title: "Evidence Collection",
        details: "23 SMS Headers · 3 IP Logs · 1 Wallet Address",
        time: "11:45 AM",
        meta: "Active tracing on Gateway IPs",
        extra: "Gateway IP logs traced to virtual servers located out of state. API intercept logs created. Bank accounts frozen.",
        status: "active"
      },
      {
        title: "Suspect Analysis",
        details: "Sim Swap group flagged. Traced 2 bank accounts.",
        time: "Pending",
        meta: "Awaiting IMEI validation",
        extra: "Target list of active SIM numbers being compiled for provider tower trace. Linkages found with Arjun Gowda syndicate.",
        status: "pending"
      },
      {
        title: "AI Investigation",
        details: "Gateway trace pending review",
        time: "Pending",
        meta: "Awaiting logs",
        extra: "Awaiting server logs from foreign proxy servers to resolve true origin IPs.",
        status: "pending"
      },
      {
        title: "Risk Assessment",
        details: "Financial threat recurrence check",
        time: "Pending",
        meta: "System scanning",
        extra: "Estimated threat of victim expansion rate: Moderate. Recommended firewall blocks.",
        status: "pending"
      },
      {
        title: "Officer Assignment",
        details: "Cyber Cell Team Alpha standby",
        time: "Pending",
        meta: "Team Alpha briefed",
        extra: "Raid team assigned on call to intercept secondary banking accounts cash out points.",
        status: "pending"
      },
      {
        title: "Case Closed / Escalated",
        details: "Final report logs",
        time: "Pending",
        meta: "Awaiting arrests",
        extra: "Case closure dossier requires arrest forms and escrow bank reversal approvals.",
        status: "pending"
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
    activeStep: 6,
    steps: [
      {
        title: "Crime Reported",
        details: "Gokulam, Mysuru. High-end SUV stolen from driveway.",
        time: "02:15 AM, 20 Jun 2026",
        meta: "Category: Vehicle Theft | Severity: MEDIUM",
        extra: "CCTV caught relay attack signature targeting keyless entry fob. Smart telemetry tracking initiated.",
        status: "completed"
      },
      {
        title: "FIR Generated",
        details: "FIR #KA-2026-08612",
        time: "03:00 AM",
        meta: "Registering Officer: SI Sunitha Patel | Station: Mysuru Central PS",
        extra: "Registered under Section 379 IPC. Broadcast sent to highway checkpoints.",
        status: "completed"
      },
      {
        title: "Evidence Collection",
        details: "2 CCTV Footage · 1 RF Sniffer Log",
        time: "04:30 AM",
        meta: "RF frequency log analyzed",
        extra: "Fob emulator frequency matched local gang MO flagged in Bengaluru last month. Toll booth pictures uploaded.",
        status: "completed"
      },
      {
        title: "Suspect Analysis",
        details: "2 suspects identified on highway cameras.",
        time: "06:15 AM",
        meta: "Accused: Kiran Kumar",
        extra: "Vehicle captured crossing NH-275 toll booth towards Bengaluru at 05:40 AM. Driver identified by database.",
        status: "completed"
      },
      {
        title: "AI Investigation",
        details: "Route estimation: 96% match to Nelamangala warehouse.",
        time: "07:00 AM",
        meta: "Dismantling site threat estimated",
        extra: "Historical path analysis estimates vehicle transport to de-registration scrapyard in Nelamangala corridor.",
        status: "completed"
      },
      {
        title: "Risk Assessment",
        details: "Scrap yard raid planning complete",
        time: "08:15 AM",
        meta: "Risk level: LOW",
        extra: "Syndicate storage yard mapped and surveillance camera feeds integrated. Off-road escape paths blocked.",
        status: "completed"
      },
      {
        title: "Officer Assignment",
        details: "PI Mahesh Kumar deployed. Target site surrounded.",
        time: "09:30 AM",
        meta: "Operation active",
        extra: "Nelamangala division dispatched 2 patrol cars to intercept vehicle loading at scrapyard.",
        status: "active"
      },
      {
        title: "Case Closed / Escalated",
        details: "Suspect arrest and vehicle recovery logging",
        time: "Pending",
        meta: "Awaiting raid output",
        extra: "Officer updates from scene indicate suspects surrounded. Pending booking reports to close case.",
        status: "pending"
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
    activeStep: 1,
    steps: [
      {
        title: "Crime Reported",
        details: "Raichur Border Outpost. Informant tip regarding meth shipment.",
        time: "11:45 PM, 20 Jun 2026",
        meta: "Category: Narcotics | Severity: CRITICAL",
        extra: "Informant reports 8.2kg crystal meth smuggling transit via interstate cargo truck.",
        status: "completed"
      },
      {
        title: "FIR Generated",
        details: "FIR #KA-2026-08590",
        time: "00:15 AM, 21 Jun 2026",
        meta: "Registering Officer: SI Ramesh G. | Station: Raichur Rural PS",
        extra: "Registered under NDPS Act Section 22. Border checkpoints on high alert.",
        status: "active"
      },
      {
        title: "Evidence Collection",
        details: "Border checkpost CCTV sweep pending",
        time: "Pending",
        meta: "Awaiting logs",
        extra: "Toll booth video logs from state border under review for suspect cargo vehicles.",
        status: "pending"
      },
      {
        title: "Suspect Analysis",
        details: "Tracing suspect Venkat Reddy",
        time: "Pending",
        meta: "Dossier audit pending",
        extra: "Cross-referencing network connections of Venkat Reddy to identify local dropoff points.",
        status: "pending"
      },
      {
        title: "AI Investigation",
        details: "Network graph correlation pending",
        time: "Pending",
        meta: "System matching",
        extra: "Neural network maps awaiting node updates on border carriers.",
        status: "pending"
      },
      {
        title: "Risk Assessment",
        details: "Threat forecast pending",
        time: "Pending",
        meta: "Pending logs",
        extra: "Threat levels will refresh once vehicle route vectors are locked.",
        status: "pending"
      },
      {
        title: "Officer Assignment",
        details: "Border patrol dispatch pending",
        time: "Pending",
        meta: "Patrol teams briefing",
        extra: "3 patrol interceptors prepared at Raichur bypass awaiting vehicle lock.",
        status: "pending"
      },
      {
        title: "Case Closed / Escalated",
        details: "Resolution documentation",
        time: "Pending",
        meta: "NDPS logging pending",
        extra: "NDPS seizure logs required to formalize case closure.",
        status: "pending"
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

export default function InvestigationWorkflowPage() {
  const { t, lang } = useLanguage();
  const [selectedCaseId, setSelectedCaseId] = useState(CASES[0].id);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 0: true, 4: true }); // Default expanded first and active steps
  const [isExporting, setIsExporting] = useState(false);

  const selectedCase = CASES.find(c => c.id === selectedCaseId) || CASES[0];

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Dynamically load jsPDF
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
      doc.setTextColor(239, 68, 68); // Red
      doc.setFont('helvetica', 'bold');
      doc.text('RESTRICTED — OFFICIAL USE ONLY', pageW / 2, y, { align: 'center' });
      y += 8;

      doc.setFontSize(16);
      doc.setTextColor(10, 22, 40); // Dark Navy
      doc.text('KARNATAKA STATE POLICE INTELLIGENCE COMMAND', pageW / 2, y, { align: 'center' });
      y += 6;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`INVESTIGATION CASE DOSSIER: FIR #${selectedCase.id}`, pageW / 2, y, { align: 'center' });
      y += 4;

      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, pageW - 15, y);
      y += 8;

      // Case Profile
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('CASE BRIEFING:', 15, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Case ID: FIR #${selectedCase.id}`, 15, y);
      doc.text(`Severity: ${selectedCase.severity}`, 110, y);
      y += 5;
      doc.text(`District: ${selectedCase.district}`, 15, y);
      doc.text(`Progress: ${selectedCase.progress}%`, 110, y);
      y += 5;
      doc.text(`Category: ${selectedCase.category}`, 15, y);
      y += 10;

      // Workflow Header
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('INVESTIGATION STEP PROGRESS LOG:', 15, y);
      y += 6;

      // Steps log
      doc.setFontSize(9);
      selectedCase.steps.forEach((step, idx) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        
        const prefix = step.status === 'completed' ? '[DONE]' : step.status === 'active' ? '[ACTIVE]' : '[PENDING]';
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(step.status === 'completed' ? 0 : step.status === 'active' ? 0 : 120);
        doc.text(`${idx + 1}. ${prefix} ${step.title} (${step.time})`, 15, y);
        y += 4.5;
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const detailsText = doc.splitTextToSize(step.details.replace(/[^\x00-\x7F]/g, ""), pageW - 30);
        doc.text(detailsText, 20, y);
        y += detailsText.length * 4 + 1;

        if (step.extra) {
          doc.setFont('helvetica', 'oblique');
          doc.setTextColor(110, 110, 110);
          const extraText = doc.splitTextToSize(`Note: ${step.extra.replace(/[^\x00-\x7F]/g, "")}`, pageW - 35);
          doc.text(extraText, 20, y);
          y += extraText.length * 4 + 2;
        }
      });

      // AI Recommendation
      y += 5;
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setDrawColor(0, 240, 255);
      doc.setFillColor(245, 253, 255);
      doc.rect(15, y, pageW - 30, 28, 'FD');
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 132, 199);
      doc.text('AI TACTICAL RECOMMENDATION:', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`Action: ${selectedCase.recommendation.action}`, 20, y);
      y += 5;
      const rationaleText = doc.splitTextToSize(`Rationale: ${selectedCase.recommendation.rationale}`, pageW - 40);
      doc.text(rationaleText, 20, y);

      y += 20;
      doc.line(15, y, pageW - 15, y);
      y += 6;
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('CrimeVision AI v6.0 Command Center Intelligence Report · Confidential', pageW / 2, y, { align: 'center' });

      doc.save(`CrimeVision_Workflow_${selectedCase.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Make sure jsPDF is accessible.');
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
            <FileText size={22} className="text-[#00D4FF]" />
            {lang === 'en' ? 'INVESTIGATION WORKFLOW' : 'ತನಿಖಾ ಕೆಲಸದ ಹರಿವು'}
          </h1>
          <p className="page-subtitle">
            {lang === 'en' 
              ? 'Multi-stage AI-guided process monitoring and evidence auditing system' 
              : 'ಬಹು-ಹಂತದ AI-ಮಾರ್ಗದರ್ಶಿತ ಪ್ರಕ್ರಿಯೆ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಸಾಕ್ಷ್ಯ ಲೆಕ್ಕಪರಿಶೋಧನಾ ವ್ಯವಸ್ಥೆ'}
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
          <button
            onClick={() => alert('Case share link copied to clipboard!')}
            className="cyber-btn"
            style={{ 
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', textTransform: 'none', fontWeight: 600,
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)'
            }}
          >
            <Share2 size={14} />
            Share Case
          </button>
          <button
            onClick={() => alert('Case escalated to State CID Alpha Cell!')}
            className="cyber-btn cyber-btn-red"
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px', textTransform: 'none', fontWeight: 600 }}
          >
            <AlertOctagon size={14} />
            Escalate Case
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
                    // Reset expanded steps for new case
                    setExpandedSteps({ [c.activeStep]: true });
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isSelected ? 'var(--cyber-cyan)' : 'transparent'}`,
                    background: isSelected ? 'rgba(30, 58, 95, 0.05)' : 'rgba(255,255,255,0.01)',
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
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }} />
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

                  {/* Progress Info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', paddingLeft: '16px' }}>
                    <span>Progress:</span>
                    <span style={{ fontWeight: 800, color: isSelected ? 'var(--cyber-cyan)' : 'var(--text-primary)' }}>{c.progress}%</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden', marginTop: '4px', marginLeft: '16px' }}>
                    <div style={{ height: '100%', width: `${c.progress}%`, background: isSelected ? 'var(--cyber-cyan)' : 'var(--text-dim)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* RIGHT PANEL: Interactive Vertical Workflow */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Case Summary Card */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-cyan" style={{ fontSize: '9px', marginBottom: '8px' }}>
                  {selectedCase.category.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedCase.title} — {selectedCase.district}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                  CASE REGISTERED: FIR #{selectedCase.id} · SEVERITY: <span style={{ color: selectedCase.color, fontWeight: 700 }}>{selectedCase.severity}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', minWidth: '150px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Investigation Progress
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--cyber-cyan)', fontFamily: 'Space Grotesk, sans-serif', marginTop: '2px' }}>
                  <CountUp end={selectedCase.progress} suffix="%" />
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '2.5px', overflow: 'hidden', marginTop: '6px' }}>
                  <div style={{ height: '100%', width: `${selectedCase.progress}%`, background: 'var(--cyber-cyan)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedCase.steps.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              const isPending = step.status === 'pending';
              const isExpanded = !!expandedSteps[idx];

              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    padding: '16px 20px',
                    borderColor: isActive ? 'var(--cyber-cyan)' : 'var(--glass-card-border)',
                    boxShadow: isActive ? '0 0 16px rgba(30, 58, 95, 0.15)' : 'none',
                    background: isActive ? 'rgba(30, 58, 95, 0.02)' : 'var(--cyber-card)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Step Header */}
                  <div
                    onClick={() => toggleStep(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* Step Indicator */}
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: `1.5px solid ${isCompleted ? 'var(--cyber-cyan)' : isActive ? 'var(--cyber-cyan)' : 'var(--text-dim)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isCompleted ? 'rgba(30, 58, 95, 0.1)' : isActive ? 'rgba(30, 58, 95, 0.05)' : 'transparent',
                          color: isCompleted || isActive ? 'var(--cyber-cyan)' : 'var(--text-dim)',
                          boxShadow: isActive ? '0 0 8px var(--cyber-cyan)' : 'none',
                          flexShrink: 0,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={15} />
                        ) : isActive ? (
                          <Play size={10} className="fill-current text-[var(--cyber-cyan)] animate-pulse" />
                        ) : (
                          <span style={{ fontSize: '11px', fontWeight: 800 }}>{idx + 1}</span>
                        )}
                      </div>

                      {/* Step Titles */}
                      <div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            color: isPending ? 'var(--text-dim)' : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {step.title}
                          {isActive && (
                            <span
                              style={{
                                fontSize: '8px',
                                fontWeight: 900,
                                background: 'rgba(30, 58, 95, 0.12)',
                                color: 'var(--cyber-cyan)',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                border: '1px solid rgba(30, 58, 95, 0.25)',
                                letterSpacing: '0.04em',
                              }}
                            >
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: isPending ? 'var(--text-dim)' : 'var(--text-muted)', marginTop: '2px' }}>
                          {step.details}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '11px', color: 'var(--text-dim)' }}>
                        <span style={{ fontWeight: 600 }}>{step.time}</span>
                        <span>{step.meta}</span>
                      </div>
                      
                      <div style={{ color: 'var(--text-dim)' }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Step Expanded Content */}
                  {isExpanded && step.extra && (
                    <div
                      className="animate-fadeInUp"
                      style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px dashed var(--cyber-border)',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                      }}
                    >
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <BookOpen size={13} className="text-[var(--cyber-cyan)]" />
                        Operation Audit Trail Details
                      </div>
                      <p style={{ margin: 0, paddingLeft: '20px' }}>
                        {step.extra}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
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
