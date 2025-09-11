import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { CoordinateType } from "../../reference/CoordinateType.js";
import { Bounded } from "../../shape/Bounded.js";
import { Bounds } from "../../shape/Bounds.js";
import { OrientedBox } from "../../shape/OrientedBox.js";
import { Model } from "../Model.js";
import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { ModelDescriptor } from "../ModelDescriptor.js";
import { AttributedTileSet, AttributionTileRegion } from "./AttributedTileSet.js";
import { Handle } from "../../util/Evented.js";
/**
 * Constructor options for {@link OGC3DTilesModel}.
 * @since 2024.0
 */
export interface CreateOGC3DTilesModelOptions extends HttpRequestOptions {
  /**
   * An override for the model {@link CoordinateReference}.
   */
  reference?: CoordinateReference;
}
/**
 * A <code>ModelDescriptor</code> for OGC 3D Tiles. This class contains some additional properties commonly found
 * in the metadata of an OGC 3D Tiles dataset.
 * The following additional (optional) properties are available in this model descriptor:
 * <ol>
 *  <li>assets: Contains information about the version of the specification as well as version information from
 *  the content producer.</li>
 *  <li>properties: Contains a list of property values that can be used for expression based styling. The values
 *  can optionally also contain range indications.</li>
 * </ol>
 * Example:
 *
 * ```json
 * {
 *  "asset" : {
 *  "version" : "1.0",
 *  "tilesetVersion" : "Luciad_Tileset_V1.0"
 * },
 * "properties" : {
 *    "Intensity" : {
 *     "minimum" : 0.0,
 *     "maximum" : 65535.0
 *    },
 *    "Classification" : {
 *     "minimum" : 2.0,
 *     "maximum" : 4.0
 *    },
 *    "ReturnNumber" : {
 *     "minimum" : 1.0,
 *     "maximum" : 7.0
 *    },
 *    "Height" : {
 *     "minimum" : 29.02975082397461,
 *     "maximum" : 116.85025024414062
 *    }
 *  }
 * ```
 * @since 2018.0
 */
export interface OGC3DTilesModelDescriptor extends ModelDescriptor {
  /**
   * <p>An optional property containing version information about the tileset.<p>
   * Example:
   *
   * ```json
   * {
   *    "asset" : {
   *      "version" : "1.0",
   *      "tilesetVersion" : "Luciad_Tileset_V1.0"
   *    }
   * }
   * ```
   */
  asset?: {
    version?: string;
    tilesetVersion?: string;
  };
  /**
   * <p>An optional set of property names with an optional minimum and maximum range.</p>
   * <p>Each property name indicates a value that can be used for expression based styling. The key of
   * the property is the name of the property. The value contains a minimum and maximum range. This is
   * information is useful when automatically generating UI styling options.</p>
   * Example:
   *
   * ```json
   * "properties" : {
   *   "Intensity" : {
   *    "minimum" : 0.0,
   *    "maximum" : 65535.0
   *   },
   *   "Classification" : {
   *    "minimum" : 2.0,
   *    "maximum" : 4.0
   *   },
   *   "ReturnNumber" : {
   *    "minimum" : 1.0,
   *    "maximum" : 7.0
   *   },
   *   "Height" : {
   *    "minimum" : 29.02975082397461,
   *    "maximum" : 116.85025024414062
   *   },
   *   "Temperature": {
   *     "minimum": -20,
   *     "maximum": 150,
   *     "default": 25,
   * }
   * ```
   *
   */
  properties?: {
    [propertyName: string]: {
      minimum?: number;
      maximum?: number;
      default?: number;
    };
  };
  /**
   * Indicates whether this TileSet3D contains point cloud components.
   *
   * @since 2024.0
   */
  hasPointCloud: boolean;
  /**
   * Indicates whether the dataset contains normal vectors.
   * If true, the point cloud can be displayed using normal orientation. see
   * <a href="articles://howto/ogc3dtiles/tuning_pointclouds.html#orientation_of_points">Orienting points</a>
   * for more details.
   *
   * @since 2024.0
   */
  hasNormalData: boolean;
  /**
   * Indicates whether this TileSet3D contains mesh components.
   *
   * @since 2024.0
   */
  hasMesh: boolean;
}
/**
 * An OGC tileset model connects to a 3D tile service to retrieve tiles for a {@link TileSet3DLayer}.
 * Its constructor should not be called directly. Instead, use the static create method:
 * ```javascript
 * [[include:model/tileset/OGC3DTilesModelSnippets.ts_CREATE_FROM_URL]]
 * ```
 * <h3>Supported versions</h3>
 *
 * <p>
 *   The current LuciadRIA OGC 3D Tiles model supports the OGC 3D Tiles 1.0 specification.
 *   It also partially supports the OGC 3D Tiles 1.1 specification.
 *   It explicitly supports:
 * </p>
 * <ul>
 *  <li>Decoding from the `tileset.json` file entry point, with full metadata support, including property values and ranges.</li>
 *  <li>Decoding from the `tileset.json` file entry point, when it is describing an implicit tile structure, making use of subtrees.</li>
 *  <li>B3DM/GLB/glTF payloads for the visualization of 3D meshes.</li>
 *  <li>Both glTF 1.0 and glTF 2.0 in the payload.</li>
 *  <li>Draco-compressed meshes in the glTF data.</li>
 *  <li>KTX2/CRN/WEBP/JPG/PNG images in the glTF data.</li>
 *  <li>All PBR shading properties of the glTF format.</li>
 *  <li>The following glTF extensions:
 *  <ul>
 *    <li>KHR_texture_transform</li>
 *    <li>KHR_mesh_quantization</li>
 *    <li>EXT_meshopt_compression</li>
 *    <li>EXT_mesh_features</li>
 *    <li>EXT_mesh_gpu_instancing</li>
 *    <li>EXT_structural_metadata</li>
 *  </ul>
 *  </li>
 *  <li>glTF models referencing multiple textures.</li>
 *  <li>PNTS/GLB/glTF payloads for the visualization of point clouds. A PNTS payload with Draco compression is also supported.</li>
 *  <li>Additive and Replace refinement for `tileset.json`.</li>
 *  <li>Styling and filtering of point cloud data sets with full expression language support for dynamic, GPU-based styling and filtering of point clouds.</li>
 *  <li>Quality management to trade off between visual quality and performance, through the quality factor setting in the API.</li>
 * </ul>
 * <p>The following limitations hold for OGC 3D Tiles:</p>
 * <ul>
 *   <li>Instanced 3D Model (I3DM) tiles are not supported.</li>
 *   <li>Composite Tile Model (CMPT or multiple-node glTF or multiple contents in OGC 3D Tiles 1.1) tiles are not supported.</li>
 *   <li>B3DM does not support animations.</li>
 *   <li>CRN images may only contain DXT1 compatible data.</li>
 *   <li>KTX2 images must be created from the Basis Universal Texture tool.</li>
 *   <li>Embedded binary textures are supported, but externally referenced textures are not.</li>
 *   <li>glTF materials extensions are not supported.</li>
 *   <li>Declarative Styling in `tileset.json` is not supported directly, but can be achieved using LuciadRIA expressions, based on the `ExpressionFactory`.</li>
 *   <li>Complex, hierarchical batch table properties are not supported.</li>
 *   <li>Metadata for subtrees (implicit tiling) is not supported.</li>
 *   <li>A payload with both 3D meshes and point clouds is not supported.</li>
 *   <li>In EXT_mesh_features, 'Feature ID by Texture' is not supported.</li>
 *   <li>In EXT_structural_metadata, 'Property Textures' and 'Multiple Feature IDs' are not supported.</li>
 * </ul>
 **/
export declare class OGC3DTilesModel implements Model, Bounded, AttributedTileSet {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * <p>
   *   Indicates whether credentials should be included with HTTP requests.
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
   * Override to provide attribution strings for your OGC3DTilesModel.
   * By default, this returns an empty array.
   *
   * @since 2024.0
   */
  getAttribution(_regions: AttributionTileRegion[]): string[];
  /**
   * Override to provide a attributions-logo for your OGC3DTilesModel.
   * By default, this returns null.
   *
   * @since 2023.1
   */
  getLogo(): string | null;
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
   * <p>The URL of this OGC 3D Tiles tileset model.
   * It is the URL where the root tileset.json resides, including "tileset.json" itself.</p>
   *
   * <p>For example, if tileset.json is located at "http://www.mytileset.com/ogc/dataset/tileset.json",
   * then the `url` is "http://www.mytileset.com/ogc/dataset/tileset.json".</p>
   */
  get url(): string;
  /**
   * The parameter string of model's URL.
   * @deprecated Please use {@link requestParameters}
   */
  get urlParams(): string;
  /**
   * <p>
   * Custom request parameters to send along with 3DTiles requests.
   * The object literal can contain simple key/value pairs. Accepted values are strings, numbers and booleans.
   * A {@link ProgrammingError} will be thrown if values of another type are used.
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
  /**
   * Bounds of the model, in the model reference. If the model has no reference, it will default to a cartesian 3D reference.
   */
  get bounds(): Bounds;
  /**
   * The orientedBox is a read-only attribute that contains a tight-fitting 3D box around the dataset.
   * The {@link OrientedBox} is defined in the same reference as this model.
   * @since 2020.0
   */
  get orientedBox(): OrientedBox;
  /**
   * The coordinate type of geometries in this model.
   **/
  get coordinateType(): CoordinateType;
  /**
   * The reference in which this model is defined.
   */
  get reference(): CoordinateReference;
  /**
   * The model descriptor of this model.
   */
  get modelDescriptor(): OGC3DTilesModelDescriptor;
  /**
   * Creates an OGC 3D Tiles Model for a given 3D tile service
   *
   * @param url The URI of the OGC 3D Tiles Model. It is the URL where the root tileset.json resides, including "tileset.json" itself.
   * @param options An object literal specifying options for the creation of the OGC 3D Tiles Model.
   * @return A promise for an OGC3DTilesModel. If the model cannot be created then the promise is rejected with either an {@link RequestError} or an {@link UnknownIdentifierError} if the reference cannot be found.
   */
  static create(url: string, options?: CreateOGC3DTilesModelOptions): Promise<OGC3DTilesModel>;
  /**
   * @see {@link AttributedTileSet.on}
   * @event AttributionChanged
   * @since 2024.0
   */
  on(event: "AttributionChanged", callback: () => void): Handle;
}
/**
 * Creates an OGC 3D Tiles Model for a given 3D tile service.
 *
 * @param url The URI of the OGC 3D Tiles Model. It is the URL where the root tileset.json resides, including "tileset.json" itself.
 * @param options An object literal specifying options for the creation of the OGC 3D Tiles Model.
 * @return A promise for an OGC3DTilesModel. If the model cannot be created then the promise is rejected with either {@link RequestError}.
 */
export declare function createOGC3DTilesModel(url: string, options?: HttpRequestOptions): Promise<OGC3DTilesModel>;