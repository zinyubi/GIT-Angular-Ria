import { ThreeStepEditHandle } from "./ThreeStepEditHandle.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { EditContext } from "../../controller/EditContext.js";
/**
 * A handle that {@link ThreeStepEditHandle.activate activates} when the mouse or fingers {@link interacts} with the handle.
 *
 * @since 2022.1
 */
export declare abstract class ShapeTouchHandle extends ThreeStepEditHandle {
  /**
   * Creates a new {@link ShapeTouchHandle}.
   */
  constructor();
  /**
   * Returns <code>true</code> for {@link GestureEventType.DOWN DOWN events} that {@link interacts interact} with
   * the point handle.
   */
  shouldActivate(event: GestureEvent, context: EditContext): boolean;
  /**
   * Returns <code>true</code> on {@link GestureEventType.DRAG_END DRAG_END} or
   * {@link GestureEventType.CONTEXT_MENU CONTEXT_MENU} events.
   */
  shouldDeactivate(event: GestureEvent): boolean;
  /**
   * Returns <code>true</code> for {@link GestureEventType.DRAG} events.
   */
  shouldProcess(event: GestureEvent): boolean;
  /**
   * Checks if the handle interacts with the given {@link GestureEvent gesture event}.
   * @param gestureEvent The gesture event to check
   * @param context The edit context
   */
  abstract interacts(gestureEvent: GestureEvent, context: EditContext): boolean;
}