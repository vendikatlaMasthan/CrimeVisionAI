'use client';

export default function GlobalSimulationBanner() {
  return (
    <div
      style={{
        width: '100%',
        background: '#D9A441', // Gold accent
        color: '#1A1620', // Charcoal
        fontSize: '11px',
        fontWeight: 800,
        padding: '6px 16px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        letterSpacing: '0.05em',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 9999,
        textTransform: 'uppercase',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <span>⚠️ SIMULATION MODE — Synthetic Demo Data, Not an Official Government Platform</span>
    </div>
  );
}
