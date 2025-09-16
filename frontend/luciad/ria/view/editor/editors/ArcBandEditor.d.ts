import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * An editor that allows editing and creation of features with an {@link ArcBand arc band} shape.
 *
 * <h4>Handles</h4>
 * The arc band editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/arcband_handles.png"
 *         alt="ArcBandEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>ArcBandEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user translates (moves) the arcband.
 *   </li>
 *   <li><b>{@link createMinRadiusStartHandle Min radius start handle} (B)</b>:
 *          by dragging this handle, the user changes the {@link ArcBand.minRadius minRadius},
 *          {@link ArcBand}.
 *   </li>
 *   <li><b>{@link createMaxRadiusStartHandle Max radius start handle} (C)</b>:
 *          by dragging this handle, the user changes the {@link ArcBand.maxRadius maxRadius},
 *          {@link ArcBand}.
 *   </li>
 *   <li><b>{@link createMinRadiusEndHandle Min radius end handle} (D)</b>:
 *          by dragging this handle, the user changes the {@link ArcBand.minRadius minRadius}
 *          and {@link ArcBand}.
 *   </li>
 *   <li><b>{@link createMaxRadiusEndHandle Max radius end handle} (E)</b>:
 *          by dragging this handle, the user changes the {@link ArcBand.maxRadius maxRadius}
 *          and {@link ArcBand}.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints helper lines for the {@link ArcBand}.
 *          These helper lines are the grey lines in the image above.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link ArcBand} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link ArcBandEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link ArcBand} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class ArcBandEditor extends Editor {
  /**
   * Creates a new {@link ArcBandEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.ARC_BAND ARC_BAND} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing an {@link ArcBand}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createMinRadiusStartHandle}</li>
   *   <li>{@link createMinRadiusEndHandle}</li>
   *   <li>{@link createMaxRadiusStartHandle}</li>
   *   <li>{@link createMaxRadiusEndHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to move the arcband by dragging its {@link ArcBand.center center point}.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link ArcBand.minRadius minRadius},
   * {@link ArcBand}.
   *
   * @return a {@link PointDragHandle}.
   */
  createMinRadiusStartHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link ArcBand.minRadius minRadius} and
   * {@link ArcBand}.
   *
   * @return a {@link PointDragHandle}.
   */
  createMinRadiusEndHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link ArcBand.maxRadius maxRadius},
   * {@link ArcBand}.
   *
   * @return a {@link PointDragHandle}.
   */
  createMaxRadiusStartHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link ArcBand.maxRadius maxRadius} and
   * {@link ArcBand}.
   *
   * @return a {@link PointDragHandle}.
   */
  createMaxRadiusEndHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the {@link ArcBand}.
   *
   * @return an {@link ArcBandHelperHandle}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link ArcBand} creation.
   *
   * @return a {@link ArcBand.maxRadius maxRadius} of the
   * template is determined by {@link getDefaultSize}.
   * The {@link ArcBand.maxRadius maxRadius}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}