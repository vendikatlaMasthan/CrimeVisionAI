'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { EXTENDED_CRIMINAL_NETWORK, CRIMINAL_PROFILES, NETWORK_NODE_DETAILS } from '@/lib/mockData';
import {
  Network, User, AlertTriangle, MapPin, Minimize2,
  RefreshCw, Users, DollarSign, Phone, Truck, ShieldAlert, Sparkles, Star,
  Search, Shield, CheckSquare, Square, ChevronRight, Filter
} from 'lucide-react';

type NodeType = 'suspect' | 'victim' | 'crime' | 'location' | 'vehicle' | 'bank' | 'mobile';
type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | undefined;

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  risk?: RiskLevel;
  district?: string;
  crimes?: number;
  category?: string;
  age?: number;
  status?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphLink {
  source: string;
  target: string;
  strength: number;
}

const NODE_COLORS: Record<NodeType, string> = {
  suspect: '#ef4444',
  victim: '#10b981',
  crime: '#f97316',
  location: '#0ea5e9',
  vehicle: '#8b5cf6',
  bank: '#eab308',
  mobile: '#00f0ff',
};

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#a855f7',
  low: '#10b981',
};

const NODE_ICONS: Record<NodeType, string> = {
  suspect: '👤',
  victim: '🛡️',
  crime: '🔥',
  location: '📍',
  vehicle: '🚗',
  bank: '🏦',
  mobile: '📱',
};

export default function NetworkPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const draggingRef = useRef<string | null>(null);

  // Advanced toggles for filtering categories
  const [showSuspects, setShowSuspects] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showMobiles, setShowMobiles] = useState(true);
  const [showBanks, setShowBanks] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [showOrganized, setShowOrganized] = useState(true);
  const [showVictims, setShowVictims] = useState(true);

  // Intelligence toggles
  const [detectOrganized, setDetectOrganized] = useState(false);
  const [detectHidden, setDetectHidden] = useState(false);
  const [detectRepeat, setDetectRepeat] = useState(false);

  // Filter nodes & links dynamically
  const filteredNodes = useMemo(() => {
    return EXTENDED_CRIMINAL_NETWORK.nodes.filter(node => {
      if (node.type === 'suspect' && !showSuspects) return false;
      if (node.type === 'vehicle' && !showVehicles) return false;
      if (node.type === 'mobile' && !showMobiles) return false;
      if (node.type === 'bank' && !showBanks) return false;
      if (node.type === 'location' && !showLocations) return false;
      if (node.type === 'crime' && !showOrganized) return false;
      if (node.type === 'victim' && !showVictims) return false;
      return true;
    });
  }, [showSuspects, showVehicles, showMobiles, showBanks, showLocations, showOrganized, showVictims]);

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return EXTENDED_CRIMINAL_NETWORK.links.filter(link => {
      // Resolve string source/target or object
      const srcId = typeof link.source === 'string' ? link.source : (link.source as any).id;
      const tgtId = typeof link.target === 'string' ? link.target : (link.target as any).id;
      return nodeIds.has(srcId) && nodeIds.has(tgtId);
    });
  }, [filteredNodes]);

  // Physics loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const W = parent.offsetWidth;
    const H = parent.offsetHeight || 500;
    canvas.width = W;
    canvas.height = H;

    // Reset coordinates if node count changes
    const currentNodes = filteredNodes.map((n, i) => {
      const existing = nodesRef.current.find(en => en.id === n.id);
      if (existing) return { ...n, x: existing.x, y: existing.y, vx: existing.vx, vy: existing.vy } as GraphNode;

      const angle = (i / filteredNodes.length) * Math.PI * 2;
      const radius = 120 + Math.random() * 80;
      return {
        ...n,
        type: n.type as NodeType,
        risk: n.risk as RiskLevel,
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      } as GraphNode;
    });

    nodesRef.current = currentNodes;
    linksRef.current = filteredLinks as GraphLink[];

    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Radar grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.015)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const ns = nodesRef.current;
      const ls = linksRef.current;

      // Force physics calculations
      ns.forEach(n => {
        ns.forEach(m => {
          if (n.id === m.id) return;
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          let repForce = 4000 / (dist * dist);
          if (dist < 90) repForce = 6; // Limit blast force
          
          n.vx += (dx / dist) * repForce;
          n.vy += (dy / dist) * repForce;
        });

        // Pull to center
        n.vx += (W / 2 - n.x) * 0.0006;
        n.vy += (H / 2 - n.y) * 0.0006;
      });

      ls.forEach(link => {
        const src = ns.find(n => n.id === link.source);
        const tgt = ns.find(n => n.id === link.target);
        if (!src || !tgt) return;

        const dx = tgt.x - src.x, dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 120 + (link.strength * 8);
        const attForce = (dist - targetDist) * 0.022;

        const fx = (dx / dist) * attForce;
        const fy = (dy / dist) * attForce;

        src.vx += fx; src.vy += fy;
        tgt.vx -= fx; tgt.vy -= fy;
      });

      // Update positions
      ns.forEach(n => {
        if (draggingRef.current === n.id) return;
        n.vx *= 0.8; n.vy *= 0.8;
        n.x += n.vx; n.y += n.vy;

        n.x = Math.max(35, Math.min(W - 35, n.x));
        n.y = Math.max(35, Math.min(H - 35, n.y));
      });

      // ── DRAW LINKS WITH STRENGTHS ──
      ls.forEach(link => {
        const src = ns.find(n => n.id === link.source);
        const tgt = ns.find(n => n.id === link.target);
        if (!src || !tgt) return;

        const isHighlighted = hoveredId === src.id || hoveredId === tgt.id || selected?.id === src.id || selected?.id === tgt.id;
        
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = isHighlighted ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255,255,255,0.06)';
        // Width proportional to relationship strength
        ctx.lineWidth = isHighlighted ? 2.2 : (1 + link.strength * 0.4);
        ctx.stroke();

        // Label strength values on hovered links
        if (isHighlighted) {
          const mx = (src.x + tgt.x) / 2;
          const my = (src.y + tgt.y) / 2;
          ctx.font = '9px monospace';
          ctx.fillStyle = '#00f0ff';
          ctx.textAlign = 'center';
          ctx.fillText(`str:${link.strength}`, mx, my - 4);
        }

        // Draw flowing pulse node signal
        if (isHighlighted || frame % 40 === 0) {
          const t = ((frame * 0.01) % 1);
          const px = src.x + (tgt.x - src.x) * t;
          const py = src.y + (tgt.y - src.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = isHighlighted ? '#ffffff' : NODE_COLORS[src.type];
          ctx.fill();
        }
      });

      // Hidden connection detector (shared district link)
      if (detectHidden) {
        ns.forEach((n, idx) => {
          ns.forEach((m, mIdx) => {
            if (idx >= mIdx) return;
            if (n.type === 'suspect' && m.type === 'suspect' && n.district === m.district) {
              const alreadyLinked = ls.some(l => 
                (l.source === n.id && l.target === m.id) || (l.source === m.id && l.target === n.id)
              );
              if (!alreadyLinked) {
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(m.x, m.y);
                ctx.setLineDash([3, 4]);
                ctx.strokeStyle = 'rgba(234,179,8,0.35)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }
          });
        });
      }

      // Organized Crime Circle Groups
      if (detectOrganized) {
        ns.forEach(n => {
          if (n.type === 'crime') {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 50, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.12)';
            ctx.setLineDash([4, 6]);
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }

      // ── DRAW NODES ──
      ns.forEach(n => {
        const color = NODE_COLORS[n.type];
        const isHovered = hoveredId === n.id;
        const isSelected = selected?.id === n.id;

        let baseRadius = n.type === 'suspect' ? 14 : 12;

        // Dynamic coloring for suspects based on risk score / risk level
        let nodeStrokeColor = color;
        if (n.type === 'suspect' && n.risk) {
          nodeStrokeColor = RISK_COLORS[n.risk] || color;
        }

        // Pulse ring for critical nodes
        if (n.risk === 'critical') {
          ctx.beginPath();
          ctx.arc(n.x, n.y, baseRadius + 8 + Math.sin(frame * 0.08) * 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw shadow glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseRadius + 5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, baseRadius + 5);
        glow.addColorStop(0, nodeStrokeColor + (isHovered || isSelected ? '55' : '15'));
        glow.addColorStop(1, nodeStrokeColor + '00');
        ctx.fillStyle = glow;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#060d1e';
        ctx.fill();

        ctx.strokeStyle = isSelected ? '#ffffff' : nodeStrokeColor;
        ctx.lineWidth = isSelected ? 2.5 : isHovered ? 1.8 : 1.2;
        ctx.stroke();

        // Draw Icon
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(NODE_ICONS[n.type], n.x, n.y);

        // Count connected links
        const linkCount = ls.filter(l => l.source === n.id || l.target === n.id).length;

        // Draw Label with Connection Count
        ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : '#94a3b8';
        ctx.textAlign = 'center';

        const labelText = `${n.label} (${linkCount})`;
        ctx.fillText(labelText, n.x, n.y + baseRadius + 12);

        // Repeat Offender Badge
        if (detectRepeat && n.type === 'suspect' && n.crimes && n.crimes >= 4) {
          ctx.beginPath();
          ctx.arc(n.x + baseRadius - 2, n.y - baseRadius + 2, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.font = '8px Arial';
          ctx.fillStyle = '#000';
          ctx.fillText('★', n.x + baseRadius - 2, n.y - baseRadius + 2);
        }
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [filteredNodes, filteredLinks, selected, hoveredId, detectOrganized, detectHidden, detectRepeat]);

  // Mouse handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find(n => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < (22);
    });

    setSelected(hit || null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggingRef.current) {
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) {
        node.x = mx;
        node.y = my;
      }
      return;
    }

    const hit = nodesRef.current.find(n => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < (22);
    });

    setHoveredId(hit ? hit.id : null);
    setTooltip(hit ? { x: mx, y: my, node: hit } : null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find(n => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < (22);
    });

    if (hit) {
      draggingRef.current = hit.id;
    }
  };

  // Find detailed profile metrics if suspect is selected, or trace assets to the primary suspect
  const criminalProfile = useMemo(() => {
    if (!selected) return null;
    if (selected.type === 'suspect') {
      return CRIMINAL_PROFILES.find(cp => cp.name.toLowerCase() === selected.label.toLowerCase() || cp.id === selected.id) || null;
    }
    // Tracing other nodes (vehicle, bank, mobile) to find primary suspect
    const link = EXTENDED_CRIMINAL_NETWORK.links.find(l => {
      const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      return targetId === selected.id || sourceId === selected.id;
    });
    if (link) {
      const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
      const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const suspectId = targetId === selected.id ? sourceId : targetId;
      return CRIMINAL_PROFILES.find(cp => cp.id === suspectId || cp.name.toLowerCase() === suspectId.toLowerCase()) || null;
    }
    return null;
  }, [selected]);

  const selectedDetails = useMemo(() => {
    if (!selected) return null;
    return NETWORK_NODE_DETAILS[selected.id] || {
      name: selected.label,
      type: selected.type.toUpperCase(),
      status: selected.status || 'Active Surveillance',
      crimeHistory: selected.crimes ? [`Crime incident track (${selected.crimes})`] : [],
      knownAssociates: [],
      linkedCrimes: selected.category ? [selected.category] : [],
      investigationStatus: 'Active Trace',
      detail: `Integrated database entry associated with district: ${selected.district || 'Command Area'}`
    };
  }, [selected]);

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-14">
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Network size={22} color="#a78bfa" />
          </div>
          <div>
            <h1 className="page-title">Criminal Network Intelligence</h1>
            <p className="page-subtitle">Multi-layered connection matrix mapping suspects, vehicles, communication streams and finances</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC NODE FILTERS ROW */}
      <div className="glass-card p-4 mb-5 flex flex-wrap gap-x-6 gap-y-3 items-center">
        <span className="text-xs font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-1">
          <Filter size={12} /> Graph Layers:
        </span>
        <div className="flex flex-wrap gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showSuspects} onChange={() => setShowSuspects(!showSuspects)} />
            Suspects
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showVehicles} onChange={() => setShowVehicles(!showVehicles)} />
            Vehicles
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showMobiles} onChange={() => setShowMobiles(!showMobiles)} />
            Mobile Lines
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showBanks} onChange={() => setShowBanks(!showBanks)} />
            Bank Accounts
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showLocations} onChange={() => setShowLocations(!showLocations)} />
            Locations
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showOrganized} onChange={() => setShowOrganized(!showOrganized)} />
            Organized Crime Rings
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={showVictims} onChange={() => setShowVictims(!showVictims)} />
            Victims
          </label>
        </div>
      </div>

      {/* GRAPH + SIDEBAR GRID */}
      <div className="responsive-grid-1-340">
        
        {/* CANVAS */}
        <div className="glass-card p-0 relative overflow-hidden" style={{ height: '560px' }}>
          <canvas
            ref={canvasRef}
            style={{ background: '#020617', width: '100%', height: '100%', cursor: draggingRef.current ? 'grabbing' : 'grab' }}
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={() => { draggingRef.current = null; }}
          />

          {/* Reset button */}
          <button 
            onClick={() => {
              const canvas = canvasRef.current!;
              nodesRef.current.forEach((n, i) => {
                const angle = (i / nodesRef.current.length) * Math.PI * 2;
                n.x = canvas.width / 2 + Math.cos(angle) * 140;
                n.y = canvas.height / 2 + Math.sin(angle) * 140;
                n.vx = 0; n.vy = 0;
              });
              setSelected(null);
            }}
            className="cyber-btn cyber-btn-cyan absolute top-3 right-3 text-[10px]"
          >
            Reset Force Layout
          </button>

          {/* Canvas Tooltip */}
          {tooltip && (
            <div
              className="tooltip absolute p-2 text-xs bg-slate-950/90 border border-cyan-500/30 rounded-lg pointer-events-none"
              style={{ left: tooltip.x + 12, top: tooltip.y - 12, transform: 'translateY(-100%)' }}
            >
              <div className="font-bold text-slate-100">{tooltip.node.label}</div>
              <div className="text-[10px] text-slate-400 capitalize">{tooltip.node.type} layer</div>
            </div>
          )}
        </div>

        {/* DETAILS SIDE PANEL */}
        <div className="flex flex-col gap-4">
          
          {/* Selected Node Profile (Phase 3 & 4) */}
          {selected && selectedDetails ? (
            <div className="glass-card" style={{ borderLeft: `3px solid ${NODE_COLORS[selected.type]}` }}>
              <div className="flex justify-between items-start mb-3 pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-black text-slate-100">{selectedDetails.name}</h3>
                  <span className="text-[9px] uppercase font-bold" style={{ color: NODE_COLORS[selected.type] }}>
                    {selected.type} Profile
                  </span>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white cursor-pointer">
                  <Minimize2 size={14} />
                </button>
              </div>

              {/* Asset/Non-suspect Details first (if not suspect) */}
              {selected.type !== 'suspect' && (
                <div className="space-y-2 text-xs mb-4 pb-3 border-b border-white/5">
                  <div className="bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Asset Description</span>
                    <p className="text-slate-300 mt-1 leading-snug">{selectedDetails.detail}</p>
                  </div>
                  {selectedDetails.linkedCrimes && selectedDetails.linkedCrimes.length > 0 && (
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1 font-bold uppercase tracking-wide">Linked Cases</span>
                      {selectedDetails.linkedCrimes.map((lc, i) => (
                        <div key={i} className="text-cyan-400 font-bold flex items-center gap-1 font-mono text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> {lc}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pt-1.5">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">Status Flag</span>
                    <span className="badge badge-amber mt-1 inline-block uppercase text-[9px] font-black">{selectedDetails.status}</span>
                  </div>
                </div>
              )}

              {/* Criminal Profile Deep Dive (Phase 3) */}
              {criminalProfile ? (
                <div className="space-y-3 text-xs">
                  {selected.type !== 'suspect' && (
                    <div className="text-[10px] font-black uppercase text-red-400 tracking-wider mb-2 flex items-center gap-1">
                      ⚠️ Linked Suspect Dossier
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-950/20 border border-red-500/30 rounded-xl flex items-center justify-center font-bold text-red-500 text-lg">
                      👤
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{criminalProfile.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Age: {criminalProfile.age} ({criminalProfile.gender})</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Risk Score: <strong className="text-red-400">{criminalProfile.profileScore}/100</strong></div>
                      <div className="text-[10px] text-slate-500">Arrests: {criminalProfile.arrestCount} YTD</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block mb-1">Crime History</span>
                    {criminalProfile.crimeHistory.map((ch, i) => (
                      <div key={i} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <ChevronRight size={10} color="#ef4444" /> {ch}
                      </div>
                    ))}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block mb-1">Known Associates</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {criminalProfile.knownAssociates.map(a => (
                        <span key={a} className="badge badge-gray text-[9px]">{a}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block mb-1">Associated Assets</span>
                    <div className="space-y-1 text-[10px] text-slate-400">
                      <div>🚗 Vehicle: {criminalProfile.vehiclesUsed.join(', ')}</div>
                      <div>📱 Mobile: {criminalProfile.mobileNumbers.join(', ')}</div>
                      <div>🏦 Account: {criminalProfile.bankAccounts.join(', ')}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Recent Track Logs</span>
                    <p className="text-[10px] italic text-slate-400 mt-0.5">"{criminalProfile.recentActivity}"</p>
                  </div>
                </div>
              ) : (
                /* Non-suspect entity details with no linked suspect (fallback) */
                selected.type === 'suspect' ? null : (
                  <div className="text-xs text-slate-500 italic pt-2">
                    No suspect linked to this asset in graph database.
                  </div>
                )
              )}
            </div>
          ) : (
            /* General Summary */
            <div className="glass-card">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="text-[#00f0ff]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff]">Graph Analytics</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Centralized relationship visualization mapping nodes. Click any entity in the network plot to inspect linked assets, associates, and background dossiers.
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs p-2 bg-black/25 rounded-lg border border-white/5">
                  <span className="text-slate-400">Total Nodes Rendered</span>
                  <span className="font-bold text-[#00f0ff]">{filteredNodes.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 bg-black/25 rounded-lg border border-white/5">
                  <span className="text-slate-400">Total Links Rendered</span>
                  <span className="font-bold text-slate-200">{filteredLinks.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Intelligence relationship toggles */}
          <div className="glass-card">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">Relationship Detectors</span>
            </div>

            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer ${detectOrganized ? 'bg-red-950/20 border-red-500/30 text-red-400' : 'bg-black/20 border-white/5 text-slate-300'}`}>
                <input type="checkbox" checked={detectOrganized} onChange={() => setDetectOrganized(!detectOrganized)} />
                <div>
                  <div className="text-xs font-bold">Organized Crime Rings</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Highlight major extortion clusters</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer ${detectHidden ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-400' : 'bg-black/20 border-white/5 text-slate-300'}`}>
                <input type="checkbox" checked={detectHidden} onChange={() => setDetectHidden(!detectHidden)} />
                <div>
                  <div className="text-xs font-bold">Hidden Relationship Engine</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Link suspects based on shared district</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer ${detectRepeat ? 'bg-yellow-950/20 border-yellow-500/30 text-yellow-400' : 'bg-black/20 border-white/5 text-slate-300'}`}>
                <input type="checkbox" checked={detectRepeat} onChange={() => setDetectRepeat(!detectRepeat)} />
                <div>
                  <div className="text-xs font-bold">Repeat Offender Identifiers</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Pinpoint suspects with 4+ prior arrests</div>
                </div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
