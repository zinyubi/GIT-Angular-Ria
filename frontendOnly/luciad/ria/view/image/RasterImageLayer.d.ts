import { RasterImageModel } from "../../model/image/RasterImageModel.js";
import { LayerConstructorOptions } from "../LayerTreeNode.js";
import { RasterLayer } from "../RasterLayer.js";
/**
 * A raster layer that displays raster data in a {@link Map}. It request a single image that covers
 * the entire map area.
 * <p/>
 * RasterImageLayer is not supported in a WebGLMap.  {@link RasterTileSetLayer} is supported.
 *
 * @since 2013.1
 */
export declare class RasterImageLayer extends RasterLayer {
  /**
   * Create a new RasterImageLayer instance.
   * @param model An image model.
   * The spatial reference of the model must be compatible with the reference of the map. This means that the
   * conversion between the two coordinate system must be able to be expressed as a linear transformation.
   * @param options the options for the {@link RasterImageLayer}.
   */
  constructor(model: RasterImageModel, options?: LayerConstructorOptions);
  get model(): RasterImageModel;
}