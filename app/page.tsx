'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — Command Dashboard (8 Spec'd Blocks, Light Theme)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Shield, Activity, Users, FileText, MapPin, ChevronRight,
  Target, Bell, ShieldAlert, Sliders, Cpu, Search, RefreshCw, CheckCircle, Brain
} from 'lucide-react';
import {
  MONTHLY_CRIME_TRENDS, AI_ALERTS, FIR_RECORDS,
  COMMISSIONER_RECOMMENDATIONS
} from '@/lib/mockData';
import { SUMMARY_METRICS, CRIME_CATEGORIES, DISTRICTS } from '@/lib/crimeData';
import { usePresentation } from '@/components/PresentationContext';
import CountUp from '@/components/CountUp';
import Card from '@/components/Card';
import Table, { TableColumn } from '@/components/Table';

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
  if (severity === 'critical') return '#ef4444';
  if (severity === 'high') return '#f59e0b';
  if (severity === 'medium') return '#1976D2';
  return '#2E8B57';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Donut chart colors
  const COLORS = ['#1E3A5F', '#7C3AED', '#EC4899', '#EF4444', '#F97316', '#F59E0B', '#64748B'];

  // Top 4 High Risk Districts
  const highRiskDistricts = [...DISTRICTS]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  const firColumns: TableColumn<typeof FIR_RECORDS[0]>[] = [
    {
      header: 'FIR Number',
      accessor: (fir) => (
        <Link href={`/fir?id=${fir.id}`} className="text-[#1E3A5F] hover:underline font-mono font-bold text-[12px]">
          {fir.firNumber}
        </Link>
      ),
    },
    { header: 'District', accessor: 'district' },
    { header: 'Category', accessor: 'crimeCategory', style: { fontWeight: 600, color: '#1F2937' } },
    { header: 'Assigned Officer', accessor: 'assignedOfficer' },
    {
      header: 'Status',
      accessor: (fir) => (
        <span className={`badge-status ${statusBadgeClass(fir.investigationStatus)}`}>
          {fir.investigationStatus.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <span className="section-header-line" />
            <h1 className="section-title">Command Dashboard</h1>
          </div>
          <p className="page-subtitle" style={{ fontSize: '14px', color: '#475569', margin: '4px 0 0' }}>
            Real-time intelligence overview &amp; AI-assisted risk assessment across Karnataka State Police jurisdictions.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '6px 14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <RefreshCw size={12} style={{ animation: 'spin 4s linear infinite', color: '#1E3A5F' }} />
          <span style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>
            Live · Connected to State HQ
          </span>
        </div>
      </div>

      {/* ── BLOCK 1: OVERALL STATISTICS (Row 1) ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
        
        {/* Active Cases */}
        <Card variant="warning" style={{ display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Active Cases
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1F2937', marginTop: '6px', lineHeight: 1 }}>
                <CountUp end={SUMMARY_METRICS.activeCases} />
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: '#FFFBEB', border: '1px solid #FDE68A',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={18} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
            Cases under active KSP investigation
          </div>
        </Card>

        {/* Officers Deployed */}
        <Card variant="info" style={{ display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Officers Deployed
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1F2937', marginTop: '6px', lineHeight: 1 }}>
                <CountUp end={SUMMARY_METRICS.totalOfficers} />
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: '#E0F2FE', border: '1px solid #BAE6FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={18} color="#1E3A5F" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
            Active duty personnel across districts
          </div>
        </Card>

        {/* AI Accuracy */}
        <Card variant="success" style={{ display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
                AI Model Precision
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#1F2937', marginTop: '6px', lineHeight: 1 }}>
                <CountUp end={SUMMARY_METRICS.accuracyScore} decimals={1} suffix="%" />
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: '#D1FAE5', border: '1px solid #A7F3D0',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Target size={18} color="#2E8B57" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
            Confidence score on predictive grids
          </div>
        </Card>

        {/* State Threat Level */}
        <Card variant="danger" style={{ display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
                State Threat Rating
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444', marginTop: '6px', lineHeight: 1 }}>
                HIGH
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: '#FEE2E2', border: '1px solid #FCA5A5',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldAlert size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
            Statewide alert index status
          </div>
        </Card>

      </div>

      {/* ── BLOCK 2 & 3: CRIME TREND & CRIME DISTRIBUTION (Row 2 - 65/35 Split) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Block 2: Crime Trend (Area chart) */}
        <div className="glass-card col-span-12 lg:col-span-8" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>Crime Trend Analysis</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>LAST 18 MONTHS</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={MONTHLY_CRIME_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Area type="monotone" dataKey="crimes" name="Total Crimes" stroke="#1E3A5F" strokeWidth={2} fill="url(#dashboardTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/insights" className="text-[#1E3A5F] hover:underline flex items-center gap-1 text-[12px] font-bold">
              View Full Analytics <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Block 3: Crime Distribution (Pie chart) */}
        <div className="glass-card col-span-12 lg:col-span-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>Crime Category Share</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>DISTRIBUTION</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CRIME_CATEGORIES}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {CRIME_CATEGORIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => value?.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, maxHeight: 90, overflowY: 'auto' }}>
              {CRIME_CATEGORIES.map((cat, index) => (
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
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>Recent FIR Registry</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>KSP FILINGS</span>
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
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>Live Alerts Pipeline</h2>
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
                      {alert.severity}
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
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>High-Risk Districts</h2>
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
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937', margin: 0 }}>AI Recommendations</h2>
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>Cases / FIR Search</div>
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>AI Investigator Engine</div>
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
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1F2937' }}>Officer Deployment</div>
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
