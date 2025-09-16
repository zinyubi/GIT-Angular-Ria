import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { CubeMapPanoramaDescriptor, SingleImagePanoramaDescriptor } from "./PanoramaDescriptor.js";
import { CubeMapFace } from "./CubeMapFace.js";
import { PanoramaContext } from "./PanoramaContext.js";
import { Feature } from "../feature/Feature.js";
/**
 * Options for the {@link PanoramaModel} constructor.
 * @since 2020.1
 */
export interface PanoramaModelConstructorOptions extends HttpRequestOptions {
  /**
   * Describes type and tileset structure used by panoramas in this model.
   *
   * By default, this descriptor is used for all panoramas in the model.
   * If your layer contains panoramas of varying types or tileset structures,
   * you should override {@link PanoramaModel.getPanoramaDescriptor}
   */
  panoramaDescriptor: CubeMapPanoramaDescriptor | SingleImagePanoramaDescriptor;
  /**
   * The base URL for this {@link PanoramaModel}.
   * See {@link PanoramaModel.getPanoramicImageURL} for details on how this value is used.
   *
   * <p>
   * If you don't want to fetch images from URL's, but want to implement your own image loading in
   * {@link PanoramaModel.getPanoramicImage}, you can set this to any string of choice. It is only used in
   * {@link PanoramaModel.getPanoramicImage}, so if you replace that with a custom implementation, you
   * can ignore the result of {@link PanoramaModel.getPanoramicImageURL}.
   * </p>
   */
  baseURL: string;
  /**
   * When specified, {@link PanoramaModel.getPanoramicImageURL} will replace the <code>{s}</code>
   * pattern in <code>baseURL</code> with values from
   * <code>subdomains</code>. This will cause tile requests to be
   * spread across different subdomains. Browsers limit the amount of
   * connections to a single domain. Using <code>subdomains</code>
   * avoids hitting this limit. By default, it's an empty array.
   */
  subdomains?: string[];
  /**
   * A mapping of {@link CubeMapFace} to strings to be used by the <code>{face}</code> URL pattern.
   * By default, the following mapping will be used:
   * ```javascript
   * new Map([
   *   [CubeMapFace.FRONT, "front"],
   *   [CubeMapFace.BACK, "back"],
   *   [CubeMapFace.LEFT, "left"],
   *   [CubeMapFace.RIGHT, "right"],
   *   [CubeMapFace.TOP, "top"],
   *   [CubeMapFace.BOTTOM, "bottom"],
   * ]);
   * ```
   */
  facePatternMap?: Map<CubeMapFace, string>;
}
/**
 * A request for a tile of a panoramic image.
 * @since 2020.1
 */
export interface PanoramicImageTileRequest {
  /**
   * The feature.
   */
  feature: Feature;
  /**
   * The context, passed from {@link GeoCanvas.drawPanorama}.
   */
  context: PanoramaContext;
  /**
   * The level of the tile.
   */
  level: number;
  /**
   * The x-coordinate of the tile.
   */
  x: number;
  /**
   * The y-coordinate of the tile.
   */
  y: number;
  /**
   * The face of a cubemap panorama.
   * For tile requests of single-image panoramas ({@link PanoramaType.SINGLE_IMAGE}),
   * this property is undefined.
   */
  face?: CubeMapFace;
}
/**
 * <p>A model that describes (multileveled) panoramas.</p>
 *
 * <p>
 *   This model is similar to a {@link UrlTileSetModel}. The difference is that this model fetches panoramic imagery, instead of 2D rasters.
 *   This model is assigned to {@link FeaturePainter} you decide for what
 *   geometry or feature you want to show panoramic images (using {@link GeoCanvas.drawPanorama}.
 * </p>
 *
 * @since 2020.1
 */
export declare class PanoramaModel implements Required<HttpRequestOptions> {
  /**
   * Constructs a new PanoramaModel.
   * @param options The construction options for the model.
   */
  constructor(options: PanoramaModelConstructorOptions);
  /**
   * Loads a tile of a panoramic image or video.
   *
   * @param request the coordinate of the tile
   * @param onSuccess a callback function that should be invoked when the image was successfully loaded
   *                   The function takes three arguments: the tile request that was passed to this
   *                   function, an image object and an optional content type.
   * @param onError a callback function that should be invoked when the image could not be loaded
   *                The function will receive two arguments, the request that was passed to this
   *                function and an optional Error object.
   */
  getPanoramicImage(request: PanoramicImageTileRequest, onSuccess: (request: PanoramicImageTileRequest, image: (HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)) => void, onError: (request: PanoramicImageTileRequest, error?: Error) => void): void;
  /**
   * <p>
   *   Returns the URL for a specific panoramic image tile request. The default implementation of this method returns <code>baseURL</code>,
   *   replacing the patterns in the <code>baseURL</code> with the ones supported by {@link replaceURLPatterns}.
   * </p>
   * @param request the tile request
   * @return the resolved URL for the specified tile or <code>null</code> if the requested tile does not exist, or no URL could be determined (for example, when baseURL is not set).
   */
  getPanoramicImageURL(request: PanoramicImageTileRequest): string | null;
  /**
   * Replaces patterns in the given URL.
   *
   * By default, it will replace <code>{x}</code>, <code>{y}</code>, <code>{z}</code>, <code>{face}</code> and <code>{id}</code> with the values of
   * <code>request.x</code>, <code>request.y</code>, <code>request.level</code>, <code>request.face</code> (mapped) and <code>feature.id</code> respectively.
   * Additionally, it will replace <code>{context.*}</code> with a corresponding property on your context object.
   *
   * <p>
   *   It is not uncommon that the tile rows are seem to be reversed in the visualisation.  This means that the
   *   Y-axis in the tile coordinate system of the tile service is reversed with respect to the tile coordinate
   *   system used by LuciadRIA. You can use the <code>{-y}</code> placeholder in the baseURL to compensate for this.
   * </p>
   *
   * <p>
   *   If the URL contains the <code>{s}</code> subdomains hook, {@link replaceURLPatterns} will replace the hook
   *   with one of the values of {@link subdomains}.
   * </p>
   *
   * @param urlWithPatterns The URL that contains the patterns to replace.
   * @param request The request for the panoramic image
   * @return The URL with its patterns replaced, or null if no replacement could be made.
   *         This can happen when the URL is null, or no panorama descriptor could be found for the request ({@link getPanoramaDescriptor} returns null).
   */
  replaceURLPatterns(urlWithPatterns: string, request: PanoramicImageTileRequest): string | null;
  /**
   * Returns the image description for a given panoramic context.
   * The context is passed from `FeaturePainter.paintBody` / `GeoCanvas.drawPanorama`.
   *
   * If your dataset has a mix of different panorama types (cubemap vs. single-image), or
   * has a mix of tile structures, you should override this method and return the right descriptor
   * for a given context.
   *
   * @param feature the feature the panoramic image is for
   * @param context the context of this panoramic image in the feature
   * @return a descriptor that describes
   */
  getPanoramaDescriptor(feature: Feature, context: PanoramaContext): CubeMapPanoramaDescriptor | SingleImagePanoramaDescriptor | null;
  /**
   * @see {@link HttpRequestOptions.credentials}
   */
  get credentials(): boolean;
  /**
   * @see {@link HttpRequestOptions.credentials}
   */
  set credentials(credentials: boolean);
  /**
   * @see {@link HttpRequestOptions.requestHeaders}
   */
  get requestHeaders(): HttpRequestHeaders | null;
  /**
   * @see {@link HttpRequestOptions.requestHeaders}
   */
  set requestHeaders(requestHeaders: HttpRequestHeaders | null);
  /**
   * <p>
   * {@link getPanoramicImageURL} will replace the <code>{s}</code> pattern in <code>baseURL</code> with
   * values from <code>subdomains</code>.  This will cause tile requests to be spread across different
   * subdomains.  Browsers limit the amount of connections to a single domain.  Using
   * <code>subdomains</code> avoids hitting this limit.
   * </p>
   *
   * <p>
   * The <code>subdomains</code> array cannot be empty if the model's baseURL contains the <code>{s}</code>
   * subdomain hook.
   * </p>
   */
  get subdomains(): string[];
  set subdomains(subdomains: string[]);
  /**
   * The base URL configures the location of the panoramic image server.
   * See {@link getPanoramicImageURL} for details on how the base URL is used to construct actual image URLs.
   */
  get baseURL(): string;
  set baseURL(val: string);
  /**
   * <p>
   * Custom request parameters to send along with panoramic requests.
   * The object literal can contain simple key/value pairs. Accepted values are strings, numbers and booleans.
   * Values must not be URL encoded.
   * </p>
   * <p>
   * Assignments of other values than object literals to <code>requestParameters</code> will throw an Error.  Clearing
   * the parameters can be done by assigning <code>null</code> or an empty object literal to
   * <code>requestParameters</code>.
   * </p>
   *
   * @since 2021.0
   */
  get requestParameters(): HttpRequestParameters | null;
  set requestParameters(value: HttpRequestParameters | null);
}