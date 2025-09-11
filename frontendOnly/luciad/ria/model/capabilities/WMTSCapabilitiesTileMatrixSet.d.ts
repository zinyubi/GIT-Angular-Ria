import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { OGCCapabilitiesKeywords } from "./common/OGCCapabilities.js";
/**
 * Describes a single tile matrix, which represents the tile structure at one level of detail in the tile matrix set. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesTileMatrix {
  /**
   * Human-readable title of the tile matrix.
   */
  title: string;
  /**
   * Description of the tile matrix.
   */
  abstract: string;
  /**
   * Name of the geographic reference of the tile matrix.
   */
  referenceName: string;
  /**
   * List of keywords describing the tile matrix.
   * The keywords are grouped into one or more {@link OGCCapabilitiesKeywords} instances,
   * according to their (optional) {@link OGCCapabilitiesKeywords.type type}.
   */
  keywords: OGCCapabilitiesKeywords[];
  /**
   * Unique identifier of the tile matrix.
   */
  identifier: string;
  /**
   * Scale denominator of the tile matrix.
   */
  scaleDenominator: number;
  /**
   * Top-left position of the tile matrix.
   */
  topLeftCorner: string;
  /**
   * Width of a tile in the tile matrix.
   */
  tileWidth: number;
  /**
   * Height of a tile in the tile matrix.
   */
  tileHeight: number;
  /**
   * Width of the tile matrix.
   */
  matrixWidth: number;
  /**
   * Height of the tile matrix.
   */
  matrixHeight: number;
  /**
   * Limits that apply to the tile matrix.
   */
  limits: WMTSCapabilitiesTileMatrixLimits;
}
/**
 * Describes the limits of a tile matrix. All defined properties are read-only.
 * @since 2019.1
 */
export interface WMTSCapabilitiesTileMatrixLimits {
  /**
   * Minimum tile row for which tiles are available in the tile matrix.
   */
  minTileRow: number;
  /**
   * Maximum tile row for which tiles are available in the tile matrix.
   */
  maxTileRow: number;
  /**
   * Minimum tile column for which tiles are available in the tile matrix.
   */
  minTileCol: number;
  /**
   * Maximum tile column for which tiles are available in the tile matrix.
   */
  maxTileCol: number;
}
/**
 * Describes a tile pyramid structure offered by a WMTS server. All defined properties are read-only.
 * @since 2019.1
 */
export declare class WMTSCapabilitiesTileMatrixSet {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Human-readable title of the tile matrix set.
   */
  get title(): string;
  /**
   * Description of the tile matrix set.
   */
  get abstract(): string;
  /**
   * List of keywords that describe the tile matrix set.
   */
  get keywords(): OGCCapabilitiesKeywords[];
  /**
   * Unique identifier of the tile matrix set.
   */
  get identifier(): string;
  /**
   * The well-known name that describes the structure of this tile matrix set, if applicable.
   * For instance, <code>urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible</code>.
   */
  get wellKnownScaleSet(): string;
  /**
   * The list of tile matrices in the tile matrix set.
   */
  get tileMatrices(): WMTSCapabilitiesTileMatrix[];
  /**
   * Name of the geographic reference in which this tile matrix set is defined.
   * @since 2019.1
   */
  get referenceName(): string;
  /**
   * Returns the geographic reference in which this tile matrix set is defined.
   * @return the geographic reference in which this tile matrix set is defined.
   */
  getReference(): CoordinateReference;
  /**
   * Returns the bounding box of this tile matrix set, defined in the geographic reference returned by the
   * {@link getReference} method.
   * @return the bounding box of this tile matrix set, defined in the geographic reference returned by the
   * {@link getReference} method.
   */
  getBounds(): Bounds | null;
}