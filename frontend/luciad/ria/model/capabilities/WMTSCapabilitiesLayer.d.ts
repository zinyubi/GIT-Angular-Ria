import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { OGCCapabilitiesKeywords } from "./common/OGCCapabilities.js";
import { WMTSCapabilitiesTileMatrixSet } from "./WMTSCapabilitiesTileMatrixSet.js";
/**
 * Describes a WMTS layer style. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesLayerStyle {
  /**
   * Human-readable title of the WMTS layer style.
   */
  title: string;
  /**
   * Describes the WMTS layer style.
   */
  abstract: string;
  /**
   * List of keywords that describe the WMTS layer style.
   * The keywords are grouped into one or more {@link OGCCapabilitiesKeywords} instances,
   * according to their (optional) {@link OGCCapabilitiesKeywords.type type}.
   */
  keywords: OGCCapabilitiesKeywords[];
  /**
   * Unique identifier of the WMTS layer style.
   */
  identifier: string;
  /**
   * Indicates whether the WMTS layer style is the default.
   */
  isDefault: boolean;
  /**
   * List of legends for the layer style.
   */
  legends: WMTSCapabilitiesLayerLegend[];
}
/**
 * Describes an image representing a layer style legend. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesLayerLegend {
  /**
   * The URL from which the legend image can be retrieved.
   */
  url: string;
  /**
   * The format of the legend image.
   */
  format: string;
  /**
   * Minimum scale (inclusive) denominator for which this legend image is valid.
   */
  minScaleDenominator: number;
  /**
   * Maximum scale (exclusive) denominator for which this legend image is valid.
   */
  maxScaleDenominator: number;
  /**
   * Width of the legend image.
   */
  width: number;
  /**
   * Height of the legend image.
   */
  height: number;
}
/**
 * Represents a WMTS layer dimension. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesLayerDimension {
  /**
   * Human-readable title of the dimension.
   */
  title: string;
  /**
   * Description of the dimension.
   */
  abstract: string;
  /**
   * List of keywords describing the dimension.
   * The keywords are grouped into one or more {@link OGCCapabilitiesKeywords} instances,
   * according to their (optional) {@link OGCCapabilitiesKeywords.type type}.
   */
  keywords: OGCCapabilitiesKeywords[];
  /**
   * Unique identifier of the dimension.
   */
  identifier: string;
  /**
   * Units of measure of the dimensional axis.
   */
  unitsOfMeasure: string;
  /**
   * Default value of the dimension.
   */
  default: string;
  /**
   * Symbol of the unit in which the WMTS layer dimension values are expressed.
   */
  unitSymbol: string;
  /**
   * Indicates whether temporal data are normally kept current and that the request parameter TIME may include the
   * keyword “current” instead of an ending value.
   */
  current: boolean;
  /**
   * Available values for the dimension.
   */
  values: string[];
}
/**
 * Describes a resource URL. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesResourceUrl {
  /**
   * Format of the resource URL.
   */
  format: string;
  /**
   * Type of the resource URL.
   */
  resourceType: string;
  /**
   * Template of the resource URL.
   */
  template: string;
}
/**
 * Describes a layer offered by a WMTS server. All defined properties are read-only.
 * @since 2019.1
 */
export declare class WMTSCapabilitiesLayer {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Human-readable title of the WMTS layer.
   */
  get title(): string;
  /**
   * Description of the WMTS layer.
   */
  get abstract(): string;
  /**
   * List of keywords that describe the WMTS layer.
   * The keywords are grouped into one or more {@link OGCCapabilitiesKeywords} instances,
   * according to their (optional) {@link OGCCapabilitiesKeywords.type type}.
   */
  get keywords(): OGCCapabilitiesKeywords[];
  /**
   * Available tile formats for the WMTS layer.
   */
  get formats(): string[];
  /**
   * Unique identifier of the WMTS layer.
   */
  get identifier(): string;
  /**
   * List of available styles for the WMTS layer.
   */
  get styles(): WMTSCapabilitiesLayerStyle[];
  /**
   * Available feature info formats for the layer.
   */
  get infoFormats(): string[];
  /**
   * List of dimensions for the layer.
   */
  get dimensions(): WMTSCapabilitiesLayerDimension[];
  /**
   * The available tile matrix sets for the layer.
   */
  get tileMatrixSets(): WMTSCapabilitiesTileMatrixSet[];
  /**
   * A list of resource URLs for the layer.
   */
  get resourceUrls(): WMTSCapabilitiesResourceUrl[];
  /**
   * Returns the bounding box of this layer defined in the given reference. If the bounding box defined in this reference is not explicitly listed in the capabilities,
   * the first encountered bounding box defined in a supported reference (i.e., supported in {@link ReferenceProvider}
   * is used and transformed to the given reference. If no bounding box information in a supported reference can be found, null is returned.
   * @param reference the geographic reference in which the returned bounds needs to be defined
   * @return the bounding box of this layer defined in the given reference
   */
  getBounds(reference: CoordinateReference): Bounds | null;
}