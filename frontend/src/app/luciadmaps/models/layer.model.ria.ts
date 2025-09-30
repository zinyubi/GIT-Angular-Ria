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

export interface BaseLayerConfigRia {
  wms?: WmsBaseConfigRia;
  elevation?: ElevationConfigRia;
}
