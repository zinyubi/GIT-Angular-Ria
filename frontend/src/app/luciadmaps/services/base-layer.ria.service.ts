import { Injectable } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { WMSTileSetModel } from '@luciad/ria/model/tileset/WMSTileSetModel.js';
import { FusionTileSetModel } from '@luciad/ria/model/tileset/FusionTileSetModel.js';
import { RasterTileSetLayer } from '@luciad/ria/view/tileset/RasterTileSetLayer.js';
import { BaseLayerConfigRia } from '../models/layer.model.ria';

@Injectable({ providedIn: 'root' })
export class BaseLayerServiceRia {

  async addWmsLayerRia(
    map: WebGLMap,
    server: string,
    layerName: string,
    label?: string,
    position: 'top' | 'bottom' = 'bottom'
  ): Promise<RasterTileSetLayer> {
    const model = await WMSTileSetModel.createFromURL(server, [{ layer: layerName }]);
    const layer = new RasterTileSetLayer(model, { label: label ?? layerName });
    map.layerTree.addChild(layer, position);
    return layer;
  }

  async addFusionElevationRia(
    map: WebGLMap,
    server: string,
    coverage: string,
    label = 'Elevation'
  ): Promise<RasterTileSetLayer> {
    const model = await FusionTileSetModel.createFromURL(server, coverage);
    const layer = new RasterTileSetLayer(model, { label });
    map.layerTree.addChild(layer);
    return layer;
  }

  /**
   * Adds base WMS and optional elevation based on a simple config object.
   */
  async addBaseLayersFromConfigRia(map: WebGLMap, cfg: BaseLayerConfigRia): Promise<void> {
    if (cfg.wms) {
      await this.addWmsLayerRia(
        map,
        cfg.wms.server,
        cfg.wms.layer,
        cfg.wms.label,
        cfg.wms.position ?? 'bottom'
      );
    }
    if (cfg.elevation) {
      await this.addFusionElevationRia(
        map,
        cfg.elevation.server,
        cfg.elevation.coverage,
        cfg.elevation.label ?? 'Elevation'
      );
    }
  }
}
