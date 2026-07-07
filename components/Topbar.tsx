'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { PortalType } from '@/lib/rbac';
import { 
  Bell, Search, Shield, X, FileText, User, MapPin, AlertTriangle, 
  Monitor, Sun, Moon, Menu, Mic, MicOff, Brain, Sparkles, 
  TrendingUp, ChevronRight, Activity, ShieldAlert, ArrowRight, CornerDownLeft, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageToggle';
import { useTheme } from './ThemeContext';
import { usePresentation } from './PresentationContext';
import { InputWithIcon } from './InputWithIcon';
import AlertPanel from './AlertPanel';
import UserMenu from './UserMenu';
import { FIR_RECORDS, CRIMINAL_PROFILES, CRIME_CATEGORIES, LIVE_ALERTS, CRIMINAL_NETWORK } from '@/lib/mockData';
import { DISTRICTS, RECENT_FIRS, TOP_SUSPECTS } from '@/lib/crimeData';
import { DemoAccount } from '@/lib/crimeData';

interface TopbarProps {
  user?: DemoAccount | null;
  portalType: PortalType;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Topbar({ user, portalType, onToggleSidebar, isSidebarOpen = true }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isPresentationMode, togglePresentationMode } = usePresentation();

  // Active unacknowledged alerts count
  const unreadAlertsCount = LIVE_ALERTS.filter(alert => !alert.acknowledged).length;

  // Voice recognition support check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window as any;
      setVoiceSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    }
  }, []);



  // Keyboard shortcut: Press "/" to focus, "ESC" to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isSearchShortcut = 
        (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k');

      if (isSearchShortcut) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowDropdown(true);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setActiveIdx(-1);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close search dropdown on outside click
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

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (!voiceSupported) return;
    const SpeechAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechAPI) return;

    if (isVoiceActive && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsVoiceActive(false);
      return;
    }

    const recognition = new SpeechAPI();
    recognition.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsVoiceActive(true);
    recognition.onerror = () => setIsVoiceActive(false);
    recognition.onend = () => setIsVoiceActive(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setSearchQuery(transcript);
      setShowDropdown(true);
      setActiveIdx(-1);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setActiveIdx(-1);
  };

  // Perform search
  const q = searchQuery.trim().toLowerCase();

  // 1. FIRs Search
  const matchedFIRs = q.length >= 2
    ? RECENT_FIRS.filter(f =>
        f.firNumber.toLowerCase().includes(q) ||
        f.crimeType.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.suspectName.toLowerCase().includes(q) ||
        f.assignedOfficer.toLowerCase().includes(q) ||
        f.victimName.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  // 2. Suspects Search
  const matchedSuspects = q.length >= 2
    ? TOP_SUSPECTS.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.alias.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.crimeType.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  // 3. Districts Search
  const matchedDistricts = q.length >= 2
    ? DISTRICTS.filter(d => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)).slice(0, 3)
    : [];

  // 4. Crime Categories Search
  const matchedCategories = q.length >= 2
    ? CRIME_CATEGORIES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 3)
    : [];

  // 5. Alerts Search
  const matchedAlerts = q.length >= 2
    ? LIVE_ALERTS.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  // 6. Criminal Networks Search
  const matchedNetworks = q.length >= 2
    ? CRIMINAL_NETWORK.nodes.filter(n =>
        n.label.toLowerCase().includes(q) ||
        (n.district && n.district.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  // Flattened results for keyboard navigation
  type ResultItem =
    | { kind: 'fir'; data: typeof RECENT_FIRS[number] }
    | { kind: 'suspect'; data: typeof TOP_SUSPECTS[number] }
    | { kind: 'district'; data: typeof DISTRICTS[number] }
    | { kind: 'category'; data: typeof CRIME_CATEGORIES[number] }
    | { kind: 'alert'; data: typeof LIVE_ALERTS[number] }
    | { kind: 'network'; data: typeof CRIMINAL_NETWORK.nodes[number] };

  const allResults: ResultItem[] = [
    ...matchedFIRs.map(f => ({ kind: 'fir' as const, data: f })),
    ...matchedSuspects.map(s => ({ kind: 'suspect' as const, data: s })),
    ...matchedDistricts.map(d => ({ kind: 'district' as const, data: d })),
    ...matchedCategories.map(c => ({ kind: 'category' as const, data: c })),
    ...matchedAlerts.map(a => ({ kind: 'alert' as const, data: a })),
    ...matchedNetworks.map(n => ({ kind: 'network' as const, data: n })),
  ];

  // Helper to find the flat index of a result item
  const getFlatIndex = (kind: 'fir' | 'suspect' | 'district' | 'category' | 'alert' | 'network', localIdx: number) => {
    let offset = 0;
    if (kind === 'suspect') {
      offset += matchedFIRs.length;
    } else if (kind === 'district') {
      offset += matchedFIRs.length + matchedSuspects.length;
    } else if (kind === 'category') {
      offset += matchedFIRs.length + matchedSuspects.length + matchedDistricts.length;
    } else if (kind === 'alert') {
      offset += matchedFIRs.length + matchedSuspects.length + matchedDistricts.length + matchedCategories.length;
    } else if (kind === 'network') {
      offset += matchedFIRs.length + matchedSuspects.length + matchedDistricts.length + matchedCategories.length + matchedAlerts.length;
    }
    return offset + localIdx;
  };

  // Keyboard navigation & search trigger on input
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < allResults.length) {
        const item = allResults[activeIdx];
        if (item.kind === 'fir') router.push(`/fir?id=${item.data.id}`);
        else if (item.kind === 'suspect') router.push(`/detective?suspect=${encodeURIComponent(item.data.name)}`);
        else if (item.kind === 'district') router.push(`/heatmap?district=${encodeURIComponent(item.data.name)}`);
        else if (item.kind === 'category') router.push(`/search?query=${encodeURIComponent(item.data.name)}`);
        else if (item.kind === 'alert') router.push(`/alerts`);
        else if (item.kind === 'network') router.push(`/network`);
        setShowDropdown(false);
        setSearchQuery('');
        setActiveIdx(-1);
      } else if (searchQuery) {
        // AI query keywords detection to redirect to AI Investigator
        const lowerQ = searchQuery.toLowerCase();
        if (lowerQ.includes('hotspot') || lowerQ.includes('cybercrime') || lowerQ.includes('offender') || lowerQ.includes('anomaly') || lowerQ.includes('risk') || lowerQ.includes('active')) {
          router.push(`/investigator?query=${encodeURIComponent(searchQuery)}`);
        } else {
          router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
        setShowDropdown(false);
        setSearchQuery('');
        setActiveIdx(-1);
      }
    }
  }, [showDropdown, activeIdx, allResults, searchQuery, router]);

  // Simple Natural Language Processing Solver
  const parseNLPQuery = (queryStr: string) => {
    const qLower = queryStr.toLowerCase();
    
    // "show cybercrime cases in Bengaluru"
    if (qLower.includes('cybercrime') && (qLower.includes('bengaluru') || qLower.includes('blr'))) {
      return {
        message: 'AI Solver: Filtering Cybercrime in Bengaluru Urban',
        links: [
          { label: 'View Bengaluru Cybercrime Map', url: '/heatmap?district=Bengaluru%20Urban&filter=cybercrime' },
          { label: 'Analyze Cybercrime Insights', url: '/insights' }
        ]
      };
    }
    // "rape cases in Kalaburagi"
    if ((qLower.includes('rape') || qLower.includes('sexual') || qLower.includes('assault')) && (qLower.includes('kalaburagi') || qLower.includes('klg'))) {
      return {
        message: 'AI Solver: Filtering Assault/Rape cases in Kalaburagi',
        links: [
          { label: 'Open Kalaburagi District Info', url: '/heatmap?district=Kalaburagi' },
          { label: 'Check Kalaburagi Risk Forecast', url: '/predictions' }
        ]
      };
    }
    // "FIR filed against Deepak Swamy"
    if (qLower.includes('fir') && (qLower.includes('deepak') || qLower.includes('swamy') || qLower.includes('suresh') || qLower.includes('imran'))) {
      let suspectName = 'Suresh Nayak';
      if (qLower.includes('deepak')) suspectName = 'Deepak Gowda';
      if (qLower.includes('imran')) suspectName = 'Imran Sheikh';
      return {
        message: `AI Solver: Searching FIR files for suspect: ${suspectName}`,
        links: [
          { label: `Open ${suspectName} Profile`, url: `/detective?suspect=${encodeURIComponent(suspectName)}` },
          { label: `Track ${suspectName} in Network`, url: '/network' }
        ]
      };
    }
    // "high risk districts"
    if (qLower.includes('high risk') || qLower.includes('critical district') || qLower.includes('risk districts')) {
      return {
        message: 'AI Solver: Identifying Districts with Risk Score > 80%',
        links: [
          { label: 'Open Karnataka Map', url: '/heatmap' },
          { label: 'View Risk Predictions', url: '/predictions' }
        ]
      };
    }
    // "active investigations"
    if (qLower.includes('active investigation') || qLower.includes('unresolved cases') || qLower.includes('active cases')) {
      return {
        message: 'AI Solver: Displaying Active Investigation Statistics',
        links: [
          { label: 'Open Copilot Action Center', url: '/copilot' },
          { label: 'View Executive Briefing', url: '/commissioner' }
        ]
      };
    }
    // "organized crime suspects"
    if (qLower.includes('organized crime') || qLower.includes('syndicate') || qLower.includes('gang')) {
      return {
        message: 'AI Solver: Identifying Organized Crime Syndicate Suspects',
        links: [
          { label: 'Open Criminal Networks Map', url: '/network' },
          { label: 'Inspect Crime Pattern Genome', url: '/genome' }
        ]
      };
    }
    return null;
  };

  const nlpResult = q.length >= 4 ? parseNLPQuery(q) : null;

  const riskColor = (score: number) => {
    if (score > 80) return '#ef4444';
    if (score > 60) return '#f59e0b';
    return '#0F6B5C';
  };

  return (
    <>

      <style>{`
        .header > *:not(.search-bar-responsive) {
          flex: 0 0 auto !important;
        }
        .search-bar-responsive:focus-within {
          border-color: var(--primary-navy) !important;
          box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.15) !important;
        }
        .input-responsive {
          padding-left: 40px !important;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        .input-responsive:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        @media (min-width: 1200px) {
          .search-bar-responsive {
            flex: 1 1 auto !important;
            min-width: 320px !important;
            max-width: 720px !important;
          }
          .kbd-shortcut-responsive {
            display: inline-flex !important;
          }
          .input-responsive {
            padding-right: 120px !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1199px) {
          .search-bar-responsive {
            flex: 1 1 auto !important;
            min-width: 320px !important;
            max-width: 720px !important;
          }
          .kbd-shortcut-responsive {
            display: none !important;
          }
          .input-responsive {
            padding-right: 56px !important;
          }
        }
        @media (max-width: 1023px) {
          .search-bar-responsive {
            flex: 0 0 auto !important;
            width: 220px !important;
            min-width: 220px !important;
          }
          .kbd-shortcut-responsive {
            display: none !important;
          }
          .input-responsive {
            padding-right: 56px !important;
          }
        }
        @media (max-width: 768px) {
          .search-bar-responsive {
            flex: 0 0 auto !important;
            width: 180px !important;
            min-width: 180px !important;
          }
          .kbd-shortcut-responsive {
            display: none !important;
          }
          .input-responsive {
            padding-right: 56px !important;
          }
        }
      `}</style>

      <header
        className="fixed top-0 right-0 z-40 header"
        style={{
          left: isSidebarOpen ? '256px' : '0px',
          top: '72px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          height: '72px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'nowrap',
          transition: 'all 250ms ease',
        }}
      >
        {/* Left Section: Sidebar toggle, Logo & Officer Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          {/* Hamburger Sidebar Toggle */}
          <button
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.body.classList.toggle('sidebar-open');
              }
              if (onToggleSidebar) {
                onToggleSidebar();
              }
            }}
            className="hamburger-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: '1px solid var(--border-default)',
              background: '#F3F4F6',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'background 200ms',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>

          {/* Logo Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(30, 58, 95, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-navy)',
            }}>
              <Shield size={20} strokeWidth={1.75} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1.2' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary-navy)', whiteSpace: 'nowrap' }}>
                CrimeVision AI
              </span>
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                AI Intelligence Platform
              </span>
            </div>
          </div>

          {/* Officer Badge */}
          <span
            className="pill-label"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '999px',
              background: portalType === 'admin' ? 'rgba(166, 25, 46, 0.08)' : '#ECFDF5',
              color: portalType === 'admin' ? '#A6192E' : '#047857',
              border: `1px solid ${portalType === 'admin' ? 'rgba(166, 25, 46, 0.15)' : '#A7F3D0'}`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '24px',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
            }}
          >
            {portalType === 'admin' ? 'Admin' : 'Officer'}
          </span>
        </div>

        {/* Center Section: Search Bar */}
        <div className="relative search-bar-responsive" ref={dropdownRef} style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: '44px',
          borderRadius: '12px',
          border: '1px solid #D1D5DB',
          background: '#FFFFFF',
          flexShrink: 1,
          transition: 'all 200ms ease',
        }}>
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder={lang === 'kn' ? "ಹುಡುಕಿ..." : "Search cases, suspects..."}
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); setActiveIdx(-1); }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            className="input-responsive"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              paddingLeft: '40px',
              fontSize: '15px',
              color: '#374151',
            }}
          />
          <Search size={20} strokeWidth={1.75} className="text-slate-400 icon-search" style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />

          {/* Right Flex Widgets: Clear button, Ctrl+K and Mic aligned and spaced */}
          <div className="right-widgets-container" style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'auto',
          }}>
            {/* Clear button if text exists */}
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                type="button"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            )}

            {/* Shortcut badge */}
            <div className="kbd-shortcut-responsive" style={{
              background: '#F3F4F6',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              Ctrl+K
            </div>

            {/* Voice Mic Button */}
            {voiceSupported && (
              <button
                onClick={handleVoiceSearch}
                type="button"
                title={isVoiceActive ? "Listening... Click to stop" : "Voice Search (EN/KN)"}
                className="mic-button-responsive"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isVoiceActive ? 'rgba(239,68,68,0.1)' : 'transparent',
                  color: isVoiceActive ? '#ef4444' : '#6B7280',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 200ms',
                }}
                onMouseEnter={e => {
                  if (!isVoiceActive) e.currentTarget.style.background = '#F3F4F6';
                }}
                onMouseLeave={e => {
                  if (!isVoiceActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {isVoiceActive ? (
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-red-500/20 animate-ping" />
                    <MicOff size={16} strokeWidth={1.75} className="relative text-red-500 animate-pulse" />
                  </div>
                ) : (
                  <Mic size={16} strokeWidth={1.75} />
                )}
              </button>
            )}
          </div>

          {/* Search Dropdown with Premium Police Command Center Look */}
          {showDropdown && (
            <div
              className="absolute top-14 left-0 right-0 rounded-2xl z-50 border overflow-hidden"
              style={{
                width: '100%',
                minWidth: '320px',
                background: 'var(--topbar-bg)',
                borderColor: 'var(--cyber-border)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                backdropFilter: 'none',
                padding: '20px',
              }}
            >
              {/* Empty state / Smart Suggestions & Search Analytics */}
              {!q && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Smart Suggestions */}
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-black text-[var(--cyber-cyan)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Sparkles size={11} /> Suggested Searches
                      </div>
                      <div className="flex flex-col gap-2">
                        {[
                          { label: 'Cybercrime hotspots', q: 'Show cybercrime hotspots' },
                          { label: 'High risk districts', q: 'high risk districts' },
                          { label: 'Most wanted criminals', q: 'organized crime suspects' },
                          { label: 'Recent FIRs', q: 'active investigations' },
                          { label: 'Active investigations', q: 'active investigations' }
                        ].map(s => (
                          <button
                            key={s.label}
                            onMouseDown={() => { setSearchQuery(s.q); setShowDropdown(true); }}
                            className="w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-all border flex items-center justify-between"
                            style={{
                              background: 'var(--cyber-bg)',
                              borderColor: 'var(--cyber-border)',
                              color: 'var(--text-secondary)',
                            }}
                            onMouseEnter={e => { 
                              e.currentTarget.style.borderColor = 'var(--cyber-cyan)'; 
                              e.currentTarget.style.color = 'var(--text-primary)';
                              e.currentTarget.style.transform = 'translateX(2px)';
                            }}
                            onMouseLeave={e => { 
                              e.currentTarget.style.borderColor = 'var(--cyber-border)'; 
                              e.currentTarget.style.color = 'var(--text-secondary)';
                              e.currentTarget.style.transform = 'none';
                            }}
                          >
                            <span>{s.label}</span>
                            <ChevronRight size={12} className="text-slate-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {voiceSupported && (
                      <div className="p-3.5 rounded-xl border border-dashed" style={{ borderColor: 'var(--cyber-border)', background: 'var(--cyber-bg)' }}>
                        <div className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Mic size={12} className="text-[var(--cyber-cyan)]" /> Voice Recognition Active
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed m-0">
                          Click the mic button and state your query in English or Kannada.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Search Analytics */}
                  <div className="space-y-4 border-l pl-5" style={{ borderColor: 'var(--cyber-border)' }}>
                    <div>
                      <div className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <TrendingUp size={11} className="text-amber-500" /> Search Analytics & Intel
                      </div>
                      
                      {/* Trending Searches */}
                      <div className="mb-4">
                        <div className="text-[10px] text-[var(--text-dim)] uppercase font-semibold mb-2">Trending Searches:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {['Suresh Nayak', 'Kalaburagi', 'UPI Fraud', 'Sand Mining'].map(t => (
                            <span 
                              key={t}
                              onMouseDown={() => setSearchQuery(t)}
                              className="px-2.5 py-1 text-[10px] rounded bg-[var(--cyber-bg)] border border-[var(--cyber-border)] text-[var(--text-muted)] cursor-pointer hover:border-[var(--cyber-cyan)] hover:text-[var(--text-primary)] transition-colors"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Most Wanted Suspects */}
                      <div>
                        <div className="text-[10px] text-[var(--text-dim)] uppercase font-semibold mb-2">Most Wanted Suspects:</div>
                        <div className="flex flex-col gap-2">
                          {[
                            { name: 'Suresh Nayak', risk: '97%' },
                            { name: 'Imran Sheikh', risk: '96%' }
                          ].map(s => (
                            <div key={s.name} className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-[var(--text-primary)]">{s.name}</span>
                              <span className="text-[11px] font-black text-red-500">{s.risk} Risk</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Presentation Mode Toggle */}
        <button
          onClick={togglePresentationMode}
          title={isPresentationMode ? "Exit Projector View" : "Presentation Mode (Projector)"}
          className="flex-shrink-0"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: 'none',
            background: isPresentationMode ? 'var(--accent-cyan-dim)' : 'transparent',
            color: isPresentationMode ? 'var(--accent-cyan)' : 'var(--text-muted)',
            transition: 'all 200ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isPresentationMode ? 'var(--accent-cyan-dim)' : 'transparent';
          }}
        >
          <Monitor size={20} strokeWidth={1.75} />
        </button>

        {/* Right Section: Date, Live Time, Restricted Badge, Language Toggle, Bell Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto', flexShrink: 0 }}>




          {/* Language Toggle Link */}
          <div 
            className="flex-shrink-0"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              padding: '2px 4px',
              height: '40px',
              background: '#FFFFFF',
              boxSizing: 'border-box'
            }}
          >
            <button
              onClick={() => setLang('en')}
              className="pill-label"
              style={{
                background: lang === 'en' ? 'var(--primary-navy)' : 'transparent',
                color: lang === 'en' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                width: '56px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang('kn')}
              className="pill-label"
              style={{
                background: lang === 'kn' ? 'var(--primary-navy)' : 'transparent',
                color: lang === 'kn' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.02em',
                width: '64px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
              }}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setIsAlertOpen(true)}
              className="notification-button"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 200ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Bell size={20} strokeWidth={1.75} />
              {unreadAlertsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#DC2626',
                    color: 'white',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                  className="badge-count animate-pulse"
                >
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* Vertical Divider */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border-default)', margin: '0 4px' }} />

          {/* User Profile Dropdown */}
          <UserMenu user={user} />
        </div>
      </header>

      {/* Alert Panel Slide-over Drawer */}
      <AlertPanel isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
    </>
  );
}
