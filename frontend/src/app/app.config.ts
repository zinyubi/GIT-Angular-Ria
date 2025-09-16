import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

/**
 * Application configuration for the Angular app.
 * 
 * Sets up essential providers including:
 * - Router with application routes (`appRoutes`).
 * - HTTP Client for making HTTP requests.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient()
  ]
};
