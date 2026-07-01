'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommissionerDashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/commissioner');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 24, height: 24, border: '3px solid var(--border-default)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%' }} />
    </div>
  );
}
