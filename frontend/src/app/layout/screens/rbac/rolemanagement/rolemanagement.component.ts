import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_URLS } from '../../../../config/api.config';
import { AuthService } from '../../../../core/auth/services/auth.service';  // Import AuthService

interface Role {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rolemanagement.component.html',
  styleUrls: ['./rolemanagement.component.css']
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  newRole: Partial<Role> = { name: '', description: '' };

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles() {
    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Role[]>(API_URLS.ROLES, { headers }).subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
        alert('Failed to load roles');
      },
    });
  }

  createRole() {
    if (!this.newRole.name) {
      alert('Role name is required');
      return;
    }

    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<Role>(API_URLS.ROLES, this.newRole, { headers }).subscribe({
      next: (role) => {
        this.roles.push(role);
        this.newRole = { name: '', description: '' };
      },
      error: (err) => {
        console.error('Error creating role:', err);
        alert('Failed to create role');
      },
    });
  }

  deleteRole(roleId: number) {
    if (!confirm('Delete this role?')) return;

    const token = this.authService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${API_URLS.ROLES}${roleId}/`, { headers }).subscribe({
      next: () => {
        this.roles = this.roles.filter((r) => r.id !== roleId);
      },
      error: (err) => {
        console.error('Error deleting role:', err);
        alert('Failed to delete role');
      },
    });
  }
}
