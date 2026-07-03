// Karnataka Crime Data - Mock Dataset
// Karnataka State Police - CrimeVision AI Intelligence Platform v2.0

// ─────────────────────────────────────────────
// CORE DISTRICT DATA
// ─────────────────────────────────────────────

export const KARNATAKA_DISTRICTS = [
  { id: 1, name: "Bengaluru Urban", code: "BLR", lat: 12.97, lng: 77.59, riskLevel: "critical", crimeCount: 14823, activeCases: 2341, crimeRate: 48.2, population: 12476000, change: +8.3, policeStations: 114, cyberCrimes: 4231, theft: 3892, assault: 1823, fraud: 2341, narcotics: 1456, organized: 1080 },
  { id: 2, name: "Bengaluru Rural", code: "BLRR", lat: 13.0, lng: 77.4, riskLevel: "high", crimeCount: 3241, activeCases: 478, crimeRate: 29.1, population: 990923, change: +4.1, policeStations: 34, cyberCrimes: 456, theft: 987, assault: 534, fraud: 623, narcotics: 389, organized: 252 },
  { id: 3, name: "Mysuru", code: "MYS", lat: 12.29, lng: 76.64, riskLevel: "medium", crimeCount: 5678, activeCases: 823, crimeRate: 32.4, population: 3001127, change: -2.1, policeStations: 52, cyberCrimes: 892, theft: 1678, assault: 934, fraud: 1012, narcotics: 678, organized: 484 },
  { id: 4, name: "Mangaluru", code: "MNG", lat: 12.86, lng: 74.84, riskLevel: "high", crimeCount: 4321, activeCases: 612, crimeRate: 36.7, population: 2089649, change: +5.8, policeStations: 44, cyberCrimes: 678, theft: 1234, assault: 789, fraud: 867, narcotics: 489, organized: 264 },
  { id: 5, name: "Belagavi", code: "BLG", lat: 15.85, lng: 74.50, riskLevel: "high", crimeCount: 6234, activeCases: 934, crimeRate: 38.2, population: 4214505, change: +3.2, policeStations: 67, cyberCrimes: 734, theft: 1892, assault: 1234, fraud: 1067, narcotics: 834, organized: 473 },
  { id: 6, name: "Kalaburagi", code: "KLG", lat: 17.33, lng: 76.82, riskLevel: "critical", crimeCount: 7891, activeCases: 1234, crimeRate: 44.8, population: 2564892, change: +11.2, policeStations: 48, cyberCrimes: 923, theft: 2341, assault: 1678, fraud: 1234, narcotics: 1123, organized: 592 },
  { id: 7, name: "Hubballi-Dharwad", code: "HBD", lat: 15.35, lng: 75.14, riskLevel: "high", crimeCount: 5432, activeCases: 756, crimeRate: 35.9, population: 2143792, change: +2.4, policeStations: 45, cyberCrimes: 623, theft: 1567, assault: 1034, fraud: 923, narcotics: 734, organized: 551 },
  { id: 8, name: "Ballari", code: "BLL", lat: 15.14, lng: 76.92, riskLevel: "critical", crimeCount: 6789, activeCases: 1087, crimeRate: 42.3, population: 2532383, change: +9.7, policeStations: 41, cyberCrimes: 534, theft: 1923, assault: 1456, fraud: 934, narcotics: 1067, organized: 875 },
  { id: 9, name: "Vijayapura", code: "VJP", lat: 16.83, lng: 75.72, riskLevel: "high", crimeCount: 4567, activeCases: 698, crimeRate: 34.6, population: 2175102, change: +1.9, policeStations: 39, cyberCrimes: 423, theft: 1345, assault: 878, fraud: 789, narcotics: 645, organized: 487 },
  { id: 10, name: "Shivamogga", code: "SHV", lat: 13.93, lng: 75.56, riskLevel: "medium", crimeCount: 3234, activeCases: 423, crimeRate: 26.8, population: 1752753, change: -3.4, policeStations: 33, cyberCrimes: 312, theft: 934, assault: 623, fraud: 567, narcotics: 445, organized: 353 },
  { id: 11, name: "Tumakuru", code: "TMK", lat: 13.34, lng: 77.10, riskLevel: "medium", crimeCount: 4123, activeCases: 534, crimeRate: 28.9, population: 2678980, change: -1.2, policeStations: 41, cyberCrimes: 389, theft: 1234, assault: 789, fraud: 634, narcotics: 523, organized: 554 },
  { id: 12, name: "Raichur", code: "RCH", lat: 16.21, lng: 77.36, riskLevel: "critical", crimeCount: 5678, activeCases: 876, crimeRate: 41.2, population: 1924773, change: +13.8, policeStations: 37, cyberCrimes: 423, theft: 1567, assault: 1234, fraud: 734, narcotics: 923, organized: 797 },
  { id: 13, name: "Koppal", code: "KPL", lat: 15.35, lng: 76.16, riskLevel: "high", crimeCount: 3456, activeCases: 512, crimeRate: 35.1, population: 1391290, change: +6.3, policeStations: 28, cyberCrimes: 234, theft: 1023, assault: 678, fraud: 489, narcotics: 567, organized: 465 },
  { id: 14, name: "Yadgir", code: "YDG", lat: 16.77, lng: 77.14, riskLevel: "high", crimeCount: 3123, activeCases: 456, crimeRate: 33.8, population: 1172985, change: +7.8, policeStations: 24, cyberCrimes: 189, theft: 923, assault: 623, fraud: 412, narcotics: 534, organized: 442 },
  { id: 15, name: "Chikkamagaluru", code: "CMG", lat: 13.32, lng: 75.77, riskLevel: "low", crimeCount: 1234, activeCases: 178, crimeRate: 16.2, population: 1137754, change: -5.6, policeStations: 22, cyberCrimes: 123, theft: 389, assault: 267, fraud: 234, narcotics: 145, organized: 76 },
  { id: 16, name: "Hassan", code: "HSN", lat: 13.01, lng: 76.10, riskLevel: "low", crimeCount: 1567, activeCases: 212, crimeRate: 17.8, population: 1776421, change: -2.3, policeStations: 26, cyberCrimes: 145, theft: 489, assault: 312, fraud: 289, narcotics: 178, organized: 154 },
  { id: 17, name: "Dakshina Kannada", code: "DKN", lat: 12.84, lng: 75.30, riskLevel: "medium", crimeCount: 2345, activeCases: 334, crimeRate: 24.5, population: 2083519, change: +0.8, policeStations: 31, cyberCrimes: 289, theft: 678, assault: 489, fraud: 534, narcotics: 212, organized: 143 },
  { id: 18, name: "Udupi", code: "UDP", lat: 13.35, lng: 74.75, riskLevel: "low", crimeCount: 1123, activeCases: 156, crimeRate: 14.9, population: 1177361, change: -1.4, policeStations: 19, cyberCrimes: 167, theft: 334, assault: 212, fraud: 245, narcotics: 112, organized: 53 },
  { id: 19, name: "Kodagu", code: "KDG", lat: 12.33, lng: 75.78, riskLevel: "low", crimeCount: 678, activeCases: 89, crimeRate: 12.1, population: 554762, change: -4.2, policeStations: 14, cyberCrimes: 67, theft: 212, assault: 134, fraud: 123, narcotics: 89, organized: 53 },
  { id: 20, name: "Chitradurga", code: "CTD", lat: 14.23, lng: 76.40, riskLevel: "medium", crimeCount: 2789, activeCases: 398, crimeRate: 27.4, population: 1660378, change: +1.5, policeStations: 29, cyberCrimes: 223, theft: 823, assault: 567, fraud: 489, narcotics: 389, organized: 298 },
  { id: 21, name: "Davangere", code: "DVG", lat: 14.46, lng: 75.92, riskLevel: "medium", crimeCount: 3567, activeCases: 478, crimeRate: 30.2, population: 1946905, change: +0.7, policeStations: 35, cyberCrimes: 312, theft: 1067, assault: 734, fraud: 578, narcotics: 512, organized: 364 },
  { id: 22, name: "Gadag", code: "GDG", lat: 15.41, lng: 75.63, riskLevel: "medium", crimeCount: 2134, activeCases: 298, crimeRate: 24.8, population: 1065235, change: +2.1, policeStations: 23, cyberCrimes: 178, theft: 634, assault: 445, fraud: 367, narcotics: 289, organized: 221 },
  { id: 23, name: "Dharwad", code: "DHW", lat: 15.46, lng: 74.99, riskLevel: "medium", crimeCount: 2678, activeCases: 376, crimeRate: 26.3, population: 1848914, change: -0.5, policeStations: 31, cyberCrimes: 245, theft: 789, assault: 534, fraud: 445, narcotics: 367, organized: 298 },
  { id: 24, name: "Bagalkot", code: "BGL", lat: 16.18, lng: 75.70, riskLevel: "high", crimeCount: 4234, activeCases: 612, crimeRate: 37.6, population: 1890192, change: +5.1, policeStations: 36, cyberCrimes: 312, theft: 1234, assault: 878, fraud: 634, narcotics: 712, organized: 464 },
  { id: 25, name: "Bidar", code: "BDR", lat: 17.91, lng: 77.52, riskLevel: "high", crimeCount: 3789, activeCases: 534, crimeRate: 36.2, population: 1700018, change: +4.6, policeStations: 32, cyberCrimes: 267, theft: 1123, assault: 789, fraud: 578, narcotics: 623, organized: 409 },
  { id: 26, name: "Chamarajanagar", code: "CMJ", lat: 11.92, lng: 76.94, riskLevel: "low", crimeCount: 1234, activeCases: 167, crimeRate: 15.3, population: 1020791, change: -3.1, policeStations: 21, cyberCrimes: 89, theft: 389, assault: 267, fraud: 212, narcotics: 167, organized: 110 },
  { id: 27, name: "Chikkaballapur", code: "CKB", lat: 13.43, lng: 77.73, riskLevel: "medium", crimeCount: 2345, activeCases: 312, crimeRate: 23.7, population: 1255104, change: +1.8, policeStations: 25, cyberCrimes: 212, theft: 689, assault: 445, fraud: 389, narcotics: 312, organized: 298 },
  { id: 28, name: "Kolar", code: "KLR", lat: 13.13, lng: 78.13, riskLevel: "medium", crimeCount: 2567, activeCases: 356, crimeRate: 25.2, population: 1536882, change: +2.3, policeStations: 27, cyberCrimes: 234, theft: 756, assault: 489, fraud: 423, narcotics: 356, organized: 309 },
  { id: 29, name: "Mandya", code: "MND", lat: 12.52, lng: 76.89, riskLevel: "low", crimeCount: 1789, activeCases: 234, crimeRate: 18.4, population: 1792490, change: -0.8, policeStations: 29, cyberCrimes: 156, theft: 534, assault: 356, fraud: 312, narcotics: 234, organized: 197 },
  { id: 30, name: "Ramanagara", code: "RMN", lat: 12.71, lng: 77.28, riskLevel: "medium", crimeCount: 2123, activeCases: 289, crimeRate: 22.6, population: 1082739, change: +3.4, policeStations: 22, cyberCrimes: 189, theft: 623, assault: 412, fraud: 356, narcotics: 289, organized: 254 },
  { id: 31, name: "Vijayanagara", code: "VJN", lat: 15.34, lng: 76.46, riskLevel: "high", crimeCount: 3456, activeCases: 478, crimeRate: 33.1, population: 1596292, change: +5.7, policeStations: 30, cyberCrimes: 267, theft: 1023, assault: 712, fraud: 556, narcotics: 534, organized: 364 },
];

// ─────────────────────────────────────────────
// CRIME CATEGORIES
// ─────────────────────────────────────────────

export const CRIME_CATEGORIES = [
  { name: "Cybercrime", count: 18234, percentage: 22, color: "#0F6B5C", trend: "+34%", icon: "monitor" },
  { name: "Theft & Burglary", count: 24567, percentage: 30, color: "#8b5cf6", trend: "-5%", icon: "package" },
  { name: "Sand Mining", count: 8901, percentage: 11, color: "#f97316", trend: "+18%", icon: "layers" },
  { name: "Assault & Violence", count: 12345, percentage: 15, color: "#ef4444", trend: "+2%", icon: "shield-alert" },
  { name: "Narcotic Trafficking", count: 9876, percentage: 12, color: "#e879f9", trend: "+28%", icon: "flask-conical" },
  { name: "Organized Crime", count: 6543, percentage: 8, color: "#f59e0b", trend: "+15%", icon: "users" },
  { name: "Other Offenses", count: 1623, percentage: 2, color: "#64748b", trend: "-1%", icon: "more-horizontal" },
];

// ─────────────────────────────────────────────
// CRIME TRENDS
// ─────────────────────────────────────────────

export const MONTHLY_CRIME_TRENDS = [
  { month: "Jan 24", crimes: 5234, cybercrime: 1123, violence: 989, narcotics: 756, organized: 445, fraud: 921 },
  { month: "Feb 24", crimes: 4987, cybercrime: 1045, violence: 934, narcotics: 712, organized: 412, fraud: 884 },
  { month: "Mar 24", crimes: 5678, cybercrime: 1234, violence: 1012, narcotics: 823, organized: 498, fraud: 1111 },
  { month: "Apr 24", crimes: 6123, cybercrime: 1345, violence: 1123, narcotics: 867, organized: 534, fraud: 1254 },
  { month: "May 24", crimes: 5891, cybercrime: 1289, violence: 1089, narcotics: 834, organized: 512, fraud: 1167 },
  { month: "Jun 24", crimes: 6456, cybercrime: 1412, violence: 1198, narcotics: 912, organized: 578, fraud: 1356 },
  { month: "Jul 24", crimes: 7123, cybercrime: 1589, violence: 1312, narcotics: 1023, organized: 634, fraud: 1565 },
  { month: "Aug 24", crimes: 6789, cybercrime: 1467, violence: 1234, narcotics: 978, organized: 598, fraud: 1512 },
  { month: "Sep 24", crimes: 7456, cybercrime: 1634, violence: 1378, narcotics: 1089, organized: 667, fraud: 1688 },
  { month: "Oct 24", crimes: 7891, cybercrime: 1756, violence: 1456, narcotics: 1123, organized: 712, fraud: 1844 },
  { month: "Nov 24", crimes: 8234, cybercrime: 1845, violence: 1512, narcotics: 1187, organized: 745, fraud: 1945 },
  { month: "Dec 24", crimes: 8901, cybercrime: 1989, violence: 1634, narcotics: 1267, organized: 801, fraud: 2210 },
  { month: "Jan 25", crimes: 8456, cybercrime: 1912, violence: 1556, narcotics: 1212, organized: 778, fraud: 1998 },
  { month: "Feb 25", crimes: 7998, cybercrime: 1834, violence: 1467, narcotics: 1145, organized: 734, fraud: 1818 },
  { month: "Mar 25", crimes: 9123, cybercrime: 2056, violence: 1678, narcotics: 1312, organized: 834, fraud: 2243 },
  { month: "Apr 25", crimes: 9567, cybercrime: 2189, violence: 1756, narcotics: 1367, organized: 867, fraud: 2388 },
  { month: "May 25", crimes: 9891, cybercrime: 2267, violence: 1823, narcotics: 1412, organized: 912, fraud: 2477 },
  { month: "Jun 25", crimes: 10234, cybercrime: 2345, violence: 1889, narcotics: 1456, organized: 945, fraud: 2599 },
];

export const RISK_FORECAST = [
  { month: "Jul 25", predicted: 10800, low: 10200, high: 11400, confidence: 78 },
  { month: "Aug 25", predicted: 11200, low: 10400, high: 12000, confidence: 74 },
  { month: "Sep 25", predicted: 11800, low: 10800, high: 12800, confidence: 70 },
  { month: "Oct 25", predicted: 12400, low: 11200, high: 13600, confidence: 66 },
  { month: "Nov 25", predicted: 12900, low: 11600, high: 14200, confidence: 62 },
  { month: "Dec 25", predicted: 13600, low: 12100, high: 15100, confidence: 58 },
];

export const DISTRICT_RISK_SCORES = [
  { name: "Bengaluru Urban", score: 94, predictedIncrease: "+8.3%" },
  { name: "Kalaburagi", score: 87, predictedIncrease: "+11.2%" },
  { name: "Raichur", score: 84, predictedIncrease: "+13.8%" },
  { name: "Ballari", score: 81, predictedIncrease: "+9.7%" },
  { name: "Belagavi", score: 76, predictedIncrease: "+3.2%" },
  { name: "Mangaluru", score: 72, predictedIncrease: "+5.8%" },
  { name: "Hubballi-Dharwad", score: 69, predictedIncrease: "+2.4%" },
  { name: "Vijayapura", score: 64, predictedIncrease: "+1.9%" },
];

// ─────────────────────────────────────────────
// SUMMARY METRICS
// ─────────────────────────────────────────────

export const SUMMARY_METRICS = {
  totalCrimes: 82089,
  activeCases: 14823,
  highRiskDistricts: 7,
  arrestsThisMonth: 2341,
  chargesFiledMTD: 1876,
  aiAlertsToday: 23,
  solvedCases: 67823,
  clearanceRate: 82.6,
};

export const RECENT_INCIDENTS = [
  { id: "KA-2025-047823", type: "Cybercrime", district: "Bengaluru Urban", time: "10:23 AM", status: "investigating", priority: "high" },
  { id: "KA-2025-047801", type: "Narcotics", district: "Kalaburagi", time: "09:45 AM", status: "arrested", priority: "critical" },
  { id: "KA-2025-047788", type: "Sand Mining", district: "Raichur", time: "08:12 AM", status: "investigating", priority: "high" },
  { id: "KA-2025-047776", type: "Assault", district: "Belagavi", time: "07:30 AM", status: "resolved", priority: "medium" },
  { id: "KA-2025-047754", type: "Theft", district: "Mysuru", time: "06:55 AM", status: "investigating", priority: "medium" },
  { id: "KA-2025-047731", type: "Organized Crime", district: "Ballari", time: "05:20 AM", status: "monitoring", priority: "high" },
  { id: "KA-2025-047712", type: "Cybercrime", district: "Mangaluru", time: "04:48 AM", status: "arrested", priority: "medium" },
  { id: "KA-2025-047698", type: "Vehicle Theft", district: "Hubballi", time: "03:15 AM", status: "resolved", priority: "low" },
];

// ─────────────────────────────────────────────
// EXPANDED CRIMINAL NETWORK
// ─────────────────────────────────────────────

export const CRIMINAL_NETWORK = {
  nodes: [
    // Suspects
    { id: "s1", label: "Rajan Kumar", type: "suspect", risk: "high", district: "Bengaluru Urban", crimes: 7, age: 34, status: "Wanted" },
    { id: "s2", label: "Imran Sheikh", type: "suspect", risk: "critical", district: "Kalaburagi", crimes: 12, age: 29, status: "Under Surveillance" },
    { id: "s3", label: "Venkatesh Rao", type: "suspect", risk: "medium", district: "Mysuru", crimes: 4, age: 41, status: "Arrested" },
    { id: "s4", label: "Ahmed Patel", type: "suspect", risk: "high", district: "Belagavi", crimes: 8, age: 36, status: "Absconding" },
    { id: "s5", label: "Suresh Nayak", type: "suspect", risk: "critical", district: "Raichur", crimes: 15, age: 31, status: "Wanted" },
    { id: "s6", label: "Priya Desai", type: "suspect", risk: "medium", district: "Mangaluru", crimes: 3, age: 27, status: "Released on Bail" },
    { id: "s7", label: "Deepak Gowda", type: "suspect", risk: "high", district: "Ballari", crimes: 6, age: 38, status: "Under Surveillance" },
    // Victims
    { id: "v1", label: "Kavitha Sharma", type: "victim", risk: "low", district: "Bengaluru Urban", crimes: 0, age: 52, status: "Protected" },
    { id: "v2", label: "Mohan Reddy", type: "victim", risk: "low", district: "Mysuru", crimes: 0, age: 45, status: "Witness" },
    { id: "v3", label: "Ananya Bhat", type: "victim", risk: "low", district: "Mangaluru", crimes: 0, age: 38, status: "Protected" },
    // Crime Incidents
    { id: "c1", label: "Cybercrime Ring", type: "crime", category: "Cybercrime", crimeId: "KA-2025-CR-1823" },
    { id: "c2", label: "Narcotics Network", type: "crime", category: "Narcotic Trafficking", crimeId: "KA-2025-CR-0934" },
    { id: "c3", label: "Sand Mafia Op", type: "crime", category: "Sand Mining", crimeId: "KA-2025-CR-2341" },
    { id: "c4", label: "Robbery Series", type: "crime", category: "Theft", crimeId: "KA-2025-CR-1567" },
    { id: "c5", label: "Organized Extortion", type: "crime", category: "Organized Crime", crimeId: "KA-2025-CR-0812" },
    // Locations
    { id: "l1", label: "Bengaluru Urban", type: "location", district: "Bengaluru Urban" },
    { id: "l2", label: "Kalaburagi", type: "location", district: "Kalaburagi" },
    { id: "l3", label: "Belagavi", type: "location", district: "Belagavi" },
    { id: "l4", label: "Raichur", type: "location", district: "Raichur" },
    { id: "l5", label: "Ballari", type: "location", district: "Ballari" },
    // Vehicles
    { id: "veh1", label: "KA-01-AB-1234", type: "vehicle", risk: "high", district: "Bengaluru Urban", crimes: 3, age: 0, status: "Impounded" },
    { id: "veh2", label: "KA-32-CD-5678", type: "vehicle", risk: "medium", district: "Kalaburagi", crimes: 2, age: 0, status: "Flagged" },
    // Bank Accounts
    { id: "ba1", label: "SBI ****4521", type: "bank", risk: "critical", district: "Bengaluru Urban", crimes: 5, age: 0, status: "Frozen" },
    { id: "ba2", label: "HDFC ****8823", type: "bank", risk: "high", district: "Kalaburagi", crimes: 3, age: 0, status: "Under Investigation" },
    // Mobile Numbers
    { id: "mob1", label: "+91-98765-43210", type: "mobile", risk: "high", district: "Bengaluru Urban", crimes: 4, age: 0, status: "Monitored" },
    { id: "mob2", label: "+91-91234-56789", type: "mobile", risk: "medium", district: "Raichur", crimes: 2, age: 0, status: "Flagged" },
  ],
  links: [
    { source: "s1", target: "c1", strength: 3 },
    { source: "s2", target: "c2", strength: 5 },
    { source: "s2", target: "c5", strength: 4 },
    { source: "s3", target: "c3", strength: 2 },
    { source: "s4", target: "c3", strength: 3 },
    { source: "s5", target: "c2", strength: 6 },
    { source: "s5", target: "c4", strength: 4 },
    { source: "s6", target: "c1", strength: 2 },
    { source: "s7", target: "c4", strength: 3 },
    { source: "s7", target: "c5", strength: 3 },
    { source: "c1", target: "l1", strength: 4 },
    { source: "c2", target: "l2", strength: 5 },
    { source: "c2", target: "l4", strength: 4 },
    { source: "c3", target: "l3", strength: 3 },
    { source: "c4", target: "l5", strength: 3 },
    { source: "c5", target: "l2", strength: 4 },
    { source: "s1", target: "s6", strength: 2 },
    { source: "s2", target: "s5", strength: 5 },
    { source: "s4", target: "s7", strength: 2 },
    { source: "c1", target: "v1", strength: 3 },
    { source: "c3", target: "v2", strength: 2 },
    { source: "c1", target: "v3", strength: 2 },
    { source: "s1", target: "veh1", strength: 3 },
    { source: "s2", target: "veh2", strength: 2 },
    { source: "c1", target: "ba1", strength: 4 },
    { source: "s2", target: "ba2", strength: 3 },
    { source: "s1", target: "mob1", strength: 3 },
    { source: "s5", target: "mob2", strength: 2 },
  ],
};

export const NETWORK_NODE_DETAILS: Record<string, {
  name: string; type: string; age?: number; riskScore?: number; status: string;
  crimeHistory?: string[]; knownAssociates?: string[]; linkedCrimes?: string[];
  investigationStatus?: string; detail?: string;
}> = {
  s1: { name: "Rajan Kumar", type: "Suspect", age: 34, riskScore: 82, status: "Wanted", crimeHistory: ["UPI Phishing (2024)", "ATM Skimming (2023)", "Identity Fraud (2022)"], knownAssociates: ["Priya Desai", "Unknown Contact X-7"], linkedCrimes: ["Cybercrime Ring KA-1823", "Bank Fraud Series"], investigationStatus: "Active Hunt" },
  s2: { name: "Imran Sheikh", type: "Suspect", age: 29, riskScore: 96, status: "Under Surveillance", crimeHistory: ["Narcotics Transport (2024)", "Cross-Border Smuggling (2023)", "Extortion (2022)", "Gang Violence (2021)"], knownAssociates: ["Suresh Nayak", "Karachi Contact K-12"], linkedCrimes: ["Narcotics Network KA-0934", "Organized Extortion KA-0812"], investigationStatus: "Priority Target" },
  s5: { name: "Suresh Nayak", type: "Suspect", age: 31, riskScore: 97, status: "Wanted", crimeHistory: ["Drug Trafficking (2024)", "Armed Robbery (2023)", "Murder Attempt (2023)", "Extortion (2022)", "Theft (2021)"], knownAssociates: ["Imran Sheikh", "Raichur Gang Leader"], linkedCrimes: ["Narcotics Network KA-0934", "Robbery Series KA-1567"], investigationStatus: "Red Corner Notice" },
  veh1: { name: "KA-01-AB-1234 (Innova)", type: "Vehicle", age: 0, riskScore: 0, status: "Impounded", detail: "Used in 3 crime incidents. Registered to shell company.", linkedCrimes: ["Cybercrime Ring KA-1823"], investigationStatus: "Forensic Analysis" },
  ba1: { name: "SBI Account ****4521", type: "Bank Account", age: 0, riskScore: 0, status: "Frozen", detail: "₹14.2L suspicious transfers detected. Account frozen per court order.", linkedCrimes: ["Cybercrime Ring KA-1823"], investigationStatus: "ED Investigation" },
  mob1: { name: "+91-98765-43210", type: "Mobile Number", age: 0, riskScore: 0, status: "Monitored", detail: "IMEI linked to 3 SIM cards. Active in Koramangala/Whitefield corridors.", linkedCrimes: ["Cybercrime Ring KA-1823"], investigationStatus: "Tapped & Monitored" },
  v1: { name: "Kavitha Sharma", type: "Victim", age: 52, riskScore: 0, status: "Protected", crimeHistory: [], knownAssociates: [], linkedCrimes: ["Cybercrime Ring KA-1823"], investigationStatus: "Witness Protection" },
  c1: { name: "Cybercrime Ring", type: "Crime Cluster", age: 0, riskScore: 0, status: "Under Investigation", detail: "OTP phishing ring operating across 6 districts. 412 victims. ₹2.3Cr stolen.", linkedCrimes: ["KA-2025-CR-1823"], investigationStatus: "SIT Formed" },
};

// ─────────────────────────────────────────────
// AI ALERTS
// ─────────────────────────────────────────────

export const AI_ALERTS = [
  {
    id: 1, severity: "critical",
    title: "Cybercrime Surge Detected — Bengaluru Urban",
    description: "AI pattern analysis detected a 47% spike in OTP phishing attacks targeting citizens in Koramangala and Whitefield zones. Multiple IMEI clusters identified.",
    timestamp: "2 minutes ago", confidence: 94,
    recommendation: "Deploy Cyber Crime Cell Task Force to affected zones immediately.",
    tags: ["Cybercrime", "Phishing", "Bengaluru"],
    why: "Increase in UPI fraud complaints matches known phishing pattern template #47B. 412 unique complaints filed in last 48 hours.",
    affectedDistricts: ["Bengaluru Urban", "Bengaluru Rural"],
    evidence: "412 cyber fraud complaints, 23 unique IMEI clusters, ₹1.8Cr financial exposure identified",
  },
  {
    id: 2, severity: "high",
    title: "Cross-Border Narcotics Route Identified — Belagavi",
    description: "Network analysis reveals new trafficking route via NH-48 connecting Goa border to Kalaburagi. 3 known suspects flagged at toll booths.",
    timestamp: "18 minutes ago", confidence: 87,
    recommendation: "Set up inter-district checkpost coordination with Maharashtra Police.",
    tags: ["Narcotics", "Trafficking", "Belagavi"],
    why: "Suspect vehicle movement patterns cross-matched with 6 prior narcotics seizure locations. Timing consistent with full-moon transit pattern.",
    affectedDistricts: ["Belagavi", "Kalaburagi", "Dharwad"],
    evidence: "3 flagged suspects at Khanapur toll, vehicle KA-32-CD-5678 flagged, 2kg sample seizure at border",
  },
  {
    id: 3, severity: "high",
    title: "Illegal Sand Mining Resumed — Raichur",
    description: "Satellite imagery and drone surveillance confirms resumption of illegal sand mining in 3 locations along Tungabhadra river.",
    timestamp: "1 hour ago", confidence: 91,
    recommendation: "Coordinate with Mines Department and deploy river police patrol.",
    tags: ["Sand Mining", "Raichur", "Environmental"],
    why: "Drone thermal imagery shows equipment activity matching prior sand mining operations at GPS coordinates flagged in 2024 FIR.",
    affectedDistricts: ["Raichur", "Koppal"],
    evidence: "Drone footage from 3 locations, equipment tracks consistent with JCB machinery, 2 boats spotted",
  },
  {
    id: 4, severity: "medium",
    title: "Organized Gang Activity — Ballari District",
    description: "Communication intercept analysis shows coordinated activity between 7 known associates of the Ballari organized crime syndicate.",
    timestamp: "3 hours ago", confidence: 78,
    recommendation: "Increase surveillance on flagged locations. Notify SIT team.",
    tags: ["Organized Crime", "Ballari"],
    why: "Call detail records show 47 cross-calls between flagged numbers over 6-hour window — 3x above baseline.",
    affectedDistricts: ["Ballari", "Vijayanagara"],
    evidence: "47 inter-communication events, 4 vehicles tracked near known hideout, ₹3.2L unusual ATM withdrawals",
  },
  {
    id: 5, severity: "medium",
    title: "Port Security Anomaly — Mangaluru",
    description: "Container vessel movement patterns deviate from declared shipping manifest. Cross-referencing against known smuggling routes.",
    timestamp: "5 hours ago", confidence: 72,
    recommendation: "Coordinate with Customs and Coastal Security Group for immediate inspection.",
    tags: ["Smuggling", "Mangaluru", "Port"],
    why: "Vessel AIS tracking shows 4-hour position gap consistent with offshore transfer activity. Weight manifest discrepancy of 2.3 tons detected.",
    affectedDistricts: ["Dakshina Kannada", "Udupi"],
    evidence: "AIS gap 04:12–08:34, weight discrepancy 2.3 tons, 2 crew members with prior records",
  },
  {
    id: 6, severity: "low",
    title: "Vehicle Theft Cluster — Mysuru North",
    description: "Statistical clustering identifies 12 vehicle theft incidents sharing modus operandi in Mysuru North zone over 14 days.",
    timestamp: "8 hours ago", confidence: 82,
    recommendation: "Review CCTV footage from flagged corridors and increase patrol frequency.",
    tags: ["Theft", "Mysuru", "Vehicle"],
    why: "All 12 thefts occur between 11PM–3AM, target high-end SUVs, same relay attack device signature detected in 5 cases.",
    affectedDistricts: ["Mysuru"],
    evidence: "12 incidents, relay attack signature in 5 cases, CCTV captures dark SUV in 4 locations",
  },
];

// Live Feed for Alerts page
export const LIVE_ALERTS = [
  { id: "LA001", severity: "critical", category: "Cybercrime", title: "Mass OTP Phishing Campaign Active", district: "Bengaluru Urban", timestamp: "Just now", evidence: "412 complaints in 2 hours", action: "Dispatch", acknowledged: false, description: "Coordinated phishing campaign targeting HDFC and SBI customers via fake KYC links. Estimated 2000+ targets." },
  { id: "LA002", severity: "critical", category: "Organized Crime", title: "Gang War Threat Intelligence Received", district: "Ballari", timestamp: "4 min ago", evidence: "Informant tip + CDR analysis", action: "Escalate", acknowledged: false, description: "Intelligence indicates planned confrontation between two rival factions. Location: Siruguppa Road area." },
  { id: "LA003", severity: "high", category: "Financial Crime", title: "₹4.2 Crore Hawala Transaction Detected", district: "Bengaluru Urban", timestamp: "12 min ago", evidence: "FIU alert + bank analysis", action: "Dispatch", acknowledged: true, description: "Series of structured deposits to 14 accounts, splitting pattern consistent with hawala operations." },
  { id: "LA004", severity: "high", category: "Drug Related", title: "Narcotics Consignment en Route — NH4", district: "Belagavi", timestamp: "23 min ago", evidence: "Informant tip + vehicle flag", action: "Dispatch", acknowledged: false, description: "Truck KA-24-AB-5588 suspected to carry contraband. Last seen at Dharwad bypass." },
  { id: "LA005", severity: "high", category: "Fraud", title: "SIM Swap Fraud Wave — Mysuru", district: "Mysuru", timestamp: "31 min ago", evidence: "89 victim complaints", action: "Acknowledge", acknowledged: true, description: "Coordinated SIM swap attacks targeting business owners. ₹67L already siphoned." },
  { id: "LA006", severity: "medium", category: "Cybercrime", title: "Dark Web Credential Leak — KA Police Emails", district: "Multiple", timestamp: "45 min ago", evidence: "Dark web intelligence scan", action: "Acknowledge", acknowledged: false, description: "23 @ksp.gov.in credentials found on dark web forum. Immediate password reset required." },
  { id: "LA007", severity: "medium", category: "Financial Crime", title: "Cryptocurrency Laundering Suspected", district: "Bengaluru Urban", timestamp: "1 hr ago", evidence: "FIU report + blockchain trace", action: "Escalate", acknowledged: true, description: "₹1.4Cr converted to crypto across 6 wallets. Suspect linked to Bengaluru Urban cybercrime case." },
  { id: "LA008", severity: "medium", category: "Gang Activity", title: "Social Media Threat Posts Identified", district: "Kalaburagi", timestamp: "2 hr ago", evidence: "OSINT monitoring", action: "Acknowledge", acknowledged: false, description: "12 threatening posts across 3 platforms targeting police personnel. Accounts being traced." },
  { id: "LA009", severity: "low", category: "Fraud", title: "Fake Investment Scheme Website Detected", district: "Mangaluru", timestamp: "3 hr ago", evidence: "Citizen complaint + website analysis", action: "Acknowledge", acknowledged: true, description: "Domain promising 40% returns on agriculture investment. 150 victims reported. Site hosted abroad." },
  { id: "LA010", severity: "low", category: "Drug Related", title: "Substance Abuse Hotspot Report", district: "Hubballi-Dharwad", timestamp: "5 hr ago", evidence: "Beat constable report", action: "Acknowledge", acknowledged: true, description: "3 new substance abuse gathering points identified in Gokul Road area. Requires de-addiction intervention." },
];

// ─────────────────────────────────────────────
// TIMELINE DATA
// ─────────────────────────────────────────────

export const HOURLY_CRIMES = [
  { hour: "12 AM", crimes: 245, label: "00:00" },
  { hour: "1 AM", crimes: 312, label: "01:00" },
  { hour: "2 AM", crimes: 389, label: "02:00" },
  { hour: "3 AM", crimes: 423, label: "03:00" },
  { hour: "4 AM", crimes: 267, label: "04:00" },
  { hour: "5 AM", crimes: 134, label: "05:00" },
  { hour: "6 AM", crimes: 89, label: "06:00" },
  { hour: "7 AM", crimes: 167, label: "07:00" },
  { hour: "8 AM", crimes: 312, label: "08:00" },
  { hour: "9 AM", crimes: 445, label: "09:00" },
  { hour: "10 AM", crimes: 534, label: "10:00" },
  { hour: "11 AM", crimes: 478, label: "11:00" },
  { hour: "12 PM", crimes: 523, label: "12:00" },
  { hour: "1 PM", crimes: 489, label: "13:00" },
  { hour: "2 PM", crimes: 512, label: "14:00" },
  { hour: "3 PM", crimes: 456, label: "15:00" },
  { hour: "4 PM", crimes: 534, label: "16:00" },
  { hour: "5 PM", crimes: 623, label: "17:00" },
  { hour: "6 PM", crimes: 734, label: "18:00" },
  { hour: "7 PM", crimes: 812, label: "19:00" },
  { hour: "8 PM", crimes: 934, label: "20:00" },
  { hour: "9 PM", crimes: 1023, label: "21:00" },
  { hour: "10 PM", crimes: 987, label: "22:00" },
  { hour: "11 PM", crimes: 678, label: "23:00" },
];

export const DAILY_CRIMES = [
  { day: "Monday", crimes: 1234, cybercrime: 267, theft: 389, violence: 234, narcotics: 189, fraud: 155 },
  { day: "Tuesday", crimes: 1156, cybercrime: 245, theft: 356, violence: 212, narcotics: 178, fraud: 165 },
  { day: "Wednesday", crimes: 1289, cybercrime: 289, theft: 412, violence: 245, narcotics: 198, fraud: 145 },
  { day: "Thursday", crimes: 1178, cybercrime: 256, theft: 378, violence: 223, narcotics: 187, fraud: 134 },
  { day: "Friday", crimes: 1456, cybercrime: 312, theft: 489, violence: 278, narcotics: 223, fraud: 154 },
  { day: "Saturday", crimes: 1823, cybercrime: 389, theft: 612, violence: 356, narcotics: 278, fraud: 188 },
  { day: "Sunday", crimes: 1934, cybercrime: 423, theft: 645, violence: 389, narcotics: 298, fraud: 179 },
];

export const SEASONAL_CRIMES = [
  { season: "Jan", crimes: 5234, festivals: "Sankranti", spike: true, spikeReason: "Sankranti influx" },
  { season: "Feb", crimes: 4987, festivals: "None", spike: false, spikeReason: "" },
  { season: "Mar", crimes: 5678, festivals: "Holi", spike: false, spikeReason: "" },
  { season: "Apr", crimes: 6123, festivals: "Ugadi", spike: true, spikeReason: "Ugadi celebrations" },
  { season: "May", crimes: 5891, festivals: "None", spike: false, spikeReason: "" },
  { season: "Jun", crimes: 6456, festivals: "None", spike: false, spikeReason: "" },
  { season: "Jul", crimes: 7123, festivals: "None", spike: false, spikeReason: "" },
  { season: "Aug", crimes: 7456, festivals: "Independence Day", spike: true, spikeReason: "Large public gatherings" },
  { season: "Sep", crimes: 7891, festivals: "Ganesh Chaturthi", spike: true, spikeReason: "Ganesh procession incidents" },
  { season: "Oct", crimes: 9234, festivals: "Dasara, Diwali", spike: true, spikeReason: "Dasara-Diwali crime peak" },
  { season: "Nov", crimes: 8234, festivals: "None", spike: false, spikeReason: "" },
  { season: "Dec", crimes: 9901, festivals: "Christmas, New Year", spike: true, spikeReason: "New Year celebrations" },
];

export const TIMELINE_INSIGHTS = [
  { title: "Peak Crime Hours", value: "10 PM – 2 AM", icon: "clock", color: "#ef4444", description: "48% of violent crimes occur during late-night hours" },
  { title: "Weekend Spike", value: "+34% increase", icon: "calendar", color: "#f59e0b", description: "Saturday and Sunday see significantly higher crime rates" },
  { title: "Festival Impact", value: "5 annual peaks", icon: "star", color: "#8b5cf6", description: "Dasara & New Year show the highest seasonal spikes" },
  { title: "Cyber Crime Peak", value: "9 AM – 1 PM", icon: "monitor", color: "#0F6B5C", description: "Online fraud peaks during banking hours" },
];

// ─────────────────────────────────────────────
// SOCIO-ECONOMIC DATA
// ─────────────────────────────────────────────

export const SOCIOECONOMIC_DATA = [
  { district: "Bengaluru Urban", crimeRate: 48.2, populationDensity: 4381, unemploymentRate: 8.2, educationIndex: 82, urbanizationRate: 98, migrationRate: 34.2, literacyRate: 88 },
  { district: "Kalaburagi", crimeRate: 44.8, populationDensity: 197, unemploymentRate: 18.4, educationIndex: 51, urbanizationRate: 32, migrationRate: 12.1, literacyRate: 56 },
  { district: "Raichur", crimeRate: 41.2, populationDensity: 184, unemploymentRate: 21.3, educationIndex: 44, urbanizationRate: 28, migrationRate: 15.3, literacyRate: 51 },
  { district: "Ballari", crimeRate: 42.3, populationDensity: 223, unemploymentRate: 19.7, educationIndex: 52, urbanizationRate: 36, migrationRate: 18.9, literacyRate: 59 },
  { district: "Belagavi", crimeRate: 38.2, populationDensity: 224, unemploymentRate: 14.8, educationIndex: 61, urbanizationRate: 42, migrationRate: 9.8, literacyRate: 69 },
  { district: "Mysuru", crimeRate: 32.4, populationDensity: 426, unemploymentRate: 11.2, educationIndex: 72, urbanizationRate: 68, migrationRate: 7.3, literacyRate: 77 },
  { district: "Mangaluru", crimeRate: 36.7, populationDensity: 430, unemploymentRate: 9.8, educationIndex: 78, urbanizationRate: 74, migrationRate: 11.2, literacyRate: 82 },
  { district: "Shivamogga", crimeRate: 26.8, populationDensity: 189, unemploymentRate: 10.4, educationIndex: 76, urbanizationRate: 58, migrationRate: 6.8, literacyRate: 79 },
  { district: "Kodagu", crimeRate: 12.1, populationDensity: 135, unemploymentRate: 7.2, educationIndex: 81, urbanizationRate: 24, migrationRate: 3.4, literacyRate: 84 },
  { district: "Hassan", crimeRate: 17.8, populationDensity: 189, unemploymentRate: 9.1, educationIndex: 74, urbanizationRate: 34, migrationRate: 4.1, literacyRate: 78 },
  { district: "Udupi", crimeRate: 14.9, populationDensity: 391, unemploymentRate: 6.8, educationIndex: 86, urbanizationRate: 62, migrationRate: 5.2, literacyRate: 87 },
  { district: "Yadgir", crimeRate: 33.8, populationDensity: 201, unemploymentRate: 22.1, educationIndex: 43, urbanizationRate: 24, migrationRate: 13.8, literacyRate: 48 },
];

export const SOCIO_CORRELATIONS = [
  { factor: "Unemployment Rate", correlation: 0.87, direction: "positive", interpretation: "Higher unemployment strongly correlates with higher crime rates across Karnataka" },
  { factor: "Education Index", correlation: -0.79, direction: "negative", interpretation: "Districts with higher education levels show significantly lower crime rates" },
  { factor: "Urbanization Rate", correlation: 0.62, direction: "positive", interpretation: "Rapid urbanization increases cybercrime and organized crime exposure" },
  { factor: "Migration Rate", correlation: 0.71, direction: "positive", interpretation: "High in-migration districts face increased property crime and social tension" },
  { factor: "Population Density", correlation: 0.58, direction: "positive", interpretation: "Denser areas see more crime opportunities but also better policing" },
  { factor: "Literacy Rate", correlation: -0.74, direction: "negative", interpretation: "Lower literacy correlates with higher vulnerability to organized exploitation" },
];

// ─────────────────────────────────────────────
// AI INVESTIGATION ASSISTANT
// ─────────────────────────────────────────────

export const AI_SUGGESTED_QUERIES = [
  "Show crime patterns in Bengaluru Urban",
  "Find repeat offenders in Kalaburagi",
  "Summarize Raichur district threats",
  "Identify organized crime clusters",
  "Suggest leads for cybercrime ring KA-1823",
  "Which districts need immediate deployment?",
  "Predict next month's crime hotspots",
  "Show suspect network for Suresh Nayak",
];

export const AI_CANNED_RESPONSES: Record<string, {
  type: string; content: string;
  data?: { label: string; value: string; color?: string }[];
  districts?: string[]; confidence?: number;
}> = {
  "Show crime patterns in Bengaluru Urban": {
    type: "analysis",
    content: "Bengaluru Urban shows a multi-vector crime pattern with cybercrime as the dominant category (28.5% of all incidents). The district follows a temporal pattern where financial fraud peaks 09:00–13:00, while violent crimes peak 22:00–02:00. Year-over-year increase of +8.3% driven primarily by UPI phishing and organized cybercrime rings.",
    data: [
      { label: "Cybercrime", value: "4,231 cases", color: "#0F6B5C" },
      { label: "Theft & Burglary", value: "3,892 cases", color: "#8b5cf6" },
      { label: "Fraud", value: "2,341 cases", color: "#f59e0b" },
      { label: "Assault", value: "1,823 cases", color: "#ef4444" },
      { label: "Narcotics", value: "1,456 cases", color: "#e879f9" },
    ],
    districts: ["Bengaluru Urban", "Bengaluru Rural"],
    confidence: 94,
  },
  "Find repeat offenders in Kalaburagi": {
    type: "suspects",
    content: "Analysis of Kalaburagi criminal records reveals 47 repeat offenders with 3+ prior convictions. The highest-risk individuals are linked to narcotics trafficking routes from Andhra Pradesh. Imran Sheikh (Risk Score: 96) is the priority target with 12 documented criminal incidents.",
    data: [
      { label: "Imran Sheikh", value: "12 crimes | Risk: 96", color: "#ef4444" },
      { label: "Ravi Patil", value: "8 crimes | Risk: 78", color: "#f97316" },
      { label: "Zaheer Khan", value: "6 crimes | Risk: 71", color: "#f59e0b" },
      { label: "Baswaraj Nayak", value: "5 crimes | Risk: 64", color: "#f59e0b" },
    ],
    districts: ["Kalaburagi", "Yadgir", "Bidar"],
    confidence: 89,
  },
  "Summarize Raichur district threats": {
    type: "summary",
    content: "Raichur presents a HIGH-CRITICAL threat profile with a 13.8% YoY crime increase — the highest in Karnataka. Primary drivers are illegal sand mining (Tungabhadra basin), narcotics trafficking (Andhra border corridor), and organized criminal gangs. 876 active cases require immediate SIT intervention.",
    data: [
      { label: "Crime Rate", value: "41.2 per 1000", color: "#ef4444" },
      { label: "YoY Change", value: "+13.8% ⬆", color: "#ef4444" },
      { label: "Active Cases", value: "876", color: "#f97316" },
      { label: "Risk Score", value: "84/100", color: "#f97316" },
    ],
    districts: ["Raichur"],
    confidence: 91,
  },
  "default": {
    type: "general",
    content: "I've analyzed the Karnataka crime database and intelligence feeds. Please select a specific query or type your question about crime patterns, suspects, districts, or resource deployment. I can provide detailed analysis backed by 82,089 crime records across 31 districts.",
    districts: [],
    confidence: 85,
  },
};

// ─────────────────────────────────────────────
// ANOMALY DETECTION
// ─────────────────────────────────────────────

export const ANOMALIES = [
  {
    id: "AN001", type: "Sudden Spike", district: "Bengaluru Urban",
    severity: "critical", timestamp: "30 min ago",
    crimeType: "Cybercrime", baseline: 120, actual: 412,
    spikePercent: 243, status: "Under Investigation",
    description: "Cybercrime complaints surged 243% above daily baseline. Pattern matches coordinated phishing campaign.",
    indicators: ["412 OTP fraud complaints", "47 unique IMEI clusters", "₹1.8Cr exposure"],
  },
  {
    id: "AN002", type: "Unusual Pattern", district: "Kalaburagi",
    severity: "high", timestamp: "2 hr ago",
    crimeType: "Narcotics", baseline: 8, actual: 34,
    spikePercent: 325, status: "Confirmed",
    description: "Narcotics-related FIRs show 325% spike. Consistent with new trafficking route activation.",
    indicators: ["34 FIRs in 6 hours", "3 suspects at toll", "New vehicle pattern detected"],
  },
  {
    id: "AN003", type: "Suspicious Cluster", district: "Ballari",
    severity: "high", timestamp: "4 hr ago",
    crimeType: "Organized Crime", baseline: 3, actual: 18,
    spikePercent: 500, status: "Under Investigation",
    description: "Unusual clustering of organized crime indicators in Siruguppa area. Gang coordination suspected.",
    indicators: ["18 incidents in 3km radius", "CDR shows 47 calls", "4 known gang vehicles"],
  },
  {
    id: "AN004", type: "Emerging Crime Type", district: "Mysuru",
    severity: "medium", timestamp: "6 hr ago",
    crimeType: "Relay Attack Theft", baseline: 0, actual: 12,
    spikePercent: 1200, status: "Confirmed",
    description: "New vehicle theft method (relay attacks on keyless entry) emerging — 12 cases in 14 days. Previously unseen pattern.",
    indicators: ["12 high-end SUVs targeted", "Same device signature", "11PM-3AM pattern"],
  },
  {
    id: "AN005", type: "Sudden Spike", district: "Mangaluru",
    severity: "medium", timestamp: "8 hr ago",
    crimeType: "Port-Related Crime", baseline: 2, actual: 11,
    spikePercent: 450, status: "False Positive",
    description: "Initial spike in port security anomalies investigated. Attributed to seasonal fishing vessel congestion.",
    indicators: ["11 anomaly flags", "AIS discrepancy", "Seasonal traffic confirmed"],
  },
  {
    id: "AN006", type: "Unusual Pattern", district: "Raichur",
    severity: "medium", timestamp: "12 hr ago",
    crimeType: "Sand Mining", baseline: 4, actual: 19,
    spikePercent: 375, status: "Confirmed",
    description: "Drone and satellite data confirm resumption of sand mining operations at 3 previously sealed sites.",
    indicators: ["Drone thermal imagery", "Equipment tracks", "2 boats spotted"],
  },
];

export const ANOMALY_TIMELINE = [
  { time: "06:00", baseline: 45, actual: 48 },
  { time: "07:00", baseline: 52, actual: 55 },
  { time: "08:00", baseline: 78, actual: 82 },
  { time: "09:00", baseline: 112, actual: 118 },
  { time: "10:00", baseline: 134, actual: 142 },
  { time: "11:00", baseline: 128, actual: 145 },
  { time: "12:00", baseline: 118, actual: 134 },
  { time: "13:00", baseline: 109, actual: 128 },
  { time: "14:00", baseline: 115, actual: 289 },
  { time: "15:00", baseline: 123, actual: 456 },
  { time: "16:00", baseline: 134, actual: 523 },
  { time: "17:00", baseline: 145, actual: 389 },
  { time: "18:00", baseline: 167, actual: 234 },
  { time: "19:00", baseline: 189, actual: 198 },
  { time: "20:00", baseline: 201, actual: 212 },
  { time: "21:00", baseline: 223, actual: 234 },
  { time: "22:00", baseline: 234, actual: 248 },
  { time: "23:00", baseline: 189, actual: 198 },
];

// ─────────────────────────────────────────────
// RESOURCE ALLOCATION
// ─────────────────────────────────────────────

export const RESOURCE_RECOMMENDATIONS = [
  {
    id: 1, priority: "Critical", action: "Deploy Cyber Crime Task Force",
    district: "Bengaluru Urban", units: 8, status: "Pending Approval",
    reason: "412 cybercrime complaints in 48 hours. Current cyber cell capacity insufficient.",
    impact: "Expected 40% reduction in phishing success rate",
    timeline: "Immediate (< 24 hours)",
    icon: "monitor",
    color: "#0F6B5C",
  },
  {
    id: 2, priority: "Critical", action: "Increase Border Checkposts",
    district: "Belagavi", units: 12, status: "Approved",
    reason: "New narcotics route via NH-48 identified. Cross-border coordination required.",
    impact: "Estimated 60% disruption to identified trafficking network",
    timeline: "48 hours",
    icon: "shield",
    color: "#ef4444",
  },
  {
    id: 3, priority: "High", action: "Deploy River Police Patrol",
    district: "Raichur", units: 6, status: "Deployed",
    reason: "Illegal sand mining resumed at 3 Tungabhadra riverbank sites.",
    impact: "Complete disruption of identified mining operations",
    timeline: "Active",
    icon: "anchor",
    color: "#10b981",
  },
  {
    id: 4, priority: "High", action: "Establish SIT for Organized Crime",
    district: "Ballari", units: 15, status: "In Progress",
    reason: "Coordinated gang activity detected. Requires dedicated investigation unit.",
    impact: "Arrest of 7+ identified organized crime members",
    timeline: "1 week",
    icon: "users",
    color: "#f59e0b",
  },
  {
    id: 5, priority: "Medium", action: "Increase Night Patrolling",
    district: "Mysuru", units: 20, status: "Pending",
    reason: "Vehicle theft cluster operating between 11PM–3AM requires deterrent.",
    impact: "Expected 55% reduction in vehicle theft incidents",
    timeline: "3 days",
    icon: "moon",
    color: "#8b5cf6",
  },
  {
    id: 6, priority: "Medium", action: "Port Security Enhancement",
    district: "Mangaluru", units: 5, status: "Pending Approval",
    reason: "AIS discrepancy and weight manifest inconsistency flagged at harbor.",
    impact: "Prevention of estimated ₹8Cr contraband shipment",
    timeline: "48 hours",
    icon: "anchor",
    color: "#e879f9",
  },
];

export const DISTRICT_RESOURCES = [
  { district: "Bengaluru Urban", totalOfficers: 12840, deployedPatrol: 4200, cyberUnits: 234, detectives: 567, available: 3421, coverage: 89 },
  { district: "Kalaburagi", totalOfficers: 2340, deployedPatrol: 890, cyberUnits: 34, detectives: 89, available: 567, coverage: 54 },
  { district: "Raichur", totalOfficers: 1890, deployedPatrol: 756, cyberUnits: 18, detectives: 67, available: 423, coverage: 48 },
  { district: "Ballari", totalOfficers: 2120, deployedPatrol: 823, cyberUnits: 23, detectives: 78, available: 489, coverage: 52 },
  { district: "Belagavi", totalOfficers: 3450, deployedPatrol: 1234, cyberUnits: 45, detectives: 134, available: 789, coverage: 67 },
  { district: "Mysuru", totalOfficers: 3120, deployedPatrol: 1089, cyberUnits: 67, detectives: 123, available: 712, coverage: 71 },
  { district: "Mangaluru", totalOfficers: 2230, deployedPatrol: 845, cyberUnits: 45, detectives: 89, available: 523, coverage: 63 },
  { district: "Hubballi-Dharwad", totalOfficers: 2670, deployedPatrol: 934, cyberUnits: 38, detectives: 101, available: 634, coverage: 61 },
];

export const BUDGET_ALLOCATION = [
  { category: "Personnel & Salaries", amount: 1240, percentage: 52, color: "#0F6B5C" },
  { category: "Technology & Cyber", amount: 340, percentage: 14, color: "#8b5cf6" },
  { category: "Vehicles & Equipment", amount: 290, percentage: 12, color: "#f59e0b" },
  { category: "Intelligence Operations", amount: 210, percentage: 9, color: "#ef4444" },
  { category: "Training & Capacity", amount: 140, percentage: 6, color: "#10b981" },
  { category: "Community Policing", amount: 120, percentage: 5, color: "#e879f9" },
  { category: "Infrastructure", amount: 48, percentage: 2, color: "#64748b" },
];

// ─────────────────────────────────────────────
// COMMISSIONER VIEW
// ─────────────────────────────────────────────

export const COMMISSIONER_METRICS = {
  totalCrimes: 82089,
  activeCases: 14823,
  clearanceRate: 82.6,
  aiAlerts: 23,
  criticalDistricts: 4,
  deployedForces: 28450,
  arrestsMTD: 2341,
  crimeReduction: -3.2,
};

export const COMMISSIONER_THREATS = [
  { id: 1, type: "Cybercrime Surge", severity: "critical", districts: "Bengaluru Urban", status: "Active", since: "2 hours ago" },
  { id: 2, type: "Cross-Border Narcotics", severity: "high", districts: "Belagavi, Kalaburagi", status: "Monitored", since: "18 hours ago" },
  { id: 3, type: "Organized Gang Activity", severity: "high", districts: "Ballari", status: "SIT Active", since: "3 days ago" },
  { id: 4, type: "Sand Mining Operations", severity: "medium", districts: "Raichur, Koppal", status: "Patrol Deployed", since: "1 day ago" },
];

export const COMMISSIONER_RECOMMENDATIONS = [
  { id: 1, priority: 1, action: "Establish State Cyber Crime Command Center", rationale: "Bengaluru Urban cybercrime at 3-year peak. Centralized coordination needed.", urgency: "This Month" },
  { id: 2, priority: 2, action: "Inter-State Border Task Force — NH-48 Corridor", rationale: "Narcotics route through Belagavi now confirmed. Maharashtra coordination essential.", urgency: "This Week" },
  { id: 3, priority: 3, action: "Kalaburagi-Raichur SIT Expansion", rationale: "Northern districts showing 11-13% YoY crime increase. Under-resourced relative to risk.", urgency: "48 Hours" },
];

export const AI_INSIGHTS_SUMMARY = [
  {
    title: "Crime Velocity Index",
    value: "↑ 12.4%",
    description: "Month-over-month crime velocity has increased, driven primarily by cybercrime incidents in urban zones.",
    color: "red",
  },
  {
    title: "Predictive Accuracy",
    value: "91.2%",
    description: "AI prediction models achieved 91.2% accuracy in Q1 2025 crime forecasting across Karnataka districts.",
    color: "green",
  },
  {
    title: "Network Clusters",
    value: "14 Active",
    description: "14 criminal network clusters currently monitored. 3 new clusters identified this week through relationship mapping.",
    color: "cyan",
  },
  {
    title: "Response Time",
    value: "8.2 min",
    description: "Average law enforcement response time down from 11.5 min to 8.2 min due to AI-assisted dispatch optimization.",
    color: "purple",
  },
];

// ─────────────────────────────────────────────
// PROGRAMMATIC HACKATHON DATA ENGINE
// ─────────────────────────────────────────────

const firstNames = ["Rajesh", "Amit", "Imran", "Venkatesh", "Suresh", "Priya", "Deepak", "Anil", "Sunil", "Vijay", "Sandeep", "Karan", "Mohammad", "Vikram", "Shiva", "Manjunath", "Lokesh", "Kiran", "Naveen", "Abhishek"];
const lastNames = ["Kumar", "Sheikh", "Rao", "Patel", "Nayak", "Desai", "Gowda", "Sharma", "Reddy", "Bhat", "Joshi", "Hegde", "Patil", "Siddiqui", "Pai", "Naidu", "Acharya", "Murthy", "Swamy", "Prasad"];
const officerNames = ["ACP Chandrashekar", "Inspector Girish", "Sub-Inspector Poornima", "ACP Raghavendra", "Inspector Shalini", "Deputy Commissioner Patil", "Inspector Manjunath", "Sub-Inspector Divya"];
const crimeCategories = ["Cybercrime", "Theft & Burglary", "Sand Mining", "Assault & Violence", "Narcotic Trafficking", "Organized Crime", "Fraud", "Rape", "Murder", "Drug Cases", "Financial Fraud"];
const statusOptions: ("investigating" | "arrested" | "resolved" | "monitoring")[] = ["investigating", "arrested", "resolved", "monitoring"];
const districts = ["Bengaluru Urban", "Kalaburagi", "Raichur", "Ballari", "Belagavi", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Vijayapura", "Shivamogga", "Tumakuru"];

export interface CriminalProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  district: string;
  crimeHistory: string[];
  arrestCount: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  knownAssociates: string[];
  vehiclesUsed: string[];
  mobileNumbers: string[];
  bankAccounts: string[];
  recentActivity: string;
  profileScore: number;
  status: string;
}

const generatedCriminals: CriminalProfile[] = [];
for (let i = 1; i <= 105; i++) {
  const fName = firstNames[i % firstNames.length];
  const lName = lastNames[(i * 3) % lastNames.length];
  const name = `${fName} ${lName}`;
  const age = 22 + (i % 40);
  const gender = i % 15 === 0 ? "Female" : "Male";
  const district = districts[i % districts.length];
  const arrestCount = 1 + (i % 6);
  const riskScore = 40 + (i % 58);
  const riskLevel = riskScore > 85 ? "Critical" : riskScore > 70 ? "High" : riskScore > 50 ? "Medium" : "Low";
  
  const history: string[] = [];
  const cat = crimeCategories[i % crimeCategories.length];
  history.push(`${cat} Incident (${2020 + (i % 5)})`);
  if (i % 3 === 0) history.push(`Theft & Robbery Case (${2022 + (i % 3)})`);
  if (i % 5 === 0) history.push(`Assault Charge (${2023})`);

  generatedCriminals.push({
    id: `susp_${i}`,
    name,
    age,
    gender,
    district,
    crimeHistory: history,
    arrestCount,
    riskLevel,
    knownAssociates: [],
    vehiclesUsed: [`KA-0${1 + (i % 9)}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(66 + (i % 26))}-${1000 + (i * 7) % 9000}`],
    mobileNumbers: [`+91-9${1000 + (i * 13) % 9000}-${50000 + (i * 7) % 50000}`],
    bankAccounts: [`SBI ****${3000 + (i * 11) % 7000}`],
    recentActivity: `Last seen in ${district} district on 2026-05-${10 + (i % 20)}`,
    profileScore: riskScore,
    status: riskLevel === "Critical" ? "Wanted" : "Under Surveillance"
  });
}

// Populate associates
for (let i = 0; i < generatedCriminals.length; i++) {
  const c = generatedCriminals[i];
  const associate1 = generatedCriminals[(i + 1) % generatedCriminals.length].name;
  const associate2 = generatedCriminals[(i + 3) % generatedCriminals.length].name;
  c.knownAssociates = [associate1, associate2];
}

export const CRIMINAL_PROFILES = generatedCriminals;

export interface FIRRecord {
  id: string;
  firNumber: string;
  date: string;
  district: string;
  crimeCategory: string;
  suspectDetails: CriminalProfile;
  victimDetails: {
    name: string;
    age: number;
    gender: string;
    status: string;
  };
  evidenceCount: number;
  investigationStatus: "investigating" | "arrested" | "resolved" | "monitoring";
  assignedOfficer: string;
  riskScore: number;
  timeline: {
    timestamp: string;
    officerName: string;
    notes: string;
    status: string;
  }[];
}

export const FIR_RECORDS: FIRRecord[] = [];
for (let i = 1; i <= 55; i++) {
  const district = districts[i % districts.length];
  const category = crimeCategories[i % crimeCategories.length];
  const suspect = generatedCriminals[i - 1];
  const status = statusOptions[i % statusOptions.length];
  const officer = officerNames[i % officerNames.length];
  const evidenceCount = 2 + (i % 8);
  const riskScore = suspect.profileScore;
  const date = `2026-05-${String(1 + (i % 28)).padStart(2, "0")}`;

  const victimFName = lastNames[i % lastNames.length];
  const victimLName = firstNames[(i * 2) % firstNames.length];
  const victimName = `${victimLName} ${victimFName}`;
  const victimAge = 25 + (i % 35);
  const victimGender = i % 4 === 0 ? "Female" : "Male";

  const timelineSteps = [
    { timestamp: `${date} 09:00 AM`, officerName: officer, notes: "FIR registered based on complaint received.", status: "FIR Registered" },
    { timestamp: `${date} 02:30 PM`, officerName: officer, notes: `${evidenceCount} pieces of physical evidence recovered from crime scene.`, status: "Evidence Collected" },
  ];

  if (status !== "investigating") {
    timelineSteps.push({ timestamp: `${date} 04:00 PM`, officerName: officer, notes: `Mobile signal tower dump analyzed. Suspect device IMEI tracked.`, status: "Mobile Tracking" });
  }
  if (status === "arrested" || status === "resolved" || status === "monitoring") {
    timelineSteps.push({ timestamp: `${date} 05:00 PM`, officerName: officer, notes: `Financial logs matching bank transfers scrutinized. Account frozen.`, status: "Bank Analysis" });
    timelineSteps.push({ timestamp: `${date} 06:30 PM`, officerName: officer, notes: `Active associates link identified. Network graph updated.`, status: "Network Mapping" });
    timelineSteps.push({ timestamp: `${date} 08:00 PM`, officerName: officer, notes: `Suspect name confirmed through photo matching.`, status: "Suspect Identified" });
  }
  if (status === "arrested" || status === "resolved") {
    timelineSteps.push({ timestamp: `${date} 10:00 PM`, officerName: officer, notes: `Target apprehended. Suspect taken into custody.`, status: "Arrest Made" });
  }
  if (status === "resolved") {
    timelineSteps.push({ timestamp: `${date} 11:30 PM`, officerName: officer, notes: `Chargesheet drafted and filed under relevant sections of IPC/BNS.`, status: "Charges Filed" });
    timelineSteps.push({ timestamp: `${date} 11:59 PM`, officerName: officer, notes: `Magistrate order obtained. Investigation completed.`, status: "Case Closed" });
  }

  FIR_RECORDS.push({
    id: `KA-2026-${String(1000 + i).slice(1)}`,
    firNumber: `FIR/2026/${district.substring(0, 3).toUpperCase()}/${100 + i}`,
    date,
    district,
    crimeCategory: category,
    suspectDetails: suspect,
    victimDetails: {
      name: victimName,
      age: victimAge,
      gender: victimGender,
      status: status === "resolved" ? "Compensated" : "Awaiting Trial"
    },
    evidenceCount,
    investigationStatus: status,
    assignedOfficer: officer,
    riskScore,
    timeline: timelineSteps
  });
}

// Generate relationships mapping (200+ links) for CRIMINAL_NETWORK
const newNetworkNodes = [...CRIMINAL_NETWORK.nodes];
const newNetworkLinks = [...CRIMINAL_NETWORK.links];

for (let i = 7; i < generatedCriminals.length; i++) {
  const c = generatedCriminals[i];
  newNetworkNodes.push({
    id: c.id,
    label: c.name,
    type: "suspect",
    risk: c.riskLevel.toLowerCase() as any,
    district: c.district,
    crimes: c.crimeHistory.length + 1,
    age: c.age,
    status: c.riskLevel === "Critical" ? "Wanted" : "Under Surveillance"
  });
}

for (let i = 1; i <= 30; i++) {
  newNetworkNodes.push({ id: `ba_gen_${i}`, label: `SBI Account ****${4000 + i * 13}`, type: "bank", district: districts[i % districts.length] });
  newNetworkNodes.push({ id: `veh_gen_${i}`, label: `KA-0${1 + (i % 9)}-XY-${2000 + i * 7}`, type: "vehicle", district: districts[i % districts.length] });
  newNetworkNodes.push({ id: `mob_gen_${i}`, label: `+91-95432-${10000 + i * 17}`, type: "mobile", district: districts[i % districts.length] });
}

for (let i = 0; i < generatedCriminals.length; i++) {
  const c = generatedCriminals[i];
  newNetworkLinks.push({ source: c.id, target: `l${1 + (i % 5)}`, strength: 1 + (i % 3) });
  newNetworkLinks.push({ source: c.id, target: `ba_gen_${1 + (i % 30)}`, strength: 2 + (i % 3) });
  newNetworkLinks.push({ source: c.id, target: `mob_gen_${1 + (i % 30)}`, strength: 3 });
  newNetworkLinks.push({ source: c.id, target: `veh_gen_${1 + (i % 30)}`, strength: 2 });
  if (i < generatedCriminals.length - 1) {
    newNetworkLinks.push({ source: c.id, target: generatedCriminals[i + 1].id, strength: 1 + (i % 4) });
  }
}

export const EXTENDED_CRIMINAL_NETWORK = {
  nodes: newNetworkNodes,
  links: newNetworkLinks
};

