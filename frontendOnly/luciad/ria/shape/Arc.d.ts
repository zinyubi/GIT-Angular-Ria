import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * An elliptical arc is a {@link Shape} that represents a general elliptical arc in the 2D space.
 * <p/>

 * The elliptical arc is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *       Use {@link move2DToCoordinates} or {@link move2DToPoint} to move the shape.</li>
 *   <li>The length of its {@link a semi major axis} (read-write).</li>
 *   <li>The length of its {@link b semi minor axis} (read-write).</li>
 *   <li>
 *     The {@link rotationAzimuth rotation} of its major axis. An azimuth is defined in degrees, clockwise,
 *     starting up/north (read-write).
 *   </li>
 *   <li>
 *     The {@link startAzimuth start azimuth} of the arc. Azimuth is defined as degrees, clockwise,
 *     starting up/north (read-write).
 *   </li>
 *   <li>The {@link sweepAngle sweep angle} over which the arc extends in degrees, clockwise (read-write).</li>
 * </ul>
 * An elliptical arc cannot be instantiated directly. It must be instantiated using {@link createArc}.
 */
export declare abstract class Arc extends Shape {
  get type(): ShapeType;
  /**
   * The semi major axis of the ellipse defining the arc, in meters.
   */
  get a(): number;
  set a(value: number);
  /**
   * The semi minor axis of the ellipse defining the arc, in meters. This field is mutable.
   */
  get b(): number;
  set b(value: number);
  get bounds(): Bounds;
  /**
   * The center point of the ellipse defining the arc. This field is read-only.
   * To move the shape to a new position, use {@link move2DToCoordinates} or {@link move2DToPoint}.
   */
  get center(): Point;
  /**
   * The rotation angle of the ellipse defining the arc. It is defined as an azimuth: degrees, clockwise, starting up/north.
   * This field is mutable.</p>
   * The value is normalized to the range -180° .. 180°.
   */
  get rotationAzimuth(): number;
  set rotationAzimuth(value: number);
  /**
   * The start angle. It is defined as an azimuth: degrees, clockwise, starting up/north. This field is mutable.
   */
  get startAzimuth(): number;
  set startAzimuth(value: number);
  /**
   * The angle over which the arc extends. It is defined in degrees, clockwise. This field is mutable.
   */
  get sweepAngle(): number;
  set sweepAngle(value: number);
  /**
   * The start point of the arc. This field is read-only.
   */
  get startPoint(): Point;
  /**
   * The end point of the arc. This field is read-only.
   */
  get endPoint(): Point;
  /**
   * The focus point of the arc. This field is read-only.
   */
  get focusPoint(): Point;
  equals(aArc: Shape): boolean;
  toString(): string;
  /**
   * Moves the center point of this arc to another location.
   * The passed x and y coordinates are expressed in the reference of this arc. The passed coordinates will become the coordinates of the center point of this arc.
   * @param x the x coordinate of the point.
   * @param y the y coordinate of the point.
   */
  move2DToCoordinates(x: number, y: number): void;
  /**
   * Moves this center point of this arc to another location.
   * The center point of this arc will be moved to the location of the passed point.
   * The reference of the passed point must match the reference of the shape.
   * @param point the point to move the arc's center point to.
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference of this shape.
   */
  move2DToPoint(point: Point): void;
  abstract copy(): Arc;
}