'use client';

import { useState, useEffect } from 'react';
import {
  Search, Filter, Clock, MapPin, User, Activity,
  CheckCircle2, Calendar, Zap, AlertTriangle, X, ChevronRight,
  ShieldCheck, ArrowRight, Eye, UserCheck, ShieldAlert
} from 'lucide-react';
import { FIR_RECORDS, FIRRecord, CriminalProfile } from '@/lib/mockData';

export default function CaseSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Read URL search parameter on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('query');
      if (q) {
        setSearchTerm(q);
      }
    }
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedCase, setSelectedCase] = useState<FIRRecord | null>(null);

  // Filter logic
  const filteredCases = FIR_RECORDS.filter((item) => {
    // Search terms (FIR No, Suspect Name, Vehicle, Mobile, District, Category)
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.firNumber.toLowerCase().includes(term) ||
      item.id.toLowerCase().includes(term) ||
      item.suspectDetails.name.toLowerCase().includes(term) ||
      item.suspectDetails.vehiclesUsed.some(v => v.toLowerCase().includes(term)) ||
      item.suspectDetails.mobileNumbers.some(m => m.toLowerCase().includes(term)) ||
      item.district.toLowerCase().includes(term) ||
      item.crimeCategory.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'all' || item.crimeCategory === selectedCategory;
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesStatus = selectedStatus === 'all' || item.investigationStatus === selectedStatus;
    
    let matchesRisk = true;
    if (selectedRisk !== 'all') {
      matchesRisk = item.suspectDetails.riskLevel === selectedRisk;
    }

    return matchesSearch && matchesCategory && matchesDistrict && matchesStatus && matchesRisk;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <span className="badge badge-green">RESOLVED</span>;
      case 'arrested':
        return <span className="badge badge-cyan">ARRESTED</span>;
      case 'monitoring':
        return <span className="badge badge-purple">MONITORING</span>;
      default:
        return <span className="badge badge-amber">INVESTIGATING</span>;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return <span className="badge badge-red flex items-center gap-1"><ShieldAlert size={10} /> CRITICAL</span>;
      case 'High':
        return <span className="badge badge-orange">HIGH</span>;
      case 'Medium':
        return <span className="badge badge-amber">MEDIUM</span>;
      default:
        return <span className="badge badge-cyan">LOW</span>;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Cybercrime': return '#0F6B5C';
      case 'Narcotic Trafficking': return '#e879f9';
      case 'Theft & Burglary': return '#8b5cf6';
      case 'Sand Mining': return '#f97316';
      case 'Assault & Violence': return '#ef4444';
      case 'Organized Crime': return '#f59e0b';
      default: return '#cbd5e1';
    }
  };

  const allCategories = Array.from(new Set(FIR_RECORDS.map(r => r.crimeCategory)));
  const allDistricts = Array.from(new Set(FIR_RECORDS.map(r => r.district)));

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-14">
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(30, 58, 95,0.1)', border: '1px solid rgba(30, 58, 95,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: '13px'
          }}>
            <Search size={18} color="#0F6B5C" />
          </div>
          <div>
            <h1 className="page-title">Case Intelligence Search</h1>
            <p className="page-subtitle">Unified index of all Karnataka criminal profiles, evidence tracking and investigation timelines</p>
          </div>
        </div>
        <span className="badge badge-cyan">{filteredCases.length} Records Found</span>
      </div>

      {/* FILTER PANEL */}
      <div className="glass-card p-5 mb-6">
        <div className="flex flex-col gap-4">
          {/* Main search bar */}
          <div className="input-with-icon">
            <Search size={16} className="icon text-slate-500" />
            <input
              type="text"
              placeholder="Search by FIR No, Suspect, Vehicle, Mobile, District, Category..."
              className="cyber-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Detailed Dropdown Filters */}
          <div className="responsive-grid-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wide">Category</label>
              <select
                className="cyber-input py-2 text-xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wide">District</label>
              <select
                className="cyber-input py-2 text-xs"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="all">All Districts</option>
                {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wide">Status</label>
              <select
                className="cyber-input py-2 text-xs"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="investigating">Investigating</option>
                <option value="arrested">Arrested</option>
                <option value="resolved">Resolved</option>
                <option value="monitoring">Monitoring</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wide">Risk Level</label>
              <select
                className="cyber-input py-2 text-xs"
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
              >
                <option value="all">All Risk Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS LAYOUT */}
      <div className="responsive-grid-3-2">
        {/* LEFT: RESULTS LIST */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-[rgba(30, 58, 95,0.02)] flex justify-between items-center">
            <span className="text-xs font-bold tracking-widest text-[#0F6B5C] uppercase">Investigation Case Index</span>
            <span className="text-[10px] text-slate-500 font-mono">Showing {filteredCases.length} of {FIR_RECORDS.length}</span>
          </div>
          
          <div className="overflow-y-auto max-h-[64vh]">
            <table className="cyber-table w-full">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>FIR Number</th>
                  <th>District / Category</th>
                  <th>Suspect</th>
                  <th>Status</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      <AlertTriangle className="mx-auto mb-2 text-slate-600" size={24} />
                      No matching cases found in centralized police index
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedCase(c)}
                      className={`cursor-pointer transition-colors ${selectedCase?.id === c.id ? 'bg-[rgba(30, 58, 95,0.06)]' : 'hover:bg-white/5'}`}
                    >
                      <td className="font-mono text-[#0F6B5C] font-bold">{c.id}</td>
                      <td className="text-slate-300 font-bold">{c.firNumber}</td>
                      <td>
                        <div className="text-slate-200 font-semibold">{c.district}</div>
                        <div className="text-[10px] flex items-center gap-1.5 mt-0.5" style={{ color: getCategoryColor(c.crimeCategory) }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: getCategoryColor(c.crimeCategory) }} />
                          {c.crimeCategory}
                        </div>
                      </td>
                      <td>
                        <div className="text-slate-200 font-bold">{c.suspectDetails.name}</div>
                        <div className="text-[10px] text-slate-500">Age: {c.suspectDetails.age}</div>
                      </td>
                      <td>{getStatusBadge(c.investigationStatus)}</td>
                      <td>{getRiskBadge(c.suspectDetails.riskLevel)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: DETAIL VIEW PANEL */}
        <div>
          {selectedCase ? (
            <div className="glass-card flex flex-col gap-5">
              {/* HEADER SECTION */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-widest text-[#0F6B5C] font-black">{selectedCase.id}</span>
                    <span className="w-1 h-3 rounded bg-[#0F6B5C]" />
                    <span className="text-[10px] font-mono text-slate-500">{selectedCase.date}</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-100">{selectedCase.firNumber}</h2>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin size={11} className="text-slate-500" /> Assigned: {selectedCase.district} Command
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="p-1 text-slate-500 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* DETAILS GRID */}
              <div className="responsive-grid-2">
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Assigned Officer</div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <User size={12} color="#0F6B5C" /> {selectedCase.assignedOfficer}
                  </div>
                </div>
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Victim Details</div>
                  <div className="text-xs font-bold text-slate-200">
                    {selectedCase.victimDetails.name} <span className="text-[10px] text-slate-500">({selectedCase.victimDetails.gender}, {selectedCase.victimDetails.age})</span>
                  </div>
                </div>
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Evidence Collected</div>
                  <div className="text-xs font-bold text-[#0F6B5C] flex items-center gap-1.5">
                    <ShieldCheck size={12} /> {selectedCase.evidenceCount} Exhibits Flagged
                  </div>
                </div>
                <div className="bg-black/25 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Case Risk Assessment</div>
                  <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: selectedCase.riskScore > 80 ? '#ef4444' : '#f59e0b' }}>
                    <Zap size={12} /> {selectedCase.riskScore} / 100 AI Score
                  </div>
                </div>
              </div>

              {/* SUSPECT PROFILE */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                  <UserCheck size={13} color="#0F6B5C" />
                  <span className="text-xs font-bold tracking-widest uppercase text-slate-300">Criminal Intelligence Profile</span>
                  <span className="ml-auto">{getRiskBadge(selectedCase.suspectDetails.riskLevel)}</span>
                </div>

                <div className="flex gap-4 items-start mb-4">
                  {/* Photo Placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-[rgba(30, 58, 95,0.06)] border border-[rgba(30, 58, 95,0.2)] flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden">
                    <User size={32} color="#0F6B5C" style={{ opacity: 0.3 }} />
                    <div className="absolute bottom-0 inset-x-0 bg-[#0F6B5C]/20 text-[9px] font-bold text-[#0F6B5C] text-center py-0.5">
                      SUSPECT
                    </div>
                  </div>
                  {/* Bio */}
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-100">{selectedCase.suspectDetails.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {selectedCase.suspectDetails.gender} · Age {selectedCase.suspectDetails.age} · District: {selectedCase.suspectDetails.district}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Arrests YTD: <strong className="text-red-400">{selectedCase.suspectDetails.arrestCount} times</strong>
                    </div>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div>
                    <strong className="text-slate-500">Known Associates:</strong>{' '}
                    {selectedCase.suspectDetails.knownAssociates.map(a => (
                      <span key={a} className="badge badge-gray text-[10px] mr-1">{a}</span>
                    ))}
                  </div>
                  <div>
                    <strong className="text-slate-500">Linked Vehicles:</strong>{' '}
                    {selectedCase.suspectDetails.vehiclesUsed.map(v => (
                      <span key={v} className="badge badge-cyan text-[10px] mr-1">{v}</span>
                    ))}
                  </div>
                  <div>
                    <strong className="text-slate-500">Mobile Numbers:</strong>{' '}
                    {selectedCase.suspectDetails.mobileNumbers.map(m => (
                      <span key={m} className="badge badge-gray text-[10px] mr-1">{m}</span>
                    ))}
                  </div>
                  <div>
                    <strong className="text-slate-500">Bank Accounts:</strong>{' '}
                    {selectedCase.suspectDetails.bankAccounts.map(b => (
                      <span key={b} className="badge badge-green text-[10px] mr-1">{b}</span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-white/5 mt-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Recent Activity Track</div>
                    <p className="text-slate-400 leading-snug italic">"{selectedCase.suspectDetails.recentActivity}"</p>
                  </div>
                </div>
              </div>

              {/* TIMELINE */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                  <Clock size={13} color="#0F6B5C" />
                  <span className="text-xs font-bold tracking-widest uppercase text-slate-300">Investigation Timeline</span>
                </div>

                <div className="relative pl-6 border-l border-white/10 space-y-4">
                  {selectedCase.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Node circle */}
                      <span className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-green-500 shadow-[0_0_8px_#10b981] flex items-center justify-center">
                        <CheckCircle2 size={10} color="#fff" />
                      </span>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{step.status}</span>
                          <span className="text-[10px] font-mono text-slate-500">{step.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{step.notes}</p>
                        <div className="text-[9px] text-slate-600 mt-0.5">Logged by: {step.officerName}</div>
                      </div>
                    </div>
                  ))}
                  {/* Next Step / Future steps (Grayed out) */}
                  {selectedCase.investigationStatus === 'investigating' && (
                    <div className="relative opacity-35">
                      <span className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-slate-800" />
                      <div>
                        <span className="text-xs font-bold text-slate-500">Bank Analysis (Pending)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card flex flex-col items-center justify-center text-center py-24 text-slate-500">
              <Search size={36} className="text-slate-700 mb-3" />
              <div className="text-sm font-bold">No Case Selected</div>
              <p className="text-xs text-slate-600 mt-1 max-w-[240px]">Select any investigation row on the left panel to review its timeline and suspect intelligence profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
