/**
 * CrimeVision AI — AI Intelligence Service
 * Handles unified browser-side API calls to Gemini and Anthropic (Claude)
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
  
  // 1. Predictions / Risk Forecast request
  if (allText.includes('prediction') || allText.includes('forecast') || allText.includes('risk assessment engine') || allText.includes('prediction_prompt')) {
    try {
      return JSON.stringify(localAI.generatePrediction());
    } catch {
      // fallback
    }
  }

  // 2. FIR summary request
  if (allText.includes('case summary') || allText.includes('fir number') || allText.includes('fir:')) {
    const firMatch = allText.match(/fir\/\d{4}\/[a-z]{3}\/\d+/i);
    let matchedFir = RECENT_FIRS[0];
    if (firMatch) {
      const found = RECENT_FIRS.find(f => f.firNumber.toLowerCase() === firMatch[0].toLowerCase());
      if (found) matchedFir = found;
    }
    return localAI.generateCaseSummary(matchedFir);
  }

  // 3. General query fallback
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
  const provider = getActiveProvider();
  const apiKey = provider === 'gemini' ? getActiveApiKey() : 'placeholder';
  const hasKey = provider === 'gemini' ? !!apiKey : true;

  if (hasKey) {
    try {
      if (provider === 'gemini') {
        return await runGeminiStream(apiKey!, params);
      } else {
        return await runAnthropicStream(params);
      }
    } catch (err) {
      // Fall through to local fallback on any failure
    }
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

  // Use alt=sse for standard server-sent events stream format
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gemini API Error ${response.status}`);
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
      buffer = lines.pop() || ''; // Keep the last partial line in the buffer

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

  // Handle final residue in buffer
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
  if (window.location.pathname.includes('/app/')) {
    return '/server/crimevision-ai/api/crimevision-ai/';
  }
  return '/api/crimevision-ai/';
}

// ── Anthropic REST Streaming Implementation via Catalyst Proxy ───────────────
async function runAnthropicStream(
  params: { systemPrompt?: string; messages: ChatMessage[]; onChunk: (text: string) => void; signal?: AbortSignal }
): Promise<string> {
  const { systemPrompt, messages, onChunk, signal } = params;
  const endpoint = getApiEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      systemPrompt,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Claude Proxy Error ${response.status}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]' || data === '') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
              const deltaText = parsed.delta.text;
              fullText += deltaText;
              onChunk(deltaText);
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    }
  }

  return fullText;
}

export async function generateText(params: {
  systemPrompt?: string;
  messages: ChatMessage[];
}): Promise<string> {
  const provider = getActiveProvider();
  const apiKey = provider === 'gemini' ? getActiveApiKey() : 'placeholder';
  const hasKey = provider === 'gemini' ? !!apiKey : true;

  if (hasKey) {
    try {
      if (provider === 'gemini') {
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
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );
        
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `Gemini Error ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        // Anthropic - secure proxy call to backend
        const endpoint = getApiEndpoint();
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: params.messages,
            systemPrompt: params.systemPrompt,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Claude Proxy Error ${response.status}`);
        }

        const data = await response.json();
        return data.content?.[0]?.text || '';
      }
    } catch (err) {
      // Fall through to local fallback on any network/API failure
    }
  }

  return generateLocalFallbackResponse(params.systemPrompt || '', params.messages);
}
