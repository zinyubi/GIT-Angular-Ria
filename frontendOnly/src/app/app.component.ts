import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'frontendOnly';

  // ✅ This binds the div with #mapContainer
  @ViewChild('mapContainer', { static: true }) mapDiv!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // ✅ Ensure the div exists
    if (!this.mapDiv) {
      console.error("Map container not found");
      return;
    }

    const reference = getReference("EPSG:4978"); // Globe reference (use EPSG:3857 for 2D)
    
    // ✅ Use the actual element, not a string ID
    new WebGLMap(this.mapDiv.nativeElement, {
      reference
    });
  }
}
