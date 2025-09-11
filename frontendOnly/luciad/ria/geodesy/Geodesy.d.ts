import { Point } from "../shape/Point.js";
import { Shape } from "../shape/Shape.js";
import { CoordinateReference } from "../reference/CoordinateReference.js";
import { LineType } from "./LineType.js";
/**
 * Options for {@link Geodesy.shortestDistanceToLine}.
 *
 * @since 2023.1
 */
export interface ShortestDistanceToLineOptions {
  /**
   * If <code>false</code>, the shortest distance will be calculated for the whole line.
   * Otherwise it will only be calculated for the line segment <code>linePointOne-linePointTwo</code>.
   * @default <code>false</code>
   */
  clipToSegment?: boolean;
}
/**
 * Provides geodesy calculations. Use the factory methods in the {@link GeodesyFactory} module
 * to create instances of this interface. For boolean operations on shapes see the {@link ConstructiveGeometryFactory} module.
 */
export interface Geodesy {
  /**
   * The reference in which this geodesy performs its calculations
   **/
  reference: CoordinateReference | null;
  /**
   * Calculates the distance between two points in meters in 2D space.
   * <p/>
   * If the reference of a point is
   * <code>null</code> it will be assumed to be the same as this instance's
   * calculation reference.
   *
   * @param point1   the first point
   * @param point2   the second point
   * @param lineType the type of line along which to calculate the distance ({@link LineType.SHORTEST_DISTANCE} if not specified)
   *
   * @return the distance between the two points in meters
   */
  distance(point1: Point, point2: Point, lineType?: LineType): number;
  /**
   * Calculates the distance between two points in 3D space expressed in meters (Cartesian Geodesy only).
   * <p/>
   * This method can be used only on Geodesy instances created by {@link createCartesianGeodesy}.
   * Invoking this method on other types of Geodesy results in throwing a {@link ProgrammingError}.
   *
   *
   * @param point1   the first point
   * @param point2   the second point
   * @param lineType the type of line along which to calculate the distance ({@link LineType.SHORTEST_DISTANCE} if not specified)
   *
   * @return the distance between two points in 3D space expressed in meters.
   * @throws {@link ProgrammingError} if method invoked on incorrect Geodesy instance.
   */
  distance3D(point1: Point, point2: Point, lineType?: LineType): number;
  /**
   * Calculates the forward azimuth between two points.
   * <p/>
   * If the reference of a point is null it will be assumed to be the same as this instances
   * calculation reference.
   *
   * @param point1   the first point
   * @param point2   the second point
   * @param lineType the type of line along which to calculate the distance ({@link LineType.SHORTEST_DISTANCE} if not specified)
   *
   * @return the forward azimuth between the two points in degrees
   */
  forwardAzimuth(point1: Point, point2: Point, lineType?: LineType): number;
  /**
   * Interpolate a point at the fraction of the segment defined by the two points.
   *
   * If the reference of the input point(s) is null it will be assumed to be the same as this instance's
   * calculation reference.
   * @param startPoint  the starting point
   * @param endPoint the end point.
   * @param fraction a fraction between 0.0 and 1.0.
   * @param lineType the line type along which to compute the point ({@link LineType.SHORTEST_DISTANCE} if not specified)
   *
   * @return an interpolated point specified with respect to the calculation reference
   */
  interpolate(startPoint: Point, endPoint: Point, fraction: number, lineType?: LineType): Point;
  /**
   * Computes the point at a given distance and azimuth from the given point.
   *
   * If the reference of the input point(s) is null it will be assumed to be the same as this instance's
   * calculation reference.
   *
   * If the distance is negative, this will result in an interpolation in the opposite direction.
   *
   * @param point the starting point
   * @param distance the distance in meters
   * @param azimuth the azimuth (this is an angle in degrees)
   * @param lineType the line type along which to compute the point ({@link LineType.SHORTEST_DISTANCE} if not specified)
   *
   * @return an interpolated point specified with respect to the calculation reference
   */
  interpolate(point: Point, distance: number, azimuth: number, lineType?: LineType): Point;
  /**
   * Calculates the shortest distance from point <code> fromPoint </code> to the line  <code> linePointOne-linePointTwo </code>.
   * Puts the result in the given point as a side effect, and returns the distance from <code>fromPoint</code> to that calculated point.
   *
   * @param fromPoint The point from which to calculate the distance to the line.
   * @param linePointOne The first point of the line
   * @param linePointTwo The second point of the line
   * @param options The options for the calculation
   * @param resultPointSFCT Point on the line <code>linePointOne-linePointTwo</code> that
   * is calculated to be at the shortest distance from <code>fromPoint</code>. This point may be clipped onto the
   * line segment depending on the value of <code>clipToSegment</code> property in the <code>options</code>.
   *
   * @return The distance to the line (or line segment) in meters
   */
  shortestDistanceToLine(fromPoint: Point, linePointOne: Point, linePointTwo: Point, options: ShortestDistanceToLineOptions, resultPointSFCT: Point): number;
  /**
   * Calculates the area of the given shape.
   *
   * Beware: this method calculates the 2D area of the passed shape. I.e. it ignore the z-values of the shape that is passed to this method.
   *
   * As an additional consequence, using a shape defined in a geocentric (3D cartesian) reference can not work correctly when using a
   * {@link createCartesianGeodesy cartesian geodesy}. In that case, a ProgrammingError is thrown.
   *
   * Note: Currently only polygons are supported.
   *
   * @param shape The shape for which to calculate the area.
   *
   * @return The area of the shape in m^2.
   */
  area(shape: Shape): number;
}