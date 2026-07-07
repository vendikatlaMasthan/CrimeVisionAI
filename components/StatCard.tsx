import React from 'react';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function StatCard({
  label,
  value,
  icon,
  description,
  className = '',
  style = {}
}: StatCardProps) {
  const { borderLeft, ...cleanStyle } = style;
  const hasLeftAccent = !!borderLeft;

  return (
    <div
      className={`bg-white border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.08)] rounded-[var(--radius,16px)] flex flex-col justify-center w-full relative ${className}`}
      style={{
        borderRadius: 'var(--radius, 16px)',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        minHeight: '140px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        justifyContent: 'center',
        padding: hasLeftAccent ? '20px 24px 20px 28px' : '20px 24px',
        paddingRight: icon ? '48px' : '24px',
        ...cleanStyle
      }}
    >
      {hasLeftAccent && (
        <div 
          style={{
            position: 'absolute',
            left: 0,
            top: '20px',
            bottom: '20px',
            width: '3px',
            borderRadius: '1.5px',
            background: typeof borderLeft === 'string' && borderLeft.includes('solid') ? borderLeft.split(' ').pop() : 'var(--color-red)'
          }}
        />
      )}

      {icon && (
        <div 
          className="flex-shrink-0"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            pointerEvents: 'none'
          }}
        >
          {icon}
        </div>
      )}

      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block" title={label}>
        {label}
      </span>

      <div className="text-[28px] font-extrabold text-gray-900 leading-none truncate">
        {value}
      </div>

      {description && (
        <div 
          className="text-[12px] text-gray-500 block" 
          style={{
            whiteSpace: 'normal',
            lineHeight: '1.4',
            overflowWrap: 'break-word'
          }}
          title={description}
        >
          {description}
        </div>
      )}
    </div>
  );
}
