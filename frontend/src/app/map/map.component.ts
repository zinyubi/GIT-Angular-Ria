// src/app/map/map.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;
  title = 'Map View';

  ngAfterViewInit(): void {
    if (!this.mapDiv || !this.mapDiv.nativeElement) {
      console.error("Map container not found");
      return;
    }

    const reference = getReference("EPSG:4978"); // You can change to EPSG:3857 for 2D
    new WebGLMap(this.mapDiv.nativeElement, {
      reference
    });
  }
}
