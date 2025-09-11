import { WFSCapabilitiesFeatureType } from "./WFSCapabilitiesFeatureType.js";
import { WFSCapabilitiesOperation } from "./WFSCapabilitiesOperation.js";
import { WFSCapabilitiesService } from "./WFSCapabilitiesService.js";
import { WFSVersion } from "../../ogc/WFSVersion.js";
import { HttpRequestHeaders, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
/**
 *  Options that can be used to create WFS capabilities with {@link WFSCapabilities.fromURL}
 */
export interface WFSCapabilitiesFromUrlOptions {
  /**
   * An array of WFS versions that the client supports for GetCapabilities requests.
   */
  allowedVersions?: WFSVersion[];
  /**
   * Indicates whether cross-site Access-Control requests should be
   * made using credentials such as cookies or authorization headers.
   */
  credentials?: boolean;
  /**
   * Request headers to include in the request. It is an object literal with
   * the header names as keys and the header values as values.
   */
  requestHeaders?: HttpRequestHeaders | null;
  /**
   * Optional additional (GET/URL) parameters to include in the request. It is an
   * object literal mapping with parameter names as keys and parameter values as values.
   */
  requestParameters?: HttpRequestParameters | null;
}
/**
 * Contains functionality to parse and access the capabilities of an OGC WFS server. All defined properties are read-only.
 * If you want to visualize data from a WFS server, you need to create a store; please refer to
 * {@link WFSFeatureStore} for more information.
 *
 * @since 2019.1
 */
export declare class WFSCapabilities {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The WFS version of the capabilities.
   */
  readonly version: WFSVersion;
  /**
   * General information about the WFS server.
   */
  readonly service: WFSCapabilitiesService;
  /**
   * A document version number for the content defined in the capabilities.
   */
  readonly updateSequence: number | string;
  /**
   * The list of feature types offered by the WFS server.
   */
  readonly featureTypes: WFSCapabilitiesFeatureType[];
  /**
   * The request operations supported by the WFS server.
   */
  readonly operations: WFSCapabilitiesOperation[];
  /**
   * Creates WFS capabilities for the given URL and options.
   *
   * @param url       The location of the WFS service endpoint.
   * @param options   The options that determine how the capabilities object is created.
   *
   * @returns The WFS capabilities for the given URL and options. The promise is rejected if
   *          no supported version at both sides can be negotiated or if connecting to the URL fails.
   */
  static fromURL(url: string, options?: WFSCapabilitiesFromUrlOptions): Promise<WFSCapabilities>;
}