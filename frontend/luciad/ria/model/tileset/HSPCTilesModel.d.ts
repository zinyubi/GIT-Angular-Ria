import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { CoordinateType } from "../../reference/CoordinateType.js";
import { Bounded } from "../../shape/Bounded.js";
import { Bounds } from "../../shape/Bounds.js";
import { OrientedBox } from "../../shape/OrientedBox.js";
import { Model } from "../Model.js";
import { HttpRequestHeaders, HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { ModelDescriptor } from "../ModelDescriptor.js";
/**
 * Constructor options for {@link HSPCTilesModel}.
 * @since 2024.0.02
 */
export interface CreateHSPCTilesModelOptions extends HttpRequestOptions {
  /**
   * An override for the model {@link CoordinateReference}.
   */
  reference?: CoordinateReference;
}
/**
 * A <code>ModelDescriptor</code> for HSPC data.
 * @since 2020.0
 */
export interface HSPCTilesModelDescriptor extends ModelDescriptor {
  /**
   * An optional property containing version information.
   */
  version?: string;
  /**
   * Indicates whether the dataset contains normal vectors.
   * If true, the point cloud can be displayed using normal orientation.
   * see <a href="articles://howto/ogc3dtiles/tuning_pointclouds.html#orientation_of_points">Orienting points</a>
   * for more details.
   * @since 2024.0
   */
  hasNormalData: boolean;
  /**
   * <p>An optional set of properties.</p>
   * <p>For HSPC versions 8 and up, these properties can be used for expression-based styling.
   * <p>Entries for which the role is known will exhibit the "role" property. Currently exposed roles are :
   *     <ul>
   *         <li>"color" : color [vec4]</li>
   *         <li>"normal" : Normal vector (facing direction of points) [vec3]</li>
   *         <li>"intensity" : intensity [number]</li>
   *         <li>"classification" : classification [number]</li>
   *         <li>"custom" : can be anything. If 3 custom values have "normal" in their property name, or if the property names are "Nx", "Ny" or "Nz", they will be identified as a normal vector.</li>
   *     </ul>
   *
   * <p> Statistics are sometimes available, which can be useful for styling.
   *   <ul>
   *     <li> <code>minimum</code> and <code>maximum</code> represent the range of the attribute. </li>
   *     <li> <code>histogram</code> contains information about the distribution of attribute values. <code>histogram.minimum</code>
   *          and <code>histogram.maximum</code> are the values of first and last element of the <code>histogram.distribution</code>. </li>
   *   </ul>
   *  These statistics are never available for color.
   *
   * <p> When available, the data type will also be listed. Possible types are :
   *     <ul>
   *         <li>"float32" : A 32-bit float</li>
   *         <li>"float64" : a 64-bit double</li>
   *         <li>"int32" : a 32-bit signed int</li>
   *         <li>"int16" : a 16-bit signed int</li>
   *         <li>"int8" : a 8-bit signed char</li>
   *         <li>"uint32" : a 32-bit unsigned int</li>
   *         <li>"uint16" : a 16-bit unsigned int</li>
   *         <li>"uint8" : a 8-bit unsigned char</li>
   *     </ul>
   * <p> When statistics are not available, these will give a hint about the possible range of values for a given attribute.
   *    For instance, uint8 data will only be in range 0-255, helping in designing an effective styling range.
   *
   * <p> "float64" are not directly supported in expressions, so they will be internally converted to 32 bits float.
   *    If <code>minimum</code> and <code>maximum</code> are available, they will be used to normalise the attribute in the [0.0 - 1.0] range
   *
   * <p> If an HSPC has an attribute without name, the role is used as the name.
   *
   * Example of what a descriptor can look like:
   *
   * ```json
   * "properties" : {
   *   "colorRGB" : {
   *     "role" : "color"
   *   },
   *   "I" : {
   *     "role" : "intensity",
   *     "type" : "float32"
   *   },
   *   "C" : {
   *     "role" : "classification",
   *     "type" : "uint8",
   *     "minimum": 1
   *     "maximum": 4
   *     "histogram" : {
   *       "distribution" : [0, 4, 20, 2, 1, 0, 0]
   *       "minimum": 0
   *       "maximum": 6
   *     }
   *   }
   * }
   * ```
   *
   */
  properties?: {
    [propertyName: string]: {
      role?: string;
      type?: string;
      minimum?: number;
      maximum?: number;
      histogram?: {
        distribution: number[];
        minimum: number;
        maximum: number;
      };
    };
  };
}
/**
 * An 3D tileset model connects to an HSPC dataset to retrieve tiles for a {@link TileSet3DLayer}.
 * Its constructor should not be called directly. Instead, use the static create method:
 * ```javascript
 * [[include:model/tileset/HSPCTilesModelSnippets.ts_CREATE_FROM_URL]]
 * ```
 *
 * <h3>Supported versions</h3>
 * <p>
 * HSPC version 22 or older is supported. HSPC Pack files are also supported.
 * </p>
 *
 * <h3>Limitations</h3>
 * <ul>
 *   <li>Datasets with all supported EPSG references are supported.  See the <i>projection-epsg</i> property in your <code>hspcInfo.json</code> file.</li>
 *   <li>We do recommend to process your HSPC data in EPSG:4978 (3D geocentric coordinates) for optimal performance.</li>
 *   <li>If the dataset has no georeference, it might still be loaded as geocentric based on a heuristic, as often the georeference information is missing.</li>
 *   <li>If the dataset has no georeference and the data looks non-referenced, you must use a transformation on your {@link TileSet3DLayer} to position the data in the world.</li>
 * </ul>
 */
export declare class HSPCTilesModel implements Model, Bounded {
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
   * <p>The URL of this HSPC Tiles tileset model.
   * It is the URL where the "tree.hspc" resides.</p>
   *
   * <p>For example, "http://datamonster.myvr.net/mMap/data/pointcloud/APR/SanFrancisco/tree.hspc".</p>
   */
  get url(): string;
  /**
   * The parameter string of model's URL.
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
  get modelDescriptor(): HSPCTilesModelDescriptor;
  /**
   * Creates an HSPC point cloud model for a given HSPC dataset.
   *
   * @param url The URI of the HSPC Tiles Model. It is the URL where the "tree.hspc" resides, for example
   * <code>http://datamonster.myvr.net/mMap/data/pointcloud/APR/SanFrancisco/tree.hspc</code>.
   *
   * @param options An object literal specifying options for the creation of the HSPC Tiles Model.
   * @return A promise for an HSPCTilesModel. If the model cannot be created then the promise is rejected with either an {@link RequestError} or an {@link UnknownIdentifierError} if the reference cannot be found.
   * @since 2020.0
   */
  static create(url: string, options?: CreateHSPCTilesModelOptions): Promise<HSPCTilesModel>;
}
/**
 * Creates an HSPC point cloud model for a given HSPC dataset.
 *
 * @param url The URI of the HSPC Tiles Model. It is the URL where the "tree.hspc" resides, for example
 * <code>http://datamonster.myvr.net/mMap/data/pointcloud/APR/SanFrancisco/tree.hspc</code>.
 * @param options An object literal specifying options for the creation of the HSPC Tiles Model.
 * @return A promise for an HSPCTilesModel. If the model cannot be created then the promise is rejected with either {@link RequestError}.
 * @since 2020.0
 */
export declare function createHSPCTilesModel(url: string, options?: CreateHSPCTilesModelOptions): Promise<HSPCTilesModel>;