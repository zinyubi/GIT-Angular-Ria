import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import child standalone components
import { RoleScreenMappingComponent } from '../rolescreenmapping/rolescreenmapping.component';
import { RoleManagementComponent } from '../rolemanagement/rolemanagement.component';
import { UserManagementComponent } from '../usermanagement/usermanagement.component';

@Component({
  selector: 'app-rbac-container',
  templateUrl: './rbaccontainer.component.html',
  styleUrls: ['./rbaccontainer.component.css'],
  standalone: true,  // Marks the component as standalone
  imports: [
    CommonModule,
    FormsModule,
    RoleScreenMappingComponent,
    RoleManagementComponent,
    UserManagementComponent
  ]
})
export class RbacContainerComponent {
  currentView: 'rolescreen' | 'roles' | 'users' = 'users';  // Default is 'users'

  setView(view: 'rolescreen' | 'roles' | 'users'): void {
    this.currentView = view;
  }
}
