import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * LoginComponent allows users to authenticate by entering their username and password.
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
  username = '';
  password = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Attempts to log in the user with the provided credentials.
   * On success, navigates to the dashboard.
   * On failure, sets an error message.
   */
  login() {
    this.error = null; // reset previous errors

    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.message || 'Invalid username or password';
      }
    });
  }
}
