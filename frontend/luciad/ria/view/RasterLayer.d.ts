import { PaintRepresentation } from "./PaintRepresentation.js";
import { Layer } from "./Layer.js";
import { LayerConstructorOptions } from "./LayerTreeNode.js";
import { RasterImageModel } from "../model/image/RasterImageModel.js";
import { RasterStyle } from "./style/RasterStyle.js";
/**
 * Base class for raster layers.
 */
export declare abstract class RasterLayer extends Layer {
  /**
   * Constructor for a raster layer.
   * @param model the model for the layer.
   * @param options the layer options.
   */
  protected constructor(model: RasterImageModel, options?: LayerConstructorOptions);
  get model(): RasterImageModel;
  get supportedPaintRepresentations(): PaintRepresentation[];
  /**
   * The raster style for this layer.
   */
  get rasterStyle(): RasterStyle;
  set rasterStyle(style: RasterStyle);
}