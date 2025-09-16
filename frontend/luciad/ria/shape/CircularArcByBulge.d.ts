import { CircularArc } from "./CircularArc.js";
import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
/**
 * A `CircularArcByBulge` is a {@link Shape} that represents a circular arc defined by two points and a bulge factor in 2D space.<p/>
 *
 * A bulge factor of 1 indicates that the arc forms a half-circle.
 * As the bulge factor approaches 0, the arc flattens, meaning the radius of the arc's circle increases.
 * The sign of the bulge determines whether the bulge is on the left or right side
 * of the vector from the start point to the end point.<p/>
 *
 * More specifically, consider the chord between the start point (S) and the end point (E)
 * with a point (C) in the middle of it.
 * The midpoint (M) of the arc is located on a line that extends from C and is oriented along the normal.
 * The bulge factor is the ratio of the distances MC and SC.
 * The sign of the bulge indicates whether the midpoint is on the left side (positive)
 * or right side (negative) of the vector from the start point to the end point.
 * <p/>
 *
 * The `CircularArcByBulge` is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *   <li>The start point {@link startPoint}. (read-only).</li>
 *   <li>The end point {@link endPoint}. (read-only).</li>
 *   <li>The bulge factor {@link bulge}. (read-write).</li>
 * </ul>
 * A `CircularArcByBulge` cannot be instantiated directly.
 * Instead, it must be created using the {@link createCircularArcByBulge} factory method.
 */
export declare abstract class CircularArcByBulge extends CircularArc {
  /**
   * Returns the type of the shape.
   * The returned value is a bitwise combination of ShapeType values,
   * {@link ShapeType.CIRCULAR_ARC} | {@link ShapeType.CIRCULAR_ARC_BY_BULGE}
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
   * The start point of this circular arc.
   */
  abstract get startPoint(): Point;
  /**
   * The end point of this circular arc.
   */
  abstract get endPoint(): Point;
  /**
   * The bulge factor of the arc. This field is mutable.</p>
   * The bulge factor is the ratio of (1) the distance between the
   * arc midpoint and the center of the arc's chord, and (2) half the length of the arc's chord.
   * The sign of the bulge indicates whether the midpoint is on the left side (positive) or
   * right side (negative) of the vector from start to end point. So a bulge factor with an absolute value of 1 means a
   * half-circle, smaller than 1 means a less bulging arc and larger than 1 means an arc that bulges
   * out in the start and end point.
   */
  abstract get bulge(): number;
  abstract set bulge(value: number);
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
   * Translates the start point of this circular arc from its current position over the given translation vector to another location.
   * @param aDeltaX vector x coordinate value
   * @param aDeltaY vector y coordinate value
   */
  abstract translateStartPoint2D(aDeltaX: number, aDeltaY: number): void;
  /**
   * Translates the end point of this circular arc from its current position over the given translation vector to another location.
   * @param aDeltaX vector x coordinate value
   * @param aDeltaY vector y coordinate value
   */
  abstract translateEndPoint2D(aDeltaX: number, aDeltaY: number): void;
  translate2D(aDeltaX: number, aDeltaY: number): void;
  toString(): string;
  equals(aArc: Shape): boolean;
}