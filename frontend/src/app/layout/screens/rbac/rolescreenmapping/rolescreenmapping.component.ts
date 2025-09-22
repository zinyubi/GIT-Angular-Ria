import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_URLS } from '../../../../config/api.config';
import { AuthService } from '../../../../core/auth/services/auth.service';

interface Role {
  id: number;
  name: string;
}

interface Screen {
  id: number;
  name: string;
}

@Component({
  selector: 'app-role-screen-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rolescreenmapping.component.html',
  styleUrls: ['./rolescreenmapping.component.css']
})
export class RoleScreenMappingComponent implements OnInit {
  roles: Role[] = [];
  screens: Screen[] = [];
  mappings: { [roleId: number]: number[] } = {};
  isLoading = true;
  selectedRoleId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadRoles();
    this.loadScreens();
    this.loadMappings();
  }

  private getHeaders() {
    const token = this.authService.getAccessToken();
    console.log('Getting headers with token:', token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadRoles() {
    this.isLoading = true;
    const headers = this.getHeaders();
    console.log('Loading roles...');
    this.http.get<Role[]>(API_URLS.ROLES, { headers }).subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoading = false;
        console.log('Roles loaded:', this.roles);
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        alert('Failed to load roles');
        this.isLoading = false;
      }
    });
  }
  

  loadScreens() {
    this.isLoading = true;
    const headers = this.getHeaders();
    console.log('Loading screens...');
    this.http.get<Screen[]>(API_URLS.SCREENS, { headers }).subscribe({
      next: (screens) => {
        this.screens = screens;
        this.isLoading = false;
        console.log('Screens loaded:', this.screens);
      },
      error: (err) => {
        console.error('Error loading screens:', err);
        alert('Failed to load screens');
        this.isLoading = false;
      }
    });
  }

  loadMappings() {
    this.isLoading = true;
    const headers = this.getHeaders();
    console.log('Loading role-screen mappings...');
    this.http.get<{ roleId: number; screenIds: number[] }[]>(API_URLS.ROLES_SCREENS, { headers }).subscribe({
      next: (data) => {
        this.mappings = {};
        data.forEach((m) => {
          this.mappings[m.roleId] = m.screenIds;
        });
        this.isLoading = false;
        console.log('Mappings loaded:', this.mappings);
      },
      error: (err) => {
        console.error('Error loading mappings:', err);
        alert('Failed to load mappings');
        this.isLoading = false;
      }
    });
  }

  selectRole(roleId: number) {
    this.selectedRoleId = roleId;
    console.log('Role selected:', roleId);
  }

  isScreenSelectedForRole(roleId: number, screenId: number): boolean {
    const selected = this.mappings[roleId]?.includes(screenId) || false;
    console.log(`Check if screen ${screenId} selected for role ${roleId}: ${selected}`);
    return selected;
  }

  toggleAccess(roleId: number, screenId: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    console.log(`Toggling screen ${screenId} for role ${roleId} to ${checked}`);

    if (!this.mappings[roleId]) {
      this.mappings[roleId] = [];
      console.log(`Created new mapping array for role ${roleId}`);
    }

    if (checked) {
      if (!this.mappings[roleId].includes(screenId)) {
        this.mappings[roleId].push(screenId);
        console.log(`Added screen ${screenId} to role ${roleId}`);
      }
    } else {
      this.mappings[roleId] = this.mappings[roleId].filter(id => id !== screenId);
      console.log(`Removed screen ${screenId} from role ${roleId}`);
    }

    console.log('Current mappings:', this.mappings);
  }

  saveMappings() {
    const headers = this.getHeaders();
    console.log('Saving mappings:', this.mappings);
    this.http.post(API_URLS.ROLES_SCREENS, this.mappings, { headers }).subscribe({
      next: () => {
        alert('Mappings saved successfully');
        console.log('Mappings saved successfully');
      },
      error: (err) => {
        console.error('Error saving mappings:', err);
        alert('Failed to save mappings');
      }
    });
  }
}
