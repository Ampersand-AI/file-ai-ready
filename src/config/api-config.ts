/**
 * API Configuration for Claude 3 Opus Integration
 * 
 * This file contains settings for the Claude API, including options
 * to toggle between real API calls and simulated responses.
 */

// Configuration object for Claude API
export const claudeApiConfig = {
  // Toggle between real API calls and simulated responses
  USE_REAL_API: false,
  
  // API details
  ENDPOINT: 'https://api.anthropic.com/v1/messages',
  API_KEY: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '',
  API_VERSION: '2023-06-01',
  
  // Model settings
  MODEL: 'claude-3-7-sonnet-20240229',
  MAX_TOKENS: 1024,
  TEMPERATURE: 0.7,
  TIMEOUT_MS: 30000,
};

/**
 * Enable real API calls
 */
export function enableRealAPI(): void {
  claudeApiConfig.USE_REAL_API = true;
  localStorage.setItem('useRealAPI', 'true');
}

/**
 * Disable real API calls (use simulation instead)
 */
export function disableRealAPI(): void {
  claudeApiConfig.USE_REAL_API = false;
  localStorage.setItem('useRealAPI', 'false');
}

/**
 * Toggle between real API calls and simulation
 * @returns The new state of USE_REAL_API after toggling
 */
export function toggleRealAPI(): boolean {
  claudeApiConfig.USE_REAL_API = !claudeApiConfig.USE_REAL_API;
  localStorage.setItem('useRealAPI', claudeApiConfig.USE_REAL_API.toString());
  return claudeApiConfig.USE_REAL_API;
}

/**
 * Check if the API is properly configured
 * @returns true if API_KEY is present and valid
 */
export function isApiConfigured(): boolean {
  return !!claudeApiConfig.API_KEY && claudeApiConfig.API_KEY.length > 0;
}

/**
 * Initialize the API configuration from localStorage
 */
export function initApiConfig(): void {
  // Initialize API configuration from localStorage if available
  const storedUseRealAPI = localStorage.getItem('useRealAPI');
  if (storedUseRealAPI !== null) {
    claudeApiConfig.USE_REAL_API = storedUseRealAPI === 'true';
  }
}

// Initialize on load if in browser environment
if (typeof window !== 'undefined') {
  initApiConfig();
}

export default claudeApiConfig; 