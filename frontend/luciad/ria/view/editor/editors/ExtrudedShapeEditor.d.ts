import { Shape } from "../../../shape/Shape.js";
import { ComposedShapeEditor } from "./ComposedShapeEditor.js";
import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor for features with {@link ShapeType.EXTRUDED_SHAPE extruded shape} shapes.
 * See {@link ComposedShapeEditor} for more information.
 *
 * Note that creation of extruded shapes is not supported by this editor.
 * In your application, you can implement a similar approach as in LuciadRIA samples:
 * When a user right-clicks a {@link ExtrudedShape.isSupportedBaseShape valid base shape}, the user can
 * convert that shape to an extruded shape.
 *
 * @since 2022.1
 */
export declare class ExtrudedShapeEditor extends ComposedShapeEditor {
  /**
   * Creates a new ExtrudedShapeEditor
   * @param delegate the editor to delegate sub-shape {@link getEditHandles} to.
   */
  constructor(delegate: Editor);
  getSubShapeCount(shape: Shape): number;
  getSubShape(shape: Shape, index: number): Shape;
  /**
   * Returns a set of handles for editing an {@link ExtrudedShape}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createBaseShapeHandles}</li>
   *   <li>{@link createMinHeightHandle}</li>
   *   <li>{@link createMaxHeightHandle}</li>
   *   <li>{@link createHeightHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates a point handle to change the {@link ExtrudedShape.minimumHeight minimum height} of the extruded shape.
   */
  createMinHeightHandle(context: EditContext): EditHandle | null;
  /**
   * Creates a point handle to change the {@link ExtrudedShape.maximumHeight maximum height} of the extruded shape.
   */
  createMaxHeightHandle(context: EditContext): EditHandle | null;
  /**
   * Creates a point handle to change the
   * {@link ExtrudedShape.maximumHeight maximum height} of the extruded shape,
   * by dragging the extruded shape itself.
   */
  createHeightHandle(context: EditContext): EditHandle | null;
  /**
   * Creates a handle that draws helper lines for the extruded shape.
   *
   * @return a {@link ExtrudedShapeHelperHandle}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Creates the edit handles for editing the base shape of the extruded shape.
   *
   * The default implementation delegates to {@link ComposedShapeEditor.getEditHandles}.
   *
   * @param context The editing context
   */
  createBaseShapeHandles(context: EditContext): EditHandle[];
  createTranslateHandle(context: EditContext): EditHandle | null;
  /**
   * Creation of extruded shapes is not supported by this editor.
   *
   * In your application, you can implement a similar approach as in LuciadRIA samples:
   * When a user right-clicks a {@link ExtrudedShape.isSupportedBaseShape valid base shape}, the user can
   * convert that shape to an extruded shape.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}