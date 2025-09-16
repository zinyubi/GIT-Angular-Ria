import { OGCCapabilitiesContactInformation, OGCCapabilitiesKeywords } from "./common/OGCCapabilities.js";
import { WMTSCapabilitiesLayer } from "./WMTSCapabilitiesLayer.js";
import { WMSVersion } from "../../ogc/WMSVersion.js";
import { HttpRequestHeaders, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
import { WMTSRequestEncoding } from "../tileset/WMTSRequestEncoding.js";
/**
 * Describes WMTS service metadata. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesService {
  /**
   * A human-readable title of the WMTS server.
   */
  title: string;
  /**
   * A description of the WMTS server.
   */
  abstract: string;
  /**
   * List of keywords that describe the WMTS server.
   */
  keywords: OGCCapabilitiesKeywords[];
  /**
   * Reference to the web site of the WMTS server provider.
   */
  url: string;
  /**
   * Information about a contact person for the WMTS server.
   */
  contactInformation: OGCCapabilitiesContactInformation;
  /**
   * Fees associated with the use of the WMTS server.
   */
  fees: string;
}
/**
 * Options for {@link WMTSCapabilities.fromURL}.
 *
 * @since 2023.1
 */
export interface WTMSCapabilitiesFromURLOptions {
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
   * It is an object literal mapping with parameter names as keys and parameter values as values.
   */
  requestParameters?: HttpRequestParameters | null;
  /**
   * Indicates the preferred encoding of the <code>GetCapabilities</code> WMTS operation request.
   * When creating/getting WMTSCapabilities, the <code>preferredRequestEncoding</code> is used if it is defined,
   * else an appropriate request encoding from within the encoding values defined in <code>WMTSRequestEncoding</code>
   * is selected based on the URL of the request (for example, an XML extension indicates it is probably REST conformant).
   *
   * @since 2024.1
   */
  preferredRequestEncoding?: WMTSRequestEncoding;
}
/**
 * Contains functionality to parse and access the capabilities of an OGC WMTS server. All defined properties are read-only.
 * If you want to visualize data from a WMTS server, you need to create a model; please refer to
 * {@link WMTSTileSetModel} for more information.
 * @since 2019.1
 */
export declare class WMTSCapabilities {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Creates WMTS capabilities for the given URL and options.
   * @param url The location of the WMTS service endpoint.
   * @param options An options object literal.
   * @return The WMTS capabilities for the given URL and options. The promise is rejected if no supported version at
   * both sides can be negotiated or if connecting to the URL fails.
   */
  static fromURL(url: string, options?: WTMSCapabilitiesFromURLOptions): Promise<WMTSCapabilities>;
  /**
   * The WMTS version of the capabilities.
   */
  get version(): string;
  /**
   * General information about the WMTS server.
   */
  get service(): WMTSCapabilitiesService;
  /**
   * A document version number for the content defined in the capabilities.
   */
  get updateSequence(): string;
  /**
   * The list of layers offered by the WMTS server.
   */
  get layers(): WMTSCapabilitiesLayer[];
}