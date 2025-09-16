import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
/**
 * An editor that allows editing and creation of features with a {@link CircleBy3Points "circle-by-3-points"} shape.
 *
 * <h4>Handles</h4>
 * The editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/circleby3points_handles.png"
 *         alt="CircleBy3PointsEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>CircleBy3PointsEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user translates the {@link CircleBy3Points.center center} of the circle.
 *   </li>
 *   <li><b>{@link createFirstPointHandle First point handle} (B)</b>:
 *          by dragging this handle, the user changes the {@link CircleBy3Points.firstPoint first point}.
 *          As a side effect, this also changes the {@link CircleBy3Points.radius}
 *          of the circle.
 *   </li>
 *   <li><b>{@link createSecondPointHandle Second point handle} (C)</b>:
 *          by dragging this handle, the user changes the {@link CircleBy3Points.secondPoint second point}.
 *          As a side effect, this also changes the {@link CircleBy3Points.radius}
 *          of the circle.
 *   </li>
 *   <li><b>{@link createThirdPointHandle Third point handle} (D)</b>:
 *          by dragging this handle, the user changes the {@link CircleBy3Points.thirdPoint third point}.
 *          As a side effect, this also changes the {@link CircleBy3Points.radius}
 *          of the circle.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link CircleBy3Points} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link CircleBy3PointsEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link CircleBy3Points} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class CircleBy3PointsEditor extends Editor {
  /**
   * Creates a new {@link CircleBy3PointsEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.CIRCLE_BY_3_POINTS CIRCLE_BY_3_POINTS} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing a {@link CircleBy3Points}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createFirstPointHandle}</li>
   *   <li>{@link createSecondPointHandle}</li>
   *   <li>{@link createThirdPointHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to move the circle by dragging its center point.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to move the circle's {@link CircleBy3Points.firstPoint first point}.
   *
   * As a side effect, this also changes the {@link CircleBy3Points.radius} of the circle.
   *
   * @return a {@link PointDragHandle}.
   */
  createFirstPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to move the circle's {@link CircleBy3Points.secondPoint second point}.
   *
   * As a side effect, this also changes the {@link CircleBy3Points.radius} of the circle.
   *
   * @return a {@link PointDragHandle}.
   */
  createSecondPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to move the circle's {@link CircleBy3Points.thirdPoint third point}.
   *
   * As a side effect, this also changes the {@link CircleBy3Points.radius} of the circle.
   *
   * @return a {@link PointDragHandle}.
   */
  createThirdPointHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link CircleBy3Points} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   *         The {@link CircleBy3Points.secondPoint second point}
   *         and {@link CircleBy3Points.secondPoint third point} are determined by {@link getDefaultPoint}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}