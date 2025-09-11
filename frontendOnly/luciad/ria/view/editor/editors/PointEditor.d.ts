import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor that is used to edit and create features with a {@link Point} shape.
 *
 * <h4>Editing</h4>
 * This editor does not have {@link getEditHandles edit handles}, it only has a {@link createTranslateHandle translate handle}
 * to translate the point.
 *
 * <h4>Creation</h4>
 * Creation uses a {@link PointCreateHandle}.
 * After creation starts, the user clicks or taps once on the map to place the point.
 *
 * @since 2022.1
 */
export declare class PointEditor extends Editor {
  /**
   * Creates a new {@link PointEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.POINT POINT} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Creates a handle to translate (move) the point.
   *
   * @return a {@link ShapeTranslateHandle}
   * in the sense that it has snapping capabilities.
   */
  createTranslateHandle(context: EditContext): EditHandle | null;
  /**
   * Creates a handle for creating points.
   *
   * @return a {@link PointCreateHandle}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}