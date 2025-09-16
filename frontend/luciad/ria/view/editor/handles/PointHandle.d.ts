import { ThreeStepEditHandle } from "./ThreeStepEditHandle.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { Point } from "../../../shape/Point.js";
import { IconStyle } from "../../style/IconStyle.js";
import { DrapeTarget } from "../../style/DrapeTarget.js";
/**
 * A handle for a {@link Point}.
 *
 * This is a base class for point handles, such as {@link PointDragHandle} and the "single point" handles used in
 * pointlists ({@link SinglePointInsertHandle}, {@link SinglePointTranslateHandle} and {@link SinglePointDeleteHandle}).
 *
 * It provides implementations for {@link onDraw drawing point handle icons}, {@link snapPoint snapping} and
 * {@link interacts point interaction}.
 *
 * @since 2022.1
 */
export declare abstract class PointHandle extends ThreeStepEditHandle {
  /**
   * Creates a new PointHandle.
   * @param handleIconStyle The icon style of this point handle. Null if no icon should be drawn.
   */
  constructor(handleIconStyle?: IconStyle | null);
  /**
   * Returns the default handle icon style.
   *
   * This is the handle icon style that is used if no <code>handleIconStyle</code> was passed into the constructor.
   * @param context The edit context
   * @return The context's {@link EditHandleStyles.handleIconStyle handle icon style}.
   */
  getDefaultHandleIconStyle(context: EditContext): IconStyle | null;
  /**
   * Returns the handle icon style, to be used for visualizing point handles in {@link onDraw}.
   *
   * This returns the handle icon style that was passed into the constructor.
   * If no handle icon style was passed into the constructor, this returns the {@link EditHandleStyles.handleIconStyle context's handle icon style}.
   *
   * @param context The edit context
   */
  getHandleIconStyle(context: EditContext): IconStyle | null;
  /**
   * The point to snap to.
   *
   * This is used to paint a snap icon.
   *
   * Typically, this is set by subclasses, for example in {@link PointDragHandle.drag}.
   */
  get snapPoint(): Point | null;
  set snapPoint(p: Point | null);
  /**
   * Returns the point, in model coordinates, that this handle represents.
   */
  abstract getPoint(): Point;
  /**
   * Called when this handle should draw shapes on the map.
   *
   * By default, the implementation draws:
   * <ul>
   *   <li>Nothing if {@link getHandleIconStyle} returns <code>null</code></li>
   *   <li>An icon at {@link EditHandleStyles.handleIconStyle}</li>
   *   <li>A snap icon, if {@link snapPoint} is not <code>null</code></li>
   * </ul>
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
  /**
   * Returns the drape target for this point handle.
   *
   * This will make sure point handles with z=0 are correctly draped or not, and on the correct {@link DrapeTarget} (terrain or a 3D Tiles mesh).
   * Icons for handles at an altitude are never draped.
   *
   * In detail, this uses the following heuristics to determine a {@link DrapeTarget}:
   * By default, this uses the {@link GenericIconStyle.drapeTarget drapeTarget} of {@link getHandleIconStyle}.
   * If that is not defined, this looks at the {@link DrapeTarget.NOT_DRAPED}.
   * If it is zero, this looks for a 3D Tiles mesh layer on the map that has {@link TileSet3DLayer.isDrapeTarget isDrapeTarget} set.
   * If a 3D tiles mesh layer is found, this returns {@link DrapeTarget.ALL} so the handles are draped on the mesh (and terrain, in case the data lies outside the mesh).
   * If no mesh layer is found, this returns {@link DrapeTarget.NOT_DRAPED}.
   *
   * @param context The edit context
   */
  getDrapeTarget(context: EditContext): DrapeTarget;
  /**
   * Returns the cursor for this point handle.
   *
   * <ul>
   *   <li>
   *     if the handle is {@link active active}, this returns <code>"grab"</code>.
   *   </li>
   *   <li>if the handle is inactive, but the mouse {@link interacts interacts} with the point, this returns <code>"pointer"</code>.</li>
   *   <li>otherwise, <code>null</code> is returned.</li>
   * </ul>
   */
  getCursor(event: GestureEvent, context: EditContext): string | null;
  /**
   * Checks whether the given input event interacts with the point handle.
   *
   * By default, this returns <code>true</code> if the mouse or finger is within a
   * certain distance of the point. A larger distance is used for touch events than for mouse events.
   */
  interacts(event: GestureEvent, context: EditContext): boolean;
}
/**
 * Scales an icon style.
 *
 * For example, this is used to make insert handle icons smaller than the original {@link EditHandleStyles.handleIconStyle}.
 *
 * @param originalStyle The original icon style to derive a scaled icon style from.
 * @param scaleFactor The scale factor to scale the original icon size with.
 * @since 2022.1
 */
export declare function scaleIconStyle(originalStyle: IconStyle | null, scaleFactor: number): IconStyle | null;