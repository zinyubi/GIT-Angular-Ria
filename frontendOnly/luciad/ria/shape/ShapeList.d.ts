import { CoordinateType } from "../reference/CoordinateType.js";
import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
/**
 * A ShapeList is a {@link Shape} that consists of a finite number of other shapes, arranged in an order.
 * A ShapeList must be instantiated using the {@link createShapeList} function.
 */
export declare class ShapeList extends Shape {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  get type(): ShapeType;
  /**
   * Remove the shape at the given index from the ShapeList
   * @param index The index of the shape that must be removed.
   * @throws {@link ProgrammingError} If the index is not defined ( 0 <= index < pointCount )
   */
  removeShape(index: number): void;
  copy(): ShapeList;
  /**
   * Get the shape from this ShapeList at the given index.   If the index is larger or equal than pointCount,
   * undefined will be returned.
   * @param index
   * @return the shape at the index or undefined.
   */
  getShape(index: number): Shape;
  /**
   * returns the amount of shapes in this ShapeList
   */
  get shapeCount(): number;
  get focusPoint(): Point | null;
  get bounds(): Bounds | null;
  /**
   * Add a shape to the end of the ShapeList or at the given index.
   * @param  shapeOrIndex index The index at which the shape must be inserted into the list.
   * It must be between 0 and the length of the shapelist. Or the shape that must be added at the end of the ShapeList.
   * @param maybeShape The shape that must be inserted at the given index.
   * @throws {@link InvalidReferenceError} If the shape's reference does not correspond with the spatial reference of the ShapeList.
   * @throws {@link ProgrammingError} If the index passed is smaller than zero or larger than the length of the list.
   */
  addShape(shapeOrIndex: number | Shape, maybeShape?: Shape): void;
  get coordinateType(): CoordinateType;
  /**
   * Returns true if every shape in this shape list is equal
   * to the shape at the same index in the other shape list.
   * @param shapelist a shapelist to compare to this list
   * @return {Boolean} true if equal, false otherwise
   */
  equals(shapelist: Shape): boolean;
  contains2DCoordinates(x: number, y: number): boolean;
  toString(): string;
  /**
   * Translates all the shapes in this shapelistshape over the given vector in 2D space.
   * @param x x coordinate value
   * @param y y coordinate value
   */
  translate2D(x: number, y: number): void;
}