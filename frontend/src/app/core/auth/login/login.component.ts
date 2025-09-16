import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * LoginComponent allows users to authenticate by entering their username and password.
 * 
 * Provides a simple login form and handles authentication errors.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** Bound to the username input field */
  username = '';

  /** Bound to the password input field */
  password = '';

  /** Holds error messages for failed login attempts */
  error: string | null = null;

  /**
   * @param authService - Service responsible for authentication logic.
   * @param router - Router to navigate after successful login.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Attempts to log in the user with the provided credentials.
   * 
   * On success, navigates to the dashboard.
   * On failure, sets an error message.
   */
  async login() {
    try {
      await this.authService.login(this.username, this.password);
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.error = 'Invalid username or password';
    }
  }
}
