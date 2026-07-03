'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/ai-investigator/page.tsx — AI Investigator Module (KSP Light Theme)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Brain, Send, Mic, MicOff, Search, FileText, Plus, ShieldAlert, Sparkles, User, MapPin, 
  Clock, CheckCircle, RefreshCw, ChevronRight, AlertTriangle, HelpCircle, Eye, Clipboard, Share2, Shield, Zap, X
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import { DISTRICTS, RECENT_FIRS } from '@/lib/crimeData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
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

const CATEGORIES = ["Sand Mining", "Cyber Fraud", "Vehicle Theft", "Narcotics", "Organized Crime"];

const RECENT_CASES = [
  { firNumber: "FIR/2026/BLR/101", suspectName: "Raju Naik", district: "Kalaburagi", category: "Sand Mining", date: "21 Jun 2026", severity: 91, officer: "PI Ravi Shankar" },
  { firNumber: "FIR/2026/BLR/102", suspectName: "Arjun Gowda", district: "Bengaluru Urban", category: "Cyber Fraud", date: "20 Jun 2026", severity: 74, officer: "Insp Anil K" },
  { firNumber: "FIR/2026/MYS/201", suspectName: "Kiran Kumar", district: "Mysuru", category: "Vehicle Theft", date: "19 Jun 2026", severity: 42, officer: "PI Mahesh Kumar" },
];

export default function AIInvestigatorPage() {
  const { t, lang } = useLanguage();

  // Case Loader Form States
  const [firNumber, setFirNumber] = useState("FIR/2026/BLR/101");
  const [suspectName, setSuspectName] = useState("Raju Naik");
  const [selectedDistrict, setSelectedDistrict] = useState("Kalaburagi");
  const [selectedCategory, setSelectedCategory] = useState("Sand Mining");

  // Summary Metrics (Right Panel)
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
  const [isExporting, setIsExporting] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initial Load Analyser Card
  const triggerLoadAndAnalyze = useCallback((customFir?: string, customSuspect?: string, customDist?: string, customCat?: string) => {
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
        reason: "Matched against historical crime databases + local association graphs.",
        evidenceSummary: [
          `4 core items resolved for case: FIR #${fNum}`,
          `Soil samples texture matches Kalaburagi riverbed soil characteristics.`,
          `LPR logs verify suspect truck present on NH-50 corridor at 12:10 PM.`
        ],
        suspectNetwork: [
          `Primary Accused: ${sName || 'Unknown'}`,
          `Direct network connections identified: ${matched ? 4 : 3} active links.`,
          `Linked to ${dist} organized syndicates.`
        ],
        recommendedActions: [
          `Issue immediate Lookout notice for Accused ${sName || 'Raju Naik'}.`,
          `Deploy border checkpoint patrol squads at district exits.`,
          `Coordinate checkpost security with regional transport divisions.`
        ],
        reasoningChain: [
          `Loaded FIR #${fNum} case evidence metadata.`,
          `Cross-referenced files with 18-month historical crime database.`,
          `Identified 87% pattern similarity with regional signatures.`,
          `Graph traversal completed — found ${matched ? 4 : 3} direct command and supply links.`,
          `Generated final decision-support recommendations.`
        ],
        showReasoning: false,
      };

      setMessages([welcome]);
      setIsTyping(false);
    }, 1000);
  }, [firNumber, suspectName, selectedDistrict, selectedCategory]);

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
      
      const lower = query.toLowerCase();
      let evidence = ["No transaction flags resolved yet."];
      let network = ["Evaluating direct links..."];
      let recs = ["Awaiting data log updates."];
      let reason = "Context based search match.";
      let chain = ["Indexed database entries.", "Parsed text search queries."];

      if (lower.includes('suspect') || lower.includes('who')) {
        evidence = [
          `Accused is linked to prior FIRs in ${selectedDistrict}.`,
          `Active communication records show 14 calls to associate Venkat Reddy.`
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
        reason = "Command graph node hierarchy matches standard organization structure.";
        chain = [
          "Indexed nodes linked to suspect ID S001.",
          "Filtered links where relationship type is ASSOCIATE.",
          "Compiled associate profiles and risk statistics."
        ];
      } else if (lower.includes('risk') || lower.includes('level') || lower.includes('severity')) {
        evidence = [
          `Regional crime trend shows +14% YoY increase in ${selectedCategory}.`,
          `Case severity evaluated based on financial damage + geographical impact.`
        ];
        network = [
          `Associated with ${selectedDistrict} active syndicates.`,
        ];
        recs = [
          `Initiate district-wide alert parameters.`,
          `Monitor transit routes in high-risk zones.`
        ];
        reason = "Risk score derived from historical regional threat index.";
        chain = [
          "Calculated regional density of crime category.",
          "Assessed suspect threat score based on prior filings count.",
          "Resolved threat level score: High."
        ];
      } else {
        evidence = [
          `Additional records for FIR #${firNumber} compiled.`,
          `LPR logs scanned. No matching alerts found in active cache.`
        ];
        network = [
          `No secondary network links found for current query.`
        ];
        recs = [
          `Continue normal case profiling protocols.`,
          `Await updates from field officers.`
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

  // Toggle Reasoning Chain
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

  // Export PDF findings
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageW = 210;
      let y = 20;

      // Header branding
      doc.setFontSize(14);
      doc.setTextColor(166, 25, 46); // KSP Red
      doc.setFont('helvetica', 'bold');
      doc.text('RESTRICTED — FOR KSP OFFICIAL USE ONLY', pageW / 2, y, { align: 'center' });
      y += 8;

      doc.setFontSize(16);
      doc.setTextColor(30, 58, 95); // Navy
      doc.text('AI-ASSISTED INVESTIGATION DOSSIER', pageW / 2, y, { align: 'center' });
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`FIR File: #${firNumber} | District: ${selectedDistrict} | Category: ${selectedCategory}`, pageW / 2, y, { align: 'center' });
      y += 4;
      doc.line(15, y, pageW - 15, y);
      y += 10;

      // Summary Info
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 95);
      doc.text('1. Case intelligence overview', 15, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      doc.text(`Assigned Officer: ${officerName}`, 20, y);
      y += 5;
      doc.text(`Estimated Case Severity: ${severityScore}/100`, 20, y);
      y += 5;
      doc.text(`Primary Suspect: ${suspectName || 'Raju Naik'}`, 20, y);
      y += 5;
      doc.text(`Decision Support Confidence: ${aiConfidence}%`, 20, y);
      y += 10;

      // AI Findings
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 95);
      doc.text('2. AI-assisted Risk & evidence summary', 15, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 70, 70);

      // Print first assistant message structure
      const welcomeMsg = messages.find(m => m.id === 'welcome');
      if (welcomeMsg) {
        if (welcomeMsg.evidenceSummary) {
          doc.text('Evidence matches:', 20, y);
          y += 5;
          welcomeMsg.evidenceSummary.forEach((ev) => {
            doc.text(`- ${ev}`, 25, y);
            y += 5;
          });
        }
        y += 4;
        if (welcomeMsg.suspectNetwork) {
          doc.text('Suspect associations:', 20, y);
          y += 5;
          welcomeMsg.suspectNetwork.forEach((s) => {
            doc.text(`- ${s}`, 25, y);
            y += 5;
          });
        }
        y += 4;
        if (welcomeMsg.recommendedActions) {
          doc.text('Recommended decision support actions:', 20, y);
          y += 5;
          welcomeMsg.recommendedActions.forEach((a) => {
            doc.text(`- ${a}`, 25, y);
            y += 5;
          });
        }
      } else {
        doc.text('No interactive messages logged in active session cache.', 20, y);
        y += 5;
      }

      y += 10;
      doc.line(15, y, pageW - 15, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('This is a decision-support document generated from synthetic data for demonstration purposes.', pageW / 2, y, { align: 'center' });

      doc.save(`KSP_AI_Investigator_${firNumber}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Could not export PDF report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page-content" style={{ background: '#F5F7FA', padding: '24px 32px' }}>
      
      {/* Simulation Banner */}
      <SimulationBanner />

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#475569' }}>
        <span>Home</span>
        <span>/</span>
        <span>Investigation</span>
        <span>/</span>
        <span style={{ color: '#1F2937', fontWeight: 600 }}>AI Investigation Assistant</span>
      </div>

      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(30, 58, 95, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={22} style={{ color: '#1E3A5F' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              AI Investigation Assistant
            </h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              AI-assisted decision support system for case cross-referencing and network evaluation.
            </p>
          </div>
        </div>
        
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8,
          background: 'rgba(15, 107, 92, 0.08)',
          border: '1px solid rgba(15, 107, 92, 0.15)',
          fontSize: 11, fontWeight: 700, color: '#0F6B5C',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          <Shield size={14} />
          Secure Intel
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr 290px', gap: '20px', alignItems: 'stretch', height: 'calc(100vh - 240px)' }}>
        
        {/* PANEL 1: Case Loader Panel */}
        <aside
          className="glass-card"
          style={{
            padding: '20px 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
            {lang === 'en' ? 'LOAD CASE CONTEXT' : 'ಪ್ರಕರಣದ ಸಂದರ್ಭ ಲೋಡ್ ಮಾಡಿ'}
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                FIR Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={e => setFirNumber(e.target.value)}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1F2937',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                Suspect Name
              </label>
              <input
                type="text"
                placeholder="Enter suspect name..."
                value={suspectName}
                onChange={e => setSuspectName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1F2937',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1F2937',
                  outline: 'none',
                }}
              >
                {DISTRICTS.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                Crime Category
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  color: '#1F2937',
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
              style={{
                width: '100%', padding: '10px', background: '#1E3A5F', color: '#FFFFFF',
                border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <Zap size={14} /> Load Case &amp; Analyze
            </button>
          </div>

          {/* Recent Cases */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
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
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#475569',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#1E3A5F' }}>
                    • FIR #{item.firNumber}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '2px', paddingLeft: '8px' }}>
                    {item.category} · {item.district}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* PANEL 2: Chat Interface */}
        <main
          className="glass-card"
          style={{
            height: '100%',
            overflow: 'hidden',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid #E5E7EB',
              background: '#F9FAFB',
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
                background: 'rgba(30, 58, 95, 0.08)',
                border: '1px solid rgba(30, 58, 95, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E3A5F',
              }}
            >
              <Brain size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🤖 AI Intelligence Engine
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: 20, background: '#D1FAE5', color: '#065F46', fontWeight: 700 }}>Active</span>
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                Case Context: <span style={{ color: '#1F2937', fontWeight: 600 }}>FIR #{firNumber} · {selectedCategory} · {selectedDistrict}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              if (isUser) {
                return (
                  <div key={msg.id} style={{
                    alignSelf: 'flex-end', background: '#1E3A5F', color: '#FFFFFF',
                    padding: '10px 16px', borderRadius: '14px 14px 4px 14px', maxWidth: '75%', fontSize: 13
                  }}>
                    {msg.content}
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginTop: '4px', textAlign: 'right' }}>
                      {msg.timestamp}
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={msg.id} 
                  style={{
                    maxWidth: '85%',
                    alignSelf: 'flex-start',
                    borderRadius: '14px 14px 14px 4px',
                    border: '1px solid #E5E7EB',
                    background: '#F9FAFB',
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Card Title Header */}
                  <div style={{ padding: '12px 16px', background: '#F3F4F6', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#1E3A5F', letterSpacing: '0.08em' }}>
                      🤖 AI RISK ASSESSMENT &amp; GRAPH CONTEXT
                    </span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>{msg.timestamp}</span>
                  </div>

                  {/* Card Content Grid */}
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    {/* 1. Evidence Summary */}
                    {msg.evidenceSummary && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Evidence Summary
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {msg.evidenceSummary.map((item, idx) => (
                            <li key={idx} style={{ listStyleType: 'disc' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 2. Suspect Network */}
                    {msg.suspectNetwork && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Suspect Network Profile
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {msg.suspectNetwork.map((item, idx) => (
                            <li key={idx} style={{ listStyleType: 'disc' }}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. Recommended Actions */}
                    {msg.recommendedActions && (
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                          Recommended Decision Actions
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#0F6B5C', fontWeight: 700 }}>
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
                      <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                          <span style={{ color: '#475569' }}>AI Confidence Match Score:</span>
                          <span style={{ fontWeight: 800, color: '#1E3A5F' }}>{msg.confidence}%</span>
                        </div>
                        <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${msg.confidence}%`, background: '#1E3A5F' }} />
                        </div>
                        {msg.reason && (
                          <div style={{ fontSize: '10px', color: '#6B7280', fontStyle: 'italic', marginTop: '2px' }}>
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
                          style={{
                            padding: '4px 10px', fontSize: '10px', fontWeight: 800, borderRadius: '4px',
                            background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#1E3A5F', cursor: 'pointer'
                          }}
                        >
                          🔍 {msg.showReasoning ? 'Hide Rationale Chain' : 'Explainable AI Rationale'}
                        </button>

                        {msg.showReasoning && (
                          <div style={{
                            marginTop: '10px', padding: '10px 14px', borderRadius: '6px',
                            background: '#F3F4F6', border: '1px solid #E5E7EB', fontSize: '11px',
                            color: '#475569', fontFamily: 'monospace'
                          }}>
                            <div style={{ color: '#1E3A5F', fontWeight: 800, marginBottom: '6px', textTransform: 'uppercase', fontSize: '10px' }}>
                              Decision Rationale Logs:
                            </div>
                            {msg.reasoningChain.map((step, sIdx) => (
                              <div key={sIdx} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
                                <span style={{ color: '#0F6B5C', fontWeight: 700 }}>Step {sIdx + 1}:</span>
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

            {isTyping && (
              <div style={{ display: 'flex', gap: 4, alignSelf: 'flex-start', padding: 12, background: '#F3F4F6', borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E3A5F', animation: 'pulse 1s infinite' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E3A5F', animation: 'pulse 1s infinite 0.2s' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1E3A5F', animation: 'pulse 1s infinite 0.4s' }} />
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Prompts Row */}
          <div style={{ padding: '8px 20px', display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            {[
              "Who are the key suspects?",
              "What is the estimated risk score?",
              "Recommended decision-support steps?"
            ].map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSendQuery(prompt)}
                style={{
                  fontSize: '11px', padding: '4px 10px', cursor: 'pointer', background: '#FFFFFF',
                  border: '1px solid #D1D5DB', color: '#475569', borderRadius: '12px', transition: 'all 0.2s'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Ask about this case..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendQuery(inputVal); }}
                style={{
                  width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '24px',
                  padding: '10px 48px 10px 20px', fontSize: '13px', color: '#1F2937', outline: 'none'
                }}
              />
              
              <button
                onClick={handleVoiceToggle}
                style={{
                  position: 'absolute', right: '16px', background: 'none', border: 'none',
                  cursor: 'pointer', color: isVoiceActive ? '#ef4444' : '#6B7280', display: 'flex', alignItems: 'center'
                }}
              >
                {isVoiceActive ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <button
              onClick={() => handleSendQuery(inputVal)}
              style={{
                padding: '10px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 800,
                background: '#1E3A5F', color: '#FFFFFF', border: 'none', cursor: 'pointer'
              }}
            >
              Analyze
            </button>
          </div>
        </main>

        {/* PANEL 3: Case Summary Panel */}
        <aside
          className="glass-card"
          style={{
            padding: '20px 16px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Summary stats */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
              CASE SUMMARY
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: '#475569' }}>
              <div>
                <span style={{ color: '#6B7280' }}>Case Profile:</span>
                <div style={{ fontWeight: 800, color: '#1E3A5F', fontSize: '13px', fontFamily: 'monospace', marginTop: '2px' }}>
                  FIR #{firNumber}
                </div>
              </div>

              <div>
                <span style={{ color: '#6B7280' }}>Status:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, marginTop: '2px' }}>
                  ACTIVE
                </span>
              </div>

              <div>
                <span style={{ color: '#6B7280' }}>District:</span>
                <div style={{ color: '#1F2937', fontWeight: 600, marginTop: '1px' }}>
                  {selectedDistrict}
                </div>
              </div>

              <div>
                <span style={{ color: '#6B7280' }}>Category:</span>
                <div style={{ color: '#1F2937', fontWeight: 600, marginTop: '1px' }}>
                  {selectedCategory}
                </div>
              </div>

              {/* Severity Score */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#6B7280' }}>Severity Score:</span>
                  <span style={{ fontWeight: 800, color: '#ef4444' }}>{severityScore}/100</span>
                </div>
                <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${severityScore}%`, background: '#ef4444' }} />
                </div>
              </div>

              {/* AI Confidence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#6B7280' }}>AI Confidence:</span>
                  <span style={{ fontWeight: 800, color: '#1E3A5F' }}>{aiConfidence}%</span>
                </div>
                <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${aiConfidence}%`, background: '#1E3A5F' }} />
                </div>
              </div>

              <div>
                <span style={{ color: '#6B7280' }}>Suspects:</span>
                <div style={{ color: '#1F2937', fontWeight: 600, marginTop: '1px' }}>
                  {suspectCount} primary, {networkLinks} network links
                </div>
              </div>

              <div>
                <span style={{ color: '#6B7280' }}>Assigned Officer:</span>
                <div style={{ color: '#1F2937', fontWeight: 600, marginTop: '1px' }}>
                  {officerName}
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px', borderTop: '1px dashed #E5E7EB', paddingTop: '12px' }}>
              ACTIONS
            </div>
            
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#1E3A5F',
                padding: '8px 12px', gap: '6px', cursor: 'pointer'
              }}
            >
              <FileText size={13} /> {isExporting ? 'Exporting...' : 'Export PDF findings'}
            </button>

            <button
              onClick={() => alert(`Intel added to FIR #${firNumber} case file.`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#1F2937',
                padding: '8px 12px', gap: '6px', cursor: 'pointer'
              }}
            >
              <Clipboard size={13} /> Add to Case
            </button>

            <button
              onClick={() => alert(`Secure Intel share link generated.`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#1F2937',
                padding: '8px 12px', gap: '6px', cursor: 'pointer'
              }}
            >
              <Share2 size={13} /> Share Intel
            </button>

            <button
              onClick={() => alert(`Alert escalated to Special Cyber Cell / IG panels.`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, borderRadius: '6px',
                background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B',
                padding: '8px 12px', gap: '6px', cursor: 'pointer'
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
