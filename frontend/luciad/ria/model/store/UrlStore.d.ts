import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { Codec } from "../codec/Codec.js";
import { Cursor } from "../Cursor.js";
import { Store } from "./Store.js";
import { Feature } from "../feature/Feature.js";
/**
 * Constructor options for {@link UrlStore}.
 */
export interface UrlStoreConstructorOptions extends HttpRequestOptions {
  /**
   * The base URL from which to retrieve the resource
   */
  target: string;
  /**
   * The contents of the HTML accept header, which defines the
   * content-types that are acceptable for the response. You want to change this if you want to support another format. In that
   * case, you also need to change the {@link Codec} used by this <code>Store</code>.
   * @default "application/javascript, application/json"
   */
  accepts?: string;
  /**
   * The {@link Feature} instances.
   * The <code>Codec</code> only needs to support the <code>decode</code> method. There is no need for an
   * <code>encode</code> method as this is a read-only <code>Store</code>. You want to change this if you want to support
   * another format. In that case, you also need to change the accept header by specifying the <code>accept</code> property.
   * @default the {@link UrlStore}.
   */
  codec?: Codec;
  /**
   * This value determines what type of data to pass into {@link Codec.decode}.
   *
   * <ul>
   *   <li><code>"string"</code> uses a <code>string</code> primitive. This is the default <em>and</em> the fallback value.</li>
   *   <li><code>"arraybuffer"</code> uses a <code>ArrayBuffer</code> object.</li>
   *   <li><code>"blob"</code> uses a raw <code>Blob</code> object.</li>
   *   <li><code>"json"</code> parses a JSON response into a JS object.</li>
   * </ul>
   *
   * @default "string"
   * @since 2020.1
   */
  handleAs?: "string" | "arraybuffer" | "blob" | "json";
  /**
   * The reference in which the {@link Feature} instances will be defined when querying this store.
   * This should match the reference of the {@link Store} is used.
   * This reference will be passed to the {@link Feature} objects.
   * @since 2022.0
   */
  reference?: CoordinateReference;
}
/**
 * Options for {@link UrlStore.query}
 * @since 2023.1
 */
export interface UrlStoreQueryOptions {
  /**
   * The reference, which will be passed to the <code>Codec</code> when specified
   */
  reference?: CoordinateReference;
  /**
   * Used by LuciadRIA to signal that a query was aborted.
   * For example when the queried region is no longer visible on the map.
   */
  abortSignal?: AbortSignal;
}
/**
 * <p>A read-only store that retrieves a collection of objects from a URL. The response content is decoded to LuciadRIA
 * {@link Codec}.</p>
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the store.
 *                     Default type is {@link Feature} without restrictions on shape and properties.
 */
export declare class UrlStore<TFeature extends Feature = Feature> implements Store<TFeature> {
  /**
   * <p>Creates a new UrlStore instance.  This is typically a file on the network, but can also point to the Url of a
   * webservice which dynamically generates the data.</p>
   * <p>The default implementation uses a {@link GeoJsonCodec} to parse the server response. If
   * you want to support another format, you can pass another <code>Codec</code>.</p>
   * @param options options for the new store instance
   */
  constructor(options: UrlStoreConstructorOptions);
  /**
   * <p>
   *   Indicates whether or not credentials should be included with HTTP requests.
   * </p>
   *
   * <p>
   *   Set this to true if the server requires credentials, like HTTP basic authentication headers or cookies.
   *   You should disable {@link credentials} if the server is configured to allow cross-origin requests from all domains (<code>Access-Control-Allow-Origin=*</code>).
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
   */
  get credentials(): boolean;
  set credentials(value: boolean);
  /**
   * <p>
   *   Headers to send with every HTTP request.
   * </p>
   * <p>
   *   An object literal that represents the headers to send with every HTTP request.
   *   The property names represent HTTP header names, the property values represent the HTTP header values.
   *   This property can be set dynamically (post-construction). Once set, all subsequent HTTP requests will use the
   *   newly set headers.
   * </p>
   * <p>
   *  Note that when custom headers are being sent to a server on another domain, the server will have to properly
   *  respond to pre-flight CORS requests (a HTTP OPTION request sent by the browser before doing the actual request).
   *  The server has to indicate that the header can be used in the actual request, by including it in
   *  the pre-flight's <code>Access-Control-Allow-Headers</code> response header.
   * </p>
   * <p>
   *   The default value is <code>null</code>.
   * </p>
   */
  get requestHeaders(): HttpRequestHeaders | null;
  set requestHeaders(value: HttpRequestHeaders | null);
  /**
   * <p>
   *   Custom request parameters to send along with requests.
   *   The object literal can contain simple key/value pairs. Accepted values are strings, numbers and booleans.
   *   A {@link ProgrammingError} will be thrown if values of another type are used.
   *   Values must not be URL encoded.
   * </p>
   * <p>
   *   Assignments of other values than object literals to <code>requestParameters</code> will throw an Error.
   *   Clearing the parameters can be done by assigning <code>null</code> or an empty object literal to
   *   <code>requestParameters</code>.  In order to trigger a refresh of the
   *   visualization on the map use <code>layer.loadingStrategy.queryProvider.invalidate()</code>
   *   ({@link QueryProvider.invalidate}).
   * </p>
   *
   * @since 2021.1.03
   */
  get requestParameters(): HttpRequestParameters | null;
  set requestParameters(value: HttpRequestParameters | null);
  /**
   * Query the store for objects. The response of the server will be passed to the {@link Store}.
   * @param query An object which represents a query which may be understood and satisfied by the store.
   *        This object is ignored by the current implementation.
   * @param options An optional object specifying options specific to this {@link Store}
   * @returns a {@link Feature} instances corresponding to the server response or a promise for
   *          that <code>Cursor</code>.
   */
  query(query?: any, options?: UrlStoreQueryOptions): Promise<Cursor<TFeature>>;
}