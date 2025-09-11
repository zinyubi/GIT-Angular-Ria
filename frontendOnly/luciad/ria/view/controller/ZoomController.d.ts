import { GestureEvent } from "../input/GestureEvent.js";
import { Controller } from "./Controller.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { Point } from "../../shape/Point.js";
import { MapNavigatorAnimationOptions } from "../MapNavigator.js";
/**
 * Describes X and Y zoom factors.
 * Typically, these are equal to each other.
 * Only maps showing non-georefenced data ("Cartesian" maps, for example a timeline) allow non-uniform XY zooming.
 *
 * @see {@link ZoomController.getZoomFactor}
 * @since 2023.1
 */
export interface ZoomFactor {
  /**
   * The zoom factor for the X axis
   */
  x: number;
  /**
   * The zoom factor for the Y axis
   */
  y: number;
}
/**
 * A controller that allows the user to zoom the map.
 *
 * For a list of events handled by this controller, see {@link isZoomEvent}.
 *
 * You can customize this controller's behavior by overriding its hooks:
 *
 * ```javascript
 * [[include:view/controller/ZoomControllerSnippets.ts_CUSTOM_ZOOM_CONTROLLER]]
 * ```
 *
 * ```javascript
 * [[include:view/controller/ZoomControllerSnippets.ts_ZOOM_DRAG_RIGHT_MOUSE_BUTTON]]
 * ```
 *
 * @since 2022.1
 */
export declare class ZoomController extends Controller {
  constructor();
  /**
   * Called when a gesture event has been received. This is not intended to be overridden by subclasses.
   * You should override the hooks instead ({@link isZoomEvent}, {@link isZoomEndEvent}, {@link getZoomFactor},
   * {@link getZoomTarget}, {@link getZoomAnimationOptions} and {@link isSnapToScaleLevels}).
   * @param gestureEvent The gesture event to handle
   */
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * A hook to customize the zoom target for the given gesture event.
   * This can be a point in view (pixel), model or the map's reference.
   * If it's a point in view reference, a zoom target underneath that view point is determined automatically.
   * For {@link isZoomEvent incremental} zooms, the target is determined at the start of the interaction.
   * For example, at the start of a touch pinch gesture.
   * @param gestureEvent The gesture event to determine a zoom target point for
   * @return a zoom target point, or null if no point could be determined
   */
  getZoomTarget(gestureEvent: GestureEvent): Point | null;
  /**
   * A hook to determine the zoom factor for a given gesture event.
   * Factors larger than 1 zoom the map in, factors smaller than one zoom the map out.
   * If 1 is returned, no zooming is performed.
   *
   * For georeferenced maps, the x and y factor should be the same.
   * For cartesian maps, the x factor can be different from the y factor, so you can zoom on just 1 axis.
   * For example, on a timeline (which is a cartesian map), you may want to zoom on just the x-axis.
   *
   * For {@link isZoomEvent incremental} zooms, the factor is relative to the start of the zoom operation. For example, when the pinch started.
   * For {@link isZoomEvent non-incremental} zooms, the factor is relative to the current state of the map.
   *
   * The default implementation:
   * <ul>
   *   <li>For scroll events, it keeps track {@link ScrollEvent.amount how much the mouse wheel was scrolled} during the current zoom animation,
   *       and returns a factor based on that. If the shift key is down, it zooms slower.</li>
   *   <li>For double click events, it zooms out (factor < 1) if the right mouse button was used, otherwise it zooms in (factor > 1).</li>
   *   <li>For pinch events, it uses {@link PinchEvent.scaleFactorFromStart}.</li>
   * </ul>
   *
   * An example of getZoomFactor customization is inverting the original zooming, so the map zooms in when the original
   * controller would've zoomed out:
   *
   * ```javascript
   * [[include:view/controller/ZoomControllerSnippets.ts_INVERT_ZOOMING]]
   * ```
   *
   * @param gestureEvent The gesture event to determine a zoom factor for
   * @see {@link MapNavigatorZoomOptions.factor}
   */
  getZoomFactor(gestureEvent: GestureEvent): ZoomFactor;
  /**
   * A hook to customize animation options for the zoom animation.
   * This allows you to change the {@link MapNavigatorAnimationOptions.duration duration} of the zoom animation,
   * or its {@link MapNavigatorAnimationOptions.ease easing function}, or turn off animated zooms completely.
   *
   * These options are passed to {@link MapNavigatorZoomOptions.animate}.
   *
   * @param gestureEvent The gesture event to determine animation options for
   */
  getZoomAnimationOptions(gestureEvent: GestureEvent): boolean | MapNavigatorAnimationOptions;
  /**
   * A hook to check if a gesture event is a zoom event.
   *
   * If an event is both a {@link isZoomEvent "zoom event"} <b>and</b> a {@link isZoomEndEvent "zoom end event"},
   * a short zoom animation is played (or extended, if it was already running).
   * An example is the default {@link GestureEventType.SCROLL mouse scrollwheel}
   * zooming, which plays a zoom animation every time the event occurs.
   *
   * If an event is a {@link isZoomEvent "zoom event"} but <b>not</b> a {@link isZoomEndEvent "zoom end event"},
   * zooming happens "incrementally" until a {@link isZoomEndEvent "zoom end event"} marks the end of the zoom.
   * An example is touch {@link GestureEventType.PINCH pinch} zooming, which keeps zooming until a
   * {@link GestureEventType.PINCH_END "pinch end" event} occurs.
   *
   * The default implementation returns true for {@link GestureEventType.SCROLL scroll events},
   * , {@link GestureEventType.PINCH pinch events}
   * and {@link GestureEventType.PINCH_END "pinch end" events}.
   *
   * @param gestureEvent The gesture event to check.
   */
  isZoomEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to check if a gesture event is a zoom end event.
   *
   * If an event is both a {@link isZoomEvent "zoom event"} <b>and</b> a {@link isZoomEndEvent "zoom end event"},
   * a short zoom animation is played (or extended, if it was already running).
   * An example is the default {@link GestureEventType.SCROLL mouse scrollwheel}
   * zooming, which plays a zoom animation every time the event occurs.
   *
   * If an event is a {@link isZoomEvent "zoom event"} but <b>not</b> a {@link isZoomEndEvent "zoom end event"},
   * zooming happens "incrementally" until a {@link isZoomEndEvent "zoom end event"} marks the end of the zoom.
   * Examples include touch {@link GestureEventType.PINCH pinch} zooming, which keeps zooming until a
   * {@link GestureEventType.PINCH_END "pinch end" event} occurs.
   *
   * The default implementation returns true for {@link GestureEventType.SCROLL scroll events},
   * , {@link GestureEventType.PINCH_END "pinch end" events}.
   *
   * @param gestureEvent The gesture event to check.
   */
  isZoomEndEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to customize if the zooming should snap to scale levels.
   * The default implementation snaps to scale levels if CTRL is held down.
   *
   * @see {@link MapNavigatorZoomOptions.snapToScaleLevels}
   * @param gestureEvent The gesture event to determine if zooming should snap to scale levels.
   */
  isSnapToScaleLevels(gestureEvent: GestureEvent): boolean;
}