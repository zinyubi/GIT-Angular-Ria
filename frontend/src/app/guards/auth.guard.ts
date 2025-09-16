// src/app/core/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../core/auth/services/token-storage.service';

/**
 * Route guard that protects routes from unauthorized access.
 * 
 * Checks for the presence of a valid access token before allowing route activation.
 * Redirects to the login page if the user is not authenticated.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   * @param tokenService - Service to access stored authentication tokens.
   * @param router - Router to navigate for unauthorized users.
   */
  constructor(private tokenService: TokenStorageService, private router: Router) {}

  /**
   * Determines whether a route can be activated.
   * 
   * @returns `true` if an access token is present (user is authenticated), otherwise redirects and returns `false`.
   */
  canActivate(): boolean {
    const token = this.tokenService.getAccessToken();

    // Optionally, you can check token validity or expiration here

    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

