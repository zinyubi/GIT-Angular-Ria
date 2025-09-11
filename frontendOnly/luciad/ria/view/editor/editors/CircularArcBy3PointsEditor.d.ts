import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * An editor that allows editing and creation of features with a {@link CircularArcBy3Points "circular-arc-by-3-points"} shape.
 *
 * <h4>Handles</h4>
 * The editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/circulararcby3points_handles.png"
 *         alt="CircularArcBy3PointsEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>CircularArcBy3PointsEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user moves the circular arc.
 *   </li>
 *   <li><b>{@link createStartPointHandle Start point handle} (B)</b>:
 *          by dragging this handle, the user moves the circular arc's {@link CircularArcBy3Points.startPoint start point}.
 *   </li>
 *   <li><b>{@link createIntermediatePointHandle Intermediate point handle} (C)</b>:
 *          by dragging this handle, the user moves the circular arc's {@link CircularArcBy3Points.intermediatePoint intermediate point}.
 *   </li>
 *   <li><b>{@link createEndPointHandle End point handle} (D)</b>:
 *          by dragging this handle, the user moves the circular arc's {@link CircularArcBy3Points.endPoint end point}.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints helper lines for the {@link CircularArcBy3Points circular arc}.
 *          These helper lines are the grey lines in the image above.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link CircularArcBy3Points} shape.
 *          The red stroke in the image above indicates where the shape translate handle is active.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link CircularArcBy3PointsEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link CircularArcBy3Points} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class CircularArcBy3PointsEditor extends Editor {
  /**
   * Creates a new {@link CircularArcBy3PointsEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.CIRCULAR_ARC_BY_3_POINTS CIRCULAR_ARC_BY_3_POINTS} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing a {@link CircularArcBy3Points}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createStartPointHandle}</li>
   *   <li>{@link createIntermediatePointHandle}</li>
   *   <li>{@link createEndPointHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to translate the circular arc by translating its center point.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to move the circular arc's {@link CircularArcBy3Points.startPoint start point}.
   *
   * @return a {@link PointDragHandle}.
   */
  createStartPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to move the circular arc's {@link CircularArcBy3Points.intermediatePoint intermediate point}.
   *
   * @return a {@link PointDragHandle}.
   */
  createIntermediatePointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to move the circular arc's {@link CircularArcBy3Points.endPoint end point}.
   *
   * @return a {@link PointDragHandle}.
   */
  createEndPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the {@link CircularArcBy3Points}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link CircularArcBy3Points} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   * The {@link CircularArcBy3Points.intermediatePoint intermediate}
   * and {@link CircularArcBy3Points.endPoint end} point are determined by {@link getDefaultPoint}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}