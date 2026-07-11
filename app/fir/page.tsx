'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/fir/page.tsx — FIR Details Page with AI Case Summary Generator (Light Theme)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText, Brain, Download, Search, X, ChevronRight,
  AlertTriangle, Clock, MapPin, User, Zap,
  CheckCircle, Activity, Loader, Copy, Check, Eye
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { RECENT_FIRS, TOP_SUSPECTS, DISTRICTS, type FIRRecord } from '@/lib/crimeData';
import { hasAnyApiKey } from '@/lib/apiKey';
import { generateText } from '@/lib/aiService';
import { InputWithIcon } from '@/components/InputWithIcon';
import { localAI } from '@/lib/localAiEngine';

// ─── AI Case Summary ──────────────────────────────────────────────────────────

async function generateAICaseSummary(fir: FIRRecord): Promise<string> {
  const suspect = TOP_SUSPECTS.find(s => s.name === fir.suspectName);
  const district = DISTRICTS.find(d => d.name === fir.district);

  if (hasAnyApiKey()) {
    try {
      const prompt = `You are the Karnataka State Police Intelligence AI. Generate a concise professional case summary for this FIR:

FIR Number: ${fir.firNumber}
Crime Type: ${fir.crimeType}
District: ${fir.district} (Risk Score: ${district?.riskScore ?? 'N/A'}/100)
Date Filed: ${fir.date}
Status: ${fir.status}
Priority: ${fir.priority}
Suspect: ${fir.suspectName}${suspect ? ` (alias: ${suspect.alias}, Risk: ${suspect.riskScore}/100, ${suspect.firCount} prior FIRs, Status: ${suspect.status})` : ''}
Assigned Officer: ${fir.assignedOfficer}
Description: ${fir.description}

Write a 3-4 paragraph professional intelligence summary covering:
1. Case Overview & Severity Assessment
2. Suspect Intelligence (if suspect is known)
3. Investigation Recommendations
4. Risk to Public / Priority Classification

Use formal KSP intelligence report style. Be specific and actionable.`;

      const result = await generateText({
        messages: [{ role: 'user', content: prompt }]
      });
      if (result) return result;
    } catch (err) {
      // Fall through to local fallback
    }
  }

  // Local fallback engine
  return localAI.generateCaseSummary(fir);
}

// ─── jsPDF loader ─────────────────────────────────────────────────────────────

async function loadJsPDF() {
  if ((window as unknown as Record<string, unknown>).jspdf) {
    return (window as unknown as Record<string, unknown>).jspdf as { jsPDF: new (o?: Record<string, unknown>) => JsPDF };
  }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => resolve(); s.onerror = () => reject(new Error('jsPDF failed'));
    document.head.appendChild(s);
  });
  return (window as unknown as Record<string, unknown>).jspdf as { jsPDF: new (o?: Record<string, unknown>) => JsPDF };
}

interface JsPDF {
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const priorityColors: Record<string, { text: string; bg: string; border: string }> = {
  Critical: { text: 'var(--color-red)', bg: 'rgba(220, 38, 38, 0.08)', border: 'rgba(220, 38, 38, 0.15)' },
  High:     { text: 'var(--color-red)', bg: 'rgba(220, 38, 38, 0.08)', border: 'rgba(220, 38, 38, 0.15)' },
  Medium:   { text: 'var(--color-orange)', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.15)' }, // Fixed to orange
  Low:      { text: 'var(--color-green)', bg: 'rgba(22, 163, 74, 0.08)', border: 'rgba(22, 163, 74, 0.15)' },
};

const statusColors: Record<string, string> = {
  'Under Investigation': 'var(--color-orange)',
  'Arrested': 'var(--color-green)',
  'Closed': 'var(--color-gray)',
  'Pending': 'var(--color-red)',
  'Absconding': 'var(--color-red)',
};

// ─── FIR Card ─────────────────────────────────────────────────────────────────

function FIRCard({ fir, onClick, isSelected }: { fir: FIRRecord; onClick: () => void; isSelected: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const pc = priorityColors[fir.priority] ?? priorityColors.Low;

  const cardStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'left',
    padding: '16px',
    borderRadius: 'var(--radius, 16px)',
    cursor: 'pointer',
    background: isSelected ? 'rgba(26, 43, 76, 0.05)' : '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderLeft: isSelected ? '4px solid var(--color-navy)' : '1px solid #E5E7EB',
    boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0,0,0,0.05)',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    transition: 'all 250ms ease',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    display: 'block',
    marginBottom: '12px',
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-navy)' }}>{fir.firNumber}</span>
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '9999px',
          background: pc.bg,
          color: pc.text,
          border: `1.5px solid ${pc.border}`,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          display: 'inline-flex',
          alignItems: 'center',
          height: '20px',
        }}>
          {fir.priority}
        </span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', marginBottom: 8 }}>{fir.crimeType}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#475569', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} className="text-gray-400" />{fir.district}</span>
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '9999px',
          background: 'rgba(107, 114, 128, 0.08)',
          color: statusColors[fir.status] ?? 'var(--color-gray)',
          border: '1.5px solid rgba(107, 114, 128, 0.15)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          display: 'inline-flex',
          alignItems: 'center',
          height: '20px',
        }}>
          {fir.status}
        </span>
      </div>
    </button>
  );
}

// ─── FIR Detail Panel ─────────────────────────────────────────────────────────

function FIRDetailPanel({ fir }: { fir: FIRRecord }) {
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const suspect = TOP_SUSPECTS.find(s => s.name === fir.suspectName);
  const district = DISTRICTS.find(d => d.name === fir.district);
  const pc = priorityColors[fir.priority] ?? priorityColors.Low;

  const handleGenerateSummary = useCallback(async () => {
    setIsGenerating(true);
    setAiSummary('');
    try {
      const summary = await generateAICaseSummary(fir);
      setAiSummary(summary);
    } catch (err) {
      setAiSummary(`Error: ${(err as Error).message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [fir]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const lib = await loadJsPDF();
      const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = 210;

      // Header
      doc.setFillColor(30, 58, 95); doc.rect(0, 0, pw, 30, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
      doc.text('KARNATAKA STATE POLICE — RESTRICTED', pw / 2, 12, { align: 'center' });
      doc.setFontSize(9); doc.setTextColor(212, 175, 55);
      doc.text('CrimeVision AI v2.0 | FIR Intelligence Report', pw / 2, 20, { align: 'center' });
      doc.setFontSize(7); doc.setTextColor(200, 200, 200);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST`, pw / 2, 27, { align: 'center' });

      let y = 40;
      // FIR Number
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(30, 58, 95);
      doc.text(fir.firNumber, pw / 2, y, { align: 'center' }); y += 8;
      doc.setFontSize(10); doc.setTextColor(80, 80, 80); doc.setFont('helvetica', 'normal');
      doc.text(`${fir.crimeType} | ${fir.district} | ${fir.date}`, pw / 2, y, { align: 'center' }); y += 10;

      // Status badge
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.setTextColor(fir.priority === 'Critical' ? 200 : fir.priority === 'High' ? 180 : 0, 0, 0);
      doc.text(`Priority: ${fir.priority} | Status: ${fir.status}`, pw / 2, y, { align: 'center' }); y += 8;
      doc.setDrawColor(30, 58, 95); doc.line(15, y, pw - 15, y); y += 8;

      // Case Details
      doc.setFillColor(240, 248, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(30, 58, 95);
      doc.text('CASE DETAILS', 18, y + 2); y += 12;

      const details = [
        ['FIR Number', fir.firNumber],
        ['Crime Category', fir.crimeType],
        ['District', fir.district],
        ['Date Filed', fir.date],
        ['Priority Level', fir.priority],
        ['Case Status', fir.status],
        ['Suspect', fir.suspectName],
        ['Assigned Officer', fir.assignedOfficer],
        ...(district ? [['District Risk Score', `${district.riskScore}/100`]] : []),
        ...(suspect ? [['Suspect Risk Score', `${suspect.riskScore}/100`], ['Suspect Status', suspect.status], ['Total FIRs', `${suspect.firCount}`]] : []),
      ];

      details.forEach(([k, v], idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        if (idx % 2 === 0) doc.setFillColor(248, 252, 255);
        else doc.setFillColor(255, 255, 255);
        doc.rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFont('helvetica', 'bold'); doc.setTextColor(60, 60, 60); doc.setFontSize(8);
        doc.text(k, 18, y);
        doc.setFont('helvetica', 'normal'); doc.text(v, 90, y);
        y += 8;
      });

      // Description
      y += 4;
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFillColor(240, 248, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(30, 58, 95);
      doc.text('CASE DESCRIPTION', 18, y + 2); y += 12;
      doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40); doc.setFontSize(8);
      const descLines = doc.splitTextToSize(fir.description, pw - 30);
      for (const line of descLines) {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 15, y); y += 5;
      }

      // AI Summary
      if (aiSummary) {
        y += 6;
        if (y > 245) { doc.addPage(); y = 20; }
        doc.setFillColor(230, 245, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 100, 60);
        doc.text('AI INTELLIGENCE SUMMARY (CrimeNet AI)', 18, y + 2); y += 12;
        doc.setFont('helvetica', 'normal'); doc.setTextColor(40, 40, 40); doc.setFontSize(8);
        const summaryLines = doc.splitTextToSize(aiSummary.replace(/\*\*/g, ''), pw - 30);
        for (const line of summaryLines) {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, 15, y); y += 5;
        }
      }

      // Footer
      if (y > 270) { doc.addPage(); y = 20; }
      y = Math.max(y + 6, 280);
      doc.setDrawColor(200, 200, 200); doc.line(15, y, pw - 15, y); y += 6;
      doc.setFontSize(7); doc.setTextColor(150, 150, 150);
      doc.text('CrimeVision AI v2.0 | Karnataka State Police | RESTRICTED — FOR OFFICIAL USE ONLY', pw / 2, y, { align: 'center' });

      doc.save(`FIR_${fir.firNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`);
    } catch (err) {
      alert(`PDF failed: ${(err as Error).message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* FIR Header */}
      <div style={{
        padding: 20, borderRadius: 14, background: '#F9FAFB',
        border: `1px solid ${pc.border}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>FIR NUMBER</div>
            <div style={{ fontSize: 22, fontFamily: 'monospace', fontWeight: 900, color: '#0F6B5C' }}>{fir.firNumber}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800,
              background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`, textTransform: 'uppercase' }}>
              {fir.priority}
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
              background: '#FFFFFF', color: statusColors[fir.status] ?? '#475569',
              border: '1px solid #E5E7EB' }}>
              {fir.status}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginBottom: 8 }}>{fir.crimeType}</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#475569' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{fir.district}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{fir.date}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} />{fir.assignedOfficer}</span>
        </div>
      </div>

      {/* Case Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Crime Type', value: fir.crimeType, color: '#0F6B5C' },
          { label: 'District', value: fir.district, color: '#1F2937' },
          { label: 'Filing Date', value: fir.date, color: '#1F2937' },
          { label: 'District Risk', value: district ? `${district.riskScore}/100` : 'N/A', color: district && district.riskScore > 80 ? '#ef4444' : '#f59e0b' },
        ].map(item => (
          <div key={item.label} style={{
            padding: 12, borderRadius: 10, background: '#FFFFFF',
            border: '1px solid #E5E7EB',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Suspect Panel */}
      {suspect && (
        <div style={{
          padding: 16, borderRadius: 12, background: '#FEF2F2',
          border: '1px solid #FEE2E2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <User size={14} color="#ef4444" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Linked Suspect
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { k: 'Name', v: suspect.name },
              { k: 'Alias', v: `"${suspect.alias}"` },
              { k: 'Risk Score', v: `${suspect.riskScore}/100` },
              { k: 'Total FIRs', v: `${suspect.firCount} cases` },
              { k: 'Risk Level', v: suspect.riskLevel },
              { k: 'Status', v: suspect.status },
            ].map(({ k, v }) => (
              <div key={k}>
                <div style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: k === 'Status' ? (statusColors[v] ?? '#475569') : '#1F2937' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Panel */}
      <div style={{ padding: 16, borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Eye size={11} /> Forensics &amp; Evidence Log
        </div>
        <div style={{ fontSize: 13, color: '#0F6B5C', fontWeight: 600, background: '#FFFFFF', padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB' }}>
          {fir.id === '1' ? 'CCTV footage of transaction counters, IP Log from routing node' :
           fir.id === '2' ? '8.2kg methamphetamine seized in vehicle trunk, suspect phone SIM trace' :
           fir.id === '3' ? 'Truck vehicle registry logs, river sand deposits geolocation trace' :
           fir.id === '4' ? 'CDR log logs, gang syndicate communication wiretap records' :
           'CCTV footage log, digital logs trace, cell tower location logs'}
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: 16, borderRadius: 12, background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={11} /> Case Description
        </div>
        <p style={{ fontSize: 13, color: '#1F2937', lineHeight: 1.7, margin: 0 }}>{fir.description}</p>
      </div>

      {/* AI Case Summary */}
      <div style={{ padding: 16, borderRadius: 12, background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: aiSummary ? 12 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={14} color="#7C3AED" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Case Summary
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {aiSummary && (
              <button onClick={() => { navigator.clipboard.writeText(aiSummary); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6,
                  border: '1px solid #D1D5DB', background: '#FFFFFF', color: copied ? '#2E8B57' : '#475569',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            <button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8,
                background: isGenerating ? 'transparent' : '#7C3AED',
                border: '1px solid #7C3AED', color: isGenerating ? '#64748b' : '#FFFFFF',
                fontSize: 11, fontWeight: 700, cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              {isGenerating ? <><Loader size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> Analyzing...</> : <><Zap size={12} /> Generate AI Summary</>}
            </button>
          </div>
        </div>

        {aiSummary && (
          <div style={{ fontSize: 12, color: '#1F2937', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginTop: 10 }}>
            {aiSummary}
          </div>
        )}

        {!aiSummary && !isGenerating && (
          <div style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
            Click "Generate AI Summary" to get an instant intelligence assessment powered by AI.
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px', borderRadius: 10, border: '1px solid #1E3A5F',
            background: '#1E3A5F', color: '#FFFFFF',
            fontSize: 12, fontWeight: 700, cursor: isDownloading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}
        >
          {isDownloading ? <><Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating PDF...</> : <><Download size={14} /> Download FIR PDF</>}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page Content (needs Suspense for useSearchParams) ──────────────────

function FIRPageContent() {
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const [selectedFIR, setSelectedFIR] = useState<FIRRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Auto-select FIR from URL ?id=
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const found = RECENT_FIRS.find(f => f.id === id || f.firNumber === id);
      if (found) setSelectedFIR(found);
    } else {
      setSelectedFIR(null);
    }
  }, [searchParams]);

  const q = searchQuery.trim().toLowerCase();
  const filteredFIRs = RECENT_FIRS.filter(f => {
    const matchQ = !q || f.firNumber.toLowerCase().includes(q) || f.crimeType.toLowerCase().includes(q)
      || f.district.toLowerCase().includes(q) || f.suspectName.toLowerCase().includes(q);
    const matchP = filterPriority === 'All' || f.priority === filterPriority;
    const matchS = filterStatus === 'All' || f.status === filterStatus;
    return matchQ && matchP && matchS;
  });

  return (
    <div className="page-content" style={{ background: '#F5F7FA' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div className="section-header">
            <span className="section-header-line" />
            <h1 className="section-title">{lang === 'en' ? 'FIR Registry & Search' : 'ಎಫ್‌ಐಆರ್ ನೋಂದಣಿ ಮತ್ತು ಶೋಧ'}</h1>
          </div>
          <p className="page-subtitle">Search, view, and generate AI-powered intelligence reports for KSP FIR records.</p>
        </div>
      </div>

      {/* Search & Filter bar (White card style) */}
      <div style={{ padding: 18, borderRadius: 14, background: '#FFFFFF', border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: 20 }}>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Search Input */}
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <InputWithIcon
              icon={Search}
              placeholder="Search by FIR number, suspect, crime type, or district..."
              value={searchQuery}
              onChange={setSearchQuery}
              style={{
                background: '#FFFFFF',
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                style={{ 
                  position: 'absolute', 
                  right: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  border: 'none', 
                  background: 'transparent', 
                  cursor: 'pointer', 
                  color: '#6B7280',
                  zIndex: 20
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', fontWeight: 700, textTransform: 'uppercase', marginRight: 4 }}>Priority:</span>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
              <button key={p} onClick={() => setFilterPriority(p)}
                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${filterPriority === p ? '#0F6B5C' : '#E5E7EB'}`,
                  background: filterPriority === p ? 'rgba(15, 107, 92, 0.08)' : '#FFFFFF',
                  color: filterPriority === p ? '#0F6B5C' : '#475569', transition: 'all 0.15s' }}>
                {p}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', fontWeight: 700, textTransform: 'uppercase', marginRight: 4 }}>Status:</span>
            {['All', 'Under Investigation', 'Arrested', 'Closed'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1px solid ${filterStatus === s ? '#0F6B5C' : '#E5E7EB'}`,
                  background: filterStatus === s ? 'rgba(15, 107, 92, 0.08)' : '#FFFFFF',
                  color: filterStatus === s ? '#0F6B5C' : '#475569', transition: 'all 0.15s' }}>
                {s.replace('Under Investigation', 'Active')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of FIR Cards (Full Width) */}
      <div className="responsive-grid-3" style={{ marginBottom: 20 }}>
        {filteredFIRs.map(fir => (
          <FIRCard key={fir.id} fir={fir} onClick={() => setSelectedFIR(fir)} isSelected={selectedFIR?.id === fir.id} />
        ))}
      </div>

      {filteredFIRs.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, borderRadius: 14, background: '#FFFFFF', border: '1px dashed #D1D5DB' }}>
          <FileText size={44} color="#6B7280" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#475569', fontSize: 14 }}>No FIR registry records match your search criteria.</p>
        </div>
      )}

      {/* FIR Details Drawer */}
      {selectedFIR && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}>
          {/* Overlay Click to Close */}
          <div className="absolute inset-0" onClick={() => setSelectedFIR(null)} />
          
          {/* Drawer content body */}
          <div
            className="relative w-[540px] max-w-full h-full p-6 flex flex-col border-l border-gray-200 z-10"
            style={{
              background: '#FFFFFF',
              boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
              overflowY: 'auto'
            }}
          >
            {/* Drawer Header Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid #E5E7EB', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 3, height: 16, background: '#1E3A5F', borderRadius: 1.5 }} />
                <span style={{ fontSize: 13, fontWeight: 900, color: '#1F2937', letterSpacing: '0.05em' }}>CASE INTELLIGENCE FILE</span>
              </div>
              <button onClick={() => setSelectedFIR(null)}
                style={{ background: '#F3F4F6', border: 'none', color: '#475569', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Main Detail Panel */}
            <div style={{ flex: 1 }}>
              <FIRDetailPanel key={selectedFIR.id} fir={selectedFIR} />
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function FIRPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#64748b', fontSize: 14 }}>Loading FIR data...</div>}>
      <FIRPageContent />
    </Suspense>
  );
}
