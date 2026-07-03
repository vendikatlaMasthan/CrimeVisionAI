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
    default: { border: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB' },
    info: { border: '1px solid #E5E7EB', borderLeft: '4px solid #2563EB' },
    success: { border: '1px solid #E5E7EB', borderLeft: '4px solid #16A34A' },
    warning: { border: '1px solid #E5E7EB', borderLeft: '4px solid #D97706' },
    danger: { border: '1px solid #E5E7EB', borderLeft: '4px solid #DC2626' },
  };

  const paddingStyles: Record<string, string> = {
    none: '0',
    sm: '12px',
    md: '20px',
    lg: '28px',
  };

  const baseStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
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
