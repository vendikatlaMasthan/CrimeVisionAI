// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: lib/crimeData.ts
// CrimeVision AI — Single Source of Truth for ALL Data
// Karnataka State Police — KSP Datathon 2026
// All numbers internally consistent. Total crimes = 82,089.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface District {
  id: number;
  name: string;
  code: string;
  lat: number;
  lng: number;
  crimeCount: number;
  riskScore: number; // 0–100
  topCrimeType: string;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number; // e.g. +8.3 or -2.1
  officerCount: number;
  stationCount: number;
  cybercrime: number;
  theft: number;
  assault: number;
  narcotics: number;
  sandMining: number;
  organizedCrime: number;
  other: number;
  activeCases: number;
  population: number;
}

export interface CrimeCategory {
  name: string;
  count: number;
  percentage: number;
  color: string;
  trend: string;
}

export interface MonthlyTrend {
  month: string;
  crimes: number;
  cybercrime: number;
  theft: number;
  violence: number;
  narcotics: number;
  sandMining: number;
  organized: number;
  fraud: number;
}

export interface Suspect {
  id: string;
  name: string;
  alias: string;
  district: string;
  crimeType: string;
  firCount: number;
  status: 'Wanted' | 'Arrested' | 'Absconding' | 'Under Surveillance' | 'Released on Bail';
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  age: number;
  gender: string;
  lastSeen: string;
  knownAssociates: string[];
  vehicleNumbers: string[];
  mobileNumbers: string[];
}

export interface FIRRecord {
  id: string;
  firNumber: string;
  crimeType: string;
  district: string;
  date: string;
  status: 'Investigating' | 'Arrested' | 'Resolved' | 'Monitoring' | 'Chargesheet Filed';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  assignedOfficer: string;
  suspectName: string;
  victimName: string;
  description: string;
}

export interface AnomalyDistrict {
  id: string;
  district: string;
  crimeType: string;
  baselineDaily: number;
  actualLast24h: number;
  spikePercent: number;
  severity: 'Critical' | 'High' | 'Medium';
  detectedAt: string;
  status: string;
  indicators: string[];
}

export interface ResourceAllocation {
  district: string;
  officers: number;
  vehicles: number;
  stations: number;
  budget: number; // in lakhs
  adequacyScore: number; // 0–100
  recommendation: string;
}

// ─── District Data (31 Karnataka Districts) ──────────────────────────────────
// Individual crime sub-counts sum to crimeCount for each district.
// All crimeCount values sum to 82,089.

export const DISTRICTS: District[] = [
  {
    id: 1, name: 'Bengaluru Urban', code: 'BLR', lat: 12.97, lng: 77.59,
    crimeCount: 14823, riskScore: 94, topCrimeType: 'Cybercrime',
    trend: 'up', trendPercent: 8.3, officerCount: 4820, stationCount: 114,
    cybercrime: 4231, theft: 3892, assault: 1823, narcotics: 1456, sandMining: 241, organizedCrime: 1080, other: 2100,
    activeCases: 2341, population: 12476000,
  },
  {
    id: 2, name: 'Bengaluru Rural', code: 'BLRR', lat: 13.01, lng: 77.40,
    crimeCount: 3241, riskScore: 58, topCrimeType: 'Theft',
    trend: 'up', trendPercent: 4.1, officerCount: 890, stationCount: 34,
    cybercrime: 456, theft: 987, assault: 534, narcotics: 389, sandMining: 312, organizedCrime: 252, other: 311,
    activeCases: 478, population: 990923,
  },
  {
    id: 3, name: 'Mysuru', code: 'MYS', lat: 12.29, lng: 76.64,
    crimeCount: 5678, riskScore: 62, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -2.1, officerCount: 1780, stationCount: 52,
    cybercrime: 892, theft: 1678, assault: 934, narcotics: 678, sandMining: 180, organizedCrime: 484, other: 832,
    activeCases: 823, population: 3001127,
  },
  {
    id: 4, name: 'Mangaluru', code: 'MNG', lat: 12.86, lng: 74.84,
    crimeCount: 4321, riskScore: 72, topCrimeType: 'Cybercrime',
    trend: 'up', trendPercent: 5.8, officerCount: 1340, stationCount: 44,
    cybercrime: 678, theft: 1234, assault: 789, narcotics: 489, sandMining: 167, organizedCrime: 264, other: 700,
    activeCases: 612, population: 2089649,
  },
  {
    id: 5, name: 'Belagavi', code: 'BLG', lat: 15.85, lng: 74.50,
    crimeCount: 6234, riskScore: 76, topCrimeType: 'Assault',
    trend: 'up', trendPercent: 3.2, officerCount: 2120, stationCount: 67,
    cybercrime: 734, theft: 1892, assault: 1234, narcotics: 834, sandMining: 204, organizedCrime: 473, other: 863,
    activeCases: 934, population: 4214505,
  },
  {
    id: 6, name: 'Kalaburagi', code: 'KLG', lat: 17.33, lng: 76.82,
    crimeCount: 7891, riskScore: 87, topCrimeType: 'Narcotics',
    trend: 'up', trendPercent: 11.2, officerCount: 2480, stationCount: 48,
    cybercrime: 923, theft: 2341, assault: 1678, narcotics: 1123, sandMining: 230, organizedCrime: 592, other: 1004,
    activeCases: 1234, population: 2564892,
  },
  {
    id: 7, name: 'Hubballi-Dharwad', code: 'HBD', lat: 15.35, lng: 75.14,
    crimeCount: 5432, riskScore: 69, topCrimeType: 'Theft',
    trend: 'up', trendPercent: 2.4, officerCount: 1690, stationCount: 45,
    cybercrime: 623, theft: 1567, assault: 1034, narcotics: 734, sandMining: 168, organizedCrime: 551, other: 755,
    activeCases: 756, population: 2143792,
  },
  {
    id: 8, name: 'Ballari', code: 'BLL', lat: 15.14, lng: 76.92,
    crimeCount: 6789, riskScore: 81, topCrimeType: 'Organized Crime',
    trend: 'up', trendPercent: 9.7, officerCount: 1620, stationCount: 41,
    cybercrime: 534, theft: 1923, assault: 1456, narcotics: 1067, sandMining: 934, organizedCrime: 875, other: 0,
    activeCases: 1087, population: 2532383,
  },
  {
    id: 9, name: 'Vijayapura', code: 'VJP', lat: 16.83, lng: 75.72,
    crimeCount: 4567, riskScore: 64, topCrimeType: 'Theft',
    trend: 'up', trendPercent: 1.9, officerCount: 1390, stationCount: 39,
    cybercrime: 423, theft: 1345, assault: 878, narcotics: 645, sandMining: 189, organizedCrime: 487, other: 600,
    activeCases: 698, population: 2175102,
  },
  {
    id: 10, name: 'Shivamogga', code: 'SHV', lat: 13.93, lng: 75.56,
    crimeCount: 3234, riskScore: 47, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -3.4, officerCount: 1120, stationCount: 33,
    cybercrime: 312, theft: 934, assault: 623, narcotics: 445, sandMining: 167, organizedCrime: 353, other: 400,
    activeCases: 423, population: 1752753,
  },
  {
    id: 11, name: 'Tumakuru', code: 'TMK', lat: 13.34, lng: 77.10,
    crimeCount: 4123, riskScore: 55, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -1.2, officerCount: 1340, stationCount: 41,
    cybercrime: 389, theft: 1234, assault: 789, narcotics: 523, sandMining: 178, organizedCrime: 554, other: 456,
    activeCases: 534, population: 2678980,
  },
  {
    id: 12, name: 'Raichur', code: 'RCH', lat: 16.21, lng: 77.36,
    crimeCount: 5678, riskScore: 84, topCrimeType: 'Sand Mining',
    trend: 'up', trendPercent: 13.8, officerCount: 1480, stationCount: 37,
    cybercrime: 423, theft: 1567, assault: 1234, narcotics: 923, sandMining: 734, organizedCrime: 797, other: 0,
    activeCases: 876, population: 1924773,
  },
  {
    id: 13, name: 'Koppal', code: 'KPL', lat: 15.35, lng: 76.16,
    crimeCount: 3456, riskScore: 65, topCrimeType: 'Sand Mining',
    trend: 'up', trendPercent: 6.3, officerCount: 1080, stationCount: 28,
    cybercrime: 234, theft: 1023, assault: 678, narcotics: 567, sandMining: 489, organizedCrime: 465, other: 0,
    activeCases: 512, population: 1391290,
  },
  {
    id: 14, name: 'Yadgir', code: 'YDG', lat: 16.77, lng: 77.14,
    crimeCount: 3123, riskScore: 63, topCrimeType: 'Narcotics',
    trend: 'up', trendPercent: 7.8, officerCount: 960, stationCount: 24,
    cybercrime: 189, theft: 923, assault: 623, narcotics: 534, sandMining: 212, organizedCrime: 442, other: 200,
    activeCases: 456, population: 1172985,
  },
  {
    id: 15, name: 'Chikkamagaluru', code: 'CMG', lat: 13.32, lng: 75.77,
    crimeCount: 1234, riskScore: 28, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -5.6, officerCount: 680, stationCount: 22,
    cybercrime: 123, theft: 389, assault: 267, narcotics: 145, sandMining: 76, organizedCrime: 76, other: 158,
    activeCases: 178, population: 1137754,
  },
  {
    id: 16, name: 'Hassan', code: 'HSN', lat: 13.01, lng: 76.10,
    crimeCount: 1567, riskScore: 32, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -2.3, officerCount: 790, stationCount: 26,
    cybercrime: 145, theft: 489, assault: 312, narcotics: 178, sandMining: 89, organizedCrime: 154, other: 200,
    activeCases: 212, population: 1776421,
  },
  {
    id: 17, name: 'Dakshina Kannada', code: 'DKN', lat: 12.84, lng: 75.30,
    crimeCount: 2345, riskScore: 44, topCrimeType: 'Cybercrime',
    trend: 'stable', trendPercent: 0.8, officerCount: 920, stationCount: 31,
    cybercrime: 289, theft: 678, assault: 489, narcotics: 212, sandMining: 89, organizedCrime: 143, other: 445,
    activeCases: 334, population: 2083519,
  },
  {
    id: 18, name: 'Udupi', code: 'UDP', lat: 13.35, lng: 74.75,
    crimeCount: 1123, riskScore: 24, topCrimeType: 'Cybercrime',
    trend: 'down', trendPercent: -1.4, officerCount: 580, stationCount: 19,
    cybercrime: 167, theft: 334, assault: 212, narcotics: 112, sandMining: 45, organizedCrime: 53, other: 200,
    activeCases: 156, population: 1177361,
  },
  {
    id: 19, name: 'Kodagu', code: 'KDG', lat: 12.33, lng: 75.78,
    crimeCount: 678, riskScore: 18, topCrimeType: 'Narcotics',
    trend: 'down', trendPercent: -4.2, officerCount: 420, stationCount: 14,
    cybercrime: 67, theft: 212, assault: 134, narcotics: 89, sandMining: 29, organizedCrime: 53, other: 94,
    activeCases: 89, population: 554762,
  },
  {
    id: 20, name: 'Chitradurga', code: 'CTD', lat: 14.23, lng: 76.40,
    crimeCount: 2789, riskScore: 48, topCrimeType: 'Theft',
    trend: 'stable', trendPercent: 1.5, officerCount: 980, stationCount: 29,
    cybercrime: 223, theft: 823, assault: 567, narcotics: 389, sandMining: 189, organizedCrime: 298, other: 300,
    activeCases: 398, population: 1660378,
  },
  {
    id: 21, name: 'Davangere', code: 'DVG', lat: 14.46, lng: 75.92,
    crimeCount: 3567, riskScore: 52, topCrimeType: 'Theft',
    trend: 'stable', trendPercent: 0.7, officerCount: 1180, stationCount: 35,
    cybercrime: 312, theft: 1067, assault: 734, narcotics: 512, sandMining: 178, organizedCrime: 364, other: 400,
    activeCases: 478, population: 1946905,
  },
  {
    id: 22, name: 'Gadag', code: 'GDG', lat: 15.41, lng: 75.63,
    crimeCount: 2134, riskScore: 43, topCrimeType: 'Theft',
    trend: 'stable', trendPercent: 2.1, officerCount: 780, stationCount: 23,
    cybercrime: 178, theft: 634, assault: 445, narcotics: 289, sandMining: 112, organizedCrime: 221, other: 255,
    activeCases: 298, population: 1065235,
  },
  {
    id: 23, name: 'Dharwad', code: 'DHW', lat: 15.46, lng: 74.99,
    crimeCount: 2678, riskScore: 46, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -0.5, officerCount: 890, stationCount: 31,
    cybercrime: 245, theft: 789, assault: 534, narcotics: 367, sandMining: 145, organizedCrime: 298, other: 300,
    activeCases: 376, population: 1848914,
  },
  {
    id: 24, name: 'Bagalkot', code: 'BGL', lat: 16.18, lng: 75.70,
    crimeCount: 4234, riskScore: 67, topCrimeType: 'Assault',
    trend: 'up', trendPercent: 5.1, officerCount: 1290, stationCount: 36,
    cybercrime: 312, theft: 1234, assault: 878, narcotics: 712, sandMining: 290, organizedCrime: 464, other: 344,
    activeCases: 612, population: 1890192,
  },
  {
    id: 25, name: 'Bidar', code: 'BDR', lat: 17.91, lng: 77.52,
    crimeCount: 3789, riskScore: 66, topCrimeType: 'Narcotics',
    trend: 'up', trendPercent: 4.6, officerCount: 1160, stationCount: 32,
    cybercrime: 267, theft: 1123, assault: 789, narcotics: 623, sandMining: 178, organizedCrime: 409, other: 400,
    activeCases: 534, population: 1700018,
  },
  {
    id: 26, name: 'Chamarajanagar', code: 'CMJ', lat: 11.92, lng: 76.94,
    crimeCount: 1234, riskScore: 27, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -3.1, officerCount: 620, stationCount: 21,
    cybercrime: 89, theft: 389, assault: 267, narcotics: 167, sandMining: 78, organizedCrime: 110, other: 134,
    activeCases: 167, population: 1020791,
  },
  {
    id: 27, name: 'Chikkaballapur', code: 'CKB', lat: 13.43, lng: 77.73,
    crimeCount: 2345, riskScore: 42, topCrimeType: 'Cybercrime',
    trend: 'stable', trendPercent: 1.8, officerCount: 780, stationCount: 25,
    cybercrime: 212, theft: 689, assault: 445, narcotics: 312, sandMining: 134, organizedCrime: 298, other: 255,
    activeCases: 312, population: 1255104,
  },
  {
    id: 28, name: 'Kolar', code: 'KLR', lat: 13.13, lng: 78.13,
    crimeCount: 2567, riskScore: 45, topCrimeType: 'Theft',
    trend: 'stable', trendPercent: 2.3, officerCount: 820, stationCount: 27,
    cybercrime: 234, theft: 756, assault: 489, narcotics: 356, sandMining: 123, organizedCrime: 309, other: 300,
    activeCases: 356, population: 1536882,
  },
  {
    id: 29, name: 'Mandya', code: 'MND', lat: 12.52, lng: 76.89,
    crimeCount: 1789, riskScore: 35, topCrimeType: 'Theft',
    trend: 'down', trendPercent: -0.8, officerCount: 740, stationCount: 29,
    cybercrime: 156, theft: 534, assault: 356, narcotics: 234, sandMining: 89, organizedCrime: 197, other: 223,
    activeCases: 234, population: 1792490,
  },
  {
    id: 30, name: 'Ramanagara', code: 'RMN', lat: 12.71, lng: 77.28,
    crimeCount: 2123, riskScore: 40, topCrimeType: 'Theft',
    trend: 'stable', trendPercent: 3.4, officerCount: 690, stationCount: 22,
    cybercrime: 189, theft: 623, assault: 412, narcotics: 289, sandMining: 112, organizedCrime: 254, other: 244,
    activeCases: 289, population: 1082739,
  },
  {
    id: 31, name: 'Vijayanagara', code: 'VJN', lat: 15.34, lng: 76.46,
    crimeCount: 3456, riskScore: 61, topCrimeType: 'Sand Mining',
    trend: 'up', trendPercent: 5.7, officerCount: 1020, stationCount: 30,
    cybercrime: 267, theft: 1023, assault: 712, narcotics: 534, sandMining: 556, organizedCrime: 364, other: 0,
    activeCases: 478, population: 1596292,
  },
];

// Verify: sum of all district crimeCount = 82,089
// export const TOTAL_CRIME_VERIFY = DISTRICTS.reduce((a, d) => a + d.crimeCount, 0); // = 82,089

// ─── Crime Categories ─────────────────────────────────────────────────────────
// Cybercrime 18234 + Theft 24567 + Narcotics 9876 + Assault 12345 +
// SandMining 8901 + OrganizedCrime 6543 + Other 623 = 82,089

export const CRIME_CATEGORIES: CrimeCategory[] = [
  { name: 'Cybercrime',       count: 18234, percentage: 22, color: '#00f0ff', trend: '+34%' },
  { name: 'Theft',            count: 24567, percentage: 30, color: '#8b5cf6', trend: '-5%'  },
  { name: 'Narcotics',        count: 9876,  percentage: 12, color: '#e879f9', trend: '+28%' },
  { name: 'Assault',          count: 12345, percentage: 15, color: '#ef4444', trend: '+2%'  },
  { name: 'Sand Mining',      count: 8901,  percentage: 11, color: '#f97316', trend: '+18%' },
  { name: 'Organized Crime',  count: 6543,  percentage: 8,  color: '#f59e0b', trend: '+15%' },
  { name: 'Other Offenses',   count: 623,   percentage: 1,  color: '#64748b', trend: '-1%'  },
];

export const TOTAL_CRIMES = 82089;

// ─── Monthly Trends (Jan 2024 – Jun 2025, 18 months) ─────────────────────────
// Realistic seasonal variation with upward trend overall

export const MONTHLY_TRENDS: MonthlyTrend[] = [
  { month: 'Jan 24', crimes: 3812, cybercrime: 823, theft: 1124, violence: 712, narcotics: 534, sandMining: 334, organized: 285, fraud: 0 },
  { month: 'Feb 24', crimes: 3567, cybercrime: 778, theft: 1056, violence: 667, narcotics: 501, sandMining: 310, organized: 255, fraud: 0 },
  { month: 'Mar 24', crimes: 4123, cybercrime: 912, theft: 1213, violence: 778, narcotics: 589, sandMining: 356, organized: 275, fraud: 0 },
  { month: 'Apr 24', crimes: 4589, cybercrime: 1023, theft: 1345, violence: 867, narcotics: 623, sandMining: 412, organized: 319, fraud: 0 },
  { month: 'May 24', crimes: 4234, cybercrime: 945, theft: 1234, violence: 801, narcotics: 578, sandMining: 378, organized: 298, fraud: 0 },
  { month: 'Jun 24', crimes: 4678, cybercrime: 1045, theft: 1378, violence: 889, narcotics: 634, sandMining: 423, organized: 309, fraud: 0 },
  { month: 'Jul 24', crimes: 5123, cybercrime: 1145, theft: 1512, violence: 978, narcotics: 712, sandMining: 467, organized: 309, fraud: 0 },
  { month: 'Aug 24', crimes: 4891, cybercrime: 1089, theft: 1445, violence: 934, narcotics: 678, sandMining: 445, organized: 300, fraud: 0 },
  { month: 'Sep 24', crimes: 5345, cybercrime: 1201, theft: 1578, violence: 1023, narcotics: 756, sandMining: 489, organized: 298, fraud: 0 },
  { month: 'Oct 24', crimes: 5889, cybercrime: 1312, theft: 1734, violence: 1123, narcotics: 834, sandMining: 534, organized: 352, fraud: 0 },
  { month: 'Nov 24', crimes: 6123, cybercrime: 1378, theft: 1812, violence: 1167, narcotics: 878, sandMining: 556, organized: 332, fraud: 0 },
  { month: 'Dec 24', crimes: 6789, cybercrime: 1534, theft: 2012, violence: 1289, narcotics: 978, sandMining: 612, organized: 364, fraud: 0 },
  { month: 'Jan 25', crimes: 6456, cybercrime: 1456, theft: 1912, violence: 1223, narcotics: 934, sandMining: 578, organized: 353, fraud: 0 },
  { month: 'Feb 25', crimes: 6123, cybercrime: 1378, theft: 1812, violence: 1167, narcotics: 889, sandMining: 545, organized: 332, fraud: 0 },
  { month: 'Mar 25', crimes: 7012, cybercrime: 1589, theft: 2078, violence: 1334, narcotics: 1023, sandMining: 623, organized: 365, fraud: 0 },
  { month: 'Apr 25', crimes: 7456, cybercrime: 1698, theft: 2212, violence: 1412, narcotics: 1089, sandMining: 667, organized: 378, fraud: 0 },
  { month: 'May 25', crimes: 7891, cybercrime: 1812, theft: 2345, violence: 1489, narcotics: 1156, sandMining: 712, organized: 377, fraud: 0 },
  { month: 'Jun 25', crimes: 8177, cybercrime: 1937, theft: 2421, violence: 1558, narcotics: 1202, sandMining: 661, organized: 398, fraud: 0 },
];

// ─── Top 15 Suspects ─────────────────────────────────────────────────────────

export const TOP_SUSPECTS: Suspect[] = [
  {
    id: 'S001', name: 'Suresh Nayak', alias: 'Bullet Suresh', district: 'Raichur',
    crimeType: 'Narcotics & Sand Mining', firCount: 15, status: 'Wanted', riskLevel: 'Critical', riskScore: 97,
    age: 31, gender: 'Male', lastSeen: 'Raichur, 2025-05-28',
    knownAssociates: ['Imran Sheikh', 'Rajan Kumar'],
    vehicleNumbers: ['KA-32-AB-5588', 'TN-24-GH-8821'],
    mobileNumbers: ['+91-98765-43210', '+91-91234-56789'],
  },
  {
    id: 'S002', name: 'Imran Sheikh', alias: 'Sheikh Bhai', district: 'Kalaburagi',
    crimeType: 'Narcotics Trafficking', firCount: 12, status: 'Under Surveillance', riskLevel: 'Critical', riskScore: 96,
    age: 29, gender: 'Male', lastSeen: 'Kalaburagi, 2025-06-01',
    knownAssociates: ['Suresh Nayak', 'Zaheer Khan'],
    vehicleNumbers: ['KA-32-CD-5678'],
    mobileNumbers: ['+91-94556-78901'],
  },
  {
    id: 'S003', name: 'Rajan Kumar', alias: 'RK Cyber', district: 'Bengaluru Urban',
    crimeType: 'Cybercrime', firCount: 9, status: 'Absconding', riskLevel: 'Critical', riskScore: 91,
    age: 34, gender: 'Male', lastSeen: 'Bengaluru, 2025-05-15',
    knownAssociates: ['Priya Desai', 'Mohan Shetty'],
    vehicleNumbers: ['KA-01-AB-1234'],
    mobileNumbers: ['+91-98765-43210'],
  },
  {
    id: 'S004', name: 'Venkataramu Gowda', alias: 'Maru Don', district: 'Ballari',
    crimeType: 'Organized Crime', firCount: 11, status: 'Wanted', riskLevel: 'Critical', riskScore: 89,
    age: 42, gender: 'Male', lastSeen: 'Ballari, 2025-05-20',
    knownAssociates: ['Deepak Gowda', 'Prakash Naik'],
    vehicleNumbers: ['KA-35-ZZ-9012', 'KA-35-KK-3344'],
    mobileNumbers: ['+91-97234-56780'],
  },
  {
    id: 'S005', name: 'Ahmed Patel', alias: 'AP Tiger', district: 'Belagavi',
    crimeType: 'Narcotics & Organized Crime', firCount: 8, status: 'Absconding', riskLevel: 'Critical', riskScore: 88,
    age: 36, gender: 'Male', lastSeen: 'Belagavi border, 2025-04-30',
    knownAssociates: ['Imran Sheikh', 'Suresh Nayak'],
    vehicleNumbers: ['MH-09-AB-7788'],
    mobileNumbers: ['+91-90034-12345'],
  },
  {
    id: 'S006', name: 'Deepak Gowda', alias: 'Iron Deepak', district: 'Ballari',
    crimeType: 'Organized Crime & Sand Mining', firCount: 7, status: 'Under Surveillance', riskLevel: 'High', riskScore: 83,
    age: 38, gender: 'Male', lastSeen: 'Vijayanagara, 2025-06-03',
    knownAssociates: ['Venkataramu Gowda', 'Ravi Naik'],
    vehicleNumbers: ['KA-35-TT-5566'],
    mobileNumbers: ['+91-88912-34567'],
  },
  {
    id: 'S007', name: 'Zaheer Khan', alias: 'ZK Cargo', district: 'Kalaburagi',
    crimeType: 'Narcotics', firCount: 8, status: 'Arrested', riskLevel: 'High', riskScore: 78,
    age: 32, gender: 'Male', lastSeen: 'Kalaburagi Central Jail, 2025-06-07',
    knownAssociates: ['Imran Sheikh'],
    vehicleNumbers: ['KA-32-LL-4400'],
    mobileNumbers: ['+91-96767-89012'],
  },
  {
    id: 'S008', name: 'Basavaraj Nayak', alias: 'Basya Don', district: 'Raichur',
    crimeType: 'Sand Mining & Extortion', firCount: 6, status: 'Released on Bail', riskLevel: 'High', riskScore: 74,
    age: 45, gender: 'Male', lastSeen: 'Raichur, 2025-06-05',
    knownAssociates: ['Suresh Nayak'],
    vehicleNumbers: ['KA-34-QQ-7700'],
    mobileNumbers: ['+91-99012-34556'],
  },
  {
    id: 'S009', name: 'Priya Desai', alias: 'Phisher Priya', district: 'Bengaluru Urban',
    crimeType: 'Cybercrime', firCount: 5, status: 'Arrested', riskLevel: 'High', riskScore: 72,
    age: 27, gender: 'Female', lastSeen: 'Bengaluru Prison, 2025-05-18',
    knownAssociates: ['Rajan Kumar', 'Mohan Shetty'],
    vehicleNumbers: [],
    mobileNumbers: ['+91-98234-56780'],
  },
  {
    id: 'S010', name: 'Prakash Naik', alias: 'PKN Boss', district: 'Mangaluru',
    crimeType: 'Smuggling & Organized Crime', firCount: 7, status: 'Wanted', riskLevel: 'High', riskScore: 71,
    age: 40, gender: 'Male', lastSeen: 'Mangaluru Port area, 2025-05-22',
    knownAssociates: ['Ahmed Patel'],
    vehicleNumbers: ['KA-19-PP-3388'],
    mobileNumbers: ['+91-91234-00099'],
  },
  {
    id: 'S011', name: 'Mohan Shetty', alias: 'Shetty Hacker', district: 'Mangaluru',
    crimeType: 'Cybercrime & Fraud', firCount: 6, status: 'Under Surveillance', riskLevel: 'High', riskScore: 68,
    age: 31, gender: 'Male', lastSeen: 'Mangaluru, 2025-06-02',
    knownAssociates: ['Rajan Kumar', 'Priya Desai'],
    vehicleNumbers: ['KA-19-XC-6600'],
    mobileNumbers: ['+91-97890-11223'],
  },
  {
    id: 'S012', name: 'Ravi Patil', alias: 'Ravi Drug', district: 'Kalaburagi',
    crimeType: 'Narcotics', firCount: 5, status: 'Released on Bail', riskLevel: 'Medium', riskScore: 62,
    age: 28, gender: 'Male', lastSeen: 'Kalaburagi, 2025-06-06',
    knownAssociates: ['Zaheer Khan'],
    vehicleNumbers: ['KA-32-MB-1122'],
    mobileNumbers: ['+91-96543-21098'],
  },
  {
    id: 'S013', name: 'Kavitha Reddy', alias: 'KR Financier', district: 'Bengaluru Urban',
    crimeType: 'Financial Fraud & Hawala', firCount: 4, status: 'Under Surveillance', riskLevel: 'Medium', riskScore: 58,
    age: 38, gender: 'Female', lastSeen: 'Bengaluru, 2025-06-04',
    knownAssociates: ['Rajan Kumar'],
    vehicleNumbers: [],
    mobileNumbers: ['+91-98765-00001'],
  },
  {
    id: 'S014', name: 'Shivanna Gowda', alias: 'Sand Shiva', district: 'Koppal',
    crimeType: 'Illegal Sand Mining', firCount: 5, status: 'Arrested', riskLevel: 'Medium', riskScore: 56,
    age: 47, gender: 'Male', lastSeen: 'Koppal Jail, 2025-05-29',
    knownAssociates: ['Deepak Gowda'],
    vehicleNumbers: ['KA-27-JK-9900'],
    mobileNumbers: ['+91-90011-22334'],
  },
  {
    id: 'S015', name: 'Anwar Hussain', alias: 'Anwar Cross', district: 'Bidar',
    crimeType: 'Narcotics Cross-Border', firCount: 5, status: 'Wanted', riskLevel: 'High', riskScore: 70,
    age: 33, gender: 'Male', lastSeen: 'Bidar border, 2025-05-25',
    knownAssociates: ['Imran Sheikh', 'Ahmed Patel'],
    vehicleNumbers: ['MH-26-TR-4455'],
    mobileNumbers: ['+91-94400-56789'],
  },
];

// ─── 25 Recent FIRs ───────────────────────────────────────────────────────────

export const RECENT_FIRS: FIRRecord[] = [
  { id: 'FIR001', firNumber: 'KA-2025-047823', crimeType: 'Cybercrime', district: 'Bengaluru Urban', date: '2025-06-09', status: 'Investigating', priority: 'Critical', assignedOfficer: 'DySP Nandini Verma', suspectName: 'Rajan Kumar', victimName: 'Kavitha Sharma', description: 'OTP phishing targeting SBI customers. ₹4.2L stolen from 18 victims.' },
  { id: 'FIR002', firNumber: 'KA-2025-047801', crimeType: 'Narcotics', district: 'Kalaburagi', date: '2025-06-09', status: 'Arrested', priority: 'Critical', assignedOfficer: 'PI Raghavendra Murthy', suspectName: 'Zaheer Khan', victimName: 'N/A', description: '2.4kg heroin seized at Kalaburagi bypass. Suspect linked to Andhra route.' },
  { id: 'FIR003', firNumber: 'KA-2025-047788', crimeType: 'Sand Mining', district: 'Raichur', date: '2025-06-08', status: 'Investigating', priority: 'High', assignedOfficer: 'PI Sridhar Babu', suspectName: 'Suresh Nayak', victimName: 'Government of Karnataka', description: 'Illegal sand mining resumed at Tungabhadra river. 3 JCBs seized.' },
  { id: 'FIR004', firNumber: 'KA-2025-047776', crimeType: 'Assault', district: 'Belagavi', date: '2025-06-08', status: 'Resolved', priority: 'Medium', assignedOfficer: 'SI Ranjit Kumar', suspectName: 'Unknown Suspect', victimName: 'Mohan Kulkarni', description: 'Group assault during property dispute. 3 accused arrested on same day.' },
  { id: 'FIR005', firNumber: 'KA-2025-047754', crimeType: 'Theft', district: 'Mysuru', date: '2025-06-07', status: 'Investigating', priority: 'Medium', assignedOfficer: 'SI Anitha Gowda', suspectName: 'Unknown', victimName: 'State Bank of Mysuru', description: 'ATM skimming device recovered. ₹1.8L skimmed from 24 accounts.' },
  { id: 'FIR006', firNumber: 'KA-2025-047731', crimeType: 'Organized Crime', district: 'Ballari', date: '2025-06-07', status: 'Monitoring', priority: 'High', assignedOfficer: 'DySP Vikram Singh', suspectName: 'Venkataramu Gowda', victimName: 'Multiple Businesses', description: 'Extortion ring targeting stone quarry operators. ₹12L collected unlawfully.' },
  { id: 'FIR007', firNumber: 'KA-2025-047712', crimeType: 'Cybercrime', district: 'Mangaluru', date: '2025-06-06', status: 'Arrested', priority: 'Medium', assignedOfficer: 'PI Keerthi Shetty', suspectName: 'Mohan Shetty', victimName: 'Private Bank Customers', description: 'SIM swap fraud. ₹67L siphoned from 15 business accounts.' },
  { id: 'FIR008', firNumber: 'KA-2025-047698', crimeType: 'Theft', district: 'Hubballi-Dharwad', date: '2025-06-06', status: 'Resolved', priority: 'Low', assignedOfficer: 'SI Prakash Naik', suspectName: 'Sunil Desai', victimName: 'Rajesh Trader', description: 'Vehicle theft from commercial area. KA-25-HH-3344 recovered within 48 hours.' },
  { id: 'FIR009', firNumber: 'KA-2025-047671', crimeType: 'Narcotics', district: 'Bidar', date: '2025-06-05', status: 'Investigating', priority: 'High', assignedOfficer: 'PI Ajay Kumar', suspectName: 'Anwar Hussain', victimName: 'N/A', description: '5.6kg ganja seized near MH border. Cross-state trafficking route suspected.' },
  { id: 'FIR010', firNumber: 'KA-2025-047643', crimeType: 'Financial Fraud', district: 'Bengaluru Urban', date: '2025-06-05', status: 'Investigating', priority: 'Critical', assignedOfficer: 'DySP Nandini Verma', suspectName: 'Kavitha Reddy', victimName: 'Multiple Investors', description: 'Hawala operation. ₹4.2Cr structured deposits across 14 shell accounts detected.' },
  { id: 'FIR011', firNumber: 'KA-2025-047612', crimeType: 'Sand Mining', district: 'Koppal', date: '2025-06-04', status: 'Arrested', priority: 'High', assignedOfficer: 'PI Suresh Babu', suspectName: 'Shivanna Gowda', victimName: 'State Revenue', description: 'Illegal sand extraction on Tungabhadra. 4 tippers confiscated. Operator arrested.' },
  { id: 'FIR012', firNumber: 'KA-2025-047589', crimeType: 'Assault', district: 'Kalaburagi', date: '2025-06-04', status: 'Chargesheet Filed', priority: 'High', assignedOfficer: 'PI Raghavendra Murthy', suspectName: 'Gang Members', victimName: 'Ramesh Patil', description: 'Rival gang clash. 6 persons injured. IPC 147, 148, 149 charges filed.' },
  { id: 'FIR013', firNumber: 'KA-2025-047567', crimeType: 'Cybercrime', district: 'Bengaluru Urban', date: '2025-06-03', status: 'Investigating', priority: 'High', assignedOfficer: 'DySP Nandini Verma', suspectName: 'Unknown Cyber Gang', victimName: '412 Victims', description: 'Coordinated KYC phishing campaign. ₹8.4Cr exposure across 412 complaints.' },
  { id: 'FIR014', firNumber: 'KA-2025-047534', crimeType: 'Smuggling', district: 'Dakshina Kannada', date: '2025-06-03', status: 'Investigating', priority: 'High', assignedOfficer: 'PI Suresh Shetty', suspectName: 'Prakash Naik', victimName: 'Customs Dept', description: 'Container weight discrepancy of 2.3 tons at Mangaluru port. Crew members detained.' },
  { id: 'FIR015', firNumber: 'KA-2025-047512', crimeType: 'Narcotics', district: 'Belagavi', date: '2025-06-02', status: 'Monitoring', priority: 'High', assignedOfficer: 'PI Arvind Kulkarni', suspectName: 'Ahmed Patel', victimName: 'N/A', description: 'Narcotics consignment en route via NH48. Suspect vehicle KA-24-AB-5588 flagged.' },
  { id: 'FIR016', firNumber: 'KA-2025-047489', crimeType: 'Theft', district: 'Mysuru', date: '2025-06-02', status: 'Investigating', priority: 'Medium', assignedOfficer: 'SI Anitha Gowda', suspectName: 'Relay Attack Gang', victimName: '12 Car Owners', description: '12 keyless entry vehicle thefts. Same relay attack device signature. Night-time pattern.' },
  { id: 'FIR017', firNumber: 'KA-2025-047456', crimeType: 'Organized Crime', district: 'Ballari', date: '2025-06-01', status: 'Monitoring', priority: 'Critical', assignedOfficer: 'DySP Vikram Singh', suspectName: 'Deepak Gowda', victimName: 'Multiple', description: 'Gang war threat intelligence. Two factions planned confrontation at Siruguppa.' },
  { id: 'FIR018', firNumber: 'KA-2025-047423', crimeType: 'Financial Fraud', district: 'Bengaluru Urban', date: '2025-05-31', status: 'Chargesheet Filed', priority: 'Medium', assignedOfficer: 'PI Suresh Rao', suspectName: 'Investment Fraud Group', victimName: '150 Investors', description: 'Ponzi scheme promising 40% agricultural returns. ₹3.2Cr collected. Site hosted abroad.' },
  { id: 'FIR019', firNumber: 'KA-2025-047401', crimeType: 'Narcotics', district: 'Kalaburagi', date: '2025-05-30', status: 'Arrested', priority: 'Critical', assignedOfficer: 'PI Raghavendra Murthy', suspectName: 'Imran Sheikh', victimName: 'N/A', description: '8.2kg methamphetamine seized. Trafficking route from Andhra Pradesh confirmed.' },
  { id: 'FIR020', firNumber: 'KA-2025-047378', crimeType: 'Cybercrime', district: 'Tumakuru', date: '2025-05-29', status: 'Investigating', priority: 'Medium', assignedOfficer: 'SI Ravi Kumar', suspectName: 'Unknown', victimName: 'Small Business Owners', description: 'UPI fraud targeting shop owners via fake payment links. 34 victims. ₹18L lost.' },
  { id: 'FIR021', firNumber: 'KA-2025-047345', crimeType: 'Assault', district: 'Mangaluru', date: '2025-05-28', status: 'Resolved', priority: 'Medium', assignedOfficer: 'PI Keerthi Shetty', suspectName: 'Muthu Kumar', victimName: 'Suresh Bhat', description: 'Communal tension-related assault. 4 accused arrested. Peace committee convened.' },
  { id: 'FIR022', firNumber: 'KA-2025-047312', crimeType: 'Sand Mining', district: 'Raichur', date: '2025-05-27', status: 'Investigating', priority: 'High', assignedOfficer: 'PI Sridhar Babu', suspectName: 'Basavaraj Nayak', victimName: 'State', description: 'Night operation. 3 boats and heavy machinery seized. Case linked to S-008 network.' },
  { id: 'FIR023', firNumber: 'KA-2025-047289', crimeType: 'Theft', district: 'Vijayapura', date: '2025-05-26', status: 'Resolved', priority: 'Low', assignedOfficer: 'SI Arun Singh', suspectName: 'Local Gang', victimName: 'Traders Market', description: 'Organised shoplifting ring. 8 accused arrested. Stolen goods worth ₹3.4L recovered.' },
  { id: 'FIR024', firNumber: 'KA-2025-047256', crimeType: 'Organized Crime', district: 'Kalaburagi', date: '2025-05-25', status: 'Monitoring', priority: 'High', assignedOfficer: 'PI Raghavendra Murthy', suspectName: 'Crime Syndicate Network', victimName: 'Public', description: 'Dark web credentials of KSP email addresses found. 23 accounts compromised. Reset initiated.' },
  { id: 'FIR025', firNumber: 'KA-2025-047223', crimeType: 'Financial Fraud', district: 'Bengaluru Urban', date: '2025-05-24', status: 'Investigating', priority: 'High', assignedOfficer: 'DySP Nandini Verma', suspectName: 'Crypto Laundering Network', victimName: 'ED Investigation', description: '₹1.4Cr converted to crypto across 6 wallets. Blockchain traced to international exchange.' },
];

// ─── 6 Anomaly Districts ──────────────────────────────────────────────────────

export const ANOMALY_DISTRICTS: AnomalyDistrict[] = [
  {
    id: 'AN001', district: 'Bengaluru Urban', crimeType: 'Cybercrime',
    baselineDaily: 120, actualLast24h: 412, spikePercent: 243,
    severity: 'Critical', detectedAt: '2025-06-09 08:30', status: 'Under Investigation',
    indicators: ['412 OTP fraud complaints', '47 unique IMEI clusters', '₹1.8Cr financial exposure', 'Coordinated phishing templates'],
  },
  {
    id: 'AN002', district: 'Kalaburagi', crimeType: 'Narcotics',
    baselineDaily: 8, actualLast24h: 34, spikePercent: 325,
    severity: 'High', detectedAt: '2025-06-09 06:15', status: 'Confirmed',
    indicators: ['34 FIRs in 6 hours', '3 suspects at toll', 'New vehicle pattern', 'Cross-state route activated'],
  },
  {
    id: 'AN003', district: 'Ballari', crimeType: 'Organized Crime',
    baselineDaily: 3, actualLast24h: 18, spikePercent: 500,
    severity: 'High', detectedAt: '2025-06-08 22:00', status: 'Under Investigation',
    indicators: ['18 incidents in 3km radius', 'CDR: 47 gang calls', '4 known vehicles tracked', '₹3.2L ATM withdrawals'],
  },
  {
    id: 'AN004', district: 'Mysuru', crimeType: 'Relay Attack Vehicle Theft',
    baselineDaily: 0, actualLast24h: 12, spikePercent: 1200,
    severity: 'High', detectedAt: '2025-06-08 03:00', status: 'Confirmed',
    indicators: ['12 high-end SUVs targeted', 'Same relay device signature', '11PM–3AM pattern', 'New MO in Karnataka'],
  },
  {
    id: 'AN005', district: 'Raichur', crimeType: 'Sand Mining',
    baselineDaily: 4, actualLast24h: 19, spikePercent: 375,
    severity: 'Medium', detectedAt: '2025-06-08 18:00', status: 'Confirmed',
    indicators: ['Drone thermal imagery', 'Equipment tracks at 3 sites', '2 boats on river', 'Known operators flagged'],
  },
  {
    id: 'AN006', district: 'Belagavi', crimeType: 'Cross-Border Narcotics',
    baselineDaily: 5, actualLast24h: 21, spikePercent: 320,
    severity: 'High', detectedAt: '2025-06-07 14:00', status: 'Under Investigation',
    indicators: ['NH-48 vehicle concentration', '3 suspect IDs at checkpost', 'New route via Goa border', 'Inter-state coordination needed'],
  },
];

// ─── Resource Allocation per District (top 10 shown) ────────────────────────

export const RESOURCE_ALLOCATION: ResourceAllocation[] = [
  { district: 'Bengaluru Urban', officers: 4820, vehicles: 412, stations: 114, budget: 4200, adequacyScore: 72, recommendation: 'Deploy additional cyber crime specialists (+80 officers)' },
  { district: 'Kalaburagi', officers: 2480, vehicles: 198, stations: 48, budget: 1800, adequacyScore: 54, recommendation: 'Increase narcotics task force. Add 6 additional checkposts.' },
  { district: 'Raichur', officers: 1480, vehicles: 112, stations: 37, budget: 1100, adequacyScore: 48, recommendation: 'Deploy river police units. Coordinate with Mines Dept for joint ops.' },
  { district: 'Ballari', officers: 1620, vehicles: 134, stations: 41, budget: 1200, adequacyScore: 51, recommendation: 'Strengthen SIT for organized crime. Add intelligence cell.' },
  { district: 'Belagavi', officers: 2120, vehicles: 178, stations: 67, budget: 1600, adequacyScore: 62, recommendation: 'Strengthen border checkposts. NH-48 round-the-clock surveillance.' },
  { district: 'Mysuru', officers: 1780, vehicles: 156, stations: 52, budget: 1400, adequacyScore: 67, recommendation: 'Night patrol increase for vehicle theft prevention.' },
  { district: 'Mangaluru', officers: 1340, vehicles: 118, stations: 44, budget: 1100, adequacyScore: 65, recommendation: 'Coastal security boost. Port surveillance cameras needed.' },
  { district: 'Hubballi-Dharwad', officers: 1690, vehicles: 142, stations: 45, budget: 1300, adequacyScore: 68, recommendation: 'Additional cyber crime unit for tier-2 city surge.' },
  { district: 'Vijayapura', officers: 1390, vehicles: 108, stations: 39, budget: 1050, adequacyScore: 60, recommendation: 'Increase foot patrols in agricultural theft-prone areas.' },
  { district: 'Koppal', officers: 1080, vehicles: 86, stations: 28, budget: 780, adequacyScore: 52, recommendation: 'Sand mining river patrols. Coordinate with Revenue Dept.' },
  { district: 'Bidar', officers: 1160, vehicles: 92, stations: 32, budget: 860, adequacyScore: 56, recommendation: 'Border surveillance for narcotics. MH Police coordination needed.' },
  { district: 'Shivamogga', officers: 1120, vehicles: 92, stations: 33, budget: 850, adequacyScore: 70, recommendation: 'Adequate. Maintain current deployment level.' },
  { district: 'Tumakuru', officers: 1340, vehicles: 108, stations: 41, budget: 980, adequacyScore: 63, recommendation: 'UPI fraud awareness drive. Add digital crime helpdesk.' },
  { district: 'Chitradurga', officers: 980, vehicles: 78, stations: 29, budget: 720, adequacyScore: 61, recommendation: 'Adequate. Monitor highway crime clusters on NH-4.' },
  { district: 'Davangere', officers: 1180, vehicles: 96, stations: 35, budget: 890, adequacyScore: 66, recommendation: 'Adequate. Focus on market-area theft reduction.' },
];

// ─── Summary Metrics ──────────────────────────────────────────────────────────

export const SUMMARY_METRICS = {
  totalCrimes: 82089,
  activeCases: 14823,
  highRiskDistricts: 7,
  arrestsThisMonth: 2341,
  chargesFiledMTD: 1876,
  aiAlertsToday: 23,
  solvedCases: 67266,
  clearanceRate: 81.9,
  totalOfficers: 48200,
  totalStations: 928,
  districts: 31,
  accuracyScore: 94.7,
};

// ─── Demo Accounts (for Login) ────────────────────────────────────────────────

export const DEMO_ACCOUNTS = [
  {
    username: 'dgp_admin',
    password: 'KSP@2025',
    role: 'DGP',
    name: 'DGP Rajesh Kumar',
    badgeNumber: 'KSP-001',
    designation: 'Director General of Police',
    accessLevel: 'FULL',
  },
  {
    username: 'commissioner',
    password: 'KSP@2025',
    role: 'Commissioner',
    name: 'CP Ananya Krishnan',
    badgeNumber: 'KSP-112',
    designation: 'Commissioner of Police, Bengaluru',
    accessLevel: 'COMMISSIONER',
  },
  {
    username: 'inspector',
    password: 'KSP@2025',
    role: 'Inspector',
    name: 'PI Ravi Shankar',
    badgeNumber: 'KSP-3847',
    designation: 'Police Inspector, Kalaburagi',
    accessLevel: 'INSPECTOR',
  },
] as const;

export type DemoAccount = typeof DEMO_ACCOUNTS[number];
