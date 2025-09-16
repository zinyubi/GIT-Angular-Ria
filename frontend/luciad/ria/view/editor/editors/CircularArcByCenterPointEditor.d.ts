import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * An editor that allows editing and creation of features with a {@link CircularArcByCenterPoint "circular-arc-by-center-point"} shape.
 *
 * <h4>Handles</h4>
 * The editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/circulararcbycenterpoint_handles.png"
 *         alt="CircularArcByCenterPointEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>CircularArcByCenterPointEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user moves the circular arc.
 *   </li>
 *   <li><b>{@link createStartPointHandle Start point handle} (B)</b>:
 *          by dragging this handle, the user moves the circular arc's {@link CircularArcByCenterPoint.startPoint start point}.
 *   </li>
 *   <li><b>{@link createRadiusHandle Radius handle} (C)</b>:
 *          by dragging this handle, the user changes the circular arc's {@link CircularArcByCenterPoint.radius radius}.
 *   </li>
 *   <li><b>{@link createEndPointHandle End point handle} (D)</b>:
 *          by dragging this handle, the user moves the circular arc's {@link CircularArcByCenterPoint.endPoint end point}.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints helper lines for the {@link CircularArcByCenterPoint circular arc}.
 *          These helper lines are the grey lines in the image above.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link CircularArcByCenterPoint} shape.
 *          The red stroke in the image above indicates where the shape translate handle is active.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link CircularArcByCenterPointEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link CircularArcByCenterPoint} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class CircularArcByCenterPointEditor extends Editor {
  /**
   * Creates a new {@link CircularArcByCenterPointEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.CIRCULAR_ARC_BY_CENTER_POINT CIRCULAR_ARC_BY_CENTER_POINT} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing an {@link CircularArcByCenterPoint}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createStartPointHandle}</li>
   *   <li>{@link createRadiusHandle}</li>
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
   * Creates an edit handle that allows the user to change the circular arc's {@link CircularArcByCenterPoint.startPoint start point}.
   *
   * @return a {@link PointDragHandle}.
   */
  createStartPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the circular arc's {@link CircularArcByCenterPoint.radius radius}.
   *
   * @return a {@link PointDragHandle}.
   */
  createRadiusHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the circular arc's {@link CircularArcByCenterPoint.endPoint end point}.
   *
   * @return a {@link PointDragHandle}.
   */
  createEndPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the {@link CircularArcByCenterPoint}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link CircularArcByCenterPoint} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   * The {@link CircularArcByCenterPoint.radius radius} is determined with {@link getDefaultSize}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}