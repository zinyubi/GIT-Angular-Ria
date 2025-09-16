import { Shape } from "../../../shape/Shape.js";
import { ShapeType } from "../../../shape/ShapeType.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * Abstract base editor for "composed shapes".
 * These are shapes with nested shapes, such as a {@link ShapeType.SHAPE_LIST shape list}
 * , a {@link ShapeType.EXTRUDED_SHAPE extruded shape}.
 *
 * All the shapes in the composed shape are {@link Editor.createTranslateHandle moved} together.
 *
 * For the sub-shape {@link Editor}.
 *
 * @since 2022.1
 */
export declare abstract class ComposedShapeEditor extends Editor {
  /**
   * Constructs a new ComposedShapeEditor
   *
   * @param shapeType The shape type that this editor supports, for use in {@link canEdit}
   * @param delegate The editor to delegate to, to get sub-shape {@link getEditHandles handles}.
   */
  constructor(shapeType: ShapeType, delegate: Editor);
  /**
   * Returns the number of sub-shapes of the given shape.
   *
   * @see {@link ShapeList.shapeCount}
   * @see {@link ComplexPolygon.polygonCount}
   * @param shape The shape to determine the number of sub-shapes for
   */
  abstract getSubShapeCount(shape: Shape): number;
  /**
   * Returns the subshape at the given index.
   *
   * @see {@link ShapeList.getShape}
   * @see {@link ComplexPolygon.getPolygon}
   * @param shape The shape to get a subshape from
   * @param index The index of the subshape
   */
  abstract getSubShape(shape: Shape, index: number): Shape;
  /**
   * Returns the shape type, as passed into the constructor.
   */
  protected get shapeType(): ShapeType;
  /**
   * Returns the delegate, as passed into the constructor.
   */
  protected get delegate(): Editor;
  /**
   * Indicates whether this editor can edit the given context.
   *
   * @return <code>true</code> if {@link EditContext.shape context.shape} matches the shape type defined in the constructor,
   *         and the delegate can edit all subshapes.
   */
  canEdit(context: EditContext): boolean;
  createTranslateHandle(context: EditContext): EditHandle | null;
  getEditHandles(context: EditContext): EditHandle[];
  getCreateHandle(context: EditContext): EditHandle | null;
}