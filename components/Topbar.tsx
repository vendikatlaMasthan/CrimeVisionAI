'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { PortalType } from '@/lib/rbac';
import { 
  Bell, Search, Shield, X, FileText, User, MapPin, AlertTriangle, 
  Monitor, Sun, Moon, Menu, Mic, MicOff, Brain, Sparkles, 
  TrendingUp, ChevronRight, Activity, ShieldAlert, ArrowRight, CornerDownLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageToggle';
import { useTheme } from './ThemeContext';
import { usePresentation } from './PresentationContext';
import { SearchInput } from './SearchInput';
import AlertPanel from './AlertPanel';
import UserMenu from './UserMenu';
import { FIR_RECORDS, CRIMINAL_PROFILES, CRIME_CATEGORIES, LIVE_ALERTS, CRIMINAL_NETWORK } from '@/lib/mockData';
import { DISTRICTS, RECENT_FIRS, TOP_SUSPECTS } from '@/lib/crimeData';
import { DemoAccount } from '@/lib/crimeData';

interface TopbarProps {
  user?: DemoAccount | null;
  portalType: PortalType;
}

export default function Topbar({ user, portalType }: TopbarProps) {
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
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
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
      <header
        className="fixed top-0 right-0 flex items-center justify-between px-6 z-40"
        style={{
          left: '256px',
          top: '72px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          height: '64px',
        }}
      >
        {/* Left: Context Label & Mobile Hamburg Toggle */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.body.classList.toggle('sidebar-open');
              }
            }}
            className="hamburger-btn lg:hidden p-1.5 rounded-lg border cursor-pointer transition-colors"
            style={{
              borderColor: 'var(--border-default)',
              background: '#F3F4F6',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Toggle Sidebar"
          >
            <Menu size={16} />
          </button>
          
          <span className="hidden md:inline text-xs font-semibold text-[var(--text-muted)] tracking-widest uppercase">
            AI INTELLIGENCE PLATFORM
          </span>
          <span
            className="hidden md:inline"
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '3px 10px',
              borderRadius: '999px',
              background: portalType === 'admin'
                ? 'rgba(166, 25, 46, 0.08)'
                : 'rgba(15, 107, 92, 0.08)',
              color: portalType === 'admin' ? '#A6192E' : '#0F6B5C',
              border: `1px solid ${portalType === 'admin' ? 'rgba(166, 25, 46, 0.15)' : 'rgba(15, 107, 92, 0.15)'}`,
              marginLeft: '8px',
            }}
          >
            {portalType === 'admin' ? 'Admin' : 'Officer'}
          </span>
        </div>

        {/* Center: Global Search */}
        <div className="relative ml-6 mr-3" ref={dropdownRef} style={{ flex: '1 1 auto', maxWidth: '420px', minWidth: '150px', height: '40px' }}>
          <div className="relative flex items-center w-full h-full">
            <SearchInput
              ref={inputRef}
              id="global-search-input"
              placeholder={lang === 'kn' 
                ? "ಹುಡುಕಿ FIRಗಳು, ಶಂಕಿತರು... (Press /)"
                : "Search FIRs, Suspects, Districts, Crime IDs... (Press /)"
              }
              value={searchQuery}
              onChange={val => { setSearchQuery(val); setShowDropdown(true); setActiveIdx(-1); }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              style={{
                background: 'var(--bg-input)',
                paddingRight: '64px',
              }}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button 
                  onClick={handleClearSearch}
                  type="button"
                  className="p-1 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X size={13} />
                </button>
              )}
              {voiceSupported && (
                <button
                  onClick={handleVoiceSearch}
                  type="button"
                  title={isVoiceActive ? "Listening... Click to stop" : "Voice Search (EN/KN)"}
                  className="p-1 rounded-full cursor-pointer transition-colors duration-200 flex items-center justify-center"
                  style={{
                    background: isVoiceActive ? 'rgba(239,68,68,0.15)' : 'transparent',
                    color: isVoiceActive ? '#ef4444' : 'var(--text-muted)',
                  }}
                >
                  {isVoiceActive ? (
                    <div className="relative">
                      <span className="absolute -inset-1 rounded-full bg-red-500/20 animate-ping" />
                      <MicOff size={13} className="relative text-red-500 animate-pulse" />
                    </div>
                  ) : (
                    <Mic size={13} className="hover:text-[var(--text-primary)]" />
                  )}
                </button>
              )}
              {!searchQuery && !isVoiceActive && (
                <div className="pointer-events-none text-[10px] font-semibold text-[var(--text-faint)] font-mono px-1">
                  ⌘K
                </div>
              )}
            </div>
          </div>

          {/* Search Dropdown with Premium Police Command Center Look */}
          {showDropdown && (
            <div
              className="absolute top-14 left-0 right-0 rounded-2xl z-50 border overflow-hidden"
              style={{
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
                          Click the mic button and state your query in English or Kannada (e.g. <span className="text-[var(--cyber-cyan)] font-mono">"show cybercrime cases"</span> or <span className="text-[var(--cyber-cyan)] font-mono">"ಸಂದೀಪ್ ನಾಯಕ್"</span>).
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Search Analytics (Palantir Gotham Style) */}
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

                      {/* Most Accessed FIRs */}
                      <div className="mb-4">
                        <div className="text-[10px] text-[var(--text-dim)] uppercase font-semibold mb-2">Most Accessed FIRs:</div>
                        <div className="flex flex-col gap-2">
                          {[
                            { id: 'KA-2025-047823', type: 'Cybercrime', dist: 'Bengaluru' },
                            { id: 'KA-2025-047801', type: 'Narcotics', dist: 'Kalaburagi' }
                          ].map(f => (
                            <div key={f.id} className="flex justify-between items-center text-xs">
                              <Link href={`/fir?id=${f.id}`} className="font-mono text-[var(--cyber-cyan)] hover:underline font-bold" onClick={() => setShowDropdown(false)}>
                                {f.id}
                              </Link>
                              <span className="text-[11px] text-[var(--text-muted)]">{f.type} · {f.dist}</span>
                            </div>
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
                              <Link href={`/search?query=${encodeURIComponent(s.name)}`} className="text-[var(--text-primary)] hover:underline font-bold" onClick={() => setShowDropdown(false)}>
                                {s.name}
                              </Link>
                              <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-1.5 py-0.5 rounded">RISK: {s.risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* No results */}
              {q && allResults.length === 0 && (
                <div className="text-center py-6 text-xs text-[var(--text-muted)] flex flex-col items-center justify-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" />
                  <span>No records found for &ldquo;<span className="text-[var(--cyber-cyan)] font-bold">{searchQuery}</span>&rdquo;</span>
                </div>
              )}

              {/* Natural Language Resolve Header */}
              {nlpResult && (
                <div className="mb-4 p-3.5 rounded-xl border border-[var(--accent-cyan)]/35" style={{ background: 'rgba(15,107,92,0.03)' }}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-black text-[var(--cyber-cyan)] uppercase tracking-wider flex items-center gap-1.5">
                      <Brain size={11} className="animate-pulse" /> AI Natural Language Resolution
                    </span>
                    <span className="text-[9px] font-mono text-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/15 px-1.5 py-0.5 rounded font-black">SOLVER ACTIVE</span>
                  </div>
                  <div className="text-xs text-[var(--text-primary)] font-semibold mb-2">
                    {nlpResult.message}
                  </div>
                  <div className="flex gap-2">
                    {nlpResult.links.map((link: any, idx: number) => (
                      <Link 
                        key={idx} 
                        href={link.url}
                        onClick={() => { setShowDropdown(false); setSearchQuery(''); }}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-[var(--cyber-cyan)]/10 border border-[var(--cyber-cyan)]/25 text-[var(--cyber-cyan)] font-bold hover:bg-[var(--cyber-cyan)]/25 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorized Dropdown Results */}
              {q && allResults.length > 0 && (
                <div style={{ maxHeight: 380, overflowY: 'auto' }} className="space-y-4 pr-1">
                  
                  {/* FIRs */}
                  {matchedFIRs.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-[var(--cyber-cyan)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText size={10} /> 📄 FIR Cases ({matchedFIRs.length})
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {matchedFIRs.map((fir, idx) => {
                          const flatIdx = getFlatIndex('fir', idx);
                          return (
                            <div key={fir.id}
                              className="p-3 rounded-xl border transition-all duration-200 text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(0,240,255,0.06)' : 'var(--cyber-bg)',
                                borderColor: activeIdx === flatIdx ? 'var(--cyber-cyan)' : 'var(--cyber-border)',
                                borderLeft: '4px solid var(--cyber-cyan)',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono font-bold text-[var(--cyber-cyan)]">{fir.firNumber}</span>
                                <span className="text-[9px] font-black bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">{fir.priority?.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5">
                                <span>{fir.crimeType} · Accused: {fir.suspectName}</span>
                                <span>📍 {fir.district}</span>
                              </div>
                              {/* Quick Actions */}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--cyber-border)]/50">
                                <Link href={`/fir?id=${fir.id}`} className="text-[10px] text-[var(--cyber-cyan)] font-bold hover:underline" onClick={() => setShowDropdown(false)}>View FIR</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href={`/copilot?id=${fir.id}`} className="text-[10px] text-amber-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Investigate</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href="/reports" className="text-[10px] text-purple-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Generate Report</Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suspects */}
                  {matchedSuspects.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User size={10} /> 👤 Suspect Dossiers ({matchedSuspects.length})
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {matchedSuspects.map((s, idx) => {
                          const flatIdx = getFlatIndex('suspect', idx);
                          return (
                            <div key={s.id}
                              className="p-3 rounded-xl border transition-all duration-200 text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(239,68,68,0.05)' : 'var(--cyber-bg)',
                                borderColor: activeIdx === flatIdx ? 'rgba(239,68,68,0.3)' : 'var(--cyber-border)',
                                borderLeft: '4px solid #ef4444',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{s.name} ({s.alias})</span>
                                <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Risk: {s.riskLevel}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5">
                                <span>Primary Crime: {s.crimeType}</span>
                                <span>📍 {s.district}</span>
                              </div>
                              {/* Quick Actions */}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--cyber-border)]/50">
                                <Link href={`/detective?suspect=${encodeURIComponent(s.name)}`} className="text-[10px] text-red-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Investigate Dossier</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href="/network" className="text-[10px] text-green-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>View Network</Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Districts */}
                  {matchedDistricts.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-purple-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MapPin size={10} /> 📍 Districts Intelligence ({matchedDistricts.length})
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {matchedDistricts.map((d, idx) => {
                          const flatIdx = getFlatIndex('district', idx);
                          return (
                            <div key={d.id}
                              className="p-3 rounded-xl border transition-all duration-200 text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(167,139,250,0.06)' : 'var(--cyber-bg)',
                                borderColor: activeIdx === flatIdx ? 'rgba(167,139,250,0.3)' : 'var(--cyber-border)',
                                borderLeft: '4px solid #8b5cf6',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{d.name} ({d.code})</span>
                                <span className="text-[9px] font-bold" style={{ color: riskColor(d.riskScore) }}>Risk Score: {d.riskScore}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5">
                                <span>{d.crimeCount.toLocaleString()} incidents · {d.activeCases} active</span>
                                <span>Top Crime: {d.topCrimeType}</span>
                              </div>
                              {/* Quick Actions */}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--cyber-border)]/50">
                                <Link href={`/heatmap?district=${encodeURIComponent(d.name)}`} className="text-[10px] text-purple-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Open District</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href="/network" className="text-[10px] text-green-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>View Network</Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Crime Categories */}
                  {matchedCategories.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle size={10} /> ⚠ Crime Types ({matchedCategories.length})
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {matchedCategories.map((c, idx) => {
                          const flatIdx = getFlatIndex('category', idx);
                          return (
                            <div key={c.name}
                              className="p-3 rounded-xl border transition-all duration-200 text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(245,158,11,0.06)' : 'var(--cyber-bg)',
                                borderColor: activeIdx === flatIdx ? 'rgba(245,158,11,0.3)' : 'var(--cyber-border)',
                                borderLeft: '4px solid #f59e0b',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{c.name}</span>
                                <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">{c.trend} Trend</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5">
                                <span>{c.count.toLocaleString()} cases total</span>
                                <span>State distribution: {c.percentage}%</span>
                              </div>
                              {/* Quick Actions */}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--cyber-border)]/50">
                                <Link href={`/investigator?query=Show+cases+of+${encodeURIComponent(c.name)}`} className="text-[10px] text-amber-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Investigate Category</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href="/reports" className="text-[10px] text-purple-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Generate Report</Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {matchedAlerts.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldAlert size={10} /> 🚨 Live Intelligence Alerts ({matchedAlerts.length})
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {matchedAlerts.map((a, idx) => {
                          const flatIdx = getFlatIndex('alert', idx);
                          return (
                            <div key={a.id}
                              className="p-3 rounded-xl border transition-all duration-200 text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(249,115,22,0.06)' : 'var(--cyber-bg)',
                                borderColor: activeIdx === flatIdx ? 'rgba(249,115,22,0.3)' : 'var(--cyber-border)',
                                borderLeft: '4px solid #f97316',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{a.title}</span>
                                <span className="text-[9px] font-mono text-orange-500">{a.timestamp}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5">
                                <span>{a.description}</span>
                                <span>📍 {a.district}</span>
                              </div>
                              {/* Quick Actions */}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--cyber-border)]/50">
                                <Link href="/alerts" className="text-[10px] text-red-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Dispatch Tactical</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href="/alerts" className="text-[10px] text-amber-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Acknowledge Alert</Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Criminal Networks */}
                  {matchedNetworks.length > 0 && (
                    <div>
                      <div className="text-[10px] font-black text-green-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Activity size={10} /> 🧬 Criminal Networks & Genome Nodes ({matchedNetworks.length})
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {matchedNetworks.map((n, idx) => {
                          const flatIdx = getFlatIndex('network', idx);
                          return (
                            <div key={n.id}
                              className="p-3 rounded-xl border transition-all duration-200 text-left"
                              style={{
                                background: activeIdx === flatIdx ? 'rgba(34,197,94,0.06)' : 'var(--cyber-bg)',
                                borderColor: activeIdx === flatIdx ? 'rgba(34,197,94,0.3)' : 'var(--cyber-border)',
                                borderLeft: '4px solid #22c55e',
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{n.label}</span>
                                <span className="text-[9px] font-mono text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{n.type?.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] mt-1.5">
                                <span>{n.district || 'State-wide'} · {n.status || 'Active Node'}</span>
                                {n.risk && <span className="text-red-500 font-bold">Risk: {n.risk}</span>}
                              </div>
                              {/* Quick Actions */}
                              <div className="flex gap-2 mt-2 pt-2 border-t border-[var(--cyber-border)]/50">
                                <Link href="/network" className="text-[10px] text-green-500 font-bold hover:underline" onClick={() => setShowDropdown(false)}>Inspect Node</Link>
                                <span className="text-[var(--text-dim)]">·</span>
                                <Link href="/genome" className="text-[10px] text-[var(--cyber-cyan)] font-bold hover:underline" onClick={() => setShowDropdown(false)}>Analyze Genome</Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Ask Copilot Integration */}
                  <div 
                    onClick={() => {
                      router.push(`/investigator?query=${encodeURIComponent(searchQuery)}`);
                      setShowDropdown(false);
                      setSearchQuery('');
                    }}
                    className="mt-4 p-3 rounded-xl border border-dashed flex items-center justify-between cursor-pointer transition-colors hover:bg-[var(--cyber-cyan)]/5"
                    style={{ borderColor: 'var(--cyber-cyan)' }}
                  >
                    <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                      <Brain size={15} className="text-[var(--cyber-cyan)] animate-pulse" />
                      <span>Ask **CrimeNet AI Assistant** about &ldquo;<span className="text-[var(--cyber-cyan)] font-bold">{searchQuery}</span>&rdquo;</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[var(--cyber-cyan)] text-[10px] font-bold">
                      <span>RUN INTEL</span>
                      <CornerDownLeft size={10} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Presentation Mode Toggle - placed as a sibling flex item after the search bar */}
        <button
          onClick={togglePresentationMode}
          title={isPresentationMode ? "Exit Projector View" : "Presentation Mode (Projector)"}
          className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 mr-3"
          style={{
            background: isPresentationMode ? 'var(--accent-cyan-dim)' : 'transparent',
            color: isPresentationMode ? 'var(--accent-cyan)' : 'var(--text-muted)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = isPresentationMode ? 'var(--accent-cyan-dim)' : 'transparent';
          }}
        >
          <Monitor size={15} />
        </button>

        {/* Right: Spaced Actions Row */}
        <div className="flex items-center gap-3 justify-end">



          {/* Language Toggle Link */}
          <div className="flex items-center gap-1 border border-[var(--border-default)] rounded-lg p-0.5 px-1.5 h-9">
            <button
              onClick={() => setLang('en')}
              style={{
                background: lang === 'en' ? 'var(--accent-cyan)' : 'transparent',
                color: lang === 'en' ? 'var(--accent-cyan-text-on-fill)' : 'var(--text-muted)',
              }}
              className="text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors"
            >
              EN
            </button>
            <span className="text-[10px] text-[var(--border-default)]">|</span>
            <button
              onClick={() => setLang('kn')}
              style={{
                background: lang === 'kn' ? 'var(--accent-cyan)' : 'transparent',
                color: lang === 'kn' ? 'var(--accent-cyan-text-on-fill)' : 'var(--text-muted)',
              }}
              className="text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition-colors"
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsAlertOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors relative"
              style={{
                background: 'transparent',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Bell size={15} />
              {unreadAlertsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--priority-critical)] text-[8px] font-black text-white flex items-center justify-center animate-pulse"
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
