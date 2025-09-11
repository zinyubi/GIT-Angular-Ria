import { GestureEvent } from "../input/GestureEvent.js";
import { KeyEvent } from "../input/KeyEvent.js";
import { Controller } from "./Controller.js";
import { HandleEventResult } from "./HandleEventResult.js";
/**
 * A controller that handles all events.
 * This can be used to block events from going down the controller chain when used in a {@link CompositeController},
 * or to prevent default map behavior.
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 * @since 2022.1
 */
export declare class NoopController extends Controller {
  constructor();
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  onKeyEvent(keyEvent: KeyEvent): HandleEventResult;
  /**
   * A hook to determine if a gesture event is a no-op.
   * If true, the gesture event is handled by this controller. It does not propagate down the controller chain
   * in a {@link CompositeController} and default map behavior is not triggered for this event.
   * By default, this always returns <code>true</code>.
   * @param gestureEvent The event that's considered as a no-op candidate
   */
  isNoopGestureEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to determine if a key event is a no-op.
   * If true, the key event is handled by this controller. It does not propagate down the controller chain
   * in a {@link CompositeController} and default map behavior is not triggered for this event.
   * By default, this always returns <code>true</code>.
   * @param keyEvent The event that's considered as a no-op candidate
   */
  isNoopKeyEvent(keyEvent: KeyEvent): boolean;
}