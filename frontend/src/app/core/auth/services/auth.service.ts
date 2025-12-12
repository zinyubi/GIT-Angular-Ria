// src/app/core/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URLS } from '../../../config/api.config';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp?: number; // expiration timestamp in seconds (optional in case it's missing)
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
    private router: Router,
  ) {}

  /**
   * Logs in the user, saves tokens and username on success.
   * @param username User's username
   * @param password User's password
   */
  login(username: string, password: string): Observable<void> {
    console.log('[AuthService] login() called for username:', username);
    return this.http
      .post<LoginResponse>(API_URLS.LOGIN, { username, password })
      .pipe(
        map((res) => {
          if (!res.access || !res.refresh) {
            console.error('[AuthService] login() response missing tokens:', res);
            throw new Error('Missing tokens in response');
          }
          this.tokenStorage.setTokens(res.access, res.refresh);
          this.tokenStorage.setUsername(username);
          console.log(
            '[AuthService] login() success, tokens stored for user:',
            username,
          );
        }),
        catchError((err) => {
          const errorMsg =
            err?.error?.detail || 'Login failed. Please check your credentials.';
          console.error('[AuthService] login() error:', errorMsg, err);
          return throwError(() => new Error(errorMsg));
        }),
      );
  }

  logout(): void {
    console.log('[AuthService] logout() called, clearing tokens');
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  // Get the access token
  getAccessToken(): string | null {
    const token = this.tokenStorage.getAccessToken();
    if (token) {
      console.debug(
        '[AuthService] getAccessToken() -> token present (hidden in logs)',
      );
    } else {
      console.debug('[AuthService] getAccessToken() -> no token');
    }
    return token;
  }

  isLoggedIn(): boolean {
    const loggedIn =
      !!this.tokenStorage.getAccessToken() && !this.isTokenExpired();
    console.debug('[AuthService] isLoggedIn() ->', loggedIn);
    return loggedIn;
  }

  getUsername(): string | null {
    const username = this.tokenStorage.getUsername();
    console.debug('[AuthService] getUsername() ->', username);
    return username;
  }

  getTokenExpiration(): Date | null {
    const token = this.tokenStorage.getAccessToken();
    if (!token) {
      console.debug('[AuthService] getTokenExpiration() -> no token');
      return null;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const exp = decoded.exp ? new Date(decoded.exp * 1000) : null;
      console.debug('[AuthService] getTokenExpiration() ->', exp);
      return exp;
    } catch (error) {
      console.error(
        '[AuthService] Invalid token in getTokenExpiration():',
        error,
      );
      return null;
    }
  }

  /**
   * Check if the current access token is expired
   */
  private isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    const expired = expiration ? expiration < new Date() : true;
    console.debug(
      '[AuthService] isTokenExpired() ->',
      expired,
      'exp =',
      expiration,
    );
    return expired;
  }

  /**
   * Retrieves the authentication headers with the token.
   * Now PUBLIC so components/services can reuse it (e.g. PrimaryComponent).
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getAccessToken();
    if (!token) {
      console.warn(
        '[AuthService] getAuthHeaders() called but no token found',
      );
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserScreens(): Observable<any> {
    console.log(
      '[AuthService] getUserScreens() called -> GET',
      API_URLS.USER_SCREENS,
    );
    return this.http
      .get<any>(API_URLS.USER_SCREENS, { headers: this.getAuthHeaders() })
      .pipe(
        map((res) => {
          console.log('[AuthService] getUserScreens() response:', res);
          return res;
        }),
        catchError((err) => {
          console.error('[AuthService] Failed to load user screens:', err);
          return throwError(() => err);
        }),
      );
  }

  setUserScreensCache(screens: any[]): void {
    console.log(
      '[AuthService] setUserScreensCache() storing',
      screens?.length,
      'screens',
    );
    this._screenCache = screens;
  }

  getUserScreensCache(): any[] {
    console.debug(
      '[AuthService] getUserScreensCache() ->',
      this._screenCache,
    );
    return this._screenCache;
  }

  getUserDetails(): Observable<any> {
    console.log(
      '[AuthService] getUserDetails() called -> GET',
      API_URLS.USERS_ME,
    );
    return this.http
      .get<any>(API_URLS.USERS_ME, { headers: this.getAuthHeaders() })
      .pipe(
        map((res) => {
          console.log('[AuthService] getUserDetails() response:', res);
          return res;
        }),
        catchError((err) => {
          console.error('[AuthService] Failed to get user details:', err);
          return throwError(() => err);
        }),
      );
  }

  /**
   * Refreshes the access token using the refresh token.
   * Updates the stored access token if successful.
   * @param refreshToken The current refresh token.
   * @returns Observable emitting the new access token string.
   */
  refreshToken(refreshToken: string): Observable<string> {
    console.log('[AuthService] refreshToken() called');
    return this.http
      .post<{ access: string }>(`${API_URLS.LOGIN}refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        map((res) => {
          if (!res.access) {
            console.error(
              '[AuthService] refreshToken() -> no new access token returned',
              res,
            );
            throw new Error('No new access token returned');
          }
          this.tokenStorage.setAccessToken(res.access);
          console.log(
            '[AuthService] refreshToken() success, new access token stored',
          );
          return res.access;
        }),
        catchError((err) => {
          console.error('[AuthService] Refresh token failed:', err);
          return throwError(() => err);
        }),
      );
  }

  /**
   * DEBUG HELPER:
   * Fetches /users/me/ and logs the username + role names.
   */
  debugLogCurrentUserRoles(): void {
    console.log('[AuthService] debugLogCurrentUserRoles() called');
    this.getUserDetails().subscribe({
      next: (user) => {
        const username = user?.username ?? '(unknown)';
        const roles = Array.isArray(user?.roles)
          ? user.roles.map((r: any) => r.name)
          : [];
        console.log('[AuthService] Current user:', username);
        console.log('[AuthService] Current user roles:', roles);
      },
      error: (err) => {
        console.error(
          '[AuthService] debugLogCurrentUserRoles() failed:',
          err,
        );
      },
    });
  }
}
