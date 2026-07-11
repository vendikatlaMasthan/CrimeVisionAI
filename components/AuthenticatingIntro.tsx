'use client';
// ─────────────────────────────────────────────────────────────────────────────
// components/AuthenticatingIntro.tsx
// CrimeVision AI v2.0 — Clean Light-Theme Loading Screen
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

const LOADING_STEPS = [
  'Connecting to Karnataka State Police Database…',
  'Loading Crime Intelligence Engine…',
  'Authenticating Officer Credentials…',
  'Loading Crime Records…',
  'Calibrating AI Prediction Model…',
  'System Ready — Welcome',
];

export default function AuthenticatingIntro({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const stepDuration = 600;

    LOADING_STEPS.forEach((_, idx) => {
      const t = setTimeout(() => {
        setStepIdx(idx);
        setProgress(Math.round(((idx + 1) / LOADING_STEPS.length) * 100));
        if (idx === LOADING_STEPS.length - 1) {
          const t2 = setTimeout(() => {
            setPhase('done');
            const t3 = setTimeout(onComplete, 400);
            timers.push(t3);
          }, 500);
          timers.push(t2);
        }
      }, idx * stepDuration);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: phase === 'done' ? 'none' : 'all',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* CrimeVision AI Logo */}
      <div style={{ marginBottom: 24, width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/crimevision_logo.png" alt="CrimeVision AI Logo" style={{ width: 96, height: 96, objectFit: 'contain' }} />
      </div>

      {/* Title */}
      <div style={{
        fontSize: 20, fontWeight: 800, color: '#1F2937',
        letterSpacing: '0.06em', marginBottom: 4,
      }}>
        CRIMEVISION AI
      </div>
      <div style={{
        fontSize: 12, fontWeight: 500, color: '#6B7280',
        letterSpacing: '0.04em', marginBottom: 32,
      }}>
        Karnataka State Police — Intelligence Platform
      </div>

      {/* Progress Bar */}
      <div style={{ width: 320, maxWidth: '80vw' }}>
        <div style={{
          height: 4, background: '#E5E7EB', borderRadius: 4,
          overflow: 'hidden', marginBottom: 12,
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#A6192E',
            borderRadius: 4,
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Step Text */}
        <div style={{
          fontSize: 12, color: '#6B7280', textAlign: 'center',
          fontWeight: 500, minHeight: 20,
        }}>
          {LOADING_STEPS[stepIdx]}
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        style={{
          marginTop: 32,
          background: 'none', border: 'none',
          color: '#9CA3AF', fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit', fontWeight: 500,
        }}
      >
        Skip →
      </button>
    </div>
  );
}
