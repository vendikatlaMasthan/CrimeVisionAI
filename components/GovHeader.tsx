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
  // Numeric scale levels: 70 → 80 → 90 → 100 → 110 → 120 → 130 → 140
  const SCALES = [70, 80, 90, 100, 110, 120, 130, 140];
  const DEFAULT_SCALE = 100;
  const [scale, setScale] = useState<number>(DEFAULT_SCALE);

  useEffect(() => {
    // 1. Initial scale setup
    try {
      const saved = localStorage.getItem('ksp_text_scale_v2');
      const parsed = saved ? parseInt(saved, 10) : NaN;
      const resolved = SCALES.includes(parsed) ? parsed : DEFAULT_SCALE;
      setScale(resolved);
      applyScale(resolved);
    } catch {
      // Ignore localStorage errors
    }

    // 2. Setup MutationObserver to dynamically scale inline styles (fontSize)
    if (typeof document === 'undefined') return;

    let observer: MutationObserver | null = null;

    const processElement = (el: HTMLElement) => {
      // Skip SVG elements or Lucide icons to prevent scaling issues with icons
      if (el.tagName === 'svg' || el.tagName === 'path' || el.closest('svg')) {
        return;
      }

      const styleAttr = el.getAttribute('style');
      if (styleAttr && styleAttr.includes('font-size')) {
        const fontSizeVal = el.style.fontSize;
        if (fontSizeVal && !fontSizeVal.includes('var(--text-scale)')) {
          if (!el.hasAttribute('data-orig-font-size')) {
            el.setAttribute('data-orig-font-size', fontSizeVal);
          }
          
          const origSize = el.getAttribute('data-orig-font-size') || fontSizeVal;
          if (origSize.includes('px') || /^[0-9.]+$/.test(origSize)) {
            const num = parseFloat(origSize);
            if (!isNaN(num)) {
              el.style.fontSize = `calc(${num}px * var(--text-scale, 1.0))`;
            }
          } else if (origSize.includes('rem')) {
            const num = parseFloat(origSize);
            if (!isNaN(num)) {
              el.style.fontSize = `calc(${num}rem * var(--text-scale, 1.0))`;
            }
          } else if (origSize.includes('em')) {
            const num = parseFloat(origSize);
            if (!isNaN(num)) {
              el.style.fontSize = `calc(${num}em * var(--text-scale, 1.0))`;
            }
          } else if (origSize.includes('%')) {
            const num = parseFloat(origSize);
            if (!isNaN(num)) {
              el.style.fontSize = `calc(${num}% * var(--text-scale, 1.0))`;
            }
          }
        }
      }
    };

    const processAll = () => {
      if (observer) observer.disconnect();
      
      const elements = document.querySelectorAll('*');
      elements.forEach(node => {
        if (node instanceof HTMLElement) {
          processElement(node);
        }
      });

      if (observer) {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style'],
        });
      }
    };

    // Create observer
    observer = new MutationObserver((mutations) => {
      let needsProcessing = false;
      for (const m of mutations) {
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          needsProcessing = true;
          break;
        }
        if (m.type === 'attributes' && m.attributeName === 'style') {
          const el = m.target as HTMLElement;
          const fs = el.style.fontSize;
          if (fs && !fs.includes('var(--text-scale)')) {
            needsProcessing = true;
            break;
          }
        }
      }
      if (needsProcessing) {
        processAll();
      }
    });

    // Run initially
    processAll();

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style'],
    });

    return () => {
      if (observer) observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyScale = (pct: number) => {
    if (typeof document === 'undefined') return;
    const factor = pct / 100;
    // 1. Update CSS variable consumed by all utility overrides in globals.css
    document.documentElement.style.setProperty('--text-scale', String(factor));
    // 2. Set base font-size on <html> so rem units cascade application-wide.
    //    16px is the browser default; we scale from that.
    document.documentElement.style.fontSize = `${16 * factor}px`;
  };

  const handleDecrease = () => {
    const idx = SCALES.indexOf(scale);
    if (idx <= 0) return;
    const next = SCALES[idx - 1];
    setScale(next);
    try { localStorage.setItem('ksp_text_scale_v2', String(next)); } catch {}
    applyScale(next);
  };

  const handleIncrease = () => {
    const idx = SCALES.indexOf(scale);
    if (idx >= SCALES.length - 1) return;
    const next = SCALES[idx + 1];
    setScale(next);
    try { localStorage.setItem('ksp_text_scale_v2', String(next)); } catch {}
    applyScale(next);
  };


  return (
    <div style={{
      width: '100%',
      background: '#FFFFFF',
      borderBottom: '3px solid var(--primary-navy)', // Maroon
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}>
      
      {/* Column 1: Chief Minister Office (Left aligned) */}
      <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
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
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}>
              Chief Minister Office
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontWeight: 500,
              lineHeight: 1.3,
            }}>
              Government of Karnataka
            </div>
          </div>
        </div>
      </div>

      {/* Column 2: Karnataka State Police Logo (Center aligned) */}
      <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              letterSpacing: '0.01em',
            }}>
              Karnataka State Police
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}>
              Government of Karnataka
            </div>
          </div>
        </div>
      </div>

      {/* Column 3: Home Minister Office & Text Scale (Right aligned) */}
      <div style={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderRight: '1px solid #E5E7EB',
          paddingRight: 16,
          height: '32px',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            userSelect: 'none',
            minWidth: 52,
          }}>
            Text {scale}%
          </span>
          <button
            onClick={handleDecrease}
            disabled={scale === 70}
            aria-label="Decrease text size"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#374151',
              fontSize: '12px',
              fontWeight: 800,
              cursor: scale === 70 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: scale === 70 ? 0.4 : 1,
              transition: 'all 0.15s ease',
              outline: 'none',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (scale !== 70) {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }
            }}
            onMouseLeave={e => {
              if (scale !== 70) {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D1D5DB';
              }
            }}
          >
            A−
          </button>
          <button
            onClick={handleIncrease}
            disabled={scale === 140}
            aria-label="Increase text size"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              background: '#FFFFFF',
              color: '#374151',
              fontSize: '12px',
              fontWeight: 800,
              cursor: scale === 140 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: scale === 140 ? 0.4 : 1,
              transition: 'all 0.15s ease',
              outline: 'none',
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              if (scale !== 140) {
                e.currentTarget.style.background = '#F3F4F6';
                e.currentTarget.style.borderColor = '#9CA3AF';
              }
            }}
            onMouseLeave={e => {
              if (scale !== 140) {
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
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}>
              Home Minister Office
            </div>
            <div style={{
              fontSize: '12px',
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
