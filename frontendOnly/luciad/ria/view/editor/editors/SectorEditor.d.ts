import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
import { EditContext } from "../../controller/EditContext.js";
/**
 * An editor that allows editing and creation of features with a {@link Sector sector} shape.
 *
 * <h4>Handles</h4>
 * The editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/sector_handles.png"
 *         alt="SectorEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>SectorEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createCenterHandle Center point handle} (A)</b>:
 *          by dragging this handle, the user moves the sector.
 *   </li>
 *   <li><b>{@link createRadiusStartHandle Radius start handle} (B)</b>:
 *          by dragging this handle, the user changes the sector's {@link Sector.radius radius},
 *          {@link Sector.sweepAngle sweepAngle}.
 *   </li>
 *   <li><b>{@link createRadiusEndHandle Radius end handle} (C)</b>:
 *          by dragging this handle, the user changes the sector's {@link Sector.radius radius} and
 *          {@link Sector.sweepAngle sweepAngle}.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          translates (moves) the entire {@link Sector} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link SectorEditor} uses the
 * {@link CreateByTemplateHandle "Create-by-template"} strategy.
 * After creation is started, the user clicks (or taps) once on the map. The {@link Sector} is moved to that location
 * and resized to a size appropriate for the current zoom level. Then, the edit handles become active. When the user
 * is done editing the shape (by double clicking outside the shape, or a single click if
 * {@link CreateControllerConstructorOptions.finishOnSingleClick finishOnSingleClick}</code>), the creation finishes.
 *
 * @since 2022.1
 */
export declare class SectorEditor extends Editor {
  /**
   * Creates a new {@link SectorEditor}.
   *
   * This constructor does not initialize any state.
   */
  constructor();
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.SECTOR SECTOR} shape type.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing a {@link Sector}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createCenterHandle}</li>
   *   <li>{@link createRadiusStartHandle}</li>
   *   <li>{@link createRadiusEndHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates an edit handle that allows the user to translate the sector by translating its center point.
   *
   * @return a {@link PointDragHandle}.
   */
  createCenterHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link Sector.radius radius},
   * {@link Sector}.
   *
   * @return a {@link PointDragHandle}.
   */
  createRadiusStartHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that allows the user to change the {@link Sector.radius radius} and
   * {@link Sector}.
   *
   * @return a {@link PointDragHandle}.
   */
  createRadiusEndHandle(context: EditContext): EditHandle | null;
  /**
   * Returns an edit handle that's used for {@link Sector} creation.
   *
   * @return a {@link CreateByTemplateHandle}.
   * The {@link Sector.radius radius} of the template is determined by {@link getDefaultSize}.
   * The {@link Sector.sweepAngle} are kept as-is, as it was set in
   * {@link CreateController.onCreateNewObject}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}