'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Mic, ShieldAlert, Clock } from 'lucide-react';

interface Notification {
  id: string;
  text: string;
  type: 'alert' | 'info' | 'success';
  time: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'Live dispatcher pipeline active.', type: 'info', time: 'Just now' },
    { id: '2', text: 'SIT team Bravo arrived at Ballari crime scene.', type: 'success', time: '5m ago' },
    { id: '3', text: 'Critical anomaly spike detected in Kalaburagi.', type: 'alert', time: '12m ago' }
  ]);
  const [unreadCount, setUnreadCount] = useState(2);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const alerts = [
      '🚨 New cybercrime spike reported in Bengaluru Urban',
      '🚔 Team Alpha dispatched to Mangaluru Harbor',
      '🔴 Suspect Suresh Nayak identified near Raichur toll gate',
      '⚠️ High risk score calculated for FIR/2026/BLR/102',
      '🎯 SIT Team successfully arrested associate of Imran Sheikh'
    ];
    const types: ('alert' | 'info' | 'success')[] = ['alert', 'info', 'alert', 'info', 'success'];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * alerts.length);
      const newNotif: Notification = {
        id: Date.now().toString(),
        text: alerts[idx],
        type: types[idx],
        time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
      setUnreadCount(prev => prev + 1);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const handleMicClick = () => {
    setIsListening(true);
    setVoiceText('Listening for command...');
    
    setTimeout(() => {
      setVoiceText('"Show repeat offenders in Bengaluru..."');
    }, 1500);

    setTimeout(() => {
      setIsListening(false);
      window.location.href = '/investigator?query=Find%20repeat%20offenders%20in%20Bengaluru';
    }, 3200);
  };

  return (
    <div className="flex items-center gap-3 relative no-print">
      {/* Voice Command Button */}
      <div className="relative">
        <button
          onClick={handleMicClick}
          className={`w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${
            isListening 
              ? 'border-red-500 bg-red-950/40 text-red-400 animate-pulse' 
              : 'border-[rgba(30,58,95,0.15)] bg-[rgba(10,22,40,0.6)] text-[#1E3A5F] hover:border-[#1E3A5F]/50'
          }`}
          title="Voice Command Assistant"
        >
          <Mic size={16} />
        </button>
        {isListening && (
          <div className="absolute right-0 top-11 w-64 bg-[#0a1628]/95 border border-red-500/40 rounded-xl p-3 shadow-2xl z-50 text-xs text-center backdrop-blur-md">
            <div className="font-bold text-red-400 mb-1 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              VOICE RECOGNITION
            </div>
            <div className="text-slate-300 italic">{voiceText}</div>
          </div>
        )}
      </div>

      {/* Notification Bell */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
          className="w-9 h-9 rounded-lg border border-[rgba(30,58,95,0.15)] bg-[rgba(10,22,40,0.6)] text-[#1E3A5F] hover:border-[#1E3A5F]/50 flex items-center justify-center cursor-pointer relative"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 border-2 border-[#020617] text-[10px] font-black text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-11 w-80 bg-[#070e1e]/98 border border-[rgba(30,58,95,0.15)] rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-md">
            <div className="p-3 border-b border-[rgba(30,58,95,0.08)] flex justify-between items-center bg-[rgba(0,240,255,0.03)]">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert size={12} color="#1E3A5F" /> Dispatcher Queue
              </span>
              <button 
                onClick={() => setNotifications([])} 
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No active dispatches</div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-3 border-b border-white/5 hover:bg-white/5 flex gap-2.5 items-start text-xs">
                    {n.type === 'alert' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />}
                    {n.type === 'success' && <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />}
                    {n.type === 'info' && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <div className="text-slate-300 leading-snug">{n.text}</div>
                      <div className="text-[9px] text-slate-600 mt-1 flex items-center gap-1">
                        <Clock size={8} /> {n.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
