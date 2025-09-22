import { Component } from '@angular/core';
import { MapComponent } from '../../../map/map.component';
import { CommonModule } from '@angular/common';



@Component({
  standalone: true,
  selector: 'app-primary',
  imports: [CommonModule, MapComponent],
  template: `
    <div class="primary">
      <h2>Primary Screen</h2>
      <p>This is Primary screen</p>
    </div>
    <div class="map-container">
      <app-map
      ></app-map>

    </div>

  `,
  styles: [`
    .primary {
      text-align: center;
      padding: 2rem;
      color: var(--color-error);
    }
    .map-container {
      height: 100%;
      width: 100%;
      display: block;
    }
  `]
})
export class PrimaryComponent {}
