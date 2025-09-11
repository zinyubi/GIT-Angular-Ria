import { ShapeType } from "./ShapeType.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { Bounds } from "./Bounds.js";
/**
 * A sector is a {@link Shape} that represents a general circular sector in the 2D space.
 * <p/>
 *
 * The sector is defined by:
 * <ul>
 *   <li>The {@link center point} (read-only).
 *       Use {@link move2DToCoordinates} or {@link move2DToPoint} to move the shape.</li>
 *   <li>The length of its {@link radius} (read-write).</li>
 *   <li>The {@link startAzimuth start azimuth} of the sector. An azimuth is defined as degrees, clockwise, starting up/north (read-write).</li>
 *   <li>The {@link sweepAngle sweep angle} over which the sector extends in degrees, clockwise (read-write).</li>
 * </ul>
 * A sector cannot be instantiated directly. It must be instantiated using {@link createSector}.
 *
 */
export declare abstract class Sector extends Shape {
  get type(): ShapeType;
  toString(): string;
  /**
   * The radius of this sector, in meters. This field is mutable.
   */
  get radius(): number;
  set radius(radius: number);
  /**
   * The center point of the circle defining teh sector. This field is read-only.
   * To move the shape to a new position, use {@link move2DToCoordinates} or {@link move2DToPoint}.
   */
  get center(): Point;
  /**
   * The focus point. This field is read-only.
   */
  get focusPoint(): Point;
  /**
   * The start angle. It is defined as an azimuth: degrees, clockwise, starting up/north. This field is mutable.
   */
  get startAzimuth(): number;
  set startAzimuth(startAzimuth: number);
  /**
   * The angle over which the shape extends, in degrees, positive clockwise. This field is mutable.
   */
  get sweepAngle(): number;
  set sweepAngle(sweepAngle: number);
  get bounds(): Bounds;
  /**
   * Moves the center point to another location.
   * The passed x and y coordinates are expressed in the reference.
   * The passed coordinates will become the coordinates of the center point.
   * @param x the x coordinate of the point.
   * @param y the y coordinate of the point.
   */
  move2DToCoordinates(x: number, y: number): void;
  /**
   * Moves this center point to another location.
   * The center point will be moved to the location of the passed point.
   * The reference of the passed point must match the reference of the shape.
   * @param point the point to move the center point to.
   * @throws {@link InvalidReferenceError} when the reference of the Point parameter does not correspond with the reference of this shape.
   */
  move2DToPoint(point: Point): void;
  equals(aSector: Shape): boolean;
  contains2DCoordinates(aX: number, aY: number): boolean;
  translate2D(x: number, y: number): void;
  abstract copy(): Sector;
}