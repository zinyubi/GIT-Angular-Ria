import { Injectable } from '@angular/core';

/**
 * Service for managing authentication tokens and username in browser localStorage.
 * 
 * Handles saving, retrieving, and clearing of access tokens, refresh tokens, and username.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private ACCESS_TOKEN_KEY = 'access_token';
  private REFRESH_TOKEN_KEY = 'refresh_token';
  private USERNAME_KEY = 'username';

  /**
   * Stores both access and refresh tokens in localStorage.
   * 
   * @param access - Access token string.
   * @param refresh - Refresh token string.
   */
  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  /**
   * Stores the access token in localStorage.
   * 
   * @param access - Access token string.
   */
  setAccessToken(access: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
  }

  /**
   * Retrieves the stored access token from localStorage.
   * 
   * @returns The access token string or null if not found.
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Retrieves the stored refresh token from localStorage.
   * 
   * @returns The refresh token string or null if not found.
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Clears the access token, refresh token, and username from localStorage.
   */
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
  }

  /**
   * Stores the username in localStorage.
   * 
   * @param username - Username string.
   */
  setUsername(username: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
  }

  /**
   * Retrieves the stored username from localStorage.
   * 
   * @returns The username string or null if not found.
   */
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }
}
