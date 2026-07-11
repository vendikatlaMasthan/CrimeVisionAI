'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — Command Dashboard (8 Spec'd Blocks, Light Theme)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Activity, Users, FileText, MapPin, ChevronRight,
  Target, Bell, ShieldAlert, Sliders, Cpu, Search, RefreshCw, CheckCircle, Brain,
  Lock, Car
} from 'lucide-react';
import {
  MONTHLY_CRIME_TRENDS, AI_ALERTS, FIR_RECORDS,
  COMMISSIONER_RECOMMENDATIONS
} from '@/lib/mockData';
import { SUMMARY_METRICS, CRIME_CATEGORIES, DISTRICTS } from '@/lib/crimeData';
import { usePresentation } from '@/components/PresentationContext';
import { useLanguage } from '@/components/LanguageToggle';
import { TranslationSet } from '@/lib/translations';
import CountUp from '@/components/CountUp';
import Card from '@/components/Card';
import Table, { TableColumn } from '@/components/Table';
import StatCard from '@/components/StatCard';

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
      color: '#1F2937',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ color: '#1E3A5F', fontWeight: 700, marginBottom: 4, fontSize: '10px', letterSpacing: '0.08em' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: '#475569' }}>{p.name}</span>
          <span style={{ color: '#1F2937', fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────
function alertSeverityColor(severity: string) {
  if (severity === 'critical') return '#dc2626';
  if (severity === 'high') return '#dc2626';
  if (severity === 'medium') return '#f59e0b'; // Fixed: MEDIUM risk must render orange
  return '#16a34a';
}

function getAlertSeverityText(severity: string, t: any) {
  if (severity.toLowerCase() === 'critical') return t.priority_critical;
  if (severity.toLowerCase() === 'high') return t.priority_high;
  if (severity.toLowerCase() === 'medium') return t.priority_medium;
  if (severity.toLowerCase() === 'low') return t.priority_low;
  return severity;
}

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === 'investigating' || s === 'pending') return 'badge-status-pending';
  if (s === 'arrested' || s === 'resolved') return 'badge-status-approved';
  if (s === 'deployed') return 'badge-status-deployed';
  return 'badge-status-progress';
}

export default function DashboardPage() {
  const { isPresentationMode } = usePresentation();
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Donut chart colors
  const COLORS = ['#1E3A5F', '#7C3AED', '#EC4899', '#EF4444', '#F97316', '#F59E0B', '#64748B'];

  // Top 4 High Risk Districts
  const highRiskDistricts = [...DISTRICTS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  const translatedMonthlyTrends = useMemo(() => {
    return MONTHLY_CRIME_TRENDS.map(item => {
      const [m, y] = item.month.split(' ');
      const key = `month_${m.toLowerCase()}`;
      const translatedMonth = t[key as keyof TranslationSet] || m;
      return {
        ...item,
        month: `${translatedMonth} ${y}`,
      };
    });
  }, [t]);

  const translatedCrimeCategories = useMemo(() => {
    return CRIME_CATEGORIES.map(cat => {
      let key = 'crime_other';
      if (cat.name === 'Cybercrime') key = 'crime_cybercrime';
      else if (cat.name === 'Theft') key = 'crime_theft';
      else if (cat.name === 'Narcotics') key = 'crime_narcotics';
      else if (cat.name === 'Assault') key = 'crime_assault';
      else if (cat.name === 'Sand Mining') key = 'crime_sand_mining';
      else if (cat.name === 'Organized Crime') key = 'crime_organized';
      else if (cat.name === 'Other Offenses') key = 'crime_other';
      return {
        ...cat,
        name: t[key as keyof TranslationSet] || cat.name,
      };
    });
  }, [t]);

  const firColumns: TableColumn<typeof FIR_RECORDS[0]>[] = [
    {
      header: t.fir_number || 'FIR Number',
      accessor: (fir) => (
        <Link href={`/fir?id=${fir.id}`} className="text-[#1E3A5F] hover:underline font-mono font-bold text-[12px]">
          {fir.firNumber}
        </Link>
      ),
    },
    { header: t.district || 'District', accessor: 'district' },
    {
      header: t.top_crime || 'Category',
      accessor: (fir) => {
        let key = 'crime_other';
        if (fir.crimeCategory === 'Cybercrime') key = 'crime_cybercrime';
        else if (fir.crimeCategory === 'Theft') key = 'crime_theft';
        else if (fir.crimeCategory === 'Narcotics') key = 'crime_narcotics';
        else if (fir.crimeCategory === 'Assault') key = 'crime_assault';
        else if (fir.crimeCategory === 'Sand Mining') key = 'crime_sand_mining';
        else if (fir.crimeCategory === 'Organized Crime') key = 'crime_organized';
        else if (fir.crimeCategory === 'Other Offenses') key = 'crime_other';
        return <span style={{ fontWeight: 600, color: '#1F2937' }}>{t[key as keyof TranslationSet] || fir.crimeCategory}</span>;
      }
    },
    { header: t.officer || 'Assigned Officer', accessor: 'assignedOfficer' },
    {
      header: t.status || 'Status',
      accessor: (fir) => {
        let statusKey = 'status_investigating';
        const s = fir.investigationStatus.toLowerCase();
        if (s === 'investigating') statusKey = 'status_investigating';
        else if (s === 'arrested') statusKey = 'status_arrested';
        else if (s === 'resolved') statusKey = 'status_resolved';
        else if (s === 'chargesheet filed') statusKey = 'status_chargesheet';
        
        const translatedStatus = t[statusKey as keyof TranslationSet] || fir.investigationStatus;
        return (
          <span className={`badge-status ${statusBadgeClass(fir.investigationStatus)}`}>
            {translatedStatus.toUpperCase()}
          </span>
        );
      },
    },
  ];

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <span className="section-header-line" />
            <h1 className="section-title">{t.page_dashboard || 'Command Dashboard'}</h1>
          </div>
          <p className="page-subtitle" style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0' }}>
            {t.sub_dashboard || 'Karnataka State Police — Real-Time Intelligence Overview'}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '6px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <RefreshCw size={12} style={{ animation: 'spin 4s linear infinite', color: '#1E3A5F' }} />
          <span style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>
            {t.dashboard_realtime_connected || 'Live · Connected to State HQ'}
          </span>
        </div>
      </div>

      {/* ── BLOCK 1: OVERALL STATISTICS (Row 1) ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]" style={{ marginBottom: '24px' }}>
        <StatCard
          label={t.stat_active_cases || 'Active Investigations'}
          value={<CountUp end={SUMMARY_METRICS.activeCases} />}
          icon={<Activity size={20} strokeWidth={1.75} color="var(--color-orange)" />}
          description={t.dashboard_cases_description || 'Cases under active KSP investigation'}
        />
        <StatCard
          label={t.stat_total_officers || 'Total Officers'}
          value={<CountUp end={SUMMARY_METRICS.totalOfficers} />}
          icon={<Users size={20} strokeWidth={1.75} color="var(--color-navy)" />}
          description={t.dashboard_officers_description || 'Active duty personnel across districts'}
        />
        <StatCard
          label={t.stat_accuracy || 'AI Accuracy'}
          value={<CountUp end={SUMMARY_METRICS.accuracyScore} decimals={1} suffix="%" />}
          icon={<Target size={20} strokeWidth={1.75} color="var(--color-green)" />}
          description={t.dashboard_accuracy_description || 'Confidence score on predictive grids'}
        />
        <StatCard
          label={t.state_threat || 'STATE THREAT LEVEL'}
          value={t.priority_high?.toUpperCase() || 'HIGH'}
          icon={<ShieldAlert size={20} strokeWidth={1.75} color="var(--color-red)" />}
          description={t.dashboard_threat_description || 'Statewide alert index status'}
          style={{ borderLeft: '4px solid var(--color-red)' }}
        />
      </div>

      {/* ── PROACTIVE POLICING CALLOUT: RECOMMENDED ACTIONS ───────────────── */}
      <div className="glass-card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 'var(--radius, 16px)', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Brain size={20} color="var(--color-navy)" />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Proactive Deployment Suggestions / Recommended Actions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.04)', border: '1.5px solid rgba(245, 158, 11, 0.15)', display: 'flex', gap: '12px', minHeight: '100px' }}>
            <ShieldAlert size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>Increase patrol in Kalaburagi, 10 PM – 2 AM</div>
              <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.4 }}>Based on a detected Narcotics hotspot trend (+34% vs. 90-day average).</p>
            </div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.04)', border: '1.5px solid rgba(245, 158, 11, 0.15)', display: 'flex', gap: '12px', minHeight: '100px' }}>
            <Activity size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>Audit payment gateways in Bengaluru Urban</div>
              <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.4 }}>Based on a detected Cybercrime/OTP Phishing spike (+243% vs. 90-day average).</p>
            </div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.04)', border: '1.5px solid rgba(220, 38, 38, 0.15)', display: 'flex', gap: '12px', minHeight: '100px' }}>
            <Lock size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#b91c1c', marginBottom: '4px' }}>Reinforce checkposts in Ballari town perimeter</div>
              <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.4 }}>Based on a detected Organized Crime spike (+500% vs. 90-day average).</p>
            </div>
          </div>
          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.04)', border: '1.5px solid rgba(245, 158, 11, 0.15)', display: 'flex', gap: '12px', minHeight: '100px' }}>
            <Car size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', marginBottom: '4px' }}>Deploy auto-theft decoy units in Mysuru</div>
              <p style={{ fontSize: '11px', color: '#475569', margin: 0, lineHeight: 1.4 }}>Based on a detected relay-attack vehicle theft surge near college zones.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BLOCK 2 & 3: CRIME TREND & CRIME DISTRIBUTION (Row 2 - 65/35 Split) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Block 2: Crime Trend (Area chart) */}
        <div className="glass-card col-span-12 lg:col-span-8" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>{t.dashboard_trend_analysis || 'Crime Trend Analysis'}</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>LAST 18 MONTHS</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={translatedMonthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="crimes" name={t.stat_total_crimes || 'Total Crimes'} stroke="#1E3A5F" strokeWidth={2} fill="url(#dashboardTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/insights" className="text-[#1E3A5F] hover:underline flex items-center gap-1 text-[12px] font-bold">
              {t.dashboard_view_all || 'View Full Analytics'} <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Block 3: Crime Distribution (Pie chart) */}
        <div className="glass-card col-span-12 lg:col-span-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>{t.dashboard_category_share || 'Crime Category Share'}</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>DISTRIBUTION</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={translatedCrimeCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {translatedCrimeCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => value?.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, maxHeight: 90, overflowY: 'auto' }}>
              {translatedCrimeCategories.map((cat, index) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                    <span style={{ color: '#1F2937', fontWeight: 600 }}>{cat.name}</span>
                  </div>
                  <span style={{ color: '#475569' }}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── BLOCK 4 & 5: RECENT FIRS & LIVE ALERTS (Row 3 - 65/35 Split) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Block 4: Recent FIRs */}
        <div className="glass-card col-span-12 lg:col-span-8" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>{t.dashboard_recent_registry || 'Recent FIR Registry'}</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>{t.dashboard_ksp_filings || 'KSP FILINGS'}</span>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <Table
                columns={firColumns}
                data={FIR_RECORDS.slice(0, 5)}
                keyExtractor={(fir) => fir.id.toString()}
                hoverable={true}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/fir" className="text-[#1E3A5F] hover:underline flex items-center gap-1 text-[12px] font-bold">
              Open FIR Registry <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Block 5: Live Alerts */}
        <div className="glass-card col-span-12 lg:col-span-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>{t.dashboard_alerts_pipeline || 'Live Alerts Pipeline'}</h2>
              <span className="badge-alert-count">4 ACTIVE</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '235px', overflowY: 'auto' }}>
              {AI_ALERTS.slice(0, 4).map((alert) => (
                <div key={alert.id} style={{
                  background: '#F9FAFB', border: '1px solid #E5E7EB', borderLeft: `4px solid ${alertSeverityColor(alert.severity)}`,
                  borderRadius: '0 8px 8px 0', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
                      background: '#FFFFFF', color: alertSeverityColor(alert.severity),
                      border: `1px solid ${alertSeverityColor(alert.severity)}30`, textTransform: 'uppercase'
                    }}>
                      {getAlertSeverityText(alert.severity, t)}
                    </span>
                    <span style={{ fontSize: '10px', color: '#475569' }}>{alert.timestamp} · {alert.affectedDistricts?.[0] || ''}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>{alert.title}</div>
                  <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {alert.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/alerts" className="text-[#1E3A5F] hover:underline flex items-center gap-1 text-[12px] font-bold">
              View All Alerts <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* ── ROW 4: HIGH-RISK AREAS, AI RECOMMENDATIONS, QUICK ACTIONS (Three-column equal width layout) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>

        {/* Block 6: High-Risk Areas */}
        <div className="glass-card col-span-12 lg:col-span-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>{t.dashboard_threat_index || 'High-Risk Districts'}</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>ANALYTICS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {highRiskDistricts.map((d, index) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F' }}>#{index + 1}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{d.name}</div>
                      <div style={{ fontSize: 10, color: '#475569' }}>Top: {d.topCrimeType}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: d.riskScore > 80 ? '#ef4444' : '#f59e0b' }}>{d.riskScore}</span>
                    <div style={{ fontSize: 8, color: '#6B7280', textTransform: 'uppercase' }}>Risk index</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/heatmap" className="text-[#1E3A5F] hover:underline flex items-center gap-1 text-[12px] font-bold">
              View Crime Map <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Block 7: AI Recommendations */}
        <div className="glass-card col-span-12 lg:col-span-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>{t.dashboard_ai_recommendations || 'AI Recommendations'}</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>COGNITIVE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 180, overflowY: 'auto' }}>
              {COMMISSIONER_RECOMMENDATIONS.slice(0, 3).map((rec, i) => (
                <div key={i} style={{ padding: 10, borderRadius: 8, background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Brain size={12} color="#7C3AED" />
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase' }}>PRIORITY {rec.priority}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1F2937', lineHeight: 1.3 }}>{rec.action}</div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{rec.rationale} · <span style={{ fontWeight: 600 }}>{rec.urgency}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/investigator" className="text-[#1E3A5F] hover:underline flex items-center gap-1 text-[12px] font-bold">
              Run investigator AI <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Block 8: Quick Actions */}
        <div className="glass-card col-span-12 lg:col-span-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>Quick Actions</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* New Case Search */}
              <Link href="/fir" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px', background: '#E0F2FE',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Search size={14} color="#1E3A5F" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{t.nav_case_search || 'Cases / FIR Search'}</div>
                  </div>
                </div>
              </Link>

              {/* Run AI Investigator */}
              <Link href="/investigator" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px', background: '#D1FAE5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Cpu size={14} color="#2E8B57" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{t.nav_ai_investigator || 'AI Investigator Engine'}</div>
                  </div>
                </div>
              </Link>

              {/* Deploy Resources */}
              <Link href="/resources" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px', background: '#FFFBEB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Sliders size={14} color="#D97706" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>{t.nav_resource_allocation || 'Officer Deployment'}</div>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>

      </div>

      <style>{`
        .badge-alert-count {
          background: #FEE2E2;
          color: #ef4444;
          border: 1px solid #FCA5A5;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 20px;
          padding: 4px 10px;
        }

        .quick-action-card:hover {
          border-color: #1E3A5F !important;
          transform: translateY(-1px);
        }

        .badge-status {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 20px;
          padding: 3px 8px;
          display: inline-block;
        }

        .badge-status-pending {
          border: 1px solid #f59e0b;
          color: #f59e0b;
        }

        .badge-status-approved {
          border: 1px solid #2E8B57;
          color: #2E8B57;
        }

        .badge-status-deployed {
          border: 1px solid #0F6B5C;
          color: #0F6B5C;
        }

        .badge-status-progress {
          border: 1px solid #1976D2;
          color: #1976D2;
        }
      `}</style>
    </div>
  );
}
