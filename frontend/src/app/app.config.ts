import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/interceptors/auth.interceptor'; // Ensure correct path
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * Application configuration for the Angular app.
 * 
 * Sets up essential providers including:
 * - Router with application routes (`appRoutes`).
 * - HTTP Client with the authInterceptor added.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
};
