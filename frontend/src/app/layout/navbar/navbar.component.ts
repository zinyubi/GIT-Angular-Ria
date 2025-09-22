import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../theme.service'; // Adjust path accordingly

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() username: string | null = '';
  @Input() timeLeft: string = '';
  @Input() logout!: () => void;

  showUserActions = false;

  constructor(public themeService: ThemeService) {}

  toggleUserActions(event: MouseEvent) {
    event.stopPropagation(); // Prevent click from bubbling up to document
    this.showUserActions = !this.showUserActions;
  }

  get usernameInitial(): string {
  if (!this.username) return 'U';  // fallback to 'U' for User
  return this.username.charAt(0).toUpperCase();
  }

  onThemeToggle() {
    this.themeService.toggleTheme();
  }

  onLogout() {
    this.logout();
    this.showUserActions = false;
  }

  @HostListener('document:click')
  onClickOutside() {
    this.showUserActions = false;
  }
}
