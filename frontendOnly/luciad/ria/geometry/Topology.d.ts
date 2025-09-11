import { Shape } from "../shape/Shape.js";
import { Point } from "../shape/Point.js";
/**
 * An intersection segment contains information about the shape and its segments included in the intersection.
 */
export interface IntersectionSegment {
  /**
   * The shape the segment belongs to
   */
  shape: Shape;
  /**
   * The points composing the segment
   */
  points: Point[];
}
/**
 * An intersection contains a point of intersection as well as an array of segments. The segments array contains a segment information object for each shape.
 */
export interface Intersection {
  /**
   * The point of intersection, result of the operation
   */
  intersectionPoint: Point;
  /**
   * The segments results of the operation
   */
  intersectionSegments: IntersectionSegment[];
}
/**
 * A <code>Topology</code> instance offers a number of geometric operations for a particular topology.
 * Currently only the calculation of intersections between two {@link Shape} instances is supported.
 *
 * Instances of this interface must be created using the factory methods from the {@link TopologyFactory} module.
 */
export interface Topology {
  /**
   * Calculates intersection points between two {@link Shape} instances.  The intersection points are
   * returned in an array.  For each intersection point, for each shape, the segments on which the
   * intersection occurs are returned.  Segments are two consecutive points in a shape, expect if the shape is a
   * {@link Point}.  The format of the response is illustrated in the example below, where a
   * line is intersected with a square.
   *
   * ```
   *     ^
   *     |
   *   9 +           +-----------------------+
   *     |           |                       |
   *     |           |                       |
   *     |     (3,6) |                       | (9, 6)
   *   6 +       ====+=======================+====
   *     |           |                       |
   *     |           |                       |
   *     |           |                       |
   *   3 +           +-----------------------+
   *     |
   *     |
   *     |
   *     +---+---+---+---+---+---+---+---+---+---+---->
   *                 3                       9
   * ```
   * ```javascript
   * var polyline = createPolyline(ref, [
   *   createPoint(ref, [2, 6]),
   *   createPoint(ref, [10, 6])
   * ]);
   * var polygon = createPolygon(ref, [
   *   createPoint(ref, [3, 3]),
   *   createPoint(ref, [3, 9]),
   *   createPoint(ref, [9, 9]),
   *   createPoint(ref, [9, 3])
   * ]);
   * var result = topology.calculateIntersections(polyline, polygon);
   * ```
   *
   * `result` is an array with meta data for two intersection points:
   * ```javascript
   * [
   *   {
   *     intersectionPoint: luciad.shape.Point<3, 6>,
   *     intersectionSegments: [
   *       {
   *         shape: luciad.shape.Polyline[<2, 6>, <10, 6>],
   *         points: [luciad.shape.Point<2, 6>, luciad.shape.Point<10, 6>]
   *       },
   *       {
   *         shape: luciad.shape.Polygon[<3, 3>, <3, 9>, <9, 9>, <9, 3>],
   *         points: [luciad.shape.Point<3, 3>, luciad.shape.Point<3, 9>]
   *       }
   *     ]
   *   },
   *   {
   *     intersectionPoint: luciad.shape.Point<9, 6>,
   *     intersectionSegments: [
   *       {
   *         shape: luciad.shape.Polyline[<2, 6>, <10, 6>],
   *         points: [luciad.shape.Point<2, 6>, luciad.shape.Point<10, 6>]
   *       },
   *       {
   *         shape: luciad.shape.Polygon[<3, 3>, <3, 9>, <9, 9>, <9, 3>],
   *         points: [luciad.shape.Point<9, 9>, luciad.shape.Point<9, 3>]
   *       }
   *     ]
   *   }
   * ]
   * ```
   * @param shape0 The first shape to be intersected.
   * @param shape1 The second shape to be intersected.
   *
   * @return An array of intersection point metadata.
   */
  calculateIntersections(shape0: Shape, shape1: Shape): Intersection[];
}