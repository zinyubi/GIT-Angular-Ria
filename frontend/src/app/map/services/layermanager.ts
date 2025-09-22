import { Injectable } from '@angular/core';
import { WebGLMap } from '@luciad/ria/view/WebGLMap.js';
import { RasterTileSetLayer } from '@luciad/ria/view/tileset/RasterTileSetLayer.js';
import { FusionTileSetModel } from '@luciad/ria/model/tileset/FusionTileSetModel.js';
import { WMSTileSetModel } from '@luciad/ria/model/tileset/WMSTileSetModel.js';
import { getReference } from '@luciad/ria/reference/ReferenceProvider.js';
import { createBounds } from '@luciad/ria/shape/ShapeFactory.js';
import { LayerType } from '@luciad/ria/view/LayerType.js';
import { GridLayer } from '@luciad/ria/view/grid/GridLayer.js';
import { LonLatGrid } from '@luciad/ria/view/grid/LonLatGrid.js';
import { LonLatPointFormat } from '@luciad/ria/shape/format/LonLatPointFormat.js';
import { RasterDataType } from '@luciad/ria/model/tileset/RasterDataType.js';
import { RasterSamplingMode } from '@luciad/ria/model/tileset/RasterSamplingMode.js';

@Injectable({ providedIn: 'root' })
export class BaseLayerService {
  private map?: WebGLMap;

  /**
   * Set up initial layers on the map.
   * @param map - The map instance to add layers to.
   */
  async setupInitialLayers(map: WebGLMap): Promise<void> {
    this.map = map;
    try {
      await this.createBaseLayers();
      console.log('Base layers created successfully');
    } catch (error) {
      console.error('Error creating base layers:', error);
      throw error;
    }
  }

  /**
   * Create and add base layers to the map.
   */
  private async createBaseLayers(): Promise<void> {
    if (!this.map) throw new Error('Map not set in BaseLayerService');

    const wmsLayer = await this.createWMSLayer();
    this.map.layerTree.addChild(wmsLayer);
    // Add other layers as necessary, e.g., elevation or grid layer.
  }

  /**
   * Create the WMS base layer.
   * @returns The WMS layer instance.
   */
  private async createWMSLayer(): Promise<RasterTileSetLayer> {
    const wmsServer = 'https://sampleservices.luciad.com/wms';
    const wmsLayerName = '4ceea49c-3e7c-4e2d-973d-c608fb2fb07e';
    const wmsModel = await WMSTileSetModel.createFromURL(wmsServer, [{ layer: wmsLayerName }]);
    return new RasterTileSetLayer(wmsModel, {
      label: 'Base WMS Layer',
      layerType: LayerType.BASE,
    });
  }

}
