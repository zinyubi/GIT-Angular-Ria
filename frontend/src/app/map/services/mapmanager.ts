import { Injectable } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createPoint, createBounds } from '@luciad/ria/shape/ShapeFactory.js';
import { LayerType } from '@luciad/ria/view/LayerType.js';
import { GridLayer } from '@luciad/ria/view/grid/GridLayer.js';
import { ConfigManager } from './configmanager.service';

@Injectable({ providedIn: 'root' })
export class MapManager {
  private map?: WebGLMap;

  constructor(private configManager: ConfigManager) {}

  /**
   * Initializes the map based on the provided DOM node ID and projection configuration.
   * @param domNodeID The DOM node ID for the map container.
   * @param projectionKey The key for the projection configuration (e.g., 'Web Mercator').
   */
  async initializeMap(domNodeID: string, projectionKey: any): Promise<void> {
    const projectionConfig = projectionKey
    console.log('Using projection config:', projectionConfig);
    
    if (!projectionConfig) {
      throw new Error(`Projection configuration for "${projectionKey}" not found.`);
    }

    this.createMap(getReference(projectionConfig.reference), projectionConfig.use3D, domNodeID);
  }

  private createMap(reference: any, use3D: boolean, domNodeID?: string): void {
    const nodeID = domNodeID || this.map?.domNode?.id || 'luciadMap';
    console.log(`Creating map in DOM node: ${nodeID} with reference: ${reference}`);

    this.map = new WebGLMap(nodeID, {
      reference,
      wrapAroundWorld: false,
      autoAdjustDisplayScale: true,
    });

    if (!use3D) {
      this.setupFor2D();
    } else {
      this.setupFor3D();
    }
  }

  private setupFor2D(): void {
    if (this.map?.camera) {
      const camera = this.map.camera as any;
      if (typeof camera.setLook2D === 'function') {
        camera.setLook2D();
      }
    }
  }

  private setupFor3D(): void {
    if (this.map?.camera) {
      const camera = this.map.camera as any;
      if (typeof camera.setLook3D === 'function') {
        camera.setLook3D();
      }
    }
  }

  setView(center: { x: number; y: number }, zoom: number): void {
    if (!this.map) return;

    const reference = this.map.reference;
    const centerPoint = createPoint(reference, [center.x, center.y]);

    const defaultScale = 1000000 / zoom;

    // Uncomment and adjust if viewFit is available:
    // this.map.viewFit(centerPoint, { animate: true, scale: defaultScale });
  }

  restrictBounds(bounds: { minX: number; minY: number; maxX: number; maxY: number }): void {
    if (!this.map) return;

    const reference = this.map.reference;
    const navBounds = createBounds(reference, [bounds.minX, bounds.minY, bounds.maxX, bounds.maxY]);
    this.map.restrictNavigationToBounds(navBounds);
  }

  setDisplayScale(autoAdjust: boolean, fixedScale?: number): void {
    if (!this.map) return;

    this.map.autoAdjustDisplayScale = autoAdjust;
    if (!autoAdjust && fixedScale !== undefined) {
      this.map.displayScale = fixedScale;
    }
  }

  onMapEvent(event: string, callback: (...args: any[]) => void): void {
    if (!this.map) return;
    this.map.on(event as any, callback, this);
  }

  resize(): void {
    if (!this.map) return;
    this.map.resize();
  }

  destroy(): void {
    if (!this.map) return;
    this.map.destroy();
    this.map = undefined;
  }

  getMap(): WebGLMap | undefined {
    return this.map;
  }
}
