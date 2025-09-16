import { ContextMenu } from "../../ContextMenu.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { CompositeEditHandle } from "./CompositeEditHandle.js";
import { PointHandle } from "./PointHandle.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { EditContext } from "../../controller/EditContext.js";
import { Point } from "../../../shape/Point.js";
import { Polyline } from "../../../shape/Polyline.js";
import { Polygon } from "../../../shape/Polygon.js";
import { IconStyle } from "../../style/IconStyle.js";
/**
 * Handle to delete a single point from a pointlist.
 *
 * This handle is intended to be used in the composite {@link PointListDeleteHandle}.
 *
 * The default implementation of this handle draws nothing.
 * The user can delete points by holding a modifier key while clicking on a point of the point list.
 * For touch input, the user can delete points by long-pressing a point of the point list.
 *
 * @since 2022.1
 */
export declare class SinglePointDeleteHandle extends PointHandle {
  /**
   * Creates a new {@link SinglePointDeleteHandle}.
   * @param pointList The point list (polyline or polygon) to delete a point from
   * @param index The index of the point in the point list.
   * @param handleIconStyle The icon style of the point handle
   */
  constructor(pointList: Polyline | Polygon, index: number, handleIconStyle?: IconStyle | null);
  get pointList(): Polyline | Polygon;
  /**
   * The index of the point in the point list, for this handle.
   */
  get index(): number;
  /**
   * Returns the default handle icon style.
   *
   * This is the handle icon style that is used if no <code>handleIconStyle</code> was passed into the constructor.
   *
   * By default, point list delete handles don't draw any icons.
   *
   * @param context The edit context
   * @return <code>null</code>
   */
  getDefaultHandleIconStyle(context: EditContext): IconStyle | null;
  process(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Checks if this handle should activate.
   *
   * The default implementation activates the handle:
   * <ul>
   *   <li>
   *     If it is a mouse {@link GestureEventType.SINGLE_CLICK_UP SINGLE_CLICK_UP} event while a modifier key is pressed,
   *     and the mouse is {@link interacts close to the handle}. A modifier key is SHIFT, CTRL or ALT.
   *   </li>
   *   <li>
   *     If it is a touch {@link GestureEventType.LONG_PRESS LONG_PRESS} event, {@link interacts close to the handle}.
   *   </li>
   * <ul>
   */
  shouldActivate(gestureEvent: GestureEvent, context: EditContext): boolean;
  /**
   * Checks if this handle should start processing.
   *
   * The default implementation starts processing:
   * <ul>
   *   <li>
   *     If it is a mouse {@link GestureEventType.SINGLE_CLICK_UP SINGLE_CLICK_UP} event while a modifier key is pressed,
   *   </li>
   *   <li>
   *     If it is a touch {@link GestureEventType.LONG_PRESS LONG_PRESS} event.
   *   </li>
   * <ul>
   */
  shouldProcess(gestureEvent: GestureEvent): boolean;
  /**
   * Checks if the handle should deactivate.
   *
   * The default implementation always returns <code>true</code>, so the handle deactivates immediately after activation.
   */
  shouldDeactivate(event: GestureEvent): boolean;
  /**
   * Returns the point for this point handle.
   *
   * @return the point at {@link index} of this handle's {@link pointList}.
   */
  getPoint(): Point;
  /**
   * Populates a context menu for this handle.
   *
   * The default implementation adds:
   * <ul>
   *   <li>
   *     a "Delete point" context menu entry, with {@link ContextMenuItem.id id} set to {@link Identifier.DELETE_POINT_ID}.
   *   </li>
   *   <li>
   *     a "Cancel" context menu entry, with {@link ContextMenuItem.id id} set to {@link Identifier.CANCEL_ID}.
   *   </li>
   * </ul>
   */
  onCreateContextMenu(gestureEvent: GestureEvent, context: EditContext, contextMenu: ContextMenu, onDone: () => void): void;
}
/**
 * A handle to delete points from a point list ({@link Polyline}).
 *
 * It composes a list of {@link SinglePointDeleteHandle}.
 * By default, a {@link SinglePointDeleteHandle} is placed at every point of the point list.
 *
 * @see {@link PointListEditor}
 * @since 2022.1
 */
export declare class PointListDeleteHandle extends CompositeEditHandle {
  /**
   * Constructs a new {@link PointListDeleteHandle}.
   */
  constructor(pointList: Polyline | Polygon, minimumPointCount: number, handleIconStyle?: IconStyle | null);
  /**
   * The pointlist being edited.
   */
  get pointList(): Polyline | Polygon;
  /**
   * The minimum point count of the handle, as defined at construction time.
   */
  get minimumPointCount(): number;
  /**
   * The handle's icon style, as defined at construction time.
   */
  get handleIconStyle(): IconStyle | null | undefined;
  /**
   * Creates delete handles for the {@link pointList} being edited / created.
   *
   * If you change the number of created handles, you should update {@link shouldUpdateHandles} as well.
   *
   * The default implementation creates a {@link SinglePointDeleteHandle} for every point in the point list.
   */
  createDeleteHandles(): SinglePointDeleteHandle[];
  /**
   * Checks if the handles should be updated.
   *
   * By default, this returns <code>true</code> if the {@link Polyline.pointCount shape's point count} is different
   * from the current amount of {@link handles}.
   *
   * If you create a different number of {@link createDeleteHandles delete handles}, then this check should reflect that.
   *
   * For example, if you disallow deletion of the first and last point, this method should check if the number of {@link handles}
   * is different from <code>{@link Polyline.pointCount shape.pointCount} - 2</code>
   */
  shouldUpdateHandles(): boolean;
  /**
   * Called when (another) handle changes the feature or shape, as indicated by the {@link EditHandle.on "EditShape"} event.
   *
   * The default implementation does the following:
   * <ul>
   *  <li>
   *    For polylines, it checks if the {@link Polyline.pointCount point count} is at least 2. If not, it clears the {@link handles} and {@link activeHandleIndex}.
   *  </li>
   *  <li>
   *    For polygons, it checks if the {@link Polygon.pointCount point count} is at least 3. If not, it clears the {@link handles} and {@link activeHandleIndex}.
   *  </li>
   *  <li>
   *    It checks if the {@link EditSettings.minimumPointCount minimum point count}.
   *    If not, it clears the {@link handles} and {@link activeHandleIndex}.
   *  </li>
   *  <li>
   *    If all checks pass and {@link shouldUpdateHandles} returns <code>true</code>, it calls {@link createDeleteHandles}.
   *  </li>
   * </ul>
   */
  update(): void;
}