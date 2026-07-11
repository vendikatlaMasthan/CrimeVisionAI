'use client';
 
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, Moon, Sun, Globe, LogOut, ChevronDown, X } from 'lucide-react';
import { DemoAccount } from '@/lib/crimeData';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageToggle';

interface UserMenuProps {
  user?: DemoAccount | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role?: string) => {
    if (!role) return { text: 'Officer', color: 'rgba(30,58,95,0.1)', textCol: '#1E3A5F' };
    if (role === 'DGP') return { text: 'DGP', color: 'rgba(239, 68, 68, 0.15)', textCol: '#ef4444' };
    if (role === 'Commissioner') return { text: 'Commissioner', color: 'rgba(245, 158, 11, 0.15)', textCol: '#f59e0b' };
    return { text: role, color: 'rgba(30,58,95,0.1)', textCol: '#1E3A5F' };
  };

  const badge = getRoleBadge(user?.role);

  return (
    <div className="relative no-print" ref={dropdownRef}>
      {/* Trigger Button */}
      <style>{`
        .profile-trigger:focus-visible {
          outline: 2px solid var(--primary-navy) !important;
          outline-offset: 2px !important;
        }
      `}</style>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center transition-all cursor-pointer profile-trigger"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 10px',
          borderRadius: '16px',
          border: '1px solid var(--border-default)',
          background: '#F3F4F6',
          minHeight: '40px',
          height: 'auto',
          boxSizing: 'border-box',
          outline: 'none'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent-cyan)';
        }}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-default)';
        }}
      >
        <div
          className="rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
          style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, rgba(30,58,95,0.08), rgba(139,92,246,0.1))',
            border: `1px solid ${badge.textCol}44`,
            color: badge.textCol,
          }}
        >
           <User size={16} />
        </div>
        <div 
          className="hidden sm:flex flex-col items-start justify-center text-left" 
          style={{ 
            lineHeight: '1.3', 
            opacity: isOpen ? 0 : 1, 
            transition: 'opacity 150ms ease' 
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {user?.name ?? 'KSP Officer'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {user?.designation ?? 'Inspector'} · {user?.district ?? 'Bengaluru'}
          </span>
        </div>
        <ChevronDown size={12} className="text-[var(--text-muted)] flex-shrink-0" />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.25)',
            zIndex: 45,
          }}
        />
      )}

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        className="absolute rounded-xl shadow-lg z-50 profile-dropdown"
        style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: '0px',
          left: 'auto',
          minWidth: '260px',
          maxWidth: '320px',
          width: '280px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          transformOrigin: 'top right',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-4px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          zIndex: 50,
        }}
      >
        {/* Arrow Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '-6px',
            right: '24px',
            width: '12px',
            height: '12px',
            background: '#FFFFFF',
            borderLeft: '1px solid #E2E8F0',
            borderTop: '1px solid #E2E8F0',
            transform: 'rotate(45deg)',
            zIndex: 51,
          }}
        />

        {/* 1. Identity Header */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {/* Circular avatar placeholder */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(11, 31, 58, 0.05)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <User size={20} style={{ color: '#0B1F3A' }} />
          </div>
          {/* Officer info */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0B1F3A', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
              {user?.name ?? 'KSP Officer'}
            </span>
            <span style={{ fontSize: '14px', color: '#64748B', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
              {user?.designation ?? 'Inspector'}
            </span>
          </div>
          {/* Role Badge */}
          <span
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#0B1F3A',
              background: 'rgba(11, 31, 58, 0.08)',
              padding: '2px 8px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {badge.text}
          </span>
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            title="Close Menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#F1F5F9' }} />

        {/* 3. Meta Info Block */}
        <div className="profile-dropdown-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 16px' }}>
          <div className="field-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2px' }}>
            <div className="field-label" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: '#9CA3AF', textTransform: 'uppercase' }}>
              Badge ID
            </div>
            <div className="field-value" style={{ fontSize: '14px', fontWeight: 600, color: '#1E3A5F' }}>
              {user?.badgeNumber ?? 'KSP-94827'}
            </div>
          </div>
          <div className="field-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2px' }}>
            <div className="field-label" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', color: '#9CA3AF', textTransform: 'uppercase' }}>
              Command
            </div>
            <div className="field-value" style={{ fontSize: '14px', fontWeight: 600, color: '#1E3A5F' }}>
              Karnataka Police HQ
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#F1F5F9' }} />

        {/* 5. Action List */}
        <div style={{ padding: '8px 0' }}>
          {/* Profile */}
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/settings#profile');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#0B1F3A',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <User size={16} style={{ color: '#64748B' }} />
            <span>Profile</span>
          </button>

          {/* Language Selection Row as an interactive control */}
          <button
            onClick={() => {
              setLang(lang === 'en' ? 'kn' : 'en');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              fontSize: '14px',
              color: '#0B1F3A',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <Globe size={16} style={{ color: '#64748B' }} />
              <span>Language</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>
                {lang === 'en' ? 'English' : 'ಕನ್ನಡ'}
              </span>
              <ChevronDown size={14} style={{ color: '#64748B', transform: 'rotate(-90deg)' }} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
