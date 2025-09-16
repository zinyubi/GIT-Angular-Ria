import { RasterTileSetModel } from "../../model/tileset/RasterTileSetModel.js";
import { Handle } from "../../util/Evented.js";
import { Layer } from "../Layer.js";
import { LayerConstructorOptions } from "../LayerTreeNode.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { RasterStyle } from "../style/RasterStyle.js";
/**
 * Constructor options for {@link RasterTileSetLayer}.
 *
 * @since 2024.1
 */
export interface RasterTileSetLayerConstructorOptions extends LayerConstructorOptions {
  /**
   * Modifies the quality/detail of the loaded data. See {@link RasterTileSetLayer.detailFactor} for more info.
   */
  detailFactor?: number;
}
/**
 * A raster layer that displays raster data in a {@link Map}.
 * <p/>
 * It retrieves the map image as a collection of small tiles which are composed together in the browser.
 * <p/>
 * Use this to add {@link RasterTileSetModel raster tileset models} to your map.
 * <p/>
 * Note that you can also use this layer for {@link RasterDataType.ELEVATION elevation tileset models} to your map.
 * However, elevation data will only be visible as terrain geometry on a 3D map.  It will not be colored with a height color map.
 */
declare class RasterTileSetLayer extends Layer {
  /**
   * Creates a RasterTileSetLayer for a given {@link RasterTileSetModel}.
   * This layer can be added to a {@link Map}.
   * @param model  A tileset model. The spatial reference of the model
   * must be compatible with the reference of the map. This means that the
   * conversion between the two coordinate system must be able to be expressed as a linear transformation.
   * @param options defines the layer parameters.
   */
  constructor(model: RasterTileSetModel, options?: RasterTileSetLayerConstructorOptions);
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  get model(): RasterTileSetModel;
  /**
   * The detail factor modifies the quality/detail of the loaded data. It affects the scale point at which
   * a raster level is selected, which also changes the number of raster pixels that are rendered per CSS pixel.
   *
   * These are the possible values:
   * <ul>
   *   <li>detailFactor = 1 (default): the same raster tiles are loaded as on a classic 96 DPI map.
   *   This means 1 raster pixel will be rendered per CSS pixel.</li>
   *   <li>detailFactor > 1: the layer loads more detailed tiles and renders more raster pixels per CSS pixel.
   *   For example: if the detailFactor is 2, one more level is loaded, which causes 4 times as many tiles to be loaded.
   *   </li>
   *   <li>detailFactor < 1: the layer loads less detailed tiles and renders multiple CSS pixels for 1 raster pixel.
   *   </li>
   * </ul>
   *
   * Increasing the detail factor results in sharper images and crisper text, but it might have a negative impact on
   * performance.
   *
   * Setting the detail factor to map.displayScale, results in (device) pixel-perfect rasters.
   *
   * @since 2024.1
   */
  get detailFactor(): number;
  set detailFactor(val: number);
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
  /**
   * Event hook that is called when {@link RasterTileSetLayer.detailFactor} changes.
   *
   * @param event The "DetailFactorChanged" event type
   * @param callback Callback to be invoked when the detail factor changes.
   * @param context value to use as this when executing callback
   * @since 2024.1
   * @event
   */
  on(event: "DetailFactorChanged", callback: (detailFactor: number) => void, context?: any): Handle;
  get supportedPaintRepresentations(): PaintRepresentation[];
  /**
   * The raster style for this layer. This is an object literal. It may contain following properties
   * <ul>
   *   <li>
   *   <code>alpha</code>: a number with an opacity value between 0 and 1. 0 is fully transparent, 1 is fully
   *   opaque. By default, the value is 1.
   *   </li>
   * </ul>
   * <p/>
   * You should assign <code>rasterStyle</code> with a complete literal.  You cannot modify properties of <code>rasterStyle</code> directly.
   *
   */
  get rasterStyle(): RasterStyle;
  set rasterStyle(style: RasterStyle);
}
export { RasterTileSetLayer };