import React from 'react';

export default function GovFooter() {
  return (
    <footer
      style={{
        width: '100%',
        background: '#FFFFFF',
        borderTop: '1px solid #E4EAF2',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: 'auto',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/ksp-emblem.png`}
            alt="Karnataka State Police Emblem"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1B263B' }}>
              Karnataka State Police Intelligence Unit
            </div>
            <div style={{ fontSize: '11px', color: '#6B7280' }}>
              Government of Karnataka
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: '#6B7280' }}>
          <span>System Version: v3.0 (Production)</span>
          <span>•</span>
          <span style={{ color: '#DC2626', fontWeight: 700, letterSpacing: '0.05em' }}>
            RESTRICTED - INTERNAL OFFICIAL USE ONLY
          </span>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #EEF1F6',
          paddingTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#94A3B8',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <span>
          © {new Date().getFullYear()} Government of Karnataka. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Security Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>KSP Helpdesk</a>
        </div>
      </div>
    </footer>
  );
}
