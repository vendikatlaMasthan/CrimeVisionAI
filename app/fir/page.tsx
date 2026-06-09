'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/fir/page.tsx — FIR Details Page with AI Case Summary Generator
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FileText, Brain, Download, Search, X, ChevronRight,
  AlertTriangle, Clock, MapPin, User, Shield, Zap,
  CheckCircle, Activity, Loader, Copy, Check
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { RECENT_FIRS, TOP_SUSPECTS, DISTRICTS, type FIRRecord } from '@/lib/crimeData';
import { getAnthropicApiKey } from '@/lib/apiKey';

// ─── AI Case Summary ──────────────────────────────────────────────────────────

async function generateAICaseSummary(fir: FIRRecord, apiKey: string): Promise<string> {
  const suspect = TOP_SUSPECTS.find(s => s.name === fir.suspectName);
  const district = DISTRICTS.find(d => d.name === fir.district);

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
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API Error ${response.status}`);
  const data = await response.json() as { content: { type: string; text: string }[] };
  return data.content?.[0]?.text ?? 'No summary generated.';
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
  Critical: { text: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)' },
  High:     { text: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)' },
  Medium:   { text: '#00f0ff', bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.2)' },
  Low:      { text: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
};

const statusColors: Record<string, string> = {
  'Under Investigation': '#f59e0b',
  'Arrested': '#10b981',
  'Closed': '#64748b',
  'Pending': '#ef4444',
  'Absconding': '#ef4444',
};

// ─── FIR Card ─────────────────────────────────────────────────────────────────

function FIRCard({ fir, onClick, isSelected }: { fir: FIRRecord; onClick: () => void; isSelected: boolean }) {
  const pc = priorityColors[fir.priority] ?? priorityColors.Low;
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: 14, borderRadius: 12, cursor: 'pointer',
        background: isSelected ? 'rgba(0,240,255,0.06)' : 'rgba(2,6,23,0.9)',
        border: `1px solid ${isSelected ? 'rgba(0,240,255,0.35)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.15s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,240,255,0.2)'; }}}
      onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#00f0ff' }}>{fir.firNumber}</span>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4,
          background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`, textTransform: 'uppercase' }}>
          {fir.priority}
        </span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{fir.crimeType}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={9} />{fir.district}</span>
        <span style={{ color: statusColors[fir.status] ?? '#64748b' }}>{fir.status}</span>
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
    const activeKey = getAnthropicApiKey();
    if (!activeKey) { setAiSummary('⚠️ API key not configured. Please enter your API key in the Investigator page first.'); return; }
    setIsGenerating(true);
    setAiSummary('');
    try {
      const summary = await generateAICaseSummary(fir, activeKey);
      setAiSummary(summary);
    } catch (err) {
      setAiSummary(`⚠️ Error: ${(err as Error).message}`);
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
      doc.setFillColor(2, 6, 23); doc.rect(0, 0, pw, 30, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
      doc.text('KARNATAKA STATE POLICE — RESTRICTED', pw / 2, 12, { align: 'center' });
      doc.setFontSize(9); doc.setTextColor(0, 200, 220);
      doc.text('CrimeVision AI v5.0 | FIR Intelligence Report', pw / 2, 20, { align: 'center' });
      doc.setFontSize(7); doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST`, pw / 2, 27, { align: 'center' });

      let y = 40;
      // FIR Number
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(0, 150, 200);
      doc.text(fir.firNumber, pw / 2, y, { align: 'center' }); y += 8;
      doc.setFontSize(10); doc.setTextColor(80, 80, 80); doc.setFont('helvetica', 'normal');
      doc.text(`${fir.crimeType} | ${fir.district} | ${fir.date}`, pw / 2, y, { align: 'center' }); y += 10;

      // Status badge
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.setTextColor(fir.priority === 'Critical' ? 200 : fir.priority === 'High' ? 180 : 0, 0, 0);
      doc.text(`Priority: ${fir.priority} | Status: ${fir.status}`, pw / 2, y, { align: 'center' }); y += 8;
      doc.setDrawColor(0, 200, 220); doc.line(15, y, pw - 15, y); y += 8;

      // Case Details
      doc.setFillColor(240, 248, 255); doc.rect(15, y - 3, pw - 30, 8, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 80, 140);
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
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(0, 80, 140);
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
      doc.text('CrimeVision AI v5.0 | Karnataka State Police | RESTRICTED — FOR OFFICIAL USE ONLY', pw / 2, y, { align: 'center' });

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
        padding: 20, borderRadius: 14, background: 'rgba(2,6,23,0.95)',
        border: `1px solid ${pc.border}`,
        boxShadow: `0 0 24px ${pc.bg}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>FIR NUMBER</div>
            <div style={{ fontSize: 22, fontFamily: 'monospace', fontWeight: 900, color: '#00f0ff' }}>{fir.firNumber}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 800,
              background: pc.bg, color: pc.text, border: `1px solid ${pc.border}`, textTransform: 'uppercase' }}>
              {fir.priority}
            </div>
            <div style={{ padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
              background: 'rgba(255,255,255,0.04)', color: statusColors[fir.status] ?? '#64748b',
              border: '1px solid rgba(255,255,255,0.08)' }}>
              {fir.status}
            </div>
          </div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{fir.crimeType}</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{fir.district}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{fir.date}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Shield size={12} />{fir.assignedOfficer}</span>
        </div>
      </div>

      {/* Case Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Crime Type', value: fir.crimeType, color: '#00f0ff' },
          { label: 'District', value: fir.district, color: '#e2e8f0' },
          { label: 'Filing Date', value: fir.date, color: '#e2e8f0' },
          { label: 'District Risk', value: district ? `${district.riskScore}/100` : 'N/A', color: district && district.riskScore > 80 ? '#ef4444' : '#f59e0b' },
        ].map(item => (
          <div key={item.label} style={{
            padding: 12, borderRadius: 10, background: 'rgba(2,6,23,0.85)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Suspect Panel */}
      {suspect && (
        <div style={{
          padding: 16, borderRadius: 12, background: 'rgba(239,68,68,0.05)',
          border: '1px solid rgba(239,68,68,0.2)',
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
                <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: k === 'Status' ? (statusColors[v] ?? '#94a3b8') : '#e2e8f0' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(2,6,23,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={11} /> Case Description
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>{fir.description}</p>
      </div>

      {/* AI Case Summary */}
      <div style={{ padding: 16, borderRadius: 12, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: aiSummary ? 12 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={14} color="#a78bfa" />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI Case Summary
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {aiSummary && (
              <button onClick={() => { navigator.clipboard.writeText(aiSummary); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: copied ? '#10b981' : '#64748b',
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
                background: isGenerating ? 'rgba(139,92,246,0.04)' : 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.35)', color: isGenerating ? '#64748b' : '#a78bfa',
                fontSize: 11, fontWeight: 700, cursor: isGenerating ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}
            >
              {isGenerating ? <><Loader size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> Analyzing...</> : <><Zap size={12} /> Generate AI Summary</>}
            </button>
          </div>
        </div>

        {aiSummary && (
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
            {aiSummary}
          </div>
        )}

        {!aiSummary && !isGenerating && (
          <div style={{ fontSize: 12, color: '#475569', marginTop: 8 }}>
            Click "Generate AI Summary" to get an instant intelligence assessment powered by Claude AI.
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
            padding: '10px', borderRadius: 10, border: '1px solid rgba(0,240,255,0.3)',
            background: 'rgba(0,240,255,0.08)', color: '#00f0ff',
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
  const { t } = useLanguage();
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
    } else if (RECENT_FIRS.length > 0) {
      setSelectedFIR(RECENT_FIRS[0]);
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
    <div style={{ padding: 24, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(0,240,255,0.1)',
          border: '1px solid rgba(0,240,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={22} color="#00f0ff" />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>{t.page_fir ?? 'FIR Intelligence'}</h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
            {RECENT_FIRS.length} FIRs · Click any FIR for full details + AI Case Summary
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        {/* Left: FIR List */}
        <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Search + Filters */}
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search FIR, crime, district..."
                style={{ width: '100%', paddingLeft: 30, paddingRight: searchQuery ? 28 : 10, paddingTop: 7, paddingBottom: 7,
                  background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 8,
                  color: '#f1f5f9', fontSize: 12, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                  <X size={11} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Critical', 'High', 'Medium'].map(p => (
                <button key={p} onClick={() => setFilterPriority(p)}
                  style={{ flex: 1, padding: '4px 0', borderRadius: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${filterPriority === p ? 'rgba(0,240,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    background: filterPriority === p ? 'rgba(0,240,255,0.1)' : 'transparent',
                    color: filterPriority === p ? '#00f0ff' : '#64748b' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 10, color: '#475569', padding: '0 4px' }}>
            {filteredFIRs.length} of {RECENT_FIRS.length} FIRs
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
            {filteredFIRs.map(fir => (
              <FIRCard key={fir.id} fir={fir} onClick={() => setSelectedFIR(fir)} isSelected={selectedFIR?.id === fir.id} />
            ))}
            {filteredFIRs.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: '#475569', fontSize: 12 }}>No FIRs match your search.</div>
            )}
          </div>
        </div>

        {/* Right: FIR Detail */}
        <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 112px)' }}>
          {selectedFIR ? (
            <FIRDetailPanel key={selectedFIR.id} fir={selectedFIR} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, textAlign: 'center' }}>
              <div>
                <FileText size={36} color="#334155" style={{ marginBottom: 12 }} />
                <p style={{ color: '#475569', fontSize: 14 }}>Select a FIR from the list to view full details</p>
              </div>
            </div>
          )}
        </div>
      </div>

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
