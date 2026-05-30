'use client';

import { useState } from 'react';
import Topbar from '@/components/Topbar';
import { KARNATAKA_DISTRICTS, SUMMARY_METRICS, CRIME_CATEGORIES } from '@/lib/mockData';
import {
  FileText, Download, Printer, Calendar, ChevronRight,
  Shield, TrendingUp, Map, Network, Brain, BarChart2,
  CheckCircle, Clock, AlertTriangle, Activity
} from 'lucide-react';

const REPORT_TEMPLATES = [
  {
    id: 1,
    title: "Monthly Crime Intelligence Summary",
    description: "Comprehensive monthly report covering all districts, crime categories, trends, and AI-generated insights for operational briefing.",
    type: "Monthly",
    pages: 24,
    lastGenerated: "May 30, 2025 — 08:00 IST",
    status: "ready",
    icon: FileText,
    color: "#00f0ff",
    size: "4.2 MB",
  },
  {
    id: 2,
    title: "District Risk Assessment Report",
    description: "District-wise crime heatmap, risk indices, hotspot analysis, and patrol resource allocation recommendations.",
    type: "Fortnightly",
    pages: 18,
    lastGenerated: "May 28, 2025 — 18:30 IST",
    status: "ready",
    icon: Map,
    color: "#8b5cf6",
    size: "3.1 MB",
  },
  {
    id: 3,
    title: "Criminal Network Intelligence Brief",
    description: "Detailed analysis of identified criminal networks, suspect relationships, and organized crime syndicate activity across Karnataka.",
    type: "Weekly",
    pages: 12,
    lastGenerated: "May 26, 2025 — 14:15 IST",
    status: "ready",
    icon: Network,
    color: "#ef4444",
    size: "2.8 MB",
  },
  {
    id: 4,
    title: "AI Predictive Analytics Report",
    description: "Machine learning-based crime forecast for the next 90 days with confidence intervals and early warning indicators.",
    type: "Weekly",
    pages: 16,
    lastGenerated: "May 27, 2025 — 11:00 IST",
    status: "ready",
    icon: Brain,
    color: "#f59e0b",
    size: "3.6 MB",
  },
  {
    id: 5,
    title: "Cybercrime Special Investigation Report",
    description: "Detailed analysis of cybercrime operations in Bengaluru Urban, Mysuru, and Mangaluru with IMEI cluster profiles and suspect lists.",
    type: "Special",
    pages: 31,
    lastGenerated: "May 25, 2025 — 16:45 IST",
    status: "ready",
    icon: Shield,
    color: "#10b981",
    size: "5.7 MB",
  },
  {
    id: 6,
    title: "Narcotics Trafficking Network Report",
    description: "Inter-state drug trafficking route analysis, modus operandi profiles, key suspect network, and cross-border intelligence sharing summary.",
    type: "Special",
    pages: 27,
    lastGenerated: "May 24, 2025 — 09:30 IST",
    status: "ready",
    icon: AlertTriangle,
    color: "#e879f9",
    size: "4.9 MB",
  },
];

const STATUS_LOG = [
  { time: "10:23 AM", action: "Monthly Intelligence Summary generated", user: "SP Prakash Kumar", status: "success" },
  { time: "09:15 AM", action: "District Risk Assessment exported to PDF", user: "DSP Suresh Nair", status: "success" },
  { time: "08:45 AM", action: "Criminal Network Brief sent to SIT", user: "System", status: "success" },
  { time: "Yesterday", action: "Cybercrime Report scheduled for generation", user: "SP Prakash Kumar", status: "pending" },
  { time: "May 28", action: "Narcotics Report approved and distributed", user: "DGP Office", status: "success" },
];

function ReportCard({ report, onDownload }: { report: typeof REPORT_TEMPLATES[0], onDownload: (id: number) => void }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
      onDownload(report.id);
    }, 1800);
  };

  return (
    <div className="glass-card p-5 flex flex-col gap-4 hover:border-opacity-50 transition-all animate-fadeInUp"
      style={{ borderColor: `${report.color}22` }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${report.color}15`, border: `1px solid ${report.color}30` }}>
          <report.icon size={18} style={{ color: report.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{report.title}</h3>
            <span className="badge" style={{
              background: `${report.color}15`, color: report.color, border: `1px solid ${report.color}30`, fontSize: '10px'
            }}>{report.type}</span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>{report.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pages', value: report.pages },
          { label: 'Size', value: report.size },
          { label: 'Format', value: 'PDF' },
        ].map(item => (
          <div key={item.label} className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="text-sm font-bold" style={{ color: report.color }}>{item.value}</div>
            <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs" style={{ color: '#475569' }}>
        <Clock size={11} />
        <span>Last generated: {report.lastGenerated}</span>
        <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
        <span style={{ color: '#10b981' }}>Ready</span>
      </div>

      <div className="flex gap-2 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleDownload}
          disabled={generating}
          className="cyber-btn flex-1 justify-center"
          style={{
            background: done ? 'rgba(16,185,129,0.12)' : `${report.color}12`,
            color: done ? '#10b981' : report.color,
            border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : report.color + '30'}`,
            opacity: generating ? 0.7 : 1,
          }}>
          {generating ? (
            <>
              <Activity size={12} className="animate-spin" />
              GENERATING...
            </>
          ) : done ? (
            <>
              <CheckCircle size={12} />
              DOWNLOADED
            </>
          ) : (
            <>
              <Download size={12} />
              DOWNLOAD PDF
            </>
          )}
        </button>
        <button className="cyber-btn cyber-btn-cyan" style={{ padding: '10px 12px' }}>
          <Printer size={14} />
        </button>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [filter, setFilter] = useState('all');
  const [downloaded, setDownloaded] = useState<number[]>([]);

  const handleDownload = (id: number) => setDownloaded(prev => [...prev, id]);

  const filtered = filter === 'all' ? REPORT_TEMPLATES : REPORT_TEMPLATES.filter(r => r.type.toLowerCase() === filter);

  return (
    <div className="min-h-screen">
      <Topbar title="Reports" subtitle="Generate and export intelligence reports as PDF" />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Reports Available', value: REPORT_TEMPLATES.length, color: '#00f0ff', icon: FileText },
            { label: 'Generated Today', value: 3, color: '#10b981', icon: CheckCircle },
            { label: 'Pending Generation', value: 1, color: '#f59e0b', icon: Clock },
            { label: 'Downloaded This Month', value: 47, color: '#8b5cf6', icon: Download },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 flex items-center gap-3" style={{ borderColor: `${item.color}22` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs" style={{ color: '#475569' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Generate Custom Report Banner */}
        <div className="glass-card p-5 relative overflow-hidden" style={{ borderColor: 'rgba(139,92,246,0.25)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.05) 0%, transparent 60%)'
          }} />
          <div className="flex items-center gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <BarChart2 size={22} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>Generate Custom Intelligence Report</h2>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                Configure date ranges, select districts, crime categories, and AI analysis modules to generate a tailored intelligence report.
              </p>
            </div>
            <div className="flex gap-3">
              <select className="px-3 py-2 text-xs rounded-lg outline-none"
                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <option>Select District...</option>
                {KARNATAKA_DISTRICTS.slice(0, 8).map(d => <option key={d.id}>{d.name}</option>)}
              </select>
              <select className="px-3 py-2 text-xs rounded-lg outline-none"
                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <option>Date Range...</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Year 2025</option>
              </select>
              <button className="cyber-btn cyber-btn-purple">
                <FileText size={14} />
                GENERATE
              </button>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          {['all', 'monthly', 'weekly', 'fortnightly', 'special'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs py-1.5 px-3 rounded-lg capitalize transition-all"
              style={{
                background: filter === f ? 'rgba(0,240,255,0.1)' : 'rgba(15,23,42,0.4)',
                color: filter === f ? '#00f0ff' : '#475569',
                border: `1px solid ${filter === f ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              {f === 'all' ? 'All Reports' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-xs" style={{ color: '#475569' }}>{filtered.length} reports</span>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(report => (
            <ReportCard key={report.id} report={report} onDownload={handleDownload} />
          ))}
        </div>

        {/* Activity Log */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} style={{ color: '#00f0ff' }} />
            <h2 className="font-bold text-sm tracking-wide" style={{ color: '#e2e8f0' }}>REPORT ACTIVITY LOG</h2>
          </div>
          <div className="space-y-2">
            {STATUS_LOG.map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="text-xs font-mono w-20" style={{ color: '#475569' }}>{log.time}</div>
                <div className="flex-1 text-xs" style={{ color: '#94a3b8' }}>{log.action}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>{log.user}</div>
                <div className="w-1.5 h-1.5 rounded-full" style={{
                  background: log.status === 'success' ? '#10b981' : '#f59e0b',
                  boxShadow: `0 0 6px ${log.status === 'success' ? '#10b981' : '#f59e0b'}`,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
