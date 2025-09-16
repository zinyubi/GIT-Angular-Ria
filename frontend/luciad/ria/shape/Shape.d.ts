import { CoordinateReference } from "../reference/CoordinateReference.js";
import { CoordinateReferenced } from "../reference/CoordinateReferenced.js";
import { CoordinateType } from "../reference/CoordinateType.js";
import { Bounded } from "./Bounded.js";
import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { ShapeType } from "./ShapeType.js";
/**
 * Shape interface. Each shape realizes this interface.
 * Use {@link ShapeFactory} methods to create shape instances, like a
 * {@link Point}, {@link Polyline}, {@link Polygon}, and other types.
 */
export declare abstract class Shape implements Bounded, CoordinateReferenced {
  /**
   * The type of the Shape. This is a member of the {@link ShapeType} enumeration.
   */
  abstract get type(): ShapeType;
  /**
   * The focus point of this shape.  This property is read only.  An error will be thrown when trying to
   * assign to this property.  This property contains an object but should be treated with value semantics:
   * changes to the shape will not be reflected in the focusPoint that was retrieved from this Polygon before
   * the modification.
   */
  abstract get focusPoint(): Point | null;
  /**
   * The bounds of this shape.  This property is to be treated in a read only manner.  An error will be
   * thrown when trying to assign to this property.  Note that the bounds property is not immutable.
   * Modifying properties of the bounds property may corrupt your data.
   */
  abstract get bounds(): Bounds | null;
  /**
   * The spatial reference of this shape.  This property is read only.  An Error will be thrown when trying
   * to assign to this property.
   */
  get reference(): CoordinateReference | null;
  /**
   * The coordinate type this shape.  This property is read only.  An Error will be thrown when trying
   * to assign to this property.
   */
  abstract get coordinateType(): CoordinateType;
  /**
   * <p>Determines whether a given point is inside this shape.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis or the (lon,lat)-axis
   * (depending on the spatial reference of the shape).</p>
   *
   * @param x The point for which containment must be checked.
   * If a 3D point is passed to this function, it will be treated as a 2D point:  the z
   * coordinate (height) will be ignored. The reference of this point must be the same
   * reference as this Shape
   * @return <code>true</code> when the given point is contained in this shape
   * @throws {@link InvalidReferenceError}
   * @deprecated Please use {@link Shape.contains2DPoint contains2DPoint} instead.
   */
  contains2D(x: Point | number | Bounds, y?: number): boolean;
  /**
   * Translates the shape over the given vector in 2D space.
   * @param x The x coordinate of the translation vector
   * @param y The y coordinate of the translation vector
   */
  abstract translate2D(x: number, y: number): void;
  /**
   * <p>Determines whether the given point is inside this shape.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis or the (lon,lat)-axis
   * (depending on the spatial reference of the shape).</p>
   *
   * @param x The x coordinate of the point for which containment must be checked
   * @param y The y coordinate of the point for which containment must be checked
   * @return <code>true</code> when the given point is contained in this shape
   */
  abstract contains2DCoordinates(x: number, y: number): boolean;
  /**
   * <p>Determines whether the given point is inside this shape.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis or the (lon,lat)-axis
   * (depending on the spatial reference of the shape).</p>
   *
   * @param point The point for which containment must be checked.
   * @return <code>true</code> when the given point is contained in this shape
   * @throws {@link InvalidReferenceError} when a point has another spatial reference
   */
  contains2DPoint(point: Point): boolean;
  /**
   * Converts the shape to a string. This functionality is for debugging purposes only. Results of toString cannot be
   * used to uniquely identify a shape instance.
   */
  abstract toString(): string;
  /**
   * Makes a deep clone of this shape.
   * @return a copy of this shape
   */
  abstract copy(): Shape;
  /**
   * Indicates whether this shape is equal to another.
   *
   * @param otherShape the other shape this shape is compared with.
   * @return <code>true</code> if both shapes are equal, <code>false</code> otherwise.
   */
  abstract equals(otherShape: Shape): boolean;
}