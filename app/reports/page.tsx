'use client';

import { useState } from 'react';
import {
  FileText, Download, Eye, X, CheckSquare, Square, FileSpreadsheet,
  RefreshCw, Shield, Network, Brain, Monitor, Truck, BarChart2,
  ChevronRight, AlertTriangle, MapPin, Loader,
} from 'lucide-react';
import { SUMMARY_METRICS, DISTRICT_RISK_SCORES, AI_ALERTS } from '@/lib/mockData';

interface ReportDef {
  id: string;
  icon: any;
  iconColor: string;
  title: string;
  description: string;
  lastGenerated: string;
  fileSize: string;
  formats: string[];
  findings: string[];
  riskSummary: string;
  forecastText: string;
}

const REPORTS: ReportDef[] = [
  {
    id: 'state-crime',
    icon: BarChart2,
    iconColor: '#00f0ff',
    title: 'State Crime Summary Report',
    description: 'Monthly statewide crime overview with district-level analysis, trends, and clearance rates.',
    lastGenerated: '30 May 2025, 06:00 AM',
    fileSize: '4.2 MB',
    formats: ['PDF', 'Excel'],
    findings: [
      'Total crimes rose 8.3% MoM in May 2025, led by cybercrime (+34%)',
      'Bengaluru Urban accounts for 18% of all state crime incidents',
      'Clearance rate remains strong at 82.6% across Karnataka',
      'Northern corridor (Kalaburagi, Raichur) shows alarming 11–13% YoY surge',
    ],
    riskSummary: 'State overall: HIGH. 4 districts at CRITICAL level.',
    forecastText: 'Q3 2025 projected to see 28% increase during festival season; cybercrime to remain primary threat vector.',
  },
  {
    id: 'district-intel',
    icon: MapPin,
    iconColor: '#8b5cf6',
    title: 'District Intelligence Report',
    description: 'Per-district deep-dive analysis with crime category breakdown, resources, and risk scores.',
    lastGenerated: '29 May 2025, 11:00 PM',
    fileSize: '6.8 MB',
    formats: ['PDF', 'Excel'],
    findings: [
      'Bengaluru Urban risk score: 94/100 — highest in Karnataka',
      'Raichur crime rate increased +13.8% — fastest-growing threat district',
      'Ballari organized crime cluster expanded by 3 new nodes this week',
      'Southern coastal districts (Udupi, Kodagu) remain stable at LOW risk',
    ],
    riskSummary: '7 HIGH, 4 CRITICAL districts flagged for immediate attention.',
    forecastText: 'District-level AI model projects 6 districts upgrading risk level by Dec 2025.',
  },
  {
    id: 'network-analysis',
    icon: Network,
    iconColor: '#e879f9',
    title: 'Criminal Network Analysis',
    description: 'Suspect relationship mapping, cluster identification, and network disruption recommendations.',
    lastGenerated: '30 May 2025, 02:00 AM',
    fileSize: '3.1 MB',
    formats: ['PDF'],
    findings: [
      '14 active criminal network clusters identified across Karnataka',
      'Imran Sheikh (Risk: 96) confirmed as highest-priority target in Kalaburagi',
      'Cross-border narcotics network links Karnataka to Andhra Pradesh and Goa',
      '3 new clusters emerged in northern districts this week',
    ],
    riskSummary: '2 Tier-1 networks (Red Corner Notice level) actively operating.',
    forecastText: 'Without intervention, network growth projected at +22% in next quarter.',
  },
  {
    id: 'ai-prediction',
    icon: Brain,
    iconColor: '#f59e0b',
    title: 'AI Prediction Report',
    description: 'Machine learning crime forecasts for the next quarter with confidence intervals.',
    lastGenerated: '30 May 2025, 05:30 AM',
    fileSize: '2.7 MB',
    formats: ['PDF', 'Excel'],
    findings: [
      'Jul 2025 forecast: 10,800 crimes (78% model confidence)',
      'Dec 2025 predicted peak: 13,600 crimes (+52% vs Jan 2024 baseline)',
      'Festival season Oct–Dec projects 28% spike — Dasara primary driver',
      'Cybercrime AI model accuracy validated at 91.2% for Q1 2025',
    ],
    riskSummary: 'AI overall confidence: HIGH. All 6 forecast months computed.',
    forecastText: 'Model recommends 3,400 additional deployment days across critical districts for Q3.',
  },
  {
    id: 'cyber-threat',
    icon: Monitor,
    iconColor: '#ef4444',
    title: 'Cybercrime Threat Assessment',
    description: 'Cyber-focused threat intelligence: phishing, financial fraud, dark web activity.',
    lastGenerated: '30 May 2025, 07:45 AM',
    fileSize: '5.3 MB',
    formats: ['PDF', 'Excel'],
    findings: [
      '18,234 cybercrime incidents reported YTD — 22% of all Karnataka crime',
      '412 OTP phishing complaints in 48 hours — active coordinated campaign',
      '23 ksp.gov.in credentials exposed on dark web forum',
      '₹1.8 Crore financial exposure from current Bengaluru Urban campaign',
    ],
    riskSummary: 'Cyber threat level: CRITICAL. Immediate task force deployment warranted.',
    forecastText: 'Cybercrime projected to exceed 25,000 incidents by Dec 2025 without intervention.',
  },
  {
    id: 'resource-deployment',
    icon: Truck,
    iconColor: '#10b981',
    title: 'Resource Deployment Report',
    description: 'Force allocation status, coverage gaps, and AI-recommended deployment adjustments.',
    lastGenerated: '30 May 2025, 04:00 AM',
    fileSize: '1.9 MB',
    formats: ['PDF', 'Excel'],
    findings: [
      '28,450 personnel deployed across Karnataka — 6 districts under-resourced',
      'Kalaburagi cyber unit has only 34 officers for 2.56M population',
      'Raichur coverage at 48% — lowest in the state relative to crime rate',
      'AI recommends 1,200 officer redeployment from low-risk southern districts',
    ],
    riskSummary: 'Resource adequacy: POOR in 4 northern districts. Rebalancing critical.',
    forecastText: 'Optimal deployment model projects 23% improvement in response times if rebalanced.',
  },
];

const heatmapDistricts = [
  { name: 'BLR Urban', score: 94 },
  { name: 'Kalaburagi', score: 87 },
  { name: 'Raichur', score: 84 },
  { name: 'Ballari', score: 81 },
  { name: 'Belagavi', score: 76 },
  { name: 'Mangaluru', score: 72 },
  { name: 'Hubballi', score: 69 },
  { name: 'Vijayapura', score: 64 },
  { name: 'Mysuru', score: 55 },
  { name: 'Davangere', score: 49 },
];

function getHeatColor(score: number): string {
  if (score >= 85) return 'rgba(239,68,68,0.85)';
  if (score >= 70) return 'rgba(245,158,11,0.80)';
  if (score >= 55) return 'rgba(234,179,8,0.70)';
  return 'rgba(0,240,255,0.35)';
}

const CHECKBOXES = [
  { id: 'district', label: 'District Selection' },
  { id: 'period', label: 'Time Period' },
  { id: 'categories', label: 'Crime Categories' },
  { id: 'predictions', label: 'Include AI Predictions' },
  { id: 'network', label: 'Include Network Analysis' },
  { id: 'resources', label: 'Include Resource Data' },
];

export default function ReportsPage() {
  const [previewReport, setPreviewReport] = useState<ReportDef | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({
    district: true, period: true, categories: false, predictions: true, network: false, resources: false,
  });

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 2000);
  };

  const handleExport = (id: string) => {
    setExporting(id);
    setTimeout(() => setExporting(null), 1800);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2500);
  };

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={22} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title">Intelligence Reports Center</h1>
            <p className="page-subtitle">Generate, preview and export comprehensive intelligence reports</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-cyan">{REPORTS.length} Report Templates</span>
          </div>
        </div>
      </div>

      {/* REPORT CARDS GRID */}
      <div className="responsive-grid-3" style={{ marginBottom: 28 }}>
        {REPORTS.map((report) => {
          const Icon = report.icon;
          const isDL = downloading === report.id;
          const isEX = exporting === report.id;
          return (
            <div key={report.id} className="glass-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* HEADER */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `${report.iconColor}18`, border: `1px solid ${report.iconColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} color={report.iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, lineHeight: 1.4 }}>
                    {report.title}
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{report.description}</p>
                </div>
              </div>

              {/* META */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  <span style={{ color: '#94a3b8' }}>Last generated:</span><br />
                  <span style={{ color: '#cbd5e1', fontWeight: 600 }}>{report.lastGenerated}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Size</div>
                  <div style={{ fontSize: 13, color: '#f1f5f9', fontWeight: 700 }}>{report.fileSize}</div>
                </div>
              </div>

              {/* FORMAT BADGES */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {report.formats.map(f => (
                  <span key={f} className={f === 'PDF' ? 'badge badge-red' : 'badge badge-green'} style={{ fontSize: 10 }}>
                    {f}
                  </span>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <button
                  className="cyber-btn cyber-btn-cyan"
                  style={{ flex: 1, fontSize: 11, padding: '8px 10px', justifyContent: 'center' }}
                  onClick={() => setPreviewReport(report)}
                >
                  <Eye size={12} /> Preview
                </button>
                <button
                  className="cyber-btn cyber-btn-red"
                  style={{ flex: 1, fontSize: 11, padding: '8px 10px', justifyContent: 'center' }}
                  onClick={() => handleDownload(report.id)}
                >
                  {isDL ? <Loader size={12} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <Download size={12} />}
                  {isDL ? 'Downloading...' : 'PDF'}
                </button>
                <button
                  className="cyber-btn cyber-btn-green"
                  style={{ flex: 1, fontSize: 11, padding: '8px 10px', justifyContent: 'center' }}
                  onClick={() => handleExport(report.id)}
                >
                  {isEX ? <Loader size={12} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <FileSpreadsheet size={12} />}
                  {isEX ? 'Exporting...' : 'Excel'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CUSTOM REPORT GENERATOR */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-header-line" />
          <span className="section-title">Generate Custom Report</span>
          {generated && (
            <span className="badge badge-green" style={{ marginLeft: 8 }}>✓ Generated Successfully</span>
          )}
        </div>
        <div className="responsive-grid-3" style={{ marginBottom: 20 }}>
          {CHECKBOXES.map((cb) => (
            <label
              key={cb.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                padding: '12px 14px', borderRadius: 10,
                background: checked[cb.id] ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${checked[cb.id] ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.2s ease',
              }}
              onClick={() => setChecked(p => ({ ...p, [cb.id]: !p[cb.id] }))}
            >
              {checked[cb.id]
                ? <CheckSquare size={16} color="#00f0ff" />
                : <Square size={16} color="#64748b" />}
              <span style={{ fontSize: 13, color: checked[cb.id] ? '#f1f5f9' : '#94a3b8', fontWeight: checked[cb.id] ? 600 : 400 }}>
                {cb.label}
              </span>
            </label>
          ))}
        </div>
        <button
          className="cyber-btn cyber-btn-cyan"
          style={{ padding: '12px 28px', fontSize: 13 }}
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating
            ? <><RefreshCw size={14} style={{ animation: 'spin-slow 1s linear infinite' }} /> Generating Report...</>
            : <><ChevronRight size={14} /> Generate Custom Report</>}
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {previewReport && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(2,6,23,0.88)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setPreviewReport(null)}
        >
          <div
            className="glass-card"
            style={{ width: '100%', maxWidth: 780, maxHeight: '88vh', overflowY: 'auto', padding: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid rgba(0,240,255,0.1)' }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: `${previewReport.iconColor}18`, border: `1px solid ${previewReport.iconColor}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <previewReport.icon size={19} color={previewReport.iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{previewReport.title}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Generated: {previewReport.lastGenerated} · Size: {previewReport.fileSize}
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
                onClick={() => setPreviewReport(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* KEY FINDINGS */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00f0ff', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Key Findings
              </div>
              {previewReport.findings.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <ChevronRight size={13} color="#00f0ff" style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* RISK ASSESSMENT */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Risk Assessment Summary
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {DISTRICT_RISK_SCORES.slice(0, 5).map((d) => (
                  <div key={d.name} style={{
                    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: d.score >= 85 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.12)',
                    border: `1px solid ${d.score >= 85 ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.25)'}`,
                    color: d.score >= 85 ? '#f87171' : '#fbbf24',
                  }}>
                    {d.name}: {d.score}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '10px 14px' }}>
                {previewReport.riskSummary}
              </p>
            </div>

            {/* CRIME FORECAST */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#8b5cf6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                Crime Forecast Summary
              </div>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 8, padding: '10px 14px' }}>
                {previewReport.forecastText}
              </p>
            </div>

            {/* HEATMAP PREVIEW */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                District Risk Heatmap Preview
              </div>
              <div className="responsive-grid-5">
                {heatmapDistricts.map((d) => (
                  <div key={d.name} style={{
                    background: getHeatColor(d.score),
                    borderRadius: 8, padding: '10px 8px', textAlign: 'center',
                    boxShadow: d.score >= 85 ? '0 0 12px rgba(239,68,68,0.3)' : 'none',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{d.name}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{d.score}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid rgba(0,240,255,0.08)' }}>
              <button
                className="cyber-btn cyber-btn-red"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handleDownload(previewReport.id)}
              >
                <Download size={13} /> Download PDF
              </button>
              <button
                className="cyber-btn cyber-btn-green"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => handleExport(previewReport.id)}
              >
                <FileSpreadsheet size={13} /> Export Excel
              </button>
              <button
                className="cyber-btn"
                style={{
                  flex: 1, justifyContent: 'center',
                  background: 'rgba(100,116,139,0.12)', color: '#94a3b8',
                  border: '1px solid rgba(100,116,139,0.25)',
                }}
                onClick={() => setPreviewReport(null)}
              >
                <X size={13} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
