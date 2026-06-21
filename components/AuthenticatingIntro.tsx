'use client';

import { useState, useEffect } from 'react';

const BOOT_LINES = [
  { text: 'INITIALIZING CRIMEVISION AI v6.0...', delay: 100, color: '#00f0ff' },
  { text: 'CONNECTING TO KARNATAKA STATE POLICE DATABASE...', delay: 600, color: '#94a3b8' },
  { text: '> LOADING CRIME INTELLIGENCE ENGINE...', delay: 1200, color: '#94a3b8' },
  { text: '> AUTHENTICATING OFFICER CREDENTIALS...', delay: 1800, color: '#f59e0b' },
  { text: '> LOADING 82,089 CRIME RECORDS...', delay: 2300, color: '#94a3b8' },
  { text: '> CALIBRATING AI PREDICTION MODEL...', delay: 2800, color: '#94a3b8' },
  { text: '> DISTRICT RISK SCORES: COMPUTED', delay: 3200, color: '#10b981' },
  { text: '> CRIMINAL NETWORK GRAPH: READY', delay: 3500, color: '#10b981' },
  { text: '> ANOMALY DETECTION ENGINE: ONLINE', delay: 3800, color: '#10b981' },
  { text: 'SYSTEM STATUS: ALL MODULES OPERATIONAL', delay: 4100, color: '#10b981' },
  { text: 'ACCESS GRANTED — WELCOME, INSPECTOR', delay: 4500, color: '#00f0ff' },
];

export default function AuthenticatingIntro({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'done'>('boot');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, idx) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, idx]);
        setProgress(Math.round(((idx + 1) / BOOT_LINES.length) * 100));
        if (idx === BOOT_LINES.length - 1) {
          const t2 = setTimeout(() => {
            setPhase('done');
            const t3 = setTimeout(onComplete, 600);
            timers.push(t3);
          }, 700);
          timers.push(t2);
        }
      }, line.delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#020617',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'done' ? 0 : 1,
        transition: 'opacity 0.6s ease',
        pointerEvents: phase === 'done' ? 'none' : 'all',
      }}
    >
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.015) 2px, rgba(0,240,255,0.015) 4px)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 720, padding: '40px 48px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 72, height: 72, borderRadius: '50%',
            border: '2px solid #00f0ff',
            boxShadow: '0 0 24px rgba(0,240,255,0.4)',
            marginBottom: 16, fontSize: 32,
          }}>🛡️</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.15em', fontFamily: 'Space Grotesk, sans-serif' }}>CRIMEVISION AI</div>
          <div style={{ fontSize: 12, color: '#00f0ff', letterSpacing: '0.3em', marginTop: 4 }}>KARNATAKA STATE POLICE — INTELLIGENCE COMMAND</div>
        </div>

        {/* Terminal */}
        <div style={{
          background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,240,255,0.2)',
          borderRadius: 12, padding: '24px 28px', marginBottom: 24,
          minHeight: 280, fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
        }}>
          {BOOT_LINES.map((line, idx) => (
            <div
              key={idx}
              style={{
                color: line.color,
                marginBottom: 6,
                opacity: visibleLines.includes(idx) ? 1 : 0,
                transform: visibleLines.includes(idx) ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
              }}
            >
              {line.text}
              {idx === visibleLines[visibleLines.length - 1] && phase === 'boot' && (
                <span style={{ animation: 'blink 0.8s infinite', marginLeft: 2 }}>█</span>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>SYSTEM INITIALIZATION</span>
            <span style={{ fontSize: 11, color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(0,240,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
              borderRadius: 4,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 8px rgba(0,240,255,0.5)',
            }} />
          </div>
        </div>

        {/* Skip button */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={onComplete}
            style={{
              background: 'none', border: 'none', color: '#475569',
              fontSize: 12, cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace',
            }}
          >SKIP INTRO →</button>
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}
