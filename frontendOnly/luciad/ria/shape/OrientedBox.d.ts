import { CoordinateType } from "../reference/CoordinateType.js";
import { Affine3DTransformation } from "../transformation/Affine3DTransformation.js";
import { Vector3 } from "../util/Vector3.js";
import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * An OrientedBox is a 3D shape, composed of eight corner points, that forms a straight-edged volume.
 * Unlike a conventional 3D bounding box, that is aligned to the axes of its reference system, an OrientedBox can adopt
 * any arbitrary orientation, which is determined by its associated {@link Affine3DTransformation} object.
 *
 * Because `OrientedBox` relies on Cartesian coordinates for defining its shape, it's not available for geodetic references.
 *
 * Note: OrientedBox instances should be created using the {@link createOrientedBox} factory function.
 */
export declare class OrientedBox extends Shape {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  /**
   * <p>Determines whether the given point is inside this oriented box.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis.</p>
   * <p>Note that since oriented box is a 3D shape, this function will perform its calculation on a projected version
   * of the box.</p>
   * @param point The point for which containment must be checked.
   * @returns <code>true</code> when the given point is contained in this shape
   * @throws {@link InvalidReferenceError} when passing a {@link Point} with another spatial
   * reference
   */
  contains2DPoint(point: Point): boolean;
  /**
   * <p>Determines whether the given point is inside this oriented box.  This method checks
   * containment only in two dimensions:  on the (x,y)-axis</p>
   * <p>Note that since oriented box is a 3D shape, this function will perform its calculation on a projected version
   * of the box.</p>
   * @param  x The x coordinate of the point for which containment must be checked
   * @param  y The y coordinate of the point for which containment must be checked
   * @returns <code>true</code> when the given point is contained in this shape
   * @throws {@link InvalidReferenceError} when passing a {@link Point} with another spatial
   * reference
   */
  contains2DCoordinates(x: number, y: number): boolean;
  /**
   * Determines whether a given point, specified in three dimensions (x, y, z), is inside this oriented box.
   *
   * @param point The Point instance to check for containment within the oriented box.
   * @return `true` if the specified point is contained within this oriented box, `false` otherwise.
   * @throws {@link ProgrammingError} when the `point` has a different reference than the reference of this oriented box.
   * @since 2024.0
   */
  contains3DPoint(point: Point): boolean;
  /**
   * Determines whether a given point, specified by its x, y, and z coordinates, is inside this oriented box.
   *
   * The caller of this method must ensure that the provided x, y, and z coordinates are defined in
   * the same spatial reference system as this shape. Otherwise, the containment check results might be incorrect.
   *
   * @param x The x-coordinate to check for containment within the oriented box
   * @param y The y-coordinate to check for containment within the oriented box
   * @param z The z-coordinate to check for containment within the oriented box
   * @return `true` if the specified point is contained in this oriented box, `false` otherwise.
   * @since 2024.0
   */
  contains3DCoordinates(x: number, y: number, z: number): boolean;
  copy(): OrientedBox;
  equals(otherShape: Shape): boolean;
  /**
   * <p>Gets the 8 corners of this <code>OrientedBox</code>, in the form of an array of Vector3 objects.</p>
   * @return an array of coordinates.
   */
  getCorners(): Vector3[];
  /**
   * <p>Gets the 8 corners of this <code>OrientedBox</code>, in the form of an array of Point objects.</p>
   * <p>Note that this is a convenience method that will create copies of the corner points as {@link Point}
   * objects. </p>
   * @return an array of {@link Point} objects that are copies corner points of this oriented box.
   */
  getCornerPoints(): Point[];
  /**
   * Converts the oriented box to a string. This functionality is for debugging purposes only. Results of toString cannot be
   * used to uniquely identify a shape instance.
   * @return  a string version of this oriented box
   */
  toString(): string;
  /**
   * Translates the shape over the given vector in 2D space. The z-coordinate is not touched
   * @param x  The x coordinate of the translation vector
   * @param y  The y coordinate of the translation vector
   */
  translate2D(x: number, y: number): void;
  /**
   * Translates the shape over the given vector in 3D space.
   * @param x  The x coordinate of the translation vector
   * @param y  The y coordinate of the translation vector
   * @param z  The z coordinate of the translation vector
   */
  translate3D(x: number, y: number, z: number): void;
  /**
   * <p>Applies an {@link Affine3DTransformation} transformation to this oriented box.</p>
   * Note: Currently, only Cartesian transformations are supported.
   * @param transformation The {@link Affine3DTransformation} instance representing the Cartesian transformation
   */
  transform(transformation: Affine3DTransformation): void;
  /**
   * Invalidate cache of this oriented box.
   */
  invalidate(): void;
  /**
   * Retrieves the read-only center point of this oriented box.
   * This property contains an object but should be treated with value semantics:
   * changes to the shape will not be reflected in the focusPoint that was retrieved from this Polygon before
   * the modification.
   */
  get focusPoint(): Point;
  get bounds(): Bounds;
  get coordinateType(): CoordinateType;
  get type(): ShapeType;
}