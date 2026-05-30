'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, Wifi, Clock } from 'lucide-react';

export default function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

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

  return (
    <header className="flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(5, 10, 25, 0.8)',
        borderBottom: '1px solid rgba(0, 240, 255, 0.08)',
        backdropFilter: 'blur(20px)',
      }}>
      {/* Left */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #00f0ff, #8b5cf6)' }} />
          <h1 className="text-lg font-bold tracking-wide" style={{ color: '#e2e8f0' }}>{title}</h1>
        </div>
        {subtitle && (
          <p className="text-xs mt-0.5 ml-3" style={{ color: '#475569' }}>{subtitle}</p>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:flex">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search cases, suspects..."
            className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-56"
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(0, 240, 255, 0.1)',
              color: '#94a3b8',
            }}
          />
        </div>

        {/* Connection */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <Wifi size={12} style={{ color: '#10b981' }} />
          <span className="text-xs font-semibold" style={{ color: '#10b981' }}>SECURE</span>
        </div>

        {/* Alerts */}
        <button className="relative p-2 rounded-lg"
          style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
          <Bell size={16} style={{ color: '#ef4444' }} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold animate-pulse"
            style={{ background: '#ef4444', color: '#fff', fontSize: '9px' }}>
            5
          </span>
        </button>

        {/* Clock */}
        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: '#00f0ff' }} />
            <span className="text-sm font-mono font-bold" style={{ color: '#00f0ff' }}>{time}</span>
          </div>
          <span className="text-xs" style={{ color: '#475569' }}>{date}</span>
        </div>
      </div>
    </header>
  );
}
