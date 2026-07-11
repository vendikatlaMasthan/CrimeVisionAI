'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/admin/officers/page.tsx
// CrimeVision AI v2.0 — Officer Management (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { Users, Plus, Search, UserCheck, UserX, Trash2, Key, X, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DISTRICTS } from '@/lib/crimeData';
import Modal from '@/components/Modal';

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

interface FormErrors {
  name?: string;
  station?: string;
  email?: string;
}

interface GeneratedCredentials {
  officerName: string;
  badgeId: string;
  username: string;
  tempPassword: string;
}

const INITIAL_OFFICERS: Officer[] = [
  { id: '1', name: 'Sandeep Nayak', badgeId: 'PI2026001', rank: 'Inspector', district: 'Bengaluru Urban', policeStation: 'Koramangala PS', status: 'Active', email: 'sandeep.nayak@ksp.gov.in' },
  { id: '2', name: 'Kavitha Murthy', badgeId: 'PI2026002', rank: 'Sub-Inspector', district: 'Kalaburagi', policeStation: 'Station Bazar PS', status: 'Active', email: 'kavitha.murthy@ksp.gov.in' },
  { id: '3', name: 'Manjunath Gowda', badgeId: 'PI2026003', rank: 'Constable', district: 'Ballari', policeStation: 'Gandhinagar PS', status: 'Inactive', email: 'manjunath.gowda@ksp.gov.in' },
  { id: '4', name: 'Priyanka Patil', badgeId: 'PI2026004', rank: 'Inspector', district: 'Belagavi', policeStation: 'Khade Bazar PS', status: 'Active', email: 'priyanka.patil@ksp.gov.in' },
  { id: '5', name: 'Ramesh Kumar', badgeId: 'PI2026005', rank: 'Sub-Inspector', district: 'Mysuru', policeStation: 'Lashkar PS', status: 'Active', email: 'ramesh.kumar@ksp.gov.in' },
];

function makeBadgeId() {
  return `PI2026${Math.floor(1000 + Math.random() * 9000)}`;
}

function makeTempPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghjkmnpqrstuvwxyz';
  const digits = '23456789';
  const symbols = '!@#\$%';
  const all = upper + lower + digits + symbols;
  let pass =
    upper[Math.floor(Math.random() * upper.length)] +
    lower[Math.floor(Math.random() * lower.length)] +
    digits[Math.floor(Math.random() * digits.length)] +
    symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 0; i < 8; i++) {
    pass += all[Math.floor(Math.random() * all.length)];
  }
  return pass.split('').sort(() => Math.random() - 0.5).join('');
}

function toUsername(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '');
}

export default function OfficerManagementPage() {
  const [officers, setOfficers] = useState<Officer[]>(INITIAL_OFFICERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState<Officer | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState('Sub-Inspector');
  const [newDistrict, setNewDistrict] = useState('Bengaluru Urban');
  const [newStation, setNewStation] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    if (!newName.trim()) {
      errors.name = 'Officer full name is required.';
    } else if (newName.trim().split(/\s+/).length < 2) {
      errors.name = 'Please enter both first and last name.';
    }
    if (!newStation.trim()) {
      errors.station = 'Police station assignment is required.';
    }
    if (!newEmail.trim()) {
      errors.email = 'Official email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      errors.email = 'Enter a valid email address.';
    } else if (!newEmail.toLowerCase().endsWith('@ksp.gov.in')) {
      errors.email = 'Email must be an official @ksp.gov.in address.';
    }
    return errors;
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const badgeId = makeBadgeId();
    const tempPassword = makeTempPassword();
    const username = toUsername(newName);

    const newOfficer: Officer = {
      id: Date.now().toString(),
      name: newName.trim(),
      badgeId,
      rank: newRank,
      district: newDistrict,
      policeStation: newStation.trim(),
      status: 'Active',
      email: newEmail.trim().toLowerCase(),
    };

    setOfficers((prev) => [...prev, newOfficer]);
    setShowAddModal(false);
    setGeneratedCredentials({ officerName: newName.trim(), badgeId, username, tempPassword });

    // Clear form
    setNewName('');
    setNewStation('');
    setNewEmail('');
    setNewRank('Sub-Inspector');
    setNewDistrict('Bengaluru Urban');
  };

  const handleDeleteOfficer = (id: string) => {
    if (confirm('Are you sure you want to remove this officer?')) {
      setOfficers(officers.filter((o) => o.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setOfficers(
      officers.map((o) => (o.id === id ? { ...o, status: o.status === 'Active' ? 'Inactive' : 'Active' } : o))
    );
  };

  const triggerPasswordReset = (officer: Officer) => {
    setGeneratedPassword(makeTempPassword());
    setShowPasswordResetModal(officer);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const filteredOfficers = officers.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.badgeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.policeStation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputBase = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: `1px solid ${hasError ? '#DC2626' : '#D1D5DB'}`,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    background: hasError ? '#FFF5F5' : '#FFFFFF',
    transition: 'border-color 0.15s ease',
  });

  const errMsg: React.CSSProperties = {
    fontSize: 11, color: '#DC2626', marginTop: 4,
    display: 'flex', alignItems: 'center', gap: 4,
  };

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#475569' }}>
        <span>Home</span><span>/</span><span>Administration</span><span>/</span>
        <span style={{ color: '#1F2937', fontWeight: 600 }}>Officer Management</span>
      </div>

      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(166, 25, 46, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} style={{ color: '#A6192E' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>Officer Account Management</h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>Deploy, configure, and audit Karnataka State Police officer credential access.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} /> Add Officer Account
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ padding: 16, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
        <div className="input-with-icon" style={{ flex: 1 }}>
          <Search size={16} color="#6B7280" className="icon" />
          <input
            type="text"
            placeholder="Search officers by name, badge ID, station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Badge ID</th><th>Officer Name</th><th>Rank</th>
              <th>Station &amp; District</th><th>Email</th><th>Account Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.map((officer) => (
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
                    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px',
                    borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: officer.status === 'Active' ? '#D1FAE5' : '#F3F4F6',
                    color: officer.status === 'Active' ? '#065F46' : '#374151',
                    border: `1px solid ${officer.status === 'Active' ? '#A7F3D0' : '#E5E7EB'}`,
                  }}>
                    {officer.status === 'Active' ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 8 }}>
                    <button type="button" onClick={() => toggleStatus(officer.id)} title={officer.status === 'Active' ? 'Disable Account' : 'Enable Account'} style={{ padding: 6, background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#475569' }}>
                      {officer.status === 'Active' ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button type="button" onClick={() => triggerPasswordReset(officer)} title="Reset Password" style={{ padding: 6, background: '#F3F4F6', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#475569' }}>
                      <Key size={14} />
                    </button>
                    <button type="button" onClick={() => handleDeleteOfficer(officer.id)} title="Delete Account" style={{ padding: 6, background: '#FEE2E2', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#991B1B' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOfficers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>No officers match your search query.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Officer Modal ── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setFormErrors({}); }}
        title={
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: '0 0 3px' }}>Add New KSP Officer Account</h2>
            <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontWeight: 'normal' }}>All fields are required. Credentials will be generated automatically.</p>
          </div>
        }
        size="md"
      >
        {/* noValidate suppresses browser native popups — all validation handled in JS */}
        <form onSubmit={handleAddOfficer} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
              Officer Full Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setFormErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="e.g. Sandeep Nayak"
              style={inputBase(!!formErrors.name)}
            />
            {formErrors.name && <div style={errMsg}><AlertTriangle size={11} /> {formErrors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Rank</label>
              <select value={newRank} onChange={(e) => setNewRank(e.target.value)} style={inputBase()}>
                {['Inspector', 'Sub-Inspector', 'Constable'].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>District</label>
              <select value={newDistrict} onChange={(e) => setNewDistrict(e.target.value)} style={inputBase()}>
                {DISTRICTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
              Police Station Assignment <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={newStation}
              onChange={(e) => { setNewStation(e.target.value); setFormErrors((p) => ({ ...p, station: undefined })); }}
              placeholder="e.g. Koramangala PS"
              style={inputBase(!!formErrors.station)}
            />
            {formErrors.station && <div style={errMsg}><AlertTriangle size={11} /> {formErrors.station}</div>}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>
              Official Email <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value); setFormErrors((p) => ({ ...p, email: undefined })); }}
              placeholder="name@ksp.gov.in"
              style={inputBase(!!formErrors.email)}
            />
            {formErrors.email
              ? <div style={errMsg}><AlertTriangle size={11} /> {formErrors.email}</div>
              : <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Must be an official @ksp.gov.in address</div>
            }
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6, borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
            <button type="button" onClick={() => { setShowAddModal(false); setFormErrors({}); }} style={{ padding: '10px 18px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '10px 22px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              <Key size={14} /> Generate Credentials
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Credentials Reveal Modal ── */}
      <Modal
        isOpen={!!generatedCredentials}
        onClose={() => { setGeneratedCredentials(null); setCopiedField(null); }}
        title={
          generatedCredentials ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={20} style={{ color: '#059669' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: '0 0 2px' }}>Account Created Successfully</h2>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0, fontWeight: 'normal' }}>{generatedCredentials.officerName} · {generatedCredentials.badgeId}</p>
              </div>
            </div>
          ) : null
        }
        size="md"
        footer={
          <button type="button" onClick={() => { setGeneratedCredentials(null); setCopiedField(null); }} style={{ width: '100%', padding: '11px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Close &amp; Secure Credentials
          </button>
        }
      >
        {generatedCredentials && (
          <div>
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                System-Generated Credentials
              </div>

              {/* Badge ID row */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>Badge ID</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 7, padding: '8px 12px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1E3A5F', fontSize: 15 }}>{generatedCredentials.badgeId}</span>
                  <button type="button" onClick={() => copyToClipboard(generatedCredentials.badgeId, 'badgeId')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedField === 'badgeId' ? '#059669' : '#9CA3AF', padding: 2 }}>
                    {copiedField === 'badgeId' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Username row */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>System Username</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 7, padding: '8px 12px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#374151', fontSize: 14 }}>{generatedCredentials.username}@ksp.gov.in</span>
                  <button type="button" onClick={() => copyToClipboard(`${generatedCredentials.username}@ksp.gov.in`, 'username')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedField === 'username' ? '#059669' : '#9CA3AF', padding: 2 }}>
                    {copiedField === 'username' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Temp password row */}
              <div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>
                  Temporary Password <span style={{ color: '#DC2626' }}>— expires in 24h</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: 7, padding: '8px 12px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#DC2626', fontSize: 15, letterSpacing: '0.04em' }}>{generatedCredentials.tempPassword}</span>
                  <button type="button" onClick={() => copyToClipboard(generatedCredentials.tempPassword, 'password')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedField === 'password' ? '#059669' : '#9CA3AF', padding: 2 }}>
                    {copiedField === 'password' ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'start', gap: 8, padding: '10px 12px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 12, color: '#92400E' }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>Share these credentials securely. The officer must change their password on first login. This dialog cannot be reopened.</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Password Reset Modal ── */}
      <Modal
        isOpen={!!showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(null)}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Key size={20} color="#D97706" />
            <span>Password Reset Completed</span>
          </div>
        }
        size="sm"
        footer={
          <button type="button" onClick={() => setShowPasswordResetModal(null)} style={{ width: '100%', padding: '10px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Close &amp; Copy Credentials
          </button>
        }
      >
        {showPasswordResetModal && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 18, marginTop: 0 }}>
              Credential access has been refreshed for <strong>{showPasswordResetModal.name}</strong> ({showPasswordResetModal.badgeId}).
            </p>
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#1E3A5F', letterSpacing: '0.05em' }}>
              {generatedPassword}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
