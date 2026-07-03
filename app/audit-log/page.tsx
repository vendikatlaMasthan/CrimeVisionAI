'use client';

import { useState, useEffect } from 'react';
import { 
  ClipboardList, Search, ArrowUpDown, Calendar, User, ShieldAlert 
} from 'lucide-react';
import { getAuditLogs, AuditLogEntry } from '@/lib/auditLogger';
import SimulationBanner from '@/components/SimulationBanner';
import { SearchInput } from '@/components/SearchInput';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filterOfficer, setFilterOfficer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  // Load logs on mount and listen to changes
  useEffect(() => {
    setLogs(getAuditLogs());

    const handleUpdate = () => {
      setLogs(getAuditLogs());
    };
    window.addEventListener('ksp_audit_log_updated', handleUpdate);
    return () => {
      window.removeEventListener('ksp_audit_log_updated', handleUpdate);
    };
  }, []);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesOfficer = filterOfficer === '' || log.officerName.toLowerCase().includes(filterOfficer.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      log.actionTaken.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOfficer && matchesSearch;
  });

  // Sort logs by timestamp
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  // Get unique officers for dropdown
  const uniqueOfficers = Array.from(new Set(logs.map(log => log.officerName)));

  return (
    <div className="animate-page-fade" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', background: 'var(--bg-app)' }}>
      
      {/* Simulation Banner */}
      <SimulationBanner />

      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-page-title)', fontWeight: 900, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ClipboardList size={28} style={{ color: 'var(--primary-navy)' }} />
            System Audit Trail
          </h1>
          <p style={{ fontSize: 'var(--font-label)', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Append-only verification ledger of all officer decisions, resource deployments, and AI interdiction logs.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(11, 31, 58, 0.04)', border: '1px solid var(--border-default)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--primary-navy)' }}>
          <ShieldAlert size={14} /> Cryptographic Chain ACTIVE
        </div>
      </div>

      {/* Filters / Search panel */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          
          {/* Search bar */}
          <div style={{ flex: '1 1 300px' }}>
            <SearchInput
              placeholder="Search actions, case IDs, log references..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {/* Officer filter */}
          <div style={{ flex: '0 1 240px' }}>
            <select
              value={filterOfficer}
              onChange={e => setFilterOfficer(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">👤 Filter by Officer (All)</option>
              {uniqueOfficers.map(officer => (
                <option key={officer} value={officer}>{officer}</option>
              ))}
            </select>
          </div>

          {/* Sort toggle button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="cyber-btn"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--neutral-white)',
              border: '1.5px solid var(--border-default)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '38px',
            }}
          >
            <ArrowUpDown size={14} />
            Sort: {sortAsc ? 'Oldest First' : 'Newest First'}
          </button>
        </div>
      </div>

      {/* Audit log table container */}
      <div className="glass-card" style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: 'rgba(11, 31, 58, 0.02)', borderBottom: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>
              <th style={{ padding: '16px 20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log Hash</th>
              <th style={{ padding: '16px 20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</th>
              <th style={{ padding: '16px 20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Executing Officer</th>
              <th style={{ padding: '16px 20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Taken</th>
              <th style={{ padding: '16px 20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Affected Ref</th>
            </tr>
          </thead>
          <tbody>
            {sortedLogs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px 20px', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>
                  No audit log entries found matching the specified filters.
                </td>
              </tr>
            ) : (
              sortedLogs.map((log, index) => (
                <tr 
                  key={log.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-default)', 
                    background: index % 2 === 0 ? '#FFFFFF' : 'rgba(11, 31, 58, 0.01)',
                  }}
                >
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {log.id}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} className="text-slate-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={12} className="text-slate-400" />
                      {log.officerName}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {log.actionTaken}
                  </td>
                  <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-navy)' }}>
                    {log.resourceId}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
