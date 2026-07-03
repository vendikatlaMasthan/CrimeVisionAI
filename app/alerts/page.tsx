'use client';

import { useState, useEffect } from 'react';
import {
  Bell, AlertTriangle, Shield, CheckCircle, Radio, Zap,
  ChevronRight, Clock, MapPin, X, RefreshCw, Send,
  Users, Phone, Eye, Activity, Filter, Trash2, ArrowUpRight, UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { LIVE_ALERTS, FIR_RECORDS, CRIMINAL_PROFILES } from '@/lib/mockData';

type Severity = 'all' | 'critical' | 'high' | 'medium' | 'low';
type Category = 'all' | 'Cybercrime' | 'Financial Crime' | 'Gang Activity' | 'Drug Related' | 'Fraud' | 'Organized Crime';

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

const SEVERITY_BORDER: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#eab308',
  low: '#0F6B5C',
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'badge badge-red',
  high: 'badge badge-amber',
  medium: 'badge',
  low: 'badge badge-cyan',
};

const CATEGORY_BADGE: Record<string, string> = {
  'Cybercrime': 'badge badge-cyan',
  'Financial Crime': 'badge badge-green',
  'Gang Activity': 'badge badge-red',
  'Drug Related': 'badge badge-purple',
  'Fraud': 'badge badge-amber',
  'Organized Crime': 'badge badge-orange',
};

const RESPONSE_TEAMS = [
  { name: 'Cyber Crime Cell Alpha', district: 'Bengaluru Urban', status: 'En Route', statusColor: '#f59e0b', members: 8 },
  { name: 'SIT Team Bravo', district: 'Ballari', status: 'On Scene', statusColor: '#10b981', members: 15 },
  { name: 'Narcotics Task Force', district: 'Belagavi', status: 'Standby', statusColor: '#64748b', members: 12 },
  { name: 'River Police Unit', district: 'Raichur', status: 'Deployed', statusColor: '#10b981', members: 6 },
];

const QUICK_ACTIONS = [
  { label: 'Emergency Broadcast', icon: Radio, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  { label: 'Dispatch Nearest Unit', icon: Send, color: '#0F6B5C', bg: 'rgba(30, 58, 95,0.08)', border: 'rgba(30, 58, 95,0.25)' },
  { label: 'Request Backup', icon: Users, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)' },
  { label: 'Alert Commissioner', icon: Phone, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
];

// Build ticker text from alerts
const tickerItems = LIVE_ALERTS.map(a => {
  const emoji = a.severity === 'critical' ? '🔴' : a.severity === 'high' ? '🟠' : a.severity === 'medium' ? '🟡' : '🔵';
  return `${emoji} ${a.severity.toUpperCase()}: ${a.title} — ${a.district}`;
});
const TICKER_TEXT = tickerItems.join('    ·    ') + '    ·    ' + tickerItems.join('    ·    ');

const categoryStats = [
  { name: 'Cybercrime', count: 3, color: '#0F6B5C' },
  { name: 'Financial Crime', count: 2, color: '#10b981' },
  { name: 'Gang Activity', count: 1, color: '#ef4444' },
  { name: 'Drug Related', count: 2, color: '#8b5cf6' },
  { name: 'Fraud', count: 2, color: '#f59e0b' },
];

export default function AlertsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [acknowledged, setAcknowledged] = useState<Set<string>>(
    new Set(LIVE_ALERTS.filter(a => a.acknowledged).map(a => a.id))
  );
  const [dispatched, setDispatched] = useState<Set<string>>(new Set());
  const [escalated, setEscalated] = useState<Set<string>>(new Set());
  const [closedAlerts, setClosedAlerts] = useState<Set<string>>(new Set());
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [assignedOfficers, setAssignedOfficers] = useState<Record<string, string>>({});
  
  const KSP_OFFICERS = ["Inspector Girish", "Inspector Shanthakumar", "Inspector Anupama", "Inspector Venkatesh"];

  useEffect(() => {
    const updateTime = () => {
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = LIVE_ALERTS.filter(a => !closedAlerts.has(a.id));

  // Compute severity of alerts dynamically (in case of escalations)
  const getAlertSeverity = (alertId: string, baseSeverity: string): string => {
    return escalated.has(alertId) ? 'critical' : baseSeverity;
  };

  const filteredAlerts = activeAlerts
    .filter(a => {
      const currentSev = getAlertSeverity(a.id, a.severity);
      return selectedSeverity === 'all' || currentSev === selectedSeverity;
    })
    .filter(a => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'Gang Activity') return a.category === 'Gang Activity';
      return a.category === selectedCategory;
    })
    .sort((a, b) => {
      const sevA = getAlertSeverity(a.id, a.severity);
      const sevB = getAlertSeverity(b.id, b.severity);
      return (SEVERITY_ORDER[sevA] ?? 9) - (SEVERITY_ORDER[sevB] ?? 9);
    });

  const criticalCount = activeAlerts.filter(a => getAlertSeverity(a.id, a.severity) === 'critical').length;
  const highCount = activeAlerts.filter(a => getAlertSeverity(a.id, a.severity) === 'high').length;
  const underResponse = dispatched.size + 5;

  const handleAcknowledge = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAcknowledged(prev => { const s = new Set(prev); s.add(id); return s; });
  };

  const handleDispatch = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDispatched(prev => { const s = new Set(prev); s.add(id); return s; });
  };

  const handleEscalate = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEscalated(prev => { const s = new Set(prev); s.add(id); return s; });
  };

  const handleCloseAlert = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setClosedAlerts(prev => { const s = new Set(prev); s.add(id); return s; });
    if (selectedAlertId === id) {
      setSelectedAlertId(null);
    }
  };

  // Find selected alert details
  const selectedAlert = activeAlerts.find(a => a.id === selectedAlertId);

  // Compute related cases & suspects inside drawer
  const drawerInfo = selectedAlert ? (() => {
    const relatedFirs = FIR_RECORDS.filter(f => f.district === selectedAlert.district).slice(0, 2);
    const relatedSuspects = relatedFirs.map(f => f.suspectDetails.name);
    
    // Add default if empty
    if (relatedFirs.length === 0) {
      const defaultSuspect = CRIMINAL_PROFILES.find(c => c.district === selectedAlert.district) || CRIMINAL_PROFILES[0];
      relatedSuspects.push(defaultSuspect.name);
    }

    return {
      firs: relatedFirs,
      suspects: relatedSuspects,
      officer: "Inspector Girish",
    };
  })() : null;

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, position: 'relative',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bell size={22} color="#ef4444" />
          <div style={{
            position: 'absolute', top: -3, right: -3,
            width: 12, height: 12, borderRadius: '50%',
            background: '#ef4444', border: '2px solid #020617',
            animation: 'pulse-red 1.5s ease-in-out infinite',
          }} />
        </div>
        <div>
          <h1 className="page-title">Live Alert Command Center</h1>
          <p className="page-subtitle">Real-time intelligence alerts — Karnataka State Police</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="status-dot-red" />
          <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>LIVE</span>
          <span style={{ color: '#64748b', fontSize: 11 }}>Updated: {lastUpdated}</span>
        </div>
      </div>

      {/* ALERT TICKER */}
      <div className="ticker-bar" style={{ marginBottom: 22, borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            flexShrink: 0, background: 'rgba(239,68,68,0.9)', color: '#fff',
            padding: '4px 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
            marginRight: 12, borderRadius: '0 6px 6px 0',
          }}>
            ⚡ LIVE ALERTS
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div
              className="ticker-content animate-ticker"
              style={{ fontSize: 12, color: '#fca5a5', fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {TICKER_TEXT}
            </div>
          </div>
        </div>
      </div>

      {/* ALERT STATS ROW */}
      <div className="responsive-grid-4" style={{ marginBottom: 22 }}>
        {[
          { label: 'Critical Alerts', value: criticalCount, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', pulse: true, icon: AlertTriangle },
          { label: 'High Priority', value: highCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', pulse: false, icon: Shield },
          { label: 'Under Response', value: underResponse, color: '#0F6B5C', bg: 'rgba(30, 58, 95,0.06)', border: 'rgba(30, 58, 95,0.2)', pulse: false, icon: Activity },
          { label: 'Resolved Today', value: 47, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', pulse: false, icon: CheckCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card" style={{
              padding: '18px 20px', background: s.bg, border: `1px solid ${s.border}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: `${s.color}1a`, border: `1px solid ${s.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...(s.pulse ? { animation: 'pulse-red 2s ease-in-out infinite' } : {}),
              }}>
                <Icon size={20} color={s.color} />
              </div>
              <div>
                <div className="metric-value" style={{ color: s.color, fontSize: '1.9rem' }}>{s.value}</div>
                <div className="metric-label" style={{ fontSize: 11 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FILTER BAR */}
      <div style={{ marginBottom: 18 }}>
        {/* SEVERITY FILTER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Filter size={13} color="#64748b" />
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
            Severity:
          </span>
          {(['all', 'critical', 'high', 'medium', 'low'] as Severity[]).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em',
                border: `1px solid ${selectedSeverity === sev
                  ? sev === 'all' ? 'rgba(30, 58, 95,0.5)' : sev === 'critical' ? 'rgba(239,68,68,0.6)' : sev === 'high' ? 'rgba(245,158,11,0.6)' : sev === 'medium' ? 'rgba(234,179,8,0.5)' : 'rgba(30, 58, 95,0.4)'
                  : 'rgba(255,255,255,0.1)'}`,
                background: selectedSeverity === sev
                  ? sev === 'all' ? 'rgba(30, 58, 95,0.12)' : sev === 'critical' ? 'rgba(239,68,68,0.18)' : sev === 'high' ? 'rgba(245,158,11,0.15)' : sev === 'medium' ? 'rgba(234,179,8,0.15)' : 'rgba(30, 58, 95,0.1)'
                  : 'rgba(255,255,255,0.04)',
                color: selectedSeverity === sev
                  ? sev === 'critical' ? '#f87171' : sev === 'high' ? '#fbbf24' : sev === 'medium' ? '#facc15' : '#0F6B5C'
                  : '#64748b',
              }}
            >
              {sev === 'all' ? 'All' : sev}
            </button>
          ))}
        </div>
        {/* CATEGORY FILTER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
            Category:
          </span>
          {(['all', 'Cybercrime', 'Financial Crime', 'Gang Activity', 'Drug Related', 'Fraud'] as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                border: `1px solid ${selectedCategory === cat ? 'rgba(30, 58, 95,0.4)' : 'rgba(255,255,255,0.08)'}`,
                background: selectedCategory === cat ? 'rgba(30, 58, 95,0.1)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? '#0F6B5C' : '#64748b',
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT: ALERT FEED + COMMAND PANEL */}
      <div className="responsive-grid-1-340">
        
        {/* LEFT: ALERT FEED */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div className="section-header-line" />
            <span className="section-title">Alert Feed</span>
            <span className="badge badge-red" style={{ marginLeft: 4 }}>{filteredAlerts.length} alerts</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredAlerts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <div style={{ fontSize: 14 }}>No alerts match the selected filters</div>
              </div>
            )}
            {filteredAlerts.map((alert) => {
              const severityVal = getAlertSeverity(alert.id, alert.severity);
              const isAcked = acknowledged.has(alert.id);
              const isDispatched = dispatched.has(alert.id);
              const isEscalated = escalated.has(alert.id);
              const isCritical = severityVal === 'critical';
              const borderColor = SEVERITY_BORDER[severityVal] ?? '#64748b';

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={`alert-card cursor-pointer hover:-translate-y-0.5 transition-all ${isCritical ? 'animate-alert-flash' : ''}`}
                  style={{
                    borderLeftColor: borderColor,
                    background: isCritical ? '#FEF2F2' : '#FFFFFF',
                    border: `1px solid ${isCritical ? 'rgba(239,68,68,0.3)' : 'rgba(30, 58, 95,0.1)'}`,
                    borderLeftWidth: 3,
                    borderLeftStyle: 'solid',
                    borderRadius: '0 12px 12px 0',
                    padding: '16px 18px',
                  }}
                >
                  {/* TOP ROW */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className={SEVERITY_BADGE[severityVal]} style={
                      severityVal === 'medium'
                        ? { background: 'rgba(234,179,8,0.15)', color: '#facc15', border: '1px solid rgba(234,179,8,0.35)' }
                        : {}
                    }>
                      {severityVal.toUpperCase()}
                    </span>
                    <span className={CATEGORY_BADGE[alert.category] || 'badge badge-gray'} style={{ fontSize: 10 }}>
                      {alert.category}
                    </span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {alert.timestamp}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={11} /> {alert.district}
                    </span>
                    {isAcked && (
                      <span className="badge badge-green" style={{ fontSize: 10 }}>
                        <CheckCircle size={10} style={{ marginRight: 3 }} /> ACK
                      </span>
                    )}
                    {assignedOfficers[alert.id] && (
                      <span className="badge badge-cyan" style={{ fontSize: 10 }}>
                        <UserCheck size={10} style={{ marginRight: 3 }} /> {assignedOfficers[alert.id]}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 6, lineHeight: 1.4 }} className="flex justify-between items-center">
                    <span>{alert.title}</span>
                    <ArrowUpRight size={14} className="text-slate-500 hover:text-white" />
                  </div>

                  {/* DESCRIPTION */}
                  <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.55, marginBottom: 8 }}>
                    {alert.description}
                  </p>

                  {/* EVIDENCE */}
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    fontSize: 11, color: '#94a3b8',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '6px 10px',
                    marginBottom: 12,
                  }}>
                    <Eye size={11} color="#64748b" />
                    <span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
                      Evidence:
                    </span>
                    <span>{alert.evidence}</span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="cyber-btn cyber-btn-red"
                      style={{ fontSize: 11, padding: '7px 14px' }}
                      onClick={(e) => handleDispatch(alert.id, e)}
                      disabled={isDispatched}
                    >
                      <Send size={11} /> {isDispatched ? 'Dispatched ✓' : 'Dispatch'}
                    </button>
                    <button
                      className="cyber-btn cyber-btn-amber"
                      style={{ fontSize: 11, padding: '7px 14px' }}
                      onClick={(e) => handleAcknowledge(alert.id, e)}
                      disabled={isAcked}
                    >
                      <CheckCircle size={11} /> {isAcked ? 'Acknowledged ✓' : 'Acknowledge'}
                    </button>
                    <button
                      className="cyber-btn cyber-btn-purple"
                      style={{ fontSize: 11, padding: '7px 14px' }}
                      onClick={(e) => handleEscalate(alert.id, e)}
                      disabled={isEscalated}
                    >
                      <ChevronRight size={11} /> {isEscalated ? 'Escalated ✓' : 'Escalate'}
                    </button>
                    <button
                      className="cyber-btn"
                      style={{ fontSize: 11, padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onClick={(e) => handleCloseAlert(alert.id, e)}
                    >
                      <Trash2 size={11} /> Resolve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: COMMAND PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* ACTIVE DEPLOYMENTS */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Users size={14} color="#0F6B5C" />
              <span className="section-title" style={{ fontSize: 13 }}>Active Deployments</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RESPONSE_TEAMS.map((team) => (
                <div key={team.name} style={{
                  padding: '10px 12px', borderRadius: 8,
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{team.name}</div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                      background: `${team.statusColor}20`, color: team.statusColor,
                      border: `1px solid ${team.statusColor}40`,
                    }}>
                      {team.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 10 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={10} /> {team.district}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={10} /> {team.members} officers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Zap size={14} color="#f59e0b" />
              <span className="section-title" style={{ fontSize: 13 }}>Quick Actions</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    style={{
                      padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                      background: action.bg, border: `1px solid ${action.border}`,
                      color: action.color, fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={13} /> {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ALERT STATISTICS BY CATEGORY */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Activity size={14} color="#8b5cf6" />
              <span className="section-title" style={{ fontSize: 13 }}>Alerts by Category</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categoryStats.map((cat) => {
                const maxCount = Math.max(...categoryStats.map(c => c.count));
                const pct = (cat.count / maxCount) * 100;
                return (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.count}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})`,
                        transition: 'width 1s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LAST UPDATED */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
            borderRadius: 10, background: 'rgba(30, 58, 95,0.04)', border: '1px solid rgba(30, 58, 95,0.1)',
          }}>
            <RefreshCw size={12} color="#0F6B5C" style={{ animation: 'spin-slow 4s linear infinite' }} />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              Live feed · Last sync: <span style={{ color: '#0F6B5C', fontWeight: 700 }}>{lastUpdated}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ALERT DETAILS SLIDE-OVER DRAWER */}
      {selectedAlert && drawerInfo && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="absolute inset-0" onClick={() => setSelectedAlertId(null)} />
          <div 
            className="relative w-[480px] max-w-full h-full p-6 flex flex-col border-l border-white/10 z-10 transition-all duration-300"
            style={{
              background: '#FFFFFF',
              backdropFilter: 'blur(24px)',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* DRAWER HEADER */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono tracking-widest text-[#0F6B5C] font-black">{selectedAlert.id}</span>
                  <span className="w-1 h-3 rounded bg-cyan-400" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{selectedAlert.timestamp}</span>
                </div>
                <h2 className="text-lg font-black text-slate-100">{selectedAlert.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedAlertId(null)} 
                className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
              
              {/* STATUS SUMMARY */}
              <div className="responsive-grid-2">
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] block">Severity</span>
                  <span className={`${SEVERITY_BADGE[getAlertSeverity(selectedAlert.id, selectedAlert.severity)]} mt-1 inline-block uppercase`}>
                    {getAlertSeverity(selectedAlert.id, selectedAlert.severity)}
                  </span>
                </div>
                <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="text-slate-500 uppercase tracking-wider text-[9px] block">District Location</span>
                  <span className="text-slate-200 font-bold block mt-1.5">{selectedAlert.district} Command</span>
                </div>
              </div>

              {/* DETAILS DESCRIPTION */}
              <div className="bg-black/15 p-3.5 rounded-lg border border-white/5 leading-relaxed text-slate-300">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1">Alert Description</span>
                {selectedAlert.description}
              </div>

              {/* FORENSIC EVIDENCE */}
              <div className="bg-black/15 p-3.5 rounded-lg border border-white/5 leading-relaxed text-slate-300">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1">Scanned Evidence</span>
                <span className="text-[#0F6B5C] font-bold block mt-0.5">{selectedAlert.evidence}</span>
              </div>

              {/* ACCUSED SUSPECTS */}
              <div className="bg-black/15 p-3.5 rounded-lg border border-white/5 text-slate-300">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1.5">Identified Accused Profile</span>
                {drawerInfo.suspects.map((name, i) => (
                  <div key={i} className="flex justify-between items-center mt-1 py-1.5 border-b border-white/5 last:border-b-0">
                    <span className="font-bold text-slate-200">{name}</span>
                    <Link 
                      href={`/search?query=${name}`}
                      onClick={() => setSelectedAlertId(null)}
                      className="text-[#0F6B5C] hover:underline flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                    >
                      Inspect Profile <ArrowUpRight size={10} />
                    </Link>
                  </div>
                ))}
              </div>

              {/* RELATED FIRS */}
              <div className="bg-black/15 p-3.5 rounded-lg border border-white/5 text-slate-300">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1.5">Connected Case Files (FIRs)</span>
                {drawerInfo.firs.length === 0 ? (
                  <span className="text-slate-500 italic block mt-1">No active FIRs connected to this district.</span>
                ) : (
                  drawerInfo.firs.map(fir => (
                    <div key={fir.id} className="flex justify-between items-center mt-1 py-1.5 border-b border-white/5 last:border-b-0">
                      <div>
                        <span className="font-mono font-bold text-[#0F6B5C]">{fir.firNumber}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{fir.crimeCategory}</span>
                      </div>
                      <Link 
                        href={`/fir?id=${fir.id}`}
                        onClick={() => setSelectedAlertId(null)}
                        className="cyber-btn text-[10px] py-1 px-2.5 bg-cyan-950/20 text-[#0F6B5C] border border-[#0F6B5C]/20 rounded-md"
                      >
                        Open Case
                      </Link>
                    </div>
                  ))
                )}
              </div>

              {/* ASSIGNED OFFICER */}
              <div className="bg-black/15 p-3.5 rounded-lg border border-white/5 text-slate-300">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1.5">Assigned Case Officer</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-slate-200" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {assignedOfficers[selectedAlert.id] ? (
                      <>
                        <UserCheck size={12} color="#10b981" />
                        <span style={{ color: '#10b981' }}>{assignedOfficers[selectedAlert.id]}</span>
                      </>
                    ) : (
                      <>
                        <Users size={12} color="#64748b" />
                        <span className="text-slate-400">UNASSIGNED</span>
                      </>
                    )}
                  </span>
                  
                  <div>
                    <select
                      value={assignedOfficers[selectedAlert.id] || ""}
                      onChange={(e) => {
                        const officer = e.target.value;
                        setAssignedOfficers(prev => ({ ...prev, [selectedAlert.id]: officer }));
                      }}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid rgba(30, 58, 95, 0.25)',
                        borderRadius: 6,
                        color: '#0F6B5C',
                        fontSize: 11,
                        padding: '4px 8px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">-- Assign Officer --</option>
                      {KSP_OFFICERS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="bg-black/15 p-3.5 rounded-lg border border-white/5 text-slate-300">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] block mb-2.5">Alert Response Stepper</span>
                <div className="relative pl-5 border-l border-white/10 space-y-4 ml-1.5">
                  <div className="relative">
                    <span className="absolute -left-[24px] top-1 w-3.5 h-3.5 rounded-full bg-[#10b981] flex items-center justify-center">
                      <CheckCircle size={8} color="#fff" />
                    </span>
                    <div>
                      <span className="font-bold text-slate-200">Alert Triggered</span>
                      <p className="text-[10px] text-slate-500">AI monitoring engines flagged activity parameters.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[24px] top-1 w-3.5 h-3.5 rounded-full bg-[#10b981] flex items-center justify-center">
                      <CheckCircle size={8} color="#fff" />
                    </span>
                    <div>
                      <span className="font-bold text-slate-200">Acknowledge Command</span>
                      <p className="text-[10px] text-slate-500">
                        {acknowledged.has(selectedAlert.id) ? "Alert has been acknowledged by regional desk." : "Pending operator response."}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <span className={`absolute -left-[24px] top-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      dispatched.has(selectedAlert.id) ? 'bg-[#10b981]' : 'bg-slate-800'
                    }`}>
                      {dispatched.has(selectedAlert.id) && <CheckCircle size={8} color="#fff" />}
                    </span>
                    <div className={dispatched.has(selectedAlert.id) ? '' : 'opacity-40'}>
                      <span className="font-bold text-slate-200">Tactical Unit Dispatched</span>
                      <p className="text-[10px] text-slate-500">
                        {dispatched.has(selectedAlert.id) ? "SIT response units dispatched to coordinates." : "Standing by for tactical dispatch."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER ACTIONS */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
              <button
                className="cyber-btn cyber-btn-red flex-1 justify-center py-2.5 text-xs font-bold"
                onClick={(e) => handleDispatch(selectedAlert.id, e)}
                disabled={dispatched.has(selectedAlert.id)}
              >
                <Send size={12} /> {dispatched.has(selectedAlert.id) ? 'Dispatched ✓' : 'Dispatch Desk'}
              </button>
              <button
                className="cyber-btn cyber-btn-purple flex-1 justify-center py-2.5 text-xs font-bold"
                onClick={(e) => handleEscalate(selectedAlert.id, e)}
                disabled={escalated.has(selectedAlert.id)}
              >
                <ChevronRight size={12} /> {escalated.has(selectedAlert.id) ? 'Escalated Critical' : 'Escalate Alert'}
              </button>
              <button
                className="cyber-btn flex-1 justify-center py-2.5 text-xs font-bold bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] hover:bg-[#10b981]/20"
                onClick={(e) => handleCloseAlert(selectedAlert.id, e)}
              >
                <CheckCircle size={12} /> Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
