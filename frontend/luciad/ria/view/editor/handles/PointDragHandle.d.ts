import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { PointHandle } from "./PointHandle.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { Point } from "../../../shape/Point.js";
import { IconStyle } from "../../style/IconStyle.js";
import { EditMoveConstraint } from "./EditMoveConstraint.js";
import { DrapeTarget } from "../../style/DrapeTarget.js";
/**
 * Constructor options for a {@link PointDragHandle}
 *
 * @since 2022.1
 */
export interface PointDragHandleConstructorOptions {
  /**
   * The icon style to be used by this point drag handle.
   * This is passed to {@link PointHandle PointHandle's constructor}.
   * @see {@link PointHandle}
   */
  handleIconStyle?: IconStyle | null;
  /**
   * The move constraint for this point handle.
   * @default {@link EditMoveConstraint.ON_TERRAIN}
   */
  moveConstraint?: EditMoveConstraint;
}
/**
 * A handle that allows a point to be dragged around.
 *
 * To use a {@link PointDragHandle} in your own editors, you have to:
 * <ul>
 *   <li>link a point of the shape (or feature) to the handle, cf. {@link getPoint}</li>
 *   <li>update the shape or feature, based on the dragged point, cf. {@link drag}</li>
 * </ul>
 *
 * For example, to move the center of a {@link PointDragHandle} as follows:
 *
 * ```javascript
 * [[include:view/editor/handles/PointDragHandleSnippets.ts_POINT_DRAG_EXAMPLE]]
 * ```
 *
 * @since 2022.1
 */
export declare class PointDragHandle extends PointHandle {
  /**
   * Constructs a new PointDragHandle.
   *
   * @param getPoint A function that returns the point that this handle represents.
   *                 This is used in the default implementation of {@link PointDragHandle.getPoint}.
   * @param drag A function that changes the shape when the point is dragged.
   *             This is used in the default implementation of {@link PointDragHandle.drag}
   * @param options Constructor options for this PointDragHandle
   */
  constructor(getPoint: () => Point, drag: (point: Point, event: GestureEvent, context: EditContext) => void, options?: PointDragHandleConstructorOptions);
  getDrapeTarget(context: EditContext): DrapeTarget;
  /**
   * Returns <code>true</code> for {@link GestureEventType.DOWN DOWN events} that {@link interacts} with
   * the point handle.
   */
  shouldActivate(event: GestureEvent, context: EditContext): boolean;
  /**
   * Returns the model point that this handle corresponds to.
   *
   * By default, this delegates to the <code>getPoint</code> function that was passed into the constructor.
   */
  getPoint(): Point;
  /**
   * Returns <code>true</code> for {@link GestureEventType.DRAG} events.
   */
  shouldProcess(event: GestureEvent): boolean;
  /**
   * Processes an event.
   *
   * It checks if a there's a point to snap to, and sets {@link snapPoint} accordingly.
   * After that, it calls {@link drag} with the model point under the mouse or finger.
   */
  process(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Returns <code>true</code> on {@link GestureEventType.DRAG_END DRAG_END} or
   * {@link GestureEventType.CONTEXT_MENU CONTEXT_MENU} events.
   */
  shouldDeactivate(event: GestureEvent): boolean;
  /**
   * Sets {@link ThreeStepEditHandle.deactivate}.
   */
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
  get moveConstraint(): EditMoveConstraint;
  /**
   * Transform a view point to model coordinates.
   *
   * The default implementation transforms the view point to a model coordinate on terrain.
   * It also moves the point's Z to 0.
   *
   * @param viewPoint The view point to transform to model coordinates
   * @param context The edit context
   *
   * @since 2023.1
   */
  viewToModel(viewPoint: Point, context: EditContext): Point | null;
  /**
   * Called whenever the point is dragged to a new location.
   *
   * By default, this delegates to the <code>drag</code> function that was passed into the constructor.
   *
   * @param point The new location of the point, in model coordinates.
   * @param event The gesture event that caused the drag.
   * @param context The edit context
   */
  drag(point: Point, event: GestureEvent, context: EditContext): void;
}