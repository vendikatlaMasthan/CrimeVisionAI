'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/GovHeader.tsx
// CrimeVision AI v3.0 — Government Branding Header Strip
// Official Karnataka State Police branding shown on every authenticated page.
// ─────────────────────────────────────────────────────────────────────────────

import { UserCircle } from 'lucide-react';
import SafeEmblem from './SafeEmblem';

export default function GovHeader() {
  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderBottom: '3px solid var(--alert-red)',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    }}>
      
      {/* Left: Emblem and App Logo Wordmark */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <SafeEmblem width={48} height={48} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div className="logo-wordmark" style={{
            fontSize: 20,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}>
            CrimeVision AI
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '2px',
          }}>
            Karnataka State Police · Prototype
          </div>
        </div>
      </div>

      {/* Right: Restricted Security Classification Label */}
      <div style={{
        marginLeft: 'auto',
        fontSize: '10px',
        color: 'var(--alert-red)',
        fontWeight: 800,
        border: '1.5px solid var(--alert-red)',
        padding: '3px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        Restricted
      </div>
    </div>
  );
}
