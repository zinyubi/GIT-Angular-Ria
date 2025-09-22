import {
  Component,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { MapManager } from './services/mapmanager';
import { ConfigManager } from './services/configmanager.service';
import { BaseLayerService } from "./services/layermanager";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('luciadMap', { static: true }) mapContainerRef!: ElementRef;
  domNodeID = 'luciadMap';

  // The projection key that will be used to initialize the map

  constructor(
    private mapManager: MapManager,
    private configManager: ConfigManager,
    private baseLayerService: BaseLayerService
  ) {}

  /**
   * Initializes the map and sets up initial layers once the view is initialized.
   */
  async ngAfterViewInit(): Promise<void> {
    try {
      // Initialize the map using the reference from ConfigManager
      await this.mapManager.initializeMap(this.domNodeID, this.configManager.getDefaultProjection());

      const map = this.mapManager.getMap();
      if (!map) {
        throw new Error('Map not initialized properly.');
      }

      // Set up the base layers after map initialization
      await this.baseLayerService.setupInitialLayers(map);
      console.log('All layers setup successfully');
    } catch (error) {
      console.warn('Layer setup failed or map initialization error:', error);
    }

    // Set the display scale and resize the map
    this.mapManager.setDisplayScale(true);
    this.mapManager.resize();
  }

  /**
   * Listens to window resize event and triggers map resize.
   */
  @HostListener('window:resize')
  onResize(): void {
    this.mapManager.resize();
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.mapManager.destroy();
  }
}
