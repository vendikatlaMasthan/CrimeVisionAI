'use client';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerName: string;
  actionTaken: string;
  resourceId: string;
}

const DEFAULT_LOGS: AuditLogEntry[] = [
  { id: 'LOG-001', timestamp: '2026-07-03 09:12:05', officerName: 'Commissioner B. Dayananda', actionTaken: 'Approved tactical unit reinforcement', resourceId: 'RES-BGL-04' },
  { id: 'LOG-002', timestamp: '2026-07-03 09:44:12', officerName: 'DySP Sandeep Patil', actionTaken: 'Reviewed Kalaburagi checkpost logs', resourceId: 'CASE-2026-092' },
  { id: 'LOG-003', timestamp: '2026-07-03 10:15:30', officerName: 'Commissioner B. Dayananda', actionTaken: 'Approved drone deployment authorization', resourceId: 'RES-KLA-12' },
  { id: 'LOG-004', timestamp: '2026-07-03 11:02:18', officerName: 'Inspector Shruthi K.', actionTaken: 'Reviewed suspect communication pattern dossier', resourceId: 'NET-OFF-82' },
  { id: 'LOG-005', timestamp: '2026-07-03 12:20:44', officerName: 'Commissioner B. Dayananda', actionTaken: 'Approved emergency response force dispatch', resourceId: 'RES-MYS-01' },
];

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === 'undefined') return DEFAULT_LOGS;
  const stored = localStorage.getItem('ksp_audit_logs');
  if (!stored) {
    localStorage.setItem('ksp_audit_logs', JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_LOGS;
  }
}

export function logOfficerAction(actionTaken: string, resourceId: string) {
  if (typeof window === 'undefined') return;
  const currentLogs = getAuditLogs();
  
  // Try to grab logged in user details
  let officerName = 'System Operator';
  try {
    const rawUser = sessionStorage.getItem('ksp_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      officerName = u.name || officerName;
    }
  } catch {}

  const newEntry: AuditLogEntry = {
    id: `LOG-${(currentLogs.length + 1).toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    officerName,
    actionTaken,
    resourceId,
  };

  const updated = [newEntry, ...currentLogs];
  localStorage.setItem('ksp_audit_logs', JSON.stringify(updated));

  // Trigger custom event so other pages/tabs can update
  window.dispatchEvent(new Event('ksp_audit_log_updated'));
}
