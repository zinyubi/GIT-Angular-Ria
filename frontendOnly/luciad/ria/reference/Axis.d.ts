import { UnitOfMeasure } from "../uom/UnitOfMeasure.js";
/**
 * Represents an Axis in a coordinate system.  This Axis implementation is based on the "OpenGIS Abstract
 * Specification; Topic 2= Spatial referencing by coordinates".
 * @since 2013.0
 */
declare class Axis {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * The abbreviation used for this coordinate system axis.  Examples are "X" and "Y".
   *
   */
  readonly abbreviation: string;
  /**
   * Direction of this cooldinate system axis.  This direction is often approximate and intended
   * to provide a human interpretable meaning to the axis.
   *
   */
  readonly direction: Axis.Direction;
  /**
   * Unit of measure for this coordinate system axis.
   *
   */
  readonly unitOfMeasure: UnitOfMeasure;
  /**
   * The minimum value normally allowed for this axis, in the unit for the axis.  This value is optional and
   * is <code>null</code> if not specified.
   *
   */
  readonly minimumValue: number | null;
  /**
   * The maximum value normally allowed for this axis, in the unit for the axis.  This value is optional and
   * is <code>null</code> if not specified.
   */
  readonly maximumValue: number | null;
  /**
   * Meaning of axis value range specified by minimumValue and maximumValue.  For geodetic references this will
   * always be {@link Axis.RangeMeaning.WRAPAROUND WRAPAROUND}.  For other references
   * this property will be {@link Axis.RangeMeaning.EXACT EXACT}.
   *
   */
  readonly rangeMeaning: Axis.RangeMeaning | null;
}
declare namespace Axis {
  /**
   * The name of an axis in a coordinate system.
   */
  enum Name {
    /**
     * refers to the X-Axis in a coordinate system.
     */
    X = 0,
    /**
     * refers to the Y-Axis in a coordinate system.
     */
    Y = 1,
    /**
     * refers to the Z-Axis in a coordinate system.
     */
    Z = 2,
  }
  /**
   * Meaning of the axis value range, specified through minimumValue and maximumValue.  Note that minimumValue and
   * and maximumValue may not be defined.  This enumeration is based on Axis definition the OpenGIS Abstract
   * Specification; Topic 2= Spatial referencing by coordinates.
   */
  enum RangeMeaning {
    /**
     * Any value between and including minimumValue and maximumValue
     */
    EXACT = 1,
    /**
     * The axis is continuous with values wrapping around at the minimumValue and maximumValue.  Values with the
     * same meaning repeat modulo the difference between maximumValue and minimumValue.
     */
    WRAPAROUND = 2,
  }
  /**
   * The direction of positive increase in the coordinate value for a coordinate system.  This axis direction
   * enumeration is based on the Axis definition the OpenGIS Abstract Specification; Topic 2= Spatial referencing
   * by coordinates.
   */
  enum Direction {
    /**
     * Axis positive direction is north.
     */
    NORTH = 1,
    /**
     * Axis positive direction is approximately north-north-east.
     */
    NORTH_NORTH_EAST = 2,
    /**
     * Axis positive direction is approximately north-east.
     */
    NORTH_EAST = 3,
    /**
     * Axis positive direction is approximately east-north-east.
     */
    EAST_NORTH_EAST = 4,
    /**
     * Axis positive direction is π/2 radians clockwise from north.
     */
    EAST = 5,
    /**
     * Axis positive direction is approximately east-north-east.
     */
    EAST_SOUTH_EAST = 6,
    /**
     * Axis positive direction is approximately south-east.
     */
    SOUTH_EAST = 7,
    /**
     * Axis positive direction is approximately south-south-east.
     */
    SOUTH_SOUTH_EAST = 8,
    /**
     * Axis positive direction is π radians clockwise from north.
     */
    SOUTH = 9,
    /**
     * Axis positive direction is approximately south-south-west.
     */
    SOUTH_SOUTH_WEST = 10,
    /**
     * Axis positive direction is approximately south-west.
     */
    SOUTH_WEST = 11,
    /**
     * Axis positive direction is approximately west-south-west.
     */
    WEST_SOUTH_WEST = 12,
    /**
     * Axis positive direction is 3π/2 radians clockwise from north.
     */
    WEST = 13,
    /**
     * Axis positive direction is approximately west-north-west.
     */
    WEST_NORTH_WEST = 14,
    /**
     * Axis positive direction is approximately north-west.
     */
    NORTH_WEST = 15,
    /**
     * Axis positive direction is approximately north-north-west.
     */
    NORTH_NORTH_WEST = 16,
    /**
     * Axis positive direction is up relative to gravity.
     */
    UP = 17,
    /**
     * Axis positive direction is down relative to gravity
     */
    DOWN = 18,
    /**
     * Axis positive direction is in the equatorial plane from the centre of the modelled Earth
     * towards the intersection of the equator with the prime meridian.
     */
    GEOCENTRIC_X = 19,
    /**
     * Axis positive direction is in the equatorial plane from the centre of the modelled Earth
     * towards the intersection of the equator and the meridian π/2 radians eastwards from the prime meridian.
     */
    GEOCENTRIC_Y = 20,
    /**
     * Axis positive direction is from the centre of the modelled Earth parallel to its rotation axis
     * and towards its north pole.
     */
    GEOCENTRIC_Z = 21,
    /**
     * Axis positive direction is towards higher pixel column.
     */
    COLUMN_POSITIVE = 22,
    /**
     * Axis positive direction is towards lower pixel column.
     */
    COLUMN_NEGATIVE = 23,
    /**
     * Axis positive direction is towards higher pixel row.
     */
    ROW_POSITIVE = 24,
    /**
     * Axis positive direction is towards lower pixel row.
     */
    ROW_NEGATIVE = 25,
    /**
     * Axis positive direction is right in display.
     */
    DISPLAY_RIGHT = 26,
    /**
     * Axis positive direction is left in display.
     */
    DISPLAY_LEFT = 27,
    /**
     * Axis positive direction is towards top of approximately vertical display surface.
     */
    DISPLAY_UP = 28,
    /**
     * Axis positive direction is towards bottom of approximately vertical display surface.
     */
    DISPLAY_DOWN = 29,
  }
}
export { Axis };