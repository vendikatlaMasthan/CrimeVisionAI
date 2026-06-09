'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck, Calendar, MapPin, User, ShieldAlert,
  ArrowLeft, CheckCircle2, Clock, Eye, AlertTriangle,
  FileText, Briefcase, Zap, Shield, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import { FIR_RECORDS, FIRRecord } from '@/lib/mockData';

export default function FIRDetailsPage() {
  const [selectedFir, setSelectedFir] = useState<FIRRecord | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = new URLSearchParams(window.location.search).get('id');
      const record = FIR_RECORDS.find(f => f.id === id) || FIR_RECORDS[0] || null;
      setSelectedFir(record);
    }
  }, []);

  if (!selectedFir) {
    return (
      <div className="page-content flex items-center justify-center min-h-[80vh]">
        <div className="glass-card p-8 text-center max-w-md">
          <AlertTriangle size={36} className="text-[#ef4444] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">FIR Record Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The requested FIR identifier does not match any records in the centralized police database.</p>
          <Link href="/" className="cyber-btn cyber-btn-cyan text-xs py-2 px-4 justify-center">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate timeline stepper steps based on status
  // 1: FIR Filed, 2: Investigation Started, 3: Evidence Collected, 4: Suspect Identified, 5: Arrest Made, 6: Charges Filed, 7: Case Closed
  const getStepStatus = (stepIndex: number) => {
    const status = selectedFir.investigationStatus;
    
    // Steps 1, 2, 3 are always completed
    if (stepIndex <= 3) return 'completed';
    
    if (status === 'monitoring') {
      if (stepIndex === 4) return 'completed';
      if (stepIndex === 5) return 'active';
      return 'pending';
    }
    
    if (status === 'arrested') {
      if (stepIndex <= 5) return 'completed';
      if (stepIndex === 6) return 'active';
      return 'pending';
    }
    
    if (status === 'resolved') {
      return 'completed';
    }
    
    // Status is 'investigating'
    if (stepIndex === 4) return 'active';
    return 'pending';
  };

  const steps = [
    { label: 'FIR Filed', desc: 'Official case registration logged in central police registry.' },
    { label: 'Investigation Started', desc: 'Case assigned to officer. Preliminary site inquiry initiated.' },
    { label: 'Evidence Collected', desc: `${selectedFir.evidenceCount} forensic exhibits recovered and logged.` },
    { label: 'Suspect Identified', desc: `AI suspect risk score assessed at ${selectedFir.suspectDetails.profileScore}% confidence.` },
    { label: 'Arrest Made', desc: `Suspect apprehended and taken into custody for questioning.` },
    { label: 'Charges Filed', desc: 'Official charge sheet prepared and filed before court.' },
    { label: 'Case Closed', desc: 'Legal hearings finalized. Case marked closed in database.' }
  ];

  return (
    <div className="page-content" style={{ padding: '28px' }}>
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-slate-900 border border-white/5 text-slate-400 hover:text-white rounded-lg hover:border-[#00f0ff]/30 transition-all">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-[#00f0ff] font-black">{selectedFir.id}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{selectedFir.date}</span>
            </div>
            <h1 className="page-title">{selectedFir.firNumber}</h1>
          </div>
        </div>

        {/* State Badges */}
        <div className="flex items-center gap-3">
          <div className={`badge ${
            selectedFir.investigationStatus === 'resolved' ? 'badge-green' :
            selectedFir.investigationStatus === 'arrested' ? 'badge-cyan' :
            selectedFir.investigationStatus === 'monitoring' ? 'badge-purple' : 'badge-amber'
          } uppercase tracking-wider text-xs px-3 py-1 font-bold`}>
            {selectedFir.investigationStatus}
          </div>
          <div className="badge badge-red font-mono font-black text-xs py-1">
            Risk: {selectedFir.riskScore}/100
          </div>
        </div>
      </div>

      {/* CORE DETAILS GRID */}
      <div className="responsive-grid-3-2">
        
        {/* LEFT COLUMN: INFORMATION SHEET */}
        <div className="space-y-6">
          
          {/* CASE OVERVIEW */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              <Briefcase size={14} color="#00f0ff" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">Incident Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wide text-[10px]">Crime Category</span>
                <span className="text-slate-200 font-bold block mt-1">{selectedFir.crimeCategory}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wide text-[10px]">District Jurisdiction</span>
                <span className="text-slate-200 font-bold block mt-1">{selectedFir.district} Command</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wide text-[10px]">Assigned Officer</span>
                <span className="text-slate-200 font-bold block mt-1">{selectedFir.assignedOfficer}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold tracking-wide text-[10px]">Registered Date</span>
                <span className="text-slate-200 font-bold block mt-1">{selectedFir.date}</span>
              </div>
            </div>
          </div>

          {/* VICTIM DETAILS */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              <User size={14} color="#10b981" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">Victim Dossier</span>
            </div>
            
            <div className="flex gap-4 items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center text-lg">
                👤
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">{selectedFir.victimDetails.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Gender: {selectedFir.victimDetails.gender} · Age: {selectedFir.victimDetails.age}
                </div>
              </div>
            </div>

            <div className="bg-black/25 rounded-lg p-2.5 border border-white/5 text-[11px] text-slate-400">
              <strong className="text-slate-500 uppercase tracking-wider text-[9px] block mb-0.5">Legal Status</strong>
              Victim is marked as <span className="text-[#10b981] font-bold">"{selectedFir.victimDetails.status}"</span> under central witness protection directives.
            </div>
          </div>

          {/* SUSPECT PROFILE */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              <ShieldAlert size={14} color="#ef4444" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">Accused Suspect Profile</span>
              <span className={`ml-auto badge ${selectedFir.suspectDetails.riskLevel === 'Critical' ? 'badge-red' : 'badge-amber'} text-[9px]`}>
                {selectedFir.suspectDetails.riskLevel} RISK
              </span>
            </div>

            <div className="flex gap-4 items-start mb-4">
              <div className="w-14 h-14 bg-red-950/20 border border-red-500/20 rounded-xl flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden">
                <span className="text-2xl opacity-60">👤</span>
                <div className="absolute bottom-0 inset-x-0 bg-red-500/20 text-[9px] font-black text-red-400 text-center py-0.5 uppercase">
                  Accused
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100">{selectedFir.suspectDetails.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedFir.suspectDetails.gender} · Age {selectedFir.suspectDetails.age} · District: {selectedFir.suspectDetails.district}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Prior offenses: <strong className="text-red-400">{selectedFir.suspectDetails.arrestCount} arrests</strong>
                </p>
              </div>
            </div>

            {/* Suspect Asset Dossier */}
            <div className="space-y-3 text-xs border-t border-white/5 pt-3">
              <div>
                <strong className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1">Known Associates:</strong>
                <div className="flex flex-wrap gap-1">
                  {selectedFir.suspectDetails.knownAssociates.map(a => (
                    <span key={a} className="badge badge-gray text-[9px]">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1">Mobiles Used:</strong>
                <div className="flex flex-wrap gap-1">
                  {selectedFir.suspectDetails.mobileNumbers.map(m => (
                    <span key={m} className="badge badge-cyan text-[9px]">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1">Vehicles Flagged:</strong>
                <div className="flex flex-wrap gap-1">
                  {selectedFir.suspectDetails.vehiclesUsed.map(v => (
                    <span key={v} className="badge badge-purple text-[9px]">{v}</span>
                  ))}
                </div>
              </div>
              <div>
                <strong className="text-slate-500 uppercase tracking-wider text-[9px] block mb-1">Bank Accounts:</strong>
                <div className="flex flex-wrap gap-1">
                  {selectedFir.suspectDetails.bankAccounts.map(b => (
                    <span key={b} className="badge badge-green text-[9px]">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INVESTIGATION TRACKER */}
        <div className="space-y-6">
          
          {/* STEPPER PROGRESS */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
              <Clock size={14} color="#00f0ff" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">Investigation Progress Stepper</span>
            </div>

            <div className="relative pl-8 border-l-2 border-white/5 space-y-6 ml-3">
              {steps.map((step, idx) => {
                const stepIndex = idx + 1;
                const status = getStepStatus(stepIndex);
                
                return (
                  <div key={idx} className="relative">
                    
                    {/* Stepper Node Indicator */}
                    {status === 'completed' && (
                      <span className="absolute -left-[43px] top-0 w-6 h-6 rounded-full border-2 border-[#020617] bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)] flex items-center justify-center z-10">
                        <CheckCircle2 size={12} color="#fff" />
                      </span>
                    )}

                    {status === 'active' && (
                      <span className="absolute -left-[43px] top-0 w-6 h-6 rounded-full border-2 border-[#020617] bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center z-10 animate-pulse">
                        <Clock size={12} color="#fff" />
                      </span>
                    )}

                    {status === 'pending' && (
                      <span className="absolute -left-[43px] top-0 w-6 h-6 rounded-full border-2 border-[#020617] bg-slate-900 border-white/10 flex items-center justify-center z-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      </span>
                    )}

                    {/* Step Content */}
                    <div className={status === 'pending' ? 'opacity-35' : ''}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${
                          status === 'completed' ? 'text-slate-100' :
                          status === 'active' ? 'text-[#f59e0b]' : 'text-slate-500'
                        }`}>
                          {step.label}
                        </span>
                        {status === 'active' && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 rounded uppercase tracking-wider font-extrabold">
                            Active Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EVIDENCE EXHIBITS */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
              <ShieldCheck size={14} color="#00f0ff" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">Forensic Exhibits Log</span>
            </div>

            <div className="space-y-2">
              {Array.from({ length: selectedFir.evidenceCount }).map((_, i) => (
                <div key={i} className="flex justify-between items-center bg-black/35 border border-white/5 p-3 rounded-lg text-xs">
                  <span className="font-mono text-slate-400">EXHIBIT-KSP-0{i+1}</span>
                  <span className="text-slate-500 font-bold">Forensic Tag Secured</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
