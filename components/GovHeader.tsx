'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/GovHeader.tsx
// CrimeVision AI v3.0 — Government Branding Header Strip
// Official Karnataka State Police branding shown on every authenticated page.
// ─────────────────────────────────────────────────────────────────────────────

import { User } from 'lucide-react';

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
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}>
      
      {/* Left: Chief Minister Office */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flex: '0 0 auto',
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#F3F4F6',
          border: '1px solid #D1D5DB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <User size={22} style={{ color: '#4B5563' }} />
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
            Chief Minister Office
          </div>
          <div style={{
            fontSize: 10,
            color: '#6B7280',
            fontWeight: 500,
            lineHeight: 1.3,
          }}>
            Government of Karnataka
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/ksp-emblem.png`}
            alt="Karnataka State Police Emblem"
            width={50}
            height={50}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#1F2937',
            lineHeight: 1.1,
            letterSpacing: '0.01em',
          }}>
            Karnataka State Police
          </div>
          <div style={{
            fontSize: 10,
            color: '#6B7280',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}>
            Government of Karnataka
          </div>
        </div>
      </div>

      {/* Right: Home Minister Office */}
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
            Home Minister Office
          </div>
          <div style={{
            fontSize: 10,
            color: '#6B7280',
            fontWeight: 500,
            lineHeight: 1.3,
          }}>
            Government of Karnataka
          </div>
        </div>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: '#F3F4F6',
          border: '1px solid #D1D5DB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <User size={22} style={{ color: '#4B5563' }} />
        </div>
      </div>
    </div>
  );
}
