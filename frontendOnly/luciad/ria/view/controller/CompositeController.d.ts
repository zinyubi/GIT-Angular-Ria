import { Controller } from "./Controller.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { KeyEvent } from "../input/KeyEvent.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { LabelCanvas } from "../style/LabelCanvas.js";
/**
 * Options which can be passed to the {@link CompositeController} constructor.
 *
 * @since 2024.0.2
 */
export interface CompositeControllerConstructorOptions {
  /**
   * Controllers that will be appended to the new composite controller one by one.
   * The first controller in the array will be the first controller to handle events.
   */
  delegates?: Controller[];
}
/**
 * Composes a chain of controllers.
 *
 * This controller allows you to chain multiple controllers together, one after the other.
 * Events are forwarded down the chain, until the first controller handles the event.
 *
 * Use {@link appendController} or {@link prependController} to add controllers to the chain.
 *
 * See the <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 * @since 2022.1
 */
export declare class CompositeController extends Controller {
  constructor(options?: CompositeControllerConstructorOptions);
  get delegates(): Controller[];
  /**
   * Called when the controller becomes active on the map.
   * {@link Controller.onActivate} is called for every controller in the chain.
   * @param map the map on which the controller has been activated
   */
  onActivate(map: Map): void;
  /**
   * Called when the controller is removed from the map.
   * {@link Controller.onDeactivate} is called for every controller in the chain.
   * The returned promise resolves to an array containing the results of calling {@link Controller.onDeactivate}
   * on the chained controllers.
   * @param map the map on which the controller is being deactivated
   */
  onDeactivate(map: Map): Promise<void> | void;
  /**
   * Called when a gesture event has been received.
   * {@link Controller.onGestureEvent} is called for controllers down the chain, until a controller handles the event.
   * @param gestureEvent The gesture event that was received.
   */
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * Called when a key event has been received.
   * {@link Controller.onKeyEvent} is called for controllers down the chain, until a controller handles the event.
   * @param keyEvent The key event that was received.
   */
  onKeyEvent(keyEvent: KeyEvent): HandleEventResult;
  /**
   * Callback for drawing shapes on the map.
   * {@link Controller.onDraw} is called for every controller in the chain.
   * @param geoCanvas The geoCanvas to draw on
   */
  onDraw(geoCanvas: GeoCanvas): void;
  /**
   * Callback for drawing labels on the map.
   * {@link Controller.onDrawLabel} is called for every controller in the chain.
   * @param labelCanvas The labelCanvas to draw on
   */
  onDrawLabel(labelCanvas: LabelCanvas): void;
  /**
   * Invalidates this controller.
   * {@link Controller.invalidate} is called for every controller in the chain.
   */
  invalidate(): void;
  /**
   * Chains a new controller at the end of this CompositeController's delegates.
   * Note that you cannot append controllers while the CompositeController is active on the map.
   * @param controller The new controller to append to the chain of controllers
   */
  appendController(controller: Controller): void;
  /**
   * Chains a new controller to the start of this CompositeController's delegates.
   * Note that you cannot prepend controllers while the CompositeController is active on the map.
   * @param controller The new controller to prepend to the chain of controllers
   *
   * @since 2024.0
   */
  prependController(controller: Controller): void;
}