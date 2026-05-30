'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, RefreshCw, Sparkles, User, Brain,
  ChevronRight, ArrowRight, ShieldCheck, MapPin, Gauge
} from 'lucide-react';
import { AI_SUGGESTED_QUERIES, AI_CANNED_RESPONSES } from '@/lib/mockData';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  type?: string;
  data?: { label: string; value: string; color?: string }[];
  districts?: string[];
  confidence?: number;
}

export default function InvestigatorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Welcome to CrimeNet AI. I have analyzed 82,089 crime records across 31 Karnataka districts. How can I assist your investigation?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([
    "Show crime patterns in Bengaluru Urban",
    "Find repeat offenders in Kalaburagi",
    "Summarize Raichur district threats"
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text: textToSend, timestamp };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Save to query history if not already there
    setHistory(prev => {
      const filtered = prev.filter(q => q !== textToSend);
      return [textToSend, ...filtered].slice(0, 5);
    });

    // Simulate AI response after 1.5s
    setTimeout(() => {
      setIsTyping(false);
      
      // Match response or fallback to default
      const canned = AI_CANNED_RESPONSES[textToSend] || AI_CANNED_RESPONSES['default'];
      
      const aiMsg: Message = {
        sender: 'ai',
        text: canned.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: canned.type,
        data: canned.data,
        districts: canned.districts,
        confidence: canned.confidence,
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div style={{ padding: '28px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(0, 240, 255, 0.12)', border: '1px solid rgba(0, 240, 255, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageSquare size={22} color="#00f0ff" />
          </div>
          <div>
            <h1 className="page-title">AI Investigation Assistant</h1>
            <p className="page-subtitle">CrimeNet AI Copilot — Natural Language Querying on Karnataka Crime DB</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={16} color="#10b981" />
          <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>CrimeNet-GPT v4.2 ACTIVE</span>
        </div>
      </div>

      {/* TWO COLUMN CHAT LAYOUT */}
      <div className="responsive-chat-layout" style={{ flex: 1, alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: SUGGESTIONS & STATUS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Status info card */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <ShieldCheck size={14} color="#10b981" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                System Status
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'AI Core Engine', value: 'ACTIVE', color: '#10b981' },
                { label: 'Primary Model', value: 'CrimeNet-GPT4', color: '#00f0ff' },
                { label: 'Records Indexed', value: '82,089 FIRs', color: '#cbd5e1' },
                { label: 'Prediction Accuracy', value: '91.2%', color: '#10b981' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Queries */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Sparkles size={14} color="#00f0ff" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Suggested Enquiries
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: '280px' }}>
              {AI_SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '10px 12px', textAlign: 'left',
                    color: '#cbd5e1', fontSize: 12, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.18)';
                    e.currentTarget.style.color = '#00f0ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  <span style={{ lineHeight: 1.4 }}>{q}</span>
                  <ChevronRight size={12} style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <RefreshCw size={12} color="#8b5cf6" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Query History
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => handleSend(h)}
                  style={{
                    fontSize: 11, color: '#64748b', cursor: 'pointer',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    padding: '2px 4px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#00f0ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
                >
                  ⏳ {h}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: CHAT INTERFACE */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '580px' }}>
          
          {/* Header info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 16
          }}>
            <div className="status-dot" style={{ background: '#10b981' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#f1f5f9' }}>CrimeNet AI Assistant</div>
              <div style={{ fontSize: 10, color: '#64748b' }}>Connected to KSP-DB-CLUSTERS</div>
            </div>
          </div>

          {/* Messages Scroller */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 6, marginBottom: 16 }}>
            {messages.map((msg, idx) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isAI ? 'flex-start' : 'flex-end',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAI ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                      {isAI ? 'CrimeNet AI' : 'Investigator'}
                    </span>
                    <span style={{ fontSize: 9, color: '#475569' }}>{msg.timestamp}</span>
                  </div>
                  
                  {/* Bubble body */}
                  <div
                    className={isAI ? 'chat-bubble-ai' : 'chat-bubble-user'}
                    style={{
                      background: isAI ? 'rgba(10,22,40,0.92)' : 'rgba(0,240,255,0.12)',
                      border: isAI ? '1px solid rgba(0,240,255,0.1)' : '1px solid rgba(0,240,255,0.3)',
                    }}
                  >
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: '#cbd5e1' }}>{msg.text}</p>
                    
                    {/* Render AI Confidence if present */}
                    {isAI && msg.confidence && (
                      <div style={{
                        marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.04)',
                        display: 'flex', alignItems: 'center', gap: 10
                      }}>
                        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>CONFIDENCE:</span>
                        <div className="confidence-track" style={{ width: 80, height: 4 }}>
                          <div className="confidence-fill" style={{ width: `${msg.confidence}%`, height: '100%', background: '#00f0ff' }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#00f0ff' }}>{msg.confidence}%</span>
                      </div>
                    )}

                    {/* Render District Badges if present */}
                    {isAI && msg.districts && msg.districts.length > 0 && (
                      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {msg.districts.map(d => (
                          <span key={d} className="badge badge-purple" style={{ fontSize: 10, padding: '2px 8px' }}>
                            <MapPin size={9} style={{ display: 'inline', marginRight: 3 }} /> {d}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Render Data Table if present */}
                    {isAI && msg.data && (
                      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {msg.data.map((row, rIdx) => (
                          <div key={rIdx} style={{
                            background: 'rgba(0,0,0,0.25)', borderRadius: 6,
                            padding: '8px 10px', display: 'flex', justifyContent: 'space-between',
                            border: '1px solid rgba(255,255,255,0.03)'
                          }}>
                            <span style={{ fontSize: 12, color: '#cbd5e1' }}>{row.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: row.color || '#00f0ff' }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>CrimeNet AI is thinking...</span>
                <div className="chat-bubble-ai" style={{ padding: '12px 18px', background: 'rgba(10,22,40,0.92)' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <div className="typing-dot" style={{ animationDelay: '0s' }} />
                    <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
            style={{
              display: 'flex', gap: 10, padding: '10px 4px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crime patterns, suspects, districts..."
              className="cyber-input"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                fontSize: 13, outline: 'none',
              }}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="cyber-btn cyber-btn-cyan"
              style={{ padding: '0 20px', borderRadius: 10 }}
              disabled={isTyping || !input.trim()}
            >
              <Send size={15} />
              <span>SEND</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
