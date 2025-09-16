import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapComponent } from './map/map.component';
import { AuthService } from './core/auth/services/auth.service';
import { LayoutComponent } from './layout/layout.component'; // Import your new layout

/**
 * Route guard function to protect routes based on authentication status.
 */
const authGuard = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : ['/login'];
};

/**
 * Updated application routing configuration with layout and guards.
 */
export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'map', component: MapComponent },
    ],
  },

  { path: '**', redirectTo: '/login' }
];
