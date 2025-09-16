import { GestureEvent } from "../input/GestureEvent.js";
import { Controller } from "./Controller.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { Point } from "../../shape/Point.js";
/**
 * Allows the user to rotate a map.
 *
 * In a 2D view, the map is rotated around the center of the map.
 * In 3D, the controller rotates around the point that is under the mouse or between the user's fingers.
 *
 * In 2D, rotation is done by changing the camera's {@link MapNavigatorRotateOptions.deltaRotation rotation}.
 * 3D rotation is done by changing the camera's {@link MapNavigatorRotateOptions.deltaYaw yaw} and
 * {@link MapNavigatorRotateOptions.deltaPitch pitch}.
 *
 * For a list of events handled by this controller, check {@link isRotateEvent}.
 *
 * You can customize the controller by overriding its hooks:
 *
 * ```javascript
 * [[include:view/controller/RotateControllerSnippets.ts_CUSTOM_ROTATE_CONTROLLER]]
 * ```
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 * @since 2022.1
 */
export declare class RotateController extends Controller {
  constructor();
  /**
   * Called when a gesture event has been received. This is not intended to be overridden by subclasses.
   * You should override the hooks instead ({@link isRotateEvent}, {@link isRotateEndEvent}, {@link getRotationCenter},
   * {@link getRotationAngle}, {@link getPitchAngle} and {@link getYawAngle}).
   * @param gestureEvent The gesture event to handle
   */
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * A hook that determines if an event is a rotate event.
   *
   * Note that this should return true for all {@link isRotateEndEvent "rotate end" events}, as well as "non-end" events.
   *
   * For mouse, the default implementation returns true for mouse {@link GestureEventType.DRAG drag}
   * and {@link GestureEventType.DRAG_END "drag end"} events with the right mouse button down.
   * For touch, the default implementation returns true for {@link GestureEventType.ROTATE rotate},
   * {@link GestureEventType.TWO_FINGER_DRAG two finger drag} and
   * {@link GestureEventType.TWO_FINGER_DRAG_END "two finger drag end"} events.
   *
   * @param gestureEvent The gesture event to check.
   */
  isRotateEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook that determines if an event is a "rotate end" event.
   *
   * For mouse, the default implementation returns true for mouse {@link GestureEventType.DRAG_END drag end} events
   * that have the right mouse button down, touch {@link GestureEventType.ROTATE_END rotate end} and
   * {@link GestureEventType.TWO_FINGER_DRAG_END two finger drag} events.
   *
   * @param gestureEvent The gesture event to check.
   */
  isRotateEndEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to determine the center of rotation.
   * This point can be in view (pixel), a model or the map's reference.
   *
   * The default implementation rotates around the point under the mouse/finger.
   * Except for rotation with a mouse on 2D maps. There, rotation happens around the view center.
   *
   * @param gestureEvent The gesture event to determine the rotation center for.
   */
  getRotationCenter(gestureEvent: GestureEvent): Point;
  /**
   * A hook that determines yaw angle of rotation for the current {@link GestureEvent}.
   * This function is only called in 3D. For 2D rotation, see {@link getRotationAngle}.
   *
   * For mouse {@link GestureEventType.DRAG drag events}, the default implementation changes the yaw based on
   * the difference of the x coordinate of the drag event.
   * For touch {@link GestureEventType.ROTATE rotate events}, the default implementation changes the yaw based on
   * the {@link RotateEvent.angle angle} of the rotate event.
   *
   * @param gestureEvent The gestureEvent to determine the yaw angle for.
   * @see {@link MapNavigatorRotateOptions.deltaYaw}
   */
  getYawAngle(gestureEvent: GestureEvent): number;
  /**
   * A hook to customize the pitch angle of rotation for the current {@link GestureEvent}, relative to the start of the rotation.
   * This function is only called in 3D. For 2D rotation, see {@link getRotationAngle}.
   *
   * The default implementation changes the pitch based on the difference of the y coordinate of the drag event.
   * It does this for both mouse {@link GestureEventType.DRAG drag events} and touch
   * {@link GestureEventType.TWO_FINGER_DRAG two finger drag events}.
   *
   * @param gestureEvent The gestureEvent to determine the pitch angle for.
   * @see {@link MapNavigatorRotateOptions.deltaPitch}
   */
  getPitchAngle(gestureEvent: GestureEvent): number;
  /**
   * A hook to customize the angle of rotation for the current {@link GestureEvent}, relative to the start of the rotation.
   * This function is only called in 2D. For 3D rotation, see {@link getYawAngle} and {@link getPitchAngle}.
   *
   * For mouse {@link GestureEventType.DRAG drag events}, the default implementation determines a rotation
   * based on the angle of the mouse event relative to the center of the screen.
   *
   * For touch {@link GestureEventType.ROTATE rotate events}, the default implementation determines a rotation based
   * on the {@link RotateEvent.angle angle} of the gesture event.
   *
   * @param gestureEvent The gestureEvent to determine the rotation angle for.
   * @see {@link MapNavigatorRotateOptions.deltaRotation}
   */
  getRotationAngle(gestureEvent: GestureEvent): number;
}