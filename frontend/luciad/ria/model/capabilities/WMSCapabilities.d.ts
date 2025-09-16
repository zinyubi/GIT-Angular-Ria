import { WMSCapabilitiesLayer } from "./WMSCapabilitiesLayer.js";
import { OGCCapabilitiesContactInformation } from "./common/OGCCapabilities.js";
import { WMSVersion } from "../../ogc/WMSVersion.js";
import { HttpRequestHeaders, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
/**
 * Describes a request operation supported by the WMS server. All defined properties are read-only.
 * @since 2019.1
 **/
export interface WMSCapabilitiesOperation {
  /**
   * The name of the request operation.
   **/
  name: string;
  /**
   * The available output formats for the request operation.
   **/
  supportedFormats: string[];
}
/**
 * Describes WMS service metadata. All defined properties are read-only.
 * @since 2019.1
 **/
export interface WMSCapabilitiesService {
  /**
   * Name of the WMS server.
   **/
  name: string;
  /**
   * A human-readable title of the WMS server.
   **/
  title: string;
  /**
   * Description of the WMS server.
   **/
  abstract: string;
  /**
   * List of keywords that describe the WMS server.
   **/
  keywords: string[];
  /**
   * Reference to the web site of the WMS server provider.
   **/
  url: string;
  /**
   * Information about a contact person for the WMS service.
   **/
  contactInformation: OGCCapabilitiesContactInformation;
  /**
   * Fees associated with the use of the WMS service.
   **/
  fees: string;
  /**
   * Access constraints associated with the use of the WMS service.
   **/
  accessConstraints: string;
  /**
   * A positive integer indicating the maximum number of layers a client is permitted to include in a single request.
   * If a value is null, the server imposes no limit.
   **/
  layerLimit: number;
  /**
   * Positive integer indicating the maximum width that client is permitted to include in a single request.
   * If a value is null, the server imposes no limit on the corresponding parameter.
   **/
  maxWidth: number;
  /**
   * Positive integer indicating the maximum height that client is permitted to include in a single request.
   * If a value is null, the server imposes no limit on the corresponding parameter.
   **/
  maxHeight: number;
}
/**
 * Describes user defined symbolization supported by the WMS server. All defined properties are read-only.
 * @since 2021.0
 **/
export interface WMSCapabilitiesUserDefinedSymbolization {
  /**
   * Indicates whether the WMS server supports SLD.
   **/
  supportSLD: boolean;
  /**
   * Indicates whether the WMS server supports UserLayers.
   **/
  userLayer: boolean;
  /**
   * Indicates whether the WMS server supports UserStyles.
   **/
  userStyle: boolean;
  /**
   * Indicates whether the WMS server supports Remotes WFS servers.
   **/
  remoteWFS: boolean;
}
/**
 * Options for {@link WMSCapabilities.fromURL}.
 *
 * @since 2023.1
 */
export interface WMSCapabilitiesFromURLOptions {
  /**
   * An array of strings with versions that the client supports.
   */
  allowedVersions?: WMSVersion[];
  /**
   * Indicates whether or not cross-site Access-Control requests should be
   * made using credentials such as cookies or authorization headers.
   *
   * @default false
   */
  credentials?: boolean;
  /**
   * Request headers to include in the request.
   * It is an object literal with the header names as keys and the header values as values.
   */
  requestHeaders?: HttpRequestHeaders | null;
  /**
   * Optional additional (GET/URL) parameters to include in the request.
   * It is an object literal with parameter names as keys and parameter values as values.
   */
  requestParameters?: HttpRequestParameters | null;
}
/**
 * Contains functionality to parse and access the capabilities of an OGC WMS server. All defined properties are read-only.
 * If you want to visualize data from a WMS server, you need to create a model; please refer to
 * {@link WMSTileSetModel} for more information.
 * @since 2019.1
 */
export declare class WMSCapabilities {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Creates WMS capabilities for the given URL and options.
   * @param  url The location of the WMS service endpoint.
   * @param options An options object literal
   * @return The WMS capabilities for the given URL and options.
   *             The promise is rejected if no supported version at both sides can be negotiated or if connecting to the URL fails.
   */
  static fromURL(url: string, options?: WMSCapabilitiesFromURLOptions): Promise<WMSCapabilities>;
  /**
   * The WMS version of the capabilities.
   */
  get version(): WMSVersion;
  /**
   * General information about the WMS server.
   */
  get service(): WMSCapabilitiesService;
  /**
   * A document version number for the content defined in the capabilities.
   */
  get updateSequence(): string;
  /**
   * The list of layers offered by the WMS server.
   */
  get layers(): WMSCapabilitiesLayer[];
  /**
   * The request operations supported by the WMS server.
   */
  get operations(): WMSCapabilitiesOperation[];
  /**
   * The list of available exception reporting formats.
   */
  get exceptionFormats(): string[];
  /**
   * Information about user defined symbolization supported by the WMS server.
   * @since 2021.0
   **/
  get userDefinedSymbolization(): WMSCapabilitiesUserDefinedSymbolization;
}