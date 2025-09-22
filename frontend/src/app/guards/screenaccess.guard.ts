import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const screenAccessGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  let screens = auth.getUserScreensCache();

  if (!screens || screens.length === 0) {
    try {
      // Convert observable to promise and fetch screens
      const data = await firstValueFrom(auth.getUserScreens());
      screens = data.screens || [];
      auth.setUserScreensCache(screens);
    } catch (e) {
      console.error('Guard: failed to fetch screens', e);
      router.navigate(['/login']);
      return false;
    }
  }

  // Use full URL path (without starting '/')
  const fullPath = state.url.toLowerCase().replace(/^\//, '');
  console.log('Guard checking full path:', fullPath);

  // Check access by matching screen paths or screen names
  const hasAccess = screens.some((s: any) => {
    const screenPath = (s.path || '').toLowerCase();
    const screenName = (s.name || '').toLowerCase().replace(/\s+/g, '');

    return fullPath === screenPath || fullPath === screenName;
  });

  if (!hasAccess) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
