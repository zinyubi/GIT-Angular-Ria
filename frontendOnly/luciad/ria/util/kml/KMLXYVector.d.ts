/**
 * Defines the units of measure that can be used with offset values.
 * @since 2021.0
 */
export declare enum KMLUnits {
  /** Floating-point offset, 0..1 */
  FRACTION = 0,
  /** Number of pixels from the bottom or left */
  PIXELS = 1,
  /** Number of pixels from the top or right */
  INSET_PIXELS = 2,
}
/**
 * Defines an xy pair and the units for them
 * @since 2021.0
 */
export interface KMLXYVector {
  /**
   * The number of pixels or percentage (where 1.0 means 100%) on the X-axis of a KML element.
   * See {@link KMLXYVector.xUnits}.
   */
  x: number;
  /**
   * The number of pixels or percentage (where 1.0 means 100%) on the Y-axis of a KML element.
   * See {@link KMLXYVector.yUnits}.
   */
  y: number;
  /** Defines the unit of measure for {@link KMLXYVector.x}. */
  xUnits: KMLUnits;
  /** Defines the unit of measure for {@link KMLXYVector.y}. */
  yUnits: KMLUnits;
}