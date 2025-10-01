import { Injectable } from '@angular/core';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';

/**
 * ConfigManager provides access to predefined map projections and configurations.
 */
@Injectable({ providedIn: 'root' })
export class ConfigManager {
  // Default projection: Web Mercator
  readonly WGS84 = getReference('CRS:84');

  readonly PROJECTION_CONFIGS: { [key: string]: { reference: string; label: string } } = {
    'Web Mercator': { reference: 'EPSG:3857', label: 'Web Mercator (EPSG:3857)' },
    'CRS84': { reference: 'CRS:84', label: 'WGS84 Lon/Lat (CRS:84)' },
    'Polar North': { reference: 'EPSG:3995', label: 'Polar Stereographic (EPSG:3995)' },
    '3D Geocentric': { reference: 'EPSG:4978', label: '3D Geocentric (EPSG:4978)' },
    'Equidistant Cylindrical': { reference: 'EPSG:4087', label: 'Equidistant Cylindrical (EPSG:4087)' },
    'Mercator': { reference: 'EPSG:3395', label: 'Mercator (EPSG:3395)' },
    'Polar South': { reference: 'EPSG:3031', label: 'Polar Stereographic (South pole) (EPSG:3031)' },
    'Lambert Conformal': { reference: 'EPSG:2154', label: 'Lambert Conformal (EPSG:2154)' }
  };



  getDefaultKey(): string { return '3D Geocentric'; }
  getDefaultProjection() { return this.PROJECTION_CONFIGS[this.getDefaultKey()]; }
  getProjectionKeys(): string[] { return Object.keys(this.PROJECTION_CONFIGS); }
  getProjectionConfig(key: string) { return this.PROJECTION_CONFIGS[key]; }
}
