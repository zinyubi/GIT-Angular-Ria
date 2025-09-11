import { WMSCapabilities } from "../capabilities/WMSCapabilities.js";
import { RasterImageModel } from "./RasterImageModel.js";
import { Bounds } from "../../shape/Bounds.js";
import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { WMSVersion } from "../../ogc/WMSVersion.js";
export interface WMSImageModelCreateOptions extends HttpRequestOptions {
  /**
   * Root URI of the <code>getMap</code> request interface.  Use this option to override the GetMap URI that was
   * returned in the capabilities object.
   * @since 2021.0.04
   */
  getMapRoot?: string;
  /**
   * Root URI of the <code>getFeatureInfo</code> request interface.  Use this option to override the
   * <code>GetFeatureInfo</code> URI that was returned in the capabilities object.
   * @since 2024.0
   */
  getFeatureInfoRoot?: string;
  /**
   * Indicate if the images should be generated as transparent images or not
   */
  transparent?: boolean;
  /**
   * A string that represents the required background color when images are
   * requested from the server (only applicable when transparent is false).
   * The color format is "0xRRGGBB",  where RGB values are represented
   * as hexadecimal numbers.  If a string is passed that does not adhere to
   * this format an exception will be thrown.
   */
  backgroundColor?: string;
  /**
   * The extent of the WMS model. This parameter has two purposes:
   * <div>
   *  1) the bounds defines the extent for which there is data available on the WMS server. For example, if there is
   *     only data available for an area covering the northern hemisphere, when panning around the southern
   *     hemisphere, LuciadRIA will not make requests to the server to retrieve image data. If you to not know the
   *     WMS extent, you should specify the <code>reference</code> instead.
   * </div>
   * <div>
   *  2) the reference of this bounds is the reference which will be used to request images from the server.
   *     By convention, this model's reference is equal to the reference of this bounds parameter. It is also
   *     important to ensure that the reference of this bounds is supported by the WMS server.  If you specify
   *     {@link bounds} you must not specify {@link reference}.
   * </div>
   */
  bounds?: Bounds;
  /**
   * The spatial reference in which this model is defined. You must only specify this parameter if you do not know the extent of the WMS
   * coverage; in that case the world bounds will be assumed.  If you specify
   * {@link bounds}, you can omit this parameter.
   */
  reference?: CoordinateReference;
  /**
   * The image format of the images to retrieve.
   * @default "image/png" if not defined.
   */
  imageFormat?: string;
  /**
   * The default MIME-type for <code>GetFeatureInfo</code> requests.
   * This can be overridden in the params of getFeatureInfoUrl.
   * "application/json" is used as default.
   */
  infoFormat?: string;
  /**
   * A URL to a Styled Layer Descriptor (SLD) that must be used to make a request.
   * This parameter conflicts with <code>sldBody</code>, only one of these two
   * parameters can be used at construction time.
   */
  sld?: string;
  /**
   * A Styled Layer Descriptor (SLD) XML Document that must be used to make a
   * request.  The value must not be URL-encoded.  This parameter conflicts with
   * the <code>sld</code> parameter, only one of these two parameters can be
   * used at construction time.
   */
  sldBody?: string;
  /**
   * Indicates whether this model should swap the axis ordering
   * of coordinates for the specified reference identifier(s) in WMS requests.
   * If undefined, the axis ordering dictated by the model reference is
   * respected. For each specified reference, the order will be reversed.
   * This is for example needed to get an EPSG:4326 BBOX value that is encoded
   * in longitude-latitude order instead of latitude-longitude.
   */
  swapAxes?: string[];
  /**
   * Custom request parameters to send along with WMS
   * <code>GetMap</code> and <code>GetFeatureInfo</code> request.
   * The object literal can contain simple key/value pairs
   * (strings, numbers, booleans). Values must not be URL encoded.
   */
  requestParameters?: HttpRequestParameters;
  /**
   * Dimension parameters to send along with WMS <code>GetMap</code> and
   * <code>GetFeatureInfo</code> requests.  Typical dimensions are
   * <code>TIME</code> and <code>ELEVATION</code>. The object literal
   * can contain simple key/value pairs.  Accepted values are strings,
   * numbers, booleans. Values must not be URL encoded.
   */
  dimensions?: object;
}
/**
 * Constructor options for {@link WMSImageModel}.
 */
export interface WMSImageModelConstructorOptions extends HttpRequestOptions {
  /**
   * Root URI of the <code>getMap</code> request interface.
   */
  getMapRoot: string;
  /**
   * The WMS layers that will be requested from the WMS service.
   */
  layers: string[];
  /**
   * Version of the WMS Server.
   */
  version?: WMSVersion;
  /**
   * Indicate if the images should be generated as transparent images or not
   */
  transparent?: boolean;
  /**
   * A string that represents the required background color when images are
   * requested from the server (only applicable when transparent is false).
   * The color format is "0xRRGGBB",  where RGB values are represented
   * as hexadecimal numbers.  If a string is passed that does not adhere to
   * this format an exception will be thrown.
   */
  backgroundColor?: string;
  /**
   * The extent of the WMS model. This parameter has two purposes:
   * <div>
   *  1) the bounds defines the extent for which there is data available on the WMS server. For example, if there is
   *     only data available for an area covering the northern hemisphere, when panning around the southern
   *     hemisphere, LuciadRIA will not make requests to the server to retrieve image data. If you to not know the
   *     WMS extent, you should specify the <code>reference</code> instead.
   * </div>
   * <div>
   *  2) the reference of this bounds is the reference which will be used to request images from the server.
   *     By convention, this model's reference is equal to the reference of this bounds parameter. It is also
   *     important to ensure that the reference of this bounds is supported by the WMS server.  If you specify
   *     {@link bounds} you must not specify {@link reference}.
   * </div>
   */
  bounds?: Bounds;
  /**
   * The spatial reference in which this model is defined. You must only specify this parameter if you do not know
   * the extent of the WMS coverage; in that case the world bounds will be assumed.  If you specify
   * {@link bounds}, you can omit this parameter.
   */
  reference?: CoordinateReference;
  /**
   * Root URI of the <code>getFeatureInfo</code> request interface.  If absent, <code>getMapRoot</code> will be used.
   * @since 2024.0
   */
  getFeatureInfoRoot?: string;
  /**
   * The WMS layers that will be queried for feature info from the WMS service.
   * If this is missing or an empty array, this model will not be queryable.
   * See {@link WMSImageLayer.getFeatureInfo} for how to make feature info requests.
   */
  queryLayers?: string[];
  /**
   * The styles to apply on the image when making a request. Each style corresponds
   * to a layer. Defaults to an empty array, meaning that no style names are
   * configured for the requested layers.
   */
  styles?: string[];
  /**
   * The image format of the images to retrieve.
   * @default "image/png" if not defined.
   */
  imageFormat?: string;
  /**
   * The default MIME-type for <code>GetFeatureInfo</code> requests.
   * This can be overridden in the params of getFeatureInfoUrl.
   * "application/json" is used as default.
   */
  infoFormat?: string;
  /**
   * A URL to a Styled Layer Descriptor (SLD) that must be used to make a request.
   * This parameter conflicts with <code>sldBody</code>, only one of these two
   * parameters can be used at construction time.
   */
  sld?: string;
  /**
   * A Styled Layer Descriptor (SLD) XML Document that must be used to make a
   * request.  The value must not be URL-encoded.  This parameter conflicts with
   * the <code>sld</code> parameter, only one of these two parameters can be
   * used at construction time.
   */
  sldBody?: string;
  /**
   * Indicates whether this model should swap the axis ordering
   * of coordinates for the specified reference identifier(s) in WMS requests.
   * If undefined, the axis ordering dictated by the model reference is
   * respected. For each specified reference, the order will be reversed.
   * This is for example needed to get an EPSG:4326 BBOX value that is encoded
   * in longitude-latitude order instead of latitude-longitude.
   */
  swapAxes?: string[];
  /**
   * Custom request parameters to send along with WMS
   * <code>GetMap</code> and <code>GetFeatureInfo</code> request.
   * The object literal can contain simple key/value pairs
   * (strings, numbers, booleans). Values must not be URL encoded.
   */
  requestParameters?: {
    [parameterName: string]: any;
  };
  /**
   * Dimension parameters to send along with WMS <code>GetMap</code> and
   * <code>GetFeatureInfo</code> requests.  Typical dimensions are
   * <code>TIME</code> and <code>ELEVATION</code>. The object literal
   * can contain simple key/value pairs.  Accepted values are strings,
   * numbers, booleans. Values must not be URL encoded.
   */
  dimensions?: object;
}
/**
 * Defines the desired WMS layers and (optionally) their layer styles.
 */
export interface WMSCapabilitiesLayerConfig {
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
 * <p>A <code>RasterImageModel</code> that can access an OGC WMS Server. Use this model instead of the
 * {@link WMSTileSetModel} if you want to visualize WMS images at an arbitrary scale
 * and with arbitrary extents. For example, if the WMS images contain text, the text may appear smaller
 * on the map than intended when using a <code>WMSTileSetModel</code>. You can avoid this by using this
 * <code>WMSImageModel</code> instead.</p>
 *
 * <p>Typically, you don't need to call the constructor yourself. Instead, use the factory methods {@link createFromURL}
 * or  {@link createFromCapabilities} to create an instance of this model.
 * The following example demonstrates how to set up a <code>WMSImageModel</code> to retrieve
 * WMS image data for a given service url and layer name:</p>
 *
 * ```javascript
 * [[include:model/image/WMSImageModelSnippets.ts_CREATE_FROM_URL]]
 * ```
 *
 * <p>If you want to access the WMS server's capabilities and explore the service metadata and available data sets,
 * you first have to create a {@link WMSCapabilities} instance. This
 * instance can also be to create a <code>WMSImageModel</code> afterwards:</p>
 *
 * ```javascript
 * [[include:model/image/WMSImageModelSnippets.ts_CREATE_FROM_CAPABILITIES]]
 * ```
 *
 * <h3>Limitations</h3>
 * <p>
 *   The limitations for single-image rasters also apply to this model, cf. {@link RasterImageLayer}.
 *   Most notably, {@link WebGLMap} does not support single-image raster models and layers.
 * </p>
 *
 * <h3>Supported versions</h3>
 * <p>
 *   LuciadRIA supports consuming WMS services that support version 1.1.1 and 1.3.0 of the OGC WMS specification.
 * </p>
 *
 * @since 2015.0
 */
export declare class WMSImageModel extends RasterImageModel {
  /**
   * Creates a WMS image model.
   * @param options the options for the {@link WMSImageModel}.
   *
   * @throws {@link ProgrammingError} if any of the following cases occurs: <ul>
   *   <li>
   *     The <code>reference</code> and <code>bounds</code> in the <code>options</code> are both passed and the references do not
   *     match.
   *   </li>
   *   <li>both <code>sld</code> and <code>sldBody</code> are specified in the options.</li>
   * </ul>
   */
  constructor(options?: WMSImageModelConstructorOptions);
  /**
   * Root URI of the <code>getMap</code> request interface.
   * @since 2021.0.04
   */
  get getMapRoot(): string;
  set getMapRoot(value: string);
  /**
   * Root URI of the <code>getMap</code> request interface.
   * @since 2024.0
   */
  get getFeatureInfoRoot(): string;
  set getFeatureInfoRoot(value: string);
  /**
   * <p>
   *   Indicates whether or not credentials should be included with HTTP requests.
   * </p>
   * See {@link GoogleImageModel.credentials} for more information.
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
   * See {@link GoogleImageModel.requestHeaders} for more information.
   * <p>
   *   The default value is <code>null</code>.
   * </p>
   */
  get requestHeaders(): HttpRequestHeaders | null;
  set requestHeaders(value: HttpRequestHeaders | null);
  /**
   * Reports whether this model supports GetFeatureInfo requests. This is only true if the queryLayers property is
   * filled in.
   */
  get queryable(): boolean;
  /**
   * Creates a WMS image model for the given layers and options. This is the recommended method to create a model
   * based on information provided by {@link WMSCapabilities}.
   *
   * @param wmsCapabilities The capabilities of the WMS server.
   * @param wmsLayers An array of object literals that defines the desired WMS layers and (optionally) their layer styles.
   *                             Each object literal has a mandatory <code>layer</code> property and an optional <code>style</code> property,
   *                             both of type <code>String</code>.
   * @param options the options for the WMS model
   * @since 2019.1
   * @throws {@link ProgrammingError} if any of the following cases occurs: <ul>
   *   <li>
   *     the <code>reference</code> or the reference of the <code>bounds</code> passed in the <code>options</code>.
   *     are not supported by the WMS server's capabilities.
   *   </li>
   *   <li>
   *     The <code>reference</code> and <code>bounds</code> in the <code>options</code> are both passed and the
   *     references do not match.
   *   </li>
   *   <li>both <code>sld</code> and <code>sldBody</code> are specified in the options.</li>
   * </ul>
   *
   * @return a <code>WMSImageModel</code> for the given parameters.
   */
  static createFromCapabilities(wmsCapabilities: WMSCapabilities, wmsLayers: WMSCapabilitiesLayerConfig[], options?: WMSImageModelCreateOptions): WMSImageModel;
  /**
   * Creates a WMS image model for the given layers and options. This is the recommended method to create a model
   * based on a given WMS server URL and layer name(s).
   *
   * @param url The URL of the WMS server.
   * @param wmsLayers An array of object literals that defines the desired WMS layers and (optionally) their layer styles.
   *                             Each object literal has a mandatory <code>layer</code> property and an optional <code>style</code> property,
   *                             both of type <code>String</code>.
   * @param options the options for the WMS model
   * @since 2019.1
   *
   * @return a promise for a <code>WMSImageModel</code> for the given parameters.
   *         The promise is rejected if the model creation fails.
   */
  static createFromURL(url: string, wmsLayers: WMSCapabilitiesLayerConfig[], options?: WMSImageModelCreateOptions): Promise<WMSImageModel>;
  /**
   * <p>
   * The WMS layers, specified as an array of strings. Each string is a layer name identifier.
   * </p>
   * <p>
   * These layers are not the same as a {@link Layer}. They are the layers exposed
   * by the WMS server and which are listed in the capabilities document of the WMS server.
   * </p>
   * <p>
   * This layers array must be considered as an immutable property.
   * This means that to add or to remove layers, you will need to reassign this property again.
   * Directly removing elements from the array, or directly adding elements to the array, without
   * resetting the property will have no effect.
   * </p>
   * <p>
   * The order of the layers in the array corresponds to the rendering order of the layers by the
   * WMS server.
   * </p>
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * </p>
   */
  get layers(): string[];
  set layers(layers: string[]);
  /**
   * Indicates whether the ImageModel will request transparent tiles from the server or not
   */
  get transparent(): boolean;
  set transparent(val: boolean);
  /**
   * The background color the WMS server must use when generating the WMS image.  Note that this option
   * is only considered by the server when the {@link WMSImageModel.transparent}
   * property is false. The backgroundColor is a string that must be formatted as "0xRRGGBB", where RGB values are
   * represented as hexadecimal values.  If you try to assign a string that does not adhere to this format an
   * exception will be thrown.
   */
  get backgroundColor(): string | null;
  set backgroundColor(val: string | null);
  /**
   * <p>The WMS layers that will be queried. These are the layers that will be used in the <code>GetFeatureInfo</code>
   *   requests performed by the {@link WMSImageLayer.getFeatureInfo} method.</p>
   * <p>The query layers are specified as an array of strings. Each string is a layer name identifier. </p>
   * <p>
   * This queryLayers array must be considered as an immutable property.
   * This means that to add or to remove layers, you will need to reassign this property again.
   * Directly removing elements from the array, or directly adding elements to the array, without
   * resetting the property will have no effect.
   * </p>
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * </p>
   */
  get queryLayers(): string[];
  set queryLayers(queryLayers: string[]);
  /**
   * <p>
   * Custom request parameters to send along with WMS <code>GetMap</code> and <code>GetFeatureInfo</code> request.
   * The object literal can contain simple key/value pairs.  If you try to configure request parameters that
   * are part of the WMS standard, a {@link ProgrammingError} will be thrown.  For
   * example, adding a "layers" request parameter is not allowed.  Accepted values are strings, numbers and booleans.
   * A {@link ProgrammingError} will be thrown if values of another type are used.
   * Values must not be URL encoded.
   * </p>
   * <p>
   * Assignments of other values than object literals to <code>requestParameters</code> will throw an Error.  Clearing
   * the parameters can be done by assigning <code>null</code> or an empty object literal to
   * <code>requestParameters</code>.  Assigning to this property will automatically trigger a refresh of the
   * visualization on the map.
   * </p>
   * @since 2016.1
   */
  get requestParameters(): HttpRequestParameters | null;
  set requestParameters(value: HttpRequestParameters | null);
  /**
   * The named styles to apply on the server when making a request.  The style names in the array apply to the
   * respective {@link layers}.  Specifying a style name for a layer is
   * optional; if you do not wish to specify a style name for a particular layer, you can omit the entry for that
   * layer or pass an empty string in the <code>styles</code> array.  The <code>STYLES</code> request parameter is
   * mandatory in a WMS request, but can be empty in case no <code>styles</code> are defined.
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * @since 2016.1
   */
  get styles(): string[];
  set styles(value: string[]);
  /**
   * A url to a Styled Layer Descriptor that must be passed when making a request.  This corresponds to the SLD
   * request parameter in the GetMap request. If you assign to this value, the value of the sldBody property,
   * if any, will be reset to null.
   *
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * @since 2016.1
   */
  get sld(): string | null;
  set sld(value: string | null);
  /**
   * the Styled Layer Descriptor to pass when making a request.  This corresponds to the <code>SLD_BODY</code>
   * request parameter in the <code>GetMap</code> request.  The SLD must not be URL encoded.
   * <p>
   * If you assign to this value, the value of the sldBody property, if any, will be reset to null.
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * @since 2016.1
   */
  get sldBody(): string | null;
  set sldBody(value: string | null);
  /**
   * <p>
   * Dimension parameters to send along with WMS <code>GetMap</code> and <code>GetFeatureInfo</code> request.
   * Typical dimensions are <code>TIME</code> and <code>ELEVATION</code>.
   * </p>
   * <p>
   * The object literal can contain simple key/value pairs.  Dimension names will be prefixed with "DIM_" in the
   * WMS requests, if this is not already the case.  The dimension names <code>TIME</code> and <code>ELEVATION</code>
   * will never be prefixed.  Accepted values are strings, numbers, booleans.
   * A {@link ProgrammingError} will be thrown if values of another type are used.
   * Values must not be URL encoded.  Assigning other values than object literals to <code>dimensions</code> will
   * throw a {@link ProgrammingError}.
   * </p>
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * </p>
   * <p>
   * The example below configures a WMSImageModel to request temperature data on the 1st of july 2016,
   * at ground level.
   * </p>
   *
   * ```javascript
   * wmsImageModel.dimensions = {
   *   TIME: "2016-07-01T12:00:00.000Z",
   *   ELEVATION: 0
   * };
   * ```
   *
   * @since 2016.1
   *
   */
  get dimensions(): object | null;
  set dimensions(value: object | null);
  get bounds(): Bounds;
}