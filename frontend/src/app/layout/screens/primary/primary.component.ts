import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponentRia } from './../../../luciadmaps/components/map/map.component.ria';

@Component({
  standalone: true,
  selector: 'app-primary',
  imports: [CommonModule, MapComponentRia],
  templateUrl: './primary.component.html',
  styleUrls: ['./primary.component.css']
})
export class PrimaryComponent {}
