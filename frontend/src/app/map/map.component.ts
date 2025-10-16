import {
  Component,
  AfterViewInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapManager } from './services/mapmanager';
import { ConfigManager } from './services/configmanager.service';
import { BaseLayerService } from './services/layermanager';
import { ProjectionChanger } from './../map/services/projectionchanger';

@Component({
  selector: 'app-map',
  imports: [CommonModule, ProjectionChanger],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('luciadMap', { static: true }) mapContainerRef!: ElementRef<HTMLElement>;
  @Output() pointPicked = new EventEmitter<{ lon: number; lat: number }>();

  // UI state (bound from manager callbacks)
  picking = false;
  cursorText = 'lon: — , lat: —';
  scaleText  = '---';
  scaleBarPx = 160;

  constructor(
    private mapManager: MapManager,
    private configManager: ConfigManager,
    private baseLayerService: BaseLayerService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    const el = this.mapContainerRef.nativeElement;
    if (!el.id) el.id = 'luciadMap';

    await this.mapManager.initializeMap(el.id, this.configManager.getDefaultProjection());
    this.mapManager.setDisplayScale(true);
    this.mapManager.resize();

    // Mouse cursor (lon/lat)
    this.mapManager.startMouseTracking(el, (lon, lat) => {
      if (lon != null && lat != null) {
        this.cursorText = `lon: ${lon.toFixed(6)} , lat: ${lat.toFixed(6)}`;
      } else {
        this.cursorText = 'lon: — , lat: —';
      }
    });

    const map = this.mapManager.getMap();
    if (!map) {
        throw new Error('Map not initialized properly.');
      }

    this.baseLayerService.setupInitialLayers(map);
    // Scale bar (computed in manager via rAF)
    this.mapManager.startScaleUpdates(200, (label, widthPx) => {
      this.scaleText  = label;
      this.scaleBarPx = widthPx;
    });
  }



  // Point picking (one-shot)
  startPointPicking(): void {
    if (this.picking) return;
    this.picking = true;

    const el = this.mapContainerRef.nativeElement;
    this.mapManager.startPointPicking(el, (lon, lat) => {
      this.pointPicked.emit({ lon: +lon.toFixed(6), lat: +lat.toFixed(6) });
      this.stopPointPicking();
    });
  }
  stopPointPicking(): void {
    if (!this.picking) return;
    this.picking = false;
    this.mapManager.stopPointPicking(this.mapContainerRef.nativeElement);
  }


  
  // Pan controls
  panUp()    { this.mapManager.panByRatio( 0, -0.3); }
  panDown()  { this.mapManager.panByRatio( 0,  0.3); }
  panLeft()  { this.mapManager.panByRatio(-0.3, 0 ); }
  panRight() { this.mapManager.panByRatio( 0.3, 0 ); }

  // Fit to bounds
  fitToData(): void { this.mapManager.fitAll(); }

  @HostListener('window:resize')
  onResize(): void {
    this.mapManager.resize();
    // scale loop runs via rAF—no extra call needed here
  }

  ngOnDestroy(): void {
    this.stopPointPicking();
    this.mapManager.stopMouseTracking(this.mapContainerRef.nativeElement);
    this.mapManager.stopScaleUpdates();
    this.mapManager.destroy();
  }
}
