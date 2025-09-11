/**
 * An enumeration of reference types. For the different coordinate types used by those references, check {@link CoordinateType}.
 */
export declare enum ReferenceType {
  /**
   * A geodetic reference system is a reference based on a geodetic datum.
   * (x,y,z) coordinates in these references correspond with longitude, latitude and height values,
   * respectively. Longitude and latitude values should be expressed in degrees, height values in meters.
   * The developers guide contains a paragraph explaining the basics of geodetic references.
   */
  GEODETIC = 1,
  /**
   * A grid reference is a reference that
   * contains the relation between (longitude,latitude, height) coordinates
   * and cartesian (x, y, z) coordinates. (x, y) is a regional Easting-Northing pair
   * while z is equal to the original height.
   * <ul>
   * <li>The Easting coordinate (x) is positive for East and negative for West.
   * <li>The Northing coordinate (y) is positive for North and negative for South.
   * </ul>
   */
  GRID = 2,
  /**
   * <p>A cartesian reference that can be used as a model reference or world reference.</p>
   *
   * This reference can be used to specify any non-geospatial 2D X/Y plane or 3D X/Y/Z volume.
   */
  CARTESIAN = 3,
  /**
   * A geocentric reference is a reference based on a geodetic datum. Coordinates are expressed
   * in (x,y,z) with regard to the center of the ellipsoid on which the geodetic datum is based.
   * See the developers guide for a more elaborate explanation on geocentric references.
   */
  GEOCENTRIC = 4,
  /**
   * <p>A topocentric reference is a geocentric reference that is defined by a
   * geodetic datum and a lon-lat-height point that defines the origin of the
   * topocentric coordinate system of this reference.</p>
   *
   * <p>A topocentric coordinate system is a right-handed cartesian coordinate system with the following properties:</p>
   * <ul>
   *   <li>Its origin is defined by a lon-lat-height point on the ellipsoid.</li>
   *   <li>The y-axis is directed northwards and aligned to intersect with the polar rotational axis of the ellipsoid.</li>
   *   <li>The x-axis if directed eastwards.</li>
   *   <li>The x-y plane is tangential to the ellipsoid at the origin.</li>
   *   <li>The z-axis is perpendicular to the ellipsoid at the origin, and points outwards. In other words, the z-axis is
   *   perpendicular to the x-y plane.</li>
   * </ul>
   *
   * <p>This reference is also referred as an ENU (East-North-Up) projection.</p>
   */
  TOPOCENTRIC = 5,
}