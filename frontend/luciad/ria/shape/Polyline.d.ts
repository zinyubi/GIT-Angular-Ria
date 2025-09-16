import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
import { Bounds } from "./Bounds.js";
/**
 * A polyline is defined by a number of ordered, connected {@link Point}s.
 * A polyline is always defined in a particular geographical reference (Geodetic reference or Grid Reference).
 * A Polyline cannot be instantiated directly. It must be instantiated using {@link createPolyline}.
 * Note: For polylines in a geodetic spatial reference, if any point's latitude is initially set outside
 * the valid range of [-90, 90] degrees, it is automatically clamped to this range for accuracy.
 */
export declare abstract class Polyline extends Shape {
  abstract copy(): Polyline;
  get type(): ShapeType;
  get focusPoint(): Point | null;
  /**
   * The number of points in the polyline
   */
  get pointCount(): number;
  /**
   * Returns the point of the polyline at the given index.
   * Any subsequent mutation on the point affects the polyline shape.
   * Note: A new {@link Point} is returned on each function invocation that shares the same point representation of
   * the polyline.
   * ```javascript
   * const pA = polyline.getPoint(0)
   * const pB = polyline.getPoint(0)
   * console.log(pA === pB) // false
   * pA.x = 100;
   * console.log(pA.x, pB.x, polyline.getPoint(0).x) // 100, 100, 100
   * ```
   * @param index The index of the point to be returned.
   */
  getPoint(index: number): Point;
  /**
   * Inserts a {@link Point} at a given position in this Polyline.  The point must be defined
   * in the same spatial reference as the polygon, otherwise an exception will be thrown.
   * @param index The index at which the point must be inserted
   * @param point The point to be inserted
   * @throws {@link InvalidReferenceError} When the point's spatial reference does not correspond with
   * the polyline's spatial reference.
   * @throws {@link ProgrammingError} When the index is invalid, i.e. smaller than zero or larger than
   * the amount of points in the polyline.
   */
  insertPoint(index: number, point: Point): void;
  /**
   * Removes a {@link Point} at a given position in this Polyline.
   * @param index The index of the point that must be removed.
   * @throws {@link ProgrammingError} When the index is invalid, i.e. smaller than zero or larger than
   * the index of the last point in the polyline.
   */
  removePoint(index: number): void;
  /**
   * Translates all the points of this Polyline over the given vector in 2D or 3D space.
   * A point is only translated in 3D space if the z parameter is specified.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value, may be omitted.
   */
  translate(x: number, y: number, z?: number): void;
  translate2D(x: number, y: number): void;
  /**
   * Translates all the points of this Polyline over the given vector in 3D space.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   */
  translate3D(x: number, y: number, z: number): void;
  /**
   * Translates the point at the given index over the given vector in 2D or 3D space.
   * A point is only translated in 3D space if the z parameter is specified.
   * @param index The index of the point that must be removed.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value, may be omitted.
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polyline.
   */
  translatePoint(index: number, x: number, y: number, z: number): void;
  /**
   * Moves the x and y coordinates of the point at the given index to the given coordinates.
   * The z value remains unchanged.
   * @param index The index of the point that must be removed.
   * @param x x coordinate value
   * @param y y coordinate value
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polyline.
   */
  move2DPoint(index: number, x: number, y: number): void;
  /**
   * Moves the point at the given index to the given coordinates.
   * @param index The index of the point that must be removed.
   * @param x x coordinate value
   * @param y y coordinate value
   * @param z z coordinate value
   * @throws {@link ProgrammingError} When the index is invalid (i.e. smaller than zero or larger than
   * the index of the last point in the polyline.
   */
  move3DPoint(index: number, x: number, y: number, z: number): void;
  equals(polyline: Shape): boolean;
  toString(): string;
  abstract get bounds(): Bounds | null;
}