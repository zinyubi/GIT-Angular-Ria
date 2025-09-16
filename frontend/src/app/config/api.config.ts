import { environment } from '../../environments/environment';

const BACKEND_BASE = environment.backendBase;
const WS_BASE = environment.wsBase;

/**
 * REST API endpoints used throughout the application.
 */
export const API_URLS = {
  /** Endpoint to obtain authentication tokens */
  LOGIN: `${BACKEND_BASE}/api/token/`,

  /** Endpoint for user registration */
  REGISTER: `${BACKEND_BASE}/api/register/`,

  /** Endpoint to get current user information */
  USERS_ME: `${BACKEND_BASE}/users/me/`,

  /** Endpoint to retrieve user screens information */
  USER_SCREENS: `${BACKEND_BASE}/users/screens/`,
};

/**
 * WebSocket endpoints and helpers.
 */
export const WS_URLS = {
  /** WebSocket endpoint for chat messages */
  CHAT: `${WS_BASE}/ws/chat/`,

  /**
   * Generates the WebSocket URL for simulation data for a given scenario.
   * 
   * @param scenarioId - The ID of the simulation scenario (number or string).
   * @returns WebSocket URL string for the simulation.
   */
  simulation: (scenarioId: number | string) => `${WS_BASE}/ws/simulations/${scenarioId}/`,
};
