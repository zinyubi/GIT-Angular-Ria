import { Editor } from "../Editor.js";
import { BoundsResizeHandleIdentifier } from "../handles/BoundsResizeHandleIdentifier.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor that allows editing and creation of features with a {@link Bounds bounds} shape.
 *
 * <h4>Handles</h4>
 * The bounds editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/bounds_handles.png"
 *         alt="BoundsEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>BoundsEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createBoundsResizeHandle Bounds resize handles} (A)</b>:
 *          by dragging one of these handles, the user moves the corresponding corner of the bounds.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link Bounds} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link BoundsCreateHandle}.
 * @since 2022.1
 */
export declare class BoundsEditor extends Editor {
  /**
   * Creates a new {@link BoundsEditor}.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.BOUNDS BOUNDS} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing a {@link Bounds}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link BoundsResizeHandleIdentifier corner}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to change the bounds by dragging a corner.
   * This method is called 4 times by {@link BoundsResizeHandleIdentifier corner}.
   *
   * @param context The edit context
   * @param identifier The identifier for the corner
   */
  createBoundsResizeHandle(context: EditContext, identifier: BoundsResizeHandleIdentifier): EditHandle | null;
  /**
   * Called whenever one of the {@link BoundsResizeHandle.on flipped}.
   *
   * This notifies all handles that they should update their {@link BoundsResizeHandleIdentifier}.
   *
   * @see {@link BoundsResizeHandle.flip}
   *
   * @param flipHorizontal Indicates that a horizontal flip has occurred
   * @param flipVertical Indicates that a vertical flip has occurred
   */
  flipResizeHandles(flipHorizontal: boolean, flipVertical: boolean): void;
  /**
   * Creates a handle that allows the user to create a {@link Bounds bounds shape}.
   * @param context The edit context
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}