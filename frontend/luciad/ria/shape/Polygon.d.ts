import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Bounds } from "./Bounds.js";
/**
 * A polygon is a shape that represents a closed polygon without holes.
 * A polygon is always defined in a particular geographical reference (Geodetic reference or Grid Reference).
 * A Polygon cannot be instantiated directly. It must be instantiated using {@link createPolygon}.
 * Note: For polygons in a geodetic spatial reference, if any point's latitude is initially set outside
 * the valid range of [-90, 90] degrees, it is automatically clamped to this range for accuracy.
 */
export declare abstract class Polygon extends Shape {
  abstract copy(): Polygon;
  /**
   * The number of points in the polygon
   */
  get pointCount(): number;
  /**
   * Inserts a Point at a given position in this Polygon.  The point must be defined in the same spatial reference
   * as the polygon, otherwise an exception will be thrown.
   * @param index The index at which the point must be inserted
   * @param point The point to be inserted
   * @throws {@link InvalidReferenceError} When the point's spatial reference does not correspond with
   * the polygon's spatial reference.
   * @throws {@link ProgrammingError} When the index is invalid, i.e. smaller than zero or larger than
   * the amount of points in the polygon.
   */
  insertPoint(index: number, point: Point): void;
  /**
   * Removes a point at a given position in this Polygon.  This method does not guarantee that the polygon remains
   * valid, i.e. the polygon must
   * at least have 3 points.  Validity of the polygon can be checked with {@link Polygon.isValid}.
   * @param index The index of the point that must be removed.
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polygon
   */
  removePoint(index: number): void;
  /**
   * Translates all the points of this Polygon over the given vector in 2D or 3D space.
   * A point is only translated in 3D space if the z parameter is specified.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  translate(x: number, y: number, z?: number): void;
  translate2D(x: number, y: number): void;
  /**
   * Translates all the points of this Polygon over the given vector in 3D space.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  translate3D(x: number, y: number, z: number): void;
  /**
   * Translates the point at the given index over the given vector in 2D or 3D space.
   * A point is only translated in 3D space the z parameter is specified.
   * @param index The index of the point that must be removed.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polygon
   */
  translatePoint(index: number, x: number, y: number, z?: number): void;
  /**
   * Moves the x and y coordinates of the point at the given index to the given coordinates.
   * The z value remains unchanged.
   * @param index The index of the point that must be removed.
   * @param x x coordinate value
   * @param y y coordinate value
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polygon
   */
  move2DPoint(index: number, x: number, y: number): void;
  /**
   * Moves the point at the given index to the given coordinates.
   * @param index The index of the point that must be removed.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polygon
   */
  move3DPoint(index: number, x: number, y: number, z: number): void;
  /**
   * Verifies whether the polygon is valid.  A valid polygon:  <ul>  <li> consists of at least 3 points </li> </ul>
   * @return true if the polygon is valid, false otherwise
   */
  isValid(): boolean;
  /**
   * Returns the point of the polygon at the given index.
   * Any subsequent mutation on the point affects the polygon shape.
   * Note: A new {@link Point} is returned on each function invocation that shares the same point representation of
   * the polygon.
   * ```javascript
   * const pA = polygon.getPoint(0)
   * const pB = polygon.getPoint(0)
   * console.log(pA === pB) // false
   * pA.x = 100;
   * console.log(pA.x, pB.x, polygon.getPoint(0).x) // 100, 100, 100
   * ```
   * @param index The index of the point to be returned.
   * @return the point at the given index
   */
  getPoint(index: number): Point;
  toString(): string;
  equals(otherPolygon: Shape): boolean;
  get type(): ShapeType;
  get focusPoint(): Point | null;
  abstract get bounds(): Bounds | null;
}