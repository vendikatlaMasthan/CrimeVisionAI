'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  Shield, Activity, Users, FileText, MapPin, ChevronRight,
  Target, Bell, ShieldAlert, Sliders, Cpu, Search, RefreshCw
} from 'lucide-react';
import {
  MONTHLY_CRIME_TRENDS, AI_ALERTS, FIR_RECORDS,
  COMMISSIONER_RECOMMENDATIONS
} from '@/lib/mockData';
import { SUMMARY_METRICS } from '@/lib/crimeData';
import { usePresentation } from '@/components/PresentationContext';
import CountUp from '@/components/CountUp';

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '12px',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: 4, fontSize: '10px', letterSpacing: '0.08em' }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────
function alertSeverityColor(severity: string) {
  if (severity === 'critical') return 'var(--priority-critical)';
  if (severity === 'high') return 'var(--priority-high)';
  if (severity === 'medium') return 'var(--priority-medium)';
  return 'var(--priority-low)';
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

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', background: 'transparent' }}>

      {/* ── PAGE HEADER ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Command Dashboard
          </h1>
          <p className="page-subtitle" style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Real-time overview across Karnataka
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--border-subtle)', border: '1px solid var(--border-default)', borderRadius: '20px', padding: '6px 14px' }}>
          <RefreshCw size={12} className="spinner text-[var(--accent-cyan)]" />
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600 }}>
            Live · Updated 2 min ago
          </span>
        </div>
      </div>

      {/* ── BLOCK 1: OVERALL STATISTICS (Row 1) ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
        
        {/* Active Cases */}
        <div className="glass-card stat-card-hover" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between', transition: 'all 200ms ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Active Cases
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px', lineHeight: 1 }}>
                <CountUp end={SUMMARY_METRICS.activeCases} />
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Activity size={18} color="var(--priority-high)" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '8px' }}>
            Total cases under active investigation
          </div>
        </div>

        {/* Officers Deployed */}
        <div className="glass-card stat-card-hover" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between', transition: 'all 200ms ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Officers Deployed
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px', lineHeight: 1 }}>
                <CountUp end={SUMMARY_METRICS.totalOfficers} />
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Users size={18} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '8px' }}>
            Officers active across 31 districts
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="glass-card stat-card-hover" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between', transition: 'all 200ms ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                AI Accuracy
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px', lineHeight: 1 }}>
                <CountUp end={SUMMARY_METRICS.accuracyScore} decimals={1} suffix="%" />
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(0, 200, 81, 0.1)', border: '1px solid rgba(0, 200, 81, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Target size={18} color="var(--priority-low)" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '8px' }}>
            System calibrated prediction confidence
          </div>
        </div>

        {/* State Threat Level */}
        <div className="glass-card stat-card-hover" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', minHeight: '140px', justifyContent: 'space-between', transition: 'all 200ms ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                State Threat Level
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--priority-critical)', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px', lineHeight: 1 }}>
                HIGH
              </div>
            </div>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'rgba(255, 59, 59, 0.1)', border: '1px solid rgba(255, 59, 59, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShieldAlert size={18} color="var(--priority-critical)" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '8px' }}>
            Calculated statewide threat rating
          </div>
        </div>

      </div>

      {/* ── BLOCK 2: CRIME TREND & LIVE ALERTS (Row 2 - 60/40 Split) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px', marginBottom: '24px' }}>
        
        {/* Crime Trend (60% width = col-span-7) */}
        <div className="glass-card col-span-12 lg:col-span-7" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Crime Trend</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>LAST 18 MONTHS</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={MONTHLY_CRIME_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="crimes" name="Total Crimes" stroke="var(--accent-cyan)" strokeWidth={2} fill="url(#dashboardTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/insights" className="text-[var(--accent-cyan)] hover:underline flex items-center gap-1 text-[12px] font-bold">
              View Full Analytics <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Alerts (40% width = col-span-5) */}
        <div className="glass-card col-span-12 lg:col-span-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Live Alerts</h2>
              <span className="badge-alert-count">4 ACTIVE</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '235px', overflowY: 'auto' }}>
              {AI_ALERTS.slice(0, 4).map((alert) => (
                <div key={alert.id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `4px solid ${alertSeverityColor(alert.severity)}`,
                  borderRadius: '0 8px 8px 0', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
                      background: `${alertSeverityColor(alert.severity)}15`, color: alertSeverityColor(alert.severity),
                      border: `1px solid ${alertSeverityColor(alert.severity)}30`, textTransform: 'uppercase'
                    }}>
                      {alert.severity}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{alert.timestamp} · {alert.affectedDistricts?.[0] || ''}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {alert.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/alerts" className="text-[var(--accent-cyan)] hover:underline flex items-center gap-1 text-[12px] font-bold">
              View All Alerts <ChevronRight size={14} />
            </Link>
          </div>
        </div>

      </div>

      {/* ── BLOCK 3: RECENT INVESTIGATIONS & QUICK ACTIONS (Row 3 - 60/40 Split) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }}>
        
        {/* Recent Investigations (60% width = col-span-7) */}
        <div className="glass-card col-span-12 lg:col-span-7" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Recent Investigations</h2>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>KSP REGISTRY</span>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>FIR Number</th>
                    <th>District</th>
                    <th>Category</th>
                    <th>Assigned Officer</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {FIR_RECORDS.slice(0, 5).map((fir) => (
                    <tr key={fir.id}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700 }}>
                        <Link href={`/fir?id=${fir.id}`} className="text-[var(--accent-cyan)] hover:underline">
                          {fir.firNumber}
                        </Link>
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{fir.district}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{fir.crimeCategory}</td>
                      <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{fir.assignedOfficer}</td>
                      <td>
                        <span className={`badge-status ${statusBadgeClass(fir.investigationStatus)}`}>
                          {fir.investigationStatus.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '12px' }}>
            <Link href="/reports" className="text-[var(--accent-cyan)] hover:underline flex items-center gap-1 text-[12px] font-bold">
              View All Reports <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Quick Actions (40% width = col-span-5) */}
        <div className="glass-card col-span-12 lg:col-span-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Quick Actions</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* New FIR Search */}
              <Link href="/search" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(0, 212, 255, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Search size={16} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>New FIR Search</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Query statewide records database</div>
                  </div>
                </div>
              </Link>

              {/* Run AI Investigator */}
              <Link href="/ai-investigator" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(0, 200, 81, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Cpu size={16} color="var(--priority-low)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Run AI Investigator</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Execute pattern matching copilot</div>
                  </div>
                </div>
              </Link>

              {/* Deploy Resources */}
              <Link href="/resources" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Sliders size={16} color="var(--priority-high)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Deploy Resources</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reallocate personnel allocations</div>
                  </div>
                </div>
              </Link>

              {/* Generate Report */}
              <Link href="/reports" style={{ textDecoration: 'none' }}>
                <div className="quick-action-card" style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: '8px', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'all 200ms ease'
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FileText size={16} color="var(--priority-medium)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Generate Report</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Download restricted briefing dossier</div>
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </div>

      </div>

      <style>{`
        .badge-alert-count {
          background: rgba(255, 59, 59, 0.15);
          color: var(--priority-critical);
          border: 1px solid rgba(255, 59, 59, 0.35);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border-radius: 20px;
          padding: 4px 10px;
        }

        .stat-card-hover:hover {
          border-color: var(--accent-cyan-border) !important;
          transform: translateY(-2px);
        }

        .quick-action-card:hover {
          border-color: var(--accent-cyan) !important;
          transform: translateY(-2px);
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
          border: 1px solid var(--status-pending);
          color: var(--status-pending);
        }

        .badge-status-approved {
          border: 1px solid var(--status-approved);
          color: var(--status-approved);
        }

        .badge-status-deployed {
          border: 1px solid var(--status-deployed);
          color: var(--status-deployed);
        }

        .badge-status-progress {
          border: 1px solid var(--status-progress);
          color: var(--status-progress);
        }
      `}</style>
    </div>
  );
}
