'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, Search, Filter, ShieldAlert, Sparkles, MapPin, Clipboard, FileText, 
  RefreshCw, Plus, Minus, Camera, User, ExternalLink, X, HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import AIRecommendationCard from '@/components/AIRecommendationCard';
import * as d3 from 'd3';

// ─── Network Data Interfaces ──────────────────────────────────────────────────

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: 'Suspect' | 'Victim' | 'Location';
  rank: 'Kingpin' | 'Lieutenant' | 'Operative' | 'Associate' | 'None';
  district: string;
  category: string;
  threatScore: number;
  priorArrests: number;
  activeCases: number;
  networkSize: number;
  aiMatch: number;
  aiReason: string;
  status: 'Active' | 'Inactive';
  mo: string;
  timeline: { year: string; event: string }[];
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  type: 'Co-Accused' | 'Family' | 'Associate' | 'Same MO';
}

// ─── Datasets ─────────────────────────────────────────────────────────────────

const INITIAL_NODES: NetworkNode[] = [
  // Suspects
  { id: "1", name: "Raju Naik", type: "Suspect", rank: "Kingpin", district: "Kalaburagi", category: "Sand Mafia", threatScore: 95, priorArrests: 6, activeCases: 3, networkSize: 12, aiMatch: 94, aiReason: "Direct communication patterns and financial transaction overlap.", status: "Active", mo: "Bypasses state borders via unregistered tractors, bribing checkpost guards.", timeline: [{ year: "2024", event: "Arrested at Kalaburagi for illegal quarrying." }, { year: "2025", event: "Named prime suspect in extortion syndicate." }, { year: "2026", event: "Indicted for interstate sand smuggling." }] },
  { id: "2", name: "Venkat Reddy", type: "Suspect", rank: "Lieutenant", district: "Kalaburagi", category: "Sand Mafia", threatScore: 82, priorArrests: 4, activeCases: 2, networkSize: 8, aiMatch: 88, aiReason: "CCTV facial matching at NH-50 checkpoints with primary suspect.", status: "Active", mo: "Manages field operations and logistics coordination.", timeline: [{ year: "2024", event: "Detained for checkpost obstruction." }, { year: "2025", event: "Charged with illicit transport loading." }] },
  { id: "3", name: "Imran Khan", type: "Suspect", rank: "Operative", district: "Kalaburagi", category: "Sand Mafia", threatScore: 64, priorArrests: 2, activeCases: 1, networkSize: 4, aiMatch: 72, aiReason: "Identified loading sand trucks under direct orders of Venkat Reddy.", status: "Active", mo: "Truck fleet dispatching and driver intimidation.", timeline: [{ year: "2025", event: "Arrested for vehicle registration fraud." }] },
  { id: "4", name: "Suresh Patil", type: "Suspect", rank: "Associate", district: "Kalaburagi", category: "Sand Mafia", threatScore: 48, priorArrests: 1, activeCases: 1, networkSize: 2, aiMatch: 65, aiReason: "Associated vehicle registration records link directly to Raju Naik.", status: "Active", mo: "Provides legal coverage and bail finances for drivers.", timeline: [{ year: "2026", event: "Fined for facilitating suspect flight." }] },
  { id: "5", name: "Arjun Gowda", type: "Suspect", rank: "Kingpin", district: "Bengaluru Urban", category: "Cyber Fraud", threatScore: 89, priorArrests: 3, activeCases: 5, networkSize: 15, aiMatch: 91, aiReason: "Coordinates gateway servers used in statewide OTP phishing campaign.", status: "Active", mo: "Rents cloud VPS through stolen identity papers, routes calls.", timeline: [{ year: "2024", event: "Indicted in Bangalore Tech Park phishing scam." }, { year: "2026", event: "Acquired network center in Hubli." }] },
  { id: "6", name: "Meera Devi", type: "Suspect", rank: "Associate", district: "Bengaluru Urban", category: "Cyber Fraud", threatScore: 52, priorArrests: 0, activeCases: 1, networkSize: 3, aiMatch: 79, aiReason: "Bank accounts registered under name used as mule accounts.", status: "Active", mo: "Mule account generation and money withdrawal.", timeline: [{ year: "2025", event: "Warned for unusual bank transfers." }] },
  { id: "7", name: "Dawood S", type: "Suspect", rank: "Lieutenant", district: "Raichur", category: "Narcotics", threatScore: 86, priorArrests: 5, activeCases: 4, networkSize: 9, aiMatch: 89, aiReason: "Cross-border logistics logs overlap with prior NDPS seizures.", status: "Active", mo: "Smuggles contraband across borders hidden in agricultural yields.", timeline: [{ year: "2024", event: "Detained at state border checkpost." }] },
  { id: "8", name: "Kiran Kumar", type: "Suspect", rank: "Operative", district: "Mysuru", category: "Vehicle Theft", threatScore: 71, priorArrests: 3, activeCases: 2, networkSize: 5, aiMatch: 92, aiReason: "RF sniffer fob triggers match relay attack signatures in database.", status: "Active", mo: "Uses high-tech relay tools to unlock smart vehicles.", timeline: [{ year: "2025", event: "Arrested in car theft ring sweep." }] },
  
  // Victims
  { id: "V1", name: "K. S. Narayanan", type: "Victim", rank: "None", district: "Kalaburagi", category: "Sand Mafia", threatScore: 0, priorArrests: 0, activeCases: 0, networkSize: 0, aiMatch: 100, aiReason: "Landowner who refused extraction access on riverside estate.", status: "Active", mo: "", timeline: [] },
  { id: "V2", name: "Pooja Hegde", type: "Victim", rank: "None", district: "Bengaluru Urban", category: "Cyber Fraud", threatScore: 0, priorArrests: 0, activeCases: 0, networkSize: 0, aiMatch: 100, aiReason: "Phishing victim defrauded of ₹8.4 Lakhs via OTP spoofing.", status: "Active", mo: "", timeline: [] },
  
  // Locations
  { id: "L1", name: "NH-50 Sand Quarry", type: "Location", rank: "None", district: "Kalaburagi", category: "Sand Mafia", threatScore: 0, priorArrests: 0, activeCases: 0, networkSize: 0, aiMatch: 100, aiReason: "Primary illicit loading and extraction point.", status: "Active", mo: "", timeline: [] },
  { id: "L2", name: "Bengaluru Tech Hub", type: "Location", rank: "None", district: "Bengaluru Urban", category: "Cyber Fraud", threatScore: 0, priorArrests: 0, activeCases: 0, networkSize: 0, aiMatch: 100, aiReason: "Server hosting and IP relay operations center.", status: "Active", mo: "", timeline: [] }
];

const INITIAL_LINKS: NetworkLink[] = [
  { source: "1", target: "2", type: "Co-Accused" },
  { source: "2", target: "3", type: "Co-Accused" },
  { source: "1", target: "4", type: "Associate" },
  { source: "1", target: "V1", type: "Co-Accused" },
  { source: "2", target: "L1", type: "Same MO" },
  { source: "3", target: "L1", type: "Same MO" },
  { source: "5", target: "V2", type: "Same MO" },
  { source: "5", target: "L2", type: "Same MO" },
  { source: "2", target: "4", type: "Family" },
  { source: "7", target: "1", type: "Associate" },
  { source: "8", target: "1", type: "Associate" },
  { source: "7", target: "2", type: "Associate" }
];

const DISTRICTS = ["All Districts", "Kalaburagi", "Bengaluru Urban", "Raichur", "Mysuru"];
const CATEGORIES = ["All Categories", "Sand Mafia", "Cyber Fraud", "Narcotics", "Vehicle Theft"];
const THREAT_LEVELS = ["All Threat Levels", "Critical (80+)", "High (60-80)", "Medium (40-60)"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CriminalNetworkPage() {
  const { t, lang } = useLanguage();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedThreatLevel, setSelectedThreatLevel] = useState("All Threat Levels");
  const [statusActiveOnly, setStatusActiveOnly] = useState(true);
  const [activeRelations, setActiveRelations] = useState<string[]>(['Co-Accused', 'Family', 'Associate', 'Same MO']);

  // Selected Node
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("1");

  // D3 References
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<any>(null);

  // Filter lists
  const filteredNodes = INITIAL_NODES.filter(node => {
    // 1. Search Query
    if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // 2. Category
    if (selectedCategory !== "All Categories" && node.category !== selectedCategory) {
      return false;
    }
    // 3. District
    if (selectedDistrict !== "All Districts" && node.district !== selectedDistrict) {
      return false;
    }
    // 4. Threat Level
    if (selectedThreatLevel !== "All Threat Levels") {
      if (selectedThreatLevel.startsWith("Critical") && node.threatScore < 80) return false;
      if (selectedThreatLevel.startsWith("High") && (node.threatScore < 60 || node.threatScore >= 80)) return false;
      if (selectedThreatLevel.startsWith("Medium") && (node.threatScore < 40 || node.threatScore >= 60)) return false;
    }
    // 5. Status
    if (statusActiveOnly && node.status !== 'Active') {
      return false;
    }
    return true;
  });

  // Filter links where both source and target nodes exist in the filtered list
  const filteredLinks = INITIAL_LINKS.filter(link => {
    const srcId = typeof link.source === 'object' ? link.source.id : link.source;
    const tgtId = typeof link.target === 'object' ? link.target.id : link.target;
    // Check relationship type filter
    if (!activeRelations.includes(link.type)) {
      return false;
    }
    return filteredNodes.some(n => n.id === srcId) && filteredNodes.some(n => n.id === tgtId);
  });

  const activeNode = INITIAL_NODES.find(n => n.id === selectedNodeId) || null;

  // D3 force simulation binder
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;

    // Outer Container Group (Zoom target)
    const g = svg.append("g");

    // Initialize zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    zoomRef.current = { zoom, svg, g };

    // Deep clone nodes and links to prevent mutating state coordinates
    const nodesData = filteredNodes.map(n => ({ ...n }));
    const linksData = filteredLinks.map(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      return { source: srcId, target: tgtId, type: l.type };
    });

    // Create D3 Force Simulation
    const simulation = d3.forceSimulation<NetworkNode>(nodesData)
      .force("link", d3.forceLink<NetworkNode, any>(linksData).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Render Edges (Links)
    const link = g.append("g")
      .attr("stroke-linecap", "round")
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("stroke", d => {
        if (d.type === 'Co-Accused') return 'var(--color-navy)';
        if (d.type === 'Family') return 'var(--color-orange)';
        if (d.type === 'Associate') return 'var(--color-green)';
        return 'var(--color-red)'; // Same MO
      })
      .attr("stroke-width", d => d.type === 'Co-Accused' ? 2.5 : d.type === 'Family' ? 2.0 : 1.5)
      .attr("stroke-dasharray", d => d.type === 'Family' ? '4 4' : 'none');

    const highlightedNodeIds = new Set<string>();
    const highlightedLinkKeys = new Set<string>();

    if (selectedNodeId) {
      highlightedNodeIds.add(selectedNodeId);
      linksData.forEach(l => {
        const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
        if (srcId === selectedNodeId) {
          highlightedNodeIds.add(tgtId);
          highlightedLinkKeys.add(`${srcId}-${tgtId}`);
        } else if (tgtId === selectedNodeId) {
          highlightedNodeIds.add(srcId);
          highlightedLinkKeys.add(`${srcId}-${tgtId}`);
        }
      });
    }

    // Apply link highlighting opacity
    link
      .attr("stroke-opacity", l => {
        if (!selectedNodeId) return 0.6;
        const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return highlightedLinkKeys.has(`${srcId}-${tgtId}`) ? 1.0 : 0.1;
      });

    // Render Nodes Group
    const node = g.append("g")
      .selectAll("g")
      .data(nodesData)
      .join("g")
      .style("cursor", "pointer")
      .style("opacity", d => {
        if (!selectedNodeId) return 1.0;
        return highlightedNodeIds.has(d.id) ? 1.0 : 0.15;
      })
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      )
      .on("click", (event, d) => {
        setSelectedNodeId(d.id);
      });

    // Nodes shapes - Suspects: Circles
    node.filter(d => d.type === 'Suspect')
      .append("circle")
      .attr("r", d => d.rank === 'Kingpin' ? 22 : d.rank === 'Lieutenant' ? 17 : d.rank === 'Operative' ? 13 : 10)
      .attr("fill", d => d.rank === 'Kingpin' ? 'var(--color-red)' : d.rank === 'Lieutenant' ? 'var(--color-orange)' : d.rank === 'Operative' ? '#1A6FFF' : '#6B8CAE')
      .attr("stroke", d => selectedNodeId === d.id ? '#00D4FF' : '#020617')
      .attr("stroke-width", d => selectedNodeId === d.id ? 3 : 1.5)
      .style("filter", d => d.rank === 'Kingpin' ? 'drop-shadow(0 0 8px rgba(220,38,38,0.75))' : d.rank === 'Lieutenant' ? 'drop-shadow(0 0 5px rgba(245,158,11,0.5))' : 'none');

    // Nodes shapes - Locations: Squares (rect)
    node.filter(d => d.type === 'Location')
      .append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .attr("x", -15)
      .attr("y", -15)
      .attr("rx", 4)
      .attr("fill", 'var(--color-gold)')
      .attr("stroke", d => selectedNodeId === d.id ? '#00D4FF' : '#020617')
      .attr("stroke-width", d => selectedNodeId === d.id ? 3 : 1.5);

    // Nodes shapes - Victims: Triangles (polygon)
    node.filter(d => d.type === 'Victim')
      .append("polygon")
      .attr("points", "0,-16 14,11 -14,11")
      .attr("fill", 'var(--color-green)')
      .attr("stroke", d => selectedNodeId === d.id ? '#00D4FF' : '#020617')
      .attr("stroke-width", d => selectedNodeId === d.id ? 3 : 1.5);

    // Mini icon/symbol in center of suspects
    node.filter(d => d.type === 'Suspect')
      .append("circle")
      .attr("r", 4)
      .attr("fill", "#ffffff")
      .attr("opacity", 0.4);

    // Node Name text labels
    node.append("text")
      .attr("y", d => d.rank === 'Kingpin' ? 32 : d.rank === 'Lieutenant' ? 26 : 22)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("font-family", "Space Grotesk, sans-serif")
      .text(d => d.name)
      .style("text-shadow", "0 1px 3px rgba(0,0,0,0.9)");

    // Simulation ticker
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, selectedNodeId]);

  // Zoom Operations
  const handleZoom = (factor: number) => {
    if (!zoomRef.current) return;
    const { zoom, svg } = zoomRef.current;
    svg.transition().duration(250).call(zoom.scaleBy, factor);
  };

  const handleZoomReset = () => {
    if (!zoomRef.current) return;
    const { zoom, svg } = zoomRef.current;
    svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
  };

  const handleScreenshot = () => {
    alert("Dossier Snapshot exported to Secure Vault under logs #NET-2026.");
  };

  // Helper to fetch relationships for dossier
  const getConnections = (nodeId: string) => {
    const incoming = INITIAL_LINKS.filter(l => l.target === nodeId || (typeof l.target === 'object' && l.target.id === nodeId));
    const outgoing = INITIAL_LINKS.filter(l => l.source === nodeId || (typeof l.source === 'object' && l.source.id === nodeId));

    const connections: { type: string; name: string }[] = [];
    
    incoming.forEach(l => {
      const srcId = typeof l.source === 'object' ? l.source.id : l.source;
      const matchedNode = INITIAL_NODES.find(n => n.id === srcId);
      if (matchedNode) {
        connections.push({ type: l.type === 'Co-Accused' ? 'Co-Accused' : l.type === 'Family' ? 'Family Member' : l.type === 'Same MO' ? 'Shares MO' : 'Associate', name: matchedNode.name });
      }
    });

    outgoing.forEach(l => {
      const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
      const matchedNode = INITIAL_NODES.find(n => n.id === tgtId);
      if (matchedNode) {
        connections.push({ type: l.type === 'Co-Accused' ? 'Co-Accused' : l.type === 'Family' ? 'Family Member' : l.type === 'Same MO' ? 'Shares MO' : 'Associate', name: matchedNode.name });
      }
    });

    return connections;
  };

  return (
    <div className="animate-page-fade" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      
      {/* Simulation Banner */}
      <SimulationBanner />

      {/* Main Grid: Left Filters + Center D3 SVG Canvas + Right Dossier */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 300px', gap: '20px', alignItems: 'stretch' }}>
        
        {/* LEFT PANEL: Filters */}
        <aside
          className="glass-card flex flex-col justify-between"
          style={{
            padding: '20px 16px',
            background: 'var(--cyber-surface)',
            height: '600px',
            overflowY: 'auto',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid var(--cyber-border)', paddingBottom: '8px' }}>
              {lang === 'en' ? 'NETWORK CONTROLS' : 'ನೆಟ್‌ವರ್ಕ್ ಫಿಲ್ಟರ್‌ಗಳು'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Search Suspect */}
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                  Search Suspect
                </label>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Enter name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
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
              </div>

              {/* Crime Category */}
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
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* District */}
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
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                >
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Threat Level */}
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px', textTransform: 'uppercase' }}>
                  Threat Level
                </label>
                <select
                  value={selectedThreatLevel}
                  onChange={e => setSelectedThreatLevel(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--cyber-bg)',
                    border: '1px solid var(--cyber-border)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                >
                  {THREAT_LEVELS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Active Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active Network Only</span>
                <input
                  type="checkbox"
                  checked={statusActiveOnly}
                  onChange={e => setStatusActiveOnly(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--cyber-cyan)' }}
                />
              </div>

            </div>
          </div>

          {/* Network Stats at bottom of sidebar */}
          <div style={{ borderTop: '1px dashed var(--cyber-border)', paddingTop: '16px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              NETWORK METRICS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Suspects:</span> <strong style={{ color: 'var(--text-primary)' }}>{filteredNodes.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Active Connections:</span> <strong style={{ color: 'var(--cyber-cyan)' }}>{filteredLinks.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>High Threat Nodes:</span> <strong style={{ color: '#ef4444' }}>{filteredNodes.filter(n => n.threatScore >= 80).length}</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER VIEWPORT: D3 Network Canvas */}
        <main className="glass-card relative" style={{ background: '#020617', padding: 0, height: '600px', overflow: 'hidden' }}>
          
          {/* Edge Color Legend Top-Left */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 10, background: '#FFFFFF', border: '1px solid var(--cyber-border)', borderRadius: '8px', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '9px', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Relationship Map</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--color-navy)' }}>
              <div style={{ width: '12px', height: '3px', background: 'var(--color-navy)' }} /> CO-ACCUSED
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--color-orange)' }}>
              <div style={{ width: '12px', height: '3.5px', borderBottom: '2.5px dashed var(--color-orange)' }} /> FAMILY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--color-green)' }}>
              <div style={{ width: '12px', height: '1.5px', background: 'var(--color-green)' }} /> ASSOCIATE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--color-red)' }}>
              <div style={{ width: '12px', height: '1.5px', background: 'var(--color-red)' }} /> SAME MO
            </div>
          </div>

          {/* Relationship Filter Chips Row */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Relationship Filter:</span>
            {[
              { type: 'Co-Accused', color: 'var(--color-navy)' },
              { type: 'Family', color: 'var(--color-orange)' },
              { type: 'Associate', color: 'var(--color-green)' },
              { type: 'Same MO', color: 'var(--color-red)' }
            ].map(chip => {
              const isActive = activeRelations.includes(chip.type);
              return (
                <button
                  key={chip.type}
                  onClick={() => {
                    setActiveRelations(prev => 
                      prev.includes(chip.type) 
                        ? prev.filter(t => t !== chip.type) 
                        : [...prev, chip.type]
                    );
                  }}
                  className="text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer transition-all border"
                  style={{
                    background: isActive ? chip.color : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    borderColor: isActive ? chip.color : '#E5E7EB',
                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {chip.type}
                </button>
              );
            })}
          </div>

          {/* D3 Canvas Element */}
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 800 500"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Graph Zoom Controls Floating Bottom-Right */}
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', zIndex: 10, display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleZoom(1.2)}
              className="cyber-btn"
              style={{ padding: '6px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)' }}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => handleZoom(0.8)}
              className="cyber-btn"
              style={{ padding: '6px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)' }}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={handleZoomReset}
              className="cyber-btn"
              style={{ padding: '6px 10px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 800 }}
            >
              ⟳ Reset
            </button>
            <button
              onClick={handleScreenshot}
              className="cyber-btn cyber-btn-cyan"
              style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}
            >
              <Camera size={12} /> Snapshot
            </button>
          </div>
        </main>

        {/* RIGHT PANEL: Slide-in Suspect Dossier Card */}
        {activeNode ? (
          <aside
            className="glass-card flex flex-col justify-between animate-fadeInRight"
            style={{
              padding: '20px 16px',
              background: 'var(--cyber-surface)',
              borderLeft: '2.5px solid var(--cyber-cyan)',
              height: '600px',
              overflowY: 'auto',
            }}
          >
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                    {activeNode.name.toUpperCase()}
                  </h2>
                  <div style={{ fontSize: '11px', color: 'var(--cyber-cyan)', fontWeight: 700, marginTop: '2px' }}>
                    {activeNode.rank.toUpperCase()} · {activeNode.category}
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedNodeId(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Threat Score slider */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  <span>Threat Index Rating:</span>
                  <span style={{ fontWeight: 800, color: '#ef4444' }}>{activeNode.threatScore}/100</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${activeNode.threatScore}%`, background: '#ef4444' }} />
                </div>
              </div>

              {/* Dossier Stats lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Location District:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeNode.district}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Prior Arrest Records:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeNode.priorArrests} arrests</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Active Charges:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeNode.activeCases} open files</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Network Influence:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{activeNode.networkSize} affiliates</strong>
                </div>
              </div>

              {/* AI Confidence match details */}
              <div style={{ background: 'rgba(30, 58, 95, 0.02)', border: '1px solid rgba(30, 58, 95, 0.15)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--cyber-cyan)', fontWeight: 800, marginBottom: '6px' }}>
                  <span>AI CONFIDENCE MATCH:</span>
                  <span>{activeNode.aiMatch}%</span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activeNode.aiReason}
                </p>
              </div>

              {/* Connections relationships lists */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  DIRECT CONNECTIONS
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {getConnections(activeNode.id).map((conn, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--cyber-border)', padding: '5px 8px', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--text-dim)' }}>{conn.type}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{conn.name}</strong>
                    </div>
                  ))}
                  {getConnections(activeNode.id).length === 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>No connections logged in sub-graph.</div>
                  )}
                </div>
              </div>

              {/* Modus Operandi (MO) Summary Section */}
              {activeNode.mo && (
                <div style={{ marginBottom: '18px', borderTop: '1px solid #E5E7EB', paddingTop: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    MODUS OPERANDI (MO)
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5, fontStyle: 'italic' }}>
                    &ldquo;{activeNode.mo}&rdquo;
                  </p>
                </div>
              )}

              {/* Incident Timeline Section */}
              {activeNode.timeline && activeNode.timeline.length > 0 && (
                <div style={{ marginBottom: '18px', borderTop: '1px solid #E5E7EB', paddingTop: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    INCIDENT TIMELINE
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1.5px solid var(--border-default)', paddingLeft: '12px', marginLeft: '6px' }}>
                    {activeNode.timeline.map((event, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          left: '-17px',
                          top: '3px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--color-navy)',
                          border: '1.5px solid #FFFFFF',
                        }} />
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-navy)' }}>{event.year}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{event.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Directive actions */}
            <div style={{ marginTop: '16px' }}>
              <AIRecommendationCard
                action={`Flag ${activeNode.name} for Interdiction`}
                rationale={`Suspect coordinates show 92% similarity with active mobile phone towers at the intercept checkpost.`}
                urgency={activeNode.threatScore >= 80 ? 'CRITICAL' : 'HIGH'}
                priority={1}
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                <button
                  onClick={() => alert(`Opening comprehensive Intelligence Dossier for ${activeNode.name}`)}
                  className="cyber-btn"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '11px', fontWeight: 800, borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--cyber-border)', color: 'var(--text-primary)', textTransform: 'none' }}
                >
                  View Full Profile
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => alert(`${activeNode.name} flagged as Priority Target.`)}
                    className="cyber-btn cyber-btn-red"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '11px', fontWeight: 800, borderRadius: '6px', textTransform: 'none' }}
                  >
                    Flag Priority
                  </button>
                  <button
                    onClick={() => alert(`Exported Node Dossier for ${activeNode.name} as text.`)}
                    className="cyber-btn cyber-btn-cyan"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '11px', fontWeight: 800, borderRadius: '6px', textTransform: 'none' }}
                  >
                    Export Intel
                  </button>
                </div>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="glass-card flex items-center justify-center text-center p-6" style={{ height: '600px', color: 'var(--text-dim)', fontSize: '12px' }}>
            <div>
              <Users size={32} style={{ margin: '0 auto 12px', color: 'var(--cyber-cyan)' }} />
              Click any suspect node on the graph to slide in their intelligence dossier profiling.
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
