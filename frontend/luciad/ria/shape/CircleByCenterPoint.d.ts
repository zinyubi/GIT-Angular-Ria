import { Circle } from "./Circle.js";
import { ShapeType } from "./ShapeType.js";
import { Shape } from "./Shape.js";
/**
 * A `CircleByCenterPoint` is a {@link Shape} that represents a general circle
 * defined by a center point and a radius in the 2D space.<p/>
 *
 * The `CircleByCenterPoint` is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *   <li>The length of its {@link radius} (read-write).</li>
 * </ul>
 * A `CircleByCenterPoint` cannot be instantiated directly.
 * Instead, it must be created using the {@link createCircleByCenterPoint} factory method.
 */
export declare abstract class CircleByCenterPoint extends Circle {
  /**
   * Returns the type of the shape.
   * The returned value is a bitwise combination of ShapeType values,
   * {@link ShapeType.CIRCLE} | {@link ShapeType.CIRCLE_BY_CENTER_POINT}
   */
  get type(): ShapeType;
  translate2D(x: number, y: number): void;
  move2DToCoordinates(x: number, y: number): void;
  toString(): string;
  equals(aCircle: Shape): boolean;
}