import React, { forwardRef, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (val: string) => void;
  id?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, style, className, placeholder, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="input-with-icon relative w-full h-full flex items-center">
        <Search
          size={16}
          className="icon"
          style={{
            color: '#94A3B8',
            transition: 'color 0.2s ease',
          }}
        />
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
            paddingRight: '16px',
            border: isFocused ? '1.5px solid var(--primary-navy)' : '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: '8px',
            outline: 'none',
            transition: 'all 0.2s ease',
            fontSize: '12px',
            width: '100%',
            height: '100%',
            ...style,
          }}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
