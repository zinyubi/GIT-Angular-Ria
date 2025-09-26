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
  // add other fields relevant to your scenario entity
}

@Injectable({
  providedIn: 'root',
})
export class ScenarioService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

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

  private handleError(error: any) {
    console.error('Scenario API error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
