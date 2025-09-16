/**
 * Environment configuration for the Angular application.
 * 
 * Used for development purposes (non-production).
 * 
 * @property {boolean} production - Flag indicating if the build is for production (false here).
 * @property {string} backendBase - Base URL for backend HTTP API.
 * @property {string} wsBase - Base URL for WebSocket connections.
 */
export const environment = {
  production: false,
  backendBase: 'http://localhost:8000',
  wsBase: 'ws://localhost:8000',
};
