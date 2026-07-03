'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/GovHeader.tsx
// CrimeVision AI v2.0 — Government Branding Header Strip
// Official Karnataka State Police branding shown on every authenticated page.
// ─────────────────────────────────────────────────────────────────────────────

import Image from 'next/image';

export default function GovHeader() {
  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderBottom: '3px solid #A6192E',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Left: Chief Minister */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: '0 0 auto',
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #D4A017',
          flexShrink: 0,
        }}>
          <img
            src="/cm-portrait.png"
            alt="Hon'ble Chief Minister"
            width={48}
            height={48}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#1F2937',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}>
            SHRI D.K. SHIVAKUMAR
          </div>
          <div style={{
            fontSize: 10,
            color: '#6B7280',
            fontWeight: 500,
            lineHeight: 1.3,
          }}>
            Hon&apos;ble Chief Minister | Govt. of Karnataka
          </div>
        </div>
      </div>

      {/* Center: Karnataka State Police Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img
            src="/ksp-emblem.png"
            alt="Karnataka State Police Emblem"
            width={50}
            height={50}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 18,
            fontWeight: 800,
            color: '#1F2937',
            lineHeight: 1.1,
            letterSpacing: '0.01em',
          }}>
            Karnataka State Police
          </div>
          <div style={{
            fontSize: 11,
            color: '#6B7280',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            Government of Karnataka
          </div>
        </div>
      </div>

      {/* Right: Home Minister */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: '0 0 auto',
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#1F2937',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}>
            SHRI PRIYANK KHARGE
          </div>
          <div style={{
            fontSize: 10,
            color: '#6B7280',
            fontWeight: 500,
            lineHeight: 1.3,
          }}>
            Hon&apos;ble Home Minister | Govt. of Karnataka
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid #D4A017',
          flexShrink: 0,
        }}>
          <img
            src="/hm-portrait.png"
            alt="Hon'ble Home Minister"
            width={48}
            height={48}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}
