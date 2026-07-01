'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeatmapRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/map');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617', color: 'var(--text-dim)' }}>
      Redirecting to Karnataka Crime Heatmap...
    </div>
  );
}
