'use client';

import { Zap, Clock } from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';

export default function SimulationBanner() {
  const { lang } = useLanguage();

  return (
    <div
      className="animate-fadeInUp"
      style={{
        background: 'rgba(0, 212, 255, 0.04)',
        border: '1px solid rgba(0, 212, 255, 0.16)',
        borderRadius: '12px',
        padding: '12px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 0 16px rgba(0, 212, 255, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          className="animate-pulse-glow"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(0, 212, 255, 0.12)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={14} className="text-[#00D4FF]" />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 850, color: '#00D4FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {lang === 'en' ? 'FORECAST SIMULATION ACTIVE' : 'ಮುನ್ಸೂಚನೆ ಸಿಮ್ಯುಲೇಶನ್ ಸಕ್ರಿಯವಾಗಿದೆ'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {lang === 'en' 
              ? 'Tactical predictions calibrated under KSP Intel Directive #KA-2026' 
              : 'ಕೆಎಸ್‌ಪಿ ಇಂಟೆಲ್ ಡೈರೆಕ್ಟಿವ್ #KA-2026 ಅಡಿಯಲ್ಲಿ ಮಾಪನಾಂಕ ನಿರ್ಣಯಿಸಲಾದ ತಾಂತ್ರಿಕ ಮುನ್ಸೂಚನೆಗಳು'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <span className="badge badge-cyan" style={{ fontSize: '12px', fontWeight: 800 }}>
          {lang === 'en' ? 'MODEL V3.2' : 'ಮಾದರಿ V3.2'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)' }}>
          <Clock size={12} />
          <span>{lang === 'en' ? 'Update: Real-time' : 'ನವೀಕರಣ: ನೈಜ-ಸಮಯ'}</span>
        </div>
      </div>
    </div>
  );
}
