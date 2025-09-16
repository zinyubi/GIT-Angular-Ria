import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { LTSCapabilities } from "../capabilities/LTSCapabilities.js";
import { RasterTileSetModelConstructorDeprecatedOptions, RasterTileSetModelConstructorOptions } from "./RasterTileSetModel.js";
import { TileCoordinate } from "./TileCoordinate.js";
import { UrlTileSetModel } from "./UrlTileSetModel.js";
/**
 * Constructor options base for FusionTileSetModelConstructorOptions and FusionTileSetModelConstructorDeprecatedOptions.
 *
 * @since 2023.0
 */
export interface FusionOptions {
  /**
   * The base URL of the LuciadFusion tile server.
   */
  url: string;
  /**
   * The ID of the coverage that should be retrieved
   */
  coverageId: string;
  /**
   * Indicates whether credentials should be included with every HTTP request. See {@link credentials} for more information.
   * The default value is false.
   */
  credentials?: boolean;
  /**
   * An object literal that represents headers (as a key-value map) to send with each HTTP request. If set
   * and not empty), an XHR with the specified headers will be performed instead of creating an Image.
   * See {@link requestHeaders} for more information.
   */
  requestHeaders?: HttpRequestHeaders | null;
  /**
   * An object literal that represents the request parameters (as a key-value map) to send with each HTTP request. If set and not empty, the parameters will be added to the HTTP requests.
   * @since 2021.0
   */
  requestParameters?: {
    [headerName: string]: string | number | boolean | null | undefined;
  } | null;
  /**
   * When specified, {@link FusionTileSetModel.getTileURL} will replace the <code>{s}</code>
   * pattern in <code>baseURL</code> with values from
   * <code>subdomains</code>. This will cause tile requests to be
   * spread across different subdomains. Browsers limit the amount of
   * connections to a single domain. Using <code>subdomains</code>
   * avoids hitting this limit. By default, it's empty.
   * @since 2021.0.03
   */
  subdomains?: string[];
}
/**
 * Constructor options for {@link FusionTileSetModel}.
 */
export interface FusionTileSetModelConstructorOptions extends RasterTileSetModelConstructorOptions, FusionOptions {}
/**
 * Constructor options for {@link FusionTileSetModel}.
 *
 * @since 2023.0
 * @deprecated Please use FusionTileSetModelConstructorOptions.
 */
export interface FusionTileSetModelConstructorDeprecatedOptions extends RasterTileSetModelConstructorDeprecatedOptions, FusionOptions {}
/**
 * Options that can be configured when creating a Model from {@link LTSCapabilities}
 * @since 2021.0.04
 */
export interface FusionTileSetModelCreateOptions extends HttpRequestOptions {
  /**
   * The base URL of the LuciadFusion tile server.  Use this when you want to override the URL reported
   * by the server's Capabilities.
   * @since 2021.0.04
   */
  url?: string;
}
/**
 * <p>A tileset model that can access a LuciadFusion LTS tile server and load tiles from coverages.</p>
 *
 * <p>Typically, you don't need to call the constructor yourself. Instead, use the factory methods {@link createFromURL}
 * or  {@link createFromCapabilities} to create an instance of this model.
 * The following example demonstrates how to set up a <code>FusionTileSetModel</code> to retrieve
 * LTS tiles for a given service url and coverage identifier:</p>
 *
 * ```javascript
 * [[include:model/tileset/FusionTileSetModelSnippets.ts_CREATE_FROM_URL]]
 * ```
 *
 * <p>If you want to access the LTS server capabilities and explore the service metadata and available data sets,
 * you have to create a {@link LTSCapabilities} instance first. You can
 * also use this instance to create a <code>FusionTileSetModel</code> afterwards:</p>
 *
 * ```javascript
 * [[include:model/tileset/FusionTileSetModelSnippets.ts_CREATE_FROM_CAPABILITIES]]
 * ```
 * ```
 *
 * <p>
 * The supported LuciadFusion coverage types are:
 * <ul>
 *   <li>IMAGE,</li>
 *   <li>ELEVATION,</li>
 *   <li>RASTER if the data content represents elevation.</li>
 * </ul>
 * </p>
 *
 */
declare class FusionTileSetModel extends UrlTileSetModel {
  /**
   * Creates a new FusionTileSetModel.
   * @param options A parameter hash containing the properties described below.
   */
  constructor(options: FusionTileSetModelConstructorOptions | FusionTileSetModelConstructorDeprecatedOptions);
  /**
   * Create a <code>FusionTileSetModel</code> for the given coverage and options. This is the recommended method to create
   * a model based on information provided by {@link LTSCapabilities}.
   *
   * @param capabilities LTS capabilities
   * @param coverageId The identifier of a LuciadFusion coverage
   * @param options the options for the Fusion tile set model
   * @since 2019.1
   * @returns a <code>FusionTileSetModel</code> for the given parameters.
   */
  static createFromCapabilities(capabilities: LTSCapabilities, coverageId: string, options?: FusionTileSetModelCreateOptions): FusionTileSetModel;
  /**
   * Create a new FusionTileSetModel for the given LuciadFusion coverage. This is the recommended method to create a model based on
   * a given LuciadFusion LTS server URL and coverage identifier.
   *
   * @param url The URL of the LuciadFusion LTS server.
   * @param coverageId The identifier of a LuciadFusion coverage
   * @param options the options for the Fusion tile set model
   * @since 2019.1
   * @returns a <code>FusionTileSetModel</code> for the given parameters. The promise is rejected if the model creation fails.
   */
  static createFromURL(url: string, coverageId: string, options?: FusionTileSetModelCreateOptions): Promise<FusionTileSetModel>;
  getTileURL(baseURL: string, tile: TileCoordinate): string;
  /**
   * <p>
   * Custom request parameters to send along with LTS requests.
   * The object literal can contain simple key/value pairs. Accepted values are strings, numbers and booleans.
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
}
declare namespace FusionTileSetModel {
  /**
   * The data type of the coverage represented by the FusionTileSetModel.
   * This directly corresponds to the "DataType" metadata field in the coverage capabilities.
   * @since 2016.0
   *
   * @deprecated This has been deprecated. Please use {@link RasterDataType} instead
   */
  enum DataType {
    /**
     * Corresponds to the LuciadFusion coverage data type "IMAGE".  This is the default.
     *
     * @deprecated This has been deprecated. Please use {@link RasterDataType.IMAGE} instead
     */
    IMAGE = "tileset/image",
    /**
     * Corresponds to the LuciadFusion coverage data type "ELEVATION".
     * <p/>
     * Elevation data will only be visible as terrain geometry on a 3D map.  It will not be colored with a height color map.
     *
     * @deprecated This has been deprecated. Please use {@link RasterDataType.ELEVATION} instead
     */
    ELEVATION = "tileset/elevation",
  }
  /**
   * The raster sampling mode of the coverage represented by the FusionTileSetModel.
   * This directly corresponds to the "SamplingMode" metadata field in the coverage capabilities.
   *
   * @since 2016.0
   * @deprecated This has been deprecated. Please use {@link RasterSamplingMode} instead.
   */
  enum SamplingMode {
    /**
     * Corresponds to the LuciadFusion coverage sampling mode "AREA".  This is the default for image coverages.
     * <p/>
     * Each sample applies to the (small) area covered by a pixel. This is for example the case for data that is
     * retrieved using a photometric sensor. This is often used for color data.
     *
     * @deprecated This has been deprecated. Please use {@link RasterSamplingMode.AREA} instead.
     */
    AREA = "AREA",
    /**
     * Corresponds to the LuciadFusion coverage sampling mode "POINT".  This is the default for elevation coverages.
     * <p/>
     * Point sampling is recommended for elevation coverages for accuracy and performance.
     * <p/>
     * Each sample applies to a single point. This is for example the case for data that is retrieved using laser
     * scanning. This is often used for elevation data.
     *
     * @deprecated This has been deprecated. Please use {@link RasterSamplingMode.POINT} instead.
     */
    POINT = "POINT",
  }
}
export { FusionTileSetModel };