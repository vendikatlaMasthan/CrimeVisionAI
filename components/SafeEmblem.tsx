import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SafeEmblemProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function SafeEmblem({ width = 50, height = 50, className, style }: SafeEmblemProps) {
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!basePath && typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/CrimeVisionAI')) {
      basePath = '/CrimeVisionAI';
    }
  }

  const [imgSrc, setImgSrc] = useState(`${basePath}/seal-karnataka.svg`);

  // Synchronize with basePath on mount/change
  useEffect(() => {
    setImgSrc(`${basePath}/seal-karnataka.svg`);
  }, [basePath]);

  if (!mounted || error) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          borderRadius: '8px',
          background: '#F3F4F6',
          border: '1px solid #D1D5DB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          ...style,
        }}
        title="Official Seal of Karnataka (Placeholder)"
      >
        <Shield size={width * 0.5} style={{ color: '#9CA3AF' }} />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      onError={() => {
        if (basePath && imgSrc !== '/seal-karnataka.svg') {
          setImgSrc('/seal-karnataka.svg');
        } else {
          console.warn('Emblem failed to load, falling back to placeholder.');
          setError(true);
        }
      }}
      alt="Official Emblem of the Government of Karnataka"
      width={width}
      height={height}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
