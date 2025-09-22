import { Injectable } from '@angular/core';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';

/**
 * ConfigManager provides access to predefined map projections and configurations.
 */
@Injectable({ providedIn: 'root' })
export class ConfigManager {
  // Default projection: Web Mercator
  readonly WGS84 = getReference('CRS:84');

  readonly PROJECTION_CONFIGS: { [key: string]: { reference: string; use3D: boolean } } = {
    '3D': { reference: 'EPSG:4978', use3D: true },
    'Equidistant Cylindrical': { reference: 'EPSG:4087', use3D: false },
    'Mercator': { reference: 'EPSG:3395', use3D: false },
    'Web Mercator': { reference: 'EPSG:3857', use3D: false },
    'Lambert Conformal': { reference: 'EPSG:2154', use3D: false }
  };

  /**
   * Gets the default projection configuration (Web Mercator).
   */
  getDefaultProjection() {
    return this.PROJECTION_CONFIGS['3D'];
  }

  /**
   * Gets a specific projection configuration by its key.
   * @param key The key to retrieve the projection config (e.g., '3D', 'Mercator').
   * @returns The projection configuration object.
   */
  getProjectionConfig(key: string) {
    return this.PROJECTION_CONFIGS[key];
  }
}
