import { Injectable } from '@angular/core';
import { BaseLayerConfigRia } from './models/layer.model.ria';

@Injectable({ providedIn: 'root' })
export class RiaMapConfigService {
  readonly PROJECTION_CONFIGS: Record<string, { reference: string, label: string }> = {
    '3D Geocentric': { reference: 'EPSG:4978', label: '3D Geocentric (EPSG:4978)' },
    'Web Mercator': { reference: 'EPSG:3857', label: 'Web Mercator (EPSG:3857)' },
    'CRS84': { reference: 'CRS:84', label: 'WGS84 Lon/Lat (CRS:84)' },
    'Polar North': { reference: 'EPSG:3995', label: 'Polar Stereographic (EPSG:3995)' },
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


// 🔧 Change ONLY these values for your servers/datasets
export const DEFAULT_BASELAYER_CONFIG_RIA: BaseLayerConfigRia = {
  wms: {
    server: 'https://sampleservices.luciad.com/wms',
    layer: '4ceea49c-3e7c-4e2d-973d-c608fb2fb07e', // dataset name on WMS server
    label: 'Luciad WMS Imagery',
    position: 'bottom' // 'top' | 'bottom'
  },
  elevation: {
    server: 'https://sampleservices.luciad.com/lts', // Luciad Tile Set (LTS) / Fusion server
    coverage: 'e8f28a35-0e8c-4210-b2e8-e5d4333824ec',
    label: 'Elevation'
  }
};