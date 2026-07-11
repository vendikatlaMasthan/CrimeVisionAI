import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  style = {},
  ...props
}: CardProps) {
  const borderStyles: Record<string, React.CSSProperties> = {
    default: { border: '1px solid var(--border-default)', borderLeft: '1px solid var(--border-default)' },
    info: { border: '1px solid var(--border-default)', borderLeft: '4px solid var(--primary-navy)' },
    success: { border: '1px solid var(--border-default)', borderLeft: '4px solid var(--success-green)' },
    warning: { border: '1px solid var(--border-default)', borderLeft: '4px solid var(--warning-amber)' },
    danger: { border: '1px solid var(--border-default)', borderLeft: '4px solid var(--alert-red)' },
  };

  const paddingStyles: Record<string, string> = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '28px',
  };

  const baseStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius, 16px)',
    boxShadow: 'var(--shadow-card)',
    padding: paddingStyles[padding],
    transition: 'all 0.2s ease',
    ...borderStyles[variant],
    ...style,
  };

  return (
    <div
      className={`glass-card ${hoverable ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </div>
  );
}
