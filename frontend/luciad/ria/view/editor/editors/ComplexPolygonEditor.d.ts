import { Shape } from "../../../shape/Shape.js";
import { ComposedShapeEditor } from "./ComposedShapeEditor.js";
import { Editor } from "../Editor.js";
/**
 * An editor for features with {@link ShapeType.COMPLEX_POLYGON complex polygon} shapes.
 * See {@link ComposedShapeEditor} for more information.
 *
 * This editor only supports editing the polygons in a ComplexPolygon.
 * It does not support creation of complex polygons.
 * It also does not support adding and removing polygons to the complex polygons.
 *
 * @since 2022.1
 */
export declare class ComplexPolygonEditor extends ComposedShapeEditor {
  /**
   * Creates a new ComplexPolygonEditor
   * @param delegate the editor to delegate sub-shape {@link getEditHandles} to.
   */
  constructor(delegate: Editor);
  getSubShapeCount(shape: Shape): number;
  getSubShape(shape: Shape, index: number): Shape;
}