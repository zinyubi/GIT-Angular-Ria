import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URLS } from '../../../config/api.config';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number; // expiration timestamp in seconds
}

interface LoginResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _screenCache: any[] = [];

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  /**
   * Logs in the user, saves tokens and username on success.
   * @param username User's username
   * @param password User's password
   */
  login(username: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(API_URLS.LOGIN, { username, password })
      .pipe(
        map((res) => {
          if (!res.access || !res.refresh) {
            throw new Error('Missing tokens in response');
          }
          // Store access and refresh tokens
          this.tokenStorage.setTokens(res.access, res.refresh);
          this.tokenStorage.setUsername(username);
        }),
        catchError((err) => {
          const errorMsg =
            err?.error?.detail || 'Login failed. Please check your credentials.';
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  logout(): void {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

    // Add a getter method to retrieve the access token
  getAccessToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  isLoggedIn(): boolean {
    return !!this.tokenStorage.getAccessToken() && !this.isTokenExpired();
  }

  getUsername(): string | null {
    return this.tokenStorage.getUsername();
  }

  getTokenExpiration(): Date | null {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  /**
   * Check if the current access token is expired
   */
  private isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    return expiration ? expiration < new Date() : true;
  }

  /**
   * Retrieves the authentication headers with the token.
   * This is now handled via interceptors, but still useful for direct API calls.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return new HttpHeaders();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserScreens(): Observable<any> {
    return this.http
      .get<any>(API_URLS.USER_SCREENS, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Failed to load user screens:', err);
          return throwError(() => err);
        })
      );
  }

  setUserScreensCache(screens: any[]): void {
    this._screenCache = screens;
  }

  getUserScreensCache(): any[] {
    return this._screenCache;
  }

  getUserDetails(): Observable<any> {
    return this.http
      .get<any>(API_URLS.USERS_ME, { headers: this.getAuthHeaders() })
      .pipe(
        catchError((err) => {
          console.error('Failed to get user details:', err);
          return throwError(() => err);
        })
      );
  }

  /**
   * Refreshes the access token using the refresh token.
   * Updates the stored access token if successful.
   * @param refreshToken The current refresh token.
   * @returns Observable emitting the new access token string.
   */
  refreshToken(refreshToken: string): Observable<string> {
    return this.http
      .post<{ access: string }>(`${API_URLS.LOGIN}refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        map((res) => {
          if (!res.access) {
            throw new Error('No new access token returned');
          }
          this.tokenStorage.setAccessToken(res.access);
          return res.access;
        }),
        catchError((err) => {
          console.error('Refresh token failed:', err);
          return throwError(() => err);
        })
      );
  }
}
