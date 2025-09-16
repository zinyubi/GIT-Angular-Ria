import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Bounds } from "./Bounds.js";
/**
 * A Circular arc is a high level interface for a {@link Shape} that represents a general circular arc in the 2D space. Each circular arc realizes this interface. </p>
 * A circular arc cannot be instantiated directly.
 * For more information please refer to {@link CircularArcByCenterPoint},
 * {@link CircularArcByBulge}.
 */
export declare abstract class CircularArc extends Shape {
  get type(): ShapeType;
  /**
   * The center point of the circle defining the circular arc. This field is read-only.</p>
   * Please use {@link move2DToCoordinates} or {@link move2DToPoint} to move the center point to a new position.
   */
  abstract get center(): Point;
  /**
   * The radius of the circle defining the circular arc.
   */
  abstract get radius(): number;
  abstract set radius(value: number);
  /**
   * The start angle. It is defined as an azimuth: in degrees, positive clockwise, starting up/north.
   */
  abstract get startAzimuth(): number;
  abstract set startAzimuth(value: number);
  /**
   * The angle over which the arc extends. It is defined in degrees, positive clockwise.
   */
  abstract get sweepAngle(): number;
  abstract set sweepAngle(v: number);
  /**
   * The start point of the circular arc. This is the point that is defined by the radius of the arc
   * and the start angle of the arc.
   *
   */
  abstract get startPoint(): Point;
  /**
   * The end point of the circular arc. This is the point that is defined by the radius of the arc
   * and the arc's angle.
   *
   */
  abstract get endPoint(): Point;
  /**
   * Translates this shape so that its center point ends up at the specified position.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  move2DToCoordinates(x: number, y: number): void;
  /**
   * Translates this shape so that its center point ends up at the specified position.
   * @param point a {@link Point} instance
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this shape.
   */
  move2DToPoint(point: Point): void;
  toString(): string;
  abstract get focusPoint(): Point;
  abstract get bounds(): Bounds;
  abstract copy(): CircularArc;
}