import { Handle } from "../../util/Evented.js";
import { Invalidation } from "../../util/Invalidation.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { KeyEvent } from "../input/KeyEvent.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { LabelCanvas } from "../style/LabelCanvas.js";
import { HandleEventResult } from "./HandleEventResult.js";
/**
 * A controller defines how user input events are interpreted.  You can explicitly
 * configure a controller by setting the {@link Map.controller controller} or
 * {@link Map.defaultController defaultController}
 * property on the {@link Map}.
 *
 * All controller implementations must extend from the {@link Controller} class.
 *
 * See the <a href="articles://guide/view/controllers/custom_controllers.html">
 * Implementing custom user interaction</a> guide and the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 */
export declare abstract class Controller extends Invalidation {
  protected constructor();
  /**
   * Callback that is invoked when this controller is activated on a map. This method
   * allows controller implementations to perform setup work.
   * @param map the map on which the controller has been activated
   */
  onActivate(map: Map): void;
  /**
   * Callback that is invoked when this controller is deactivated on a map. This method
   * allows controller implementations to perform cleanup work.
   * This method must return either any resolved value or a promise to indicate completion of deactivation. This allows
   * controller implementation to perform asynchronous deactivation work. During the period between this method being
   * called and the resolution of the deactivation promise, this controller will no longer receive input events, but
   * will still get the opportunity to draw itself.
   * @param map the map on which the controller has been deactivated
   * @return a concrete value to indicate immediate deactivation or a deactivation promise.
   */
  onDeactivate(map: Map): Promise<void> | void;
  /**
   * Callback that allows controller implementations to perform custom drawing on the map. Controller shapes and icons
   * are drawn on top of all other content in the map.
   * Note that the map may perform caching which may cause this method to only be invoked once. When a controller
   * implementation's appearance changes the implementation should call {@link invalidate} on itself.
   * @param geoCanvas the GeoCanvas on which the controller can draw shapes.
   */
  onDraw(geoCanvas: GeoCanvas): void;
  /**
   * Callback that allows controller implementations to draw labels on the map.
   * Note that the map may perform caching which may cause this method to only be invoked once. When a controller
   * implementation's appearance changes the implementation should call {@link invalidate} on itself.
   * @param labelCanvas the LabelCanvas on which the controller can draw labels.
   */
  onDrawLabel(labelCanvas: LabelCanvas): void;
  /**
   * Called when a gesture event has been received. This method must return a HandleEventResult value to indicate
   * if the event was handled or not, If this method returns EVENT_IGNORED, the map will be given the opportunity to
   * perform default gesture event behaviour. If default event handling is not desired, this method should return
   * EVENT_HANDLED.  (See the {@link Controller} class description for the default behavior.)
   * @param gestureEvent The gesture event to be handled.
   *                                                      Note that this is a
   *                                                      {@link GestureEvent}
   *                                                      and not a DOMEvent. You can access the corresponding
   *                                                      DOMEvent through
   *                                                      {@link GestureEvent.domEvent}.
   * @return the gesture event handling result.
   */
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * Called when a key event has been received. This method must return a HandleEventResult value to indicate
   * if the event was handled or not, If this method returns EVENT_IGNORED, the map will be given the opportunity to
   * perform default key event behaviour. If default event handling is not desired, this method should return
   * EVENT_HANDLED. (See the {@link Controller} class description for the default behavior.)
   * @param keyEvent The key event to be handled.
   *                                              Note that this is a
   *                                              {@link KeyEvent}
   *                                              and not a DOMEvent. You can access the corresponding
   *                                              DOMEvent through
   *                                              {@link KeyEvent.domEvent}.
   * @return The key event handling result.
   */
  onKeyEvent(keyEvent: KeyEvent): HandleEventResult;
  /**
   * Call this method to indicate that the controller's appearance has changed. Calling this method ensures
   * the {@link onDraw} will be called during the next rendering pass.
   */
  invalidate(): void;
  /**
   * The map on which this controller is currently active or <code>null</code> if this controller is not currently active.
   * This property is read-only.
   */
  get map(): Map | null;
  set map(_value: Map | null);
  /**
   * The CSS <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> to {@link Map.cursorManager use on the map}, for this controller.
   * If <code>null</code>, the map will fall back to the previous cursor that was set on the map.
   *
   * Note that changing this cursor will update {@link Map.cursorManager the cursor on the map's DOM node}.
   * When using multiple controllers (e.g. in a {@link CompositeController}), the controller that updates the cursor last (to a non-null value), will override
   * any other non-null cursors of active controllers on the map.
   *
   * @see {@link Map.cursorManager}
   * @since 2022.1
   */
  protected get cursor(): string | null;
  protected set cursor(cssCursor: string | null);
  /**
   * An event indicating that this Controller has been activated.
   * Activated means that the controller is active on the map, and the controller's onActivate has been called.
   *
   * You can use this event to set up UI elements or other listeners related to the controller and the controller's map.
   *
   * @since 2021.0
   * @event
   */
  on(event: "Activated", callback: (map: Map) => void, context?: any): Handle;
  /**
   * An event indicating that this Controller has been deactivated.
   * Deactivated means that the controller has been removed from the map, and the controller's onDeactivate has been called.
   *
   * You can use this event to clean up UI elements or other listeners related to the controller and the controller's map.
   *
   * @since 2021.0
   * @event
   */
  on(event: "Deactivated", callback: (map: Map) => void, context?: any): Handle;
  /**
   * An event indicating that this Controller is invalidated. Invalidated means that the Controller
   * requests for its {@link onDraw} to be called during the next rendering pass (because its appearance has changed).
   * This event fires when {@link invalidate} is called.
   *
   * @event
   */
  on(event: "Invalidated", callback: () => void, context?: any): Handle;
}