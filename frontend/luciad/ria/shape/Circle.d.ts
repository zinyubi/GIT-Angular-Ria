import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Bounds } from "./Bounds.js";
/**
 * A Circle interface is a high level interface for a {@link Shape} that represents a general circle in the 2D space. Each circle realizes this interface. </p>
 * A circle cannot be instantiated directly.
 * For more information please refer to {@link CircleBy3Points}.
 */
export declare abstract class Circle extends Shape {
  get type(): ShapeType;
  /**
   * Translates this shape so that its center ends up at the specified position.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  abstract move2DToCoordinates(x: number, y: number): void;
  /**
   * Translates this shape so that its center ends up at the specified position.
   * @param point The location to move too.
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this Circle.
   */
  move2DToPoint(point: Point): void;
  /**
   * The center point of this circle.</p>
   * Please use {@link move2DToCoordinates} or {@link move2DToPoint} to move the center point to a new position.
   */
  abstract get center(): Point;
  /**
   * The radius of this circle, in meters.
   */
  abstract get radius(): number;
  abstract set radius(value: number);
  abstract get focusPoint(): Point;
  abstract get bounds(): Bounds;
  abstract copy(): Circle;
}