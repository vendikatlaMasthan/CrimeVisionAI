import React, { forwardRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputWithIconProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (val: string) => void;
  icon: LucideIcon;
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ value, onChange, icon: Icon, style, className = '', placeholder, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className={`input-with-icon relative w-full flex items-center ${className}`} style={{ position: 'relative' }}>
        {Icon && (
          <Icon
            size={16}
            className="icon"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 10,
              color: '#94A3B8',
            }}
          />
        )}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          style={{
            paddingLeft: '44px',
            paddingRight: '16px',
            border: isFocused ? '1.5px solid var(--primary-navy)' : '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius, 16px)',
            outline: 'none',
            transition: 'all 0.2s ease',
            fontSize: '12px',
            width: '100%',
            height: '40px',
            ...style,
          }}
          {...props}
        />
      </div>
    );
  }
);

InputWithIcon.displayName = 'InputWithIcon';
