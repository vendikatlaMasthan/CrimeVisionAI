// ─────────────────────────────────────────────────────────────────────────────
// lib/translations.ts
// CrimeVision AI — English + Kannada Translation Strings
// Imported from static JSON locale files for type-safe rendering.
// ─────────────────────────────────────────────────────────────────────────────

import en from './locales/en.json';
import kn from './locales/kn.json';

export type Language = 'en' | 'kn';

export type TranslationSet = typeof en;

export const translations: Record<Language, TranslationSet> = {
  en: en as TranslationSet,
  kn: kn as TranslationSet,
};

export function getTranslation(lang: Language): TranslationSet {
  return translations[lang];
}
