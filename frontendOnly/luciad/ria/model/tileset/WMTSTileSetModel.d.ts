import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { WMTSCapabilities } from "../capabilities/WMTSCapabilities.js";
import { TileCoordinate } from "./TileCoordinate.js";
import { UrlTileSetModel, URLTileSetModelConstructorOptions } from "./UrlTileSetModel.js";
import { Bounds } from "../../shape/Bounds.js";
import { RasterConfiguration } from "../RasterConfiguration.js";
import { WMTSRequestEncoding } from "./WMTSRequestEncoding.js";
/**
 * WMTS options.
 *
 * @since 2023.0
 */
export interface WMTSOptions {
  /**
   * root URI of the GetTile request interface
   */
  url: string;
  /**
   * the name of the WMTS layer
   */
  layer: string;
  /**
   * The style to apply on the image when making a request, the default value is "default".
   */
  style?: string;
  /**
   * The image format of the images to retrieve from the WMTS server.
   * Default: "image/jpeg"
   */
  format?: string;
  /**
   * The name of the tile matrix set
   */
  tileMatrixSet: string;
  /**
   * The array of tile matrices identifiers
   */
  tileMatrices: number[] | string[];
  /**
   * Dimension parameters to send along with WMTS <code>GetTile</code> request.
   * Typical dimensions are<code>TIME</code> and <code>ELEVATION</code>.
   * The object literal can contain simple key/value pairs.  Accepted values
   * are strings, numbers, booleans. Values must not be URL encoded.
   * @since 2021.0
   */
  dimensions?: object;
}
/**
 * Constructor options for {@link WMTSTileSetModelConstructorOptions}.
 */
export interface WMTSTileSetModelConstructorOptions extends URLTileSetModelConstructorOptions, WMTSOptions {
  /**
   * The base URL for this tileset. See {@link UrlTileSetModel.getTileURL} for details on how this value is used.
   *
   * @since 2023.0
   */
  baseURL: string;
  /**
   * When specified, {@link WMTSTileSetModel.getTileURL} will replace the <code>{s}</code>
   * pattern in <code>baseURL</code> with values from
   * <code>subdomains</code>. This will cause tile requests to be
   * spread across different subdomains. Browsers limit the amount of
   * connections to a single domain. Using <code>subdomains</code>
   * avoids hitting this limit. By default, it's empty.
   *
   * @since 2023.0
   */
  subdomains?: string[];
  /**
   * Indicates the request encoding used to perform supported WMTS operation requests.
   * In case when <code>requestEncoding</code> is not specified, a default value
   * {@link WMTSRequestEncoding.KVP} will be used instead.
   *
   * @since 2024.1
   */
  requestEncoding?: WMTSRequestEncoding;
}
/**
 * Constructor options for {@link WMTSTileSetModelConstructorOptions}.
 *
 * @since 2023.0
 * @deprecated Please use WMTSTileSetModelConstructorOptions.
 */
export interface WMTSTileSetModelConstructorDeprecatedOptions extends HttpRequestOptions, WMTSOptions, RasterConfiguration {
  /**
   * The spatial extent for this tileset
   */
  bounds: Bounds;
  /**
   * The spatial reference in which this model is defined. By default the reference is deduced from the bounds parameter.
   */
  reference?: CoordinateReference;
  /**
   * The number of tile columns at the coarsest level, the default value is 1.
   */
  level0Columns?: number;
  /**
   * The number of tile rows at the coarsest level. Default: 1
   */
  level0Rows?: number;
  /**
   * The number of levels contained in this tileset. Default: 22
   */
  levelCount?: number;
  /**
   * The width of each individual tile in pixels. Default: 256
   */
  tileWidth?: number;
  /**
   * The height of each individual tile in pixels. Default: 256
   */
  tileHeight?: number;
  /**
   * Dimension parameters to send along with WMTS <code>GetTile</code> request.
   * Typical dimensions are<code>TIME</code> and <code>ELEVATION</code>.
   * The object literal can contain simple key/value pairs.  Accepted values
   * are strings, numbers, booleans. Values must not be URL encoded.
   * @since 2021.0
   */
  dimensions?: object;
  /**
   * Custom request parameters to send along with WMTS GetMap and
   * GetFeatureInfo request.  The object literal can contain simple
   * key/value pairs (strings, numbers, booleans).  Values must not
   * be URL encoded.
   * @since 2021.0
   */
  requestParameters?: HttpRequestParameters | null;
}
/**
 * Options to create {@link WMTSTileSetModel.createFromCapabilities} or
 * {@link WMTSTileSetModel.createFromURL}
 */
export interface WMTSTileSetModelCreateOptions extends HttpRequestOptions, RasterConfiguration {
  /**
   * root URI of the <code>GetTile</code> request interface.  Use this when you want to override the URI
   * reported in the capabilities object.
   * @since 2021.0.04
   */
  url?: string;
  /**
   * The image format of the images to retrieve from the WMTS server
   */
  format?: string;
  /**
   * The identifier of the tile matrix set. Will be computed automatically if not defined.
   */
  tileMatrixSet?: string;
  /**
   * The preferred spatial reference of the tile matrix set, if it is not explicitly defined using
   * <code>tileMatrixSet</code>. If no tile matrix set can be found for the given reference, an error is thrown.
   */
  reference?: CoordinateReference;
  /**
   * Dimension parameters to send along with WMTS <code>GetTile</code> request.
   * Typical dimensions are<code>TIME</code> and <code>ELEVATION</code>.
   * The object literal can contain simple key/value pairs.  Accepted values
   * are strings, numbers, booleans. Values must not be URL encoded.
   * @since 2021.0
   */
  dimensions?: object;
  /**
   * Custom request parameters to send along with WMTS GetMap and
   * GetFeatureInfo request.  The object literal can contain simple
   * key/value pairs (strings, numbers, booleans).  Values must not
   * be URL encoded.
   * @since 2021.0
   */
  requestParameters?: HttpRequestParameters | null;
  /**
   * Indicates that the WMTS tile set model creation must aim for quad-tree tile set structures only.
   * The default behavior is to allow non-quad tree tile matrix sets.
   *
   * @since 2023.0
   */
  useQuadTreeOnly?: boolean;
  /**
   * Indicates the preferred encoding of the WMTS request operations. If the WMTS server
   * does not support the supplied <code>preferredRequestEncoding</code>,
   * we fall back to another request encoding supported by the WMTS server.
   *
   * @default WMTSRequestEncoding.KVP
   *
   * @since 2024.1
   */
  preferredRequestEncoding?: WMTSRequestEncoding;
}
/**
 * Defines the desired WMTS layers and (optionally) their layer styles.
 */
export interface WMTSCapabilitiesLayerConfig {
  /**
   * The layer
   */
  layer: string;
  /**
   * The style to be applied to the layer.
   */
  style?: string;
}
/**
 * <p>
 *   A tileset model that can access an OGC WMTS server.
 * </p>
 *
 * <p>Typically, you don't need to call the constructor yourself. Instead, use the factory methods {@link createFromURL}
 * or  {@link createFromCapabilities} to create an instance of this model.
 * The following example demonstrates how to set up a <code>WMTSTileSetModel</code> to retrieve
 * WMTS tiles for a given service URL and layer name:</p>
 *
 * ```javascript
 * [[include:model/tileset/WMTSTileSetModelSnippets.ts_CREATE_FROM_URL]]
 * ```
 *
 * <p>If you want to access the WMTS server capabilities and explore the service metadata and available data sets,
 * you must create a {@link WMTSCapabilities} instance first. You can also use this
 * instance to create a <code>WMTSTileSetModel</code> afterwards:</p>
 *
 * ```javascript
 * [[include:model/tileset/WMTSTileSetModelSnippets.ts_CREATE_FROM_CAPABILITIES]]
 * ```
 *
 * <h3>Supported versions</h3>
 * <p>LuciadRIA consumes only WMTS services that support version 1.0 of the OGC WMTS specification.</p>
 * <p>KVP and RESTful request encodings are available for the GetCapabilities and GetTile operations. SOAP request encoding is not supported.
 * </p>
 */
declare class WMTSTileSetModel extends UrlTileSetModel {
  /**
   * Creates a WMTS TileSet Model.
   * @param options the options for the WMTS model
   */
  constructor(options: WMTSTileSetModelConstructorOptions | WMTSTileSetModelConstructorDeprecatedOptions);
  /**
   * Creates a tileset model for the given layers and options. This is the recommended method to create a model based on
   * information provided by {@link WMTSCapabilities}.
   *
   * @param capabilities WMTS capabilities
   * @param wmtsLayer An object literal that defines the desired WMTS layer and optionally a style.
   *                           The literal has a mandatory <code>layer</code> and an optional <code>style</code> property,
   *                           both of type <code>String</code>.
   * @param options The options for the WMTS model
   *
   * @since 2019.1
   * @return a <code>WMTSTileSetModel</code> for the given parameters.
   */
  static createFromCapabilities(capabilities: WMTSCapabilities, wmtsLayer: WMTSCapabilitiesLayerConfig, options?: WMTSTileSetModelCreateOptions): WMTSTileSetModel;
  /**
   * Creates a tileset model for the given layers and options. This is the recommended method to create a model based on
   * a given WMTS server URL and layer names.
   *
   * @param url The URL of the WMTS server.
   * @param wmtsLayer An object literal that defines the desired WMTS layer and (optionally) a style.
   *                  The literal has a mandatory <code>layer</code> and an optional <code>style</code> property,
   *                  both of type <code>String</code>.
   * @param options   The options for the WMTS model
   * @since 2019.1
   * @return a <code>WMTSTileSetModel</code> for the given parameters.
   *         The promise is rejected if the model creation fails.
   */
  static createFromURL(url: string, wmtsLayer: WMTSCapabilitiesLayerConfig, options?: WMTSTileSetModelCreateOptions): Promise<WMTSTileSetModel>;
  getTileBounds(tile: TileCoordinate): Bounds;
  /**
   * Returns the URL for a specific tile.
   * @param baseURL the base URL that was passed to the constructor.
   * @param tile the coordinate of the tile
   * @return the resolved URL for the specified tile or <code>null</code> if the requested tile does not exist.
   */
  getTileURL(baseURL: string, tile: TileCoordinate): string | null;
  /**
   * <p>
   * Custom request parameters to send along with WMTS <code>GetMap</code> and <code>GetFeatureInfo</code> request.
   * The object literal can contain simple key/value pairs.  If you try to configure request parameters that
   * are part of the WMTS standard, a {@link ProgrammingError} will be thrown.  For
   * example, adding a "layers" request parameter is not allowed.  Accepted values are strings, numbers and booleans.
   * A {@link ProgrammingError} will be thrown if values of another type are used.
   * Values must not be URL encoded.
   * </p>
   * <p>
   * Assignments of other values than object literals to <code>requestParameters</code> will throw an Error.  Clearing
   * the parameters can be done by assigning <code>null</code> or an empty object literal to
   * <code>requestParameters</code>.  In order to trigger a refresh of the
   * visualization on the map, can call {@link invalidate}.
   * </p>
   *
   * @since 2021.0
   */
  get requestParameters(): HttpRequestParameters | null;
  set requestParameters(value: HttpRequestParameters | null);
  /**
   * <p>
   * Dimension parameters to send along with WMTS <code>GetTile</code> request.
   * Typical dimensions are <code>TIME</code> and <code>ELEVATION</code>.
   * </p>
   * <p>
   * The object literal can contain simple key/value pairs.  Dimension names will be prefixed with "DIM_" in the
   * WMTS requests, if this is not already the case.  The dimension names <code>TIME</code> and <code>ELEVATION</code>
   * will never be prefixed.  Accepted values are strings, numbers, booleans.
   * A {@link ProgrammingError} will be thrown if values of another type are used.
   * Values must not be URL encoded.  Assigning other values than object literals to <code>dimensions</code> will
   * throw a {@link ProgrammingError}.
   * </p>
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * </p>
   * <p>
   * The example below configures a WMTSTileSetModel to request temperature data on the 1st of july 2016,
   * at ground level.
   * </p>
   *
   * ```javascript
   * wmtsTileSetModel.dimensions = {
   *   TIME: "2016-07-01T12:00:00.000Z",
   *   ELEVATION: 0
   * };
   * ```
   *
   * @since 2021.0
   *
   */
  get dimensions(): object | null;
  set dimensions(value: object | null);
  /**
   * <p>
   *   Indicates that this RasterTileSetModel models a sparse tile tree. Please refer to
   *   {@link RasterTileSetModelConstructorOptions.isSparseTileSet} for details.
   * </p>
   * <p>
   *   A WMTSTileSetModel is always considered to model a sparse tile set because it is possible that tile matrices
   *   in the model's tile matrix set no not overlap perfectly.
   * </p>
   * @since 2024.0.02
   */
  get isSparseTileSet(): boolean;
  /**
   * <p>
   *   Returns the request encoding used by this<code>WMTSTileSetModel</code>
   *   for performing WMTS <code>GetTile</code> operation request to a WMTS server.
   * </p>
   *
   * @since 2024.1
   */
  get requestEncoding(): WMTSRequestEncoding;
}
export { WMTSTileSetModel };