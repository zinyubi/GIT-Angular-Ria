import { Injectable } from '@angular/core';
import axios from 'axios';
import { API_URLS } from '../../../config/api.config';
import { TokenStorageService } from './token-storage.service';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  /** Expiration time as seconds since Unix epoch */
  exp: number;
  // Add other JWT fields if needed
}

/**
 * Service responsible for authentication and user session management.
 * 
 * Handles login, logout, token storage, token refresh, and user info retrieval.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  /**
   * Attempts to authenticate the user with the given credentials.
   * 
   * On success, stores access and refresh tokens as well as the username.
   * Throws an error if login fails or tokens are missing.
   * 
   * @param username - User's username
   * @param password - User's password
   */
  async login(username: string, password: string): Promise<void> {
    try {
      const res = await axios.post(API_URLS.LOGIN, { username, password });
      const { access, refresh } = res.data;

      if (!access || !refresh) throw new Error('Missing tokens');

      this.tokenStorage.setTokens(access, refresh);
      this.tokenStorage.setUsername(username);
    } catch {
      throw new Error('Login failed');
    }
  }

  /**
   * Logs out the user by clearing tokens and redirecting to the login page.
   */
  logout(): void {
    this.tokenStorage.clearTokens();
    this.router.navigate(['/login']);
  }

  /**
   * Checks if the user is currently logged in by verifying the presence of an access token.
   * 
   * @returns `true` if access token exists, otherwise `false`.
   */
  isLoggedIn(): boolean {
    return !!this.tokenStorage.getAccessToken();
  }

  /**
   * Retrieves the username of the currently logged-in user.
   * 
   * @returns Username string or `null` if not set.
   */
  getUsername(): string | null {
    return this.tokenStorage.getUsername();
  }

  /**
   * Gets the expiration date of the stored access token.
   * 
   * @returns Expiration date or `null` if no valid token is present.
   */
  getTokenExpiration(): Date | null {
    const token = this.tokenStorage.getAccessToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  /**
   * Fetches the user's screens from the backend.
   * 
   * Requires a valid access token.
   * 
   * @throws Error if access token is missing or the request fails.
   * @returns Promise resolving to user screens data.
   */
  async getUserScreens(): Promise<any> {
    try {
      const accessToken = this.tokenStorage.getAccessToken();
      if (!accessToken) throw new Error('No access token');

      const res = await axios.get(API_URLS.USER_SCREENS, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return res.data; // expected to be an array or object representing screens
    } catch (error) {
      console.error('Failed to load user screens:', error);
      throw error;
    }
  }

  /**
   * Fetches detailed user information from the backend.
   * 
   * Requires a valid access token.
   * 
   * @throws Error if access token is missing or the request fails.
   * @returns Promise resolving to user details object.
   */
  async getUserDetails(): Promise<any> {
    const accessToken = this.tokenStorage.getAccessToken();
    if (!accessToken) throw new Error('No access token');

    const res = await axios.get(API_URLS.USERS_ME, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return res.data;
  }

  /**
   * Refreshes the access token using the provided refresh token.
   * 
   * Returns an Observable that emits the new access token.
   * 
   * @param refreshToken - The refresh token string.
   * @returns Observable emitting the new access token.
   */
  refreshToken(refreshToken: string): Observable<string> {
    return from(
      axios
        .post(API_URLS.LOGIN + 'refresh/', { refresh: refreshToken })
        .then((res) => {
          const newAccess = res.data.access;
          if (!newAccess) throw new Error('No new access token returned');
          this.tokenStorage.setAccessToken(newAccess);
          return newAccess;
        })
    );
  }
}
