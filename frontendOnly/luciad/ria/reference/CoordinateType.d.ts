/**
 * An enumeration of coordinate types
 */
export declare enum CoordinateType {
  /**
   * Coordinates specified in a geodetic coordinate system. Geodetic coordinates are spherical coordinates.
   * The coordinates represent longitude, latitude and optionally height above the spherical surface.
   */
  GEODETIC = 1,
  /**
   * Coordinates specified in a Cartesian coordinate system.
   * The coordinates represent values along the X (easting), Y (northing) and Z (height) axis
   * of the underlying reference system.
   */
  CARTESIAN = 2,
}