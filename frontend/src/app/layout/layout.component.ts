import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  username: string | null = null;
  timeLeft = '';
  userScreens: any[] = [];

  private intervalId?: number;

  constructor(private auth: AuthService) {}

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
      const screensResponse = await this.auth.getUserScreens();
      this.userScreens = screensResponse.screens || [];
    } catch (error) {
      console.error('Failed to load user screens:', error);
      this.userScreens = [];
    }
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
