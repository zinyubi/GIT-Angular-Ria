import { RasterImageModel } from "./RasterImageModel.js";
import { Bounds } from "../../shape/Bounds.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { HttpRequestHeaders, HttpRequestOptions } from "../../util/HttpRequestOptions.js";
/**
 * Represents the supported map types for the Google Maps API.
 * See <a href="https://developers.google.com/maps/documentation/maps-static/dev-guide#MapTypes" target="_blank">the Google developer website</a> for more information.
 */
export type GoogleMapType = "roadmap" | "satellite" | "hybrid" | "terrain";
/**
 * Defines the request limits that correspond
 * to your google account.
 */
export interface GoogleImageModelAccountLimits {
  /**
   * The maximum pixel density scale factor supported
   * by your account.
   */
  maxScale?: number;
  /**
   * The maximum image width and height for a single
   * request.
   */
  maxSize?: [number, number];
}
/**
 * Constructor options for {@link GoogleImageModel}.
 * @deprecated
 */
export interface GoogleImageModelConstructorOptions extends HttpRequestOptions {
  /**
   * The URL of the image service.
   * By default this is Google's default Static maps API endpoint.
   * If you use a proxy web service to sign the requests with a private key,
   * you must set this to the URL of the proxy server.
   **/
  serviceUrl?: string;
  /**
   * Defines the request limits that correspond
   * to your google account.
   */
  accountLimits?: GoogleImageModelAccountLimits;
  /**
   * An object with query parameters (all optional except authentication)
   * for the Google Static Maps API. All values must be strings, except for the <code>style</code> parameter
   * These may include map parameters, feature parameters or reporting parameters.
   * For the available parameters,
   * see the <a href="https://developers.google.com/maps/documentation/staticmaps/">Google Static Maps API documentation</a>.
   *
   * This object MUST NOT include the <code>center, zoom, scale</code> or <code>size</code>
   * parameters.
   *
   * For authentication, you have to include either a <code>key</code> parameter
   * or a <code>client</code> parameter (never both).
   *
   * The style parameter may be a string to specify a single style rules or an array of strings to specify multiple
   * style rules.
   *
   * ```javascript
   * //supplying multiple style rules
   * var model = new GoogleImageModel({
   *   requestParameters: {
   *     key: "myKey",
   *     format: "png",
   *     style: [
   *       "feature:road.local|element:geometry|color:0x00ff00|weight:1|visibility:on",
   *       "feature:landscape|element:geometry.fill|color:0x000000|visibility:on",
   *       "feature:administrative|element:labels|weight:3.9|visibility:on|inverse_lightness:true",
   *       "feature:poi|visibility:simplified"
   *     ]
   *   }
   * });
   * ```
   *
   * The <code>sensor</code> parameter is mandatory when using the Google Static Maps API.
   * The boolean parameter indicates whether your application is using a "sensor" (such as a GPS locator)
   * to determine the user's location.
   * By default, LuciadRIA sets this to false.
   */
  requestParameters?: {
    [parameterName: string]: any;
  };
  /**
   * The type of map
   */
  maptype?: GoogleMapType;
}
/**
 * <p>
 * This model accesses the
 * Static Maps API (v2) of Google to retrieve the images. Please review the
 * <a href="https://developers.google.com/maps/terms" target="_blank"> Google Terms of Service </a>
 * carefully to determine if your application may use the Static Maps API.
 * </p>
 *
 * <p>
 *   For information about the static maps API, check the
 *   <a href="https://developers.google.com/maps/documentation/staticmaps/" target="_blank">
 *    Google Static Maps API documentation</a>.
 * </p>
 *
 * <p>
 * Note that depending on your Google account type, different usage limits apply. One of these limits is the
 * maximum image size that can be requested from the Google servers. If the model cannot satisfy a request for
 * an image that is larger than the maximum image size determined by google, it will request a smaller image at a
 * lower zoom level.  This will result in a lower resolution raster visualization which will still fill the entire
 * view.
 * </p>
 *
 * <p>
 * The Google Static Map Image service can only serve images from a predetermined number of zoom levels.
 * When an image is requested for a scale that falls in between two supported zoom levels, the more detailed
 * zoom level is returned to obtain the best quality.  Note that if the google image contains text, this text will
 * be scaled and appear smaller than intended.
 * </p>
 *
 * <p>
 * You can use a {@link RasterImageLayer} to visualize this model on a map.
 * </p>
 *
 * ```javascript
 * //1) using an application key to configure the model
 * var model2 = new GoogleImageModel({
 * requestParameters: {
 *   key: "{APPLICATION_KEY}"
 * });
 *
 * //2)configuring the proxy to sign requests when using a business account
 * var model3 = new GoogleImageModel({
 *    serviceUrl: "http://localhost:8072/sampleservices/gmaps/sign/staticmap",
 *    requestParameters: {
 *      client: "{CLIENT_ID}"
 *  });
 * ```
 *
 * @deprecated Please use {@link GoogleMapsTileSetModel}
 */
export declare class GoogleImageModel extends RasterImageModel {
  /**
   * Creates a new Google Model.
   *
   * @param options the configuration options
   */
  constructor(options?: GoogleImageModelConstructorOptions);
  /**
   * The spatial reference of the Google model.
   * This is defined by the WGS:84 datum with a pseudo-mercator cylindrical projection.
   * It is known as "EPSG:900913" or "EPSG:3857".
   */
  get reference(): CoordinateReference;
  get bounds(): Bounds;
  /**
   * <p>
   *   Indicates whether or not credentials should be included with HTTP requests.
   * </p>
   *
   * <p>
   *   Set this to true if the server requires credentials, like HTTP basic authentication headers or cookies.
   *   You should disable if the server is configured to allow cross-origin requests from all domains
   *   (<code>Acces-Control-Allow-Origin=*</code>).
   *   If the server allows CORS requests from all domains, the browser will block all requests where
   *   <code>credentials=true</code>.
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
   */
  get requestHeaders(): HttpRequestHeaders | null;
  set requestHeaders(value: HttpRequestHeaders | null);
}