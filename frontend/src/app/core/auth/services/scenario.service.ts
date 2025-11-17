// src/app/core/auth/services/scenario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URLS } from './../../../config/api.config';
import { AuthService } from './auth.service';

export interface Scenario {
  id?: number;
  name: string;
  description?: string;
}

export interface AircraftType {
  id: number;
  name: string;
  model: string;
  color?: string;
  max_speed_mps?: number;
}

export interface Waypoint {
  lat: number;
  lon: number;
  alt: number;
}

export type AircraftStatus = 'waiting' | 'moving' | 'paused' | 'arrived' | 'stopped';

export interface DeployedAircraft {
  id?: number;

  // Serializer returns numeric scenario id
  scenario: number;

  // NOTE: list serializer returns nested aircraft_type (object),
  // but create/update expects numeric id. Support both.
  aircraft_type: number | AircraftType;

  name?: string;
  status?: AircraftStatus; // present on GET (list), not accepted on create/update

  // Available on model, but list serializer may not include them; editor needs them.
  initial_latitude?: number;
  initial_longitude?: number;
  initial_altitude_m?: number;

  planned_waypoints?: Waypoint[];

  // From DeployedAircraftListSerializer
  position?: {
    latitude: number;
    longitude: number;
    altitude_m: number;
  };

  velocity?: {
    ground_speed_mps: number | null;
    heading_deg: number | null;
    vertical_rate_mps: number | null;
    rate_of_turn_deg_per_sec: number | null;
  };

  last_updated?: string | null;
  radar_asset?: any;
  external_id?: string;
}

@Injectable({ providedIn: 'root' })
export class ScenarioService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  private handleError(error: any) {
    console.error('Scenario API error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  // ===== Scenarios =====
  getAllScenarios(): Observable<Scenario[]> {
    return this.http
      .get<Scenario[]>(API_URLS.SCENARIOS, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getScenarioById(id: number | string): Observable<Scenario> {
    return this.http
      .get<Scenario>(API_URLS.SCENARIO_BY_ID(id), { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  createScenario(data: Partial<Scenario>): Observable<Scenario> {
    return this.http
      .post<Scenario>(API_URLS.SCENARIOS, data, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateScenario(id: number | string, data: Partial<Scenario>): Observable<Scenario> {
    return this.http
      .put<Scenario>(API_URLS.SCENARIO_BY_ID(id), data, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteScenario(id: number | string): Observable<void> {
    return this.http
      .delete<void>(API_URLS.SCENARIO_BY_ID(id), { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ===== Types =====
  getAircraftTypes(): Observable<AircraftType[]> {
    return this.http
      .get<AircraftType[]>(API_URLS.AIRCRAFT_TYPES, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ===== Deployed aircraft =====
  getDeployedAircrafts(scenarioId: number): Observable<DeployedAircraft[]> {
    return this.http
      .get<DeployedAircraft[]>(
        API_URLS.DEPLOYED_AIRCRAFT_BY_SCENARIO(scenarioId),
        { headers: this.getAuthHeaders() }
      )
      .pipe(catchError(this.handleError));
  }

  deployAircraft(data: DeployedAircraft): Observable<DeployedAircraft> {
    return this.http
      .post<DeployedAircraft>(API_URLS.DEPLOYED_AIRCRAFT, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  updateDeployedAircraft(
    id: number,
    data: Partial<DeployedAircraft>
  ): Observable<DeployedAircraft> {
    // Prefer dedicated BY_ID helper; fallback to /deployed-aircraft/{id}/
    const url = (API_URLS as any).DEPLOYED_AIRCRAFT_BY_ID
      ? (API_URLS as any).DEPLOYED_AIRCRAFT_BY_ID(id)
      : `${API_URLS.DEPLOYED_AIRCRAFT}${id}/`;

    return this.http
      .put<DeployedAircraft>(url, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  deleteDeployedAircraft(id: number): Observable<void> {
    // Same URL logic as update
    const url = (API_URLS as any).DEPLOYED_AIRCRAFT_BY_ID
      ? (API_URLS as any).DEPLOYED_AIRCRAFT_BY_ID(id)
      : `${API_URLS.DEPLOYED_AIRCRAFT}${id}/`;

    return this.http
      .delete<void>(url, {
        headers: this.getAuthHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
