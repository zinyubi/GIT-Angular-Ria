import { CoordinateType } from "../reference/CoordinateType.js";
import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { Polygon } from "./Polygon.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * A polygon that can have a number of holes. A complex polygon should be created using {@link createComplexPolygon}.
 * A ComplexPolygon is defined as an array of {@link Polygon} instances. The first polygon - at index 0-  specifies the outer ring. All the other polygons are the holes.
 */
export declare class ComplexPolygon extends Shape {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  get type(): ShapeType;
  get coordinateType(): CoordinateType;
  /**
   * The number of polygons in this ComplexPolygon
   */
  get polygonCount(): number;
  get focusPoint(): Point | null;
  get bounds(): Bounds | null;
  contains2DCoordinates(x: number, y: number): boolean;
  /**
   * Get a polygon from this ComplexPolygon
   * @param index
   * @return The polygon at the requested index, or undefined if the index is larger
   *  than polygonCount
   */
  getPolygon(index: number): Polygon;
  /**
   * Adds a polygon at the end of this complex polygon.
   * @param polygon The polygon to add.
   * @throws {@link InvalidReferenceError} if the polygon's spatial reference does not match this complex polygon's spatial reference.
   */
  addPolygon(polygon: Polygon): void;
  /**
   * Adds a polygon at the specified index of this complex polygon.
   * @param index the index at which to insert a polygon, must be between 0
   * and the number of polygons in this complex polygon. If the index is 0, the polygon is the outer ring which must enclose
   * all other polygons. Is the index a higher number, the polygon is a hole.
   * @param polygon The polygon to insert when the first parameter is an index.
   * @throws {@link InvalidReferenceError} if the polygon's spatial reference does not match this complex polygon's spatial reference.
   */
  addPolygon(index: number, polygon: Polygon): void;
  /**
   * Adds one or more polygons to this complex polygon.
   * @param polygons the polygons to add
   * @throws {@link InvalidReferenceError} if any of the polygon's spatial reference does not match this complex polygon's spatial reference.
   */
  addPolygons(polygons: Polygon[]): void;
  /**
   * Removes all polygons from this complex polygon. This method will remove
   * both the exterior ring as well as the inner rings.
   */
  clearPolygons(): void;
  /**
   * Removes the polygon at the specified index from this complex polygon.
   * @param index the index of the polygon that should be removed
   * that should be removed itself
   * @return the removed polygon
   */
  removePolygon(index: number): Polygon | null;
  /**
   * Removes a specific polygon from this complex polygon.
   * @param polygon the polygon that should be removed
   * that should be removed itself
   * @return the removed polygon
   */
  removePolygon(polygon: Polygon): Polygon | null;
  /**
   * Removes one or more polygons to this complex polygon.
   * @param polygons the polygons to remove
   */
  removePolygons(polygons: Polygon[]): void;
  /**
   * Replaces the polygon at the given index with the specified polygon.
   * @param index the index of the polygon to set. The index value must fall in the valid index range: <code>0 <= index < {number of polygons in the ComplexPolygon}</code>.
   * If this index equals <code>0</code>, than the polygon must be the outerring, enclosing all the holes.
   * If it  is higher, than the polygon must be a hole.
   * @param polygon the polygon to set
   * @throws {@link InvalidReferenceError} if the polygon's spatial reference does not match this complex polygon's spatial reference.
   */
  setPolygon(index: number, polygon: Polygon): Polygon;
  /**
   * Notifies this complex polygon that the given polygon (or the polygon at the specified index) has changed.
   * @param polygonOrIndex the polygon (or index of the polygon) that changed
   */
  polygonChanged(polygonOrIndex: Polygon | number): void;
  copy(): ComplexPolygon;
  equals(otherComplexPolygon: Shape): boolean;
  toString(): string;
  /**
   * Translates all the polygons in this complex polygon over the given vector in 2D space.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  translate2D(x: number, y: number): void;
}