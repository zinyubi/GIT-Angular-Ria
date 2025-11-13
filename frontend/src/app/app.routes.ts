import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { LoginComponent } from './core/auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './core/auth/services/auth.service';
import { LayoutComponent } from './layout/layout.component'; 
import { InventoryManagerComponent } from './layout/screens/inventorymanager/inventorymanager.component';
import { PrimaryComponent } from './layout/screens/primary/primary.component';
import { SecondaryComponent } from './layout/screens/secondary/secondary.component';
import { NotAuthorizedComponent } from './layout/screens/notauthorized/notauthorized.component';
import { screenAccessGuard } from './guards/screenaccess.guard';
import { PlannerComponent } from './layout/screens/planner/planner.component';
import { RbacContainerComponent } from './layout/screens/rbac/rbaccontainer/rbaccontainer.component';

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
      { path: 'dashboard', component: DashboardComponent, canActivate: [screenAccessGuard] },
      { path: 'inventorymanager', component: InventoryManagerComponent, canActivate: [screenAccessGuard] },
      { path: 'primary', component: PrimaryComponent, canActivate: [screenAccessGuard] },
      { path: 'secondary', component: SecondaryComponent, canActivate: [screenAccessGuard] },
      { path: 'planner', component: PlannerComponent, canActivate: [screenAccessGuard] },
      {path: 'usermanagement',component: RbacContainerComponent , canActivate: [screenAccessGuard]},
      { path: 'unauthorized', component: NotAuthorizedComponent },
      { path: '**', component: NotAuthorizedComponent }, // fallback inside layout
    ],
  },

  { path: '**', redirectTo: '/login' }
];
