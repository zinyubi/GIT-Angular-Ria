import { Shape } from "@luciad/ria/shape/Shape.js";
/**
 *
 * Offers methods to perform boolean operations on shapes. Use {@link ConstructiveGeometryFactory}
 * to create instances of this class. For geodesy calculations see {@link Geodesy}. The following shapes are supported:
 * <p>
 *  <ul>
 *    <li>{@link Point} </li>
 *    <li>{@link Polyline} </li>
 *    <li>{@link Polygon} </li>
 *    <li>{@link ComplexPolygon} </li>
 *    <li>{@link ShapeList} containing any of the supported shapes</li>
 *  </ul>
 * </p>
 * <p>
 *   The resulting shapes will also be <code>Point</code>, <code>Polyline</code>, <code>Polygon</code>, <code>ComplexPolygon</code> instances,
 *   or <code>ShapeList</code> instances containing those shapes.
 *   For example:
 * </p>
 * <ul>
 *   <li>
 *     {@link Point} results from:
 *     <ul>
 *       <li>The union or intersection of two points on top of each other</li>
 *       <li>The intersection of a polygon touching another shape with a corner</li>
 *       <li>The intersection of a polygon touching another shape with a corner</li>
 *     </ul>
 *   </li>
 *   <li>
 *     {@link Polyline} results from:
 *     <ul>
 *       <li>Set operations with polylines</li>
 *       <li>The intersection of filled shapes that touch each other with their boundary</li>
 *     </ul>
 *   </li>
 *   <li>
 *     {@link ComplexPolygon} results from set operations with filled shapes.
 *   </li>
 *   <li>
 *     {@link ShapeList} with multiple elements.  This occurs if the result consists
 *     of multiple polylines, for example, or a combination of points, polylines and polygons.
 *   </li>
 *   <li>
 *     {@link ShapeList} without elements: represents an empty result, for example the intersection
 *     between two disjoint shapes.
 *   </li>
 * </ul>
 */
export interface ConstructiveGeometry {
  /**
   * <p>Calculates the union of the given shapes. The resulting shape contains all points that are
   * contained in any of the given shapes. The returned shape may be any type of shape, or a shape
   * list of multiple shapes, depending on what is required to describe the resulting shape.</p>
   *
   * <p>For example, the union of the red and blue shape is the resulting green shape:</p>
   * <img src="media://constructivegeometry/cg_union.png" alt="ConstructiveGeometry.union illustration"/>
   *
   * @param shapes The operands of the boolean operation. There must be at least two shapes.
   * @return the result of the boolean operation.
   */
  union(shapes: Shape[]): Shape;
  /**
   * <p>Calculates the intersection of the given shapes. The resulting shape only contains points that
   * are contained in all of the given shapes. The returned shape may be any type of shape, or a
   * shape list of multiple shapes, depending on what is required to describe the resulting shape.</p>
   *
   * <p>For example, the intersection of the red and blue shape is the green shape:</p>
   * <img src="media://constructivegeometry/cg_intersection.png" alt="ConstructiveGeometry.intersection illustration"/>
   *
   * @param shapes The operands of the boolean operation. There must be at least two shapes.
   * @return the result of the boolean operation.
   */
  intersection(shapes: Shape[]): Shape;
  /**
   * <p>Calculates the difference of the given shapes. All next shapes are subtracted from the first
   * shape. The returned shape may be any type of shape, or a shape list of multiple shapes,
   * depending on what is required to describe the resulting shape.</p>
   *
   * <p>For example, the difference of the red and blue shape is the green shape:</p>
   * <img src="media://constructivegeometry/cg_difference.png" alt="ConstructiveGeometry.difference illustration"/>
   *
   * @param shapes The operands of the boolean operation. There must be at least two shapes.
   * @return the result of the boolean operation.
   */
  difference(shapes: Shape[]): Shape;
}