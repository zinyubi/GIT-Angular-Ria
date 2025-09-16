import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { RasterTileSetModel, RasterTileSetModelConstructorDeprecatedOptions, RasterTileSetModelConstructorOptions } from "./RasterTileSetModel.js";
import { TileCoordinate } from "./TileCoordinate.js";
/**
 * URL options specific for a URL Tile Set model.
 *
 * @since 2023.0
 */
export interface URLOptions {
  /**
   * The base URL for this tileset. See {@link UrlTileSetModel.getTileURL} for details on how this value is used.
   */
  baseURL: string;
  /**
   * When specified, {@link UrlTileSetModel.getTileURL} will replace the <code>{s}</code>
   * pattern in <code>baseURL</code> with values from
   * <code>subdomains</code>. This will cause tile requests to be
   * spread across different subdomains. Browsers limit the amount of
   * connections to a single domain. Using <code>subdomains</code>
   * avoids hitting this limit. By default, it's empty.
   */
  subdomains?: string[];
}
/**
 * Constructor options for {@link URLTileSetModelConstructorOptions}.
 */
export interface URLTileSetModelConstructorOptions extends RasterTileSetModelConstructorOptions, HttpRequestOptions, URLOptions {}
/**
 * Constructor options for {@link URLTileSetModelConstructorOptions}.
 *
 * @since 2023.0
 * @deprecated Please use URLTileSetModelConstructorOptions.
 */
export interface URLTileSetModelConstructorDeprecatedOptions extends RasterTileSetModelConstructorDeprecatedOptions, HttpRequestOptions, URLOptions {}
/**
 * A tileset model that resolves tile images based on URLs.
 */
declare class UrlTileSetModel extends RasterTileSetModel {
  /**
   * Creates a new UrlTileSetModel.
   * @param options options a parameter hash containing the properties described below
   */
  constructor(options: URLTileSetModelConstructorOptions | URLTileSetModelConstructorDeprecatedOptions);
  /**
   * <p>
   *   Indicates whether or not credentials should be included with HTTP requests.
   * </p>
   *
   * <p>
   *   Set this to true if the server requires credentials, like HTTP basic authentication headers or cookies.
   *   You should disable {@link credentials} if the server is configured to allow cross-origin requests from all domains (<code>Acces-Control-Allow-Origin=*</code>).
   *   If the server allows CORS requests from all domains, the browser will block all requests where <code>credentials=true</code>.
   * </p>
   *
   * <p>
   *   Once set, all subsequent HTTP requests will use the newly set value.
   * </p>
   *
   * <p>
   *   The default value is <code>false</code>.
   * </p>
   *
   */
  get credentials(): boolean;
  set credentials(value: boolean);
  /**
   * <p>
   *   Headers to send with every HTTP request.
   * </p>
   *
   * <p>
   *   An object literal that represents the headers to send with every HTTP request.
   *   The property names represent HTTP header names, the property values represent the HTTP header values.
   *   This property can be set dynamically (post-construction). Once set, all subsequent HTTP requests will use the
   *   newly set headers.
   * </p>
   *
   * <p>
   *  Note that when custom headers are being sent to a server on another domain, the server will have to properly
   *  respond to pre-flight CORS requests (a HTTP OPTION request sent by the browser before doing the actual request).
   *  The server has to indicate that the header can be used in the actual request, by including it in
   *  the pre-flight's <code>Access-Control-Allow-Headers</code> response header.
   * </p>
   *
   * <p>
   *   The default value is <code>null</code>.
   * </p>
   *
   */
  get requestHeaders(): HttpRequestHeaders | null;
  set requestHeaders(value: HttpRequestHeaders | null);
  /**
   * <p>
   * Custom request parameters to send along with tile request.
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
   * @since 2021.0.03
   */
  get requestParameters(): HttpRequestParameters | null;
  set requestParameters(value: HttpRequestParameters | null);
  getImage(tile: TileCoordinate, onSuccess: (tile: TileCoordinate, image: HTMLImageElement) => void, onError: (tile: TileCoordinate, error?: any) => void, abortSignal: AbortSignal | null): void;
  /**
   * <p>
   *   Returns the URL for a specific tile. The default implementation of this method returns <code>baseURL</code>,
   *   replacing the strings <code>{x}</code>, <code>{y}</code> and <code>{z}</code> with the values of
   *   <code>tile.x</code>, <code>tile.y</code> and <code>tile.level</code> respectively.
   * </p>
   * <p>
   *   It is not uncommon that the tile rows are seem to be reversed in the visualisation.  This means that the
   *   Y-axis in the tile coordinate system of the tile service is reversed with respect to the tile coordinate
   *   system used by LuciadRIA. You can use the <code>{-y}</code> placeholder in the baseURL to compensate for this.
   * </p>
   * <p>
   *   If the baseURL contains the <code>{s}</code> subdomains hook, <code>getTileURL()</code> will replace the hook
   *   with one of the values of {@link subdomains}.
   * </p>
   * @param baseURL the base URL that was passed to the constructor.
   * @param tile the coordinate of the tile
   * @return the resolved URL for the specified tile or <code>null</code> if the requested tile does not exist.
   */
  getTileURL(baseURL: string, tile: TileCoordinate): string | null;
  /**
   * The base URL configures the location of the tile server.  Please refer to {@link getTileURL} for
   * details on how the base URL is used to obtain tiles.
   */
  get baseURL(): string;
  set baseURL(value: string);
  /**
   * <p>
   *   {@link getTileURL} will replace the <code>{s}</code> pattern in <code>baseURL</code> with
   *   values from <code>subdomains</code>.  This will cause tile requests to be spread across different
   *   subdomains.  Browsers limit the amount of connections to a single domain.  Using
   *   <code>subdomains</code> avoids hitting this limit.
   * </p>
   * <p>
   *   The <code>subdomains</code> array cannot be empty if the model's baseURL contains the <code>{s}</code>
   *   subdomain hook.
   * </p>
   */
  get subdomains(): string[];
  set subdomains(val: string[]);
}
export { UrlTileSetModel };