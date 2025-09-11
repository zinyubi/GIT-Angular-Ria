import { Bounds } from "../../shape/Bounds.js";
import { OGCCapabilitiesKeywords } from "./common/OGCCapabilities.js";
/**
 * A QName object is a JavaScript object that represents a qualified name as defined in the XML specifications.
 */
export interface QName {
  /**
   * The prefix.
   */
  prefix: string;
  /**
   * The namespace.
   */
  namespace: string;
  /**
   * The local part
   */
  localPart: string;
}
/**
 * Describes a feature type offered by a WFS server. All defined properties are read-only.
 *
 * @since 2019.1
 */
export declare class WFSCapabilitiesFeatureType {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Human-readable title of the WFS feature type.
   */
  readonly title: string | null;
  /**
   * Name that uniquely identifies the WFS feature type.
   */
  readonly name: string;
  /**
   * The reference in which the WFS feature type data is returned by default.
   */
  readonly defaultReference: string;
  /**
   * Additional references in which the WFS feature type data can be requested.
   */
  readonly otherReferences: string[];
  /**
   * List of keywords that describe the WFS feature type.
   * The keywords are grouped into one or more {@link OGCCapabilitiesKeywords} instances,
   * according to their (optional) {@link OGCCapabilitiesKeywords.type type}.
   */
  readonly keywords: OGCCapabilitiesKeywords[];
  /**
   * List of data formats in which the WFS feature type can be requested.
   */
  readonly outputFormats: string[];
  /**
   * Returns the bounding box list in WGS84
   * @returns the bounding box list in WGS84
   */
  getWGS84Bounds(): Bounds[];
}