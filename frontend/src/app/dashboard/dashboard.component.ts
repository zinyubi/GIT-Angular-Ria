import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}
