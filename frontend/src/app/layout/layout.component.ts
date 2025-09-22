import { Component, OnDestroy, OnInit, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { NavbarComponent } from './navbar/navbar.component';
import { ScreenSelectorComponent } from './screenselector/screenselector.component';
import { AuthService } from '../core/auth/services/auth.service';
import { RbacContainerComponent } from './screens/rbac/rbaccontainer/rbaccontainer.component';


interface Screen {
  name: string;
  path: string;
  isAuthorized: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    ScreenSelectorComponent,
    RouterModule,
    RbacContainerComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  username: string | null = null;
  timeLeft = '';
  userScreens: Screen[] = [];

  private intervalId?: number;

  constructor(
    private auth: AuthService,
    public router: Router,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername() || 'Guest';
    this.startCountdown();
    this.loadUserScreens();
  }

  private startCountdown(): void {
    const expiration = this.auth.getTokenExpiration();
    if (!expiration) {
      this.timeLeft = 'Unknown';
      return;
    }

    this.intervalId = window.setInterval(() => {
      const now = Date.now();
      const remainingMs = expiration.getTime() - now;

      if (remainingMs <= 0) {
        this.timeLeft = 'Session expired';
        this.logout();
      } else {
        this.timeLeft = this.formatTime(remainingMs);
      }
    }, 1000);
  }

  private formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async loadUserScreens(): Promise<void> {
    try {
      const screensResponse = await firstValueFrom(this.auth.getUserScreens());
      const screens = screensResponse.screens || [];

      this.auth.setUserScreensCache(screens);

      this.userScreens = screens.map((screen: any) => {
        const path = this.mapScreenNameToPath(screen.name || '');
        return {
          name: screen.name,
          path,
          isAuthorized: true,
        };
      });

      const firstAuthorized = this.userScreens.find((s) => s.isAuthorized);

      if (!firstAuthorized) {
        this.router.navigate(['/unauthorized']);
        return;
      }

      if (
        this.router.url === '/' ||
        this.router.url === '/login' ||
        this.router.url === '/unauthorized'
      ) {
        this.appRef.isStable.pipe(first()).subscribe(() => {
          this.router.navigate([firstAuthorized.path]);
        });
      }
    } catch (error) {
      this.userScreens = [];
      this.router.navigate(['/unauthorized']);
    }
  }

  mapScreenNameToPath(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '');
  }

  logout(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
    this.auth.logout();
  }

  ngOnDestroy(): void {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }
}
