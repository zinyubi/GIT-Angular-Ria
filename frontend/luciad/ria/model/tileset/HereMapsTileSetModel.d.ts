import { AttributedTileSet, AttributionTileRegion } from "./AttributedTileSet.js";
import { TileCoordinate } from "./TileCoordinate.js";
import { UrlTileSetModel } from "./UrlTileSetModel.js";
import { Handle } from "../../util/Evented.js";
/**
 * The options to create a HERE tileset model.
 * @since 2021.1
 */
export interface HereMapsTileSetModelCreateOptions {
  /**
   * The API key to connect with HERE's map rendering services. You can create an API key on the <a href="https://platform.here.com/">HERE platform</a>.
   * Follow the instructions in the <a href="https://www.here.com/docs/bundle/identity-and-access-management-developer-guide/page/topics/plat-using-apikeys.html">Identity and Access Management Developer Guide</a> to obtain an API key for the REST APIs.
   */
  apiKey: string;
  /**
   * Query tiles by specific features. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/topics/features.html">HERE
   * developer guide</a> for more information.
   * @since 2024.1.04
   */
  features?: {
    [key: string]: string;
  };
  /**
   * The image format. The possible values are 'png', 'png8' and 'jpg'. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-v3-api-reference/page/index.html">HERE Maps Raster
   * Tile API reference</a> for more information.  By default, 'png8' is used.
   */
  format?: string;
  /**
   * Set the label language in the tiles. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/topics/languages.html">HERE
   * developer guide</a> for more information.
   * @since 2024.1.04
   */
  lang?: string;
  /**
   * Set the language of secondary labels in the tiles. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/topics/languages.html">HERE
   * developer guide</a> for more information.
   * @since 2024.1.04
   */
  lang2?: string;
  /**
   * <p>
   * Allows you to configure the sizes of icons and labels in the tiles. Possible values are 100, 200 and 400. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/topics/examples/example-ppi.html">
   * HERE developer guide</a> for more information. The default value is 100.
   * </p>
   * <p>
   * This parameter is valuable if your map is rendered on HiDPI screens where a display scale is applied.
   * If you configure this parameter you should also consider configuring {@link RasterTileSetLayer.detailFactor} so
   * labels and icons in the HERE tiles are sized appropriately.  You should also consider using the {
   * {@link HereMapsTileSetModelCreateOptions.scale} and {@link HereMapsTileSetModelCreateOptions.size} parameters
   * when using HiDPI rendering.
   * </p>
   * @since 2024.1.04
   */
  ppi?: 100 | 200 | 400;
  /**
   * If present, selects the projection of the tile. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-v3-api-reference/page/index.html">HERE Maps Raster
   * Tile API reference</a> for more information about the available values.  Note: the default projection is "mc",
   * which stands for Mercator.
   * @since 2024.1.04
   */
  projection?: string;
  /**
   * Allows you to configure the geopolitical view on the map tiles. Boundaries are adapted based on international or
   * local country views. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/topics/examples/example-political-view.html">
   * HERE developer guide</a> for more information.
   * @since 2024.1.04
   */
  pview?: string;
  /**
   * The resource type, specifies the type of tile. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-v3-api-reference/page/index.html">HERE Maps Raster
   * Tile API reference</a> for more information about the available values.  When not provided "base" is used.
   * @since 2024.1.04
   */
  resource?: string;
  /**
   * <p>
   * Allows you to request high resolution (high DPI) tiles. Possible values are 1 and 2. The default value is 1.
   * If you configure this property to a value of 2, you should also configure
   * {@link HereMapsTileSetModelCreateOptions.size} to 512 for the best performance and visual result.
   * </p>
   * <p>
   * If you render on a screen where display scaling is applied, you should consider using this property. You can
   * detect if display scaling applies using {@link Map.displayScale}.  HighDPI raster rendering is configured using
   * the {@link RasterTileSetLayer.detailFactor} property.  Also refer to the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-developer-guide/page/topics/examples/example-resolution.html">
   * HERE developer guide</a> for more information.
   * </p>
   * @since 2024.1.04
   */
  scale?: number;
  /**
   * Server to load tiles from. Default value is {@link https://maps.hereapi.com 'maps.hereapi.com'}. For traffic tiles the base URL
   * is {@link https://traffic.maps.hereapi.com 'traffic.maps.hereapi.com'}. Note: only pass the server name without the protocol scheme. HTTPS is assumed.
   * @since 2024.1.04
   */
  server?: string;
  /**
   * The tile size. The possible values are 256 and 512. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-v3-api-reference/page/index.html">HERE Maps Raster
   * Tile API reference</a> for more information. By default, 256 is used.
   * @since 2024.1.04
   */
  size?: number;
  /**
   * If present, selects the style to use to render the tile. See the
   * <a href="https://www.here.com/docs/bundle/raster-tile-api-v3-api-reference/page/index.html">HERE Maps Raster
   * Tile API reference</a> for more information about the available values. Note: When not provided,
   * the default style is "explore.day".
   * @since 2024.1.04
   */
  style?: string;
}
/**
 * A tileset model that can access tiles from HERE's map rendering services.
 * Its constructor should not be called directly. Instead, use the static create method:
 * ```javascript
 * [[include:model/tileset/HereMapsTileSetModelSnippets.ts_CREATE]]
 * ```
 * @since 2021.1
 */
export declare class HereMapsTileSetModel extends UrlTileSetModel implements AttributedTileSet {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  getTileURL(baseURL: string, tile: TileCoordinate): string | null;
  getAttribution(regions: AttributionTileRegion[]): string[];
  getLogo(): string | null;
  /**
   * @see {@link AttributedTileSet.on}
   * @event AttributionChanged
   */
  on(event: "AttributionChanged", callback: () => void): Handle;
  /**
   * @see {@link Invalidation.on}
   * @event Invalidated
   */
  on(event: "Invalidated", callback: () => void): Handle;
}
/**
 * Creates a HERE tileset model for the given options.
 * @param options An object literal specifying options for the creation of the HERE tileset model.
 * @return A promise for a HereMapsTileSetModel. If the model cannot be created then the promise is rejected:
 * - with a {@link ProgrammingError} if the apiKey is not defined, if the base, type and scheme combination is not supported
 * or if the image format is not supported.
 * - with an {@link !Error Error} in all other cases
 * @since 2021.1
 */
export declare function createHereMapsTileSetModel(options: HereMapsTileSetModelCreateOptions): Promise<HereMapsTileSetModel>;