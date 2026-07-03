'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: app/reports/page.tsx  (REPLACE existing file entirely)
// CrimeVision AI — Intelligence Reports + Real PDF Download (jsPDF from CDN)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { FileText, Download, AlertCircle, Shield, Network, Monitor, Target, CheckCircle, Loader } from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import {
  DISTRICTS, CRIME_CATEGORIES, SUMMARY_METRICS,
  RECENT_FIRS, TOP_SUSPECTS, ANOMALY_DISTRICTS,
} from '@/lib/crimeData';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportCard {
  id: string;
  title: string;
  titleKn: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  pages: number;
  category: string;
}

// ─── jsPDF Loader ─────────────────────────────────────────────────────────────

async function loadJsPDF(): Promise<{
  jsPDF: new (opts?: { orientation?: string; unit?: string; format?: string }) => JsPDFDoc;
}> {
  if ((window as unknown as Record<string, unknown>).jspdf) {
    return (window as unknown as Record<string, unknown>).jspdf as { jsPDF: new () => JsPDFDoc };
  }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.head.appendChild(s);
  });
  return (window as unknown as Record<string, unknown>).jspdf as { jsPDF: new () => JsPDFDoc };
}

// Minimal jsPDF doc type
interface JsPDFDoc {
  setFontSize: (n: number) => JsPDFDoc;
  setTextColor: (r: number, g: number, b: number) => JsPDFDoc;
  setFillColor: (r: number, g: number, b: number) => JsPDFDoc;
  setDrawColor: (r: number, g: number, b: number) => JsPDFDoc;
  setFont: (face: string, style?: string) => JsPDFDoc;
  text: (t: string | string[], x: number, y: number, opts?: Record<string, unknown>) => JsPDFDoc;
  rect: (x: number, y: number, w: number, h: number, style?: string) => JsPDFDoc;
  line: (x1: number, y1: number, x2: number, y2: number) => JsPDFDoc;
  addPage: () => JsPDFDoc;
  splitTextToSize: (text: string, maxW: number) => string[];
  save: (name: string) => void;
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
}

// ─── PDF Builder Helpers ──────────────────────────────────────────────────────

function buildHeader(doc: JsPDFDoc, title: string, lang: 'en' | 'kn') {
  const pw = doc.internal.pageSize.getWidth();
  // Navy header bar
  doc.setFillColor(30, 58, 95).rect(0, 0, pw, 32, 'F');
  doc.setTextColor(255, 255, 255).setFontSize(13).setFont('helvetica', 'bold');
  doc.text('KARNATAKA STATE POLICE', pw / 2, 12, { align: 'center' });
  doc.setFontSize(8).setTextColor(220, 220, 220);
  doc.text('RESTRICTED — FOR OFFICIAL USE ONLY', pw / 2, 19, { align: 'center' });
  doc.setFontSize(9).setTextColor(255, 255, 255);
  doc.text('CrimeVision AI v2.0 | KSP Datathon 2026', pw / 2, 26, { align: 'center' });

  // Title section
  doc.setTextColor(30, 30, 30).setFontSize(14).setFont('helvetica', 'bold');
  doc.text(title, pw / 2, 44, { align: 'center' });
  doc.setFontSize(9).setTextColor(100, 100, 100).setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST`, pw / 2, 52, { align: 'center' });
  doc.setDrawColor(166, 25, 46).line(15, 56, pw - 15, 56);
}

function buildFooter(doc: JsPDFDoc, y: number) {
  const pw = doc.internal.pageSize.getWidth();
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setDrawColor(200, 200, 200).line(15, y, pw - 15, y);
  doc.setFontSize(7).setTextColor(150, 150, 150).setFont('helvetica', 'normal');
  doc.text('CrimeVision AI v6.0 | KSP Datathon 2026 | Karnataka State Police | RESTRICTED — FOR OFFICIAL USE ONLY', pw / 2, y + 6, { align: 'center' });
}

function sectionHeader(doc: JsPDFDoc, text: string, y: number): number {
  const pw = doc.internal.pageSize.getWidth();
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFillColor(0, 50, 80).rect(15, y, pw - 30, 8, 'F');
  doc.setTextColor(255, 255, 255).setFontSize(9).setFont('helvetica', 'bold');
  doc.text(text.toUpperCase(), 18, y + 5.5);
  return y + 14;
}

function row(doc: JsPDFDoc, cells: [string, string, string, string, string], y: number, even: boolean): number {
  const pw = doc.internal.pageSize.getWidth();
  if (y > 265) { doc.addPage(); y = 20; }
  if (even) doc.setFillColor(245, 248, 255).rect(15, y - 3, pw - 30, 7, 'F');
  doc.setTextColor(40, 40, 40).setFontSize(8).setFont('helvetica', 'normal');
  const cols = [15, 58, 100, 130, 165];
  cells.forEach((c, i) => doc.text(c, cols[i], y));
  return y + 8;
}

// ─── Report Builders ──────────────────────────────────────────────────────────

async function buildDistrictReport(lang: 'en' | 'kn') {
  const lib = await loadJsPDF();
  const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  buildHeader(doc, lang === 'kn' ? 'ಜಿಲ್ಲಾ ಗುಪ್ತಚರ ವರದಿ' : 'District Intelligence Report', lang);

  let y = 64;

  // Summary stats
  y = sectionHeader(doc, 'State Overview', y);
  const stats = [
    ['Total Crimes', SUMMARY_METRICS.totalCrimes.toLocaleString()],
    ['Active Cases', SUMMARY_METRICS.activeCases.toLocaleString()],
    ['Clearance Rate', `${SUMMARY_METRICS.clearanceRate}%`],
    ['Total Officers', SUMMARY_METRICS.totalOfficers.toLocaleString()],
    ['Police Stations', SUMMARY_METRICS.totalStations.toString()],
    ['High Risk Districts', SUMMARY_METRICS.highRiskDistricts.toString()],
  ];
  let sx = 15;
  stats.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold').setTextColor(0, 100, 150).setFontSize(16);
    doc.text(val, sx, y + 4);
    doc.setFont('helvetica', 'normal').setTextColor(100, 100, 100).setFontSize(8);
    doc.text(label, sx, y + 10);
    sx += 32;
  });
  y += 20;
  doc.setDrawColor(220, 220, 220).line(15, y, pw - 15, y);
  y += 8;

  // District table
  y = sectionHeader(doc, 'All 31 Karnataka Districts — Crime Intelligence', y);
  // Table header
  doc.setFillColor(0, 30, 60).rect(15, y - 3, pw - 30, 7, 'F');
  doc.setTextColor(255, 255, 255).setFontSize(8).setFont('helvetica', 'bold');
  ['District', 'Crimes', 'Risk Score', 'Top Crime', 'Trend'].forEach((h, i) => {
    doc.text(h, [15, 58, 100, 130, 165][i], y + 1);
  });
  y += 8;

  DISTRICTS.forEach((d, idx) => {
    y = row(doc,
      [d.name, d.crimeCount.toLocaleString(), `${d.riskScore}/100`, d.topCrimeType, `${d.trend === 'up' ? '▲' : d.trend === 'down' ? '▼' : '→'} ${Math.abs(d.trendPercent)}%`],
      y, idx % 2 === 0
    );
  });

  y += 6;
  buildFooter(doc, y);
  doc.save(`KSP_District_Intelligence_${Date.now()}.pdf`);
}

async function buildCriminalNetworkReport(lang: 'en' | 'kn') {
  const lib = await loadJsPDF();
  const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  buildHeader(doc, lang === 'kn' ? 'ಅಪರಾಧಿ ಜಾಲ ವಿಶ್ಲೇಷಣೆ' : 'Criminal Network Analysis Report', lang);
  let y = 64;

  y = sectionHeader(doc, 'Top 15 Priority Suspects', y);
  doc.setFillColor(0, 30, 60).rect(15, y - 3, pw - 30, 7, 'F');
  doc.setTextColor(255, 255, 255).setFontSize(8).setFont('helvetica', 'bold');
  ['Suspect', 'District', 'Crime Type', 'FIRs', 'Risk'].forEach((h, i) => {
    doc.text(h, [15, 58, 100, 155, 172][i], y + 1);
  });
  y += 8;
  TOP_SUSPECTS.forEach((s, idx) => {
    if (y > 265) { doc.addPage(); y = 20; }
    const even = idx % 2 === 0;
    if (even) doc.setFillColor(245, 248, 255).rect(15, y - 3, pw - 30, 7, 'F');
    doc.setTextColor(40, 40, 40).setFontSize(8).setFont('helvetica', 'normal');
    doc.text(s.name, 15, y);
    doc.text(s.district, 58, y);
    doc.text(s.crimeType.slice(0, 28), 100, y);
    doc.text(s.firCount.toString(), 155, y);
    doc.setTextColor(s.riskLevel === 'Critical' ? 200 : s.riskLevel === 'High' ? 180 : 100, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`${s.riskScore}/100`, 172, y);
    doc.setTextColor(40, 40, 40).setFont('helvetica', 'normal');
    y += 8;
  });

  y += 6;
  y = sectionHeader(doc, 'Suspect Status Summary', y);
  const statusCounts = TOP_SUSPECTS.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  Object.entries(statusCounts).forEach(([status, count]) => {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(40, 40, 40);
    doc.text(`• ${status}: ${count} suspects`, 20, y);
    y += 7;
  });

  buildFooter(doc, y + 6);
  doc.save(`KSP_Criminal_Network_${Date.now()}.pdf`);
}

async function buildCybercrimeReport(lang: 'en' | 'kn') {
  const lib = await loadJsPDF();
  const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  buildHeader(doc, lang === 'kn' ? 'ಸೈಬರ್ ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ ವರದಿ' : 'Cybercrime Analysis Report', lang);
  let y = 64;

  y = sectionHeader(doc, 'Cybercrime Statistics — Karnataka 2024–2025', y);
  const cyberData = [
    ['Total Cybercrime Cases', '18,234', '+34% YoY'],
    ['Primary Vector', 'OTP Phishing / UPI Fraud', 'High'],
    ['Worst Affected District', 'Bengaluru Urban', '4,231 cases'],
    ['Financial Exposure', '₹142+ Crores', 'FY 2024–25'],
    ['Arrests Made', '1,847', '10.1% arrest rate'],
    ['SIT Cases', '23 active SITs', 'Multi-district'],
  ];
  cyberData.forEach(([k, v, note], idx) => {
    if (y > 265) { doc.addPage(); y = 20; }
    if (idx % 2 === 0) doc.setFillColor(248, 252, 255).rect(15, y - 3, pw - 30, 7, 'F');
    doc.setFont('helvetica', 'bold').setTextColor(0, 80, 140).setFontSize(9).text(k, 18, y);
    doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).text(v, 90, y);
    doc.setTextColor(120, 120, 120).text(note, 155, y);
    y += 8;
  });

  y += 6;
  y = sectionHeader(doc, 'Cybercrime by District (Top 8)', y);
  const topCyber = DISTRICTS.sort((a, b) => b.cybercrime - a.cybercrime).slice(0, 8);
  doc.setFillColor(0, 30, 60).rect(15, y - 3, pw - 30, 7, 'F');
  doc.setTextColor(255, 255, 255).setFontSize(8).setFont('helvetica', 'bold');
  ['District', 'Cyber Cases', '% of Total', 'Risk Score', 'Trend'].forEach((h, i) => {
    doc.text(h, [15, 58, 95, 130, 165][i], y + 1);
  });
  y += 8;
  topCyber.forEach((d, idx) => {
    y = row(doc,
      [d.name, d.cybercrime.toLocaleString(), `${((d.cybercrime / 18234) * 100).toFixed(1)}%`, `${d.riskScore}/100`, `${d.trend === 'up' ? '▲' : '▼'} ${d.trendPercent}%`],
      y, idx % 2 === 0
    );
  });

  y += 6;
  y = sectionHeader(doc, 'Recent Cybercrime FIRs', y);
  RECENT_FIRS.filter(f => f.crimeType.toLowerCase().includes('cyber') || f.crimeType.toLowerCase().includes('financial')).slice(0, 5).forEach((fir, idx) => {
    if (y > 265) { doc.addPage(); y = 20; }
    if (idx % 2 === 0) doc.setFillColor(248, 252, 255).rect(15, y - 3, pw - 30, 7, 'F');
    doc.setFont('helvetica', 'bold').setTextColor(0, 100, 150).setFontSize(8).text(fir.firNumber, 15, y);
    doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).text(fir.district, 65, y);
    doc.text(fir.status, 120, y);
    doc.text(fir.date, 155, y);
    y += 8;
  });

  buildFooter(doc, y + 6);
  doc.save(`KSP_Cybercrime_Analysis_${Date.now()}.pdf`);
}

async function buildThreatAssessmentReport(lang: 'en' | 'kn') {
  const lib = await loadJsPDF();
  const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  buildHeader(doc, lang === 'kn' ? 'ಬೆದರಿಕೆ ಮೌಲ್ಯಮಾಪನ ವರದಿ' : 'Threat Assessment Report — Karnataka State', lang);
  let y = 64;

  // Overall threat
  doc.setFillColor(200, 0, 0).rect(15, y, pw - 30, 18, 'F');
  doc.setTextColor(255, 255, 255).setFont('helvetica', 'bold').setFontSize(16);
  doc.text('OVERALL THREAT LEVEL: HIGH', pw / 2, y + 8, { align: 'center' });
  doc.setFontSize(9);
  doc.text('82,089 crimes recorded | 23 AI alerts active | 6 critical anomalies detected', pw / 2, y + 14, { align: 'center' });
  y += 26;

  // Current Anomalies
  y = sectionHeader(doc, 'Critical Anomaly Spikes (Last 24 Hours)', y);
  doc.setFillColor(0, 30, 60).rect(15, y - 3, pw - 30, 7, 'F');
  doc.setTextColor(255, 255, 255).setFontSize(8).setFont('helvetica', 'bold');
  ['District', 'Crime Type', 'Spike %', 'Severity', 'Status'].forEach((h, i) => {
    doc.text(h, [15, 55, 100, 135, 162][i], y + 1);
  });
  y += 8;
  ANOMALY_DISTRICTS.forEach((a, idx) => {
    if (y > 265) { doc.addPage(); y = 20; }
    if (idx % 2 === 0) doc.setFillColor(255, 248, 245).rect(15, y - 3, pw - 30, 7, 'F');
    doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).setFontSize(8);
    doc.text(a.district, 15, y);
    doc.text(a.crimeType.slice(0, 20), 55, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(a.severity === 'Critical' ? 200 : 160, 0, 0);
    doc.text(`+${a.spikePercent}%`, 100, y);
    doc.setTextColor(40, 40, 40).setFont('helvetica', 'normal');
    doc.text(a.severity, 135, y);
    doc.text(a.status, 162, y);
    y += 8;
  });

  y += 6;
  y = sectionHeader(doc, 'Crime Category Risk Summary', y);
  CRIME_CATEGORIES.forEach((cat, idx) => {
    if (y > 265) { doc.addPage(); y = 20; }
    if (idx % 2 === 0) doc.setFillColor(248, 248, 255).rect(15, y - 3, pw - 30, 7, 'F');
    doc.setFont('helvetica', 'bold').setTextColor(40, 40, 40).setFontSize(9).text(cat.name, 18, y);
    doc.setFont('helvetica', 'normal').text(cat.count.toLocaleString(), 95, y);
    doc.text(`${cat.percentage}%`, 130, y);
    doc.setTextColor(cat.trend.startsWith('+') ? 160 : 0, cat.trend.startsWith('+') ? 0 : 100, 0);
    doc.setFont('helvetica', 'bold').text(cat.trend, 160, y);
    doc.setTextColor(40, 40, 40);
    y += 8;
  });

  y += 6;
  y = sectionHeader(doc, 'Strategic Recommendations', y);
  const recs = [
    '1. Immediately reinforce Cyber Crime Cell in Bengaluru Urban (+80 specialists)',
    '2. Establish joint narcotics task force between Kalaburagi, Bidar & Yadgir districts',
    '3. Deploy river police patrols on Tungabhadra belt (Raichur, Koppal, Ballari)',
    '4. Issue Red Corner Notice for Suresh Nayak (Risk Score: 97)',
    '5. Activate SIT for organized crime networks in Ballari–Vijayanagara corridor',
    '6. Strengthen border checkposts on NH-48 (Belagavi) and Andhra Pradesh crossings',
  ];
  recs.forEach(rec => {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).setFontSize(9);
    doc.text(rec, 18, y);
    y += 7;
  });

  buildFooter(doc, y + 6);
  doc.save(`KSP_Threat_Assessment_${Date.now()}.pdf`);
}

async function buildAllReports(lang: 'en' | 'kn') {
  const lib = await loadJsPDF();
  const doc = new lib.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();

  // Cover page
  doc.setFillColor(245, 247, 250).rect(0, 0, pw, 297, 'F');
  doc.setDrawColor(166, 25, 46).rect(5, 5, pw - 10, 287);
  doc.setTextColor(166, 25, 46).setFont('helvetica', 'bold').setFontSize(11);
  doc.text('KARNATAKA STATE POLICE', pw / 2, 100, { align: 'center' });
  doc.setFontSize(22).setTextColor(30, 58, 95);
  doc.text('CrimeVision AI v2.0', pw / 2, 120, { align: 'center' });
  doc.setFontSize(12).setTextColor(70, 70, 70);
  doc.text('COMPREHENSIVE INTELLIGENCE REPORT', pw / 2, 132, { align: 'center' });
  doc.setFontSize(9).setTextColor(120, 120, 120);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST`, pw / 2, 145, { align: 'center' });
  doc.text('KSP DATATHON 2026 | RESTRICTED — FOR OFFICIAL USE ONLY', pw / 2, 280, { align: 'center' });

  // Add each report on new pages
  const titles = [
    'DISTRICT INTELLIGENCE REPORT',
    'CRIMINAL NETWORK ANALYSIS',
    'CYBERCRIME ANALYSIS',
    'THREAT ASSESSMENT',
  ];

  for (let rpt = 0; rpt < 4; rpt++) {
    doc.addPage();
    buildHeader(doc, titles[rpt], lang);
    let y = 64;

    if (rpt === 0) {
      // District summary
      y = sectionHeader(doc, 'Top 10 Districts by Crime Count', y);
      DISTRICTS.sort((a, b) => b.crimeCount - a.crimeCount).slice(0, 10).forEach((d, idx) => {
        y = row(doc, [d.name, d.crimeCount.toLocaleString(), `${d.riskScore}/100`, d.topCrimeType, `${d.trend === 'up' ? '▲' : '▼'}${d.trendPercent}%`], y, idx % 2 === 0);
      });
    } else if (rpt === 1) {
      y = sectionHeader(doc, 'Priority Suspects', y);
      TOP_SUSPECTS.slice(0, 10).forEach((s, idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        const even = idx % 2 === 0;
        if (even) doc.setFillColor(245, 248, 255).rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).setFontSize(8);
        doc.text(`${s.name} (${s.alias})`, 15, y);
        doc.text(s.district, 80, y);
        doc.text(`${s.firCount} FIRs`, 125, y);
        doc.setFont('helvetica', 'bold').setTextColor(s.riskLevel === 'Critical' ? 200 : 100, 0, 0);
        doc.text(`Risk ${s.riskScore}`, 160, y);
        doc.setTextColor(40, 40, 40);
        y += 8;
      });
    } else if (rpt === 2) {
      y = sectionHeader(doc, 'Cybercrime Breakdown', y);
      CRIME_CATEGORIES.forEach((cat, idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        if (idx % 2 === 0) doc.setFillColor(248, 252, 255).rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFontSize(9).setFont('helvetica', 'bold').setTextColor(40, 40, 40).text(cat.name, 18, y);
        doc.setFont('helvetica', 'normal').text(cat.count.toLocaleString(), 90, y);
        doc.text(`${cat.percentage}%`, 130, y);
        doc.text(cat.trend, 160, y);
        y += 8;
      });
    } else {
      y = sectionHeader(doc, 'Current Anomalies', y);
      ANOMALY_DISTRICTS.forEach((a, idx) => {
        if (y > 265) { doc.addPage(); y = 20; }
        if (idx % 2 === 0) doc.setFillColor(255, 248, 245).rect(15, y - 3, pw - 30, 7, 'F');
        doc.setFontSize(9).setFont('helvetica', 'bold').setTextColor(200, 0, 0).text(a.district, 15, y);
        doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).text(a.crimeType, 70, y);
        doc.setFont('helvetica', 'bold').setTextColor(200, 0, 0).text(`+${a.spikePercent}%`, 145, y);
        doc.setFont('helvetica', 'normal').setTextColor(40, 40, 40).text(a.severity, 170, y);
        y += 8;
      });
    }

    buildFooter(doc, 275);
  }

  doc.save(`KSP_Complete_Intelligence_${Date.now()}.pdf`);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportsPage() {
  const { t, lang } = useLanguage();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const REPORT_CARDS: ReportCard[] = [
    {
      id: 'district',
      title: t.report_district_intel,
      titleKn: 'ಜಿಲ್ಲಾ ಗುಪ್ತಚರ ವರದಿ',
      description: 'Complete intelligence analysis for all 31 Karnataka districts including crime counts, risk scores, trend analysis, officer deployment, and top crime categories.',
      icon: <Shield size={22} className="text-[var(--cyber-cyan)]" />,
      color: 'var(--cyber-cyan)',
      pages: 4,
      category: 'INTELLIGENCE',
    },
    {
      id: 'criminal',
      title: t.report_criminal_network,
      titleKn: 'ಅಪರಾಧಿ ಜಾಲ ವಿಶ್ಲೇಷಣೆ',
      description: 'Top 15 suspect profiles with risk scores, FIR links, aliases, associated networks, and current status (Wanted/Arrested/Absconding).',
      icon: <Network size={22} className="text-[var(--cyber-purple)]" />,
      color: 'var(--cyber-purple)',
      pages: 3,
      category: 'SUSPECTS',
    },
    {
      id: 'cybercrime',
      title: t.report_cybercrime,
      titleKn: 'ಸೈಬರ್ ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆ ವರದಿ',
      description: 'Deep-dive into 18,234 cybercrime cases: phishing vectors, financial exposure (₹142+ Cr), district breakdown, and active SIT investigations.',
      icon: <Monitor size={22} className="text-[var(--cyber-amber)]" />,
      color: 'var(--cyber-amber)',
      pages: 4,
      category: 'CYBERCRIME',
    },
    {
      id: 'threat',
      title: t.report_threat_assessment,
      titleKn: 'ಬೆದರಿಕೆ ಮೌಲ್ಯಮಾಪನ ವರದಿ',
      description: 'State-level threat assessment covering current anomaly spikes, crime category risks, and 6 strategic recommendations for immediate action.',
      icon: <Target size={22} className="text-[var(--cyber-red)]" />,
      color: 'var(--cyber-red)',
      pages: 5,
      category: 'THREAT',
    },
  ];

  const handleDownload = useCallback(async (id: string) => {
    setGeneratingId(id);
    try {
      if (id === 'district') await buildDistrictReport(lang);
      else if (id === 'criminal') await buildCriminalNetworkReport(lang);
      else if (id === 'cybercrime') await buildCybercrimeReport(lang);
      else if (id === 'threat') await buildThreatAssessmentReport(lang);
      setCompleted(prev => new Set(prev).add(id));
      setTimeout(() => setCompleted(prev => { const next = new Set(prev); next.delete(id); return next; }), 3000);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Check console for details.');
    } finally {
      setGeneratingId(null);
    }
  }, [lang]);

  const handleDownloadAll = useCallback(async () => {
    setGeneratingAll(true);
    try {
      await buildAllReports(lang);
    } catch (err) {
      console.error('All reports PDF failed:', err);
      alert('Combined PDF generation failed.');
    } finally {
      setGeneratingAll(false);
    }
  }, [lang]);

  return (
    <div style={{ padding: 24, minHeight: '100vh' }}>

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(30, 58, 95,0.1)', border: '1px solid rgba(30, 58, 95,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FileText size={22} className="text-[var(--cyber-cyan)]" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              {t.page_reports}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: '2px 0 0' }}>
              {t.sub_reports}
            </p>
          </div>
        </div>

        {/* Download All Button */}
        <button
          id="download-all-reports-btn"
          onClick={handleDownloadAll}
          disabled={generatingAll || generatingId !== null}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: generatingAll ? 'rgba(30, 58, 95,0.05)' : 'linear-gradient(135deg, rgba(30, 58, 95,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(30, 58, 95,0.35)', borderRadius: 10,
            color: generatingAll ? '#64748b' : '#0F6B5C',
            fontSize: 13, fontWeight: 800, cursor: generatingAll ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', letterSpacing: '0.04em', transition: 'all 0.2s',
          }}
        >
          {generatingAll ? (
            <><Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating...</>
          ) : (
            <><Download size={16} /> {t.btn_download_all}</>
          )}
        </button>
      </div>

      {/* ── Stats Strip ──────────────────────────────────────────────── */}
      <div className="responsive-grid-4" style={{ gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total Crimes', value: SUMMARY_METRICS.totalCrimes.toLocaleString(), color: 'var(--cyber-red)' },
          { label: 'Districts Covered', value: '31', color: 'var(--cyber-cyan)' },
          { label: 'Clearance Rate', value: `${SUMMARY_METRICS.clearanceRate}%`, color: 'var(--cyber-green)' },
          { label: 'Active Cases', value: SUMMARY_METRICS.activeCases.toLocaleString(), color: 'var(--cyber-amber)' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{
            padding: '14px 18px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Report Cards ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {REPORT_CARDS.map(card => {
          const isGen = generatingId === card.id;
          const isDone = completed.has(card.id);
          return (
            <div
              key={card.id}
              className="glass-card"
              style={{
                padding: 24,
                transition: 'all 0.2s',
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(30, 58, 95, 0.05)',
                  border: '1px solid var(--cyber-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
                    background: 'rgba(30, 58, 95, 0.05)',
                    color: card.color, border: '1px solid var(--cyber-border)',
                    letterSpacing: '0.1em',
                  }}>
                    {card.category}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{card.pages} pages</div>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.3 }}>
                {lang === 'kn' ? card.titleKn : card.title}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6, margin: '0 0 20px' }}>
                {card.description}
              </p>

              {/* PDF Info */}
              <div style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                background: 'var(--cyber-bg)', border: '1px solid var(--cyber-border)',
              }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>PDF includes:</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  ✓ KSP RESTRICTED header · ✓ Generated timestamp<br />
                  ✓ Data tables with all 31 districts · ✓ Official footer
                </div>
              </div>

              {/* Download Button */}
              <button
                id={`download-${card.id}-btn`}
                onClick={() => handleDownload(card.id)}
                disabled={isGen || generatingAll}
                style={{
                  width: '100%', padding: '11px',
                  background: isDone
                    ? 'rgba(16,185,129,0.1)'
                    : isGen
                      ? 'rgba(0,0,0,0.03)'
                      : 'rgba(30, 58, 95, 0.05)',
                  border: `1px solid ${isDone ? 'rgba(16,185,129,0.3)' : 'var(--cyber-border)'}`,
                  borderRadius: 10, fontFamily: 'inherit',
                  color: isDone ? '#10b981' : isGen ? '#64748b' : card.color,
                  fontSize: 12, fontWeight: 800, cursor: isGen || generatingAll ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s', letterSpacing: '0.04em',
                }}
              >
                {isDone ? (
                  <><CheckCircle size={15} /> Downloaded!</>
                ) : isGen ? (
                  <><Loader size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating PDF...</>
                ) : (
                  <><Download size={15} /> {t.btn_download_pdf}</>
                )}
              </button>

              {/* Generation indicator */}
              {isGen && (
                <div style={{
                  marginTop: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 4,
                  height: 3, overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', background: card.color,
                    animation: 'progress 2s linear infinite',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div style={{
        marginTop: 24, padding: '14px 18px', borderRadius: 12,
        background: 'rgba(30, 58, 95,0.03)', border: '1px solid var(--cyber-border)',
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <AlertCircle size={15} className="text-[var(--cyber-cyan)]" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-muted)' }}>PDF Generation Note:</strong>{' '}
          Reports are generated client-side using jsPDF loaded from CDN. An internet connection is required for the first download.
          All data comes from the KSP crime intelligence database (82,089 records). Reports are marked{' '}
          <strong style={{ color: 'var(--cyber-red)' }}>RESTRICTED</strong> and intended for official use only.
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 60%; }
          100% { width: 0%; transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
