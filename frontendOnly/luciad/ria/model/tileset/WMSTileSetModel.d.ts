import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { WMSCapabilities } from "../capabilities/WMSCapabilities.js";
import { WMSCapabilitiesLayerConfig } from "../image/WMSImageModel.js";
import { TileCoordinate } from "./TileCoordinate.js";
import { UrlTileSetModel } from "./UrlTileSetModel.js";
import { WMSVersion } from "../../ogc/WMSVersion.js";
import { RasterConfiguration } from "../RasterConfiguration.js";
/**
 * Constructor options for {@link WMSTileSetModel}
 */
export interface WMSTileSetModelConstructorOptions extends HttpRequestOptions, RasterConfiguration {
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
   *
   * @default "1.3.0"
   */
  version?: WMSVersion;
  /**
   * The image format of the images to retrieve from the WMS server.
   * @default "image/png"
   */
  imageFormat?: string;
  /**
   * Indicates if the images should be generated transparent or not.
   *
   * @default false
   */
  transparent?: boolean;
  /**
   * A string that represents the required background color when
   * images are requested from the server (only applicable when <code>transparent</code>
   * is false). The color format is "0xRRGGBB", where RGB values are
   * represented as hexadecimal numbers.  If a string is passed that
   * does not adhere to this format an exception will be thrown.
   */
  backgroundColor?: string;
  /**
   * The extent of the WMS model. This parameter has two purposes:
   * <ol>
   *  <li>the bounds defines the extent for which there is data available on the WMS server. For example, if there is only
   *  data available for an area covering the northern hemisphere,
   *  when panning around the southern hemisphere, LuciadRIA will not make requests to the server to retrieve image data.
   *  If you do not know the WMS extent, you must specify <code>reference</code> instead.
   * </li>
   * <li>
   * the reference of this bounds is the reference which will be used to request images from the server.
   * By convention, this model's reference is equal to the reference of this bounds parameter. It is also
   * important to ensure that the reference of this bounds is supported by the WMS server.  If you specify
   * <code>bounds</code> you must not specify <code>reference</code>.
   * </li>
   * </ol>
   */
  bounds?: Bounds;
  /**
   * The spatial reference in which this model is
   * defined.  You must only specify this parameter
   * if you do not know the extent of the WMS
   * coverage; in that case the world bounds will
   * be assumed.  If you specify
   * <code>bounds</code>, you can omit
   * this parameter.
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
   * See {@link WMSTileSetLayer.getFeatureInfo} for how to make feature info requests.
   */
  queryLayers?: string[];
  /**
   * The styles to apply on the image when making a request. Each style corresponds
   * to a layer. Defaults to an empty array, meaning that no style names are
   * configured for the requested layers.
   */
  styles?: string[];
  /**
   * The default MIME-type for <code>GetFeatureInfo</code> requests.
   * This can be overridden in the params of getFeatureInfoUrl.
   * "application/json" is used as default.
   */
  infoFormat?: string;
  /**
   * The number of levels contained in this tileset.  levelCount is 22 by
   * default.
   */
  levelCount?: number;
  /**
   * The number of tile columns at the coarsest level. level0Columns will
   * be computed automatically if not defined at construction time.  If you
   * do define level0Columns, you must also define level0Rows.
   */
  level0Columns?: number;
  /**
   * The number of tile rows at the coarsest level. level0Rows will be computed
   * automatically if not defined. if you define level0Rows, you must also define
   * level0Columns.
   */
  level0Rows?: number;
  /**
   * Indicates whether this model should swap the axis ordering
   * of coordinates for the specified reference identifier(s) in WMS requests.
   * If undefined, the axis ordering dictated by the  model reference is
   * respected. For each specified reference, the order will be reversed.
   * This is for example needed to get an EPSG:4326 BBOX value that is encoded
   * in longitude-latitude order instead of latitude-longitude.
   */
  swapAxes?: string[];
  /**
   * The width of each individual tile in pixels.  TileWidth will be computed
   * automatically if not defined.  If you define tileWidth, you must also define
   * tileHeight.
   */
  tileWidth?: number;
  /**
   * The height of each individual tile in pixels.  TileHeight will be
   *  computed automatically if not defined at construction time.  If you
   *  define tileHeight you must also define tileWidth.
   */
  tileHeight?: number;
  /**
   * A URL to a Styled Layer Descriptor (SLD) that must be used to make a request.
   *  This parameter conflicts with <code>sldBody</code>, only one of these two
   *  parameters can be used at construction time.
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
   * Custom request parameters to send along with WMS GetMap and
   * GetFeatureInfo request.  The object literal can contain simple
   * key/value pairs (strings, numbers, booleans).  Values must not
   * be URL encoded.
   */
  requestParameters?: any;
  /**
   * Dimension parameters to send along with WMS <code>GetMap</code> and
   * <code>GetFeatureInfo</code> requests.  Typical dimensions are
   * <code>TIME</code> and <code>ELEVATION</code>. The object literal
   * can contain simple key/value pairs.  Accepted values are strings,
   * numbers, booleans. Values must not be URL encoded.
   *
   * @default <code>null</code>
   */
  dimensions?: any;
  /**
   * When specified, {@link WMSTileSetModel.getTileURL } will replace the
   * <code>{s}</code> pattern in <code>getMapRoot</code> with values
   * from <code>subdomains</code>.  This will cause tile requests to
   * be spread across different subdomains.  Browsers limit the amount of
   * connections to a single domain.  Using <code>subdomains</code>
   * avoids hitting this limit.
   */
  subdomains?: string[];
}
export interface WMSTileSetModelCreateOptions extends HttpRequestOptions, RasterConfiguration {
  /**
   * Root URI of the <code>GetMap</code> request interface.  Use this option to override the <code>GetMap</code> URI
   * that was returned in the capabilities object.
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
   * The image format of the images to retrieve from the WMS server.
   *
   * @default "image/png"
   */
  imageFormat?: string;
  /**
   * Indicates if the images should be generated with transparency or not.
   *
   * @default true
   */
  transparent?: boolean;
  /**
   * A string that represents the required background color (BGCOLOR) when
   * images are requested from the server (only applicable when <code>transparent</code>
   * is false). The color format is "0xRRGGBB", where RGB values are
   * represented as hexadecimal numbers.  If a string is passed that
   * does not adhere to this format an exception will be thrown.
   */
  backgroundColor?: string;
  /**
   * The preferred extent of the WMS model. If not defined,
   * the bounds are automatically determined based on the layer bounds
   * information available in the WMS capabilities.
   * If defined, it has two purposes:
   * <ol>
   *  <li> it defines the extent for which data should be loaded.</li>
   *  <li> the reference of this bounds is the reference which will be used to request images from the server.
   *     By convention, this model's reference is equal to the reference of this bounds parameter. It is also
   *     important to ensure that the reference of this bounds is supported by the WMS server.  If you specify
   *     <code>bounds</code> you must not specify <code>reference</code>.
   *  </li>
   * </ol>
   */
  bounds?: Bounds;
  /**
   * The spatial reference in which this model is
   * defined.  If you specify
   * <code>bounds</code>, you can omit
   * this parameter. If this parameter and <code>bounds</code>
   * are both not defined, WGS 84 is used as default reference.
   */
  reference?: CoordinateReference;
  /**
   * A URL to a Styled Layer Descriptor (SLD) that must be used to make a request.
   * This parameter conflicts with <code>sldBody</code>, only one of these two
   * parameters can be used at construction time.
   */
  sld?: string;
  /**
   * A Styled Layer Descriptor (SLD) XML Document that must be used to make a
   * request.  The value must not be URL-encoded.  This parameter conflicts with
   * the <code>sld</code> parameter. Only one of these two parameters can be
   * used at construction time.
   */
  sldBody?: string;
  /**
   * Custom request parameters to send along with WMS GetMap and
   * GetFeatureInfo request. The object literal can contain simple
   * key/value pairs (strings, numbers, booleans).  Values must not
   * be URL-encoded.
   */
  requestParameters?: any;
  /**
   * Dimension parameters to send along with WMS <code>GetMap</code> and
   * <code>GetFeatureInfo</code> requests.  Typical dimensions are
   * <code>TIME</code> and <code>ELEVATION</code>. The object literal
   * can contain simple key/value pairs.  Accepted values are strings,
   * numbers, booleans. Values must not be URL-encoded.
   *
   * @default <code>null</code>
   */
  dimensions?: any;
  /**
   * The format to retrieve feature information (through
   * <code>GetFeatureInfo</code> requests) from the WMS server.
   *
   * @default "application/json"
   */
  infoFormat?: string;
  /**
   * Indicates whether this model should swap the axis ordering
   * of coordinates for the specified reference identifiers in WMS requests.
   * If undefined, the axis ordering dictated by the  model reference is
   * respected. For each specified reference, the order will be reversed.
   * This is needed to get an EPSG:4326 BBOX value that is encoded
   * in longitude-latitude order instead of latitude-longitude, for example.
   */
  swapAxes?: string[];
}
/**
 *
 * <p>A tileset model that can access an OGC WMS server. Because this model requests a map as a collection
 * of individual tiles, certain visualization artifacts may occur. For example, text may appear cut-off at the
 * border, or there may be slight pixellation effects when a tile is stretched or compressed to fit the screen.
 * To avoid these artifacts, please use a {@link WMSImageModel} instead. A <code>WMSTileSetModel</code>
 * is generally preferred over a <code>WMSImageModel</code> when the imagery shows continuous data, such as orthophotography
 * or elevation. Use a <code>WMSImageModel</code> when the imagery contains text or rasterized vector data.</p>
 *
 * <p>Typically, you don't need to call the constructor yourself. Instead, use the factory methods {@link createFromURL}
 * or  {@link createFromCapabilities} to create an instance of this model.
 * The following example demonstrates how to set up a <code>WMSTileSetModel</code> to retrieve
 * WMS image data for a given service url and layer name:</p>
 *
 * ```javascript
 * [[include:model/tileset/WMSTileSetModelSnippets.ts_CREATE_FROM_URL]]
 * ```
 *
 * <p>If you want to access the WMS server capabilities and explore the service metadata and available data sets,
 * you must create a {@link WMSCapabilities} instance first. You can also
 * use that instance to create a <code>WMSTileSetModel</code> afterwards:</p>
 *
 * ```javascript
 * [[include:model/tileset/WMSTileSetModelSnippets.ts_CREATE_FROM_CAPABILITIES]]
 * ```
 *
 * <h3>Supported versions</h3>
 * <p>
 *   LuciadRIA supports consuming WMS services that support version 1.1.1 and 1.3.0 of the OGC WMS specification.
 * </p>
 *
 * @since 2015.0
 */
export declare class WMSTileSetModel extends UrlTileSetModel {
  /**
   * Creates a WMS TileSet Model.  By default, the model will define a quad tree tile pyramid based on the
   * model bounds, and will use this structure to request images from the WMS server.
   * <p>
   * It is possible to configure the <code>WMSTileSetModel</code> tile structure by passing
   * <code>RasterTileSetModel</code> constructor parameters to the <code>WMSTileSetModel</code> constructor:
   * <code>tileWidth</code>, <code>tileHeight</code>, <code>level0Rows</code>, <code>level0Columns</code>,
   * <code>levelCount</code>.  If you define at least one of these parameters, the bounds of the model may be adapted
   * to match the aspect ratio of the tile pyramid.
   *
   * @param options the options to create this WMSTileSetModel with.
   *
   * @throws {@link ProgrammingError} if any of the following cases occurs: <ul>
   *   <li>
   *     <code>reference</code> and <code>bounds</code> are both passed in the <code>options</code> and the references do not
   *     match.
   *   </li>
   *   <li>both <code>sld</code> and <code>sldBody</code> are specified in the <code>options</code>.</li>
   * </ul>
   *
   */
  constructor(options: WMSTileSetModelConstructorOptions);
  /**
   * The base URL used to request tiles.  This is equivalent to {@link getMapRoot}.
   */
  get baseURL(): string;
  set baseURL(value: string);
  /**
   * Root URI of the <code>getMap</code> request interface.
   * @since 2024.0
   */
  set getMapRoot(value: string);
  get getMapRoot(): string;
  /**
   * Root URI of the <code>GetFeatureInfo</code> request interface
   * @since 2024.0
   */
  get getFeatureInfoRoot(): string;
  set getFeatureInfoRoot(value: string);
  /**
   * Reports whether this model supports GetFeatureInfo requests. This is only true if the protocol version is
   * '1.3.0' or later, and if the queryLayers property was filled in when constructing this model.
   */
  get queryable(): boolean;
  /**
   * Creates a tileset model for the given layers and options. This is the recommended method to create a model based on
   * information provided by {@link WMSCapabilities}.  This is the recommended method to create a model based on a
   * given WMS server URL and layer name(s).
   * @param  wmsCapabilities WMS capabilities
   * @param  wmsLayers An array of object literals that defines the desired WMS layers and (optionally) their layer styles.
   *                             Each object literal has a mandatory <code>layer</code> property which must contain a
   *                             {@link WMSCapabilitiesLayer}, and an optional <code>style</code> property
   *                             of type <code>String</code>.
   * @param options The options for the WMS model
   * @since 2019.1
   * @throws {@link ProgrammingError} if any of the following cases occurs: <ul>
   *   <li>
   *     the <code>reference</code> or the reference of the <code>bounds</code> passed in the <code>options</code>.
   *     are not supported by the WMS server's capabilities.
   *   </li>
   *   <li>
   *     <code>reference</code> and <code>bounds</code> are both passed in the <code>options</code> and the
   *     references do not match.
   *   </li>
   *   <li>both <code>sld</code> and <code>sldBody</code> are specified in the <code>options</code>.</li>
   *
   * </ul>
   *
   * @return  a <code>WMSTileSetModel</code> for the given parameters.
   */
  static createFromCapabilities(wmsCapabilities: WMSCapabilities, wmsLayers: WMSCapabilitiesLayerConfig[], options?: WMSTileSetModelCreateOptions): WMSTileSetModel;
  /**
   * Creates a tileset model for the given layers and options. This is the recommended method to create a model based on
   * a given WMS server URL and layer names. This is the recommended method to create a model based on a given WMS
   * server URL and layer name(s).
   * @param  url The URL of the WMS server.
   * @param  wmsLayers An array of object literals that defines the desired WMS layers and optionally their layer styles.
   *                             Each object literal has a mandatory <code>layer</code> property and an optional <code>style</code> property,
   *                             both of type <code>String</code>.
   * @param  options The options for the WMS model.
   * @since 2019.1
   *
   * @return  a <code>WMSTileSetModel</code> for the given parameters.
   *          The promise is rejected if the model creation fails.
   */
  static createFromURL(url: string, wmsLayers: WMSCapabilitiesLayerConfig[], options?: WMSTileSetModelCreateOptions): Promise<WMSTileSetModel>;
  getTileURL(baseURL: string, tile: TileCoordinate): string | null;
  /**
   * <p>
   * The WMS layers, specified as an array of strings. Each string is a layer name identifier.
   * </p>
   * <p>
   * These layers are not the same as a <code>luciad.view.Layer</code>. They are the layers exposed
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
   * <p>The WMS layers that will be queried. These are the layers that will be used in the <code>GetFeatureInfo</code>
   *   requests performed by the {@link WMSTileSetLayer.getFeatureInfo getFeatureInfo} method.</p>
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
   * Indicates whether the WMSTileSetModel will request transparent tiles from the server or not.
   */
  get transparent(): boolean;
  set transparent(val: boolean);
  /**
   * The background color the WMS server must use when generating the WMS images.  Note that this option
   * is only considered by the server when the {@link transparent}
   * property is false. The backgroundColor is a string that must be formatted as "0xRRGGBB", where RGB values are
   * represented as hexadecimal numbers.  If you try to assign a string that does not adhere to this format an
   * exception will be thrown.
   */
  get backgroundColor(): string | null;
  set backgroundColor(val: string | null);
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
   *
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
   *
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
   *
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
   *
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
   * Values must not be URL encoded. Assigning other values than object literals to <code>dimensions</code> will
   * throw a {@link ProgrammingError}.
   * </p>
   * <p>
   * Assigning to this property will automatically trigger a refresh of the visualization on the map.
   * </p>
   * <p>
   * The example below configures a WMSTileSet model to request temperature data on the 1st of july 2016,
   * at ground level.
   * </p>
   *
   * ```javascript
   * wmsTileSetModel.dimensions = {
   *   TIME: "2016-07-01T12:00:00.000Z",
   *   ELEVATION: 0
   * };
   * ```
   * @since 2016.1
   */
  get dimensions(): object | null;
  set dimensions(value: object | null);
}