import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * An editor that allows editing and creation of features with an {@link Arc arc} shape.
 *
 * <h4>Handles</h4>
 * The arc editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/arc_handles.png"
 *         alt="ArcEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>ArcEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user translates the arc.
 *   </li>
 *   <li><b>{@link createMajorAxisHandle Major axis handle} (B)</b>:
 *          by dragging this handle, the user changes the
 *          {@link Arc.a length of the major axis for the ellipse defining the arc}
 *          and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
 *   </li>
 *   <li><b>{@link createMajorAxisOppositeHandle Major axis opposite handle} (C)</b>:
 *         by dragging this handle, the user changes the
 *         {@link Arc.a length of the major axis for the ellipse defining the arc}
 *         and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
 *   </li>
 *   <li><b>{@link createMinorAxisHandle Minor axis handle} (D)</b>:
 *          by dragging this handle, the user changes the
 *          {@link Arc.b length of the minor axis for the ellipse defining the arc}
 *          and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
 *   </li>
 *   <li><b>{@link createMinorAxisOppositeHandle Minor axis opposite handle} (E)</b>:
 *          by dragging this handle, the user changes the
 *          {@link Arc.b length of the minor axis for the ellipse defining the arc}
 *          and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
 *   </li>
 *   <li><b>{@link createStartPointHandle Start point handle} (F)</b>:
 *          by dragging this handle, the user changes the arc's {@link Arc.startAzimuth startAzimuth}.
 *   </li>
 *   <li><b>{@link createEndPointHandle End point handle} (G)</b>:
 *         by dragging this handle, the user changes the arc's {@link Arc.sweepAngle sweepAngle}.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints helper lines for the {@link Arc}.
 *          These helper lines are the grey lines in the image above.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          This handle translates (moves) the entire {@link Arc} shape.
 *          The red stroke in the image above indicates where the shape translate handle is active.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link ArcEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link Arc} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class ArcEditor extends Editor {
  /**
   * Creates a new {@link ArcEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.ARC ARC} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing an {@link Arc}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createMajorAxisHandle}</li>
   *   <li>{@link createMajorAxisOppositeHandle}</li>
   *   <li>{@link createMinorAxisHandle}</li>
   *   <li>{@link createMinorAxisOppositeHandle}</li>
   *   <li>{@link createStartPointHandle}</li>
   *   <li>{@link createEndPointHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to translate the given arc by translating its center point.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Arc.a length of the major axis for the ellipse defining the arc}
   * and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
   *
   * @return a {@link PointDragHandle}
   */
  createMajorAxisHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Arc.a length of the major axis for the ellipse defining the arc}
   * and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
   *
   * @return a {@link PointDragHandle}
   */
  createMajorAxisOppositeHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Arc.b length of the minor axis for the ellipse defining the arc}
   * and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
   *
   * @return a {@link PointDragHandle}
   */
  createMinorAxisHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the
   * {@link Arc.b length of the minor axis for the ellipse defining the arc}
   * and the {@link Arc.rotationAzimuth rotation of the ellipse defining the arc}.
   *
   * @return a {@link PointDragHandle}
   */
  createMinorAxisOppositeHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the arc's {@link Arc.startAzimuth startAzimuth}.
   *
   * @return a {@link PointDragHandle}
   */
  createStartPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the arc's {@link Arc.sweepAngle sweepAngle}.
   *
   * @return a {@link PointDragHandle}
   */
  createEndPointHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the {@link Arc}.
   *
   * @return a {@link EllipseAxisHelperHandle} and
   * {@link ArcHelperHandle}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link Arc} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   * The {@link Arc.a length of the major axis for the ellipse defining the arc} of the
   * template is determined by {@link getDefaultSize}.
   * The {@link Arc.b length of the minor axis} is half the length of the major axis.
   * The {@link Arc.sweepAngle} are kept as-is, as it was set in
   * {@link CreateController.onCreateNewObject}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}