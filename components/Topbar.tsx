'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: components/Topbar.tsx  (REPLACE existing file entirely)
// CrimeVision AI — Top Navigation Bar with Global Search + Language Toggle
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef, useCallback } from 'react';
import { Bell, Search, Wifi, Clock, Monitor, X, FileText, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import NotificationCenter from './NotificationCenter';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from './LanguageToggle';
import { FIR_RECORDS, CRIMINAL_PROFILES } from '@/lib/mockData';
import { DISTRICTS, RECENT_FIRS, TOP_SUSPECTS } from '@/lib/crimeData';
import { DemoAccount } from '@/lib/crimeData';

interface TopbarProps {
  user?: DemoAccount | null;
}

export default function Topbar({ user }: TopbarProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fullscreen demo mode
  useEffect(() => {
    if (demoMode) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    }
  }, [demoMode]);

  // Press "/" to focus search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = searchQuery.trim().toLowerCase();

  // Search across FIRs, suspects, districts
  const matchedFIRs = q.length >= 2
    ? RECENT_FIRS.filter(f =>
        f.firNumber.toLowerCase().includes(q) ||
        f.crimeType.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.suspectName.toLowerCase().includes(q) ||
        f.assignedOfficer.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedSuspects = q.length >= 2
    ? TOP_SUSPECTS.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.alias.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.crimeType.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const matchedDistricts = q.length >= 2
    ? DISTRICTS.filter(d => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)).slice(0, 4)
    : [];

  // Flatten for keyboard navigation
  type ResultItem =
    | { kind: 'fir'; data: typeof RECENT_FIRS[number] }
    | { kind: 'suspect'; data: typeof TOP_SUSPECTS[number] }
    | { kind: 'district'; data: typeof DISTRICTS[number] };

  const allResults: ResultItem[] = [
    ...matchedFIRs.map(f => ({ kind: 'fir' as const, data: f })),
    ...matchedSuspects.map(s => ({ kind: 'suspect' as const, data: s })),
    ...matchedDistricts.map(d => ({ kind: 'district' as const, data: d })),
  ];

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, allResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      const item = allResults[activeIdx];
      if (item.kind === 'fir') router.push(`/fir?id=${item.data.id}`);
      else if (item.kind === 'suspect') router.push(`/search?query=${encodeURIComponent(item.data.name)}`);
      else if (item.kind === 'district') router.push(`/heatmap?district=${encodeURIComponent(item.data.name)}`);
      setShowDropdown(false);
      setSearchQuery('');
      setActiveIdx(-1);
    }
  }, [showDropdown, activeIdx, allResults, router]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setActiveIdx(-1);
  };

  const riskColor = (score: number) => {
    if (score > 80) return '#ef4444';
    if (score > 60) return '#f59e0b';
    return '#00f0ff';
  };

  return (
    <>
      <header
        className="fixed top-0 right-0 flex items-center justify-between px-5 py-3 z-40"
        style={{
          left: '288px',
          background: 'rgba(2, 6, 23, 0.95)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
          backdropFilter: 'blur(24px)',
          height: '64px',
        }}
      >
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #00f0ff, #8b5cf6)' }} />
            <span className="text-sm font-bold tracking-wide" style={{ color: '#f1f5f9' }}>
              Karnataka State Police
            </span>
            <span style={{ color: '#334155' }}>›</span>
            <span className="text-sm" style={{ color: '#00f0ff' }}>CrimeVision AI v5.0</span>
          </div>
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
            <span className="text-xs font-bold" style={{ color: '#10b981' }}>{t.system_online}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">

          {/* Global Search */}
          <div className="relative hidden md:flex" ref={dropdownRef}>
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569', pointerEvents: 'none' }} />
            <input
              ref={inputRef}
              id="global-search-input"
              type="text"
              placeholder={t.search_placeholder}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); setActiveIdx(-1); }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              style={{
                paddingLeft: 34, paddingRight: searchQuery ? 30 : 12,
                paddingTop: 8, paddingBottom: 8,
                background: 'rgba(10, 22, 40, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: 10, color: '#f1f5f9',
                fontFamily: 'inherit', fontSize: 13, outline: 'none',
                width: 280, transition: 'all 0.2s',
              }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.45)'; e.currentTarget.style.width = '320px'; }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.2)'; e.currentTarget.style.width = '280px'; }}
            />
            {searchQuery && (
              <button onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 2 }}>
                <X size={12} />
              </button>
            )}

            {/* Search Dropdown */}
            {showDropdown && (
              <div
                className="absolute top-12 right-0 rounded-xl z-50 border"
                style={{
                  width: 480, background: 'rgba(5,12,28,0.99)',
                  borderColor: 'rgba(0, 240, 255, 0.2)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(20px)',
                  padding: 16,
                }}
              >
                {/* Empty state */}
                {!q && (
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>
                      Quick Search
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {['Bengaluru Urban', 'Cybercrime', 'Narcotics', 'KA-2025', 'Suresh Nayak', 'Sand Mining'].map(chip => (
                        <button key={chip} onMouseDown={() => setSearchQuery(chip)}
                          style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', cursor: 'pointer',
                            fontFamily: 'inherit' }}
                        >{chip}</button>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: '#334155' }}>
                      Type at least 2 characters · Press <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 10, color: '#64748b' }}>↑↓</kbd> to navigate · <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 10, color: '#64748b' }}>Enter</kbd> to select · <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4, fontSize: 10, color: '#64748b' }}>Esc</kbd> to close
                    </div>
                  </div>
                )}

                {/* Results */}
                {q && allResults.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 12, color: '#475569' }}>
                    {t.search_no_results} for &ldquo;<span style={{ color: '#00f0ff' }}>{searchQuery}</span>&rdquo;
                  </div>
                )}

                {q && allResults.length > 0 && (
                  <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* FIRs */}
                    {matchedFIRs.length > 0 && (
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: '#00f0ff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <FileText size={9} /> {t.search_firs} ({matchedFIRs.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {matchedFIRs.map((fir, i) => {
                            const flatIdx = i;
                            return (
                              <Link key={fir.id} href={`/fir?id=${fir.id}`}
                                onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                                style={{
                                  display: 'block', padding: '8px 10px', borderRadius: 8,
                                  background: activeIdx === flatIdx ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${activeIdx === flatIdx ? 'rgba(0,240,255,0.25)' : 'rgba(255,255,255,0.04)'}`,
                                  textDecoration: 'none', transition: 'all 0.1s',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#00f0ff' }}>{fir.firNumber}</span>
                                  <span style={{ fontSize: 9, color: fir.priority === 'Critical' ? '#ef4444' : fir.priority === 'High' ? '#f59e0b' : '#64748b', fontWeight: 700 }}>{fir.priority}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                                  <span>{fir.crimeType}</span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={9} />{fir.district}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Suspects */}
                    {matchedSuspects.length > 0 && (
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <User size={9} /> {t.search_suspects} ({matchedSuspects.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {matchedSuspects.map((s, i) => {
                            const flatIdx = matchedFIRs.length + i;
                            return (
                              <Link key={s.id} href={`/search?query=${encodeURIComponent(s.name)}`}
                                onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                                style={{
                                  display: 'block', padding: '8px 10px', borderRadius: 8,
                                  background: activeIdx === flatIdx ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${activeIdx === flatIdx ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.04)'}`,
                                  textDecoration: 'none', transition: 'all 0.1s',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{s.name}</span>
                                  <span style={{ fontSize: 9, color: s.riskLevel === 'Critical' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>{s.riskLevel}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                                  <span>&ldquo;{s.alias}&rdquo; · {s.crimeType}</span>
                                  <span>{s.district}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Districts */}
                    {matchedDistricts.length > 0 && (
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MapPin size={9} /> {t.search_districts} ({matchedDistricts.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {matchedDistricts.map((d, i) => {
                            const flatIdx = matchedFIRs.length + matchedSuspects.length + i;
                            return (
                              <Link key={d.id} href={`/heatmap?district=${encodeURIComponent(d.name)}`}
                                onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                                style={{
                                  display: 'block', padding: '8px 10px', borderRadius: 8,
                                  background: activeIdx === flatIdx ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                                  border: `1px solid ${activeIdx === flatIdx ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.04)'}`,
                                  textDecoration: 'none', transition: 'all 0.1s',
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>{d.name}</span>
                                  <span style={{ fontSize: 9, color: riskColor(d.riskScore), fontWeight: 700 }}>Risk: {d.riskScore}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                                  <span>{d.crimeCount.toLocaleString()} crimes · {d.topCrimeType}</span>
                                  <span style={{ color: d.trend === 'up' ? '#ef4444' : d.trend === 'down' ? '#10b981' : '#64748b' }}>
                                    {d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '→'} {Math.abs(d.trendPercent)}%
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Secure connection badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
            style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Wifi size={11} style={{ color: '#10b981' }} />
            <span className="text-xs font-bold" style={{ color: '#10b981', fontSize: 10 }}>256-BIT</span>
          </div>

          {/* Language Toggle */}
          <LanguageToggle />

          {/* Demo Mode */}
          <button
            id="demo-mode-btn"
            onClick={() => setDemoMode(!demoMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={demoMode ? {
              background: 'rgba(0, 240, 255, 0.15)', border: '1px solid rgba(0, 240, 255, 0.4)', color: '#00f0ff',
            } : {
              background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa',
            }}
          >
            <Monitor size={11} />
            {demoMode ? 'EXIT' : 'DEMO'}
          </button>

          {/* Notification Bell */}
          <NotificationCenter />

          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <Clock size={11} style={{ color: '#00f0ff' }} />
              <span className="text-sm font-mono font-black" style={{ color: '#00f0ff', fontSize: 13 }}>{time}</span>
            </div>
            <span className="text-xs" style={{ color: '#64748b', fontSize: 10 }}>{date}</span>
          </div>
        </div>
      </header>

      {/* Demo Mode Overlay */}
      {demoMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 rounded-2xl"
          style={{
            background: 'rgba(10, 22, 40, 0.95)', border: '1px solid rgba(0, 240, 255, 0.3)',
            backdropFilter: 'blur(16px)', boxShadow: '0 0 32px rgba(0, 240, 255, 0.15)',
          }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
          <span className="text-sm font-bold" style={{ color: '#00f0ff' }}>PRESENTATION MODE ACTIVE</span>
          <span className="text-xs" style={{ color: '#64748b' }}>Use navigation to switch pages</span>
          <button onClick={() => setDemoMode(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
