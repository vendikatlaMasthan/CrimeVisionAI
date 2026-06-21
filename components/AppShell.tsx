'use client';

// AppShell — lightweight wrapper that provides session-scoped animated intro.
// NOTE: Sidebar and Topbar are handled by AuthGuard, so this component
// only manages the animated boot-up sequence for non-auth-guard contexts.

import { useState, useEffect } from 'react';
import AuthenticatingIntro from '@/components/AuthenticatingIntro';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('ksp_intro_seen');
    if (!seen) {
      setShowIntro(true);
    }
    setIntroChecked(true);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('ksp_intro_seen', '1');
    setShowIntro(false);
  };

  if (!introChecked) return null;

  return (
    <>
      {showIntro && <AuthenticatingIntro onComplete={handleIntroComplete} />}
      {children}
    </>
  );
}
