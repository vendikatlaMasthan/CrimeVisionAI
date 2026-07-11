'use client';
// ─────────────────────────────────────────────────────────────────────────────
// app/predictions/page.tsx — AI Risk Prediction & Predictive Analytics (Light Theme)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useEffect, Suspense } from 'react';
import {
  TrendingUp, Brain, RefreshCw, AlertTriangle, CheckCircle,
  Zap, Clock, Activity, MapPin, ChevronUp, Check
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageToggle';
import { hasAnyApiKey } from '@/lib/apiKey';
import { generateText } from '@/lib/aiService';
import { localAI, LocalPredictionResult } from '@/lib/localAiEngine';

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

const PREDICTION_PROMPT = `You are the Karnataka State Police AI-assisted Risk Assessment Engine. Based on 18 months of synthetic crime data (Jan 2024 – Jun 2025) covering 82,089 total crimes across 31 districts, assess elevated risk indexes and provide decision support recommendations for the next 30 days based on historical patterns. Do not present findings as absolute guarantees of future crime.

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
      "recommendation": "Deploy Patrol Focus: Increase presence near IT corridors and banking zones."
    }
  ],
  "crimeSpikes": [
    {
      "crimeType": "Cybercrime",
      "expectedIncrease": "+18%",
      "peakPeriod": "Week 2-3 of July",
      "affectedDistricts": ["Bengaluru Urban", "Mangaluru", "Mysuru"],
      "preventiveMeasure": "Investigation Lead: Initiate technical audit on local payment gateways.",
      "confidence": 87
    }
  ],
  "recommendations": [
    {
      "priority": "Critical",
      "action": "Patrol Focus: Deploy 80 additional cybercrime specialists across high risk tech corridors.",
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

function PredictionsPageContent() {
  const { t, lang } = useLanguage();
  // Accept both local and external AI result shapes (they share the same key fields)
  const [prediction, setPrediction] = useState<PredictionResult | LocalPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingLocalEngine, setUsingLocalEngine] = useState(false);

  /**
   * Generate prediction — LOCAL engine is always the guaranteed fallback.
   * External AI (Gemini) is attempted first ONLY if a key is configured;
   * on any failure it falls back to the local engine silently.
   * Page is NEVER blank — local result is always shown.
   */
  const generatePrediction = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // ── Try external AI first (optional enrichment) ──
    if (hasAnyApiKey()) {
      try {
        const text = await generateText({
          messages: [{ role: 'user', content: PREDICTION_PROMPT }]
        });
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as PredictionResult;
          setPrediction(parsed);
          setLastUpdated(new Date());
          setUsingLocalEngine(false);
          setIsLoading(false);
          return;
        }
      } catch {
        // External AI failed — fall through to local engine silently
      }
    }

    // ── Local engine fallback (always works, no API key needed) ──
    const localResult = localAI.generatePrediction();
    setPrediction(localResult as unknown as PredictionResult);
    setLastUpdated(new Date());
    setUsingLocalEngine(true);
    setIsLoading(false);
  }, []);

  // Auto-generate on page load — page is never blank
  useEffect(() => {
    generatePrediction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const threatColors: Record<string, { bg: string; border: string; text: string }> = {
    Critical: { bg: '#FEF2F2', border: '#FCA5A5', text: '#ef4444' },
    High:     { bg: '#FFFBEB', border: '#FDE68A', text: '#f59e0b' },
    Medium:   { bg: '#E0F2FE', border: '#BAE6FD', text: '#1976D2' },
    Low:      { bg: '#D1FAE5', border: '#A7F3D0', text: '#2E8B57' },
  };

  const getThreatLevelByScore = (score: number): 'Critical' | 'High' | 'Medium' | 'Low' => {
    if (score > 80) return 'Critical';
    if (score > 60) return 'High';
    if (score > 40) return 'Medium';
    return 'Low';
  };

  const riskBarColor = (score: number) => score > 80 ? '#ef4444' : score > 60 ? '#f59e0b' : score > 40 ? '#1E3A5F' : '#2E8B57';
  const minutesAgo = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000) : 0;

  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 24, background: '#F5F7FA' }}>

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#F5F3FF', border: '1px solid #DDD6FE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={22} color="#7C3AED" />
          </div>
          <div>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <span className="section-header-line" />
              <h1 className="section-title">
                {t.page_risk_prediction}
              </h1>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0' }}>
              {t.sub_risk_prediction}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {lastUpdated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '12px', color: '#475569' }}>
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
              background: isLoading ? '#E5E7EB' : '#1E3A5F',
              border: '1px solid #1E3A5F', borderRadius: 10,
              color: isLoading ? '#475569' : '#FFFFFF',
              fontSize: '14px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.04em', transition: 'all 0.2s',
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

      {/* ── Local Engine Notice (shown when no external key configured) ── */}
      {usingLocalEngine && prediction && (
        <div style={{
          padding: '10px 16px', borderRadius: 10,
          background: 'rgba(15,107,92,0.06)', border: '1px solid rgba(15,107,92,0.2)',
          display: 'flex', alignItems: 'center', gap: 10, fontSize: '12px',
        }}>
          <CheckCircle size={14} color="#0F6B5C" style={{ flexShrink: 0 }} />
          <span style={{ color: '#0F6B5C', fontWeight: 600 }}>
            Powered by Local AI Engine — computed from {' '}
            <strong>82,089 Karnataka crime records</strong> across 31 districts. No external API required.
          </span>
        </div>
      )}

      {/* ── Error (non-blocking — local engine result still shown) ── */}
      {error && (
        <div style={{
          padding: '10px 16px', borderRadius: 10,
          background: '#FEF2F2', border: '1px solid #FCA5A5',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={15} color="#ef4444" />
          <span style={{ fontSize: '14px', color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {/* ── Loading Spinner (brief — local engine is synchronous) ── */}
      {!prediction && isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <div style={{ textAlign: 'center' }}>
            <RefreshCw size={32} color="#7C3AED" style={{ animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
            <p style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>Generating 30-day forecast from Karnataka crime data...</p>
          </div>
        </div>
      )}

      {/* ── Empty State (should never show — auto-load fires on mount) ── */}
      {!prediction && !isLoading && !error && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 400, textAlign: 'center', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB'
        }}>
          <div style={{ maxWidth: 460, padding: 20 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: '0 auto 24px',
              background: '#F5F3FF', border: '1px solid #DDD6FE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={36} color="#7C3AED" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', marginBottom: 10 }}>
              AI-assisted Risk Assessment Engine
            </h2>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: 24 }}>
              {t.pred_no_prediction}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 32, fontSize: '12px', color: '#475569' }}>
              {['82,089 crime records', '31 districts', 'AI models calibrated', '18-month trend data'].map(tag => (
                <div key={tag} style={{
                  padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 5,
                  background: '#F9FAFB', border: '1px solid #E5E7EB',
                }}>
                  <CheckCircle size={10} color="#2E8B57" /> {tag}
                </div>
              ))}
            </div>
            <button
              onClick={generatePrediction}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px',
                background: '#1E3A5F', border: '1px solid #1E3A5F', borderRadius: 10, cursor: 'pointer',
                color: '#FFFFFF', fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
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
          minHeight: 400, textAlign: 'center', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB'
        }}>
          <div>
            <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 24px' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                border: '3px solid #E5E7EB',
                borderTopColor: '#7C3AED',
                animation: 'spin 1s linear infinite',
              }} />
              <Brain size={24} color="#7C3AED" style={{ position: 'absolute', inset: 0, margin: 'auto' }} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', marginBottom: 8 }}>
              {t.pred_generating}
            </h3>
            <p style={{ fontSize: '12px', color: '#475569', maxWidth: 400, margin: '0 auto' }}>
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
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: '#FFFFFF',
                border: `2px solid ${threatColors[prediction.overallThreatLevel].border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AlertTriangle size={26} color={threatColors[prediction.overallThreatLevel].text} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
                  {t.pred_threat_level}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: threatColors[prediction.overallThreatLevel].text }}>
                  {prediction.overallThreatLevel.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 56, background: '#E5E7EB' }} />

            {/* Threat Score Dial */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: threatColors[prediction.overallThreatLevel].text }}>
                {prediction.threatScore}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase' }}>/ 100</div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 56, background: '#E5E7EB' }} />

            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                {t.pred_overall_analysis}
              </div>
              <p style={{ fontSize: '12px', color: '#1F2937', lineHeight: 1.6, margin: 0 }}>
                {prediction.overallSummary}
              </p>
            </div>

            <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
              <div style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {lang === 'kn' ? 'ಮಾದರಿ ವಿಶ್ವಾಸಾರ್ಹತೆ' : 'Model Confidence'}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#2E8B57' }}>
                {prediction.modelConfidence}%
              </div>
              <div style={{ fontSize: '12px', color: '#475569' }}>{prediction.predictionPeriod}</div>
            </div>
          </div>

          {/* Three-column layout: Districts | Spikes | Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* ── High Risk Districts ───────────────────────────────── */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MapPin size={15} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {lang === 'kn' ? 'ಮುಂದಿನ ೩೦ ದಿನಗಳಲ್ಲಿ ಹೆಚ್ಚಿನ ಅಪಾಯದಲ್ಲಿರುವ ಜಿಲ್ಲೆಗಳು' : 'Districts at High Risk in Next 30 Days'}
                </span>
                <span style={{
                  marginLeft: 'auto', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                  background: '#FEF2F2', color: '#ef4444', border: '1px solid #FCA5A5',
                  flexShrink: 0
                }}>
                  {lang === 'kn' ? 'ಮುಖ್ಯ' : 'TOP'} {prediction.highRiskDistricts.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {prediction.highRiskDistricts.map((d, i) => {
                  const diff = d.predictedRisk - d.currentRisk;
                  const threatLevel = getThreatLevelByScore(d.predictedRisk);
                  return (
                    <div key={i} style={{
                      padding: 14, borderRadius: 12,
                      background: '#F9FAFB', border: '1px solid #E5E7EB',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937' }}>{d.district}</div>
                          <div style={{ fontSize: '12px', color: '#475569', marginTop: 1 }}>
                            <strong>Primary Threat:</strong> {d.primaryThreat} ({diff > 0 ? '+' : ''}{diff}% predicted risk surge)
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: riskBarColor(d.predictedRisk) }}>
                            {d.predictedRisk}
                          </div>
                          <div style={{ fontSize: '12px', color: diff > 0 ? '#ef4444' : '#2E8B57', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                            <ChevronUp size={9} style={{ transform: diff < 0 ? 'rotate(180deg)' : 'none' }} />
                            {diff > 0 ? '+' : ''}{diff} {lang === 'kn' ? 'ಅಂಕಗಳು' : 'pts'}
                          </div>
                        </div>
                      </div>

                      {/* Display explicit details required by prompt */}
                      <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                        <span><strong>{lang === 'kn' ? 'ಅಪಾಯ ಸೂಚ್ಯಂಕ:' : 'Risk Score:'}</strong> {d.predictedRisk}/100</span>
                        <span>•</span>
                        <span><strong>{lang === 'kn' ? 'ಬೆದರಿಕೆ ಮಟ್ಟ:' : 'Threat Level:'}</strong> <span style={{ color: threatColors[threatLevel].text, fontWeight: 700 }}>{(lang === 'kn' ? (threatLevel.toUpperCase() === 'CRITICAL' ? t.priority_critical : threatLevel.toUpperCase() === 'HIGH' ? t.priority_high : t.priority_medium) : threatLevel)}</span></span>
                        <span>•</span>
                        <span><strong>{lang === 'kn' ? 'ವಿಶ್ವಾಸಾರ್ಹತೆ:' : 'Confidence:'}</strong> {d.confidenceScore}%</span>
                      </div>

                      {/* Risk bar */}
                      <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{
                          height: '100%', width: `${d.predictedRisk}%`, borderRadius: 2,
                          background: riskBarColor(d.predictedRisk),
                        }} />
                      </div>

                      {/* Key factors */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 8 }}>
                        {d.keyFactors.map((f, j) => (
                          <div key={j} style={{ fontSize: '12px', color: '#475569', display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                            <span style={{ color: '#9CA3AF', flexShrink: 0 }}>•</span> {f}
                          </div>
                        ))}
                      </div>

                      <div style={{
                        fontSize: '12px', color: '#5B21B6', padding: '6px 10px', borderRadius: 6,
                        background: '#F5F3FF', border: '1px solid #DDD6FE', fontWeight: 600
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Zap size={11} /> <strong>Recommended Action:</strong></span> {d.recommendation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right column: Crime Spikes + Recommendations ──────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Crime Spikes */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Activity size={15} color="#f59e0b" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {t.pred_crime_spikes}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {prediction.crimeSpikes.map((spike, i) => (
                    <div key={i} style={{
                      padding: 12, borderRadius: 10,
                      background: '#FFFBEB', border: '1px solid #FDE68A',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937' }}>
                          {lang === 'kn' ? (
                            spike.crimeType.toLowerCase().includes('cyber') ? t.crime_cybercrime :
                            spike.crimeType.toLowerCase().includes('theft') ? t.crime_theft :
                            spike.crimeType.toLowerCase().includes('narcotics') ? t.crime_narcotics :
                            spike.crimeType.toLowerCase().includes('assault') ? t.crime_assault :
                            spike.crimeType.toLowerCase().includes('sand') ? t.crime_sand_mining :
                            spike.crimeType.toLowerCase().includes('organized') ? t.crime_organized :
                            spike.crimeType
                          ) : spike.crimeType}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 900, color: '#d97706' }}>{spike.expectedIncrease}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: 6 }}>
                        {lang === 'kn' ? 'ಗರಿಷ್ಠ ಅವಧಿ:' : 'Peak:'} {spike.peakPeriod}
                        <span style={{ margin: '0 6px', color: '#D1D5DB' }}>·</span>
                        {lang === 'kn' ? 'ವಿಶ್ವಾಸಾರ್ಹತೆ:' : 'Confidence:'} {spike.confidence}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: 6 }}>
                        {lang === 'kn' ? 'ಜಿಲ್ಲೆಗಳು:' : 'Districts:'} {spike.affectedDistricts.join(', ')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                        <Check size={11} /> {spike.preventiveMeasure}
                      </div>

                      {/* Confidence bar */}
                      <div style={{ height: 2, background: '#E5E7EB', borderRadius: 1, overflow: 'hidden', marginTop: 8 }}>
                        <div style={{ height: '100%', width: `${spike.confidence}%`, background: '#f59e0b' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Brain size={15} color="#0F6B5C" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                            fontSize: '12px', fontWeight: 800, padding: '2px 7px', borderRadius: 4,
                            background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}>
                            {rec.priority}
                          </span>
                          <span style={{ fontSize: '12px', color: '#475569' }}>{rec.timeframe}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#1F2937', margin: '0 0 6px', fontWeight: 700, lineHeight: 1.4 }}>
                          {rec.action}
                        </p>
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          Districts: {rec.districts.join(', ')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#2E8B57', marginTop: 3, fontWeight: 600 }}>
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
                background: '#FFFFFF', border: '1px solid #D1D5DB',
                borderRadius: 8, color: '#475569', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'; }}
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

export default function PredictionsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: '#64748b', fontSize: '14px' }}>Loading Predictions...</div>}>
      <PredictionsPageContent />
    </Suspense>
  );
}
