import { LTSCapabilitiesCoverage } from "./LTSCapabilitiesCoverage.js";
import { LTSCapabilitiesService } from "./LTSCapabilitiesService.js";
import { HttpRequestOptions, HttpRequestParameters } from "../../util/HttpRequestOptions.js";
/**
 * Options that can be used to create LTS capabilities with {@link LTSCapabilities.fromURL}
 */
export interface LTSCapabilitiesFromUrlOptions extends HttpRequestOptions {
  /**
   * An array of strings with the versions that the client supports.
   */
  allowedVersions?: string[];
  /**
   * Optional additional (GET/URL) parameters to include in the request. It is an object literal mapping with parameter
   * names as keys and parameter values as values.
   */
  requestParameters?: HttpRequestParameters | null;
}
/**
 * Contains functionality to parse and access the capabilities of a LuciadFusion LTS server. All defined properties are read-only.
 * If you want to visualize data from an LTS server, you need to create a model; please refer to
 * {@link FusionTileSetModel} for more information.
 *
 * @since 2019.1
 */
export declare class LTSCapabilities {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The LTS version of the capabilities.
   */
  readonly version: string;
  /**
   * The list of coverages offered by the LuciadFusion LTS server.
   */
  readonly coverages: LTSCapabilitiesCoverage[];
  /**
   * General information about the LuciadFusion LTS server.
   */
  readonly service: LTSCapabilitiesService;
  /**
   * A document version number for the content defined in the capabilities.
   */
  readonly updateSequence: string;
  /**
   * Creates LTS capabilities for the given URL and options.
   *
   * @param url       The location of the LTS service endpoint.
   * @param options   The options that determine how the capabilities object is created.
   *
   * @returns The LTS capabilities for the given URL and options. The promise is rejected if no supported version at
   *          both sides can be negotiated or if connecting to the URL fails.
   * @throws {@link !Error Error} if the capabilities cannot be retrieved.
   */
  static fromURL(url: string, options?: LTSCapabilitiesFromUrlOptions): Promise<LTSCapabilities>;
}