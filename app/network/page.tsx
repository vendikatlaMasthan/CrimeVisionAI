'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { CRIMINAL_NETWORK, NETWORK_NODE_DETAILS } from '@/lib/mockData';
import {
  Network, User, AlertTriangle, MapPin, Minimize2,
  RefreshCw, Info, HelpCircle, Eye, Users, FileText,
  DollarSign, Phone, Truck, ShieldAlert, Sparkles, Star
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
  suspect: '#ef4444',     // Red
  victim: '#10b981',      // Green
  crime: '#f97316',       // Orange
  location: '#0ea5e9',    // Blue
  vehicle: '#8b5cf6',     // Purple
  bank: '#f59e0b',        // Amber
  mobile: '#00f0ff',      // Cyan
};

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#8b5cf6',
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
  
  // Toggles for AI Intelligence analysis tools
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [detectOrganized, setDetectOrganized] = useState(false);
  const [detectHidden, setDetectHidden] = useState(false);
  const [detectRepeat, setDetectRepeat] = useState(false);

  // Initialize network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement!;
    const W = parent.offsetWidth;
    const H = parent.offsetHeight || 500;
    canvas.width = W;
    canvas.height = H;

    // Map source network from mockData
    const nodes: GraphNode[] = CRIMINAL_NETWORK.nodes.map((n, i) => {
      // Find existing position or randomize around center
      const angle = (i / CRIMINAL_NETWORK.nodes.length) * Math.PI * 2;
      const radius = 150 + Math.random() * 50;
      return {
        ...n,
        type: n.type as NodeType,
        risk: n.risk as RiskLevel,
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });

    nodesRef.current = nodes;
    linksRef.current = CRIMINAL_NETWORK.links as GraphLink[];

    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Physics simulation (repulsion & centering)
      const ns = nodesRef.current;
      const ls = linksRef.current;

      ns.forEach(n => {
        ns.forEach(m => {
          if (n.id === m.id) return;
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          // Repulsion force
          let repForce = 3500 / (dist * dist);
          if (dist < 80) repForce = 5; // Prevent overlap blast
          
          n.vx += (dx / dist) * repForce;
          n.vy += (dy / dist) * repForce;
        });

        // Pull to center slightly
        n.vx += (W / 2 - n.x) * 0.0008;
        n.vy += (H / 2 - n.y) * 0.0008;
      });

      // Link attraction forces
      ls.forEach(link => {
        const src = ns.find(n => n.id === link.source);
        const tgt = ns.find(n => n.id === link.target);
        if (!src || !tgt) return;

        const dx = tgt.x - src.x, dy = tgt.y - src.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 110 + (link.strength * 10);
        
        // Attraction force
        const attForce = (dist - targetDist) * 0.025;
        const fx = (dx / dist) * attForce;
        const fy = (dy / dist) * attForce;

        src.vx += fx; src.vy += fy;
        tgt.vx -= fx; tgt.vy -= fy;
      });

      // Update node positions
      ns.forEach(n => {
        if (draggingRef.current === n.id) return;
        n.vx *= 0.82; n.vy *= 0.82; // Friction
        n.x += n.vx; n.y += n.vy;
        
        // Boundary checking
        n.x = Math.max(30, Math.min(W - 30, n.x));
        n.y = Math.max(30, Math.min(H - 30, n.y));
      });

      // ── DRAW LINKS ──
      ls.forEach(link => {
        const src = ns.find(n => n.id === link.source);
        const tgt = ns.find(n => n.id === link.target);
        if (!src || !tgt) return;

        // Skip if either node is filtered out
        const filterType = activeFilter;
        if (filterType !== 'all') {
          const filterNode = filterType === 'suspects' ? 'suspect' :
                             filterType === 'victims' ? 'victim' :
                             filterType === 'crimes' ? 'crime' :
                             filterType === 'locations' ? 'location' :
                             filterType === 'vehicles' ? 'vehicle' :
                             filterType === 'banks' ? 'bank' :
                             filterType === 'mobiles' ? 'mobile' : '';
          if (src.type !== filterNode && tgt.type !== filterNode) {
            return; // Skip edge if it doesn't connect to filter target
          }
        }

        const isHighlighted = hoveredId === src.id || hoveredId === tgt.id || selected?.id === src.id || selected?.id === tgt.id;
        const color = isHighlighted ? '#ffffff' : 'rgba(255,255,255,0.08)';
        
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = isHighlighted ? 1.5 : 1;
        ctx.stroke();

        // Pulsing signals along links
        if (isHighlighted || frame % 30 === 0) {
          const speed = 0.015;
          const t = (frame * speed) % 1;
          const px = src.x + (tgt.x - src.x) * t;
          const py = src.y + (tgt.y - src.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = NODE_COLORS[src.type];
          ctx.fill();
        }
      });

      // ── DRAW HIDDEN RELATIONSHIPS (IF DETECTED/TOGGLED) ──
      if (detectHidden) {
        ns.forEach((n, idx) => {
          ns.forEach((m, mIdx) => {
            if (idx >= mIdx) return;
            // Check if they are both suspects and share the same district but are not linked directly
            if (n.type === 'suspect' && m.type === 'suspect' && n.district === m.district) {
              const alreadyLinked = ls.some(l => 
                (l.source === n.id && l.target === m.id) || (l.source === m.id && l.target === n.id)
              );
              if (!alreadyLinked) {
                // Draw a dashed orange link representing hidden relationship
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(m.x, m.y);
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = 'rgba(245,158,11,0.45)';
                ctx.lineWidth = 1.2;
                ctx.stroke();
                ctx.setLineDash([]); // Reset
                
                // Draw indicator text in middle
                if (frame % 200 < 100) {
                  const mx = (n.x + m.x) / 2;
                  const my = (n.y + m.y) / 2;
                  ctx.font = '8px Space Grotesk, sans-serif';
                  ctx.fillStyle = '#f59e0b';
                  ctx.textAlign = 'center';
                  ctx.fillText('SHARED LOC', mx, my - 3);
                }
              }
            }
          });
        });
      }

      // ── DRAW ORGANIZED CRIME CLUSTERS ──
      if (detectOrganized) {
        // Highlight critical crimes rings
        ns.forEach(n => {
          if (n.type === 'crime') {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 45, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.setLineDash([6, 6]);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Outer glow ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, 50 + Math.sin(frame * 0.05) * 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.04)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      }

      // ── DRAW NODES ──
      ns.forEach(n => {
        // Filter out nodes based on filter tabs
        const filterType = activeFilter;
        if (filterType !== 'all') {
          const filterNode = filterType === 'suspects' ? 'suspect' :
                             filterType === 'victims' ? 'victim' :
                             filterType === 'crimes' ? 'crime' :
                             filterType === 'locations' ? 'location' :
                             filterType === 'vehicles' ? 'vehicle' :
                             filterType === 'banks' ? 'bank' :
                             filterType === 'mobiles' ? 'mobile' : '';
          if (n.type !== filterNode && n.id !== selected?.id) {
            return; // Skip drawing if not matching filter unless selected
          }
        }

        const color = NODE_COLORS[n.type];
        const isHovered = hoveredId === n.id;
        const isSelected = selected?.id === n.id;
        
        let baseRadius = 13;
        if (n.type === 'suspect') baseRadius = 15;
        if (n.type === 'location') baseRadius = 17;
        if (n.type === 'victim') baseRadius = 11;

        // Render outer pulse ring if critical risk
        if (n.risk === 'critical') {
          ctx.beginPath();
          ctx.arc(n.x, n.y, baseRadius + 10 + Math.sin(frame * 0.08) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Draw shadow/glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseRadius + 6, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, baseRadius + 6);
        glow.addColorStop(0, color + (isHovered || isSelected ? '60' : '22'));
        glow.addColorStop(1, color + '00');
        ctx.fillStyle = glow;
        ctx.fill();

        // Draw Node Border Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10,22,40,0.92)';
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : color;
        ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1.2;
        ctx.stroke();

        // Draw Inside Symbol Icon/Text
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(NODE_ICONS[n.type], n.x, n.y);

        // Draw Label Text
        ctx.font = isSelected ? 'bold 11px Space Grotesk, sans-serif' : '10px Space Grotesk, sans-serif';
        ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
        ctx.textAlign = 'center';
        
        // Truncate long labels
        const label = n.label.length > 14 ? n.label.substring(0, 12) + '…' : n.label;
        ctx.fillText(label, n.x, n.y + baseRadius + 14);

        // Repeat Offender Badge
        if (detectRepeat && n.type === 'suspect' && n.crimes && n.crimes >= 5) {
          ctx.beginPath();
          ctx.arc(n.x + baseRadius - 2, n.y - baseRadius + 2, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#f59e0b';
          ctx.fill();
          ctx.font = '9px Arial';
          ctx.fillStyle = '#000';
          ctx.fillText('★', n.x + baseRadius - 2, n.y - baseRadius + 2);
        }
      });

      frame++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [selected, hoveredId, activeFilter, detectOrganized, detectHidden, detectRepeat]);

  // Handle click on canvas to select node
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = nodesRef.current.find(n => {
      // Check filtering constraints
      if (activeFilter !== 'all') {
        const filterNode = activeFilter === 'suspects' ? 'suspect' :
                           activeFilter === 'victims' ? 'victim' :
                           activeFilter === 'crimes' ? 'crime' :
                           activeFilter === 'locations' ? 'location' :
                           activeFilter === 'vehicles' ? 'vehicle' :
                           activeFilter === 'banks' ? 'bank' :
                           activeFilter === 'mobiles' ? 'mobile' : '';
        if (n.type !== filterNode) return false;
      }
      
      const dx = n.x - mx, dy = n.y - my;
      const baseRadius = n.type === 'suspect' ? 15 : n.type === 'location' ? 17 : 13;
      return Math.sqrt(dx * dx + dy * dy) < (baseRadius + 5);
    });

    setSelected(hit || null);
  };

  // Dragging and tooltip logic
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
      if (activeFilter !== 'all') {
        const filterNode = activeFilter === 'suspects' ? 'suspect' :
                           activeFilter === 'victims' ? 'victim' :
                           activeFilter === 'crimes' ? 'crime' :
                           activeFilter === 'locations' ? 'location' :
                           activeFilter === 'vehicles' ? 'vehicle' :
                           activeFilter === 'banks' ? 'bank' :
                           activeFilter === 'mobiles' ? 'mobile' : '';
        if (n.type !== filterNode) return false;
      }
      const dx = n.x - mx, dy = n.y - my;
      const baseRadius = n.type === 'suspect' ? 15 : n.type === 'location' ? 17 : 13;
      return Math.sqrt(dx * dx + dy * dy) < (baseRadius + 5);
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
      if (activeFilter !== 'all') {
        const filterNode = activeFilter === 'suspects' ? 'suspect' :
                           activeFilter === 'victims' ? 'victim' :
                           activeFilter === 'crimes' ? 'crime' :
                           activeFilter === 'locations' ? 'location' :
                           activeFilter === 'vehicles' ? 'vehicle' :
                           activeFilter === 'banks' ? 'bank' :
                           activeFilter === 'mobiles' ? 'mobile' : '';
        if (n.type !== filterNode) return false;
      }
      const dx = n.x - mx, dy = n.y - my;
      const baseRadius = n.type === 'suspect' ? 15 : n.type === 'location' ? 17 : 13;
      return Math.sqrt(dx * dx + dy * dy) < (baseRadius + 5);
    });

    if (hit) {
      draggingRef.current = hit.id;
    }
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  const handleResetLayout = () => {
    const canvas = canvasRef.current!;
    const W = canvas.width;
    const H = canvas.height;
    nodesRef.current.forEach((n, i) => {
      const angle = (i / nodesRef.current.length) * Math.PI * 2;
      n.x = W / 2 + Math.cos(angle) * 160;
      n.y = H / 2 + Math.sin(angle) * 130;
      n.vx = 0;
      n.vy = 0;
    });
    setSelected(null);
  };

  // Node details finder
  const selectedDetails = useMemo(() => {
    if (!selected) return null;
    return NETWORK_NODE_DETAILS[selected.id] || {
      name: selected.label,
      type: selected.type.toUpperCase(),
      status: selected.status || 'Active',
      crimeHistory: selected.crimes ? [`Multiple instances (${selected.crimes})`] : [],
      knownAssociates: [],
      linkedCrimes: selected.category ? [selected.category] : [],
      investigationStatus: 'Monitoring',
      detail: `Analytical node based in ${selected.district || 'Karnataka'}.`
    };
  }, [selected]);

  // Node influence score generator
  const nodeInfluenceScore = useMemo(() => {
    if (!selected) return 0;
    const links = CRIMINAL_NETWORK.links.filter(l => l.source === selected.id || l.target === selected.id);
    const degree = links.length;
    let baseScore = degree * 12;
    if (selected.risk === 'critical') baseScore += 25;
    if (selected.risk === 'high') baseScore += 15;
    return Math.min(baseScore + 15, 98);
  }, [selected]);

  return (
    <div style={{ padding: '28px', minHeight: '100vh' }}>
      
      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Network size={22} color="#a78bfa" />
          </div>
          <div>
            <h1 className="page-title" style={{ letterSpacing: '0.04em', fontSize: 24 }}>Criminal Network Intelligence</h1>
            <p className="page-subtitle">Interactive Suspect Relationship Mapping &amp; Link Analysis</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,240,255,0.1)',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#f1f5f9'
          }}>
            Suspects: <strong style={{ color: '#ef4444' }}>7</strong>
          </div>
          <div style={{
            background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,240,255,0.1)',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#f1f5f9'
          }}>
            Total Nodes: <strong style={{ color: '#00f0ff' }}>24</strong>
          </div>
          <div style={{
            background: 'rgba(10,22,40,0.85)', border: '1px solid rgba(0,240,255,0.1)',
            borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#f1f5f9'
          }}>
            Network Risk: <strong style={{ color: '#ef4444' }}>87/100</strong>
          </div>
        </div>
      </div>

      {/* ── FILTER CHIPS ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Entities' },
          { key: 'suspects', label: 'Suspects' },
          { key: 'victims', label: 'Victims' },
          { key: 'crimes', label: 'Crime Incidents' },
          { key: 'locations', label: 'Locations' },
          { key: 'vehicles', label: 'Vehicles' },
          { key: 'banks', label: 'Bank Accounts' },
          { key: 'mobiles', label: 'Mobile Numbers' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveFilter(tab.key); setSelected(null); }}
            className="cyber-btn"
            style={{
              padding: '6px 14px', fontSize: 11,
              background: activeFilter === tab.key ? 'rgba(0,240,255,0.15)' : 'rgba(10,22,40,0.8)',
              color: activeFilter === tab.key ? '#00f0ff' : '#94a3b8',
              border: activeFilter === tab.key ? '1px solid rgba(0,240,255,0.4)' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: activeFilter === tab.key ? '0 0 10px rgba(0,240,255,0.15)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── LAYOUT ── */}
      <div className="responsive-grid-1-340">

        {/* LEFT: CANVAS AREA */}
        <div>
          <div className="glass-card" style={{ height: '540px', position: 'relative', overflow: 'hidden', padding: 0 }}>
            {/* CANVAS OVERLAYS */}
            <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="status-dot" style={{ background: '#00f0ff', animation: 'pulse-cyan 1.5s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#00f0ff', letterSpacing: '0.08em' }}>FORCE-DIRECTED NETWORK GRAPH</span>
            </div>
            
            <button
              onClick={handleResetLayout}
              className="cyber-btn cyber-btn-cyan"
              style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, padding: '5px 12px', fontSize: 10 }}
            >
              <RefreshCw size={10} /> RESET PHYSICS
            </button>

            {/* CANVAS */}
            <canvas
              ref={canvasRef}
              style={{ background: '#020617', width: '100%', height: '100%', cursor: draggingRef.current ? 'grabbing' : 'grab' }}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            />

            {/* TOOLTIP */}
            {tooltip && (
              <div
                className="tooltip"
                style={{
                  position: 'absolute',
                  left: tooltip.x + 12,
                  top: tooltip.y - 12,
                  pointerEvents: 'none',
                  zIndex: 20,
                  transform: 'translateY(-100%)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontSize: 11 }}>{NODE_ICONS[tooltip.node.type]}</span>
                  <span style={{ color: NODE_COLORS[tooltip.node.type], fontWeight: 800, fontSize: 13 }}>{tooltip.node.label}</span>
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Type: <strong style={{ color: '#cbd5e1' }} className="capitalize">{tooltip.node.type}</strong></div>
                {tooltip.node.district && <div style={{ fontSize: 10, color: '#94a3b8' }}>District: <strong style={{ color: '#cbd5e1' }}>{tooltip.node.district}</strong></div>}
                {tooltip.node.risk && <div style={{ fontSize: 10, color: '#f87171' }}>Risk Level: <strong style={{ color: RISK_COLORS[tooltip.node.risk] }} className="uppercase">{tooltip.node.risk}</strong></div>}
              </div>
            )}

            {/* QUICK LEGEND */}
            <div style={{
              position: 'absolute', bottom: 12, left: 16, zIndex: 10,
              display: 'flex', gap: 14, background: 'rgba(2,6,23,0.85)', padding: '6px 14px',
              borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)'
            }}>
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 10 }}>{NODE_ICONS[type as NodeType]}</span>
                  <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'capitalize' }}>{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: INTELLIGENCE SIDEBAR */}
        <div>
          {selected && selectedDetails ? (
            /* Selected Node Intelligence View */
            <div className="glass-card animate-fadeInUp" style={{ padding: '20px', borderColor: NODE_COLORS[selected.type] }}>
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${NODE_COLORS[selected.type]}15`, border: `1px solid ${NODE_COLORS[selected.type]}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>
                  {NODE_ICONS[selected.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>{selectedDetails.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, color: NODE_COLORS[selected.type], textTransform: 'uppercase' }}>
                    {selectedDetails.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
                  }}
                >
                  <Minimize2 size={16} />
                </button>
              </div>

              {/* Badges / Risk Info */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {selected.risk && (
                  <span className={`badge ${selected.risk === 'critical' ? 'badge-red' : selected.risk === 'high' ? 'badge-amber' : 'badge-purple'}`}>
                    {selected.risk.toUpperCase()} RISK
                  </span>
                )}
                <span className="badge badge-gray" style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1' }}>
                  {selectedDetails.status}
                </span>
              </div>

              {/* Network influence score gauge */}
              <div style={{
                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 8, padding: '12px 14px', marginBottom: 14
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Network Influence Score</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#00f0ff' }}>{nodeInfluenceScore}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${nodeInfluenceScore}%`, height: '100%', background: '#00f0ff', borderRadius: 3 }} />
                </div>
              </div>

              {/* Node specific info fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {selected.district && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Geographic Base</div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <MapPin size={12} color="#64748b" /> {selected.district}
                    </div>
                  </div>
                )}
                
                {selectedDetails.age && selectedDetails.age > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Age</div>
                    <div style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600, marginTop: 2 }}>{selectedDetails.age} years</div>
                  </div>
                )}

                {selectedDetails.detail && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Operational Intel</div>
                    <p style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, marginTop: 2 }}>{selectedDetails.detail}</p>
                  </div>
                )}

                {/* Crime History */}
                {selectedDetails.crimeHistory && selectedDetails.crimeHistory.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 4 }}>Crime History</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {selectedDetails.crimeHistory.map((ch, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
                          <ShieldAlert size={12} color="#ef4444" />
                          <span>{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Crime Clusters */}
                {selectedDetails.linkedCrimes && selectedDetails.linkedCrimes.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 4 }}>Linked Cases</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {selectedDetails.linkedCrimes.map((lc, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#00f0ff' }}>
                          <AlertTriangle size={12} color="#00f0ff" />
                          <span style={{ fontWeight: 600 }}>{lc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Known Associates */}
                {selectedDetails.knownAssociates && selectedDetails.knownAssociates.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 4 }}>Known Associates</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {selectedDetails.knownAssociates.map((assoc, idx) => (
                        <span key={idx} className="badge badge-gray" style={{ fontSize: 10, background: 'rgba(255,255,255,0.06)' }}>{assoc}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>Investigation Status</div>
                  <span className="badge badge-amber" style={{ display: 'inline-block', marginTop: 4 }}>
                    {selectedDetails.investigationStatus}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingTop: 8 }}>
                <button className="cyber-btn cyber-btn-cyan" style={{ fontSize: 11, padding: '8px 10px', justifyContent: 'center' }}>
                  <Eye size={12} /> View Profile
                </button>
                <button className="cyber-btn cyber-btn-purple" style={{ fontSize: 11, padding: '8px 10px', justifyContent: 'center' }}>
                  <Users size={12} /> Flag Suspect
                </button>
              </div>

            </div>
          ) : (
            /* General Network Summary Side Panel */
            <div className="space-y-4">
              <div className="glass-card" style={{ padding: '20px' }}>
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <div className="section-header-line" />
                  <span className="section-title">Network Analysis Panel</span>
                </div>
                
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, marginBottom: 14 }}>
                  Click on any node in the graph to display complete security clearance, criminal records, and transaction links.
                </p>

                {/* Graph stats breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {[
                    { label: 'Wanted Suspects', value: '5', color: '#ef4444', icon: User },
                    { label: 'Connected Crimes', value: '5', color: '#f59e0b', icon: AlertTriangle },
                    { label: 'Witnesses & Victims', value: '3', color: '#10b981', icon: Users },
                    { label: 'Suspect Vehicles', value: '2', color: '#8b5cf6', icon: Truck },
                    { label: 'Flagged Mobile Lines', value: '2', color: '#00f0ff', icon: Phone },
                    { label: 'Frozen Accounts', value: '2', color: '#fbbf24', icon: DollarSign },
                  ].map((stat, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <stat.icon size={12} color={stat.color} />
                        <span style={{ fontSize: 12, color: '#cbd5e1' }}>{stat.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: stat.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Network Detection tools */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Sparkles size={14} color="#00f0ff" />
                  <span className="section-title" style={{ fontSize: 13 }}>AI Relationship Detectors</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  
                  {/* Organized Crime Cluster */}
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    padding: '10px 12px', borderRadius: 8,
                    background: detectOrganized ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${detectOrganized ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <input
                      type="checkbox"
                      checked={detectOrganized}
                      onChange={() => setDetectOrganized(!detectOrganized)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: detectOrganized ? '#ef4444' : '#f1f5f9' }}>
                        Organized Crime Clusters
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>Highlight major gang connections</div>
                    </div>
                  </label>

                  {/* Hidden Relationship Detection */}
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    padding: '10px 12px', borderRadius: 8,
                    background: detectHidden ? 'rgba(0,240,255,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${detectHidden ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <input
                      type="checkbox"
                      checked={detectHidden}
                      onChange={() => setDetectHidden(!detectHidden)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: detectHidden ? '#00f0ff' : '#f1f5f9' }}>
                        Hidden Relationship Engine
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>Reveal shared district linkages</div>
                    </div>
                  </label>

                  {/* Repeat Offender Detection */}
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    padding: '10px 12px', borderRadius: 8,
                    background: detectRepeat ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${detectRepeat ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <input
                      type="checkbox"
                      checked={detectRepeat}
                      onChange={() => setDetectRepeat(!detectRepeat)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: detectRepeat ? '#f59e0b' : '#f1f5f9' }}>
                        Repeat Offender Identifiers
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>Flag suspects with 5+ crimes</div>
                    </div>
                  </label>
                  
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
