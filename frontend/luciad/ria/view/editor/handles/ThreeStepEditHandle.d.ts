import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditHandle } from "../EditHandle.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { EditContext } from "../../controller/EditContext.js";
/**
 * Convenience handle that separates the handling of events in 3 steps:
 *
 * <ul>
 *   <li>
 *     <b>Activation</b>: First, the handle checks if it {@link shouldActivate should activate}.
 *     If so, it {@link activate activates} and the handle becomes {@link active active}.
 *   </li>
 *   <li>
 *     <b>Processing</b>: While {@link active active}, the handle checks if it {@link shouldProcess should process}
 *     events. If so, the event is {@link process processed}.
 *   </li>
 *   <li>
 *     <b>Deactivation</b>: While {@link active active}, after processing, the handle checks if it {@link shouldDeactivate should deactivate}.
 *     If so, it {@link deactivate deactivates} and the handle becomes inactive ({@link active active} is <code>false</code>).
 *   </li>
 * </ul>
 *
 * Subclasses should override the methods mentioned above to obtain the desired behavior.
 *
 * Note that a handle can {@link activate}, {@link process} and {@link deactivate} on a single event.
 * This can be useful, for example to deal with click events (as well as drag events).
 *
 * One example of a common {@link PointDragHandle}, which becomes active
 * when a point is dragged. While dragging, it changes the shape in its <code>process()</code>.
 * When the drag ends, it deactivates.
 *
 * @since 2022.1
 */
export declare abstract class ThreeStepEditHandle extends EditHandle {
  /**
   * Creates a new {@link ThreeStepEditHandle}.
   */
  constructor();
  /**
   * Indicates whether the handle is active.
   */
  protected get active(): boolean;
  protected set active(active: boolean);
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Whether the handle should become {@link active}.
   * @param event The event to check
   * @param context The edit context
   */
  abstract shouldActivate(event: GestureEvent, context: EditContext): boolean;
  /**
   * Called when handle goes from inactive to {@link active} state.
   * @param event The event that triggered the activation
   * @param context The edit context
   */
  activate(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Whether an {@link active} handle should {@link process} the event.
   * @param event The event to check
   */
  abstract shouldProcess(event: GestureEvent): boolean;
  /**
   * Processes an event.
   *
   * This is typically where you change a shape.
   * For example move a point to where the mouse is dragged, like a {@link PointDragHandle} does.
   *
   * @param event The event to process
   * @param context The edit context
   */
  abstract process(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Checks if this handle should deactivate.
   *
   * @param event The event to check
   */
  abstract shouldDeactivate(event: GestureEvent): boolean;
  /**
   * Called when the handle leaves the {@link active} state.
   * @param event The event that triggered the deactivation
   * @param context The edit context
   */
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
}