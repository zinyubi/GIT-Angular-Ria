import { CoordinateReference } from "../../reference/CoordinateReference.js";
import { Bounds } from "../../shape/Bounds.js";
import { RasterDataType } from "../tileset/RasterDataType.js";
import { RasterSamplingMode } from "../tileset/RasterSamplingMode.js";
/**
 * Describes a coverage offered by a LuciadFusion LTS server. All defined properties are read-only.
 *
 * @since 2019.1
 */
declare class LTSCapabilitiesCoverage {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * Unique identifier of the coverage.
   */
  readonly id: string;
  /**
   * Type of the coverage.
   */
  readonly type: RasterDataType;
  /**
   * Human-readable name of the coverage.
   */
  readonly name: string;
  /**
   * Description of the coverage.
   */
  readonly abstract: string;
  /**
   * Name of the geographic reference of the coverage.
   */
  readonly referenceName: string;
  /**
   * The number of tile rows at the coarsest level.
   */
  readonly level0Rows: number;
  /**
   * The number of tile columns at the coarsest level.
   */
  readonly level0Columns: number;
  /**
   * The width of each individual tile in pixels.
   */
  readonly tileWidth: number;
  /**
   * The height of each individual tile in pixels.
   */
  readonly tileHeight: number;
  /**
   * The sampling mode of the coverage.
   */
  readonly samplingMode: RasterSamplingMode;
  /**
   * Returns the geographic reference in which this coverage is defined.
   */
  getReference(): CoordinateReference;
  /**
   * Returns the bounding box of this coverage, defined in the geographic reference returned by the
   * {@link getReference} method.
   */
  getBounds(): Bounds;
}
export { LTSCapabilitiesCoverage };