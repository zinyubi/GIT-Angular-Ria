import { Shape } from "../../../shape/Shape.js";
import { ComposedShapeEditor } from "./ComposedShapeEditor.js";
import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor for features with {@link ShapeType.SHAPE_LIST shape list} shapes.
 * See {@link ComposedShapeEditor} for more information.
 *
 * This editor only supports editing the shapes in a shape list.
 * It does not support creation of shape lists.
 * It also does not support adding and removing polygons to the shape list.
 *
 * @since 2022.1
 */
export declare class ShapeListEditor extends ComposedShapeEditor {
  /**
   * Creates a new ShapeListEditor
   * @param delegate the editor to delegate sub-shape {@link getEditHandles} to.
   */
  constructor(delegate: Editor);
  getSubShapeCount(shape: Shape): number;
  getSubShape(shape: Shape, index: number): Shape;
  getCreateHandle(context: EditContext): EditHandle | null;
}