'use client';

import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';

interface AIRecommendationCardProps {
  action: string;
  rationale: string;
  urgency: string;
  priority: string | number;
}

export default function AIRecommendationCard({ action, rationale, urgency, priority }: AIRecommendationCardProps) {
  const { lang } = useLanguage();

  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        borderLeft: '4px solid var(--cyber-cyan)',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(0, 240, 255, 0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'rgba(0, 240, 255, 0.08)',
            border: '1px solid rgba(30,58,95,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyber-cyan)',
          }}
        >
          <Sparkles size={16} className="animate-pulse" />
        </div>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--cyber-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {lang === 'en' ? 'AI TACTICAL DIRECTIVE' : 'AI ತಾಂತ್ರಿಕ ನಿರ್ದೇಶನ'}
          </span>
        </div>
      </div>

      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
        {action}
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
        {rationale}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span 
          className="badge" 
          style={{ 
            fontSize: '12px', 
            padding: '2px 8px', 
            background: urgency.toLowerCase() === 'critical' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: urgency.toLowerCase() === 'critical' ? '#ef4444' : '#fbbf24',
            border: urgency.toLowerCase() === 'critical' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(245, 158, 11, 0.25)',
          }}
        >
          {urgency}
        </span>
        <span 
          className="badge" 
          style={{ 
            fontSize: '12px', 
            padding: '2px 8px',
            background: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-muted)',
            border: '1px solid var(--cyber-border)',
          }}
        >
          PRIORITY {priority}
        </span>
      </div>
    </div>
  );
}
