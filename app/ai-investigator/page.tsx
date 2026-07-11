'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/ai-investigator/page.tsx — AI Investigative Copilot Workspace (Palantir Gotham Style)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback, Suspense, useMemo } from 'react';
import { 
  Brain, Send, Mic, MicOff, Search, FileText, Plus, ShieldAlert, Sparkles, User, MapPin, 
  Clock, CheckCircle, RefreshCw, ChevronRight, AlertTriangle, HelpCircle, Eye, Clipboard, Share2, Zap, X,
  Map, GitMerge, List, Calendar, Download, Printer, Percent, Play, Pause, ChevronDown, Lock, Landmark, Phone
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { useSearchParams } from 'next/navigation';
import CountUp from '@/components/CountUp';
import SimulationBanner from '@/components/SimulationBanner';
import { DISTRICTS } from '@/lib/crimeData';
import { generateText } from '@/lib/aiService';

// ── TYPES & SCHEMAS ──────────────────────────────────────────────────────────
interface SuspectNode {
  id: string;
  label: string;
  role: string;
  type: string;
  details: {
    history: string;
    firs: string;
    assets: string;
    vehicles: string;
    associates: string;
  };
}

interface SuspectEdge {
  from: string;
  to: string;
  rel: string;
  freq: string;
  conf: string;
  lastContact: string;
}

interface MapPoint {
  id: string;
  type: string;
  label: string;
  coords: [number, number]; // Percentages for custom SVG tactical map grid
  desc: string;
}

interface TimelineItem {
  time: string;
  event: string;
  type: 'evidence' | 'call' | 'vehicle' | 'money' | 'witness';
  desc: string;
}

interface OperationalStep {
  action: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Routine';
  status: string;
  icon: string;
}

interface CaseData {
  firNumber: string;
  suspectName: string;
  district: string;
  category: string;
  date: string;
  severity: number;
  officer: string;
  confidence: number;
  missingEvidence: string[];
  evidenceSummary: string[];
  suspectNetwork: {
    nodes: SuspectNode[];
    edges: SuspectEdge[];
  };
  mapPoints: MapPoint[];
  route: Array<[number, number]>; // coordinates for the tracker route
  timeline: TimelineItem[];
  riskScore: number;
  riskBreakdown: {
    evidenceStrength: number;
    networkInfluence: number;
    criminalHistory: number;
    financialSuspicion: number;
    locationMatch: number;
    repeatOffense: number;
  };
  operationalSteps: OperationalStep[];
  escapeRisk: 'High' | 'Medium' | 'Low';
  report: {
    executiveSummary: string;
    caseOverview: string;
    findings: string;
    legalSections: string;
    pendingTasks: string;
    officerNotes: string;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  timestamp: string;
  caseRef?: string;
  widgetType?: 'risk' | 'network' | 'map' | 'timeline' | 'report' | 'actions';
}

// ── CASE INTELLIGENCE DATABASE ────────────────────────────────────────────────
const CASES_DATABASE: Record<string, CaseData> = {
  "FIR/2026/BLR/101": {
    firNumber: "FIR/2026/BLR/101",
    suspectName: "Raju Naik",
    district: "Kalaburagi",
    category: "Sand Mining",
    date: "21 Jun 2026",
    severity: 91,
    officer: "PI Ravi Shankar",
    confidence: 92,
    missingEvidence: [
      "DNA report pending from forensic lab.",
      "CCTV footage from regional toll gates under verification."
    ],
    evidenceSummary: [
      "Truck KA-32-E-4512 ownership matches registered vehicle at illicit mining site.",
      "Mobile tower connection logs place suspect at Kalaburagi quarry at 09:25 AM.",
      "Bank transactions show ₹4.5L transfer to mining syndicate contractor.",
      "Witness statement from local watchman confirms Raju Naik's presence."
    ],
    suspectNetwork: {
      nodes: [
        { id: "raju", label: "Raju Naik", role: "Primary Suspect", type: "suspect", details: { history: "2 prior arrests for illegal mining, 1 pending charge.", firs: "FIR/2026/BLR/101, FIR/2024/KLB/88", assets: "₹18L bank deposits, 2 quarry trucks", vehicles: "KA-32-E-4512 (Truck), KA-32-M-8890 (SUV)", associates: "Venkat Reddy, Suresh Patil" } },
        { id: "venkat", label: "Venkat Reddy", role: "Syndicate Contractor", type: "contractor", details: { history: "Under investigation for land fraud and riverbed extraction leases.", firs: "FIR/2025/KLB/14", assets: "Quarry leasehold rights, ₹85L bank accounts", vehicles: "KA-32-P-0012 (Luxury SUV)", associates: "Raju Naik" } },
        { id: "dawood", label: "Dawood S", role: "Explosives Supplier", type: "supplier", details: { history: "Prior charges for unauthorized commercial blasting supply.", firs: "FIR/2023/MNG/09", assets: "Explosives supply warehouse, 1 transport van", vehicles: "KA-19-F-9900 (Van)", associates: "Raju Naik" } },
        { id: "suresh", label: "Suresh Patil", role: "Financial Broker", type: "broker", details: { history: "No active criminal record. Suspected of being a shell company broker.", firs: "None", assets: "Real estate broker agency, ₹1.2Cr property portfolio", vehicles: "KA-32-A-5678 (Sedan)", associates: "Raju Naik" } }
      ],
      edges: [
        { from: "raju", to: "venkat", rel: "Contractor Link", freq: "Daily", conf: "95%", lastContact: "Today 09:43 AM" },
        { from: "raju", to: "dawood", rel: "Vehicle & Supplies Link", freq: "Weekly", conf: "88%", lastContact: "Yesterday 04:15 PM" },
        { from: "raju", to: "suresh", rel: "Money Trail", freq: "Bi-weekly", conf: "92%", lastContact: "3 days ago" }
      ]
    },
    mapPoints: [
      { id: "scene", type: "crime_scene", label: "Quarry Mining Site", coords: [50, 35], desc: "Illicit river sand mining extraction site." },
      { id: "residence", type: "residence", label: "Raju Naik Primary Residence", coords: [25, 75], desc: "Suspect primary registered address." },
      { id: "tower", type: "tower", label: "Mobile Tower 14", coords: [58, 45], desc: "Tower connected to Raju phone at 09:25 AM." },
      { id: "bank", type: "bank", label: "Karnataka Bank Center", coords: [35, 60], desc: "Branch where ₹4.5L contractor transaction occurred." },
      { id: "cctv", type: "cctv", label: "Highway Toll CCTV", coords: [75, 40], desc: "CCTV captured suspect truck exiting at 10:18 AM." },
      { id: "police", type: "police", label: "Kalaburagi Rural PS", coords: [20, 20], desc: "Intercept squad dispatch base." }
    ],
    route: [[25, 75], [35, 60], [50, 35], [58, 45], [75, 40], [20, 20]],
    timeline: [
      { time: "09:12 AM", event: "Truck enters quarry", type: "vehicle", desc: "Truck KA-32-E-4512 enters riverbed quarry area." },
      { time: "09:25 AM", event: "Phone connected to Tower 14", type: "call", desc: "Suspect mobile connected to Tower 14 near quarry." },
      { time: "09:43 AM", event: "Illegal transaction detected", type: "money", desc: "Bank transfer of ₹4.5L completed to Contractor Venkat Reddy." },
      { time: "10:05 AM", event: "Witness observes suspect", type: "witness", desc: "Local quarry watchman witnesses suspect giving loading instructions." },
      { time: "10:18 AM", event: "Vehicle exits highway", type: "vehicle", desc: "Suspect truck exits quarry via Highway Toll CCTV." },
      { time: "11:02 AM", event: "Police intercept vehicle", type: "evidence", desc: "Police intercept unit detains truck at checkpost." }
    ],
    riskScore: 91,
    riskBreakdown: {
      evidenceStrength: 95,
      networkInfluence: 86,
      criminalHistory: 90,
      financialSuspicion: 84,
      locationMatch: 92,
      repeatOffense: 89
    },
    operationalSteps: [
      { action: "Issue Lookout Notice", priority: "Immediate", status: "Pending", icon: "AlertTriangle" },
      { action: "Freeze Bank Accounts", priority: "Immediate", status: "In Progress", icon: "Lock" },
      { action: "Deploy Highway Patrol", priority: "High", status: "Active", icon: "Shield" },
      { action: "Monitor Phone Activity", priority: "High", status: "Underway", icon: "Mic" },
      { action: "Search Warehouse", priority: "Medium", status: "Approved", icon: "Search" },
      { action: "Question Associate", priority: "Medium", status: "Scheduled", icon: "User" }
    ],
    escapeRisk: "High",
    report: {
      executiveSummary: "This dossier details an ongoing investigation into a highly structured illegal sand mining syndicate operating along the riverbeds of Kalaburagi. Primary suspect Raju Naik coordinates regional extractions using leased trucks, backed by local contractor and broker shell accounts.",
      caseOverview: "Initial complaint filed by mining officials led to geolocation tracking, vehicle monitoring, and financial auditing of suspected shell accounts. Substantial evidence confirms unlawful extraction and transport of public property.",
      findings: "GPS and mobile tower records place primary suspects at the extraction quarry during operational hours. Financial audits confirmed immediate transfers correlating to sand loading schedules, backed by witness statements.",
      legalSections: "Under investigation for violation of Section 379 IPC (Theft), Section 4 of MMRD Act (Mines & Minerals Regulation Act), and Section 21 of Karnataka Sand Policy Rules.",
      pendingTasks: "Obtain certified banking transaction reports, record final statements from the checkpoint intercept crew, and retrieve CCTV DVR logs from NH-50 tollgate.",
      officerNotes: "Subject shows high risk of escape. Immediate lookout notices and banking freezes are advised before subject relocates assets."
    }
  },
  "FIR/2026/BLR/102": {
    firNumber: "FIR/2026/BLR/102",
    suspectName: "Arjun Gowda",
    district: "Bengaluru Urban",
    category: "Cyber Fraud",
    date: "20 Jun 2026",
    severity: 74,
    officer: "Insp Anil K",
    confidence: 88,
    missingEvidence: [
      "ISP subscriber log subpoena under review.",
      "Hard disk forensic image decryption ongoing."
    ],
    evidenceSummary: [
      "Phishing site server hosted on domestic IP blocks registered under suspect alias.",
      "23 separate transactions routed to suspect shell company bank accounts.",
      "SMS gateway records confirm 1,400 OTP intercept messages dispatched via suspect SIM card array."
    ],
    suspectNetwork: {
      nodes: [
        { id: "arjun", label: "Arjun Gowda", role: "Primary Suspect", type: "suspect", details: { history: "Charged with online banking fraud in 2024 (acquitted).", firs: "FIR/2026/BLR/102, FIR/2024/BLR/45", assets: "Crypto wallet (₹42L), laptop rig", vehicles: "KA-03-MJ-1002 (Sedan)", associates: "Vikram Shah, Sameer A" } },
        { id: "vikram", label: "Vikram Shah", role: "Dark Web Developer", type: "contractor", details: { history: "Prior cases of hosting fraud and malware development.", firs: "FIR/2025/MNG/112", assets: "Web hosting reseller portal", vehicles: "None", associates: "Arjun Gowda" } },
        { id: "sameer", label: "Sameer A", role: "SIM Card Vendor", type: "supplier", details: { history: "No active record. Suspected of activating unregistered SIM cards.", firs: "None", assets: "Telecom retail outlet stocks", vehicles: "KA-03-B-5544 (Scooter)", associates: "Arjun Gowda" } }
      ],
      edges: [
        { from: "arjun", to: "vikram", rel: "Malware Supplier", freq: "Daily", conf: "97%", lastContact: "Today 11:15 AM" },
        { from: "arjun", to: "sameer", rel: "SIM Provider", freq: "Weekly", conf: "90%", lastContact: "Yesterday 08:30 PM" }
      ]
    },
    mapPoints: [
      { id: "scene", type: "crime_scene", label: "Uplink Server IP", coords: [55, 60], desc: "Spoofed banking portal web hosting node." },
      { id: "residence", type: "residence", label: "Indiranagar Apartment", coords: [65, 45], desc: "Suspect residential apartment." },
      { id: "tower", type: "tower", label: "Indiranagar Tower 4", coords: [66, 44], desc: "Tower routing suspect connection sessions." },
      { id: "bank", type: "bank", label: "MG Road Axis Branch", coords: [60, 48], desc: "Receiving account branch for fake investment funds." },
      { id: "cctv", type: "cctv", label: "Coworking Lobby CCTV", coords: [62, 50], desc: "Captured suspect accessing router cabinet." },
      { id: "police", type: "police", label: "Cyber Crime Cell HQ", coords: [58, 42], desc: "Investigating cyber division." }
    ],
    route: [[65, 45], [66, 44], [62, 50], [60, 48], [55, 60], [58, 42]],
    timeline: [
      { time: "08:30 AM", event: "Suspect parks near coworking space", type: "vehicle", desc: "Suspect vehicle KA-03-MJ-1002 parked near coworking space." },
      { time: "09:02 AM", event: "SMS gateway routing starts", type: "evidence", desc: "SMS gateway begins routing spoofed OTP text alerts." },
      { time: "10:15 AM", event: "Hosting connection session", type: "call", desc: "Arjun Gowda connects to hosting console using residential IP." },
      { time: "11:45 AM", event: "Fraudulent funds transfer", type: "money", desc: "Shell company bank account receives ₹12.4L in fraudulent transfers." },
      { time: "12:30 PM", event: "Coworking manager statement", type: "witness", desc: "Coworking manager confirms Arjun rented secure private booth." },
      { time: "02:15 PM", event: "Domain seized by Cyber Cell", type: "evidence", desc: "Cyber police freeze domains and intercept suspect device logs." }
    ],
    riskScore: 74,
    riskBreakdown: {
      evidenceStrength: 85,
      networkInfluence: 72,
      criminalHistory: 60,
      financialSuspicion: 95,
      locationMatch: 80,
      repeatOffense: 75
    },
    operationalSteps: [
      { action: "Freeze Bank Accounts", priority: "Immediate", status: "In Progress", icon: "Lock" },
      { action: "Seize Electronic Devices", priority: "Immediate", status: "Pending", icon: "FileText" },
      { action: "Question SIM Vendor", priority: "High", status: "Scheduled", icon: "User" },
      { action: "Monitor Crypto Wallet", priority: "Medium", status: "Active", icon: "Search" }
    ],
    escapeRisk: "Medium",
    report: {
      executiveSummary: "Investigation into structured phishing and investment fraud targeting citizens. The suspect Arjun Gowda utilized domestic IP routing and fake shell bank entities to siphon and laundered over ₹50L.",
      caseOverview: "Dozens of phishing complaints converged on identical server subnets, which were subsequently geolocated to cowriter sessions linked directly to Arjun's registered credentials.",
      findings: "SMS gateway logs reveal automated dispatch of fake banking alerts, paired with immediate fund outflows to digital escrow accounts under tracking.",
      legalSections: "Under investigation for violation of Section 66D IT Act (Cheating by personation using computer resource) and Section 420 IPC (Cheating).",
      pendingTasks: "Subpoena coworking server system logs and obtain physical custody of the gateway router.",
      officerNotes: "Subject exhibits high technical literacy. Device encryption keys must be secured immediately upon detention."
    }
  },
  "FIR/2026/MYS/201": {
    firNumber: "FIR/2026/MYS/201",
    suspectName: "Kiran Kumar",
    district: "Mysuru",
    category: "Vehicle Theft",
    date: "19 Jun 2026",
    severity: 42,
    officer: "PI Mahesh Kumar",
    confidence: 85,
    missingEvidence: [
      "Chassis identification verification pending.",
      "Buyer statement collection scheduled."
    ],
    evidenceSummary: [
      "GPS tracking logs place stolen vehicle at suspect scrap yard location.",
      "CCTV footage captures suspect breaking ignition mechanism on 19 Jun.",
      "LPR database alerts verify transport route from Mysuru outer ring road."
    ],
    suspectNetwork: {
      nodes: [
        { id: "kiran", label: "Kiran Kumar", role: "Primary Suspect", type: "suspect", details: { history: "1 prior theft conviction (probation).", firs: "FIR/2026/MYS/201", assets: "Scrapyard lease, tools", vehicles: "KA-09-H-4412 (Tow truck)", associates: "Manju R" } },
        { id: "manju", label: "Manju R", role: "Dismantler / Buyer", type: "contractor", details: { history: "Suspected receiver of stolen auto parts.", firs: "FIR/2025/MYS/43", assets: "Automobile scrapyard lot", vehicles: "KA-09-K-1212 (Pickup)", associates: "Kiran Kumar" } }
      ],
      edges: [
        { from: "kiran", to: "manju", rel: "Dismantling Partner", freq: "Weekly", conf: "92%", lastContact: "3 days ago" }
      ]
    },
    mapPoints: [
      { id: "scene", type: "crime_scene", label: "Theft Site (Chamundi)", coords: [45, 50], desc: "Chamundi Hill parking area theft zone." },
      { id: "residence", type: "residence", label: "Kiran Scrap Yard", coords: [58, 65], desc: "Suspect auto recycling yard." },
      { id: "tower", type: "tower", label: "Chamundi Tower 1", coords: [46, 52], desc: "Tower tracking suspect mobile connection." },
      { id: "bank", type: "bank", label: "None", coords: [0, 0], desc: "No bank transactions recorded." },
      { id: "cctv", type: "cctv", label: "Ring Road CCTV", coords: [52, 58], desc: "Captured stolen SUV towed by suspect." },
      { id: "police", type: "police", label: "Mysuru East PS", coords: [30, 35], desc: "Local precinct handling docket." }
    ],
    route: [[45, 50], [46, 52], [52, 58], [58, 65], [30, 35]],
    timeline: [
      { time: "11:20 PM", event: "Vehicle parked at Chamundi", type: "vehicle", desc: "Target SUV parked at Chamundi Hill visitor lot." },
      { time: "11:45 PM", event: "Ignition bypass attempt", type: "evidence", desc: "CCTV captures suspect entering vehicle cabin." },
      { time: "11:58 PM", event: "Vehicle departs scene", type: "vehicle", desc: "Target vehicle driven off Chamundi parking lot." },
      { time: "12:12 AM", event: "Outer Ring Road CCTV match", type: "vehicle", desc: "LPR camera logs target vehicle passing outer toll checkpoint." },
      { time: "01:30 AM", event: "GPS signal terminates", type: "evidence", desc: "GPS locator wire cut at scrap yard coordinates." }
    ],
    riskScore: 42,
    riskBreakdown: {
      evidenceStrength: 80,
      networkInfluence: 55,
      criminalHistory: 45,
      financialSuspicion: 15,
      locationMatch: 90,
      repeatOffense: 35
    },
    operationalSteps: [
      { action: "Search Scrapyard Yard", priority: "High", status: "Approved", icon: "Search" },
      { action: "Question Dismantler Associate", priority: "High", status: "Scheduled", icon: "User" },
      { action: "Seize Tow Vehicle", priority: "Medium", status: "Pending", icon: "FileText" }
    ],
    escapeRisk: "Low",
    report: {
      executiveSummary: "Case file on localized vehicle theft syndicate operating around Mysuru. The suspect Kiran Kumar targets passenger SUVs and transports them to outer ring road yards for dismantling.",
      caseOverview: "Victim reported vehicle missing on 19 Jun. Automatic LPR filters matched license plates along Ring Road checkpoints, terminating near Kiran's yard.",
      findings: "CCTV footage and mobile positioning verify suspect present at parking lot during coordinates of theft.",
      legalSections: "Under investigation for violation of Section 379 IPC (Theft).",
      pendingTasks: "Obtain scrapyard search warrant and retrieve chassis components.",
      officerNotes: "Subject operates in localized circle. Low risk of flight, but high likelihood of parting out evidence."
    }
  }
};

// ── HELPER FOR DYNAMIC CASE CREATION (Offline/Rule-based/API fallback) ────────
function generateDynamicCase(
  fNum: string,
  sName: string,
  dist: string,
  cat: string
): CaseData {
  const riskScore = Math.min(99, Math.max(30, (fNum.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 35) + 60));
  const confidence = Math.min(95, Math.max(50, 75 + (sName.length % 15)));

  const nodes: SuspectNode[] = [
    {
      id: "primary",
      label: sName || "Unknown Suspect",
      role: "Primary Suspect",
      type: "suspect",
      details: {
        history: `Suspected coordinator of illegal ${cat.toLowerCase()} activities in the ${dist} division. Mapped in multiple regional logs.`,
        firs: `${fNum}, FIR/2025/MYS/82`,
        assets: "₹24L tracked deposits, 2 regional vehicles",
        vehicles: "KA-01-M-9912 (SUV), KA-01-H-4321",
        associates: "Venkat R., Ramesh Patil"
      }
    },
    {
      id: "associate1",
      label: "Venkat R.",
      role: "Logistics Link",
      type: "associate",
      details: {
        history: "Prior citations for commercial transport violations and regional leasing fraud.",
        firs: "FIR/2024/KLB/12",
        assets: "Contract lease agreements, ₹12L bank records",
        vehicles: "KA-01-T-8877 (Truck)",
        associates: sName
      }
    },
    {
      id: "associate2",
      label: "Ramesh Patil",
      role: "Financial Handler",
      type: "broker",
      details: {
        history: "Financial broker flagged for routing unusual transaction volumes.",
        firs: "None",
        assets: "Local firm assets, ₹45L bank accounts",
        vehicles: "KA-01-A-4433 (Sedan)",
        associates: sName
      }
    }
  ];

  const edges: SuspectEdge[] = [
    { from: "primary", to: "associate1", rel: "Logistics Link", freq: "Daily", conf: "92%", lastContact: "Today 08:30 AM" },
    { from: "primary", to: "associate2", rel: "Money Trail", freq: "Weekly", conf: "88%", lastContact: "2 days ago" }
  ];

  const mapPoints: MapPoint[] = [
    { id: "scene", type: "crime_scene", label: "Incident Hotspot", coords: [48, 42], desc: `Site of reported ${cat.toLowerCase()} extraction/fraud.` },
    { id: "residence", type: "residence", label: "Suspect Primary Address", coords: [30, 68], desc: `Registered residential address of ${sName}.` },
    { id: "tower", type: "tower", label: "Mobile Tower 9", coords: [52, 46], desc: `Tower routing connection logs for suspect's device.` },
    { id: "bank", type: "bank", label: "State Bank Center", coords: [38, 55], desc: `Location of suspicious transactional routing.` },
    { id: "police", type: "police", label: `${dist} HQ`, coords: [22, 25], desc: "Investigating command center." }
  ];

  const route: Array<[number, number]> = [[30, 68], [38, 55], [48, 42], [52, 46], [22, 25]];

  const timeline: TimelineItem[] = [
    { time: "09:00 AM", event: "Incident Logged", type: "witness", desc: `First responder report registered for ${cat.toLowerCase()} in ${dist}.` },
    { time: "10:15 AM", event: "Cellular Handoff Detected", type: "call", desc: `Accused's device connects to regional Tower 9.` },
    { time: "11:45 AM", event: "Bank Audit Match", type: "money", desc: `Suspicious transfer of ₹3.8L flags beneficiary account.` },
    { time: "02:30 PM", event: "Highway Intercept", type: "vehicle", desc: `LPR camera records suspect transport vehicle exiting checkpoint.` }
  ];

  const operationalSteps: OperationalStep[] = [
    { action: `Freeze ${sName}'s bank accounts`, priority: "Immediate", status: "Pending", icon: "Lock" },
    { action: `Obtain search warrant for ${dist} premises`, priority: "High", status: "Approved", icon: "Search" },
    { action: `Question logistics associate Venkat R.`, priority: "Medium", status: "Scheduled", icon: "User" }
  ];

  const report = {
    executiveSummary: `This restricted dossier records findings regarding the coordination of illegal ${cat.toLowerCase()} activities in the ${dist} division, with primary focus on suspect ${sName}. Case logs and tower attachments indicate active syndicate links.`,
    caseOverview: `Following citizen complaints and divisional reporting, the cyber/tactical divisions initiated geofencing audits and financial ledger tracking for docket ${fNum}.`,
    findings: `Evidentiary trails confirm matching mobile attachments near the incident coordinates at the estimated timeline, combined with suspicious transfers routing through flagged broker shell entities.`,
    legalSections: `Violation of Karnataka Police Regulations, IPC Section 379/420, and associated regional acts governing ${cat.toLowerCase()}.`,
    pendingTasks: `Acquire official bank transaction reports, question named logistics contacts, and retrieve local traffic camera DVR recordings.`,
    officerNotes: `Target exhibits moderate-to-high threat potential. Suggest immediate border alert triggers and bank freezes before asset reallocation occurs.`
  };

  return {
    firNumber: fNum,
    suspectName: sName,
    district: dist,
    category: cat,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    severity: riskScore,
    officer: "PI Ravi Kumar",
    confidence,
    missingEvidence: ["DNA / forensics analysis pending", "Linked CCTV hard disk decrypting"],
    evidenceSummary: [
      `Cellular tower ping records place suspect's device within incident zone.`,
      `Financial ledgers track correlation of capital movements matching load times.`,
      `Witness testimony states suspect's vehicle was observed near scene.`
    ],
    suspectNetwork: { nodes, edges },
    mapPoints,
    route,
    timeline,
    riskScore,
    riskBreakdown: {
      evidenceStrength: Math.round(riskScore * 0.9),
      networkInfluence: Math.round(riskScore * 0.8),
      criminalHistory: Math.round(riskScore * 0.75),
      financialSuspicion: Math.round(riskScore * 0.7),
      locationMatch: Math.round(riskScore * 0.95),
      repeatOffense: Math.round(riskScore * 0.6)
    },
    operationalSteps,
    escapeRisk: riskScore > 80 ? "High" : riskScore > 50 ? "Medium" : "Low",
    report
  };
}

// ── COMPONENT ROOT CONTENT ───────────────────────────────────────────────────
function AIInvestigatorPageContent() {
  const { t, lang } = useLanguage();
  const searchParams = useSearchParams();
  const [processedQuery, setProcessedQuery] = useState(false);

  // Form inputs
  const [firNumber, setFirNumber] = useState("FIR/2026/BLR/101");
  const [suspectName, setSuspectName] = useState("Raju Naik");
  const [selectedDistrict, setSelectedDistrict] = useState("Kalaburagi");
  const [selectedCategory, setSelectedCategory] = useState("Sand Mining");

  // Loaded Context State
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'chat' | 'graph' | 'map' | 'timeline' | 'report'>('chat');

  // Interactive Suspect inspector state (Relationship Graph)
  const [selectedNode, setSelectedNode] = useState<SuspectNode | null>(null);

  // Map Playback state
  const [mapPlaybackIndex, setMapPlaybackIndex] = useState(0);
  const [isMapPlaying, setIsMapPlaying] = useState(false);
  const mapIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timeline Filter State
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'call' | 'vehicle' | 'money' | 'witness'>('all');

  // Conversational Chat Memory
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Loading and Error states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [isChatTyping, setIsChatTyping] = useState(false);

  // Export states
  const [isExporting, setIsExporting] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ── TRIGGER PIPELINE LOAD & ANALYZE ─────────────────────────────────────────
  const triggerLoadAndAnalyze = useCallback(async (targetFir?: string) => {
    const fNum = targetFir || firNumber;
    
    // Determine the parameters to use
    let sName = suspectName;
    let dist = selectedDistrict;
    let cat = selectedCategory;

    const matchedBase = CASES_DATABASE[fNum];
    if (matchedBase) {
      if (targetFir) {
        sName = matchedBase.suspectName;
        dist = matchedBase.district;
        cat = matchedBase.category;
        
        setFirNumber(fNum);
        setSuspectName(sName);
        setSelectedDistrict(dist);
        setSelectedCategory(cat);
      }
    }

    setIsEvaluating(true);
    setEvaluationError(null);
    setCurrentCase(null);
    setSelectedNode(null);
    setMapPlaybackIndex(0);
    setIsMapPlaying(false);
    setMessages([]);

    if (mapIntervalRef.current) {
      clearInterval(mapIntervalRef.current);
    }

    try {
      // Build base case data
      let baseCaseData: CaseData;
      if (matchedBase) {
        baseCaseData = {
          ...matchedBase,
          suspectName: sName,
          district: dist,
          category: cat,
          riskBreakdown: {
            ...matchedBase.riskBreakdown
          }
        };
      } else {
        baseCaseData = generateDynamicCase(fNum, sName, dist, cat);
      }

      // Perform a real backend call to /api/investigate (via generateText)
      // to generate a custom executive summary / findings for this case!
      const prompt = `Perform an official intelligence evaluation for Karnataka Police. 
FIR Number: ${fNum}
Suspect Target: ${sName}
District Division: ${dist}
Category: ${cat}

Please generate the restricted police intelligence report in JSON format:
{
  "executiveSummary": "A concise summary of the case and threat level.",
  "caseOverview": "Details of the incident, complaints, and investigations.",
  "findings": "Evidentiary correlation, tower locations, bank transfers, and vehicle checkpoints.",
  "legalSections": "Applicable IPC/BNS/MMRD/IT Act sections.",
  "pendingTasks": "Immediate next investigative tasks.",
  "officerNotes": "Operational warnings and flight risk advice."
}`;

      // Enforce a minimum delay for the spinner so it feels natural but fast (e.g. 800ms)
      const minDelay = new Promise(resolve => setTimeout(resolve, 800));
      
      let aiReportText = '';
      try {
        aiReportText = await generateText({
          systemPrompt: "You are the CrimeVision AI Intelligence platform for Karnataka State Police. Analyze the provided case details and generate a realistic, professional, restricted police intelligence report. You must respond ONLY with a raw JSON object containing keys: executiveSummary, caseOverview, findings, legalSections, pendingTasks, officerNotes.",
          messages: [{ role: 'user', content: prompt }]
        });
      } catch (e) {
        console.warn("API request failed, falling back to local JS generation.", e);
      }

      await minDelay;

      // Try to parse the AI report text
      if (aiReportText) {
        try {
          let cleanJson = aiReportText.trim();
          if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/```$/, '').trim();
          }
          const parsed = JSON.parse(cleanJson);
          if (parsed.executiveSummary || parsed.caseOverview) {
            baseCaseData.report = {
              executiveSummary: parsed.executiveSummary || baseCaseData.report.executiveSummary,
              caseOverview: parsed.caseOverview || baseCaseData.report.caseOverview,
              findings: parsed.findings || baseCaseData.report.findings,
              legalSections: parsed.legalSections || baseCaseData.report.legalSections,
              pendingTasks: parsed.pendingTasks || baseCaseData.report.pendingTasks,
              officerNotes: parsed.officerNotes || baseCaseData.report.officerNotes,
            };
            
            if (parsed.findings) {
              baseCaseData.evidenceSummary = [
                parsed.findings,
                ...baseCaseData.evidenceSummary.slice(1)
              ];
            }
          }
        } catch (jsonErr) {
          console.warn("Failed to parse AI JSON response. Using text directly as executive summary.", jsonErr);
          baseCaseData.report.executiveSummary = aiReportText;
        }
      }

      setCurrentCase(baseCaseData);

      // Add welcome system report
      const welcomeMsg: Message = {
        id: `sys-welcome-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        caseRef: fNum,
        content: `AI investigative workspace initialized for docket **FIR #${baseCaseData.firNumber}**. Threat matrix generated, suspect graph verified, and tactical maps calibrated. Ask me anything about suspects, routes, transactions, or operational recommendation items.`
      };
      setMessages([welcomeMsg]);

    } catch (err: any) {
      console.error("Evaluation error:", err);
      setEvaluationError(err.message || "An unexpected error occurred during case context evaluation.");
    } finally {
      setIsEvaluating(false);
    }
  }, [firNumber, suspectName, selectedDistrict, selectedCategory]);

  // Run on mount or searchParams
  useEffect(() => {
    const qParam = searchParams.get('q') || searchParams.get('query');
    if (qParam && !processedQuery) {
      setProcessedQuery(true);
      if (typeof window !== 'undefined') {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
      triggerLoadAndAnalyze();
      setTimeout(() => {
        handleSendQuery(qParam);
      }, 1200); // Wait for async evaluation
    } else if (!qParam && !currentCase && !isEvaluating) {
      // Load first case on mount
      triggerLoadAndAnalyze("FIR/2026/BLR/101");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, processedQuery, triggerLoadAndAnalyze]);

  // Auto Scroll Chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isChatTyping]);

  // Load Recent Case
  const handleLoadRecent = (fir: string) => {
    setFirNumber(fir);
    triggerLoadAndAnalyze(fir);
  };

  // Map Animation Timer Effect
  useEffect(() => {
    if (isMapPlaying && currentCase) {
      mapIntervalRef.current = setInterval(() => {
        setMapPlaybackIndex(prev => {
          if (prev >= currentCase.route.length - 1) {
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (mapIntervalRef.current) {
        clearInterval(mapIntervalRef.current);
      }
    }
    return () => {
      if (mapIntervalRef.current) {
        clearInterval(mapIntervalRef.current);
      }
    };
  }, [isMapPlaying, currentCase]);

  // ── HANDLE CONVERSATIONAL QUERIES ──────────────────────────────────────────
  const handleSendQuery = async (text: string) => {
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
    setIsChatTyping(true);

    try {
      let content = "";
      let widget: 'risk' | 'network' | 'map' | 'timeline' | 'report' | 'actions' | undefined;

      if (!currentCase) {
        content = "This information is not available in the current investigation. Please load a valid case context from the Left Panel first.";
      } else {
        const systemPrompt = `You are CrimeVision AI, an expert investigative copilot for the Karnataka State Police.
Current case context:
- FIR Number: ${currentCase.firNumber}
- Suspect: ${currentCase.suspectName}
- District: ${currentCase.district}
- Category: ${currentCase.category}
- Risk Score: ${currentCase.riskScore}/100
- Assigned Officer: ${currentCase.officer}
- Evidence Summary: ${currentCase.evidenceSummary.join(" | ")}

Answer the officer's query professionally, concisely, and with Karnataka Police context. Use bullet points or headers if appropriate.`;

        const chatHistory = messages
          .filter(m => m.content)
          .map(m => ({
            role: m.role,
            content: m.content!
          }));

        chatHistory.push({ role: 'user', content: query });

        try {
          content = await generateText({
            systemPrompt,
            messages: chatHistory
          });
        } catch (e) {
          console.warn("Chat API call failed, falling back to rule-based offline engine.", e);
        }

        if (!content) {
          const lower = query.toLowerCase();
          const lastUserMsgs = messages.filter(m => m.role === 'user').map(m => m.content?.toLowerCase() || "");
          const isFollowUpWhy = lower === "why?" || lower === "why" || lower.includes("explain why");
          const isFollowUpEvidence = lower.includes("evidence") || lower.includes("supporting evidence");
          const isFollowUpAssociates = lower.includes("associate") || lower.includes("accomplice") || lower.includes("who are his");
          const isFollowUpRoute = lower.includes("route") || lower.includes("seen") || lower.includes("gps") || lower.includes("movement");

          if (lower.includes("suspect") || lower.includes("who is the primary") || (isFollowUpWhy && lastUserMsgs.some(m => m.includes("suspect")))) {
            content = `### Primary Accused Profile\n\n**Name:** ${currentCase.suspectName}\n\n**Operational Conclusion:** Confirmed high probability coordination of regional illicit networks.\n\n**Reasoning:**\n• tower connections place the suspect's mobile at crime quarry perimeter during coordinates.\n• Registered vehicle matched license plate logs captured on exit highways.\n• Significant money transfer matches load contractor payroll logs.\n• Prior filings identify a repeating extraction pattern.\n\n**Case Confidence Score:** ${currentCase.confidence}%\n\n*Missing Information:* CCTV DVR hard-drive under forensic decryption.`;
            widget = 'risk';
          } else if (lower.includes("network") || lower.includes("associates") || lower.includes("financial link") || isFollowUpAssociates) {
            content = `### Criminal Syndicate Relationships\n\nActive connections matching **${currentCase.suspectName}** cross-referenced via communication logs and ledger records.\n\nSelect the **Relationship Graph** tab or inspect the visual nodes below to review contact frequencies, last seen registries, and legal dossiers.`;
            widget = 'network';
          } else if (lower.includes("map") || lower.includes("where was he") || lower.includes("seen") || lower.includes("route") || isFollowUpRoute) {
            content = `### Tactical Movement Registry\n\nGPS trace and CCTV coordinates mapped for **${currentCase.suspectName}**'s registered transport trucks.\n\nUse the play controls below to replay the chronolog of events leading from resident addresses to intercept checkposts.`;
            widget = 'map';
          } else if (lower.includes("timeline") || lower.includes("chronology") || lower.includes("events")) {
            content = `### Investigation Event Log\n\nReconstructed chronological events compiled from LPR triggers, cellular tower handoffs, and witness registries. Use the filters below to isolate calls, financial, or vehicle movements.`;
            widget = 'timeline';
          } else if (lower.includes("report") || lower.includes("dossier") || lower.includes("export")) {
            content = `### Government Intelligence Report Generated\n\nFormulated restricted intelligence dossier for case reference **${currentCase.firNumber}**. Download PDF copies or print for command desk reviews.`;
            widget = 'report';
          } else if (lower.includes("action") || lower.includes("operations") || lower.includes("steps") || lower.includes("arrest")) {
            content = `### Tactical Operations Briefing\n\nDecision support matrix recommends the immediate freezing of accounts, border lookouts, and scrap/warehouse search warrants. Prioritized checklists are shown below.`;
            widget = 'actions';
          } else {
            const matchedEvidence = currentCase.evidenceSummary.filter(ev => 
              lower.split(' ').some(word => word.length > 3 && ev.toLowerCase().includes(word))
            );

            if (matchedEvidence.length > 0) {
              content = `### Matched Evidence Logs\n\nFound the following matching case records:\n\n${matchedEvidence.map(e => `• ${e}`).join('\n')}`;
            } else {
              content = `No intelligence data matching "${query}" is available in the current investigation. Please ask about suspect profiles, timelines, risk matrices, or operational recommendations.`;
            }
          }
        } else {
          const lower = query.toLowerCase();
          if (lower.includes("suspect") || lower.includes("risk") || lower.includes("threat")) widget = 'risk';
          else if (lower.includes("network") || lower.includes("associate")) widget = 'network';
          else if (lower.includes("map") || lower.includes("route")) widget = 'map';
          else if (lower.includes("timeline") || lower.includes("event") || lower.includes("chronology")) widget = 'timeline';
          else if (lower.includes("action") || lower.includes("operations") || lower.includes("recommend")) widget = 'actions';
          else if (lower.includes("report") || lower.includes("dossier")) widget = 'report';
        }
      }

      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        timestamp: responseTime,
        content,
        widgetType: widget
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat query execution error:", err);
    } finally {
      setIsChatTyping(false);
    }
  };

  // ── EXPORT PDF GENERATION ──────────────────────────────────────────────────
  const handleExportPDF = async () => {
    if (!currentCase) return;
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
      doc.text('AI INVESTIGATIVE INTELLIGENCE DOSSIER', pageW / 2, y, { align: 'center' });
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`FIR Reference: #${currentCase.firNumber} | District: ${currentCase.district} | Category: ${currentCase.category}`, pageW / 2, y, { align: 'center' });
      y += 4;
      doc.line(15, y, pageW - 15, y);
      y += 10;

      // Summary Info
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 95);
      doc.text('1. EXECUTIVE INTEL SUMMARY', 15, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      
      const splitSummary = doc.splitTextToSize(currentCase.report.executiveSummary, 180);
      doc.text(splitSummary, 20, y);
      y += splitSummary.length * 5 + 5;

      doc.text(`Assigned Officer: ${currentCase.officer}`, 20, y);
      y += 5;
      doc.text(`Case Threat Matrix Score: ${currentCase.riskScore}/100 (Level: ${currentCase.escapeRisk.toUpperCase()})`, 20, y);
      y += 5;
      doc.text(`Primary Target: ${currentCase.suspectName}`, 20, y);
      y += 5;
      doc.text(`Decision Support System Confidence: ${currentCase.confidence}%`, 20, y);
      y += 10;

      // Evidence Checklist
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 95);
      doc.text('2. FORENSIC EVIDENCE CHECKLIST', 15, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(70, 70, 70);
      currentCase.evidenceSummary.forEach((ev) => {
        const splitEv = doc.splitTextToSize(`• ${ev}`, 170);
        doc.text(splitEv, 20, y);
        y += splitEv.length * 5 + 2;
      });

      y += 10;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 58, 95);
      doc.text('3. RECOMMENDED OPERATIONAL OPERATIONS', 15, y);
      y += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      currentCase.operationalSteps.forEach((step) => {
        doc.text(`[ ] ${step.action} (Priority: ${step.priority} | Status: ${step.status})`, 20, y);
        y += 5;
      });

      y += 10;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('Document generated via KSP CrimeVision AI Copilot. Restricted distribution only.', pageW / 2, y, { align: 'center' });

      doc.save(`KSP_AI_Dossier_${currentCase.firNumber.replace(/\//g, '_')}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Could not export PDF dossier.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── RENDER SUB-COMPONENTS ──────────────────────────────────────────────────

  // A. RISK MATRIX COMPONENT
  const renderRiskScoreWidget = (cCase: CaseData) => {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, marginTop: 10, maxWidth: 500 }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {/* SVG Gauge */}
          <div style={{ position: 'relative', width: 80, height: 80 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#E2E8F0" strokeWidth="6" />
              <circle 
                cx="40" cy="40" r="34" fill="none" 
                stroke={cCase.riskScore > 75 ? '#dc2626' : '#f59e0b'} 
                strokeWidth="6" 
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - cCase.riskScore / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#1E3A5F' }}>{cCase.riskScore}</span>
              <span style={{ fontSize: 8, color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Risk</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1E3A5F', textTransform: 'uppercase' }}>
              Threat Matrix Level: <span style={{ color: cCase.riskScore > 75 ? '#dc2626' : '#f59e0b' }}>{cCase.escapeRisk}</span>
            </div>
            <p style={{ fontSize: 11, color: '#475569', margin: '4px 0 0 0', lineHeight: 1.3 }}>
              Synthesized threat profile based on communication graphs, location proximity logs, and repeat patterns.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14, borderTop: '1px solid #E2E8F0', paddingTop: 12 }}>
          {Object.entries(cCase.riskBreakdown).map(([key, val]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} style={{ fontSize: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginBottom: 2 }}>
                  <span>{formattedKey}</span>
                  <span style={{ fontWeight: 700 }}>{val}%</span>
                </div>
                <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${val}%`, background: '#1E3A5F' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // B. RELATIONSHIP GRAPH COMPONENT
  const renderNetworkGraphWidget = (cCase: CaseData) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginTop: 10, height: 420, position: 'relative', overflow: 'hidden' }}>
        {/* SVG Nodes and Lines */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg style={{ width: '100%', height: '100%' }}>
            {/* Draw Edges */}
            {cCase.suspectNetwork.edges.map((edge, idx) => {
              const fromNode = cCase.suspectNetwork.nodes.find(n => n.id === edge.from);
              const toNode = cCase.suspectNetwork.nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              // Grid mapping matching node coordinates
              const fromX = fromNode.id === 'raju' || fromNode.id === 'arjun' || fromNode.id === 'kiran' ? '50%' : fromNode.id === 'venkat' || fromNode.id === 'vikram' ? '20%' : fromNode.id === 'dawood' || fromNode.id === 'sameer' ? '80%' : '50%';
              const fromY = fromNode.id === 'raju' || fromNode.id === 'arjun' || fromNode.id === 'kiran' ? '40%' : '75%';
              
              const toX = toNode.id === 'raju' || toNode.id === 'arjun' || toNode.id === 'kiran' ? '50%' : toNode.id === 'venkat' || toNode.id === 'vikram' ? '20%' : toNode.id === 'dawood' || toNode.id === 'sameer' ? '80%' : '50%';
              const toY = toNode.id === 'raju' || toNode.id === 'arjun' || toNode.id === 'kiran' ? '40%' : '75%';

              return (
                <g key={idx}>
                  <line 
                    x1={fromX} y1={fromY} x2={toX} y2={toY} 
                    stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="5,5" 
                  />
                  {/* Center Edge Text label */}
                  <rect x="35%" y="54%" width="30%" height="16" fill="#F8FAFC" rx="4" style={{ display: 'none' }} />
                </g>
              );
            })}

            {/* Draw Nodes */}
            {cCase.suspectNetwork.nodes.map((node) => {
              const isPrimary = node.type === 'suspect';
              const x = isPrimary ? '50%' : node.id === 'venkat' || node.id === 'vikram' ? '20%' : node.id === 'dawood' || node.id === 'sameer' ? '80%' : '50%';
              const y = isPrimary ? '40%' : '75%';

              return (
                <g 
                  key={node.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNode(node)}
                >
                  <circle 
                    cx={x} cy={y} r={isPrimary ? 24 : 20} 
                    fill={isPrimary ? '#1E3A5F' : '#FFFFFF'} 
                    stroke="#1E3A5F" strokeWidth="3" 
                  />
                  <text 
                    x={x} y={y} 
                    textAnchor="middle" dy="4" 
                    fill={isPrimary ? '#FFFFFF' : '#1E3A5F'}
                    style={{ fontSize: isPrimary ? 12 : 10, fontWeight: 900 }}
                  >
                    {node.label.charAt(0)}
                  </text>
                  <text 
                    x={x} y={isPrimary ? '25%' : '90%'} 
                    textAnchor="middle" 
                    fill="#1E3A5F"
                    style={{ fontSize: 11, fontWeight: 800 }}
                  >
                    {node.label}
                  </text>
                  <text 
                    x={x} y={isPrimary ? '30%' : '95%'} 
                    textAnchor="middle" 
                    fill="#6B7280"
                    style={{ fontSize: 9, fontWeight: 700 }}
                  >
                    {node.role.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic inspector overlay */}
        {selectedNode && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, background: '#FFFFFF', border: '1px solid #1E3A5F', borderRadius: 8, padding: 12, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#1E3A5F' }}>Target Dossier: {selectedNode.label}</span>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={14} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: 11 }}>
              <div><span style={{ color: '#6B7280' }}>Criminal History:</span> <strong style={{ color: '#1F2937' }}>{selectedNode.details.history}</strong></div>
              <div><span style={{ color: '#6B7280' }}>Connected FIRs:</span> <strong style={{ color: '#1F2937' }}>{selectedNode.details.firs}</strong></div>
              <div><span style={{ color: '#6B7280' }}>Registered Assets:</span> <strong style={{ color: '#1F2937' }}>{selectedNode.details.assets}</strong></div>
              <div><span style={{ color: '#6B7280' }}>Associated Vehicles:</span> <strong style={{ color: '#1F2937' }}>{selectedNode.details.vehicles}</strong></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // C. TACTICAL MAP WIDGET
  const renderMapWidget = (cCase: CaseData) => {
    const activeRouteCoords = cCase.route[mapPlaybackIndex] || [50, 50];

    return (
      <div style={{ background: '#0B0F17', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 14 }}>
        
        {/* SVG Tactical Grid Map */}
        <div style={{ height: 280, position: 'relative', background: '#0F172A', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Map Grid Lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
            {/* Draw Path Lines */}
            {cCase.route.length > 1 && (
              <polyline 
                points={cCase.route.map(pt => `${pt[0]}%,${pt[1]}%`).join(' ')} 
                fill="none" stroke="#D4A017" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
              />
            )}

            {/* Render Static Map Coordinates */}
            {cCase.mapPoints.filter(p => p.coords[0] > 0).map((pt) => {
              const isScene = pt.type === 'crime_scene';
              return (
                <g key={pt.id}>
                  <circle cx={`${pt.coords[0]}%`} cy={`${pt.coords[1]}%`} r="6" fill={isScene ? '#DC2626' : '#00D4FF'} />
                  <text x={`${pt.coords[0]}%`} y={`${pt.coords[1]}%`} dy="-10" textAnchor="middle" fill="#94A3B8" style={{ fontSize: 9, fontWeight: 700 }}>
                    {pt.label}
                  </text>
                </g>
              );
            })}

            {/* Tracker Target dot */}
            <circle 
              cx={`${activeRouteCoords[0]}%`} 
              cy={`${activeRouteCoords[1]}%`} 
              r="9" fill="#D4A017" stroke="#FFFFFF" strokeWidth="2.5" 
              className="animate-pulse"
            />
          </svg>

          {/* Interactive target radar indicator top-left */}
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 212, 255, 0.4)', borderRadius: 4, padding: '4px 8px', fontSize: 10, color: '#00D4FF', fontFamily: 'monospace' }}>
            TARGET GPS TRACKER ACTIVE
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => setIsMapPlaying(prev => !prev)}
            style={{ padding: '6px 12px', background: '#D4A017', color: '#1A1620', border: 'none', borderRadius: 4, fontWeight: 800, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {isMapPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isMapPlaying ? 'Pause' : 'Replay Route'}
          </button>
          
          <input 
            type="range" min="0" max={cCase.route.length - 1} 
            value={mapPlaybackIndex}
            onChange={e => {
              setIsMapPlaying(false);
              setMapPlaybackIndex(parseInt(e.target.value));
            }}
            style={{ flex: 1, accentColor: '#D4A017', cursor: 'pointer' }}
          />

          <span style={{ fontSize: 11, color: '#6B7280', fontFamily: 'monospace' }}>
            Waypoint {mapPlaybackIndex + 1}/{cCase.route.length}
          </span>
        </div>
      </div>
    );
  };

  // D. TIMELINE WIDGET
  const renderTimelineWidget = (cCase: CaseData) => {
    const filteredTimeline = cCase.timeline.filter(item => {
      if (timelineFilter === 'all') return true;
      return item.type === timelineFilter;
    });

    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Timeline Filter tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(['all', 'vehicle', 'call', 'money', 'witness'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimelineFilter(filter)}
              style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 12, cursor: 'pointer',
                background: timelineFilter === filter ? '#1E3A5F' : '#F1F5F9',
                color: timelineFilter === filter ? '#FFFFFF' : '#475569',
                border: 'none', textTransform: 'uppercase', fontWeight: 800
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Timeline Items */}
        <div style={{ position: 'relative', borderLeft: '2px solid #E2E8F0', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 14, marginLeft: 6, marginTop: 4 }}>
          {filteredTimeline.map((item, idx) => {
            return (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Bullet */}
                <div style={{
                  position: 'absolute', left: -21, top: 4, width: 8, height: 8, borderRadius: '50%',
                  background: item.type === 'vehicle' ? '#7C3AED' : item.type === 'call' ? '#2563EB' : item.type === 'money' ? '#059669' : '#DC2626'
                }} />
                <div>
                  <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'monospace' }}>{item.time}</span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#1E3A5F' }}>{item.event}</div>
                  <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0 0', lineHeight: 1.3 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // E. OPERATIONAL RECOMMENDATIONS
  const renderOperationalWidget = (cCase: CaseData) => {
    return (
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 16, marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#1E3A5F', textTransform: 'uppercase' }}> Immediate Actions List</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#DC2626' }}>Escape Risk: {cCase.escapeRisk.toUpperCase()}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cCase.operationalSteps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, borderBottom: '1px solid #F1F5F9', paddingBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" defaultChecked={step.status === 'Active' || step.status === 'In Progress'} style={{ accentColor: '#1E3A5F' }} />
                <span style={{ fontWeight: 800, color: '#1F2937' }}>{step.action}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 900,
                  background: step.priority === 'Immediate' ? '#FEE2E2' : step.priority === 'High' ? '#FEF3C7' : '#F1F5F9',
                  color: step.priority === 'Immediate' ? '#991B1B' : step.priority === 'High' ? '#92400E' : '#475569'
                }}>
                  {step.priority}
                </span>
                <span style={{ fontSize: 10, color: '#6B7280' }}>{step.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── CENTRAL TABBED DESK VIEW ────────────────────────────────────────────────
  const renderIntelligenceDesk = () => {
    if (isEvaluating) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            .spinner-eval {
              animation: spin 1s linear infinite;
            }
          `}</style>
          <RefreshCw size={36} className="spinner-eval" style={{ color: '#1E3A5F', marginBottom: 16 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>Evaluating Case Context</h2>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, maxWidth: 300, textAlign: 'center' }}>
            Querying intelligence database and processing evidence summaries for FIR docket...
          </p>
        </div>
      );
    }

    if (evaluationError) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
          <AlertTriangle size={48} style={{ color: '#DC2626', marginBottom: 16 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#DC2626', margin: 0 }}>Evaluation Failed</h2>
          <p style={{ fontSize: 13, color: '#475569', marginTop: 8, maxWidth: 400, textAlign: 'center', lineHeight: 1.4 }}>
            {evaluationError}
          </p>
          <button
            onClick={() => triggerLoadAndAnalyze()}
            style={{
              marginTop: 18, padding: '8px 16px', background: '#1E3A5F', color: '#FFFFFF',
              border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            Retry Evaluation
          </button>
        </div>
      );
    }

    if (!currentCase) {
      return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <Brain size={48} style={{ color: '#9CA3AF', marginBottom: 12 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>No Case Loaded</h2>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, maxWidth: 300 }}>
            Use the Left Panel Case Loader to trigger analytical evaluation of an official police docket.
          </p>
        </div>
      );
    }

    return (
      <div style={{ flex: 1, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tabs Bar */}
        <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #E5E7EB', padding: '0 12px' }}>
          {([
            { id: 'chat', label: 'Investigative Copilot', icon: Brain },
            { id: 'graph', label: 'Relationship Graph', icon: GitMerge },
            { id: 'map', label: 'Tactical Map', icon: Map },
            { id: 'timeline', label: 'Chronology', icon: List },
            { id: 'report', label: 'Dossier Report', icon: FileText }
          ] as const).map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800,
                  padding: '12px 16px', cursor: 'pointer', border: 'none', background: 'none',
                  borderBottom: isActive ? '3px solid #1E3A5F' : '3px solid transparent',
                  color: isActive ? '#1E3A5F' : '#475569', transition: 'all 0.15s ease'
                }}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              {/* Chat history */}
              <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, paddingRight: 6 }}>
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                      <div style={{
                        background: isUser ? '#1E3A5F' : '#F8FAFC',
                        color: isUser ? '#FFFFFF' : '#1F2937',
                        border: isUser ? 'none' : '1px solid #E2E8F0',
                        borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        padding: '10px 14px', fontSize: 13, lineHeight: 1.5,
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.content}

                        {/* Inline visual widgets triggered by query */}
                        {!isUser && msg.widgetType === 'risk' && renderRiskScoreWidget(currentCase)}
                        {!isUser && msg.widgetType === 'network' && renderNetworkGraphWidget(currentCase)}
                        {!isUser && msg.widgetType === 'map' && renderMapWidget(currentCase)}
                        {!isUser && msg.widgetType === 'timeline' && renderTimelineWidget(currentCase)}
                        {!isUser && msg.widgetType === 'actions' && renderOperationalWidget(currentCase)}
                      </div>
                      <span style={{ fontSize: 9, color: '#6B7280', alignSelf: isUser ? 'flex-end' : 'flex-start', fontFamily: 'monospace' }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                {isChatTyping && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignSelf: 'flex-start', maxWidth: '85%' }}>
                    <div style={{
                      background: '#F8FAFC',
                      color: '#475569',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px 12px 12px 2px',
                      padding: '10px 14px', fontSize: 13, lineHeight: 1.5,
                      display: 'flex', alignItems: 'center', gap: 8
                    }}>
                      <style>{`
                        @keyframes spin-mini {
                          to { transform: rotate(360deg); }
                        }
                        .spinner-mini {
                          width: 14px;
                          height: 14px;
                          border: 2px solid #E2E8F0;
                          border-top: 2px solid #1E3A5F;
                          border-radius: 50%;
                          animation: spin-mini 1s linear infinite;
                        }
                      `}</style>
                      <div className="spinner-mini" />
                      <span style={{ fontSize: 12, fontStyle: 'italic' }}>AI is compiling intelligence...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat inputs */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Suggested Prompts */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    "Why is this suspect targeted?",
                    "Show suspect relationship network.",
                    "Show GPS tracking routes.",
                    "Show chronological timeline.",
                    "What next operational steps are recommended?"
                  ].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => handleSendQuery(prompt)}
                      style={{
                        fontSize: 10, padding: '3px 8px', background: '#FFFFFF',
                        border: '1px solid #D1D5DB', borderRadius: 12, color: '#475569', cursor: 'pointer'
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Text bar */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Enter command or ask investigative query..."
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendQuery(inputVal); }}
                      style={{
                        width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: 20,
                        padding: '8px 38px 8px 14px', fontSize: 13, color: '#1F2937', outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => setIsVoiceActive(prev => !prev)}
                      style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: isVoiceActive ? '#DC2626' : '#6B7280' }}
                    >
                      {isVoiceActive ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>
                  </div>
                  <button
                    onClick={() => handleSendQuery(inputVal)}
                    style={{ padding: '8px 16px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1E3A5F', margin: 0 }}>Interactive Relationship Matrix</h3>
                <span style={{ fontSize: 11, color: '#6B7280' }}>Click nodes to view full dossiers</span>
              </div>
              {renderNetworkGraphWidget(currentCase)}
            </div>
          )}

          {activeTab === 'map' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1E3A5F', margin: 0 }}>Tactical Route Playback</h3>
                <span style={{ fontSize: 11, color: '#6B7280' }}>GPS Coordinates logged under tower registry</span>
              </div>
              {renderMapWidget(currentCase)}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: 6, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1E3A5F', margin: 0 }}>Reconstructed Case Chronology</h3>
                <span style={{ fontSize: 11, color: '#6B7280' }}>Logged triggers & handoffs</span>
              </div>
              {renderTimelineWidget(currentCase)}
            </div>
          )}

          {activeTab === 'report' && (
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: 20, fontFamily: 'monospace', fontSize: 12, color: '#1F2937' }}>
              <div style={{ textAlign: 'center', borderBottom: '3px double #1E3A5F', paddingBottom: 10, marginBottom: 16 }}>
                <h2 style={{ margin: 0, color: '#1E3A5F', fontSize: 16, fontWeight: 900 }}>RESTRICTED — OFFICIAL INTEL DOSSIER</h2>
                <span style={{ fontSize: 10, color: '#6B7280' }}>KARNATAKA STATE POLICE COMMAND CENTRE</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div><strong>CASE FILE:</strong> #{currentCase.firNumber}</div>
                <div><strong>DATE:</strong> {currentCase.date}</div>
                <div><strong>DISTRICT:</strong> {currentCase.district}</div>
                <div><strong>CATEGORY:</strong> {currentCase.category}</div>
                <div><strong>PRIMARY TARGET:</strong> {currentCase.suspectName}</div>
                <div><strong>ASSIGNED OFFICER:</strong> {currentCase.officer}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', borderBottom: '1px dashed #E2E8F0', marginBottom: 4 }}>I. EXECUTIVE SUMMARY</div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{currentCase.report.executiveSummary}</p>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', borderBottom: '1px dashed #E2E8F0', marginBottom: 4 }}>II. CASE OVERVIEW</div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{currentCase.report.caseOverview}</p>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', borderBottom: '1px dashed #E2E8F0', marginBottom: 4 }}>III. FORENSIC FINDINGS</div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{currentCase.report.findings}</p>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', borderBottom: '1px dashed #E2E8F0', marginBottom: 4 }}>IV. LEGAL PROVISIONS</div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{currentCase.report.legalSections}</p>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', borderBottom: '1px dashed #E2E8F0', marginBottom: 4 }}>V. PENDING TASKS</div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{currentCase.report.pendingTasks}</p>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', borderBottom: '1px dashed #E2E8F0', marginBottom: 4 }}>VI. OFFICER FIELD NOTES</div>
                  <p style={{ margin: 0, lineHeight: 1.4 }}>{currentCase.report.officerNotes}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#F1F5F9', border: '1px solid #D1D5DB', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}><Printer size={12} /> Print Dossier</button>
                <button onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: '#1E3A5F', color: '#FFFFFF', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}><Download size={12} /> Download PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── LAYOUT RENDER ──────────────────────────────────────────────────────────
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
        <span style={{ color: '#1F2937', fontWeight: 600 }}>AI Investigation Copilot</span>
      </div>

      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(30, 58, 95, 0.08)',
            display: 'flex', alignItems: 'center', justifyItems: 'center',
          }}>
            <Brain size={22} style={{ color: '#1E3A5F' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              AI Investigation Copilot Workspace
            </h1>
            <p style={{ fontSize: 13, color: '#475569', margin: 0 }}>
              Real-time intelligence engine integrating relationship matrices, geofencing, and risk threat indexes.
            </p>
          </div>
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
            {lang === 'en' ? 'LOAD CASE DOSSIER' : 'ಪ್ರಕರಣದ ಸಂದರ್ಭ ಲೋಡ್ ಮಾಡಿ'}
          </div>

          {/* Selector options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.keys(CASES_DATABASE).map((key) => {
              const item = CASES_DATABASE[key];
              const isSelected = firNumber === key;
              return (
                <div
                  key={key}
                  onClick={() => handleLoadRecent(key)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(30, 58, 95, 0.05)' : '#FFFFFF',
                    border: isSelected ? '1.5px solid #1E3A5F' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#1E3A5F', fontSize: 12 }}>{item.firNumber}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Target: {item.suspectName}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{item.category} · {item.district}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px dashed #E2E8F0', paddingTop: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                FIR Number
              </label>
              <input
                type="text"
                value={firNumber}
                onChange={e => setFirNumber(e.target.value)}
                style={{
                  width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px',
                  padding: '6px 10px', fontSize: '12px', color: '#1F2937', fontFamily: 'monospace', outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                Suspect Target
              </label>
              <input
                type="text"
                value={suspectName}
                onChange={e => setSuspectName(e.target.value)}
                style={{
                  width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px',
                  padding: '6px 10px', fontSize: '12px', color: '#1F2937', outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
                District Division
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{
                  width: '100%', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px',
                  padding: '6px 10px', fontSize: '12px', color: '#1F2937', outline: 'none'
                }}
              >
                {DISTRICTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <button
              onClick={() => triggerLoadAndAnalyze()}
              style={{
                width: '100%', padding: '8px 12px', background: '#1E3A5F', color: '#FFFFFF',
                border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <RefreshCw size={12} /> Evaluate Context
            </button>
          </div>
        </aside>

        {/* PANEL 2: Central Tabbed workspace */}
        {renderIntelligenceDesk()}

        {/* PANEL 3: Threat Analytics & Case Summary */}
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
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
              THREAT MATRIX & SUMMARY
            </div>

            {currentCase ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12, color: '#475569' }}>
                <div>
                  <span style={{ color: '#6B7280' }}>Docket Reference:</span>
                  <div style={{ fontWeight: 800, color: '#1E3A5F', fontSize: 13, fontFamily: 'monospace', marginTop: 2 }}>
                    {currentCase.firNumber}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#6B7280' }}>Investigative Status:</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#DC2626', fontWeight: 800, background: '#FEE2E2', padding: '2px 8px', borderRadius: 4, fontSize: 9, marginTop: 2 }}>
                    ● ACTIVE
                  </span>
                </div>

                <div>
                  <span style={{ color: '#6B7280' }}>Target:</span>
                  <div style={{ color: '#1F2937', fontWeight: 800, fontSize: 13, marginTop: 1 }}>{currentCase.suspectName}</div>
                </div>

                {/* Risk matrix meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ color: '#6B7280' }}>Risk Matrix Score:</span>
                    <strong style={{ color: '#DC2626' }}>{currentCase.riskScore}/100</strong>
                  </div>
                  <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${currentCase.riskScore}%`, background: '#DC2626' }} />
                  </div>
                </div>

                {/* AI Confidence Meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ color: '#6B7280' }}>AI Confidence match:</span>
                    <strong style={{ color: '#1E3A5F' }}>{currentCase.confidence}%</strong>
                  </div>
                  <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${currentCase.confidence}%`, background: '#1E3A5F' }} />
                  </div>
                </div>

                <div>
                  <span style={{ color: '#6B7280' }}>Evidence Summary:</span>
                  <div style={{ fontSize: 11, color: '#1F2937', marginTop: 2, lineHeight: 1.3 }}>
                    • {currentCase.evidenceSummary.length} verified records.<br />
                    • {currentCase.suspectNetwork.nodes.length} network actors mapped.
                  </div>
                </div>

                <div>
                  <span style={{ color: '#6B7280' }}>Assigned Officer:</span>
                  <div style={{ color: '#1F2937', fontWeight: 600, marginTop: 1 }}>{currentCase.officer}</div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
                No active docket intelligence loaded.
              </div>
            )}
          </div>

          {/* Quick dossier actions */}
          {currentCase && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px dashed #E2E8F0', paddingTop: 14 }}>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, borderRadius: '6px',
                  background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#1E3A5F', padding: '6px 10px', gap: '6px', cursor: 'pointer'
                }}
              >
                <Download size={12} /> {isExporting ? 'Exporting...' : 'Export intelligence dossier'}
              </button>
              <button
                onClick={() => alert(`Operational brief exported to dispatch unit.`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, borderRadius: '6px',
                  background: '#FFFFFF', border: '1px solid #D1D5DB', color: '#1F2937', padding: '6px 10px', gap: '6px', cursor: 'pointer'
                }}
              >
                <Clipboard size={12} /> Sync Command Desk
              </button>
              <button
                onClick={() => alert(`Escalated case file to Special Intelligence Cell.`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, borderRadius: '6px',
                  background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '6px 10px', gap: '6px', cursor: 'pointer'
                }}
              >
                <AlertTriangle size={12} /> Escalate Matrix
              </button>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}

export default function AIInvestigatorPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#64748b', fontSize: 14 }}>Loading AI Investigator...</div>}>
      <AIInvestigatorPageContent />
    </Suspense>
  );
}
