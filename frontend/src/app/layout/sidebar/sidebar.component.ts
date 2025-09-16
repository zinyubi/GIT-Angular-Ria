import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <nav>
        <ul class="sidebar-list">
          <li *ngFor="let screen of userScreens" class="sidebar-item">
            {{ screen.name }}
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background-color: #111827; /* dark slate */
      color: #d1d5db; /* light gray */
      height: 100vh;
      padding: 1rem 0;
      box-shadow: 2px 0 6px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow-y: auto;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
    }
    .sidebar-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .sidebar-item {
      padding: 12px 20px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.3s ease, color 0.3s ease;
    }
    .sidebar-item:hover {
      background-color: #374151; /* darker slate */
      color: #f3f4f6; /* lighter text */
    }
    /* Responsive: collapse sidebar on small screens */
    @media (max-width: 768px) {
      .sidebar {
        width: 200px;
        height: auto;
        position: relative;
        box-shadow: none;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() userScreens: any[] = [];
}
