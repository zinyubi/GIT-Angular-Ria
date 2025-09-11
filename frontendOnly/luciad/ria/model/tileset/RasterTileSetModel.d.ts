import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { CoordinateType } from "../../reference/CoordinateType.js";
import { Bounded } from "../../shape/Bounded.js";
import { Bounds } from "../../shape/Bounds.js";
import { Handle } from "../../util/Evented.js";
import { Invalidation } from "../../util/Invalidation.js";
import { Model } from "../Model.js";
import { ModelDescriptor } from "../ModelDescriptor.js";
import { RasterDataType } from "./RasterDataType.js";
import { RasterSamplingMode } from "./RasterSamplingMode.js";
import { TileCoordinate } from "./TileCoordinate.js";
import { TileData } from "./TileData.js";
import { RasterConfiguration } from "../RasterConfiguration.js";
/**
 * Describes the raster tile set structure.
 *
 * @since 2023.0
 */
export interface RasterTileSetStructure {
  /**
   * <p>The spatial reference for this tileset.</p>
   *
   * <p>
   *   When visualizing the model on a WebGL map, any reference is allowed.
   *   LuciadRIA will warp your source raster data to the map's reference.
   * </p>
   *
   * <p>
   *   When visualizing the model on a non-WebGL maps, this reference must be the same as the {@link Map.reference} because LuciadRIA cannot warp tiles to another projection.
   * </p>
   * <p>
   *   However, if the map is visualized by means of an equidistant cylindrical projection, you can still use geodetic  references or different equidistant cylindrical grid references.
   *   In such cases, the required warping is limited to the scaling of tiles, which is something a web browser can do efficiently.
   * </p>
   */
  reference: CoordinateReference;
  /**
   * The spatial extent for this tile set.
   * These {@link Bounds.reference} must be the same as {@link reference}.
   */
  bounds: Bounds;
}
/**
 * A power-of-two raster tile set structure, with a fixed tile size for every level.
 *
 * @since 2023.0
 */
export interface QuadTreeRasterTileSetStructure extends RasterTileSetStructure {
  /**
   * The number of levels contained in this tileset. The default value is 22.
   */
  levelCount?: number;
  /**
   * The number of tile columns at the coarsest level. The default value is 1.
   */
  level0Columns?: number;
  /**
   * The number of tile rows at the coarsest level, the default value is 1.
   */
  level0Rows?: number;
  /**
   * <p>The width of each individual tile in pixels, 256 will be used if it's not defined.</p>
   *
   * <p> The <code>tileWidth</code> and <code>tileHeight</code> must be the same value.</p>
   *
   */
  tileWidth?: number;
  /**
   * <p>The height of each individual tile in pixels, 256 will be used if it's not defined.</p>
   *
   * <p> The <code>tileWidth</code> and <code>tileHeight</code> must be the same value.</p>
   */
  tileHeight?: number;
}
/**
 * Represents a tile matrix.
 *
 * It specifies
 * <ul>
 *   <li>how many tiles are defined within the matrix</li>
 *   <li>how many pixels each tiles has</li>
 * </ul>
 *
 * @since 2023.0
 */
export interface TileMatrix {
  /**
   * The spatial extent for this tile matrix.
   * Must be the same as the coordinate reference of the {@link RasterTileSetStructure.reference}
   */
  bounds: Bounds;
  /**
   * The number of tile columns.
   */
  tileColumnCount: number;
  /**
   * The number of tile rows.
   */
  tileRowCount: number;
  /**
   * The width of each individual tile in pixels.
   */
  tileWidth: number;
  /**
   * The height of each individual tile in pixels.
   */
  tileHeight: number;
}
/**
 * A raster tile set structure, defined by a set of tile matrices.
 * Each of the tile matrices defines the structure for a given level.
 *
 * @since 2023.0
 */
export interface TileMatrixSet2DRasterTileSetStructure extends RasterTileSetStructure {
  /**
   * An array of tile matrices.
   * The tile matrices are ordered from coarse level to detail levels.
   */
  tileMatrix: TileMatrix[];
}
/**
 * The options which can be passed at construction time when creating a {@link RasterTileSetModel}.
 */
export interface RasterTileSetModelConstructorOptions extends RasterConfiguration {
  /**
   * The structure description for the raster tile set.
   *
   * @since 2023.0
   */
  structure: QuadTreeRasterTileSetStructure | TileMatrixSet2DRasterTileSetStructure;
  /**
   * <p>
   *   By default, LuciadRIA assumes that all tiles in a tile tree exist. If a missing tile is encountered,
   *   LuciadRIA assumes it has reached the bottom of the tile tree and will no longer attempt to load child tiles
   *   of the missing tile in the tree.
   * </p>
   * <p>
   *   Consequently, if tiles are missing in the tile tree (which we refer to as a sparse tile set), the image data
   *   below the missing tile in the tile tree will not refine. To solve this issue, you can configure the
   *   <code>isSparseTileSet</code> flag to <code>true</code>. LuciadRIA will then always attempt to load child tiles,
   *   even if a parent is missing. The downside is that tile requests will be always be attempted even when the
   *   bottom of the tree has effectively been reached. Note that LuciadRIA will never request tiles outside beyond
   *   the <code>RasterTileSet's</code> {@link RasterTileSetModel.levelCount levelCount}.
   * </p>
   * <p>
   *   The default is <code>false</code>.
   * </p>
   *
   * @since 2024.0.02
   */
  isSparseTileSet?: boolean;
}
/**
 * The deprecated options which can be passed at construction time when creating a {@link RasterTileSetModel}.
 *
 * @deprecated Please use RasterTileSetModelConstructorOptions as of 2023.0
 * @since 2023.0
 */
export interface RasterTileSetModelConstructorDeprecatedOptions {
  /**
   * <p>The spatial reference for this tileset.</p>
   *
   * <p>
   *   When visualizing the model on a WebGL map, any reference is allowed.
   *   LuciadRIA will warp your source raster data to the map's reference.
   * </p>
   *
   * <p>
   *   When visualizing the model on a non-WebGL maps, this reference must be the same as the {@link Map.reference} because LuciadRIA cannot warp tiles to another projection.
   * </p>
   * <p>
   *   However, if the map is visualized by means of an equidistant cylindrical projection, you can still use geodetic  references or different equidistant cylindrical grid references.
   *   In such cases, the required warping is limited to the scaling of tiles, which is something a web browser can do efficiently.
   * </p>
   */
  reference: CoordinateReference;
  /**
   * The spatial extent for this tileset.
   * These {@link Bounds.reference} must be the same as {@link reference}.
   */
  bounds: Bounds;
  /**
   * The number of levels contained in this tileset. The default value is 22.
   */
  levelCount?: number;
  /**
   * The number of tile columns at the coarsest level. The default value is 1.
   */
  level0Columns?: number;
  /**
   * The number of tile rows at the coarsest level, the default value is 1.
   */
  level0Rows?: number;
  /**
   * <p>The width of each individual tile in pixels, 256 will be used if it's not defined.</p>
   *
   * <p> The <code>tileWidth</code> and <code>tileHeight</code> must be the same value.</p>
   */
  tileWidth?: number;
  /**
   * <p>The height of each individual tile in pixels, 256 will be used if it's not defined.</p>
   *
   * <p> The <code>tileWidth</code> and <code>tileHeight</code> must be the same value.</p>
   */
  tileHeight?: number;
  /**
   * <p>Configures the layer's {@link RasterDataType}.</p>
   *
   * <p>The {@link RasterDataType.ELEVATION ELEVATION} raster
   * data type will only have an effect in a 3D map, and acts as a way of representing
   * 3D terrain visually. The ELEVATION dataType will not be visualized as a colorized
   * heightmap as it only affects the 3D height values of the surface of the earth.
   * </p>
   *
   * <p>The default is {@link RasterDataType.IMAGE IMAGE}.</p>
   */
  dataType?: RasterDataType;
  /**
   * <p>Configures the layer's {@link RasterSamplingMode}, corresponding to the setting representation of the underlying raster data.</p>
   *
   * <p>
   *   For {@link RasterSamplingMode.AREA AREA}.
   *   For {@link RasterSamplingMode.POINT POINT}.
   * </p>
   *
   * <p>
   *   For elevation, samplingMode {@link RasterSamplingMode.POINT POINT} is recommended for performance and accuracy.
   * </p>
   */
  samplingMode?: RasterSamplingMode;
}
/**
 * Provides a tiled and multi-leveled view on some dataset. Applications can use
 * the tile set to extract a limited working set from the data, which they
 * can then visualize or otherwise process. The contents of the tiles are not
 * specified by this interface.
 *
 * A tile set knows the underlying data's bounds and reference, as well as the number of levels
 * and the number of tile rows and columns on each level.
 *
 * Elevation data must be organized using a quad-tree tile set structure.
 *
 * Raster tile sets must be organized as quad-tree structures when you use them on a {@link Map Canvas Map}.
 *
 * For a quad-tree tile set structure the expectation is:
 * <ul>
 * <li> Level 0 is the least detailed.
 * <li> Each tile on level N corresponds to a block of 2x2 tiles on level N+1.
 * <li> The tile set bounds on each level is the same.
 * </ul>
 *
 * For other tile set structures the expectation is:
 * <ul>
 *   <li>Level 0 is the least detailed level.
 *   <li>Tiles of detail levels should overlap with tiles of their parent level.
 *       If this is not the case such tiles are not painted on the map.
 * </ul>
 *
 * The tile set interface allows:
 * <ul>
 * <li>Sparse storage: {@link getImage} may also indicate that a tile is not available.
 * In other words, although the tiles on each detail level form a regular grid, not all cells in
 * this grid need to be populated. This allows for the creation of high
 * resolution overlays on lower resolution data.</li>
 * <li>Minimal memory footprints: there is no explicit modeling of the tile
 * hierarchy. Objects that represent tiles need only be instantiated when
 * those tiles are actually requested, and are available for garbage
 * collection as soon as the application stops referencing them.</li>
 * </ul>
 *
 */
export declare abstract class RasterTileSetModel extends Invalidation implements Model, Bounded {
  /**
   * Creates a new RasterTileSetModel.
   * @param options  a parameter hash containing the properties described below
   */
  constructor(options: RasterTileSetModelConstructorOptions | RasterTileSetModelConstructorDeprecatedOptions);
  /**
   * Indicates that this RasterTileSetModel models a sparse tile tree. Please refer to
   * {@link RasterTileSetModelConstructorOptions.isSparseTileSet} for details.
   *
   * @since 2024.0.02
   */
  get isSparseTileSet(): boolean;
  /**
   * Returns the bounds of the tile set at the specified detail level.
   *
   * @param level the requested detail level.
   * @return the bounds of the raster data at the specified detail level.
   *         It returns <code>null</code> if the level does not exist.
   * @since 2023.0
   */
  getBounds(level: number): Bounds | null;
  /**
   * Returns the pixel density of the raster data at the specified detail level. The pixel density
   * is the number of raster elements per spatial unit , i.e. (tile pixel width) / (tile spatial width) and
   * (tile pixel height) / (tile spatial height area), where the tile spatial dimensions are in the tilesets
   * reference.
   *
   * @param level the requested detail level
   * @return the pixel density of the raster data at the specified detail level.
   * It returns <code>null</code> if the level does not exist.
   */
  getPixelDensity(level: number): number[] | null;
  /**
   * Returns the width, in pixels, of the tiles at the specified detail level.
   * All tiles are assumed to have the same resolution.
   *
   * @param level the requested detail level
   * @return the width of the tiles at the specified detail level
   */
  getTileWidth(level: number): number | null;
  /**
   * Returns the height, in pixels, of the tiles at the specified detail level.
   * All tiles are assumed to have the same resolution.
   *
   * @param level the requested detail level
   * @return the height of the tiles at the specified detail level
   */
  getTileHeight(level: number): number | null;
  /**
   * Returns the number of rows in the tile grid at the given level. Each level
   * should have twice the number of rows of the previous one.
   * @param level the level to be queried
   * @return the number of tile rows on the specified level
   */
  getTileRowCount(level: number): number | null;
  /**
   * Returns the number of columns in the tile grid at the given level. Each
   * level should have twice the number of columns of the previous one.
   *
   * @param level the level to be queried
   * @return the number of tile columns on the specified level
   */
  getTileColumnCount(level: number): number | null;
  /**
   * Loads a tile from the tileset.
   *
   * @param tile the coordinate of the tile
   * @param onSuccess the callback function that should be invoked when the tile was successfully loaded
   *                             The function will receive two arguments, the tile coordinate that was passed to this
   *                             function and an Image object.
   * @param onError the callback function that should be invoked when the tile could not be loaded
   *                           The function will receive two arguments, the tile coordinate that was passed to this
   *                           function and an optional Error object.
   * @param abortSignal an AbortSignal that signals when a tile request is cancelled
   */
  abstract getImage(tile: TileCoordinate, onSuccess: (tile: TileCoordinate, image: HTMLImageElement) => void, onError: (tile: TileCoordinate, error?: any) => void, abortSignal: AbortSignal | null): void;
  /**
   * Loads a tile from the tileset. The default implementation of this method calls the {@link getImage} method.
   *
   * The following code snippet illustrates how this method can be overridden.
   * ```javascript
   * model.getTileData = function(tile, onSuccess, onError) {
   *   fetch(url).then(function(response) {
   *     response.arrayBuffer().then(function(arrayBuffer) {
   *       onSuccess(tile, {
   *         data: arrayBuffer,
   *         mimeType: "image/jpeg"
   *       });
   *     })
   *   });
   * ```
   *
   * @param tile the coordinate of the tile
   * @param onSuccess the callback function that should be invoked when the tile was successfully loaded
   *                             The function will receive two arguments, the tile coordinate that was passed to this
   *                             function and a {@link TileData} object.
   * @param onError the callback function that should be invoked when the tile could not be loaded
   *                           The function will receive two arguments, the tile coordinate that was passed to this
   *                           function and an optional Error object.
   * @param abortSignal an AbortSignal that signals when a tile request is cancelled.
   */
  getTileData(tile: TileCoordinate, onSuccess: (tile: TileCoordinate, data: TileData) => void, onError: (tile: TileCoordinate, error: any) => void, abortSignal: AbortSignal | null): void;
  /**
   * Returns the data type of this RasterTileSetModel.
   */
  get dataType(): RasterDataType;
  /**
   * Returns the sampling mode of this RasterTileSetModel.
   */
  get samplingMode(): RasterSamplingMode;
  /**
   * The number of available detail levels. Level 0 is the coarsest level.
   */
  get levelCount(): number;
  get reference(): CoordinateReference;
  get coordinateType(): CoordinateType;
  get bounds(): Bounds | null;
  /**
   * Returns the bounds of a given tile in the tile set.  The bounds are calculated based on the model bounds
   * and the model's tileset structure.
   * @param tile The tile coordinate for which you want to calculate the bounds
   * @return The bounds of the requested tile coordinate in the model's reference.
   * @since 2020.1
   */
  getTileBounds(tile: TileCoordinate): Bounds;
  get modelDescriptor(): ModelDescriptor;
  set modelDescriptor(modelDescriptor: ModelDescriptor);
  /**
   * Signals that the underlying data for the tiled images has changed. If this model is
   * added to a map using a {@link RasterTileSetLayer}, calling this method will
   * thus trigger a refresh of the visualization.
   */
  invalidate(): void;
  /**
   * An event indicating that this {@link RasterTileSetModel} is invalidated. Invalidated means that
   * the underlying data for the tiled images has changed
   * This event fires when {@link invalidate} is called.
   * @event "Invalidated"
   */
  on(event: "Invalidated", callback: (...args: any[]) => void, context?: any): Handle;
}