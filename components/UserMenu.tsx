'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, Settings, Moon, Sun, Globe, LogOut, ChevronDown } from 'lucide-react';
import { DemoAccount } from '@/lib/crimeData';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageToggle';

interface UserMenuProps {
  user?: DemoAccount | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('ksp_user');
    } catch {
      // ignore
    }
    router.replace('/login');
  };

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer"
        style={{
          background: '#F3F4F6',
          borderColor: 'var(--border-default)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent-cyan)';
        }}
        onMouseLeave={e => {
          if (!isOpen) e.currentTarget.style.borderColor = 'var(--border-default)';
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
          style={{
            background: 'linear-gradient(135deg, rgba(30,58,95,0.08), rgba(139,92,246,0.1))',
            border: `1px solid ${badge.textCol}44`,
            color: badge.textCol,
          }}
        >
           <User size={14} />
        </div>
        <div className="hidden sm:flex flex-col items-start text-left">
          <span className="text-xs font-bold leading-none text-[var(--text-primary)]">
            {user?.name ?? 'KSP Officer'}
          </span>
          <span className="text-[9px] font-semibold text-[var(--text-muted)] mt-0.5">
            {user?.designation ?? 'Inspector'}
          </span>
        </div>
        <ChevronDown size={12} className="text-[var(--text-muted)]" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{
            width: '280px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* 1. Identity Header */}
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0B1F3A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name ?? 'KSP Officer'}
              </span>
              <span style={{ fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.designation ?? 'Inspector'}
              </span>
            </div>
            {/* Role Badge */}
            <span
              style={{
                fontSize: '10px',
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
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0' }} />

          {/* 3. Meta Info Block */}
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '2px' }}>
                Badge Number
              </div>
              <div style={{ fontSize: '13px', color: '#0B1F3A', fontWeight: 500 }}>
                {user?.badgeNumber ?? 'KSP-94827'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', marginBottom: '2px' }}>
                Command Center
              </div>
              <div style={{ fontSize: '13px', color: '#0B1F3A', fontWeight: 500 }}>
                Karnataka Police HQ
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0' }} />

          {/* 5. Action List */}
          <div style={{ padding: '4px 0' }}>
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

            {/* Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings');
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
              <Settings size={16} style={{ color: '#64748B' }} />
              <span>Settings</span>
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
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                  {lang === 'en' ? 'English' : 'ಕನ್ನಡ'}
                </span>
                <ChevronDown size={14} style={{ color: '#64748B', transform: 'rotate(-90deg)' }} />
              </div>
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: '#E2E8F0' }} />

          {/* 7. Logout */}
          <div style={{ padding: '4px 0' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#EF4444',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={16} style={{ color: '#EF4444' }} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
