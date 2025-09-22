import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_URLS } from '../../../../config/api.config';
import { AuthService } from '../../../../core/auth/services/auth.service';  // Import AuthService

interface User {
  id: number;
  username: string;
  email: string;
  roles: number[];
  password?: string;
}

interface Role {
  id: number;
  name: string;
}

@Component({
  selector: 'app-usermanagement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  isLoading = true;
  errorMessage = '';
  activeTab: 'list' | 'create' = 'list';

  pageSize = 5;
  currentPage = 1;

  loggedInUserId = 1;

  newUser: Partial<User> = {
    username: '',
    email: '',
    roles: [],
    password: '',
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchRoles();
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  fetchUsers() {
    this.isLoading = true;
    const token = this.authService.getAccessToken();
    console.log('Fetching users with token:', token); // Log token

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User[]>(API_URLS.USERS, { headers }).subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = `Failed to load users: ${err.message || err.statusText}`;
        this.isLoading = false;
      },
    });
  }

  fetchRoles() {
    const token = this.authService.getAccessToken();
    console.log('Fetching roles with token:', token); // Log token

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Role[]>(API_URLS.ROLES, { headers }).subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
        this.roles = [];
      },
    });
  }

  toggleRole(user: Partial<User>, roleId: number) {
    user.roles = user.roles || [];
    if (user.roles.includes(roleId)) {
      user.roles = user.roles.filter((id) => id !== roleId);
    } else {
      user.roles = [...user.roles, roleId];
    }
  }

  updateUserRoles(user: User) {
    const url = `${API_URLS.USERS}${user.id}/`;
    const token = this.authService.getAccessToken();
    console.log('Updating user roles with token:', token); // Log token

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch(url, { roles: user.roles }, { headers }).subscribe({
      next: () => {
        alert(`Roles updated for ${user.username}`);
      },
      error: () => {
        alert('Failed to update roles');
      },
    });
  }

  deleteUser(userId: number) {
    if (userId === this.loggedInUserId) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;

    const url = `${API_URLS.USERS}${userId}/`;
    const token = this.authService.getAccessToken();
    console.log('Deleting user with token:', token); // Log token

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(url, { headers }).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== userId);
        alert('User deleted successfully');
      },
      error: () => {
        alert('Failed to delete user');
      },
    });
  }

  createUser() {
    if (!this.newUser.username || !this.newUser.password) {
      alert('Username and password are required');
      return;
    }

    const payload = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      roles: this.newUser.roles || [],
    };

    const token = this.authService.getAccessToken();
    console.log('Creating user with token:', token); // Log token

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<User>(API_URLS.USERS, payload, { headers }).subscribe({
      next: (user) => {
        this.users.push(user);
        this.newUser = { username: '', email: '', roles: [], password: '' };
        this.activeTab = 'list';
        alert('User created successfully');
      },
      error: () => {
        alert('Failed to create user');
      },
    });
  }
}
