'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Brain, Send, Mic, MicOff, Search, FileText, Plus, ShieldAlert, Sparkles, User, MapPin, 
  Clock, CheckCircle, RefreshCw, ChevronRight, AlertTriangle, HelpCircle, Eye, Clipboard, Share2, Shield, Zap
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import AIRecommendationCard from '@/components/AIRecommendationCard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string; // fallback if not structured
  timestamp: string;
  isStructured?: boolean;
  evidenceSummary?: string[];
  suspectNetwork?: string[];
  recommendedActions?: string[];
  confidence?: number;
  reason?: string;
  reasoningChain?: string[];
  showReasoning?: boolean;
}

// ─── Initial Dataset ─────────────────────────────────────────────────────────

const DISTRICTS = ["Kalaburagi", "Raichur", "Bengaluru Urban", "Mysuru", "Belagavi", "Ballari", "Bidar"];
const CATEGORIES = ["Sand Mafia", "Cyber Fraud", "Vehicle Theft", "Narcotics", "Organized Crime"];

const RECENT_CASES = [
  { firNumber: "KA-2026-08821", suspectName: "Raju Naik", district: "Kalaburagi", category: "Sand Mafia", date: "21 Jun 2026", severity: 91, officer: "PI Ravi Shankar" },
  { firNumber: "KA-2026-08734", suspectName: "Arjun Gowda", district: "Bengaluru Urban", category: "Cyber Fraud", date: "20 Jun 2026", severity: 74, officer: "Insp Anil K" },
  { firNumber: "KA-2026-08612", suspectName: "Kiran Kumar", district: "Mysuru", category: "Vehicle Theft", date: "19 Jun 2026", severity: 42, officer: "PI Mahesh Kumar" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AIInvestigatorPage() {
  const { t, lang } = useLanguage();

  // Case Loader Form States
  const [firNumber, setFirNumber] = useState("KA-2026-08821");
  const [suspectName, setSuspectName] = useState("Raju Naik");
  const [selectedDistrict, setSelectedDistrict] = useState("Kalaburagi");
  const [selectedCategory, setSelectedCategory] = useState("Sand Mafia");

  // Summary Metrics (Panel 3)
  const [severityScore, setSeverityScore] = useState(91);
  const [aiConfidence, setAiConfidence] = useState(92);
  const [officerName, setOfficerName] = useState("PI Ravi Shankar");
  const [suspectCount, setSuspectCount] = useState(1);
  const [networkLinks, setNetworkLinks] = useState(5);

  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial Load Analyser Card
  const triggerLoadAndAnalyze = (customFir?: string, customSuspect?: string, customDist?: string, customCat?: string) => {
    const fNum = customFir || firNumber;
    const sName = customSuspect || suspectName;
    const dist = customDist || selectedDistrict;
    const cat = customCat || selectedCategory;

    setIsTyping(true);
    setMessages([]);

    // Update case summary panel details dynamically
    const matched = RECENT_CASES.find(c => c.firNumber === fNum);
    if (matched) {
      setSeverityScore(matched.severity);
      setOfficerName(matched.officer);
    } else {
      // Synthetic generation
      setSeverityScore(Math.floor(35 + Math.random() * 55));
      setOfficerName("PI Mahesh Kumar");
    }

    const conf = Math.floor(82 + Math.random() * 14);
    setAiConfidence(conf);
    setSuspectCount(sName ? 1 : 0);
    setNetworkLinks(Math.floor(2 + Math.random() * 6));

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const welcome: Message = {
        id: 'welcome',
        role: 'assistant',
        isStructured: true,
        timestamp,
        confidence: conf,
        reason: "Matched against historical database + local network node proximity.",
        evidenceSummary: [
          `4 core items analyzed for case: FIR #${fNum}`,
          `Forensic soil texture matches Kalaburagi riverbed soil standard.`,
          `CCTV log verifies suspect vehicle presence on NH-50 corridor at 12:10 PM.`
        ],
        suspectNetwork: [
          `Primary Accused: ${sName || 'Unknown'}`,
          `Direct network connections found: ${matched ? 4 : 3} active links.`,
          `Linked to ${dist} organized criminal syndicates.`
        ],
        recommendedActions: [
          `Issue immediate Lookout notice for Accused ${sName || 'Raju Naik'}.`,
          `Deploy border checkpoint interception squads at exit terminals.`,
          `Coordinate with local river control panels.`
        ],
        reasoningChain: [
          `Loaded FIR #${fNum} evidence corpus.`,
          `Cross-referenced files with 18-month historical crime database.`,
          `Identified 87% pattern similarity with regional signatures.`,
          `Graph traversal completed — found ${matched ? 4 : 3} direct command and supply links.`,
          `Generated final tactical directives.`
        ],
        showReasoning: false,
      };

      setMessages([welcome]);
      setIsTyping(false);
    }, 1000);
  };

  // Run on mount
  useEffect(() => {
    triggerLoadAndAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load Recent Case
  const handleLoadRecent = (item: typeof RECENT_CASES[0]) => {
    setFirNumber(item.firNumber);
    setSuspectName(item.suspectName);
    setSelectedDistrict(item.district);
    setSelectedCategory(item.category);
    triggerLoadAndAnalyze(item.firNumber, item.suspectName, item.district, item.category);
  };

  // Handle Send Query
  const handleSendQuery = (text: string) => {
    const query = text.trim();
    if (!query) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Select appropriate canned response based on keywords
      const lower = query.toLowerCase();
      let evidence = ["No transaction flags resolved yet."];
      let network = ["Evaluating direct links..."];
      let recs = ["Awaiting data log updates."];
      let reason = "Context based search match.";
      let chain = ["Indexed database entries.", "Parsed text search queries."];

      if (lower.includes('suspect') || lower.includes('who')) {
        evidence = [
          `Accused is linked to prior FIRs in ${selectedDistrict}.`,
          `Active communication records show 14 calls to lieutenant Venkat Reddy.`
        ];
        network = [
          `Primary: ${suspectName}`,
          `1 Commands link: Venkat Reddy`,
          `1 Supplied by link: Dawood S`,
          `1 Associate link: Suresh Patil`
        ];
        recs = [
          `Deploy field intelligence units to primary suspect coordinates.`,
          `Audit phone logs for the past 48 hours.`
        ];
        reason = "Command graph node hierarchy matches standard kingpin structure.";
        chain = [
          "Indexed nodes linked to suspect ID S001.",
          "Filtered links where relationship type is COMMANDS.",
          "Compiled associate profiles and risk statistics."
        ];
      } else if (lower.includes('risk') || lower.includes('threat') || lower.includes('level')) {
        evidence = [
          `District ${selectedDistrict} has threat index score of ${severityScore}/100.`,
          `Annual YoY trend represents a significant change.`
        ];
        network = [
          `Co-conspirators show active threat rating above 80%.`
        ];
        recs = [
          `Deploy additional patrol cars to high-risk zones.`,
          `Establish round-the-clock checkposts at district coordinates.`
        ];
        reason = "Calculated risk based on historical volume and active alert frequency.";
        chain = [
          "Loaded district baseline statistics.",
          "Added active alert counts and priority coefficients.",
          "Calculated final threat forecast probability (HIGH)."
        ];
      } else if (lower.includes('case') || lower.includes('similar') || lower.includes('past')) {
        evidence = [
          `Matched case FIR #KA-2024-04982 in Kalaburagi.`,
          `M.O. matches sand extraction from dry riverbeds.`
        ];
        network = [
          `2 identical associates overlap with the 2024 syndicate.`
        ];
        recs = [
          `Deploy river patrol units as performed in 2024 operations.`,
          `Apply same interrogation template to arrested drivers.`
        ];
        reason = "High overlap in modus operandi and geographic indicators.";
        chain = [
          "Calculated cosine similarity score across historical cases.",
          "Flagged top matches above 85% threshold.",
          "Extracted successful resolution steps."
        ];
      } else {
        evidence = [
          `General analysis compiled for query: "${query}"`,
          `System scanned 82,089 records for matching keywords.`
        ];
        network = [
          `Suspect connections are being verified by district command.`
        ];
        recs = [
          `Establish security perimeter at coordinates.`,
          `Run deep IMEI towers trace to map communication logs.`
        ];
        reason = "Keyword lookup search success.";
        chain = [
          `Parsed search terms from: "${query}"`,
          "Matched keywords against database index.",
          "Synthesized tactical recommendations."
        ];
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        isStructured: true,
        timestamp: responseTime,
        confidence: Math.floor(85 + Math.random() * 12),
        evidenceSummary: evidence,
        suspectNetwork: network,
        recommendedActions: recs,
        reason,
        reasoningChain: chain,
        showReasoning: false
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // Toggle Reasoning Chain for a specific message
  const toggleReasoning = (msgId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, showReasoning: !m.showReasoning };
      }
      return m;
    }));
  };

  // Voice Interaction Mock
  const handleVoiceToggle = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      setTimeout(() => {
        setIsVoiceActive(false);
        handleSendQuery("Who are the key suspects in this case?");
      }, 3000);
    }
  };

  return (
    <div className="animate-page-fade" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
      
      {/* Simulation Banner */}
      <SimulationBanner />

      {/* 3-Panel Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: '20px', alignItems: 'stretch', height: 'calc(100vh - 210px)' }}>
        
        {/* PANEL 1: Case Loader Panel */}
        <aside
          className="glass-card flex flex-col"
          style={{
            padding: '20px 16px',
            background: 'var(--cyber-surface)',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--cyber-border)', paddingBottom: '8px' }}>
            {lang === 'en' ? 'LOAD CASE CONTEXT' : 'ಪ್ರಕರಣದ ಸಂದರ್ಭ ಲೋಡ್ ಮಾಡಿ'}
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                FIR Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={e => setFirNumber(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--cyber-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  fontFamily: 'JetBrains Mono, monospace',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                Suspect Name
              </label>
              <input
                type="text"
                placeholder="Enter suspect..."
                value={suspectName}
                onChange={e => setSuspectName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--cyber-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--cyber-bg)',
                  border: '1px solid var(--cyber-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                {DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                Crime Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--cyber-bg)',
                  border: '1px solid var(--cyber-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => triggerLoadAndAnalyze()}
              className="cyber-btn cyber-btn-cyan w-full justify-center"
              style={{ padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}
            >
              <Zap size={14} /> Load Case & Analyze
            </button>
          </div>

          {/* Recent Cases */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px dashed var(--cyber-border)', paddingBottom: '6px' }}>
              RECENT CASES
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {RECENT_CASES.map(item => (
                <div
                  key={item.firNumber}
                  onClick={() => handleLoadRecent(item)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--cyber-border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  <div style={{ fontWeight: 800, color: 'var(--cyber-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>
                    • FIR #{item.firNumber}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px', paddingLeft: '8px' }}>
                    {item.category} · {item.district}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* PANEL 2: Chat Interface */}
        <main
          className="glass-card flex flex-col"
          style={{
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--cyber-border)',
              background: 'rgba(0, 240, 255, 0.02)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(0, 240, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyber-cyan)',
              }}
            >
              <Brain size={18} className="animate-pulse" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🤖 AI Investigator
                <span className="badge badge-cyan" style={{ fontSize: '8px', padding: '1px 5px' }}>v2.0 Active</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Case Context: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>FIR #{firNumber} · {selectedCategory} · {selectedDistrict}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              if (isUser) {
                return (
                  <div key={msg.id} className="chat-bubble-user animate-fadeInUp">
                    {msg.content}
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'right' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={msg.id} 
                  className="glass-card animate-fadeInUp flex flex-col"
                  style={{
                    maxWidth: '85%',
                    alignSelf: 'flex-start',
                    borderRadius: '14px 14px 14px 4px',
                    border: '1px solid var(--cyber-border)',
                    padding: '0',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Title Header */}
                  <div style={{ padding: '12px 16px', background: 'rgba(0, 240, 255, 0.05)', borderBottom: '1px solid var(--cyber-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--cyber-cyan)', letterSpacing: '0.08em' }}>
                      🤖 AI ANALYSIS — FIR #{firNumber}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{msg.timestamp}</span>
                  </div>

                  {/* Card Content Grid */}
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* 1. Evidence Summary */}
                    {msg.evidenceSummary && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Evidence Summary
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {msg.evidenceSummary.map((item, idx) => (
                            <li key={idx} style={{ listStyleType: 'disc' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 2. Suspect Network */}
                    {msg.suspectNetwork && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Suspect Network
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {msg.suspectNetwork.map((item, idx) => (
                            <li key={idx} style={{ listStyleType: 'disc' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. Recommended Actions */}
                    {msg.recommendedActions && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Recommended Actions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--cyber-cyan)', fontWeight: 600 }}>
                          {msg.recommendedActions.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                              <span>→</span> <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Score info */}
                    {msg.confidence !== undefined && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>AI Confidence Match:</span>
                          <span style={{ fontWeight: 800, color: 'var(--cyber-cyan)' }}>{msg.confidence}%</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${msg.confidence}%`, background: 'var(--cyber-cyan)' }} />
                        </div>
                        {msg.reason && (
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '2px' }}>
                            Reason: {msg.reason}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reasoning Chain Expand Button */}
                    {msg.reasoningChain && (
                      <div style={{ marginTop: '4px' }}>
                        <button
                          onClick={() => toggleReasoning(msg.id)}
                          className="cyber-btn"
                          style={{
                            padding: '4px 8px',
                            fontSize: '10px',
                            fontWeight: 800,
                            borderRadius: '4px',
                            background: 'rgba(0, 240, 255, 0.05)',
                            border: '1px solid rgba(0, 240, 255, 0.2)',
                            color: 'var(--cyber-cyan)',
                            textTransform: 'none',
                          }}
                        >
                          🔍 {msg.showReasoning ? 'Hide Reasoning Chain' : 'Show Reasoning Chain'}
                        </button>

                        {msg.showReasoning && (
                          <div
                            className="animate-fadeInUp"
                            style={{
                              marginTop: '10px',
                              padding: '10px 14px',
                              borderRadius: '6px',
                              background: 'rgba(0,0,0,0.2)',
                              border: '1px solid rgba(255,255,255,0.03)',
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          >
                            <div style={{ color: 'var(--text-muted)', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.04em' }}>
                              Reasoning Chain Logs:
                            </div>
                            {msg.reasoningChain.map((step, sIdx) => (
                              <div key={sIdx} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
                                <span style={{ color: 'var(--cyber-cyan)' }}>Step {sIdx + 1}:</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator animate-fadeInUp" style={{ alignSelf: 'flex-start' }}>
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts Row */}
          <div style={{ padding: '8px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
            {[
              "Who are the key suspects?",
              "What's the risk level?",
              "Similar past cases?",
              "Recommended next steps?"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendQuery(prompt)}
                className="badge font-bold"
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--cyber-border)',
                  color: 'var(--text-muted)',
                  borderRadius: '12px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyber-cyan)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cyber-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--cyber-border)',
              background: 'rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ask about this case..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendQuery(inputVal); }}
                style={{
                  width: '100%',
                  background: 'var(--cyber-bg)',
                  border: '1px solid var(--cyber-border)',
                  borderRadius: '24px',
                  padding: '10px 48px 10px 20px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              
              <button
                onClick={handleVoiceToggle}
                style={{
                  position: 'absolute',
                  right: '125px', // offset within flex container
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isVoiceActive ? '#ef4444' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isVoiceActive ? <MicOff size={16} className="animate-pulse" /> : <Mic size={16} className="hover:text-[var(--text-primary)]" />}
              </button>
            </div>

            <button
              onClick={() => handleSendQuery(inputVal)}
              className="cyber-btn cyber-btn-cyan"
              style={{ padding: '8px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}
            >
              Analyze <Send size={12} />
            </button>
          </div>
        </main>

        {/* PANEL 3: Case Summary Panel */}
        <aside
          className="glass-card flex flex-col justify-between"
          style={{
            padding: '20px 16px',
            background: 'var(--cyber-surface)',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {/* Summary stats */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--cyber-border)', paddingBottom: '8px' }}>
              CASE SUMMARY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Case Profile:</span>
                <div style={{ fontWeight: 800, color: 'var(--cyber-cyan)', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                  FIR #{firNumber}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, marginTop: '2px' }}>
                  ACTIVE <span className="status-dot-red" />
                </span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>District:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 650, marginTop: '1px' }}>
                  {selectedDistrict}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Category:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 650, marginTop: '1px' }}>
                  {selectedCategory}
                </div>
              </div>

              {/* Severity Score */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Severity Score:</span>
                  <span style={{ fontWeight: 800, color: '#ef4444' }}>{severityScore}/100</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${severityScore}%`, background: '#ef4444' }} />
                </div>
              </div>

              {/* AI Confidence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>AI Confidence:</span>
                  <span style={{ fontWeight: 800, color: 'var(--cyber-cyan)' }}>{aiConfidence}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${aiConfidence}%`, background: 'var(--cyber-cyan)' }} />
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Suspects:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 650, marginTop: '1px' }}>
                  {suspectCount} primary, {networkLinks} network links
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Officer:</span>
                <div style={{ color: 'var(--text-primary)', fontWeight: 650, marginTop: '1px' }}>
                  {officerName}
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', borderTop: '1px dashed var(--cyber-border)', paddingTop: '12px' }}>
              ACTIONS
            </div>
            
            <button
              onClick={() => alert(`Classification Report generated for FIR #${firNumber}`)}
              className="cyber-btn"
              style={{
                width: '100%', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)',
                padding: '8px 12px', textTransform: 'none', gap: '6px'
              }}
            >
              <FileText size={13} /> Export Report
            </button>

            <button
              onClick={() => alert(`Intel added to FIR #${firNumber} case file.`)}
              className="cyber-btn"
              style={{
                width: '100%', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)',
                padding: '8px 12px', textTransform: 'none', gap: '6px'
              }}
            >
              <Clipboard size={13} /> Add to Case
            </button>

            <button
              onClick={() => alert(`Secure Intel share link generated.`)}
              className="cyber-btn"
              style={{
                width: '100%', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)',
                padding: '8px 12px', textTransform: 'none', gap: '6px'
              }}
            >
              <Share2 size={13} /> Share Intel
            </button>

            <button
              onClick={() => alert(`Alert escalated to Special Cyber Cell / IG panels.`)}
              className="cyber-btn cyber-btn-red"
              style={{
                width: '100%', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                padding: '8px 12px', textTransform: 'none', gap: '6px'
              }}
            >
              <AlertTriangle size={13} /> Escalate Case
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
