'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function InvestigatorRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const targetUrl = query ? `/ai-investigator?${query}` : '/ai-investigator';
    router.replace(targetUrl);
  }, [router, searchParams]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F7FA', color: '#6B7280' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '3px solid rgba(30, 58, 95, 0.1)',
          borderTopColor: '#1E3A5F',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>
          Redirecting to AI Investigator...
        </span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function InvestigatorRedirect() {
  return (
    <Suspense fallback={null}>
      <InvestigatorRedirectContent />
    </Suspense>
  );
}
