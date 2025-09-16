import { EditContext } from "../../controller/EditContext.js";
import { EditHandle } from "../EditHandle.js";
import { Editor } from "../Editor.js";
/**
 * An editor that allows editing and creation of features with a {@link GeoBuffer geobuffer} shape.
 *
 * <h4>Handles</h4>
 * The geobuffer editor defines the following edit handles:
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://editor/geobuffer_handles.png"
 *         alt="GeoBufferEditor handles"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>GeoBufferEditor handles</td>
 *   </tr>
 * </table>
 *
 * <ul>
 *   <li><b>{@link createBaseShapeHandles Base shape handles} (A)</b>:
 *          These handles are created by {@link Editor.getEditHandles createShapeHandles}.
 *          See {@link GeoBuffer.isSupportedBaseShape} for a list of supported geobuffer base shape types.
 *          In the image above, the base shape is a {@link PointListEditor}.
 *   </li>
 *   <li><b>{@link createWidthHandle Width handle} (B)</b>:
 *          This handle allows the user to change the geobuffer's {@link GeoBuffer.width width}.
 *          The user can do this by dragging the stroke of the geobuffer.
 *          The default width handle also draws a helper shape that previews the new width of the geobuffer.
 *          In the image above, the width helper shape is the gray zone around the letter B.
 *   </li>
 *   <li><b>{@link createHelperHandle Helper handle}</b>:
 *          A non-interactive handle, it paints helper lines for the {@link GeoBuffer}.
 *          The helper lines are the grey lines in the image above. They visualize the {@link GeoBuffer.baseShape base shape} of the geobuffer.
 *          This does not include the gray zone of the width handle, around the letter B.
 *   </li>
 *   <li><b>{@link Editor.createTranslateHandle Shape translate handle}</b>:
 *          This handle translates (moves) the entire {@link GeoBuffer} shape.
 *          The light blue area in the image above indicates where the shape translate handle is active.
 *          This includes the red stroke.
 *   </li>
 * </ul>
 *
 * <h4>Creation</h4>
 *
 * The {@link Editor.getCreateHandle}
 * of the {@link GeoBuffer.width width} is changed to a
 * {@link getDefaultSize default size}.
 *
 * @since 2022.1
 */
export declare class GeoBufferEditor extends Editor {
  /**
   * Creates a new {@link GeoBufferEditor}.
   *
   * This constructor does not initialize any state.
   *
   * @param baseShapeEditor The editor for the geobuffer's {@link GeoBuffer.baseShape base shape}.
   *                        See {@link GeoBuffer.isSupportedBaseShape} for a list of supported geobuffer base shape types.
   */
  constructor(baseShapeEditor: Editor);
  /**
   * The editor used for the {@link GeoBuffer.baseShape base shape} of the geobuffer.
   * See {@link GeoBuffer.isSupportedBaseShape} for a list of supported geobuffer base shape types.
   */
  get baseShapeEditor(): Editor;
  /**
   * Returns true if <code>context.shape</code> has a {@link ShapeType.GEO_BUFFER GEO_BUFFER}.
   */
  canEdit(context: EditContext): boolean;
  /**
   * Returns a set of handles for editing a {@link GeoBuffer}.
   *
   * By default, this delegates to the following methods:
   * <ul>
   *   <li>{@link createBaseShapeHandles}</li>
   *   <li>{@link createWidthHandle}</li>
   *   <li>{@link createHelperHandle}</li>
   *   <li>{@link createTranslateHandle}</li>
   * </ul>
   */
  getEditHandles(context: EditContext): EditHandle[];
  /**
   * Creates a handle to translate the geobuffer.
   */
  createTranslateHandle(context: EditContext): EditHandle | null;
  /**
   * Creates handles to edit the {@link GeoBuffer.baseShape base shape} of the geobuffer.
   *
   * The default implementation delegates to {@link Editor.getEditHandles}, if it
   * {@link GeoBuffer.baseShape base shape}.
   * {@link ShapeTranslateHandle Base shape translation handles} are removed from this list.
   *
   * See {@link GeoBuffer.isSupportedBaseShape} for a list of supported geobuffer base shape types.
   */
  createBaseShapeHandles(context: EditContext): EditHandle[];
  /**
   * Creates a handle to edit the {@link GeoBuffer.width} of the geobuffer.
   *
   * @return a {@link GeoBufferWidthHandle}.
   */
  createWidthHandle(context: EditContext): EditHandle | null;
  /**
   * Creates an edit handle that paints helper lines for the geobuffer.
   *
   * @return a {@link GeoBufferHelperHandle}.
   */
  createHelperHandle(context: EditContext): EditHandle | null;
  /**
   * Returns a handle that's used for geobuffer creation.
   *
   * The default implementation delegates to {@link Editor.getCreateHandle}.
   * For performance reasons, {@link EditSettings.freehand freehand} creation is always disabled for geobuffer creation.
   *
   * When creation starts, the {@link GeoBuffer.width} is changed to a {@link getDefaultSize default size}.
   */
  getCreateHandle(context: EditContext): EditHandle | null;
}