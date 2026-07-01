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
    if (!role) return { text: 'Officer', color: 'rgba(0, 240, 255, 0.15)', textCol: '#00f0ff' };
    if (role === 'DGP') return { text: 'DGP', color: 'rgba(239, 68, 68, 0.15)', textCol: '#ef4444' };
    if (role === 'Commissioner') return { text: 'Commissioner', color: 'rgba(245, 158, 11, 0.15)', textCol: '#f59e0b' };
    return { text: role, color: 'rgba(0, 240, 255, 0.15)', textCol: '#00f0ff' };
  };

  const badge = getRoleBadge(user?.role);

  return (
    <div className="relative no-print" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer"
        style={{
          background: 'rgba(10, 22, 40, 0.2)',
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
            background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(139,92,246,0.1))',
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
          className="absolute right-0 mt-2 w-64 rounded-xl border shadow-2xl z-50 overflow-hidden backdrop-blur-md"
          style={{
            background: 'var(--bg-header)',
            borderColor: 'var(--border-default)',
          }}
        >
          {/* User Info Header */}
          <div
            className="p-4 border-b flex flex-col gap-1.5"
            style={{ borderColor: 'var(--border-default)', background: 'rgba(0, 212, 255, 0.02)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[var(--text-primary)] tracking-wide">
                {user?.name ?? 'KSP Officer'}
              </span>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase"
                style={{ background: badge.color, color: badge.textCol, border: `1px solid ${badge.textCol}33` }}
              >
                {badge.text}
              </span>
            </div>
            {user?.badgeNumber && (
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Badge: {user.badgeNumber}
              </span>
            )}
            <span className="text-[10px] text-[var(--text-muted)]">
              Karnataka State Police Command
            </span>
          </div>

          {/* Links/Actions */}
          <div className="p-1.5 space-y-0.5">
            {/* Profile */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings#profile');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-slate-500/5 transition-colors cursor-pointer text-left"
            >
              <User size={13} className="text-[var(--accent-cyan)]" />
              <span>Profile</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-slate-500/5 transition-colors cursor-pointer text-left"
            >
              <Settings size={13} className="text-[var(--accent-cyan)]" />
              <span>Settings</span>
            </button>

            <hr className="my-1 opacity-10" style={{ borderColor: 'var(--border-default)' }} />

            {/* Theme */}
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-slate-500/5 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? (
                  <Sun size={13} className="text-amber-500" />
                ) : (
                  <Moon size={13} className="text-blue-500" />
                )}
                <span>Theme</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-muted)]">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>

            {/* Language */}
            <button
              onClick={() => {
                setLang(lang === 'en' ? 'kn' : 'en');
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-slate-500/5 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <Globe size={13} className="text-[var(--accent-cyan)]" />
                <span>Language</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-muted)]">
                {lang === 'en' ? 'English' : 'ಕನ್ನಡ'}
              </span>
            </button>

            <hr className="my-1 opacity-10" style={{ borderColor: 'var(--border-default)' }} />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer text-left"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
