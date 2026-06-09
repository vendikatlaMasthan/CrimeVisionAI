'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: components/LanguageToggle.tsx
// CrimeVision AI — Language Context Provider + Toggle Button
// Supports English + Kannada (ಕನ್ನಡ). Persists in localStorage.
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TranslationSet, translations } from '@/lib/translations';

// ─── Context ──────────────────────────────────────────────────────────────────

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: TranslationSet;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ksp_lang') as Language | null;
      if (stored === 'en' || stored === 'kn') {
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem('ksp_lang', l);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLanguage() {
  return useContext(LanguageContext);
}

// ─── Toggle Button Component ──────────────────────────────────────────────────
// Drop this anywhere in the Topbar / Navbar

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      id="language-toggle-btn"
      onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
      aria-label={lang === 'en' ? 'Switch to Kannada' : 'Switch to English'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '5px 10px',
        borderRadius: 8,
        border: '1px solid rgba(0, 240, 255, 0.25)',
        background: 'rgba(0, 240, 255, 0.06)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,240,255,0.12)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,240,255,0.45)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,240,255,0.06)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,240,255,0.25)';
      }}
    >
      {/* English label */}
      <span
        style={{
          fontSize: 11,
          fontWeight: lang === 'en' ? 800 : 500,
          color: lang === 'en' ? '#00f0ff' : '#64748b',
          letterSpacing: '0.04em',
          transition: 'all 0.2s',
        }}
      >
        EN
      </span>

      {/* Divider */}
      <span style={{ color: 'rgba(100,116,139,0.5)', fontSize: 10, fontWeight: 300 }}>|</span>

      {/* Kannada label */}
      <span
        style={{
          fontSize: 12,
          fontWeight: lang === 'kn' ? 800 : 500,
          color: lang === 'kn' ? '#00f0ff' : '#64748b',
          transition: 'all 0.2s',
        }}
      >
        ಕನ್ನಡ
      </span>

      {/* Active indicator dot */}
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#00f0ff',
          boxShadow: '0 0 6px #00f0ff',
          flexShrink: 0,
        }}
      />
    </button>
  );
}
