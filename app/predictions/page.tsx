'use client';
// ─────────────────────────────────────────────────────────────────────────────
// Save this file to: app/predictions/page.tsx  (REPLACE existing file entirely)
// CrimeVision AI — AI Risk Prediction (Real Claude API call → JSON output)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import {
  TrendingUp, Brain, RefreshCw, AlertTriangle, CheckCircle,
  Shield, Zap, Clock, Activity, MapPin, ChevronUp,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DistrictPrediction {
  district: string;
  currentRisk: number;
  predictedRisk: number;
  primaryThreat: string;
  secondaryThreat: string;
  predictedIncrease: string;
  confidenceScore: number;
  keyFactors: string[];
  recommendation: string;
}

interface CrimeSpike {
  crimeType: string;
  expectedIncrease: string;
  peakPeriod: string;
  affectedDistricts: string[];
  preventiveMeasure: string;
  confidence: number;
}

interface Recommendation {
  priority: 'Critical' | 'High' | 'Medium';
  action: string;
  districts: string[];
  expectedImpact: string;
  timeframe: string;
}

interface PredictionResult {
  overallThreatLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  threatScore: number;
  overallSummary: string;
  highRiskDistricts: DistrictPrediction[];
  crimeSpikes: CrimeSpike[];
  recommendations: Recommendation[];
  modelConfidence: number;
  predictionPeriod: string;
  generatedAt: string;
}

// ─── System Prompt for Predictions ───────────────────────────────────────────

const PREDICTION_PROMPT = `You are the Karnataka State Police AI Risk Prediction Engine. Based on 18 months of crime data (Jan 2024 – Jun 2025) covering 82,089 total crimes across 31 districts, predict crime risk for the next 30 days.

CURRENT DATA (for context):
- Total crimes: 82,089 | Active cases: 14,823 | Clearance rate: 81.9%
- Top threats: Cybercrime (+34% YoY), Sand Mining (+18%), Narcotics (+28%), Organized Crime (+15%)
- Highest risk districts: Bengaluru Urban (14,823 crimes, Risk 94), Kalaburagi (7,891, Risk 87), Raichur (5,678, Risk 84), Ballari (6,789, Risk 81)
- Current anomalies: Bengaluru Urban cybercrime +243%, Kalaburagi narcotics +325%, Ballari organized crime +500%
- Recent: 8.2kg methamphetamine seized, SIM-swap fraud surges in Mangaluru, relay-attack vehicle theft spike in Mysuru
- Monsoon season approaching (heavy rainfall affects Dakshina Kannada, Udupi, Kodagu, Shivamogga, Chikkamagaluru)
- Festival season next month (increased footfall risk in Mysuru, Bengaluru Urban, Mangaluru)

Return ONLY a valid JSON object with exactly this structure (no text before or after):
{
  "overallThreatLevel": "High",
  "threatScore": 78,
  "overallSummary": "2-3 sentence summary of the 30-day prediction",
  "highRiskDistricts": [
    {
      "district": "Bengaluru Urban",
      "currentRisk": 94,
      "predictedRisk": 96,
      "primaryThreat": "Cybercrime",
      "secondaryThreat": "Organized Crime",
      "predictedIncrease": "+12%",
      "confidenceScore": 91,
      "keyFactors": ["factor 1", "factor 2", "factor 3"],
      "recommendation": "Specific action"
    }
  ],
  "crimeSpikes": [
    {
      "crimeType": "Cybercrime",
      "expectedIncrease": "+18%",
      "peakPeriod": "Week 2-3 of July",
      "affectedDistricts": ["Bengaluru Urban", "Mangaluru", "Mysuru"],
      "preventiveMeasure": "Specific prevention action",
      "confidence": 87
    }
  ],
  "recommendations": [
    {
      "priority": "Critical",
      "action": "Deploy 80 additional cybercrime specialists",
      "districts": ["Bengaluru Urban"],
      "expectedImpact": "30% reduction in cybercrime",
      "timeframe": "Immediate"
    }
  ],
  "modelConfidence": 87,
  "predictionPeriod": "July 1–30, 2025",
  "generatedAt": "${new Date().toISOString()}"
}

Rules:
- Include exactly 5 highRiskDistricts
- Include exactly 5 crimeSpikes
- Include exactly 6 recommendations (2 Critical, 2 High, 2 Medium)
- All numbers must be realistic based on the actual Karnataka data provided
- keyFactors must have exactly 3 items each
- Focus on real patterns: monsoon impact, festival season, narcotics routes, cybercrime vectors
- Return ONLY the JSON, no markdown, no text outside the JSON`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PredictionsPage() {
  const { t, lang } = useLanguage();
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(!process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY);

  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  const generatePrediction = useCallback(async () => {
    if (!apiKey) { setApiKeyMissing(true); return; }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 4096,
          messages: [{ role: 'user', content: PREDICTION_PROMPT }],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as Record<string, Record<string, string>>).error?.message || `API Error ${response.status}`);
      }

      const data = await response.json() as { content: { type: string; text: string }[] };
      const text = data.content?.[0]?.type === 'text' ? data.content[0].text : '';

      // Extract JSON from response (handles extra text if any)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('AI returned no valid JSON. Try again.');

      const parsed = JSON.parse(jsonMatch[0]) as PredictionResult;
      setPrediction(parsed);
      setLastUpdated(new Date());
    } catch (err) {
      setError(`${(err as Error).message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const threatColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    Critical: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.35)', text: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
    High:     { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.35)', text: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
    Medium:   { bg: 'rgba(0,240,255,0.06)', border: 'rgba(0,240,255,0.25)', text: '#00f0ff', glow: 'rgba(0,240,255,0.3)' },
    Low:      { bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.25)', text: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  };

  const riskBarColor = (score: number) => score > 80 ? '#ef4444' : score > 60 ? '#f59e0b' : score > 40 ? '#00f0ff' : '#10b981';
  const minutesAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000) : 0;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139,92,246,0.2)',
          }}>
            <TrendingUp size={22} color="#a78bfa" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#f1f5f9', margin: 0 }}>
              {t.page_risk_prediction}
            </h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>
              {t.sub_risk_prediction}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {lastUpdated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748b' }}>
              <Clock size={11} />
              {t.pred_last_updated}: {minutesAgo === 0 ? 'Just now' : `${minutesAgo}m ago`}
            </div>
          )}
          <button
            id="generate-prediction-btn"
            onClick={generatePrediction}
            disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px',
              background: isLoading
                ? 'rgba(139,92,246,0.05)'
                : 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(0,240,255,0.1))',
              border: '1px solid rgba(139,92,246,0.45)', borderRadius: 10,
              color: isLoading ? '#64748b' : '#a78bfa',
              fontSize: 13, fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.04em', transition: 'all 0.2s',
              boxShadow: isLoading ? 'none' : '0 0 20px rgba(139,92,246,0.2)',
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
                {t.pred_generating}
              </>
            ) : (
              <>
                <Zap size={15} />
                {t.btn_generate_prediction}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── API Key Error ─────────────────────────────────────────────── */}
      {apiKeyMissing && (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>
              {t.error_api_key_missing}
            </p>
            <p style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
              {t.error_api_key_instructions}
            </p>
          </div>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          padding: '14px 18px', borderRadius: 12,
          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={15} color="#ef4444" />
          <span style={{ fontSize: 13, color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {/* ── Empty State ───────────────────────────────────────────────── */}
      {!prediction && !isLoading && !error && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 400, textAlign: 'center',
        }}>
          <div style={{ maxWidth: 460 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
              background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(139,92,246,0.15)',
            }}>
              <Brain size={36} color="#a78bfa" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#e2e8f0', marginBottom: 10 }}>
              AI Risk Prediction Engine
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
              {t.pred_no_prediction}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 32, fontSize: 12, color: '#475569' }}>
              {['82,089 crime records', '31 districts', 'claude-sonnet-4-6', '18-month trend data'].map(tag => (
                <div key={tag} style={{
                  padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <CheckCircle size={10} color="#10b981" /> {tag}
                </div>
              ))}
            </div>
            <button
              onClick={generatePrediction}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(0,240,255,0.1))',
                border: '1px solid rgba(139,92,246,0.45)', borderRadius: 10, cursor: 'pointer',
                color: '#a78bfa', fontSize: 14, fontWeight: 800, fontFamily: 'inherit',
                boxShadow: '0 0 24px rgba(139,92,246,0.25)',
              }}
            >
              <Zap size={16} /> {t.btn_generate_prediction}
            </button>
          </div>
        </div>
      )}

      {/* ── Loading State ─────────────────────────────────────────────── */}
      {isLoading && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 400, textAlign: 'center',
        }}>
          <div>
            <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                border: '3px solid rgba(139,92,246,0.15)',
                borderTopColor: '#a78bfa',
                animation: 'spin 1s linear infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 12,
                borderRadius: '50%', border: '2px solid rgba(0,240,255,0.2)',
                borderBottomColor: '#00f0ff',
                animation: 'spin 0.7s linear infinite reverse',
              }} />
              <Brain size={24} color="#a78bfa" style={{ position: 'absolute', inset: 0, margin: 'auto' }} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', marginBottom: 8 }}>
              {t.pred_generating}
            </h3>
            <p style={{ fontSize: 12, color: '#64748b' }}>
              Analyzing 82,089 crime records · Computing district risk scores · Generating recommendations...
            </p>
          </div>
        </div>
      )}

      {/* ── Prediction Results ────────────────────────────────────────── */}
      {prediction && !isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Overall Threat Banner */}
          <div style={{
            padding: '20px 24px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
            background: threatColors[prediction.overallThreatLevel].bg,
            border: `1px solid ${threatColors[prediction.overallThreatLevel].border}`,
            boxShadow: `0 0 32px ${threatColors[prediction.overallThreatLevel].glow}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: threatColors[prediction.overallThreatLevel].bg,
                border: `2px solid ${threatColors[prediction.overallThreatLevel].border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={26} color={threatColors[prediction.overallThreatLevel].text} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
                  {t.pred_threat_level}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: threatColors[prediction.overallThreatLevel].text }}>
                  {prediction.overallThreatLevel.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.08)' }} />

            {/* Threat Score Dial */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: threatColors[prediction.overallThreatLevel].text }}>
                {prediction.threatScore}
              </div>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase' }}>/ 100</div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.08)' }} />

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                {t.pred_overall_analysis}
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {prediction.overallSummary}
              </p>
            </div>

            <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                Model Confidence
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
                {prediction.modelConfidence}%
              </div>
              <div style={{ fontSize: 10, color: '#475569' }}>{prediction.predictionPeriod}</div>
            </div>
          </div>

          {/* Three-column layout: Districts | Spikes | Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* ── High Risk Districts ───────────────────────────────── */}
            <div style={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(0,240,255,0.12)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MapPin size={15} color="#ef4444" />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {t.pred_high_risk_districts}
                </span>
                <span style={{
                  marginLeft: 'auto', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                  background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)',
                }}>
                  TOP {prediction.highRiskDistricts.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {prediction.highRiskDistricts.map((d, i) => {
                  const diff = d.predictedRisk - d.currentRisk;
                  return (
                    <div key={i} style={{
                      padding: 14, borderRadius: 12,
                      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{d.district}</div>
                          <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{d.primaryThreat} · {d.secondaryThreat}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 900, color: riskBarColor(d.predictedRisk) }}>
                            {d.predictedRisk}
                          </div>
                          <div style={{ fontSize: 9, color: diff > 0 ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                            <ChevronUp size={9} style={{ transform: diff < 0 ? 'rotate(180deg)' : 'none' }} />
                            {diff > 0 ? '+' : ''}{diff} pts
                          </div>
                        </div>
                      </div>

                      {/* Risk bar */}
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{
                          height: '100%', width: `${d.predictedRisk}%`, borderRadius: 2,
                          background: riskBarColor(d.predictedRisk),
                          boxShadow: `0 0 8px ${riskBarColor(d.predictedRisk)}60`,
                        }} />
                      </div>

                      {/* Key factors */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
                        {d.keyFactors.map((f, j) => (
                          <div key={j} style={{ fontSize: 10, color: '#64748b', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                            <span style={{ color: '#475569', flexShrink: 0 }}>•</span> {f}
                          </div>
                        ))}
                      </div>

                      <div style={{
                        fontSize: 10, color: '#a78bfa', padding: '6px 10px', borderRadius: 6,
                        background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
                      }}>
                        💡 {d.recommendation}
                      </div>

                      <div style={{ fontSize: 9, color: '#334155', marginTop: 6, textAlign: 'right' }}>
                        Confidence: {d.confidenceScore}% · Expected: {d.predictedIncrease}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right column: Crime Spikes + Recommendations ──────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Crime Spikes */}
              <div style={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Activity size={15} color="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t.pred_crime_spikes}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {prediction.crimeSpikes.map((spike, i) => (
                    <div key={i} style={{
                      padding: 12, borderRadius: 10,
                      background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{spike.crimeType}</span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#f59e0b' }}>{spike.expectedIncrease}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>
                        Peak: {spike.peakPeriod}
                        <span style={{ margin: '0 6px', color: '#334155' }}>·</span>
                        Confidence: {spike.confidence}%
                      </div>
                      <div style={{ fontSize: 10, color: '#475569', marginBottom: 6 }}>
                        Districts: {spike.affectedDistricts.join(', ')}
                      </div>
                      <div style={{ fontSize: 10, color: '#10b981' }}>
                        ✓ {spike.preventiveMeasure}
                      </div>

                      {/* Confidence bar */}
                      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden', marginTop: 8 }}>
                        <div style={{ height: '100%', width: `${spike.confidence}%`, background: '#f59e0b' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ background: 'rgba(2,6,23,0.9)', border: '1px solid rgba(0,240,255,0.12)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Shield size={15} color="#00f0ff" />
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t.pred_recommendations}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {prediction.recommendations.map((rec, i) => {
                    const colors = threatColors[rec.priority];
                    return (
                      <div key={i} style={{
                        padding: 12, borderRadius: 10,
                        background: colors.bg, border: `1px solid ${colors.border}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{
                            fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 4,
                            background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}>
                            {rec.priority}
                          </span>
                          <span style={{ fontSize: 10, color: '#64748b' }}>{rec.timeframe}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#e2e8f0', margin: '0 0 6px', fontWeight: 600, lineHeight: 1.4 }}>
                          {rec.action}
                        </p>
                        <div style={{ fontSize: 10, color: '#64748b' }}>
                          Districts: {rec.districts.join(', ')}
                        </div>
                        <div style={{ fontSize: 10, color: '#10b981', marginTop: 3 }}>
                          Impact: {rec.expectedImpact}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Refresh button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={generatePrediction}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, color: '#64748b', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748b'; }}
            >
              <RefreshCw size={12} /> {t.btn_refresh} Prediction
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
