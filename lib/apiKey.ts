/**
 * CrimeVision AI — API Key Manager
 * Handles API key retrieval, falling back to localStorage if env is not defined
 * (crucial for static deployments on GitHub Pages).
 */

export function getAnthropicApiKey(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
  }
  const envKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '';
  const localKey = localStorage.getItem('ksp_anthropic_api_key') || '';
  return (envKey || localKey).trim();
}

export function setAnthropicApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ksp_anthropic_api_key', key.trim());
  }
}

export function clearAnthropicApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ksp_anthropic_api_key');
  }
}

export function hasAnthropicApiKey(): boolean {
  return !!getAnthropicApiKey();
}
