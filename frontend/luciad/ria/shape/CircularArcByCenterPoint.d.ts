import { CircularArc } from "./CircularArc.js";
import { ShapeType } from "./ShapeType.js";
import { Shape } from "./Shape.js";
/**
 * A `CircularArcByCenterPoint` is a {@link Shape} that represents a general circular arc defined by a center point,
 * radius, and two angles in the 2D space.
 * <p/>
 *
 * The `CircularArcByCenterPaint` is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *   <li>The length of its {@link radius} (read-write).</li>
 *   <li>
 *     The {@link startAzimuth start azimuth} of the circular arc. An azimuth is defined in degrees,
 *     clockwise, starting up/north (read-write).
 *   </li>
 *   <li>The {@link sweepAngle sweep angle} over which the circular arc extends in degrees, clockwise (read-write).</li>
 * </ul>
 * A `CircularArcByCenterPoint` cannot be instantiated directly.
 * Instead, it must be created using the {@link createCircularArcByCenterPoint} factory method.
 */
export declare abstract class CircularArcByCenterPoint extends CircularArc {
  /**
   * Returns the type of the shape.
   * The returned value is a bitwise combination of ShapeType values,
   * {@link ShapeType.CIRCULAR_ARC} | {@link ShapeType.CIRCULAR_ARC_BY_CENTER_POINT}
   */
  get type(): ShapeType;
  translate2D(x: number, y: number): void;
  equals(aArc: Shape): boolean;
  toString(): string;
}