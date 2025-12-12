// src/app/config/api.config.ts
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
  USERS: `${BACKEND_BASE}/users/users/`,
  ROLES: `${BACKEND_BASE}/users/roles/`,
  SCREENS: `${BACKEND_BASE}/users/screens/`,
  ROLES_SCREENS: `${BACKEND_BASE}/users/roles/screens/`,

  // Scenario endpoints:
  SCENARIOS_BASE: `${BACKEND_BASE}/scenariosimulation/scenarios/`,
  SCENARIOS: `${BACKEND_BASE}/scenariosimulation/scenarios/`,
  SCENARIO_BY_ID: (id: number | string) =>
    `${BACKEND_BASE}/scenariosimulation/scenarios/${id}/`,

  AIRCRAFT_TYPES: `${BACKEND_BASE}/scenariosimulation/aircrafttypes/`,
  DEPLOYED_AIRCRAFT_BY_ID: (id: number) =>
    `${BACKEND_BASE}/scenariosimulation/deployedaircrafts/${id}/`,
  DEPLOYED_AIRCRAFT: `${BACKEND_BASE}/scenariosimulation/deployedaircrafts/`,
  DEPLOYED_AIRCRAFT_BY_SCENARIO: (scenarioId: number | string) =>
    `${BACKEND_BASE}/scenariosimulation/deployedaircrafts/?scenario=${scenarioId}`,
  DEPLOYED_AIRCRAFT_BY_SCENARIO_ID: (scenarioId: number | string) =>
    `${BACKEND_BASE}/scenariosimulation/deployedaircrafts/${scenarioId}/`,
};

/**
 * WebSocket endpoints and helpers.
 */
export const WS_URLS = {
  /** WebSocket endpoint for chat messages */
  CHAT: `${WS_BASE}/ws/chat/`,

  /**
   * WebSocket URL for simulation data for a given scenario.
   * Backend route: ws://.../ws/simulation/<scenario_id>/
   */
  SIMULATION: (scenarioId: number | string) =>
    `${WS_BASE}/ws/simulation/${scenarioId}/`,

  /**
   * Global simulation monitor.
   * Backend route: ws://.../ws/simulations/monitor/
   */
  MONITOR: `${WS_BASE}/ws/simulations/monitor/`,
};
