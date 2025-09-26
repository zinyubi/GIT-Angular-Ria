import { Component } from '@angular/core';
import { MapComponent } from '../../../map/map.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-primary',
  imports: [CommonModule, MapComponent],
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.css']
})
export class PrimaryComponent {}
