'use client';

import { useEffect, useRef, useState } from 'react';
import Topbar from '@/components/Topbar';
import { CRIMINAL_NETWORK } from '@/lib/mockData';
import { Network, User, AlertTriangle, MapPin, Maximize2, RefreshCw, Info } from 'lucide-react';

type NodeType = 'suspect' | 'crime' | 'location';
type RiskLevel = 'critical' | 'high' | 'medium' | undefined;

interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  risk?: RiskLevel;
  district?: string;
  crimes?: number;
  category?: string;
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
  crime: '#f59e0b',
  location: '#00f0ff',
};

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#8b5cf6',
};

export default function NetworkPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const draggingRef = useRef<string | null>(null);
  const [stats, setStats] = useState({ suspects: 0, crimes: 0, locations: 0, links: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.parentElement!.offsetWidth;
    const H = canvas.parentElement!.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Initialize nodes with positions
    const nodes: GraphNode[] = CRIMINAL_NETWORK.nodes.map((n, i) => ({
      ...n,
      type: n.type as NodeType,
      risk: n.risk as RiskLevel,
      x: W / 2 + Math.cos((i / CRIMINAL_NETWORK.nodes.length) * Math.PI * 2) * 160,
      y: H / 2 + Math.sin((i / CRIMINAL_NETWORK.nodes.length) * Math.PI * 2) * 120,
      vx: 0,
      vy: 0,
    }));
    nodesRef.current = nodes;
    linksRef.current = CRIMINAL_NETWORK.links as GraphLink[];

    setStats({
      suspects: nodes.filter(n => n.type === 'suspect').length,
      crimes: nodes.filter(n => n.type === 'crime').length,
      locations: nodes.filter(n => n.type === 'location').length,
      links: CRIMINAL_NETWORK.links.length,
    });

    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Physics simulation
      const ns = nodesRef.current;
      ns.forEach(n => {
        ns.forEach(m => {
          if (n.id === m.id) return;
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 2000 / (dist * dist);
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        });
        // Gravity to center
        n.vx += (W / 2 - n.x) * 0.001;
        n.vy += (H / 2 - n.y) * 0.001;
      });

      // Link forces
      linksRef.current.forEach(link => {
        const src = ns.find(n => n.id === link.source);
        const tgt = ns.find(n => n.id === link.target);
        if (!src || !tgt) return;
        const dx = tgt.x - src.x, dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 120 + link.strength * 10;
        const force = (dist - targetDist) * 0.03;
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        src.vx += fx; src.vy += fy;
        tgt.vx -= fx; tgt.vy -= fy;
      });

      // Update positions
      ns.forEach(n => {
        if (draggingRef.current === n.id) return;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
        n.x = Math.max(50, Math.min(W - 50, n.x));
        n.y = Math.max(50, Math.min(H - 50, n.y));
      });

      // Draw links
      linksRef.current.forEach(link => {
        const src = ns.find(n => n.id === link.source);
        const tgt = ns.find(n => n.id === link.target);
        if (!src || !tgt) return;

        const srcColor = NODE_COLORS[src.type];
        const tgtColor = NODE_COLORS[tgt.type];
        const grad = ctx.createLinearGradient(src.x, src.y, tgt.x, tgt.y);
        grad.addColorStop(0, srcColor + '80');
        grad.addColorStop(1, tgtColor + '80');

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = link.strength * 0.5;
        ctx.stroke();

        // Animated pulse on link
        const t = (frame * 0.02) % 1;
        const px = src.x + (tgt.x - src.x) * t;
        const py = src.y + (tgt.y - src.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.fill();
      });

      // Draw nodes
      ns.forEach(n => {
        const color = NODE_COLORS[n.type];
        const r = n.type === 'suspect' ? 18 : n.type === 'crime' ? 16 : 14;
        const isSelected = selected?.id === n.id;

        // Glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
        const glowGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r + 8);
        glowGrad.addColorStop(0, color + '40');
        glowGrad.addColorStop(1, color + '00');
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color + '20';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#fff' : color;
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        const label = n.label.length > 12 ? n.label.slice(0, 12) + '…' : n.label;
        ctx.fillText(label, n.x, n.y + r + 14);
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [selected]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find(n => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < 22;
    });
    setSelected(hit || null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find(n => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < 22;
    });

    if (draggingRef.current) {
      const node = nodesRef.current.find(n => n.id === draggingRef.current);
      if (node) { node.x = mx; node.y = my; }
    }

    setTooltip(hit ? { x: e.clientX - rect.left, y: e.clientY - rect.top, node: hit } : null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = nodesRef.current.find(n => {
      const dx = n.x - mx, dy = n.y - my;
      return Math.sqrt(dx * dx + dy * dy) < 22;
    });
    if (hit) draggingRef.current = hit.id;
  };

  const handleMouseUp = () => { draggingRef.current = null; };

  const resetLayout = () => {
    const canvas = canvasRef.current!;
    const W = canvas.width, H = canvas.height;
    nodesRef.current.forEach((n, i) => {
      n.x = W / 2 + Math.cos((i / nodesRef.current.length) * Math.PI * 2) * 160;
      n.y = H / 2 + Math.sin((i / nodesRef.current.length) * Math.PI * 2) * 120;
      n.vx = 0; n.vy = 0;
    });
    setSelected(null);
  };

  const getConnectedNodes = (nodeId: string) => {
    return linksRef.current
      .filter(l => l.source === nodeId || l.target === nodeId)
      .map(l => l.source === nodeId ? l.target : l.source)
      .map(id => nodesRef.current.find(n => n.id === id))
      .filter(Boolean) as GraphNode[];
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Criminal Network Analysis" subtitle="Interactive suspect-crime-location relationship visualization" />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: User, label: 'Suspects', value: stats.suspects, color: '#ef4444' },
            { icon: AlertTriangle, label: 'Crime Events', value: stats.crimes, color: '#f59e0b' },
            { icon: MapPin, label: 'Locations', value: stats.locations, color: '#00f0ff' },
            { icon: Network, label: 'Connections', value: stats.links, color: '#8b5cf6' },
          ].map(item => (
            <div key={item.label} className="glass-card p-4 flex items-center gap-3" style={{ borderColor: `${item.color}22` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-xl font-black" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs" style={{ color: '#475569' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Canvas */}
          <div className="lg:col-span-2 glass-card overflow-hidden relative" style={{ height: 520 }}>
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network size={14} style={{ color: '#00f0ff' }} />
                <span className="text-xs font-bold tracking-wider" style={{ color: '#e2e8f0' }}>NETWORK GRAPH</span>
                <span className="text-xs" style={{ color: '#475569' }}>• Drag nodes to explore</span>
              </div>
              <button onClick={resetLayout} className="cyber-btn cyber-btn-cyan" style={{ padding: '6px 12px', fontSize: '10px' }}>
                <RefreshCw size={10} />
                RESET
              </button>
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ cursor: 'crosshair' }}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />

            {/* Tooltip */}
            {tooltip && (
              <div className="absolute pointer-events-none z-20 tooltip"
                style={{ left: tooltip.x + 12, top: tooltip.y - 30, transform: 'translateY(-100%)' }}>
                <div className="font-bold" style={{ color: NODE_COLORS[tooltip.node.type] }}>{tooltip.node.label}</div>
                <div className="text-xs" style={{ color: '#64748b' }}>Type: {tooltip.node.type}</div>
                {tooltip.node.district && <div className="text-xs" style={{ color: '#64748b' }}>District: {tooltip.node.district}</div>}
                {tooltip.node.crimes && <div className="text-xs" style={{ color: '#ef4444' }}>Crimes: {tooltip.node.crimes}</div>}
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex gap-4">
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  <span className="text-xs capitalize" style={{ color: '#64748b' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="space-y-4">
            {selected ? (
              <div className="glass-card p-4 animate-fadeInUp" style={{ borderColor: `${NODE_COLORS[selected.type]}30` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${NODE_COLORS[selected.type]}15`, border: `1px solid ${NODE_COLORS[selected.type]}30` }}>
                    {selected.type === 'suspect' ? <User size={14} style={{ color: NODE_COLORS[selected.type] }} />
                      : selected.type === 'crime' ? <AlertTriangle size={14} style={{ color: NODE_COLORS[selected.type] }} />
                        : <MapPin size={14} style={{ color: NODE_COLORS[selected.type] }} />}
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#e2e8f0' }}>{selected.label}</div>
                    <div className="text-xs capitalize" style={{ color: NODE_COLORS[selected.type] }}>{selected.type}</div>
                  </div>
                </div>
                {selected.risk && (
                  <div className="mb-3">
                    <span className={`badge ${selected.risk === 'critical' ? 'badge-red' : selected.risk === 'high' ? 'badge-amber' : 'badge-purple'}`}>
                      {selected.risk.toUpperCase()} RISK
                    </span>
                  </div>
                )}
                {selected.district && (
                  <div className="p-2 rounded-lg mb-2" style={{ background: 'rgba(15,23,42,0.5)' }}>
                    <div className="text-xs" style={{ color: '#475569' }}>District</div>
                    <div className="text-sm font-semibold" style={{ color: '#94a3b8' }}>{selected.district}</div>
                  </div>
                )}
                {selected.crimes !== undefined && (
                  <div className="p-2 rounded-lg mb-2" style={{ background: 'rgba(15,23,42,0.5)' }}>
                    <div className="text-xs" style={{ color: '#475569' }}>Known Offenses</div>
                    <div className="text-sm font-bold" style={{ color: '#ef4444' }}>{selected.crimes} crimes</div>
                  </div>
                )}
                {selected.category && (
                  <div className="p-2 rounded-lg mb-2" style={{ background: 'rgba(15,23,42,0.5)' }}>
                    <div className="text-xs" style={{ color: '#475569' }}>Crime Category</div>
                    <div className="text-sm font-semibold" style={{ color: '#f59e0b' }}>{selected.category}</div>
                  </div>
                )}
                <div className="pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="text-xs font-bold mb-2" style={{ color: '#475569' }}>CONNECTED NODES</div>
                  <div className="space-y-1.5">
                    {getConnectedNodes(selected.id).map(n => (
                      <div key={n.id} className="flex items-center gap-2 cursor-pointer p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}
                        onClick={() => setSelected(n)}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: NODE_COLORS[n.type] }} />
                        <span className="text-xs" style={{ color: '#94a3b8' }}>{n.label}</span>
                        <span className="text-xs ml-auto capitalize" style={{ color: NODE_COLORS[n.type] }}>{n.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <Network size={32} className="mx-auto mb-3" style={{ color: '#334155' }} />
                <p className="text-sm font-semibold mb-1" style={{ color: '#475569' }}>Select a Node</p>
                <p className="text-xs" style={{ color: '#334155' }}>Click any node on the network graph to view detailed information and connections</p>
              </div>
            )}

            {/* Network Legend */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info size={12} style={{ color: '#475569' }} />
                <span className="text-xs font-bold tracking-wider" style={{ color: '#475569' }}>NETWORK GUIDE</span>
              </div>
              <div className="space-y-3">
                {[
                  { color: '#ef4444', label: 'Suspects', desc: 'Known criminal individuals tracked by intelligence' },
                  { color: '#f59e0b', label: 'Crime Events', desc: 'Active or past criminal incidents under investigation' },
                  { color: '#00f0ff', label: 'Locations', desc: 'Geographic hotspots linked to criminal activity' },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    <div>
                      <div className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</div>
                      <div className="text-xs" style={{ color: '#475569' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
