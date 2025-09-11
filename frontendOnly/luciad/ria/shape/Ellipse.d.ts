import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Bounds } from "./Bounds.js";
/**
 * Ellipse interface.
 * An ellipse is a {@link Shape} that represents a general ellipse in the 2D space.
 * <p/>
 * The ellipse is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *       Use {@link move2DToCoordinates} or {@link move2DToPoint} to move the shape.</li>
 *   <li>The length of its {@link a semi major axis} (read-write).</li>
 *   <li>The length of its {@link a semi minor axis} (read-write).</li>
 *   <li>The {@link rotationAzimuth rotation} of its major axis. It is defined as an azimuth: degrees, clockwise, starting up/north (read-write).</li>
 * </ul>
 * An ellipse cannot be instantiated directly. It must be instantiated using {@link createEllipse}.
 */
export declare abstract class Ellipse extends Shape {
  get type(): ShapeType;
  /**
   * The center of this ellipse. This field is read-only.</p>
   * Please use {@link move2DToCoordinates} or {@link move2DToPoint} to move the center point to a new position.
   */
  get center(): Point;
  /**
   * The length of the semi major axis of this ellipse, in meters.
   */
  get a(): number;
  set a(a: number);
  /**
   * The length of the semi minor axis of this ellipse, in meters.
   */
  get b(): number;
  set b(b: number);
  /**
   * The rotation angle of the semi major axis of this ellipse.
   * The angle is measured in degrees from 12 o'clock (north), positive clockwise.</p>
   * The value is normalized to the range -180° .. 180°.
   */
  get rotationAzimuth(): number;
  set rotationAzimuth(rotationAzimuth: number);
  translate2D(x: number, y: number): void;
  /**
   * Translates this ellipse so that its center point ends up at the specified position.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  move2DToCoordinates(x: number, y: number): void;
  /**
   * Translates this shape so that its center point ends up at the specified position.
   * @param point a {@link Point} instance
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference
   *   of this Ellipse.
   */
  move2DToPoint(point: Point): void;
  /**
   * Get a point on the ellipse relative to the major axis.
   * <p/>
   * The parameter is [0, 1] clockwise, relative to the rotation angle:
   * <ul>
   *   <li>0.0 and 1.0 are the same point on the major axis, "on top" of the ellipse</li>
   *   <li>0.25 is a point on the minor axis, "right" of the ellipse</li>
   *   <li>0.5 is a point on the major axis, opposite of the point at 0.0</li>
   *   <li>0.75 is a point on the minor axis, opposite of the point at 0.25</li>
   * </ul>
   * <p/>
   * <p/>
   * @param fraction A factor in [0, 1], relative to the ellipse's rotation.
   * @return The computed point
   */
  abstract interpolate(fraction: number): Point;
  toString(): string;
  equals(ellipse: Shape): boolean;
  get focusPoint(): Point;
  abstract get bounds(): Bounds;
  abstract copy(): Ellipse;
}