import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor that allows editing and creation of features with a {@link CircleByCenterPoint "circle-by-center-point"} shape.
 *
 * <h4>Handles</h4>
 * The editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/circlebycenterpoint_handles.png"
 *         alt="CircleByCenterPointEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>CircleByCenterPointEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user moves the circle.
 *   </li>
 *   <li><b>{@link createRadiusHandle Radius handle} (B)</b>:
 *          by dragging this handle, the user changes the circle's {@link CircleByCenterPoint.radius radius}.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link CircleByCenterPoint} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link CircleByCenterPoint circle-by-center-point} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link CircleByCenterPoint} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class CircleByCenterPointEditor extends Editor {
  /**
   * Creates a new {@link CircleByCenterPointEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.CIRCLE_BY_CENTER_POINT CIRCLE_BY_CENTER_POINT} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing a {@link CircleByCenterPoint}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createRadiusHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to translate the circle by translating its center point.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link CircleByCenterPoint.radius radius},
   * of the {@link CircleByCenterPoint}.
   *
   * @return a {@link PointDragHandle}.
   */
  createRadiusHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link CircleByCenterPoint} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   * The {@link CircleByCenterPoint.radius radius} of the template is determined by {@link getDefaultSize}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}