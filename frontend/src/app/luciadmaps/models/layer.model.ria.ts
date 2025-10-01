export interface WmsBaseConfigRia {
  server: string;
  layer: string;          // dataset name on WMS server
  label?: string;
  position?: 'top' | 'bottom';
}

export interface ElevationConfigRia {
  server: string;         // LTS/Fusion server
  coverage: string;       // coverage id/name on LTS server
  label?: string;
}


export interface ArcGisRestConfigRia {
  server: string;                // e.g. https://.../MapServer
  label?: string;
  position?: 'top' | 'bottom';
  minLevel?: number;             // default 0
  maxLevel?: number;             // e.g. 20 (from service page)
  tileSize?: number;             // default 256
}
export interface BaseLayerConfigRia {
  wms?: WmsBaseConfigRia;
  elevation?: ElevationConfigRia;
  arcgis?: ArcGisRestConfigRia;  // ⬅ add this
}