'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/admin/officers/page.tsx
// CrimeVision AI v2.0 — Officer Management (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Users, Plus, Search, Shield, UserCheck, UserX, Trash2, Key, Edit, X } from 'lucide-react';
import { DISTRICTS } from '@/lib/crimeData';

interface Officer {
  id: string;
  name: string;
  badgeId: string;
  rank: string;
  district: string;
  policeStation: string;
  status: 'Active' | 'Inactive';
  email: string;
}

const INITIAL_OFFICERS: Officer[] = [
  { id: '1', name: 'Sandeep Nayak', badgeId: 'PI2026001', rank: 'Inspector', district: 'Bengaluru Urban', policeStation: 'Koramangala PS', status: 'Active', email: 'sandeep.nayak@ksp.gov.in' },
  { id: '2', name: 'Kavitha Murthy', badgeId: 'PI2026002', rank: 'Sub-Inspector', district: 'Kalaburagi', policeStation: 'Station Bazar PS', status: 'Active', email: 'kavitha.murthy@ksp.gov.in' },
  { id: '3', name: 'Manjunath Gowda', badgeId: 'PI2026003', rank: 'Constable', district: 'Ballari', policeStation: 'Gandhinagar PS', status: 'Inactive', email: 'manjunath.gowda@ksp.gov.in' },
  { id: '4', name: 'Priyanka Patil', badgeId: 'PI2026004', rank: 'Inspector', district: 'Belagavi', policeStation: 'Khade Bazar PS', status: 'Active', email: 'priyanka.patil@ksp.gov.in' },
  { id: '5', name: 'Ramesh Kumar', badgeId: 'PI2026005', rank: 'Sub-Inspector', district: 'Mysuru', policeStation: 'Lashkar PS', status: 'Active', email: 'ramesh.kumar@ksp.gov.in' },
];

export default function OfficerManagementPage() {
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState<Officer | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState('Sub-Inspector');
  const [newDistrict, setNewDistrict] = useState('Bengaluru Urban');
  const [newStation, setNewStation] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const generateBadgeId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `PI2026${num}`;
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newStation || !newEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    const newOfficer: Officer = {
      id: Date.now().toString(),
      name: newName,
      badgeId: generateBadgeId(),
      rank: newRank,
      district: newDistrict,
      policeStation: newStation,
      status: 'Active',
      email: newEmail
    };

    setOfficers([...officers, newOfficer]);
    setShowAddModal(false);
    
    // Clear form
    setNewName('');
    setNewStation('');
    setNewEmail('');
  };

  const handleDeleteOfficer = (id: string) => {
    if (confirm('Are you sure you want to remove this officer?')) {
      setOfficers(officers.filter(o => o.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setOfficers(officers.map(o => {
      if (o.id === id) {
        return { ...o, status: o.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return o;
    }));
  };

  const triggerPasswordReset = (officer: Officer) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
    setShowPasswordResetModal(officer);
  };

  const filteredOfficers = officers.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.badgeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.policeStation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#475569' }}>
        <span>Home</span>
        <span>/</span>
        <span>Administration</span>
        <span>/</span>
        <span style={{ color: '#1F2937', fontWeight: 600 }}>Officer Management</span>
      </div>

      {/* Page Title & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(166, 25, 46, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Users size={22} style={{ color: '#A6192E' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Officer Account Management
            </h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Deploy, configure, and audit Karnataka State Police officer credential access.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
            background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
          }}
        >
          <Plus size={16} /> Add Officer Account
        </button>
      </div>

      {/* Control Bar */}
      <div style={{
        padding: 16, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 12, alignItems: 'center',
        marginBottom: 20
      }}>
        <div className="input-with-icon" style={{ flex: 1 }}>
          <Search size={16} color="#6B7280" className="icon" />
          <input 
            type="text"
            placeholder="Search officers by name, badge ID, station..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 8,
              border: '1px solid #D1D5DB', fontSize: 13, outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Table Data */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Badge ID</th>
              <th>Officer Name</th>
              <th>Rank</th>
              <th>Station &amp; District</th>
              <th>Email</th>
              <th>Account Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.map(officer => (
              <tr key={officer.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E3A5F' }}>{officer.badgeId}</td>
                <td style={{ fontWeight: 600, color: '#1F2937' }}>{officer.name}</td>
                <td>{officer.rank}</td>
                <td>
                  <div>{officer.policeStation}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{officer.district}</div>
                </td>
                <td style={{ fontSize: 13 }}>{officer.email}</td>
                <td>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: officer.status === 'Active' ? '#D1FAE5' : '#F3F4F6',
                    color: officer.status === 'Active' ? '#065F46' : '#374151',
                    border: `1px solid ${officer.status === 'Active' ? '#A7F3D0' : '#E5E7EB'}`
                  }}>
                    {officer.status === 'Active' ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 8 }}>
                    <button 
                      onClick={() => toggleStatus(officer.id)}
                      title={officer.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                      style={{ padding: 6, background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#475569' }}
                    >
                      {officer.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button 
                      onClick={() => triggerPasswordReset(officer)}
                      title="Reset Password"
                      style={{ padding: 6, background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#475569' }}
                    >
                      <Key size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteOfficer(officer.id)}
                      title="Delete Account"
                      style={{ padding: 6, background: '#FEE2E2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#991B1B' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOfficers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>
                  No officers match your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 16, width: 480, padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>Add New KSP Officer Account</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddOfficer} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Officer Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. sandeep nayak"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Rank</label>
                  <select 
                    value={newRank}
                    onChange={e => setNewRank(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, background: '#FFFFFF' }}
                  >
                    {['Inspector', 'Sub-Inspector', 'Constable'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>District</label>
                  <select 
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value)}
                    style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, background: '#FFFFFF' }}
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Police Station Assignment</label>
                <input 
                  type="text" 
                  value={newStation}
                  onChange={e => setNewStation(e.target.value)}
                  placeholder="e.g. Koramangala PS"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Official Email</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="name@ksp.gov.in"
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13 }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 16px', background: '#F3F4F6', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '10px 20px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordResetModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 16, width: 400, padding: 24,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center'
          }}>
            <Shield size={36} color="#D97706" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: '0 0 8px' }}>Password Successfully Reset</h2>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 18 }}>
              Credential access has been refreshed for <strong>{showPasswordResetModal.name}</strong> ({showPasswordResetModal.badgeId}).
            </p>
            
            <div style={{
              background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: 12,
              fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#1E3A5F',
              letterSpacing: '0.05em', marginBottom: 20
            }}>
              {generatedPassword}
            </div>

            <button 
              onClick={() => setShowPasswordResetModal(null)}
              style={{
                width: '100%', padding: '10px', background: '#1E3A5F', color: '#FFFFFF',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Close &amp; Copy Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
