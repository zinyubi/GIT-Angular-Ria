import { CoordinateReference } from "../reference/CoordinateReference.js";
import { Bounds } from "./Bounds.js";
import { Point } from "./Point.js";
import { Shape } from "./Shape.js";
import { ShapeType } from "./ShapeType.js";
import { CoordinateType } from "../reference/CoordinateType.js";
/**
 * An ExtrudedShape represents a 3D geometry created by extruding a 2D shape.
 *
 * The extruded shape is based on a 2D {@link baseShape base shape},
 * with a {@link minimumHeight minimum height} and a {@link maximumHeight maximum height}.
 * Both values are expressed in the unit of measure of the georeference of the extruded shape.
 * For geodetic references, this is meters.
 * These values can be defined relative to the geoid, or the terrain, depending on the reference.
 * Also have a look at {@link ReferenceProvider}.
 *
 * The minimum and maximum height form the bottom and top boundaries of the geometry.
 *
 * The {@link isSupportedBaseShape} supported base shapes include all 2D line and area shapes.
 *
 * @typeParam TShape - Represents the specific {@link Shape} type of the `baseShape` that is extruded.
 */
export declare class ExtrudedShape<TShape extends Shape = Shape> extends Shape {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  get type(): ShapeType;
  get focusPoint(): Point | null;
  /**
   * The base shape of this extruded shape.
   */
  get baseShape(): TShape;
  set baseShape(baseShape: TShape);
  /**
   * The minimum height of this extruded shape, expressed in the unit of measure of the georeference of this
   * extruded shape. For geodetic references, this is meters. This value can be defined relative to the geoid,
   * or the terrain, depending on the reference. Also have a look at {@link ReferenceProvider}.
   *
   * It represents the bottom/lower boundary of the volume.
   * The minimum height must be lower than or equal to the maximum height.
   */
  get minimumHeight(): number;
  set minimumHeight(minimumHeight: number);
  /**
   * The maximum height of this extruded shape, expressed in the unit of measure of the georeference of this
   * extruded shape. For geodetic references, this is meters.This value can be defined relative to the geoid,
   * or the terrain, depending on the reference. Also have a look at {@link ReferenceProvider}.
   *
   * It represents the top/upper boundary of the volume.
   * The maximum height must be higher than or equal to the minimum height.
   */
  get maximumHeight(): number;
  set maximumHeight(maximumHeight: number);
  equals(extrudedShape: Shape): boolean;
  translate2D(x: number, y: number): void;
  toString(): string;
  /**
   * Tests whether the given shape can be used as a base shape for an ExtrudedShape.
   * <p/>
   * Currently ExtrudedShape supports all 2D line or area shapes.
   *
   * @param shape The shape to be tested.
   * @return Whether the shape is a possible base shape.
   */
  static isSupportedBaseShape(shape: Shape): boolean;
  get bounds(): Bounds | null;
  get reference(): CoordinateReference | null;
  get coordinateType(): CoordinateType;
  copy(): ExtrudedShape<TShape>;
  contains2DCoordinates(x: number, y: number): boolean;
}