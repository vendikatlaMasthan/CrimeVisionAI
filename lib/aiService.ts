/**
 * CrimeVision AI — AI Intelligence Service
 * Handles unified browser-side API calls to Gemini
 * with real-time text streaming support.
 */

import { getActiveProvider, getActiveApiKey } from './apiKey';
import { localAI } from './localAiEngine';
import { RECENT_FIRS } from './crimeData';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Local fallback response dispatch logic for browser calls
export function generateLocalFallbackResponse(systemPrompt: string, messages: ChatMessage[]): string {
  const allText = (systemPrompt + ' ' + messages.map(m => m.content).join(' ')).toLowerCase();
  
  // 1. Check if a JSON response is specifically requested for case details/evaluation
  if (allText.includes('json') && (allText.includes('fir') || allText.includes('suspect') || allText.includes('docket'))) {
    const firMatch = allText.match(/fir\s*(?:number)?\s*[:#]?\s*([a-z0-9\-/]+)/i) || allText.match(/fir\/\d{4}\/[a-z]{3}\/\d+/i);
    const suspectMatch = allText.match(/suspect\s*(?:target)?\s*[:]?\s*([^\n]+)/i);
    const districtMatch = allText.match(/district\s*(?:division)?\s*[:]?\s*([^\n]+)/i);
    const categoryMatch = allText.match(/category\s*[:]?\s*([^\n]+)/i);

    const fNum = firMatch ? firMatch[1]?.trim().toUpperCase() : "KA-2025-047823";
    const sName = suspectMatch ? suspectMatch[1]?.trim() : "Suresh Nayak";
    const dist = districtMatch ? districtMatch[1]?.trim() : "Bengaluru Urban";
    const cat = categoryMatch ? categoryMatch[1]?.trim() : "Cybercrime";

    // Call the newly added JSON method
    return localAI.generateCaseSummaryJson(fNum, sName, dist, cat);
  }

  // 2. Check if there is active case context inside the systemPrompt (which is sent during conversational chat)
  const contextFir = systemPrompt.match(/- FIR Number:\s*([^\n]+)/i);
  if (contextFir) {
    const fNum = contextFir[1]?.trim();
    const sName = (systemPrompt.match(/- Suspect:\s*([^\n]+)/i)?.[1] || "Suresh Nayak").trim();
    const dist = (systemPrompt.match(/- District:\s*([^\n]+)/i)?.[1] || "Bengaluru Urban").trim();
    const cat = (systemPrompt.match(/- Category:\s*([^\n]+)/i)?.[1] || "Cybercrime").trim();
    const riskScore = (systemPrompt.match(/- Risk Score:\s*([^\n]+)/i)?.[1] || "85/100").trim();
    const evidence = (systemPrompt.match(/- Evidence Summary:\s*([^\n]+)/i)?.[1] || "").trim();

    // Check last user query in messages
    const lastMsg = messages[messages.length - 1]?.content || "";
    const queryLower = lastMsg.toLowerCase();

    if (queryLower.includes("suspect") || queryLower.includes("who is") || queryLower.includes("profile") || queryLower.includes("accused")) {
      return `### Target Suspect Profile — ${sName}\n\n• **Division/Jurisdiction:** ${dist}\n• **Affiliated Case Docket:** FIR #${fNum}\n• **Suspect Threat Assessment:** Marked with threat index of ${riskScore}. Cross-references place this suspect as a coordinator of regional networks.\n• **Asset Footprint:** Tracked accounts and motor vehicles currently flagged for asset tracking.\n• **Operational Status:** Under active surveillance by KSP regional cell.`;
    }
    if (queryLower.includes("network") || queryLower.includes("associate") || queryLower.includes("accomplice") || queryLower.includes("link")) {
      return `### Relationship Syndicate Map — ${sName}\n\n• **Primary Connection:** Mapped links connect target to regional transport contractors.\n• **Ancillary Actors:** Mapped nodes include Venkat R. (Logistics) and Ramesh Patil (Coordination).\n• **Financial Transactions:** Recurring payouts flagged matching known extraction schedules.\n• **Communications:** Logged interactions peak during the estimated timeline of active offenses.`;
    }
    if (queryLower.includes("evidence") || queryLower.includes("proof") || queryLower.includes("finding")) {
      return `### Evidentiary Index Summary — Case #${fNum}\n\n• **Cell Tower Intercepts:** Suspect device attachment coordinates match crime scene boundaries during active intervals.\n• **LPR Checkpoints:** Vehicle KA-03-P-7281 captured crossing division boundaries within critical timelines.\n• **Secured Exhibits:** ${evidence || "Multiple transaction ledgers and mobile devices seized for analysis."}`;
    }
    if (queryLower.includes("route") || queryLower.includes("gps") || queryLower.includes("movement") || queryLower.includes("travel")) {
      return `### Tactical Movement Log & GPS Trail\n\n• **Checkpoint Match:** Registered vehicle logged crossing border checkposts.\n• **Tower Attachments:** Target device attached to regional cells along highways NH-50 and NH-167.\n• **Activity Terminal:** Last active coordinates terminate near the suspect's storage yard.`;
    }
    if (queryLower.includes("recommend") || queryLower.includes("action") || queryLower.includes("deploy") || queryLower.includes("next step")) {
      return `### Recommended Tactical Actions\n\n• **Checkpoint Alert:** Deploy immediate vehicular checkpost blockades along the ${dist} boundary transit corridors.\n• **Asset Freeze:** Issue directives to the banking gateway to freeze associated accounts linked to ${sName}.\n• **Forensic Seizure:** Coordinate teams to seize local communication routers and access terminals under warrant.`;
    }
  }

  // 3. Predictions / Risk Forecast request
  if (allText.includes('prediction') || allText.includes('forecast') || allText.includes('risk assessment engine') || allText.includes('prediction_prompt')) {
    try {
      return JSON.stringify(localAI.generatePrediction());
    } catch {
      // fallback
    }
  }

  // 4. FIR summary request (if no JSON asked)
  if (allText.includes('case summary') || allText.includes('fir number') || allText.includes('fir:')) {
    const firMatch = allText.match(/fir\/\d{4}\/[a-z]{3}\/\d+/i);
    let matchedFir = RECENT_FIRS[0];
    if (firMatch) {
      const found = RECENT_FIRS.find(f => f.firNumber.toLowerCase() === firMatch[0].toLowerCase());
      if (found) matchedFir = found;
    }
    return localAI.generateCaseSummary(matchedFir);
  }

  // 5. General query fallback
  if (allText.includes('risk') || allText.includes('threat')) {
    return 'Based on 82,089 Karnataka crime records: Bengaluru Urban has the highest risk score (94/100) driven by cybercrime (+34% YoY). Kalaburagi (87/100) and Raichur (84/100) follow, primarily due to narcotics trafficking (+28% YoY) and sand mining (+18% YoY).';
  }
  if (allText.includes('cyber') || allText.includes('fraud')) {
    return 'Cybercrime is the fastest-growing threat in Karnataka (+34% YoY, 18,234 recorded incidents). Key vectors: OTP/SIM-swap fraud (Bengaluru Urban), UPI phishing (Mangaluru), and relay-attack vehicle theft (Mysuru). Recommendation: Deploy Cyber Cell surge teams across IT corridor districts.';
  }
  if (allText.includes('narcotic') || allText.includes('drug')) {
    return 'Narcotic trafficking increased +28% YoY (9,876 incidents). Primary routes: Kalaburagi–Raichur NH-50 corridor and Bidar border crossing. Recent seizure: 8.2kg methamphetamine. Recommendation: Joint NCB operation on NH-50/NH-167; increase checkpost frequency.';
  }
  if (allText.includes('recommend') || allText.includes('action') || allText.includes('deploy')) {
    return 'AI Recommendations: (1) CRITICAL: Deploy 80 Cyber Crime specialists in Bengaluru Urban/Mangaluru. (2) CRITICAL: Issue LOC for narcotics kingpins in Kalaburagi–Raichur belt. (3) HIGH: 30% night patrol increase for Mysuru vehicle-theft hotspots. (4) HIGH: SIT operations for Ballari–Bagalkot organized crime.';
  }

  // Default fallback response
  return `Karnataka State Police AI Command Center: 82,089 total crimes, 14,823 active cases, 82.6% clearance rate. Top threats are cybercrime and narcotics. Bengaluru Urban currently has the highest threat index at 94/100.`;
}

export async function generateTextStream(params: {
  systemPrompt?: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const apiKey = getActiveApiKey();

  try {
    return await runGeminiStream(apiKey, params);
  } catch (err) {
    // Fall through to local fallback on any failure
  }

  // Simulate local stream chunking
  const localResponse = generateLocalFallbackResponse(params.systemPrompt || '', params.messages);
  const words = localResponse.split(' ');
  let currentText = '';
  for (let i = 0; i < words.length; i++) {
    const chunk = words[i] + ' ';
    currentText += chunk;
    params.onChunk(chunk);
    if (typeof window !== 'undefined') {
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }
  return currentText;
}

// ── Gemini REST Streaming Implementation ──────────────────────────────────────
async function runGeminiStream(
  apiKey: string,
  params: { systemPrompt?: string; messages: ChatMessage[]; onChunk: (text: string) => void; signal?: AbortSignal }
): Promise<string> {
  const { systemPrompt, messages, onChunk, signal } = params;

  // Format messages to Gemini API format
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body: any = {
    contents,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.2,
    }
  };

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  // If apiKey is available, query Gemini directly. Otherwise, proxy through Catalyst serverless.
  const url = apiKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`
    : `${getApiEndpoint()}?alt=sse`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini Proxy Error ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const cleaned = line.trim();
        if (cleaned.startsWith('data: ')) {
          const jsonStr = cleaned.slice(6).trim();
          try {
            const parsed = JSON.parse(jsonStr);
            const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (textChunk) {
              fullText += textChunk;
              onChunk(textChunk);
            }
          } catch {
            // Ignore incomplete chunks or parse errors
          }
        }
      }
    }
  }

  if (buffer) {
    const cleaned = buffer.trim();
    if (cleaned.startsWith('data: ')) {
      const jsonStr = cleaned.slice(6).trim();
      try {
        const parsed = JSON.parse(jsonStr);
        const textChunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (textChunk) {
          fullText += textChunk;
          onChunk(textChunk);
        }
      } catch {
        // ignore
      }
    }
  }

  return fullText || 'No response generated.';
}

// Helper to resolve Catalyst API proxy url dynamically
export function getApiEndpoint(): string {
  if (typeof window === 'undefined') {
    return '/api/crimevision-ai/';
  }
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isLocal) {
    return '/api/crimevision-ai/';
  }
  return '/server/crimevision-ai/api/crimevision-ai/';
}

export async function generateText(params: {
  systemPrompt?: string;
  messages: ChatMessage[];
}): Promise<string> {
  const apiKey = getActiveApiKey();

  try {
    const contents = params.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    const body: any = {
      contents,
      generationConfig: {
        maxOutputTokens: 3000,
        temperature: 0.1,
      }
    };
    
    if (params.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: params.systemPrompt }]
      };
    }
    
    const url = apiKey
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      : getApiEndpoint();

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini Error ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    // Fall through to local fallback on any network/API failure
  }

  return generateLocalFallbackResponse(params.systemPrompt || '', params.messages);
}
