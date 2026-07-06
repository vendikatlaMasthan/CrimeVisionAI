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
  return (
    <div
      className={`bg-white border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-[20px] rounded-[var(--radius,16px)] flex flex-col justify-between h-[100px] min-h-[90px] w-full ${className}`}
      style={{
        borderRadius: 'var(--radius, 16px)',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div className="flex justify-between items-start w-full gap-4">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate block" title={label}>
            {label}
          </span>
          <div className="text-[28px] font-extrabold text-gray-900 leading-none mt-1.5 truncate">
            {value}
          </div>
        </div>
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
      {description && (
        <div className="text-[12px] text-gray-500 mt-1 truncate block" title={description}>
          {description}
        </div>
      )}
    </div>
  );
}
