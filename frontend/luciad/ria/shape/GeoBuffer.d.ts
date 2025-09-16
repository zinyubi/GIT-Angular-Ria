import { EndCapStyle } from "./EndCapStyle.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * A GeoBuffer represents all points whose distance to the base shape is less than or equal to a certain
 * distance.
 *
 * A buffer is an area around a given shape, adding a fixed width to the shape.
 *
 * The contour of the buffer is a polygon in which each exterior point lies
 * at a fixed distance from the line segments of the base shape.
 *
 * The {@link isSupportedBaseShape supported base shapes} are polylines and polygons.
 *
 * For open base shapes (polylines), it is possible specify a CAP_BUTT end style
 * (see {@link EndCapStyle} enumeration) that cuts off the buffer at
 * the start and end of the base shape.
 */
export declare abstract class GeoBuffer extends Shape {
  get type(): ShapeType;
  get focusPoint(): Point | null;
  /**
   * The base shape of this buffer.
   */
  get baseShape(): Shape;
  set baseShape(baseShape: Shape);
  /**
   * The width of this buffer, expressed in meters and measured from the line segments of the base shape to the contour.
   * The width must be positive.
   */
  get width(): number;
  set width(width: number);
  /**
   * The end cap style of this buffer, which defines the representation of the contour at the endings of the base shape.
   * This is a member of the {@link EndCapStyle} enumeration. By default, CAP_ROUND is used.
   */
  get endCapStyle(): EndCapStyle;
  set endCapStyle(endCapStyle: EndCapStyle);
  equals(shape: Shape): boolean;
  translate2D(x: number, y: number): void;
  toString(): string;
  /**
   * Returns the contour of the Geobuffer, as a shape.
   * By definition, the contour of the buffer is constructed by creating a closed polygon
   * around the axis, in which each point lies at a distance equal to the width from the axis
   * - except for the end points, which can have a custom style.
   * The contour is modeled as a complex polygon (i.e., a composite polygon consisting of one or more polygons
   * that each define an edge of the contour). In the simplest form, the contour is represented
   * by a single polygon. In cases where the buffer intersects with itself,
   * holes are formed and multiple polygons are used to define the contour.
   *
   * This method returns a copy of the contour. Modifying it will not have any effect on the geobuffer visualization.
   *
   * @return GeoBuffer contour as a complex polygon.
   * @since 2023.0
   */
  get contour(): Shape;
  /**
   * Tests whether the given shape can be used as a base shape for a GeoBuffer.
   * <p/>
   * Currently GeoBuffer supports {@link Polyline} and {@link Polygon} as base shape.
   *
   * @param shape The shape to be tested.
   * @return Whether the shape is a possible base shape.
   */
  static isSupportedBaseShape(shape: Shape): boolean;
  abstract copy(): GeoBuffer;
}