'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/GovHeader.tsx
// CrimeVision AI v3.0 — Government Branding Header Strip
// Official Karnataka State Police branding shown on every authenticated page.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import SafeEmblem from './SafeEmblem';

export default function GovHeader() {
  const [textSize, setTextSize] = useState<'small' | 'default' | 'large'>('default');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ksp_text_size') as 'small' | 'default' | 'large' | null;
      if (saved === 'small' || saved === 'default' || saved === 'large') {
        setTextSize(saved);
        applyTextSize(saved);
      }
    } catch {
      // Ignore localStorage block
    }
  }, []);

  const applyTextSize = (size: 'small' | 'default' | 'large') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (size === 'small') {
        root.style.setProperty('--text-scale', '0.9');
      } else if (size === 'default') {
        root.style.setProperty('--text-scale', '1.0');
      } else if (size === 'large') {
        root.style.setProperty('--text-scale', '1.1');
      }
    }
  };

  const handleDecrease = () => {
    const nextSize = textSize === 'large' ? 'default' : 'small';
    setTextSize(nextSize);
    try {
      localStorage.setItem('ksp_text_size', nextSize);
    } catch {}
    applyTextSize(nextSize);
  };

  const handleIncrease = () => {
    const nextSize = textSize === 'small' ? 'default' : 'large';
    setTextSize(nextSize);
    try {
      localStorage.setItem('ksp_text_size', nextSize);
    } catch {}
    applyTextSize(nextSize);
  };

  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderBottom: '3px solid var(--primary-navy)', // Maroon
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
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}>
            Chief Minister Office
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontWeight: 500,
            lineHeight: 1.3,
          }}>
            Government of Karnataka
          </div>
        </div>
      </div>

      {/* Center: Karnataka State Police Logo */}
      <div className="presentation-hidden" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
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
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '0.01em',
          }}>
            Karnataka State Police
          </div>
          <div style={{
            fontSize: 10,
            color: 'var(--text-muted)',
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
        gap: 16,
        flex: '0 0 auto',
      }}>
        {/* TEXT SIZE ADJUSTMENT CONTROL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRight: '1px solid #E5E7EB',
          paddingRight: 16,
          marginRight: 4,
          height: '32px',
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}>
            Text Size
          </span>
          <button
            onClick={handleDecrease}
            disabled={textSize === 'small'}
            aria-label="Decrease text size"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#374151',
              fontSize: '10px',
              fontWeight: 800,
              cursor: textSize === 'small' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: textSize === 'small' ? 0.4 : 1,
              transition: 'all 0.15s ease',
              outline: 'none',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (textSize !== 'small') {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }
            }}
            onMouseLeave={e => {
              if (textSize !== 'small') {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }
            }}
          >
            A−
          </button>
          <button
            onClick={handleIncrease}
            disabled={textSize === 'large'}
            aria-label="Increase text size"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#374151',
              fontSize: '10px',
              fontWeight: 800,
              cursor: textSize === 'large' ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: textSize === 'large' ? 0.4 : 1,
              transition: 'all 0.15s ease',
              outline: 'none',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (textSize !== 'large') {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }
            }}
            onMouseLeave={e => {
              if (textSize !== 'large') {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }
            }}
          >
            A+
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}>
              Home Minister Office
            </div>
            <div style={{
              fontSize: 10,
              color: 'var(--text-muted)',
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
    </div>
  );
}
