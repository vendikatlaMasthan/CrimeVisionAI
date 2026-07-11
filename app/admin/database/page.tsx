'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/admin/database/page.tsx
// CrimeVision AI v2.0 — Database Management (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Database, Upload, Search, FileText, Users, AlertTriangle, Package, Check, RefreshCw } from 'lucide-react';
import { RECENT_FIRS, TOP_SUSPECTS } from '@/lib/crimeData';

interface EvidenceItem {
  id: string;
  firNumber: string;
  type: string;
  custodian: string;
  location: string;
  status: string;
}

const INITIAL_EVIDENCE: EvidenceItem[] = [
  { id: '1', firNumber: 'FIR/2026/BLR/101', type: 'CCTV footage hard drive', custodian: 'Inspector Sandeep Nayak', location: 'Locker A-12', status: 'Secured' },
  { id: '2', firNumber: 'FIR/2026/BLR/102', type: '8.2kg Narcotics packaging', custodian: 'SI Kavitha Murthy', location: 'Narcotics Vault', status: 'Secured' },
  { id: '3', firNumber: 'FIR/2026/MYS/201', type: 'Organized syndicate call transcripts', custodian: 'Inspector Priyanka Patil', location: 'Digital Server B', status: 'Secured' },
  { id: '4', firNumber: 'FIR/2026/BEL/304', type: 'Monsoon landslide geotag logs', custodian: 'Ramesh Kumar', location: 'Locker C-4', status: 'Secured' },
];

export default function DatabaseManagementPage() {
  const [activeTab, setActiveTab] = useState<'fir' | 'suspect' | 'evidence'>('fir');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Backup / Restore States
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  // File Upload State
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedRecords, setUploadedRecords] = useState<number | null>(null);

  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    }, 2000);
  };

  const handleRestore = () => {
    setIsRestoring(true);
    setRestoreSuccess(false);
    setTimeout(() => {
      setIsRestoring(false);
      setRestoreSuccess(true);
      setTimeout(() => setRestoreSuccess(false), 3000);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploadingFile(true);
    setUploadedRecords(null);
    setTimeout(() => {
      setUploadingFile(false);
      setUploadedRecords(Math.floor(50 + Math.random() * 200));
    }, 1500);
  };

  const filteredFIRs = RECENT_FIRS.filter(f => 
    f.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.crimeType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuspects = TOP_SUSPECTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvidence = INITIAL_EVIDENCE.filter(e => 
    e.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.custodian.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#475569' }}>
        <span>Home</span>
        <span>/</span>
        <span>Administration</span>
        <span>/</span>
        <span style={{ color: '#1F2937', fontWeight: 600 }}>Database Console</span>
      </div>

      {/* Page Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(166, 25, 46, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Database size={22} style={{ color: '#A6192E' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Database &amp; Records Management
            </h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Query, back up, and import state police digital records.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleBackup}
            disabled={isBackingUp}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
              background: '#FFFFFF', color: '#1E3A5F', border: '1px solid #1E3A5F', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            {isBackingUp ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Database size={14} />}
            {backupSuccess ? 'Backup Complete' : 'Backup Database'}
          </button>
          <button 
            onClick={handleRestore}
            disabled={isRestoring}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
              background: '#FFFFFF', color: '#1E3A5F', border: '1px solid #1E3A5F', borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}
          >
            {isRestoring ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={14} />}
            {restoreSuccess ? 'Restore Complete' : 'Restore Database'}
          </button>
        </div>
      </div>

      {/* Database Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { icon: FileText, label: 'FIR Records', count: '82,089 records', color: '#2E8B57' },
          { icon: AlertTriangle, label: 'Criminal Profiles', count: '15,432 files', color: '#DC2626' },
          { icon: Package, label: 'Evidence Logs', count: '23,891 items', color: '#D97706' },
        ].map(db => (
          <div key={db.label} style={{
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${db.color}10`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <db.icon size={18} style={{ color: db.color }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{db.label}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>{db.count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher & Upload Block */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        
        {/* Left Side: Tables Console */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Navigation Tab strip */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 16px' }}>
            {[
              { id: 'fir', label: 'FIR Registry', count: filteredFIRs.length },
              { id: 'suspect', label: 'Suspect Profiles', count: filteredSuspects.length },
              { id: 'evidence', label: 'Evidence Logs', count: filteredEvidence.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                style={{
                  padding: '14px 20px', border: 'none', background: 'transparent',
                  borderBottom: activeTab === tab.id ? '2px solid #1E3A5F' : '2px solid transparent',
                  color: activeTab === tab.id ? '#1E3A5F' : '#475569',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8
                }}
              >
                {tab.label}
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 10, background: '#E5E7EB', color: '#475569' }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table Search */}
          <div style={{ padding: 14, borderBottom: '1px solid #E5E7EB' }}>
            <div className="input-with-icon">
              <Search size={14} color="#6B7280" className="icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search records in active registry...`}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
              />
            </div>
          </div>

          {/* Content Tables */}
          {activeTab === 'fir' && (
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>FIR Number</th>
                  <th>District</th>
                  <th>Crime Category</th>
                  <th>Date Filed</th>
                  <th>Assigned Officer</th>
                </tr>
              </thead>
              <tbody>
                {filteredFIRs.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{f.firNumber}</td>
                    <td>{f.district}</td>
                    <td>{f.crimeType}</td>
                    <td>{f.date}</td>
                    <td>{f.assignedOfficer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'suspect' && (
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Name / Alias</th>
                  <th>District</th>
                  <th>Crime category</th>
                  <th>Case count</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuspects.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1F2937' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>Alias: "{s.alias}"</div>
                    </td>
                    <td>{s.district}</td>
                    <td>{s.crimeType}</td>
                    <td>{s.firCount} cases</td>
                    <td style={{ fontWeight: 800, color: s.riskScore > 80 ? '#ef4444' : '#f59e0b' }}>
                      {s.riskScore}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'evidence' && (
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Case File</th>
                  <th>Evidence Details</th>
                  <th>Custodian</th>
                  <th>Vault Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvidence.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: 'monospace' }}>{e.firNumber}</td>
                    <td style={{ fontWeight: 600 }}>{e.type}</td>
                    <td>{e.custodian}</td>
                    <td>{e.location}</td>
                    <td>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Side: CSV File Upload Block */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F0FDF4', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Upload size={20} color="#059669" />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginBottom: 4 }}>Import Datasets</h3>
          <p style={{ fontSize: 11, color: '#475569', marginBottom: 16 }}>
            Upload CSV/Excel file to sync local crime records.
          </p>

          <label style={{
            display: 'block', padding: '10px 14px', background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: 8,
            cursor: 'pointer', fontSize: 12, color: '#1E3A5F', fontWeight: 600
          }}>
            {uploadingFile ? 'Uploading dataset...' : 'Choose File to Import'}
            <input type="file" onChange={handleFileUpload} accept=".csv,.xlsx" style={{ display: 'none' }} />
          </label>

          {uploadedRecords !== null && (
            <div style={{ marginTop: 14, padding: 10, background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#065F46' }}>
              <Check size={14} />
              Import complete: {uploadedRecords} records merged.
            </div>
          )}
        </div>
      </div>
      
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
