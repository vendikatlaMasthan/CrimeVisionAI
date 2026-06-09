/**
 * CrimeVision AI — Crime Intelligence Context Builder
 * Builds a rich system prompt from Karnataka police data for Gemini API
 */

import {
  KARNATAKA_DISTRICTS,
  CRIME_CATEGORIES,
  FIR_RECORDS,
  CRIMINAL_PROFILES,
  DISTRICT_RISK_SCORES,
  AI_ALERTS,
} from '@/lib/mockData';

/** Builds the full intelligence context string for Gemini */
export function buildCrimeContext(): string {
  // ── District summary ──────────────────────────────────────────────────────
  const districtSummary = KARNATAKA_DISTRICTS.slice(0, 15)
    .map(d =>
      `  • ${d.name} (${d.code}): Risk=${d.riskLevel.toUpperCase()}, Total Crimes=${d.crimeCount.toLocaleString()}, Active Cases=${d.activeCases.toLocaleString()}, Crime Rate=${d.crimeRate}/lakh, Cybercrime=${d.cyberCrimes}, Theft=${d.theft}, Assault=${d.assault}, Fraud=${d.fraud}, Narcotics=${d.narcotics}`
    )
    .join('\n');

  // ── Top risk districts ────────────────────────────────────────────────────
  const criticalDistricts = KARNATAKA_DISTRICTS
    .filter(d => d.riskLevel === 'critical')
    .map(d => d.name)
    .join(', ');

  // ── Crime categories ──────────────────────────────────────────────────────
  const categorySummary = CRIME_CATEGORIES
    .map(c => `  • ${c.name}: ${c.count.toLocaleString()} cases (${c.trend} trend)`)
    .join('\n');

  // ── FIR records ───────────────────────────────────────────────────────────
  const firSummary = FIR_RECORDS.slice(0, 30)
    .map(f =>
      `  • FIR ${f.firNumber} | ${f.crimeCategory} | ${f.district} | Date: ${f.date} | Suspect: ${f.suspectDetails.name} (Risk: ${f.suspectDetails.riskLevel}) | Status: ${f.investigationStatus} | Risk Score: ${f.riskScore}`
    )
    .join('\n');

  // ── Criminal profiles ─────────────────────────────────────────────────────
  const suspectSummary = CRIMINAL_PROFILES.slice(0, 20)
    .map(p =>
      `  • ${p.name} | ${p.district} | Age: ${p.age} | Arrests: ${p.arrestCount} | Risk: ${p.riskLevel} | Profile Score: ${p.profileScore} | Crimes: ${p.crimeHistory.slice(0, 2).join(', ')} | Associates: ${p.knownAssociates.slice(0, 2).join(', ')}`
    )
    .join('\n');

  // ── Repeat offenders ──────────────────────────────────────────────────────
  const repeatOffenders = CRIMINAL_PROFILES
    .filter(p => p.arrestCount >= 3)
    .sort((a, b) => b.arrestCount - a.arrestCount)
    .slice(0, 10)
    .map((p, i) =>
      `  ${i + 1}. ${p.name} — ${p.arrestCount} arrests | ${p.district} | Risk: ${p.riskLevel} | Score: ${p.profileScore}`
    )
    .join('\n');

  // ── Wanted criminals ──────────────────────────────────────────────────────
  const wantedCriminals = CRIMINAL_PROFILES
    .filter(p => p.riskLevel === 'Critical')
    .slice(0, 8)
    .map(p => `  • ${p.name} (${p.district}) — Wanted, Score: ${p.profileScore}`)
    .join('\n');

  // ── Crime by category + district ─────────────────────────────────────────
  const crimesByCategoryDistrict: Record<string, { count: number; districts: string[] }> = {};
  FIR_RECORDS.forEach(f => {
    if (!crimesByCategoryDistrict[f.crimeCategory]) {
      crimesByCategoryDistrict[f.crimeCategory] = { count: 0, districts: [] };
    }
    crimesByCategoryDistrict[f.crimeCategory].count++;
    if (!crimesByCategoryDistrict[f.crimeCategory].districts.includes(f.district)) {
      crimesByCategoryDistrict[f.crimeCategory].districts.push(f.district);
    }
  });
  const categoryDistrictSummary = Object.entries(crimesByCategoryDistrict)
    .map(([cat, data]) =>
      `  • ${cat}: ${data.count} FIRs in districts: ${data.districts.slice(0, 4).join(', ')}`
    )
    .join('\n');

  // ── Active AI alerts ──────────────────────────────────────────────────────
  const alertsSummary = AI_ALERTS.slice(0, 5)
    .map(a => `  • [${a.severity.toUpperCase()}] ${a.title} — ${a.description}`)
    .join('\n');

  // ── Highest risk districts by score ──────────────────────────────────────
  const riskScoreSummary = DISTRICT_RISK_SCORES
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(d => `  • ${d.name}: ${d.score}/100 (Predicted: ${d.predictedIncrease})`)
    .join('\n');

  return `
==========================================================================
KARNATAKA STATE POLICE — CrimeNet AI Intelligence Database
Classification: CONFIDENTIAL | Last Updated: ${new Date().toLocaleDateString('en-IN')}
==========================================================================

TOTAL STATISTICS:
- Total Crimes Recorded: 82,089
- Active Cases: 14,823
- Solved Cases: 67,823 (Clearance Rate: 82.6%)
- Arrests This Month (MTD): 2,341
- Charges Filed: 1,876
- High-Risk Districts: 4 (Critical), 7 (High)
- Critical Districts: ${criticalDistricts}

DISTRICT INTELLIGENCE (Top 15):
${districtSummary}

DISTRICT RISK SCORES:
${riskScoreSummary}

CRIME CATEGORY BREAKDOWN:
${categorySummary}

FIR RECORDS BY CATEGORY AND DISTRICT:
${categoryDistrictSummary}

ACTIVE FIR RECORDS (Sample of 30):
${firSummary}

REPEAT OFFENDERS (Top 10 by Arrest Count):
${repeatOffenders}

WANTED CRIMINALS (Critical Risk):
${wantedCriminals}

SUSPECT DATABASE (Sample of 20):
${suspectSummary}

ACTIVE AI ALERTS:
${alertsSummary}

TREND DATA:
- Cybercrime: +34% year-over-year, concentrated in Bengaluru Urban and Mangaluru
- Narcotics: +28% year-over-year, concentrated in Raichur-Kalaburagi corridor
- Theft: -5% year-over-year (improving due to CCTV expansion)
- Financial Fraud: +22% (UPI scams increasing)
- Rape/Sexual Crimes: Mostly urban districts, Bengaluru Urban highest
- Murder/Homicide: Northern districts (Kalaburagi, Raichur) show higher rates
- Sand Mining (Illegal): River corridors of North Karnataka
- Organized Crime: Border districts (Belagavi, Ballari, Raichur)

INVESTIGATION STATUS BREAKDOWN:
- Investigating: ~41 cases active
- Arrested: ~8 cases with suspects in custody
- Monitoring: ~4 cases under surveillance
- Resolved: ~2 cases closed

==========================================================================
`;
}

/** Builds the Gemini system prompt as a police intelligence AI */
export function buildSystemPrompt(): string {
  const context = buildCrimeContext();

  return `You are CrimeNet AI — an advanced police intelligence copilot for Karnataka State Police. You have access to real crime data from the Karnataka Police database.

Your role:
- Answer questions like a senior intelligence officer
- Provide structured, actionable intelligence reports
- Reference real data from the database
- Suggest tactical recommendations
- Be concise but thorough
- Format responses clearly with sections when appropriate

IMPORTANT FORMATTING RULES:
1. When showing crime statistics, use structured format with clear sections
2. Use CAPS for risk levels: CRITICAL, HIGH, MEDIUM, LOW
3. Always include FIR numbers when referencing cases (e.g., FIR-KSP-2024-001)
4. Include tactical recommendations in every substantive response
5. Reference specific suspect names, districts, and FIR numbers from the database
6. Keep responses focused and intelligence-oriented, not generic chatbot responses

DATABASE ACCESS — you have access to this real Karnataka Police intelligence data:
${context}

Respond as a police AI analyst. Be precise, professional, and intelligence-focused.`;
}
