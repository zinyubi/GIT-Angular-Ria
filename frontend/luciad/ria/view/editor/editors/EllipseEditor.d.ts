import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * An editor that allows editing and creation of features with an {@link Ellipse ellipse} shape.
 *
 * <h4>Handles</h4>
 * The ellipse editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/ellipse_handles.png"
 *         alt="EllipseEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>EllipseEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user moves the ellipse.
 *   </li>
 *   <li><b>{@link createMajorAxisHandle Major axis handle} (B)</b>:
 *          by dragging this handle, the user changes the
 *          {@link Ellipse.a length of the major axis of the ellipse}
 *          and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
 *   </li>
 *   <li><b>{@link createMajorAxisOppositeHandle Major axis opposite handle} (C)</b>:
 *         by dragging this handle, the user changes the
 *         {@link Ellipse.a length of the major axis of the ellipse}
 *         and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
 *   </li>
 *   <li><b>{@link createMinorAxisHandle Minor axis handle} (D)</b>:
 *          by dragging this handle, the user changes the
 *          {@link Ellipse.b length of the minor axis of the ellipse}
 *          and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
 *   </li>
 *   <li><b>{@link createMinorAxisOppositeHandle Minor axis opposite handle} (E)</b>:
 *          by dragging this handle, the user changes the
 *          {@link Ellipse.b length of the minor axis of the ellipse}
 *          and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints helper lines for the {@link Ellipse}.
 *          These helper lines are the grey lines in the image above.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link Ellipse} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link EllipseEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link Ellipse} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class EllipseEditor extends Editor {
  /**
   * Creates a new {@link EllipseEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.ELLIPSE ELLIPSE} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing an {@link Ellipse}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createMajorAxisHandle}</li>
   *   <li>{@link createMajorAxisOppositeHandle}</li>
   *   <li>{@link createMinorAxisHandle}</li>
   *   <li>{@link createMinorAxisOppositeHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to translate the given ellipse by translating its center point.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Ellipse.a length of the major axis of the ellipse}
   * and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
   *
   * @return a {@link PointDragHandle}
   */
  createMajorAxisHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Ellipse.a length of the major axis of the ellipse}
   * and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
   *
   * @return a {@link PointDragHandle}
   */
  createMajorAxisOppositeHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Ellipse.b length of the minor axis of the ellipse}
   * and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
   *
   * @return a {@link PointDragHandle}
   */
  createMinorAxisHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Ellipse.b length of the minor axis of the ellipse}
   * and the {@link Ellipse.rotationAzimuth rotation of the ellipse}.
   *
   * @return a {@link PointDragHandle}
   */
  createMinorAxisOppositeHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the {@link Ellipse}.
   *
   * @return a {@link EllipseAxisHelperHandle}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link Ellipse} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   * The {@link Ellipse.a length of the major axis of the ellipse} of the
   * template is determined by {@link getDefaultSize}.
   * The {@link Ellipse.b length of the minor axis} is half the length of the major axis.
   * The {@link Ellipse.rotationAzimuth rotationAzimuth} is kept as-is, as it was set in
   * {@link CreateController.onCreateNewObject}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}