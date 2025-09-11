import { GestureEvent } from "../input/GestureEvent.js";
import { Controller } from "./Controller.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { Map } from "../Map.js";
/**
 * Options to configure {@link PanController.getInertiaOptions PanController inertia}.
 * Inertia causes the controller to keep panning after releasing the mouse or finger.
 *
 * @see {@link PanController.isInertia}
 * @see {@link PanController.getInertiaOptions}
 * @since 2022.1
 */
export interface PanControllerInertiaOptions {
  /**
   * A scale factor for the default speed at which the inertia animation starts.
   * Use this if you want to change the speed at which the inertia kicks in.
   *
   * A value above 1 means that the inertia animation starts faster than the default speed.
   * A value below 1 means that the inertia animation starts slower than the default speed.
   * @default 1
   */
  speedMultiplier?: number;
  /**
   * The maximum speed (in pixels/second) of inertia fling animations.
   * This is used to avoid extremely fast flings.
   * Note that this maximum is applied _after_ applying the {@link speedMultiplier}.
   *
   * Typical values for fling speeds are in the range of 1000 to 10000 pixels/second.
   * @default 5000
   */
  maxSpeed?: number;
  /**
   * A scale factor for the default inertia friction.
   * Use this if you want to change the rate at which the inertia slows down.
   *
   * A value above 1 means that the fling animation slows down and ends faster than the default (more friction).
   * A value below 1 means that the fling animation continues running for longer than the default (less friction).
   * @default 1
   */
  frictionMultiplier?: number;
}
/**
 * Allows the user to pan a map by dragging it.
 * This controller works with both touch and mouse events.
 *
 * For a list of events handled by this controller, check {@link isPanEvent}.
 *
 * You can customize the controller by overriding its hooks:
 *
 * ```javascript
 * [[include:view/controller/PanControllerSnippets.ts_CUSTOM_PAN_CONTROLLER]]
 * ```
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 * @since 2022.1
 */
export declare class PanController extends Controller {
  constructor();
  onActivate(map: Map): void;
  onDeactivate(map: Map): Promise<void> | void;
  /**
   * Called when a gesture event has been received. This is not intended to be overridden by subclasses.
   * You should override the hooks instead ({@link isPanEvent}, {@link isPanEndEvent}, {@link isInertia} and
   * {@link getInertiaOptions}).
   * @param gestureEvent The gesture event to handle
   */
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * A hook to enable or disable inertia for this PanController.
   * When inertia is enabled, a pan animation is played after the user 'flings' the mouse or his finger.
   * This animation pans the map further in the direction of the fling.
   * You can customize this animation with {@link getInertiaOptions}.
   *
   * The default implementation always returns true.
   *
   * @param gestureEvent The gesture event to check
   */
  isInertia(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to customize inertia for the PanController.
   *
   * You can change the speed and friction to speed up or slow down the fling animation.
   * You can also impose a maximum speed, to avoid (accidental) fast flings.
   *
   * The default implementation uses a {@link PanControllerInertiaOptions.speedMultiplier speedMultiplier} of 1,
   * a {@link PanControllerInertiaOptions.frictionMultiplier frictionMultiplier} of 1
   * and a {@link PanControllerInertiaOptions.maxSpeed maxSpeed} of 5000.
   *
   * Example usage:
   *
   * ```javascript
   * [[include:view/controller/PanControllerSnippets.ts_CUSTOM_INERTIA]]
   * ```
   * @param gestureEvent The gesture event to determine inertia options for
   */
  getInertiaOptions(gestureEvent: GestureEvent): PanControllerInertiaOptions;
  /**
   * A hook to determine if a gesture event should be used for panning.
   *
   * Note that this should return true for all {@link isPanEndEvent "pan end" events}, as well as "non-end" events.
   *
   * For mouse events, the default implementation returns true for {@link GestureEventType.DRAG drag events} or
   * {@link GestureEventType.DRAG_END "drag end" events} with a button other than the right mouse button.
   * For touch, the default implementation returns true for all  {@link GestureEventType.DRAG drag events} and
   * {@link GestureEventType.DRAG_END "drag end" events}.
   * @param gestureEvent The gesture event to check
   */
  isPanEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to determine if a gesture event marks the end of a pan interaction.
   *
   * For mouse events, the default implementation returns true for {@link GestureEventType.DRAG_END "drag end" event}
   * with a button other than the right mouse button.
   * For touch, the default implementation returns true for all  {@link GestureEventType.DRAG_END "drag end" events}.
   * @param gestureEvent The gesture event to check
   */
  isPanEndEvent(gestureEvent: GestureEvent): boolean;
}