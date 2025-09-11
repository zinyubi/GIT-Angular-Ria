import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * <p>
 * A Bounds object is a 3D axis-aligned box. It has a location, a width, height, and a depth.
 * The location is represented by the smallest x, y and z coordinate encompassed by the box, i.e. the
 * lower-left corner.
 * The width, height and depth are the box's extents in the positive directions of the
 * x, y and z axis, respectively.
 * <p></p>
 * Note that Bounds instances will be normalized when (re)configuring them.  width, h
 * In case the Bounds instance is defined in a
 * {@link CoordinateType.GEODETIC} coordinate system, the properties
 * will be normalized:
 * <ul>
 *   <li> the x coordinate will be in the [-180, 180] range. </li>
 *   <li>
 *     the width will be in the [0, 360] range.  In case the width covers the entire world, the x
 *     coordinate will be normalized to -180.
 *   </li>
 *   <li>the y coordinate will be [-90, 90] range. </li>
 *   <li> the height coordinate will never exceed the north pole. (i.e. y + height <= 90).</li>
 *   <li>no normalization occurs on the z-axis.</li>
 * </ul>
 * <p></p>
 * The box is typically used as a bounding box for more complex geometries. It must be
 * instantiated using {@link createBounds}.
 * </p>
 */
export declare abstract class Bounds extends Shape {
  abstract copy(): Bounds;
  get type(): ShapeType;
  toString(): string;
  /**
   * The x coordinate or longitude of the location of the bounding box.
   */
  abstract get x(): number;
  abstract set x(value: number);
  /**
   * The width of this bounding box (the box's extent along the x-axis). The width must be
   * larger than or equal to zero.
   */
  abstract get width(): number;
  abstract set width(value: number);
  /**
   * The y coordinate or latitude of the location of the bounding box.
   */
  abstract get y(): number;
  abstract set y(value: number);
  /**
   * The height of the bounding box (the box's extent along the
   * Y-axis).  The height must be larger than or equal to zero.
   */
  abstract get height(): number;
  abstract set height(value: number);
  /**
   * The z coordinate of the location of the bounding box.
   */
  abstract get z(): number;
  abstract set z(value: number);
  /**
   * The depth of the bounding box (the box's extent along the
   * Z-axis).  The depth must be larger than or equal to zero.
   **/
  abstract get depth(): number;
  abstract set depth(value: number);
  /**
   * Configure this Bounds instance in 2 dimensions.
   * @param x The x coordinate of Bounds instance's location.
   * @param width The width of the Bounds instance.
   * @param y The y coordinate of the Bounds instance's
   * @param height The height of the Bounds instance's location
   */
  abstract setTo2D(x: number, width: number, y: number, height: number): void;
  /**
   * Configure this Bounds instance in 3 dimensions.
   * @param x The x coordinate of Bounds instance's location.
   * @param width The width of the Bounds instance.
   * @param y The y coordinate of the Bounds instance's
   * @param height The height of the Bounds instance's location
   * @param z The z coordinate of the Bounds instance's
   * @param depth The depth of the Bounds instance's location
   */
  abstract setTo3D(x: number, width: number, y: number, height: number, z: number, depth: number): void;
  /**
   * Configure this Bounds instance in 2 dimensions, using the dimensions of another Bounds instance.
   * @param bounds the bounds that must be used to configure this bounds.
   * Only the x, width, y and height properties of this bounds instance will be considered.
   * @throws {@link InvalidReferenceError} if bounds is defined in a different reference
   */
  abstract setToBounds2D(bounds: Bounds): void;
  /**
   * Configure this Bounds instance in 2 dimensions, using the dimensions of another Bounds instance.
   * @param bounds the bounds that must be used to configure this bounds.
   * @throws {@link InvalidReferenceError} if bounds is defined in a different reference
   */
  abstract setToBounds3D(bounds: Bounds): void;
  /**
   * Moves the location of this Bounds instance to the location specified by x and y.
   * @param xOrPoint x coordinate value or the location as a point.
   * @param y y coordinate value
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this Bounds.
   */
  move2D(xOrPoint: number | Point, y?: number): void;
  /**
   * Moves the location of this Bounds instance to the location specified by x and y.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  abstract move2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the location of this Bounds instance to the location of the point. The z-value of the point is ignored.
   * @param point a {@link Point} instance or x coordinate value
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this Bounds.
   */
  move2DToPoint(point: Point): void;
  /**
   * Moves this Bounds instance to the location specified by the x, y and z parameters.
   * @param xOrPoint x coordinate value or the point to move the location of this bounds to
   * @param y y coordinate value
   * @param z z coordinate value
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference of this Bounds.
   */
  move3D(xOrPoint: number | Point, y?: number, z?: number): void;
  /**
   * Moves this Bounds instance to the location in 3D space as specified by the point.
   * @param point the point to move the location of this bounds to.
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference of this Bounds.
   */
  move3DToPoint(point: Point): void;
  /**
   * Moves this Bounds instance to the location specified by the x, y and z parameters.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  abstract move3DToCoordinates(x: number, y: number, z: number): void;
  /**
   * Translates this bounds from its current position over the given translation vector to another location.
   * This method can be called with an x, y and optionally a z value. If the z coordinate is not specified,
   * the translation will only affect the x and y coordinate.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value, may be omitted.
   */
  translate(x: number, y: number, z?: number): void;
  /**
   * Translates this bounds from its current position over the given translation vector to another location.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  abstract translate3D(x: number, y: number, z: number): void;
  /**
   * Check whether this Bounds instance contains the bounds in the 3D space.
   * @param pointOrBounds The bounds or point whose containment must be checked
   * @return true when the point or bounds are contained
   * @throws {@link InvalidReferenceError} when the reference of the bounds parameter does not correspond with the reference of this Bounds
   * @deprecated Please use {@link contains3DBounds} instead.
   */
  contains3D(pointOrBounds: Point | Bounds): boolean;
  /**
   * Check whether this Bounds instance contains the bounds in the 3D space.
   * @param bounds The bounds whose containment must be checked
   * @return true when the point or bounds are contained
   * @throws {@link InvalidReferenceError} when the reference of the bounds parameter does not correspond with the reference of this Bounds
   */
  abstract contains3DBounds(bounds: Bounds): boolean;
  /**
   * <p>Determines whether a given point is inside this shape.  This method checks
   * containment in three dimensions:  on the (x,y,z)-axis or the (lon,lat,height)-axis
   * (depending on the spatial reference of the shape).</p>
   *
   * @param point The point for which containment must be checked. If a 3D point is passed to this function,
   * a z-coordinate (height) value of 0 is assumed. This point must have the same spatial reference as the shape.
   * @throws {@link Point} with another spatial
   * reference.
   */
  contains3DPoint(point: Point): boolean;
  /**
   * Calculates the 2D union of this Bounds instance and a given Bounds
   * instance.  The result contains at least all the points that are contained in either of the
   * Bounds objects (and typically more). Only the first two dimensions of
   * the Bounds objects are considered. This Bounds object is
   * updated with the result.  Its third dimension is left unchanged.
   * @param bounds the other Bounds operand for the union.
   * @throws {@link InvalidReferenceError} when the reference of the Bounds parameter
   * does not correspond with the reference of this Bounds object
   */
  abstract setTo2DUnion(bounds: Bounds): void;
  /**
   * Calculates the 3D union of this Bounds object and a given Bounds object.
   * The result contains at least all the points that are contained in either
   * or both of the Bounds objects (and typically more). This Bounds object
   * is updated with the result.
   * @param bounds the other Bounds operand for the union.
   * @throws {@link InvalidReferenceError} when the reference of
   * the Bounds parameter does not correspond with the reference of
   * this Bounds object
   */
  abstract setTo3DUnion(bounds: Bounds): void;
  /**
   * Calculates the 2D intersection of this Bounds instance and a given Bounds
   * instance. Only the first two dimensions of
   * the Bounds objects are considered. This Bounds object is
   * updated with the result.  Its third dimension is left unchanged.
   * @param bounds the other Bounds operand for the intersection.
   * @throws {@link InvalidReferenceError} when the reference of the Bounds parameter
   * does not correspond with the reference of this Bounds object
   */
  abstract setTo2DIntersection(bounds: Bounds): void;
  /**
   * Calculates the 3D intersection of this Bounds instance and a given Bounds
   * instance. This Bounds object is updated with the result.
   * @param bounds the other Bounds operand for the intersection.
   * @throws {@link InvalidReferenceError} when the reference of the Bounds parameter
   * does not correspond with the reference of this Bounds object
   */
  abstract setTo3DIntersection(bounds: Bounds): void;
  /**
   * Calculates the 2D extension of this Bounds object that contains a given
   * {@link Point}.  The result contains at least the given point and all the points that are
   * contained in this Bounds (and typically more). Only the first two
   * dimensions of this Bounds object and the Bounds are considered. This
   * Bounds object is updated with the result. Its third dimension is left unchanged.
   * @param point the point that should be inside (or at the edge) after the extension of the bounds.
   * @throws {@link Point}'s reference does not
   * match the spatial reference of this Bounds.
   */
  abstract setToIncludePoint2D(point: Point): void;
  /**
   * Calculates the 3D extension of this Bounds that contains a given {@link Point}.
   * The result contains at least the given point and all the points that are contained in this
   * Bounds (and typically more). This Bounds object is updated\
   * with the result.
   * @param point the point operand for the union.
   * @throws {@link Point}'s reference does not
   * match the spatial reference of this Bounds.
   */
  abstract setToIncludePoint3D(point: Point): void;
  /**
   * Checks whether this Bounds object interacts with the given Bounds
   * object in the 2D space. Only the first two dimensions of the Bounds objects
   * are considered.
   * @param bounds the bounds to compare with.
   * @return the boolean result of the interaction test.
   */
  abstract interacts2D(bounds: Bounds): boolean;
  /**
   * <p>Determines whether a given bounds is inside this bounds.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis or the (lon,lat)-axis
   * (depending on the spatial reference of the shape).</p>
   * @param bounds The bounds for which containment must be checked.
   * If a 3D bounds is passed to this function, it will be treated as a 2D bounds:  the z
   * coordinate (height) will be ignored. The reference of the passed bounds must be the same
   * reference as this Bounds
   * @throws {@link Bounds} with another spatial
   * reference
   * @return {Boolean} <code>true</code> when the given bounds are contained in this bounds
   */
  contains2DBounds(bounds: Bounds): boolean;
  /**
   * <p>Determines whether a given bounds is inside this bounds.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis or the (lon,lat)-axis
   * (depending on the spatial reference of the shape).</p>
   * @param bounds The bounds for which containment must be checked.
   * If a 3D bounds is passed to this function, it will be treated as a 2D bounds:  the z
   * coordinate (height) will be ignored. The reference of the passed bounds must be the same
   * reference as this Bounds
   * @throws {@link InvalidReferenceError} when the reference of the bounds parameter does not correspond with the reference of this Bounds
   * reference
   * @return {Boolean} <code>true</code> when the given bounds are contained in this bounds
   * @deprecated Please use {@link Bounds.contains2DBounds contains2DBounds} instead.
   */
  abstract contains2D(bounds: Bounds): boolean;
  abstract get focusPoint(): Point;
  abstract get bounds(): Bounds;
}