import { OGCCapabilitiesContactInformation, OGCCapabilitiesKeywords } from "./common/OGCCapabilities.js";
/**
 * Describes WFS service metadata. All defined properties are read-only.
 *
 * @since 2019.1
 */
export interface WFSCapabilitiesService {
  /**
   * A human-readable title of the WFS server.
   **/
  readonly title: string;
  /**
   * A description of the WFS server.
   **/
  readonly abstract: string;
  /**
   * List of keywords that describe the WFS server.
   * The keywords are grouped into one or more {@link OGCCapabilitiesKeywords} instances,
   * according to their (optional) {@link OGCCapabilitiesKeywords.type type}.
   **/
  readonly keywords: OGCCapabilitiesKeywords[];
  /**
   * Reference to the web site of the WFS server provider.
   **/
  readonly url: string;
  /**
   * Information about a contact person for the WFS server.
   **/
  readonly contactInformation: OGCCapabilitiesContactInformation;
}