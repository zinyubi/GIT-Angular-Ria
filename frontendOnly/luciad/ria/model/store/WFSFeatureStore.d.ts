import { OGCExpression } from "../../ogc/filter/FilterFactory.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { Evented, Handle } from "../../util/Evented.js";
import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { WFSCapabilities, WFSCapabilitiesFromUrlOptions } from "../capabilities/WFSCapabilities.js";
import { QName } from "../capabilities/WFSCapabilitiesFeatureType.js";
import { Codec } from "../codec/Codec.js";
import { Cursor } from "../Cursor.js";
import { QueryOptions, Store } from "./Store.js";
import { Feature } from "../feature/Feature.js";
import { WFSVersion } from "../../ogc/WFSVersion.js";
/**
 * Constructor options for {@link WFSFeatureStore}.
 */
export interface WFSFeatureStoreConstructorOptions extends HttpRequestOptions {
  /**
   * The location of the WFS service endpoint.
   */
  serviceURL: string;
  /**
   * The name of the feature type this query will be requesting from the server. The type name should be specified as
   * either a string or a QName object. A QName object is a JavaScript object that contains three string properties:
   * <code>prefix</code>, <code>namespace</code>, <code>localPart</code>.
   */
  typeName: string | QName;
  /**
   * The reference in which the {@link Feature} instances will be defined when querying this store.
   * This should match the reference of the {@link FeatureModel} on which this {@link Store} is used.
   * This reference is passed to the {@link Codec.decode} method, so that the codec will decode {@link Feature} objects
   * with the correct reference.
   *
   * <p>
   *   This reference must match the default CRS listed in the capabilities of the WFS service.
   *   Please use the {@link WFSFeatureStore.createFromURL} or {@link WFSFeatureStore.createFromCapabilities}
   *   utility methods to create an instance of this store that guarantees the right reference.
   * </p>
   */
  reference: CoordinateReference;
  /**
   * The <code>Codec</code> which will be used to convert the server response to LuciadRIA feature instances.
   * If omitted, the codec is derived from the <code>outputFormat</code> or defaulted to
   * {@link GeoJsonCodec} if <code>outputFormat</code> is not set. Replace the codec
   * if you want to support another format. The codec must support only the <code>decode()</code> method as this is
   * a read-only <code>Store</code> implementation.
   */
  codec?: Codec;
  /**
   * Configures the `outputFormat` parameter on the request.
   * The default value is <code>application/json</code>.
   * Use this parameter if the server requires a different `outputFormat` to return GeoJSON-encoded data,
   * or if you want to support another format.
   * Note that the value of <code>outputFormat</code> is also used to determine the appropriate codec,
   * {@link GeoJsonCodec} or {@link GMLCodec} used by this store.
   */
  outputFormat?: string;
  /**
   * An array of WFS versions that the server supports. By default, the <code>WFSFeatureStore</code> will select the most
   * appropriate version to communicate with the server.
   * Use this option if you want to explicitly specify which WFS version to use.
   * The order of the versions determines which version is selected, based on the versions supported by the server.
   */
  versions?: WFSVersion[];
  /**
   * An array HTTP methods that can be used to communicate with the server. The store supports GET and POST.
   * @default ["GET","POST"]
   */
  methods?: string[];
  /**
   * Indicates whether this Store should swap the axis ordering of coordinates for the specified reference
   * identifier(s) in the OGC BBOX filter when querying the WFS service. If undefined, the axis ordering dictated by
   * the model reference is respected. For each specified reference, the order will be reversed. This is for example
   * needed for EPSG:4326 data that is encoded in longitude-latitude order instead of latitude-longitude.
   */
  swapAxes?: string[];
  /**
   * A geometry property name that is used in the BBOX OGC filter when querying WFS service. The spatial filter can
   * contain an optional geometry property name, which refers to the property that should be used to retrieve a
   * feature's geometry.
   * @default null
   */
  geometryName?: string;
  /**
   * An object literal that represents the request parameters (as a key-value map) to send with each HTTP request. If set and not empty, the parameters will be added to the HTTP requests.
   * @since 2021.0
   */
  requestParameters?: {
    [headerName: string]: string | number | boolean | null | undefined;
  } | null;
}
/**
 * Describes the sorting order used in {@link SortBy}.
 * @since 2022.0.6
 */
export declare enum SortOrder {
  /**
   * Ascending sort order
   */
  Ascending = 0,
  /**
   * Descending sort order
   */
  Descending = 1,
}
/**
 * Represents the OGC SortBy element.
 * @since 2022.0.6
 */
export interface SortBy {
  /**
   * The property name.
   */
  sortProperty: string;
  /**
   * The sort order.
   * @default SortOrder.Ascending
   */
  sortOrder?: SortOrder;
}
/**
 * An object literal which contains the query-parameters. It is used to pass
 */
export interface WFSQueryOptions {
  /**
   * Contains the OGC expression that the server must apply on the requested feature types.
   */
  filter?: OGCExpression;
  /**
   * The maximum number of features the server should return in the response of this query.
   */
  maxFeatures?: number;
  /**
   * The properties of the feature to include in the response. When left undefined, all properties of the
   * feature are returned.
   */
  propertyNames?: string[];
  /**
   * Sets the OGC SortBy conditions that the WFS should apply to the requested features.
   *
   * <p>The results returned by a WFS service can be organised in a particular order.
   * This functionality is useful in situations where features have properties representing quantities,
   * like a city population, and in combination with {@link WFSQueryOptions.maxFeatures}.
   * </p>
   *
   * <p>The following example demonstrates how to set a {@link QueryProvider} to retrieve a limited number of features
   * sorted by the population property. The sortBy property ensures that you have the most densely populated cities.
   * Without the sort order, the query will retrieve 100 undetermined cities.
   * </p>
   *
   * ```javascript
   * [[include:model/store/WFSFeatureStoreSnippets.ts_SORT_BY]]
   * ```
   *
   * You can provide more than a single SortBy condition.
   * The following example orders features, sorted by the "Country" and the "Name" property.
   * This means that features are first ordered by "Country",
   * and then if some features have the same "Country", they are ordered by "Name".
   *
   * ```javascript
   * [[include:model/store/WFSFeatureStoreSnippets.ts_MULTI_SORT_BY]]
   * ```
   *
   * @since 2022.0.6
   */
  sortBy?: SortBy[];
}
/**
 * An object literal which contains the settings for <code>WFSFeatureStore</code> to be created
 * with {@link WFSFeatureStore.createFromCapabilities} or {@link WFSFeatureStore.createFromURL}.
 * @since 2022.0
 */
export interface WFSFeatureStoreCreateOptions extends HttpRequestOptions {
  /**
   * The location of the WFS service endpoint. Use this option to override the URL in the capabilities object.
   * When the value is a string then it overrides the URL both for the POST and the GET method.
   * You can also specify a different URL for the POST and the GET method.
   * By default, the URL service endpoint is used from the capabilities object for both methods.
   * @since 2021.0.04
   */
  serviceURL?: string | {
    GET?: string;
    POST?: string;
  };
  /**
   * The reference in which the {@link Feature} instances will be defined when querying this store.
   * This reference is passed to the {@link Codec.decode} method, so that the codec will decode {@link Feature} objects
   * with the correct reference.
   * This reference must match one of the CRS's listed in the capabilities of the WSF service.
   * <p>
   *   You don't need to set the reference explicitly, as the store will pick automatically a right reference
   *   from the WFS capabilities.
   * </p>
   * @default DefaultSRS from the capabilities, or the first supported reference from the list of OtherSRSs.
   */
  reference?: CoordinateReference;
  /**
   * The {@link Codec} which will be used to convert the server response to LuciadRIA feature instances.
   * The default codec assumes a server response in GeoJson format. Replace the codec if you want to support another
   * format. The codec must only support the <code>decode</code> method as this is a read-only
   * {@link Store} implementation.
   */
  codec?: Codec;
  /**
   * Configures the `outputFormat` parameter on the request.
   * The default value is <code>application/json</code>.
   * Use this parameter if the server requires a different `outputFormat` to return GeoJSON-encoded data,
   * or if you want to support another format.
   * Note that the value of <code>outputFormat</code> is also used to determine the appropriate codec,
   * {@link GeoJsonCodec} or {@link GMLCodec} used by this store.
   */
  outputFormat?: string;
  /**
   * An array of WFS versions that the server supports. By default, the <code>WFSFeatureStore</code> will select the most
   * appropriate version to communicate with the server.
   * Use this option if you want to explicitly specify which WFS version to use.
   * The order of the versions determines which version is selected, based on the versions supported by the server.
   */
  versions?: WFSVersion[];
  /**
   * Indicates whether this <code>Store</code> should swap the axis ordering of coordinates for the specified reference
   * identifier(s) in the OGC BBOX filter when querying the WFS service. If undefined, the axis ordering dictated by
   * the model reference is respected. For each specified reference, the order will be reversed. This is needed for
   * EPSG:4326 data that is encoded in longitude-latitude order instead of latitude-longitude, for example.
   */
  swapAxes?: string[];
  /**
   * A geometry property name used in the BBOX OGC filter when querying a WFS service. The spatial filter can contain
   * an optional geometry property name, which refers to the property that should be used to retrieve a feature geometry.
   * @default null
   */
  geometryName?: string;
  /**
   * An array of HTTP methods that can be used to communicate with the server. The store supports GET and POST.
   * Methods returned in the server's capabilities response are used by default.
   */
  methods?: string[];
}
/**
 * <p><code>Store</code> implementation for communicating with an OGC WFS server. This
 * <code>Store</code> uses a <code>Codec</code> to convert the server response to LuciadRIA
 * features. The standard codec assumes a server response in GeoJson format. Replace the codec
 * if you want to support another format.</p>
 *
 * <p>Set this <code>Store</code> on a {@link FeatureModel} to create a feature model
 * which retrieves its data from a WFS server. Typically, you don't need to call the constructor yourself.
 * Instead, use the factory methods {@link createFromURL}
 * or  {@link createFromCapabilities} to create an instance of this store.
 * The following example demonstrates how to set up a <code>WFSFeatureStore</code> to retrieve WFS feature data for a
 * given service url and feature type name:</p>
 *
 * ```javascript
 * [[include:model/store/WFSFeatureStoreSnippets.ts_CREATE_FROM_URL]]
 * ```
 *
 * <p>The above example uses GeoJSON as default exchange format. Here's an example on how to set up the same
 * <code>WFSFeatureStore</code> to decode GML-based data, using a <code>GMLCodec</code>:</p>
 *
 * ```javascript
 * [[include:model/store/WFSFeatureStoreSnippets.ts_CUSTOM_CODEC]]
 * ```
 *
 * <p>If you want to access the WFS server capabilities and explore the service metadata and available data sets,
 * you have to create a {@link WFSCapabilities} instance first.
 * You can also use this instance to create a <code>Store</code> afterward:</p>
 *
 * ```javascript
 * [[include:model/store/WFSFeatureStoreSnippets.ts_CREATE_FROM_CAPABILITIES]]
 * ```
 *
 * <h3>Supported versions</h3>
 * <p>
 *   LuciadRIA supports consuming WFS services that support version 1.0, 1.1 and 2.0 of the OGC WFS specification.
 * </p>
 *
 * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the store.
 *            Default type is {@link Feature} without restrictions on shape and properties.
 */
export declare class WFSFeatureStore<TFeature extends Feature = Feature> implements Store<TFeature>, Evented {
  /**
   * Creates a new <code>WFSFeatureStore</code>. Currently, this <code>Store</code> only
   * supports the <code>query</code> method.
   * @param options An object literal which contains the settings for this <code>Store</code>
   */
  constructor(options: WFSFeatureStoreConstructorOptions);
  /**
   * <p>
   *   Indicates whether credentials should be included with HTTP requests.
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
   *  respond to pre-flight CORS requests (an HTTP OPTION request sent by the browser before doing the actual request).
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
  /**
   * <p>
   * Custom request parameters to send along with WFS requests.
   * The object literal can contain simple key/value pairs. Accepted values are strings, numbers and booleans.
   * A {@link ProgrammingError} will be thrown if values of another type are used.
   * Values must not be URL encoded.
   * </p>
   * <p>
   * Assignments of other values than object literals to <code>requestParameters</code> will throw an Error.  Clearing
   * the parameters can be done by assigning <code>null</code> or an empty object literal to
   * <code>requestParameters</code>.  In order to trigger a refresh of the
   * visualization on the map use <code>layer.loadingStrategy.queryProvider.invalidate()</code>.
   * </p>
   *
   * @since 2021.0
   */
  get requestParameters(): HttpRequestParameters | null;
  set requestParameters(value: HttpRequestParameters | null);
  /**
   * Data bounds as specified by the BBOX parameter from WFS capabilities, if the store is created from
   * WFS capabilities, otherwise undefined.
   *
   * @since 2023.1
   */
  get bounds(): Bounds | undefined;
  /**
   * Creates a new <code>WFSFeatureStore</code>. This is the recommended method to create a model based on
   * information provided by {@link WFSCapabilities}.
   *
   * @param capabilities The capabilities of the WFS server.
   * @param featureTypeName The name of the WFS feature type to be loaded.
   * @param options An object literal which contains the settings for this <code>Store</code>
   * @return a <code>WFSFeatureStore</code> for the given parameters.
   *
   * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the store.
   *                     Default type is {@link Feature} without restrictions on shape and properties.
   * @since 2019.1
   */
  static createFromCapabilities<TFeature extends Feature = Feature>(capabilities: WFSCapabilities, featureTypeName: string, options?: WFSFeatureStoreCreateOptions): WFSFeatureStore<TFeature>;
  /**
   * Creates a new <code>WFSFeatureStore</code>. This is the recommended method to create a store based on
   * a given WFS server URL and feature type name.
   *
   * @param url The URL of the WFS server.
   * @param featureTypeName The name of the WFS feature type to be loaded.
   * @param options An object literal which contains options for fetching capabilities and options for the creation of this <code>Store</code>.
   *
   * @return a <code>WFSFeatureStore</code> for the given parameters. The promise is rejected if the store creation fails.
   *
   * @typeParam TFeature Represents the type of {@link Feature} instances that are handled by the store.
   *            Default type is {@link Feature} without restrictions on shape and properties.
   * @since 2019.1
   */
  static createFromURL<TFeature extends Feature = Feature>(url: string, featureTypeName: string, options?: WFSFeatureStoreCreateOptions & WFSCapabilitiesFromUrlOptions): Promise<WFSFeatureStore<TFeature>>;
  /**
   * Query the store for objects. This will make an AJAX call to the WFS server.
   * The store invokes {@link Codec.decode} to decode the server response, passing the reference that was
   * set in the constructor options {@link WFSFeatureStoreConstructorOptions.reference}.
   *
   * @param query An object literal which contains the query-parameters
   * @param options Object literal containing options for the query method.
   * @returns a promise for {@link Feature} instances corresponding to the server response.
   */
  query(query?: WFSQueryOptions, options?: QueryOptions): Promise<Cursor<TFeature>>;
  /**
   * Query the store for objects within a spatial extent. This will make an AJAX call to the WFS server.
   * The store invokes {@link Codec.decode} to decode the server response, passing the reference that was
   * set in the constructor options {@link WFSFeatureStoreConstructorOptions.reference}.
   *
   * @param bounds The spatial extent to retrieve features for
   * @param query An object literal which contains the query-parameters
   * @param options Object literal containing options for the query method.
   * @returns a promise for {@link Feature} instances corresponding to the server response.
   */
  spatialQuery(bounds?: Bounds, query?: WFSQueryOptions, options?: QueryOptions): Promise<Cursor<TFeature>>;
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
}