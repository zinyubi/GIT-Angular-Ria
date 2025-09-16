import { Circle } from "./Circle.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * A `CircleBy3Points` is a {@link Shape} that represents a circle defined by
 * three points on its circumference in the 2D space. <p/>
 *
 * The `CircleBy3Points` is defined by:
 * <ul>
 *   <li>The first point {@link firstPoint} (read-only).</li>
 *   <li>The second point {@link secondPoint} (read-only).</li>
 *   <li>The third point {@link thirdPoint} (read-only).</li>
 * </ul>
 * A `CircleBy3Points` cannot be instantiated directly.
 * Instead, it must be created using the {@link createCircleBy3Points} factory method.
 */
export declare abstract class CircleBy3Points extends Circle {
  /**
   * Returns the type of the shape.
   * The returned value is a bitwise combination of ShapeType values,
   * {@link ShapeType.CIRCLE} | {@link ShapeType.CIRCLE_BY_3_POINTS}
   */
  get type(): ShapeType;
  /**
   * The first point of this circle. This is one of the three points on the circumference. </p>
   * Please use {@link moveFirstPoint2DToCoordinates} or {@link moveFirstPoint2DToPoint} to move the point to a new position.
   */
  abstract get firstPoint(): Point;
  /**
   * The second point of this circle. This is one of the three points on the circumference.</p>
   * Please use {@link moveSecondPoint2DToCoordinates} or {@link moveSecondPoint2DToPoint} to move the point to a new position.
   */
  abstract get secondPoint(): Point;
  /**
   * The third point of this circle. This is one of the three points on the circumference.</p>
   * Please use {@link moveThirdPoint2DToCoordinates} or {@link moveThirdPoint2DToPoint} to move the point to a new position.
   */
  abstract get thirdPoint(): Point;
  /**
   * Moves the first point of this circle to the given coordinates
   * @param x The new x coordinate of the start point
   * @param y The new y coordinate of the start point
   */
  abstract moveFirstPoint2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the first point of this circle to the given point
      * @param point The new coordinate of the start point
   */
  moveFirstPoint2DToPoint(point: Point): void;
  /**
   * Moves the second point of this circle to the given coordinates
   * @param x The new x coordinate of the first intermediate point on this circle
   * @param y The new y coordinate of the first intermediate point on this circle
   */
  abstract moveSecondPoint2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the second point of this circle to the given point.
   * @param point The new coordinate of the first intermediate point on this circle
   */
  moveSecondPoint2DToPoint(point: Point): void;
  /**
   * Moves the second intermediate point of this circle to the given coordinates.
   * @param x The new x coordinate of the second intermediate point on this circle
   * @param y The new y coordinate of the second intermediate point on this circle
   */
  abstract moveThirdPoint2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the third point of this circle to the given point.
   * @param point The new x coordinate of the second intermediate point on this circle
   */
  moveThirdPoint2DToPoint(point: Point): void;
  /**
   * Translates the first point of this circle from its current position over the given translation vector to another location.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  abstract translateFirstPoint2D(x: number, y: number): void;
  /**
   * Translates the second point of this circle from its current position over the given translation vector to another location.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  abstract translateSecondPoint2D(x: number, y: number): void;
  /**
   * Translates the third point of this circle from its current position over the given translation vector to another location.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  abstract translateThirdPoint2D(x: number, y: number): void;
  move2DToCoordinates(x: number, y: number): void;
  toString(): string;
  equals(aCircle: Shape): boolean;
}