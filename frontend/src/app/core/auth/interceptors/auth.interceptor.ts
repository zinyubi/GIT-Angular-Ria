import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthService } from '../services/auth.service';
import { API_URLS } from '../../../config/api.config';

/**
 * HTTP interceptor that adds the Authorization header with the access token to outgoing requests.
 * 
 * It also handles 401 Unauthorized errors by attempting to refresh the access token using the refresh token.
 * If token refresh fails, it clears stored tokens and forwards the error.
 * 
 * @param req - The outgoing HTTP request.
 * @param next - The next interceptor or backend handler.
 * @returns An observable of the HTTP event stream.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const tokenService = inject(TokenStorageService);
  const authService = inject(AuthService);

  // Retrieve access token from storage
  const accessToken = tokenService.getAccessToken();

  // Clone the request and add Authorization header if access token exists
  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      const isRefreshCall = req.url.includes(`${API_URLS.LOGIN}refresh/`);

      // If 401 error and the request is NOT a token refresh call, try to refresh token
      if (error.status === 401 && !isRefreshCall) {
        const refreshToken = tokenService.getRefreshToken();

        if (refreshToken) {
          // Attempt to refresh the access token
          return authService.refreshToken(refreshToken).pipe(
            switchMap(newAccessToken => {
              // Retry original request with new access token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
              });
              return next(retryReq);
            }),
            catchError(() => {
              // If refresh fails, clear tokens and propagate error
              tokenService.clearTokens();
              return throwError(() => error);
            })
          );
        }
      }

      // For other errors or if refresh token is not available, propagate error
      return throwError(() => error);
    })
  );
};
