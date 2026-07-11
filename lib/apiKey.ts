/**
 * CrimeVision AI — API Key Manager
 * Handles API key retrieval for Gemini,
 * falling back to localStorage if env is not defined (crucial for GitHub Pages).
 */

export function getGeminiApiKey(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  }
  const envKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  const localKey = localStorage.getItem('ksp_gemini_api_key') || '';
  return (envKey || localKey).trim();
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ksp_gemini_api_key', key.trim());
  }
}

export function clearGeminiApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ksp_gemini_api_key');
  }
}

export function hasGeminiApiKey(): boolean {
  return !!getGeminiApiKey();
}

export function getActiveProvider(): 'gemini' {
  return 'gemini';
}

export function getActiveApiKey(): string {
  return getGeminiApiKey();
}

export function hasAnyApiKey(): boolean {
  return hasGeminiApiKey();
}
