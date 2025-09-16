import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor that allows editing and creation of features with a point list ({@link Polyline polyline}) shape.
 *
 * <h4>Handles</h4>
 * The point list editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/polyline_handles.png"
 *         alt="PointListEditor handles for polylines"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>PointListEditor handles for polylines</td>
 *   </tr>
 * </table>
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/polygon_handles.png"
 *         alt="PointListEditor handles for polygons"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>PointListEditor handles for polygons</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createPointListTranslateHandle Point list translate handles} (A)</b>:
 *          With these handles, the user can translate (move) the individual points in the point list.
 *          The user can do this by dragging the handle.
 *   </li>
 *   <li><b>{@link createPointListInsertHandle Point list insert handles} (B)</b>:
 *          With these handles, the user can insert new points in the individual points in the point list.
 *          The user can do this by dragging the handle.
 *   </li>
 *   <li><b>{@link createPointListDeleteHandle Point list delete handles} (A)</b>:
 *          These handles aren't visible, but they're at the same location as the translate handles.
 *          With these handles, the user can remove individual points from the point list.
 *          The user can do this by clicking the handle while a modifier key (CTRL, SHIFT, ALT) is pressed.
 *          Alternatively, the user can right-click the handle to delete a point via the context menu.
 *          For touch, handles can be deleted by long-pressing the handle.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints a helper line for the point list.
 *          This helper line is only visible for 3D polylines on 3D maps.
 *          It is the projection of the 3D polyline onto terrain.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          This translates (moves) the entire {@link Polyline} shape.
 *          The light blue area in the the polygon's image above indicates where the shape translate handle is active.
 *          This includes the red stroke. For polylines, the handle is only active on the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link PointListEditor} uses the
 * {@link PointListCreateHandle}.
 *
 * Once creation starts, the user clicks (or taps) on the map to add points to the pointlist.
 * Once placed, the points cannot be moved or removed.
 *
 * If {@link EditSettings.freehand} is <code>true</code>, the user can start dragging the mouse near the last
 * created point to start "freehand" drawing. While "freehand" drawing is active, points are inserted automatically
 * under the mouse / finger.
 *
 * @since 2022.1
 */
export declare class PointListEditor extends Editor {
  /**
   * Creates a new {@link PointListEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.POLYLINE POLYLINE} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing an {@link Polyline}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createPointListTranslateHandle}</li>
   *   <li>{@link createPointListInsertHandle}</li>
   *   <li>{@link createPointListDeleteHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to translate the points in the point list.
   *
   * @return a {@link PointListTranslateHandle}.
   */
  createPointListTranslateHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to insert points in the point list.
   *
   * @return a {@link PointListInsertHandle}.
   */
  createPointListInsertHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to delete points from the point list.
   *
   * By default, this creates a {@link PointListDeleteHandle} with a <code>null</code>
   * {@link PointListDeleteHandle.handleIconStyle handleIconStyle}.
   *
   * @return a {@link PointListDeleteHandle}.
   */
  createPointListDeleteHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the point list.
   *
   * @return a {@link PointListHelperHandle}
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for point list ({@link Polyline}) creation.
   *
   * @return a {@link PointListCreateHandle}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}