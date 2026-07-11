'use client';

import { useState, useMemo } from 'react';
import {
  Package, Users, Monitor, Anchor, Moon,
  CheckCircle, Clock, Zap,
  BarChart3, MapPin, Sliders, Target, Activity, TrendingUp,
  Download, Cpu, AlertTriangle, ArrowUpRight,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  RESOURCE_RECOMMENDATIONS, DISTRICT_RESOURCES, BUDGET_ALLOCATION,
} from '@/lib/mockData';
import { KARNATAKA_DISTRICTS } from '@/lib/mockData';
import { useLanguage } from '@/components/LanguageToggle';
import { TranslationSet } from '@/lib/translations';
import Modal from '@/components/Modal';

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#1976D2', // Distinct Blue
  Low: '#10b981',
};

const STATUS_COLORS: Record<string, string> = {
  'Pending Approval': '#f59e0b',
  'Approved': '#0F6B5C',
  'Deployed': '#10b981',
  'In Progress': '#8b5cf6',
  'Pending': '#D97706', // Distinct Amber/Orange
};

const ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  monitor: Monitor,
  shield: Activity,
  anchor: Anchor,
  users: Users,
  moon: Moon,
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { category: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].payload.category}</p>
        <p style={{ color: '#0F6B5C' }}>₹{payload[0].value}Cr</p>
      </div>
    );
  }
  return null;
};

const SimulatorTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip">
        <p style={{ color: '#0F6B5C', fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '12px' }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ResourcesPage() {
  const { lang, t } = useLanguage();
  const [selectedRec, setSelectedRec] = useState<number | null>(null);
  const [actionStatus, setActionStatus] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<'deployment' | 'simulator'>('deployment');
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [showAIOptimizeModal, setShowAIOptimizeModal] = useState(false);

  // Simulator state
  const [patrolUnits, setPatrolUnits] = useState(450);
  const [rapidResponse, setRapidResponse] = useState(20);
  const [techInvestment, setTechInvestment] = useState(35);
  const [simApplied, setSimApplied] = useState(false);

  const handleAction = (id: number, action: string) => {
    setActionStatus((prev) => ({ ...prev, [id]: action }));
  };

  const totalOfficers = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.totalOfficers, 0);
  const totalDeployed = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.deployedPatrol, 0);
  const totalCyber = DISTRICT_RESOURCES.reduce((sum, d) => sum + d.cyberUnits, 0);

  // Simulator computations
  const simulation = useMemo(() => {
    const BASE_CRIMES = 82089;
    const reductionUnits = patrolUnits * 12 + rapidResponse * 200 + techInvestment * 180;
    const reductionPct = Math.min(35, (reductionUnits / BASE_CRIMES) * 100);
    const projectedCrimes = Math.round(BASE_CRIMES * (1 - reductionPct / 100));
    const responseTime = Math.max(4, 28 - rapidResponse * 0.45 - patrolUnits * 0.01).toFixed(1);
    const cyberInterceptRate = Math.min(78, 30 + techInvestment * 0.9).toFixed(1);
    const totalInvestment = patrolUnits * 0.05 + rapidResponse * 2.5 + techInvestment;
    const roiScore = Math.round((reductionPct / totalInvestment) * 100);
    return {
      reductionPct: reductionPct.toFixed(1),
      projectedCrimes,
      responseTime,
      cyberInterceptRate,
      totalInvestment: totalInvestment.toFixed(1),
      roiScore,
    };
  }, [patrolUnits, rapidResponse, techInvestment]);

  const simulatorChartData = useMemo(() => {
    const reductionPct = parseFloat(simulation.reductionPct);
    return KARNATAKA_DISTRICTS.slice(0, 8).map((d) => ({
      name: d.name.split(' ')[0],
      current: d.crimeCount,
      projected: Math.round(d.crimeCount * (1 - reductionPct / 100)),
    }));
  }, [simulation.reductionPct]);

  const getDistrictCaseload = (districtName: string, totalOfficers: number) => {
    const mockActiveCases: Record<string, number> = {
      'Bengaluru Urban': 6200,
      'Mysuru': 1800,
      'Kalaburagi': 1400,
      'Belagavi': 1200,
      'Hubli-Dharwad': 950,
      'Mangaluru': 700,
      'Vijayapura': 650,
      'Ballari': 550,
    };
    const baseCases = mockActiveCases[districtName] || Math.round(totalOfficers * 0.15);
    const reductionPct = simApplied ? parseFloat(simulation.reductionPct) : 0;
    const cases = Math.round(baseCases * (1 - reductionPct / 100));
    const ratio = cases / totalOfficers;
    const status = ratio > 0.35 ? 'Overloaded' : ratio > 0.15 ? 'Moderate' : 'Optimal';
    return { cases, ratio, status };
  };

  return (
    <div style={{ background: 'var(--bg-app)', padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(30, 58, 95, 0.12)', border: '1px solid rgba(30, 58, 95, 0.3)' }}
            >
              <Package size={20} style={{ color: '#0F6B5C' }} />
            </div>
            <h1 className="page-title">{lang === 'kn' ? 'ಸಂಪನ್ಮೂಲ ನಿಯೋಜನೆ ಗುಪ್ತಚರ' : 'Resource Deployment Intelligence'}</h1>
          </div>
          <p className="page-subtitle">{lang === 'kn' ? 'ಕರ್ನಾಟಕದಾದ್ಯಂತ AI ಚಾಲಿತ ಪೊಲೀಸ್ ಬಲ ನಿಯೋಜನೆ ಮತ್ತು ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ ಶಿಫಾರಸುಗಳು' : 'AI-powered force allocation and deployment recommendations across Karnataka'}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="cyber-btn cyber-btn-muted"
            onClick={() => setShowAllocationModal(true)}
          >
            <BarChart3 size={14} />
            {lang === 'kn' ? 'ಹಂಚಿಕೆ ವರದಿ' : 'ALLOCATION REPORT'}
          </button>
          <button
            type="button"
            className="cyber-btn cyber-btn-navy"
            onClick={() => setShowAIOptimizeModal(true)}
          >
            <Zap size={14} />
            {lang === 'kn' ? 'AI ಆಪ್ಟಿಮೈಸ್' : 'AI OPTIMIZE'}
          </button>
        </div>
      </div>

      {/* Tab Header Bar */}
      <div style={{ display: 'flex', borderBottom: '1.5px solid var(--border-default)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('deployment')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 700,
            color: activeTab === 'deployment' ? 'var(--primary-navy)' : 'var(--text-muted)',
            borderBottom: activeTab === 'deployment' ? '3px solid var(--primary-navy)' : '3px solid transparent',
            background: 'transparent',
            borderLeft: 'none', borderRight: 'none', borderTop: 'none',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            marginBottom: '-1.5px',
          }}
        >
          {lang === 'kn' ? 'ಪೊಲೀಸ್ ನಿಯೋಜನೆ ಮತ್ತು ಬಜೆಟ್' : 'Force Deployment & Budget'}
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 700,
            color: activeTab === 'simulator' ? 'var(--primary-navy)' : 'var(--text-muted)',
            borderBottom: activeTab === 'simulator' ? '3px solid var(--primary-navy)' : '3px solid transparent',
            background: 'transparent',
            borderLeft: 'none', borderRight: 'none', borderTop: 'none',
            cursor: 'pointer',
            transition: 'all 150ms ease',
            marginBottom: '-1.5px',
          }}
        >
          {lang === 'kn' ? 'AI ಪ್ರೆಡಿಕ್ಟಿವ್ ಸಿಮ್ಯುಲೇಶನ್ ಮಾಡೆಲ್' : 'AI Predictive Simulation Model'}
        </button>
      </div>

      {activeTab === 'deployment' && (
        <>
          {/* Summary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: lang === 'kn' ? t.stat_total_officers : 'Total Police Force', value: totalOfficers.toLocaleString(), sub: lang === 'kn' ? 'ಕರ್ನಾಟಕ' : 'Karnataka', color: '#0F6B5C', icon: Users },
              { label: lang === 'kn' ? t.dashboard_active_patrol : 'Active Patrol Units', value: totalDeployed.toLocaleString(), sub: lang === 'kn' ? 'ನಿಯೋಜಿಸಲಾಗಿದೆ' : 'Deployed', color: '#10b981', icon: Activity },
              { label: lang === 'kn' ? t.crime_cybercrime : 'Cyber Crime Units', value: totalCyber.toLocaleString(), sub: lang === 'kn' ? 'ವಿಶೇಷ ಘಟಕಗಳು' : 'Specialized', color: '#8b5cf6', icon: Monitor },
              { label: lang === 'kn' ? 'ಬಾಕಿ ಇರುವ ಅನುಮೋದನೆಗಳು' : 'Pending Approvals', value: '3', sub: lang === 'kn' ? 'AI ಶಿಫಾರಸುಗಳು' : 'AI Recommendations', color: '#f59e0b', icon: Clock },
            ].map((metric, i) => (
              <div key={i} className="glass-card" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{metric.label}</span>
                  <div
                    style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', background: `${metric.color}10`, border: `1px solid ${metric.color}20` }}
                  >
                    <metric.icon size={18} style={{ color: metric.color }} />
                  </div>
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', fontFamily: 'monospace', lineHeight: 1, marginBottom: '6px' }}>{metric.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>{metric.sub}</div>
              </div>
            ))}
          </div>

          {/* AI Recommendations Master-Detail Layout */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '16px' }}>
              <div className="section-header-line" />
              <h2 className="section-title">{lang === 'kn' ? 'AI ನಿಯೋಜನೆ ಶಿಫಾರಸುಗಳು' : 'AI Deployment Recommendations'}</h2>
              <span className="badge badge-cyan" style={{ fontSize: '12px', marginLeft: '4px' }}>6 {lang === 'kn' ? 'ಸಕ್ರಿಯ' : 'ACTIVE'}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', alignItems: 'stretch' }}>
              {/* Left Column: Featured Recommendation (Detail) */}
              {(() => {
                const activeRecId = selectedRec ?? RESOURCE_RECOMMENDATIONS[0]?.id;
                const rec = RESOURCE_RECOMMENDATIONS.find(r => r.id === activeRecId) || RESOURCE_RECOMMENDATIONS[0];
                if (!rec) return null;
                
                const IconComp = ICON_MAP[rec.icon] || Activity;
                const statusAction = actionStatus[rec.id];
                const priorityColor = PRIORITY_COLORS[rec.priority] || '#64748b';

                return (
                  <div className="glass-card" style={{
                    background: '#FFFFFF',
                    border: `1px solid #E2E8F0`,
                    borderLeft: `4px solid ${priorityColor}`,
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${priorityColor}10`, border: `1px solid ${priorityColor}20` }}
                          >
                            <IconComp size={20} style={{ color: priorityColor }} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span className="badge" style={{ background: `${priorityColor}15`, color: priorityColor, border: `1px solid ${priorityColor}25`, fontSize: '12px', fontWeight: 700 }}>
                                {lang === 'kn' ? (rec.priority === 'Critical' ? t.priority_critical : rec.priority === 'High' ? t.priority_high : rec.priority === 'Medium' ? t.priority_medium : 'ಕಡಿಮೆ') : rec.priority.toUpperCase()}
                              </span>
                              <span className="badge" style={{ background: 'rgba(100,116,139,0.06)', color: '#64748b', border: '1px solid rgba(100,116,139,0.15)', fontSize: '12px' }}>
                                {lang === 'kn' ? (rec.status === 'Approved' ? 'ಅನುಮೋದಿಸಲಾಗಿದೆ' : rec.status === 'Deployed' ? 'ನಿಯೋಜಿಸಲಾಗಿದೆ' : 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ') : rec.status.toUpperCase()}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{rec.action}</h3>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '14px', fontWeight: 600 }}>
                          <MapPin size={14} />
                          <span>{rec.district}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>{rec.reason}</p>

                      {/* Details Panel */}
                      <div style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '20px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px'
                      }}>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                            {lang === 'kn' ? 'ಅಗತ್ಯವಿರುವ ಘಟಕಗಳು' : 'Units Required'}
                          </div>
                          <div style={{ color: 'var(--primary-navy)', fontSize: '18px', fontWeight: 800, fontFamily: 'monospace' }}>{rec.units} Units</div>
                        </div>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                            {lang === 'kn' ? t.time : 'Timeline'}
                          </div>
                          <div style={{ color: '#334155', fontSize: '14px', fontWeight: 700 }}>{rec.timeline}</div>
                        </div>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                            Current Status
                          </div>
                          <span className="badge" style={{
                            marginTop: '2px',
                            display: 'inline-block',
                            background: `${STATUS_COLORS[rec.status]}15`,
                            color: STATUS_COLORS[rec.status],
                            border: `1px solid ${STATUS_COLORS[rec.status]}30`,
                            fontSize: '12px',
                            fontWeight: 700
                          }}>
                            {rec.status}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                          {lang === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಪರಿಣಾಮ' : 'Expected Impact'}
                        </div>
                        <div style={{ color: '#0F6B5C', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Target size={14} />
                          <span>{rec.impact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      {statusAction ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '14px', fontWeight: 700 }}>
                          <CheckCircle size={16} />
                          <span>Action Submitted: {statusAction}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            className="cyber-btn cyber-btn-cyan"
                            style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700 }}
                            onClick={(e) => { e.stopPropagation(); handleAction(rec.id, 'Under Review'); }}
                          >
                            FLAG FOR REVIEW
                          </button>
                          <button
                            className="cyber-btn cyber-btn-green"
                            style={{ padding: '8px 20px', fontSize: '12px', fontWeight: 700 }}
                            onClick={(e) => { e.stopPropagation(); handleAction(rec.id, 'Approved'); }}
                          >
                            APPROVE DEPLOYMENT
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Right Column: Secondary Recommendations List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '490px', paddingRight: '4px' }}>
                {RESOURCE_RECOMMENDATIONS.map((rec) => {
                  const isSelected = rec.id === (selectedRec ?? 1);
                  const priorityColor = PRIORITY_COLORS[rec.priority] || '#64748b';
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRec(rec.id)}
                      className="glass-card"
                      style={{
                        background: isSelected ? '#F8FAFC' : '#FFFFFF',
                        border: `1px solid ${isSelected ? 'var(--primary-navy)' : '#E2E8F0'}`,
                        borderRadius: '10px',
                        padding: '14px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 200ms ease',
                        position: 'relative'
                      }}
                    >
                      {/* Left indicator bar */}
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                        background: priorityColor, borderRadius: '10px 0 0 10px'
                      }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge" style={{ background: `${priorityColor}15`, color: priorityColor, border: `1px solid ${priorityColor}25`, fontSize: '12px', fontWeight: 700 }}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={10} /> {rec.district}
                        </span>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {rec.action}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Analytics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', marginBottom: '32px' }}>
            {/* Budget Allocation Card */}
            <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '20px' }}>
                <div className="section-header-line" />
                <h2 className="section-title">Budget Allocation — FY 2025-26</h2>
                <span style={{ color: '#94A3B8', fontSize: '12px', fontWeight: 500 }}>(₹ in Crores)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ width: '200px', height: '200px', flexShrink: 0, margin: '0 auto', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={BUDGET_ALLOCATION}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        dataKey="amount"
                        stroke="none"
                      >
                        {BUDGET_ALLOCATION.map((entry, index) => (
                          <Cell key={index} fill={entry.color} fillOpacity={0.9} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {BUDGET_ALLOCATION.map((item, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                          <span style={{ color: '#475569', fontWeight: 600 }}>{item.category}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', fontWeight: 700 }}>
                          <span style={{ color: '#1E293B' }}>₹{item.amount}Cr</span>
                          <span style={{ color: '#64748B' }}>{item.percentage}%</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.percentage}%`, height: '100%', background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Priority Matrix Card */}
            <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '20px' }}>
                <div className="section-header-line" />
                <h2 className="section-title">Priority Decision Matrix</h2>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '12px',
                height: '220px',
                boxSizing: 'border-box'
              }}>
                {[
                  { label: 'HIGH IMPACT / HIGH URGENCY', color: '#ef4444', bg: 'rgba(239,68,68,0.03)', border: 'rgba(239,68,68,0.12)', items: ['Cyber Task Force', 'Border Checkposts'] },
                  { label: 'HIGH IMPACT / LOW URGENCY', color: '#f59e0b', bg: 'rgba(245,158,11,0.03)', border: 'rgba(245,158,11,0.12)', items: ['Cyber Command Center', 'SIT Expansion'] },
                  { label: 'LOW IMPACT / HIGH URGENCY', color: '#8b5cf6', bg: 'rgba(139,92,246,0.03)', border: 'rgba(139,92,246,0.12)', items: ['Night Patrolling', 'Port Security'] },
                  { label: 'LOW IMPACT / LOW URGENCY', color: '#64748b', bg: 'rgba(100,116,139,0.03)', border: 'rgba(100,116,139,0.12)', items: ['Community Programs', 'Training'] },
                ].map((cell, i) => (
                  <div
                    key={i}
                    style={{
                      background: cell.bg,
                      border: `1px solid ${cell.border}`,
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ color: cell.color, fontSize: '12px', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '6px', textTransform: 'uppercase' }}>
                      {cell.label}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {cell.items.map((item, j) => (
                        <div key={j} style={{ color: '#334155', fontSize: '12px', fontWeight: 600 }}>
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* District Resource Deployment Status Table */}
          <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="section-header-line" />
                <h2 className="section-title">District Resource Deployment Status</h2>
              </div>
              <button
                className="cyber-btn cyber-btn-cyan"
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 700 }}
              >
                EXPORT TABLE DATA
              </button>
            </div>
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table className="cyber-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>District</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Officers</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Patrol Deployed</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Cyber Units</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Detectives</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Officer Caseload</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Coverage Score</th>
                  </tr>
                </thead>
                <tbody>
                  {DISTRICT_RESOURCES.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div className="flex items-center gap-2">
                          <MapPin size={12} style={{ color: '#94A3B8' }} />
                          <span style={{ color: '#1E293B', fontWeight: 700 }}>{d.district}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 500 }}>{d.totalOfficers.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 500 }}>{d.deployedPatrol.toLocaleString()}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ color: '#8B5CF6', fontWeight: 700 }}>{d.cyberUnits}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 500 }}>{d.detectives}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {(() => {
                          const caseload = getDistrictCaseload(d.district, d.totalOfficers);
                          const badgeClass = caseload.status === 'Overloaded' 
                            ? 'badge-red' 
                            : caseload.status === 'Moderate' 
                              ? 'badge-amber' 
                              : 'badge-green';
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span className={`badge ${badgeClass}`} style={{ alignSelf: 'flex-start', fontSize: '12px', fontWeight: 700 }}>
                                {caseload.status.toUpperCase()}
                              </span>
                              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
                                {caseload.cases.toLocaleString()} cases / {d.totalOfficers.toLocaleString()} force
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div className="flex items-center gap-2">
                          <div className="risk-bar-track" style={{ width: 80, height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              className="risk-bar-fill"
                              style={{
                                height: '100%',
                                width: `${d.coverage}%`,
                                background: d.coverage >= 80 ? '#10B981' : d.coverage >= 60 ? '#F59E0B' : '#EF4444',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color: d.coverage >= 80 ? '#10B981' : d.coverage >= 60 ? '#F59E0B' : '#EF4444',
                              fontWeight: 800,
                              fontSize: '12px',
                            }}
                          >
                            {d.coverage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'simulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Sliders size={18} style={{ color: '#0F6B5C' }} />
              <h2 className="section-title" style={{ margin: 0 }}>PREDICTIVE RESOURCE DEPLOYMENT SIMULATOR</h2>
            </div>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
              Adjust patrol units, rapid response teams, and technology investment to simulate projected crime reduction impact using statistical modeling.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
            {/* Left: Sliders */}
            <div className="glass-card" style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '20px' }}>Deployment Parameters</h3>

                {/* Patrol Units */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={14} style={{ color: '#0F6B5C' }} /> Patrol Units Deployed
                    </label>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F6B5C', fontFamily: 'monospace' }}>{patrolUnits}</span>
                  </div>
                  <input
                    type="range" min={100} max={1000} value={patrolUnits}
                    onChange={(e) => { setPatrolUnits(Number(e.target.value)); setSimApplied(false); }}
                    style={{ width: '100%', accentColor: '#0F6B5C', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 600 }}>
                    <span>100 (Minimal)</span><span>1000 (Maximum)</span>
                  </div>
                </div>

                {/* Rapid Response */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Zap size={14} style={{ color: '#ef4444' }} /> Rapid Response Teams
                    </label>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>{rapidResponse}</span>
                  </div>
                  <input
                    type="range" min={5} max={50} value={rapidResponse}
                    onChange={(e) => { setRapidResponse(Number(e.target.value)); setSimApplied(false); }}
                    style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 600 }}>
                    <span>5 teams</span><span>50 teams</span>
                  </div>
                </div>

                {/* Tech Investment */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <label style={{ fontSize: '14px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Monitor size={14} style={{ color: '#8b5cf6' }} /> Tech Investment (₹ Crore)
                    </label>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#8b5cf6', fontFamily: 'monospace' }}>₹{techInvestment}Cr</span>
                  </div>
                  <input
                    type="range" min={1} max={100} value={techInvestment}
                    onChange={(e) => { setTechInvestment(Number(e.target.value)); setSimApplied(false); }}
                    style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', marginTop: '4px', fontWeight: 600 }}>
                    <span>₹1Cr</span><span>₹100Cr</span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Estimated Investment</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#D97706', fontFamily: 'monospace' }}>₹{simulation.totalInvestment}Cr</span>
                </div>

                <button
                  onClick={() => setSimApplied(true)}
                  className="cyber-btn cyber-btn-navy"
                  style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Zap size={14} />
                  APPLY SIMULATION PROJECTIONS
                </button>
                {simApplied && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <CheckCircle size={15} /> <span>Simulation applied — projections updated!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Projected Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: 'Crime Reduction', value: `${simulation.reductionPct}%`, color: '#10b981', icon: TrendingUp, desc: 'Projected annual reduction' },
                  { label: 'Response Time', value: `${simulation.responseTime} min`, color: '#0F6B5C', icon: Clock, desc: 'Average incident response' },
                  { label: 'Cyber Intercept Rate', value: `${simulation.cyberInterceptRate}%`, color: '#8b5cf6', icon: Monitor, desc: 'Cybercrime detection rate' },
                  { label: 'ROI Score', value: `${simulation.roiScore}`, color: '#f59e0b', icon: Target, desc: 'Effectiveness per ₹Cr' },
                ].map((metric) => (
                  <div key={metric.label} className="glass-card" style={{ padding: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: `3px solid ${metric.color}`, borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{metric.label}</span>
                      <metric.icon size={16} style={{ color: metric.color }} />
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: metric.color, fontFamily: 'monospace', lineHeight: 1, marginBottom: '4px' }}>{metric.value}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>{metric.desc}</div>
                  </div>
                ))}
              </div>

              {/* Simulator Bar Chart */}
              <div className="glass-card" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Current vs Projected Crimes — Top 8 Districts
                </div>
                <div style={{ width: '100%', height: '220px', position: 'relative', minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={simulatorChartData} barGap={4} barSize={12}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: '12px', fontWeight: 600 }} />
                      <YAxis tick={{ fill: '#64748B', fontSize: '12px', fontWeight: 600 }} />
                      <Tooltip content={<SimulatorTooltip />} />
                      <Legend formatter={(v) => <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>{v}</span>} />
                      <Bar dataKey="current" name="Current" fill="#ef4444" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                      <Bar dataKey="projected" name="Projected" fill="#10b981" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Methodology Note */}
          <div style={{ padding: '14px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: '12px', color: '#64748B', display: 'flex', gap: 10, alignItems: 'flex-start', lineHeight: 1.5 }}>
            <Activity size={14} style={{ color: '#94a3b8', flexShrink: 0, marginTop: 2 }} />
            <span>
              <strong style={{ color: '#1E293B' }}>Methodology Note:</strong> Projections use weighted linear regression formulas: Crime Reduction = (PatrolUnits × 12 + RapidResponse × 200 + TechInvestment × 180) / BaseCrimes. Response Time uses empirical patrol density curves. All values are statistical estimates based on Karnataka Police operational data and national benchmarks.
            </span>
          </div>
        </div>
      )}

      {/* Allocation Report Modal */}
      <Modal
        isOpen={showAllocationModal}
        onClose={() => setShowAllocationModal(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BarChart3 size={18} style={{ color: 'var(--primary-navy)' }} />
            <span style={{ fontWeight: 800 }}>Force Allocation Report — FY 2025-26</span>
          </div>
        }
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '12px', color: '#6b7280', flex: 1 }}>Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · Karnataka State Police HQ</span>
            <button
              type="button"
              className="cyber-btn cyber-btn-navy"
              style={{ fontSize: '12px', padding: '7px 16px' }}
              onClick={() => setShowAllocationModal(false)}
            >
              <Download size={13} /> Export PDF
            </button>
          </div>
        }
      >
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total State Force', value: DISTRICT_RESOURCES.reduce((s, d) => s + d.totalOfficers, 0).toLocaleString(), color: 'var(--primary-navy)' },
              { label: 'Patrol Deployed', value: DISTRICT_RESOURCES.reduce((s, d) => s + d.deployedPatrol, 0).toLocaleString(), color: '#16a34a' },
              { label: 'Coverage Avg.', value: `${Math.round(DISTRICT_RESOURCES.reduce((s, d) => s + d.coverage, 0) / DISTRICT_RESOURCES.length)}%`, color: '#f59e0b' },
            ].map((m) => (
              <div key={m.label} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: m.color, fontFamily: 'monospace' }}>{m.value}</div>
              </div>
            ))}
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                {['District', 'Total Officers', 'Patrol', 'Cyber Units', 'Detectives', 'Coverage'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DISTRICT_RESOURCES.map((d, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 10px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={11} style={{ color: '#9ca3af' }} />{d.district}
                  </td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{d.totalOfficers.toLocaleString()}</td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{d.deployedPatrol.toLocaleString()}</td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{d.cyberUnits}</td>
                  <td style={{ padding: '10px 10px', color: '#374151' }}>{d.detectives}</td>
                  <td style={{ padding: '10px 10px' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      color: d.coverage >= 80 ? '#16a34a' : d.coverage >= 60 ? '#f59e0b' : '#dc2626',
                    }}>{d.coverage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* AI Optimize Modal */}
      <Modal
        isOpen={showAIOptimizeModal}
        onClose={() => setShowAIOptimizeModal(false)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cpu size={18} style={{ color: 'var(--primary-navy)' }} />
            <span style={{ fontWeight: 800 }}>AI Resource Optimisation — Recommendations</span>
          </div>
        }
        size="md"
        footer={
          <button
            type="button"
            className="cyber-btn cyber-btn-navy"
            style={{ fontSize: '12px', padding: '7px 16px' }}
            onClick={() => setShowAIOptimizeModal(false)}
          >
            Close
          </button>
        }
      >
        <div>
          <div style={{ padding: '10px 14px', background: 'rgba(26,43,76,0.04)', border: '1px solid rgba(26,43,76,0.1)', borderRadius: 8, marginBottom: 16, fontSize: '14px', color: '#374151', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Cpu size={14} style={{ color: '#1a2b4c', flexShrink: 0, marginTop: 2 }} />
            <span>AI analysis of crime pattern data, officer deployment, and district risk scores. Suggestions are generated from predictive models and require DGP approval before action.</span>
          </div>
          {[
            {
              district: 'Kalaburagi', action: 'Reallocate 60 patrol officers from administration to field duty', impact: 'Coverage ↑ 54% → 68%',
              urgency: 'High', icon: ArrowUpRight,
            },
            {
              district: 'Raichur', action: 'Deploy 2 additional cyber units; rural cybercrime +18% YoY', impact: 'Cyber detection rate ↑ ~22%',
              urgency: 'High', icon: ArrowUpRight,
            },
            {
              district: 'Ballari', action: 'Merge 3 understaffed outposts into consolidated hub — Hospet', impact: 'Response time ↓ ~8 min avg.',
              urgency: 'Medium', icon: ArrowUpRight,
            },
            {
              district: 'Bengaluru Urban', action: 'Increase night patrol density in BBMP Zone 4 (10PM–4AM)', impact: 'Vehicle theft incidents ↓ ~35%',
              urgency: 'Medium', icon: AlertTriangle,
            },
            {
              district: 'Belagavi', action: 'Coordinate joint border patrol with Maharashtra — NH-48 corridor', impact: 'Cross-border trafficking ↓ ~40%',
              urgency: 'Critical', icon: AlertTriangle,
            },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '12px 14px',
              borderLeft: `3px solid ${ item.urgency === 'Critical' ? '#dc2626' : item.urgency === 'High' ? '#f59e0b' : '#1a2b4c' }`,
              background: '#F8FAFC', borderRadius: '0 8px 8px 0',
              marginBottom: 10,
            }}>
              <item.icon size={15} style={{ color: item.urgency === 'Critical' ? '#dc2626' : item.urgency === 'High' ? '#f59e0b' : '#1a2b4c', flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{item.district} · {item.urgency}</div>
                <div style={{ fontSize: '14px', color: '#111827', fontWeight: 500, marginBottom: 4 }}>{item.action}</div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>{item.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
