import { Shape } from "./Shape.js";
import { Bounds } from "./Bounds.js";
/**
 * Represents a point in 3 (x, y, z) dimensions in the context of a spatial reference.
 * A {@link ShapeFactory} module. For a geodetic spatial reference, the `x` and `y` properties correspond with
 * longitude and latitude on the ellipsoid.
 * Note: If latitude (the `y` property in this context) for a geodetic point is initially set outside the valid range
 * of [-90, 90] degrees, it is automatically clamped to this range for accuracy.
 * For projected spatial references, the `x` and `y` properties correspond with the `x` and `y` axes in Cartesian space.
 * The `z` property always corresponds with height.
 */
export declare abstract class Point extends Shape {
  abstract copy(): Point;
  /**
   * The x coordinate of the Point.  For a point that is defined in a geodetic spatial reference this
   * property returns the longitude.  Assigning to the x property of a point with a geodetic spatial reference
   * will normalize the coordinate to the interval [-180, 180].  E.g. if you assign a value or 380 to the x
   * property, it will be normalized to 20;
   */
  abstract get x(): number;
  abstract set x(value: number);
  /**
   * The y coordinate of the Point.  For a point that is defined in a geodetic spatial reference this
   * property returns the latitude.  Assigning to the y property of a point with a geodetic spatial reference
   * will normalize the coordinate to the interval [-90, 90].  E.g. if you assign a value of 100 to the y
   * property, it will be normalized to 90;
   */
  abstract get y(): number;
  abstract set y(value: number);
  /**
   * The z coordinate of the Point.  The z coordinate typically corresponds with height.
   */
  abstract get z(): number;
  abstract set z(value: number);
  /**
   * Moves this Point to another location. The passed x and y will  become the x and y coordinates of this point.
   * The z coordinate of this Point remains unmodified.
   * @param xOrPoint x coordinate value or a {@link Point} instance
   * @param y y coordinate value
   */
  move2D(xOrPoint: number | Point, y?: number): void;
  /**
   * Moves this Point to another location. The passed x and y will  become the x and y coordinates of this point.
   * The z coordinate of this Point remains unmodified.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  abstract move2DToCoordinates(x: number, y: number): void;
  /**
   * Moves this Point to another location. This Point will be moved to the same location of the Point that
   * was passed. The z coordinate of the point that was passed will be ignored.
   * @param point a {@link Point} instance
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this Point.
   */
  move2DToPoint(point: Point): void;
  abstract toString(excludeType?: boolean): string;
  /**
   * Moves this Point to another location. The passed x,y and z coordinates will  become the x, y and z coordinates of this point.
   * @param xOrPoint x coordinate value or a {@link Point} instance.
   * @param y y coordinate value
   * @param z z coordinate value
   */
  move3D(xOrPoint: Point | number, y?: number, z?: number): void;
  /**
   * Moves this point to the same location of the given Point.
   * @param point a {@link Point} instance
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this Point.
   */
  move3DToPoint(point: Point): void;
  /**
   * Moves this Point to the given x, y and z coordinates.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  abstract move3DToCoordinates(x: number, y: number, z: number): void;
  /**
   * Translates this Point from its current position over the given translation vector to another location.
   * This method can be called with an x, y and optionally a z value. If the z coordinate is not specified,
   * the translation will only affect the x and y coordinate.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value, may be omitted.
   */
  translate(x: number, y: number, z?: number): void;
  /**
   * Translates this Point from its current position over the given translation vector to another location.
   *
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  abstract translate3D(x: number, y: number, z: number): void;
  abstract get focusPoint(): Point;
  abstract get bounds(): Bounds;
}