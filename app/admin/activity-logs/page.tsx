'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/admin/activity-logs/page.tsx
// CrimeVision AI v2.0 — Activity / Audit Logs (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { ScrollText, Shield, Clock, Search, Download, Trash } from 'lucide-react';

const SAMPLE_LOGS = [
  { time: '2026-07-03 13:12:45', user: 'DGP Sandeep Nayak', action: 'Viewed State Overview Dashboard', category: 'Navigation', level: 'info', ip: '10.150.12.33' },
  { time: '2026-07-03 13:10:02', user: 'DGP Sandeep Nayak', action: 'Exported Monthly Crime Report (PDF)', category: 'Report', level: 'info', ip: '10.150.12.33' },
  { time: '2026-07-03 12:44:18', user: 'SI Kavitha Murthy', action: 'Updated case status: FIR/2026/BLR/102', category: 'Case Update', level: 'info', ip: '10.152.4.110' },
  { time: '2026-07-03 12:35:21', user: 'DGP Sandeep Nayak', action: 'Added new officer: PI Sandeep Gowda', category: 'User Management', level: 'warning', ip: '10.150.12.33' },
  { time: '2026-07-03 11:30:05', user: 'System Agent', action: 'Predictive risk forecast engine model retrained', category: 'System', level: 'info', ip: 'localhost' },
  { time: '2026-07-03 10:22:18', user: 'DGP Sandeep Nayak', action: 'Reset password credentials for SI Murthy', category: 'User Management', level: 'warning', ip: '10.150.12.33' },
  { time: '2026-07-03 09:15:44', user: 'SI Kavitha Murthy', action: 'Uploaded evidence file: narcotics_report.pdf', category: 'Evidence', level: 'info', ip: '10.152.4.110' },
  { time: '2026-07-03 08:10:30', user: 'System Agent', action: 'High-risk alert triggered: Kalaburagi narcotics spike', category: 'Alert', level: 'critical', ip: 'localhost' },
];

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');

  const handleExport = () => {
    const headers = 'Timestamp,User,Action,Category,Level,IP Address\n';
    const rows = logs.map(l => `"${l.time}","${l.user}","${l.action}","${l.category}","${l.level}","${l.ip}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ksp_audit_logs_${Date.now()}.csv`;
    link.click();
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all active session logs? This action is audited.')) {
      setLogs([{
        time: new Date().toLocaleString(),
        user: 'DGP Sandeep Nayak',
        action: 'Cleared KSP local audit logs registry',
        category: 'User Management',
        level: 'critical',
        ip: '10.150.12.33'
      }]);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        log.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === 'All' || log.category === filterCategory;
    const matchLevel = filterLevel === 'All' || log.level === filterLevel;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#475569' }}>
        <span>Home</span>
        <span>/</span>
        <span>Administration</span>
        <span>/</span>
        <span style={{ color: '#1F2937', fontWeight: 600 }}>Activity Audit Trail</span>
      </div>

      {/* Page Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(166, 25, 46, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ScrollText size={22} style={{ color: '#A6192E' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              KSP System Activity Logs
            </h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Immutable audit logs tracking officer queries, logins, edits, and system alerts.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleExport}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
              background: '#FFFFFF', color: '#1E3A5F', border: '1px solid #1E3A5F', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button 
            onClick={handleClearLogs}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
              background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Trash size={14} /> Clear Log
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        padding: 16, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 16, flexWrap: 'wrap',
        marginBottom: 20, alignItems: 'center'
      }}>
        
        {/* Search Input */}
        <div className="input-with-icon" style={{ flex: 1, minWidth: 200 }}>
          <Search size={14} color="#6B7280" className="icon" />
          <input 
            type="text" 
            placeholder="Search logs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', fontWeight: 700, textTransform: 'uppercase' }}>Category:</span>
          {['All', 'Navigation', 'Report', 'Case Update', 'User Management', 'Evidence'].map(c => (
            <button
              key={c}
              onClick={() => setFilterCategory(c)}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${filterCategory === c ? '#0F6B5C' : '#E5E7EB'}`,
                background: filterCategory === c ? 'rgba(15, 107, 92, 0.08)' : '#FFFFFF',
                color: filterCategory === c ? '#0F6B5C' : '#475569', transition: 'all 0.15s'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 'auto' }}>
          <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', fontWeight: 700, textTransform: 'uppercase' }}>Severity:</span>
          {['All', 'info', 'warning', 'critical'].map(l => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${filterLevel === l ? '#0F6B5C' : '#E5E7EB'}`,
                background: filterLevel === l ? 'rgba(15, 107, 92, 0.08)' : '#FFFFFF',
                color: filterLevel === l ? '#0F6B5C' : '#475569', transition: 'all 0.15s'
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table Data */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>User</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Action Detail</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index}>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{log.time}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{log.ip}</td>
                <td style={{ fontWeight: 600 }}>{log.user}</td>
                <td>{log.category}</td>
                <td>
                  <span style={{
                    fontSize: 10, padding: '3px 8px', borderRadius: 4, fontWeight: 800, textTransform: 'uppercase',
                    background: log.level === 'critical' ? '#FEE2E2' : log.level === 'warning' ? '#FEF3C7' : '#E0F2FE',
                    color: log.level === 'critical' ? '#991B1B' : log.level === 'warning' ? '#92400E' : '#1976D2',
                    border: `1px solid ${log.level === 'critical' ? '#FCA5A5' : log.level === 'warning' ? '#FDE68A' : '#BAE6FD'}`
                  }}>
                    {log.level}
                  </span>
                </td>
                <td style={{ color: '#1F2937' }}>{log.action}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>
                  No audit trail logs match your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
