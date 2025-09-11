import { Shape } from "./Shape.js";
import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { ShapeType } from "./ShapeType.js";
/**
 * Represents a Bézier curve.
 * A Bézier curve is defined by ordered control points:
 * <ul>
 *   <li>Three control points for a quadratic curve</li>
 *   <li>Four control points for a cubic curve</li>
 * </ul>
 *
 * The API allows modifying the position of these points.
 *
 * Concrete instances of Bézier curves should be created using the factory functions
 * {@link createQuadraticBezierCurve} and {@link createCubicBezierCurve}.
 *
 * @since 2024.1
 */
export declare abstract class BezierCurve extends Shape {
  /**
   * Returns the type of the shape as a bitwise combination of {@link ShapeType} values.
   * If the curve is quadratic, it returns {@link ShapeType.BEZIER_CURVE} | {@link ShapeType.BEZIER_CURVE_QUADRATIC}.
   * If the curve is cubic, it returns {@link ShapeType.BEZIER_CURVE}  | {@link ShapeType.BEZIER_CURVE_CUBIC}.
   */
  get type(): ShapeType;
  get focusPoint(): Point;
  get bounds(): Bounds;
  invalidate(): void;
  /**
   * Returns the start point (first control point) of the Bézier curve.
   */
  getStartPoint(): Point;
  /**
   * Returns the end point (last control point) of the Bézier curve.
   */
  getEndPoint(): Point;
  /**
   * Computes and returns a point on the curve corresponding to the provided parameter value.
   * The parameter should range from 0 to 1 inclusive, where:
   * <ul>
   *  <li>A parameter of 0 corresponds to the start point of the curve.</li>
   *  <li>A parameter of 1 corresponds to the end point of the curve.</li>
   *  <li>For parameter values between 0 and 1, a point along the curve between the start and end points is returned.</li>
   *  </ul>
   * @param param the parameter value, within [0,1], to compute the point location for.
   * @return the computed point on the curve.
   */
  interpolate(param: number): Point;
  contains2DPoint(point: Point): boolean;
  contains2DCoordinates(x: number, y: number): boolean;
  translate2D(x: number, y: number): void;
  /**
   * Moves the control point at the specified index to a new 2D location.
   *
   * @param index - The zero-based index of the control points.
   * @param newLocation - The new location to which the control point should be moved.
   * @throws {@link ProgrammingError} If the index is out of range of the control points array.
   */
  moveControlPoint(index: number, newLocation: Point): void;
  toString(): string;
  equals(otherShape: Shape): boolean;
  /**
   * Returns the control point at the specified index within the list of the control points.
   *
   * <ul>
   *   <li>There are three control points for a quadratic curve.</li>
   *   <li>There are four control points for a cubic curve.</li>
   * </ul>
   *
   * @param index The zero-based index of the control point.
   * @throws {@link ProgrammingError} If the index is out of range of the control points array.
   */
  getControlPoint(index: number): Point;
  /**
   * Returns the count of control points defining the Bézier curve.
   * For a quadratic curve, it returns 3.
   * For a cubic curve, it returns 4.
   */
  getControlPointCount(): number;
}