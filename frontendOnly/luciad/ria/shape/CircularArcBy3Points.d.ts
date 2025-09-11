import { CircularArc } from "./CircularArc.js";
import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
/**
 * A `CircularArcBy3Points` is a {@link Shape} that represents a circular arc defined by 3 points in the 2D space.
 * <p/>
 *
 * The `CircularArcBy3Points` is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *   <li>The start point {@link startPoint}. (read-only).</li>
 *   <li>The intermediate point {@link intermediatePoint}. (read-only).</li>
 *   <li>The end point {@link endPoint}. (read-only).</li>
 * </ul>
 * A `CircularArcBy3Points` cannot be instantiated directly.
 * Instead, it must be created using the {@link createCircularArcBy3Points} factory method.
 */
export declare abstract class CircularArcBy3Points extends CircularArc {
  /**
   * Returns the type of the shape.
   * The returned value is a bitwise combination of ShapeType values,
   * {@link ShapeType.CIRCULAR_ARC} | {@link ShapeType.CIRCULAR_ARC_BY_3_POINTS}
   */
  get type(): ShapeType;
  /**
   * The radius of the circle defining the circular arc.
   */
  abstract get radius(): number;
  /**
   * The start angle. It is defined as an azimuth: in degrees, positive clockwise, starting up/north.
   */
  abstract get startAzimuth(): number;
  /**
   * The angle over which the arc extends. It is defined in degrees, positive clockwise.
   */
  abstract get sweepAngle(): number;
  /**
   * The start point of this circular arc. This is one of the three points defined
   * in a circular-arc-by-3-points. This field is read-only.</p>
   *
   */
  abstract get startPoint(): Point;
  /**
   * The end point of this circular arc. This is one of the three points defined
   * in a circular-arc-by-3-points. This field is read-only.</p>
   */
  abstract get endPoint(): Point;
  /**
   * The intermediate point of this circular arc. This is one of the three points defined
   * in a circular-arc-by-3-points. This field is read-only.</p>
   * Please use {@link moveIntermediatePoint2DToCoordinates} or {@link moveIntermediatePoint2DToPoint} to move the point to a new position.
   */
  abstract get intermediatePoint(): Point;
  /**
   * Moves the start point of this circular arc to the given coordinates
   * @param x The new x coordinate of the start point on this circular arc
   * @param y The new y coordinate of the start point on this circular arc
   */
  abstract moveStartPoint2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the start point of this circular arc to the given point
   * @param point a {@link Point} instance
   */
  moveStartPoint2DToPoint(point: Point): void;
  /**
   * Moves the intermediate point of this circular arc to the given coordinates
   * @param x The new x coordinate of the intermediate point on this circular arc
   * @param y The new y coordinate of the intermediate point on this circular arc
   */
  abstract moveIntermediatePoint2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the intermediate point of this circular arc to the given point
   * @param point a {@link Point} instance
   */
  moveIntermediatePoint2DToPoint(point: Point): void;
  /**
   * Moves the end point of this circular arc to the given coordinates
   * @param x The new x coordinate of the end point on this circular arc
   * @param y The new y coordinate of the end point on this circular arc
   */
  abstract moveEndPoint2DToCoordinates(x: number, y: number): void;
  /**
   * Moves the end point of this circular arc to the given point
   * @param point a {@link Point} instance
   */
  moveEndPoint2DToPoint(point: Point): void;
  /**
   * Translates the start point of this circular arc from its current position over the given translation
   * vector to another location.
   * @param aDeltaX vector x coordinate value
   * @param aDeltaY vector y coordinate value
   */
  abstract translateStartPoint2D(aDeltaX: number, aDeltaY: number): void;
  /**
   * Translates the intermediate point of this circular arc from its current position over the given translation
   * vector to another location.
   * @param aDeltaX vector x coordinate value
   * @param aDeltaY vector y coordinate value
   */
  abstract translateIntermediatePoint2D(aDeltaX: number, aDeltaY: number): void;
  /**
   * Translates the end point of this circular arc from its current position over the given translation vector
   * to another location.
   * @param aDeltaX vector x coordinate value
   * @param aDeltaY vector y coordinate value
   */
  abstract translateEndPoint2D(aDeltaX: number, aDeltaY: number): void;
  translate2D(aDeltaX: number, aDeltaY: number): void;
  toString(): string;
  equals(aArc: Shape): boolean;
}