'use client';

import { useState, useEffect } from 'react';
import {
  Bell, AlertTriangle, Shield, CheckCircle, Radio, Zap,
  ChevronRight, Clock, MapPin, X, RefreshCw, Send,
  Users, Phone, Eye, Activity, Filter, Trash2, ArrowUpRight, UserCheck,
  Car, User, FileText, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageToggle';
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

const getAlertConfidence = (alert: any): number => {
  if (alert.severity === 'critical') return 96;
  if (alert.severity === 'high') return 87;
  if (alert.severity === 'medium') return 68;
  return 45;
};

const CircularProgress = ({ value, label, color }: { value: number, label: string, color: string }) => {
  const radius = 20;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}
      >
        <circle
          stroke="#E2E8F0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div>
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#1A1D23', display: 'block', lineHeight: 1 }}>{value}%</span>
        <span style={{ fontSize: '9px', color: '#6B7280', display: 'block', marginTop: '1px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
      </div>
    </div>
  );
};

const findVehiclePlate = (text: string) => {
  const matches = text.match(/[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}/);
  return matches ? matches[0] : null;
};

const LicensePlateChip = ({ plate }: { plate: string }) => {
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#FFFFFF',
        border: '1.5px solid #1A1D23',
        borderRadius: '8px',
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: '800',
        fontFamily: 'monospace',
        letterSpacing: '0.08em',
        color: '#1A1D23',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        marginTop: '8px'
      }}
    >
      <div 
        style={{
          background: '#002B7F',
          color: '#FFFFFF',
          fontSize: '7px',
          padding: '1px 3px',
          borderRadius: '4px 0 0 4px',
          marginRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: '1',
          fontWeight: '900',
          letterSpacing: '0'
        }}
      >
        <span>IND</span>
      </div>
      <span>{plate}</span>
    </div>
  );
};

const sectionLabel = (label: string, IconComponent: React.ComponentType<any>, accentColor: string) => {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div 
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: accentColor + '0A',
          border: `1px solid ${accentColor}1C`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accentColor,
          flexShrink: 0
        }}
      >
        <IconComponent size={12} />
      </div>
      <span style={{ fontSize: '11px', textTransform: 'uppercase', fontVariantCaps: 'all-small-caps', color: '#6B7280', letterSpacing: '0.05em', fontWeight: 700 }}>
        {label}
      </span>
    </div>
  );
};

export default function AlertsPage() {
  const { lang, t } = useLanguage();

  const getSeverityLabel = (sev: Severity) => {
    if (sev === 'all') return t.filter_all;
    if (sev === 'critical') return t.badge_critical;
    if (sev === 'high') return t.badge_high;
    if (sev === 'medium') return t.badge_medium;
    return t.badge_low;
  };

  const getCategoryLabel = (cat: Category) => {
    if (cat === 'all') return t.filter_all_categories;
    const key = `cat_${cat.replace(' ', '_')}` as keyof typeof t;
    return t[key] || cat;
  };

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
          <h1 className="page-title">{t.alerts_title}</h1>
          <p className="page-subtitle">{t.alerts_subtitle}</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="status-dot-red" />
          <span style={{ color: '#ef4444', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>{t.alerts_live}</span>
          <span style={{ color: '#64748b', fontSize: 11 }}>{t.alerts_updated} {lastUpdated}</span>
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
            {t.alerts_live_alerts}
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
          { label: t.stat_critical_alerts, value: criticalCount, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', pulse: true, icon: AlertTriangle },
          { label: t.stat_high_priority, value: highCount, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', pulse: false, icon: Shield },
          { label: t.stat_under_response, value: underResponse, color: '#0F6B5C', bg: 'rgba(30, 58, 95,0.06)', border: 'rgba(30, 58, 95,0.2)', pulse: false, icon: Activity },
          { label: t.stat_resolved_today, value: 47, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', pulse: false, icon: CheckCircle },
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
            {t.filter_severity}:
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
              {getSeverityLabel(sev)}
            </button>
          ))}
        </div>
        {/* CATEGORY FILTER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>
            {t.filter_category}:
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
              {getCategoryLabel(cat)}
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
            <span className="section-title">{t.alert_feed}</span>
            <span className="badge badge-red" style={{ marginLeft: 4 }}>
              {t.alerts_count.replace('{count}', String(filteredAlerts.length))}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredAlerts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
                <CheckCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <div style={{ fontSize: 14 }}>{t.alerts_no_alerts}</div>
              </div>
            )}
            {filteredAlerts.map((alert) => {
              const severityVal = getAlertSeverity(alert.id, alert.severity);
              const isAcked = acknowledged.has(alert.id);
              const isDispatched = dispatched.has(alert.id);
              const isEscalated = escalated.has(alert.id);
              const isCritical = severityVal === 'critical';
              const borderColor = SEVERITY_BORDER[severityVal] ?? '#64748b';

              // Localized Alert Fields
              const titleKey = `alert_${alert.id}_title` as keyof typeof t;
              const descKey = `alert_${alert.id}_desc` as keyof typeof t;
              const evidenceKey = `alert_${alert.id}_evidence` as keyof typeof t;

              const title = t[titleKey] || alert.title;
              const description = t[descKey] || alert.description;
              const evidence = t[evidenceKey] || alert.evidence;

              const severityLabel = severityVal === 'critical' ? t.badge_critical
                : severityVal === 'high' ? t.badge_high
                : severityVal === 'medium' ? t.badge_medium
                : t.badge_low;

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
                      {severityLabel.toUpperCase()}
                    </span>
                    <span className={CATEGORY_BADGE[alert.category] || 'badge badge-gray'} style={{ fontSize: 10 }}>
                      {getCategoryLabel(alert.category as Category)}
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
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1D23', marginBottom: 6, lineHeight: 1.4 }} className="flex justify-between items-center">
                    <span>{title}</span>
                    <ArrowUpRight size={14} className="text-slate-400 hover:text-slate-700" />
                  </div>

                  {/* DESCRIPTION */}
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.55, marginBottom: 8 }}>
                    {description}
                  </p>

                  {/* EVIDENCE */}
                  <div style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    fontSize: 11, color: '#374151',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC', borderRadius: 6, padding: '6px 10px',
                    marginBottom: 12,
                  }}>
                    <Eye size={11} color="#64748b" />
                    <span style={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>
                      {t.evidence_label}
                    </span>
                    <span>{evidence}</span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="cyber-btn cyber-btn-red"
                      style={{ fontSize: 11, padding: '7px 14px' }}
                      onClick={(e) => handleDispatch(alert.id, e)}
                      disabled={isDispatched}
                    >
                      <Send size={11} /> {isDispatched ? (lang === 'kn' ? 'ನಿಯೋಜಿಸಲಾಗಿದೆ ✓' : 'Dispatched ✓') : t.btn_dispatch}
                    </button>
                    <button
                      className="cyber-btn cyber-btn-amber"
                      style={{ fontSize: 11, padding: '7px 14px' }}
                      onClick={(e) => handleAcknowledge(alert.id, e)}
                      disabled={isAcked}
                    >
                      <CheckCircle size={11} /> {isAcked ? (lang === 'kn' ? 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ ✓' : 'Acknowledged ✓') : t.btn_acknowledge}
                    </button>
                    <button
                      className="cyber-btn cyber-btn-purple"
                      style={{ fontSize: 11, padding: '7px 14px' }}
                      onClick={(e) => handleEscalate(alert.id, e)}
                      disabled={isEscalated}
                    >
                      <ChevronRight size={11} /> {isEscalated ? (lang === 'kn' ? 'ತೀವ್ರಗೊಳಿಸಲಾಗಿದೆ ✓' : 'Escalated ✓') : t.btn_escalate}
                    </button>
                    <button
                      className="cyber-btn"
                      style={{ fontSize: 11, padding: '7px 14px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#475569' }}
                      onClick={(e) => handleCloseAlert(alert.id, e)}
                    >
                      <Trash2 size={11} /> {t.btn_resolve}
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
              <span className="section-title" style={{ fontSize: 13 }}>{t.right_active_deployments}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RESPONSE_TEAMS.map((team) => {
                const teamNameKey = `team_${team.name.replace(/ /g, '_')}` as keyof typeof t;
                const teamName = t[teamNameKey] || team.name;

                const teamStatusKey = `status_${team.status.replace(/ /g, '_')}` as keyof typeof t;
                const teamStatus = t[teamStatusKey] || team.status;

                return (
                  <div key={team.name} style={{
                    padding: '10px 12px', borderRadius: 8,
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1E3A5F' }}>{teamName}</div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                        background: `${team.statusColor}20`, color: team.statusColor,
                        border: `1px solid ${team.statusColor}40`,
                      }}>
                        {teamStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <MapPin size={10} /> {team.district}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Users size={10} /> {team.members} {t.right_officers}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Zap size={14} color="#f59e0b" />
              <span className="section-title" style={{ fontSize: 13 }}>{t.qa_title}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                const qaKey = `qa_${action.label.toLowerCase().replace(/ /g, '_')}` as keyof typeof t;
                const qaLabel = t[qaKey] || action.label;
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
                    <Icon size={13} /> {qaLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ALERT STATISTICS BY CATEGORY */}
          <div className="glass-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Activity size={14} color="#8b5cf6" />
              <span className="section-title" style={{ fontSize: 13 }}>{t.alerts_by_category}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {categoryStats.map((cat) => {
                const maxCount = Math.max(...categoryStats.map(c => c.count));
                const pct = (cat.count / maxCount) * 100;
                return (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{getCategoryLabel(cat.name as Category)}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cat.color }}>{cat.count}</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
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
            <span style={{ fontSize: 12, color: '#475569' }}>
              {t.live_feed_sync} <span style={{ color: '#0F6B5C', fontWeight: 700 }}>{lastUpdated}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ALERT DETAILS SLIDE-OVER DRAWER */}
      {selectedAlert && drawerInfo && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="absolute inset-0" onClick={() => setSelectedAlertId(null)} />
          <div 
            className="relative w-[480px] max-w-full z-10 transition-all duration-300"
            style={{
              height: 'calc(100vh - 32px)',
              margin: '16px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* DRAWER HEADER */}
            <div className="flex flex-col gap-2.5 pb-4 border-b border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-[#1E3A5F] font-black">{selectedAlert.id}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{selectedAlert.timestamp}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAlertId(null)} 
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1A1D23', marginBottom: '6px', lineHeight: 1.3 }}>
                  {t[`alert_${selectedAlert.id}_title` as keyof typeof t] || selectedAlert.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`${SEVERITY_BADGE[getAlertSeverity(selectedAlert.id, selectedAlert.severity)]} inline-block uppercase font-bold`} style={{ borderRadius: '8px', fontSize: '10px', padding: '2px 8px' }}>
                    {(getAlertSeverity(selectedAlert.id, selectedAlert.severity) === 'critical' ? t.badge_critical
                      : getAlertSeverity(selectedAlert.id, selectedAlert.severity) === 'high' ? t.badge_high
                      : getAlertSeverity(selectedAlert.id, selectedAlert.severity) === 'medium' ? t.badge_medium
                      : t.badge_low).toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>•</span>
                  <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 'bold' }}>
                    {selectedAlert.district} {lang === 'kn' ? 'ಕಮಾಂಡ್' : 'Command'}
                  </span>
                </div>
              </div>
            </div>

            {/* DRAWER BODY */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs mt-4">
              
              {/* STATUS SUMMARY WITH GAUGE */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-[#E2E8F0] items-center">
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', fontVariantCaps: 'all-small-caps', color: '#6B7280', letterSpacing: '0.05em', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                    {t.detail_incident_category}
                  </span>
                  <span className={`${CATEGORY_BADGE[selectedAlert.category] || 'badge'} inline-block uppercase font-bold`} style={{ borderRadius: '8px', fontSize: '10px', padding: '2px 8px' }}>
                    {getCategoryLabel(selectedAlert.category as Category)}
                  </span>
                </div>
                <div className="flex justify-end">
                  <CircularProgress 
                    value={getAlertConfidence(selectedAlert)} 
                    label={lang === 'kn' ? 'AI ವಿಶ್ವಾಸ ಮಟ್ಟ' : 'AI Confidence'} 
                    color={
                      selectedAlert.severity === 'critical' ? '#EF4444' : 
                      selectedAlert.severity === 'high' ? '#F59E0B' : 
                      selectedAlert.severity === 'medium' ? '#0F6B5C' : '#64748B'
                    } 
                  />
                </div>
              </div>

              {/* DETAILS DESCRIPTION & PLATE */}
              <div className="pb-4 border-b border-[#E2E8F0]">
                {sectionLabel(t.detail_alert_description, AlertCircle, "#1E3A5F")}
                <p className="text-[#1A1D23] leading-relaxed" style={{ fontSize: '13px' }}>
                  {t[`alert_${selectedAlert.id}_desc` as keyof typeof t] || selectedAlert.description}
                </p>
                {(() => {
                  const plate = findVehiclePlate(selectedAlert.description);
                  return plate ? <LicensePlateChip plate={plate} /> : null;
                })()}
              </div>

              {/* FORENSIC EVIDENCE */}
              <div className="pb-4 border-b border-[#E2E8F0]">
                {(() => {
                  const hasPlate = findVehiclePlate(selectedAlert.description);
                  return sectionLabel(t.detail_scanned_evidence, hasPlate ? Car : Activity, "#475569");
                })()}
                <span className="text-[#1A1D23] font-bold block" style={{ fontSize: '14px' }}>
                  {t[`alert_${selectedAlert.id}_evidence` as keyof typeof t] || selectedAlert.evidence}
                </span>
              </div>

              {/* ACCUSED SUSPECTS */}
              <div className="pb-4 border-b border-[#E2E8F0]">
                {sectionLabel(t.detail_accused_profile, User, "#D97706")}
                <div style={{ marginTop: '4px' }}>
                  {drawerInfo.suspects.map((name, i) => (
                    <div 
                      key={i} 
                      className="flex justify-between items-center py-2.5 px-3 mb-2 border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50 transition-all"
                      style={{
                        borderRadius: '8px',
                        height: '42px'
                      }}
                    >
                      <span className="font-bold text-[#1A1D23]" style={{ fontSize: '13px' }}>{name}</span>
                      <Link 
                        href={`/search?query=${name}`}
                        onClick={() => setSelectedAlertId(null)}
                        className="text-[#0F6B5C] hover:underline flex items-center gap-0.5 text-[11px] font-bold uppercase tracking-wider"
                      >
                        {t.detail_inspect_profile} <ArrowUpRight size={10} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* RELATED FIRS */}
              <div className="pb-4 border-b border-[#E2E8F0]">
                {sectionLabel(t.detail_connected_cases, FileText, "#10B981")}
                <div style={{ marginTop: '4px' }}>
                  {drawerInfo.firs.length === 0 ? (
                    <span className="text-slate-400 italic block">{t.detail_no_connected_firs}</span>
                  ) : (
                    drawerInfo.firs.map(fir => (
                      <div 
                        key={fir.id} 
                        className="flex justify-between items-center py-2.5 px-3 mb-2 border border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50 transition-all"
                        style={{
                          borderRadius: '8px',
                          height: '42px'
                        }}
                      >
                        <div>
                          <span className="font-mono font-bold text-[#1A1D23]" style={{ fontSize: '13px' }}>{fir.firNumber}</span>
                          <span className="text-[10px] text-slate-500 block" style={{ marginTop: '1px' }}>
                            {getCategoryLabel(fir.crimeCategory as Category)}
                          </span>
                        </div>
                        <Link 
                           href={`/fir?id=${fir.id}`}
                          onClick={() => setSelectedAlertId(null)}
                          className="text-[#0F6B5C] hover:underline flex items-center gap-0.5 text-[11px] font-bold uppercase tracking-wider"
                        >
                          {t.detail_open_case} <ArrowUpRight size={10} />
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* ASSIGNED OFFICER */}
              <div className="pb-4 border-b border-[#E2E8F0]">
                {sectionLabel(t.detail_assigned_officer, Shield, "#1E3A5F")}
                <div style={{ marginTop: '4px' }}>
                  <select
                    value={assignedOfficers[selectedAlert.id] || ""}
                    onChange={(e) => {
                      const officer = e.target.value;
                      setAssignedOfficers(prev => ({ ...prev, [selectedAlert.id]: officer }));
                    }}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      color: '#1A1D23',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      padding: '8px 12px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" style={{ color: '#6B7280', fontWeight: 'normal' }}>{t.detail_unassigned}</option>
                    {KSP_OFFICERS.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="pb-4">
                {sectionLabel(t.detail_response_stepper, Activity, "#1E3A5F")}
                <div className="relative pl-5 border-l-2 border-slate-100 space-y-4 ml-1.5 mt-3">
                  {/* Step 1 */}
                  <div className="relative">
                    <span 
                      className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center z-10"
                    >
                      <CheckCircle size={10} color="#fff" />
                    </span>
                    <div>
                      <span className="font-bold text-[#1A1D23]" style={{ fontSize: '13px' }}>{t.detail_step_triggered_title}</span>
                      <p className="text-[11px] text-slate-500">{t.detail_step_triggered_desc}</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    {acknowledged.has(selectedAlert.id) ? (
                      <span 
                        className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center z-10"
                      >
                        <CheckCircle size={10} color="#fff" />
                      </span>
                    ) : (
                      <span 
                        className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#1E3A5F] flex items-center justify-center z-10"
                        style={{ boxShadow: '0 0 0 3px rgba(30, 58, 95, 0.15)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] animate-pulse" />
                      </span>
                    )}
                    <div className={acknowledged.has(selectedAlert.id) ? '' : 'font-medium'}>
                      <span className="font-bold text-[#1A1D23]" style={{ fontSize: '13px' }}>{t.detail_step_acknowledge_title}</span>
                      <p className="text-[11px] text-slate-500">
                        {acknowledged.has(selectedAlert.id) ? t.detail_step_acknowledge_acked : t.detail_step_acknowledge_pending}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    {dispatched.has(selectedAlert.id) ? (
                      <span 
                        className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center z-10"
                      >
                        <CheckCircle size={10} color="#fff" />
                      </span>
                    ) : acknowledged.has(selectedAlert.id) ? (
                      <span 
                        className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#1E3A5F] flex items-center justify-center z-10"
                        style={{ boxShadow: '0 0 0 3px rgba(30, 58, 95, 0.15)' }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] animate-pulse" />
                      </span>
                    ) : (
                      <span 
                        className="absolute -left-[26px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10"
                      />
                    )}
                    <div className={dispatched.has(selectedAlert.id) ? '' : 'opacity-60'}>
                      <span className="font-bold text-[#1A1D23]" style={{ fontSize: '13px' }}>{t.detail_step_dispatched_title}</span>
                      <p className="text-[11px] text-slate-500">
                        {dispatched.has(selectedAlert.id) ? t.detail_step_dispatched_done : t.detail_step_dispatched_pending}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DRAWER FOOTER ACTIONS */}
            <div className="flex gap-2 mt-auto pt-4 border-t border-[#E2E8F0]">
              {!acknowledged.has(selectedAlert.id) && (
                <button
                  className="flex-1 justify-center py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  style={{
                    background: 'transparent',
                    border: '1px solid #0F6B5C',
                    color: '#0F6B5C',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => handleAcknowledge(selectedAlert.id, e)}
                >
                  <CheckCircle size={12} /> {t.btn_acknowledge}
                </button>
              )}
              <button
                className="flex-1 justify-center py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: dispatched.has(selectedAlert.id) ? '#E2E8F0' : '#1E3A5F',
                  color: dispatched.has(selectedAlert.id) ? '#6B7280' : '#FFFFFF',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: dispatched.has(selectedAlert.id) ? 'not-allowed' : 'pointer'
                }}
                onClick={(e) => handleDispatch(selectedAlert.id, e)}
                disabled={dispatched.has(selectedAlert.id)}
              >
                <Send size={12} /> {dispatched.has(selectedAlert.id) ? (lang === 'kn' ? 'ನಿಯೋಜಿಸಲಾಗಿದೆ ✓' : 'Dispatched ✓') : t.btn_dispatch}
              </button>
              <button
                className="flex-1 justify-center py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: 'transparent',
                  border: '1px solid #DC2626',
                  color: '#DC2626',
                  borderRadius: '8px',
                  cursor: escalated.has(selectedAlert.id) ? 'not-allowed' : 'pointer'
                }}
                onClick={(e) => handleEscalate(selectedAlert.id, e)}
                disabled={escalated.has(selectedAlert.id)}
              >
                <ChevronRight size={12} /> {escalated.has(selectedAlert.id) ? t.detail_escalated_critical : t.btn_escalate}
              </button>
              <button
                className="flex-1 justify-center py-2 px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                style={{
                  background: 'transparent',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={(e) => handleCloseAlert(selectedAlert.id, e)}
              >
                <CheckCircle size={12} /> {t.btn_resolve}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
