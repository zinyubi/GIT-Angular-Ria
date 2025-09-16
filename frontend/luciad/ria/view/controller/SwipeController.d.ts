import { GestureEvent } from "../input/GestureEvent.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { Controller } from "./Controller.js";
import { Map } from "../Map.js";
import { Point } from "../../shape/Point.js";
import { Handle } from "../../util/Evented.js";
import { Layer } from "../Layer.js";
/**
 * Indicates the direction of the swipe line.
 *
 * @since 2021.0
 */
export declare enum SwipeLineOrientation {
  HORIZONTAL = 1,
  VERTICAL = 2,
}
/**
 * Controller that allows to visually comparing two sets of layers by displaying them on either side of a swipe line.
 * By moving the swipe line, different parts of the layer sets are revealed and hidden.
 * This allows easily spotting differences between the layer sets.
 *
 * <p>
 * Swiping is done by dragging the swipe line using the mouse from left-to-right or top-to-bottom,
 * depending on {@link SwipeController.swipeLineOrientation the swipe line orientation}.
 * The SwipeController can {@link SwipeController.automaticOrientation automatically switch} between
 * {@link SwipeLineOrientation.HORIZONTAL horizontal} and {@link SwipeLineOrientation.VERTICAL vertical} orientations.
 * <p>
 *
 * <table border="0" align="center">
 *   <tr align="center">
 *     <td width="600"><img src="media://controller/swipe.gif"
 *         alt="Swipe controller usage"
 *         width="600">
 *     </td>
 *   </tr>
 *   <tr align="center">
 *     <td>SwipeController in action</td>
 *   </tr>
 * </table>
 *
 * <p>
 * Usage:
 *
 * ```javascript
 * [[include:view/controller/SwipeControllerCreateSnippets.ts_CREATE_SWIPE_CONTROLLER]]
 * ```
 * </p>
 *
 * <p>
 * Note that you can only use the SwipeController on a {@link WebGLMap}.
 * It also requires support for certain WebGL extensions.
 * You can open the "LuciadRIA WebGLMap support" sample on a device you're targeting to check if these requirements are met.
 * </p>
 *
 * <p>
 * The SwipeController provides no out-of-the-box UI. You can use the sample UI implementation from
 * <code>samples/common/ui/controllers/ui/SampleSwipeUI</code> as-is. It can be re-styled using CSS variables.
 * You can also use it as a reference to create your own UI on top of the SwipeController API.
 * </p>
 *
 * <p>
 * You can customize the controller to respond to keyboard events as follows:
 * </p>
 *
 * ```javascript
 * [[include:view/controller/SwipeControllerCustomizationSnippets.ts_SWIPE_CUSTOMIZATION]]
 * ```
 *
 * @since 2021.0
 */
export declare class SwipeController extends Controller {
  /**
   * Creates a new {@link SwipeController}
   *
   * @since 2021.0
   */
  constructor();
  onActivate(map: Map): void;
  onDeactivate(map: Map): Promise<void> | void;
  /**
   * Sets the two sets of layers to swipe.
   * <p/>
   * Note that layers in the view that are not specified here are not affected. This for example means
   * that if you swipe between layers A and C, but layer B appears in-between layer A and C,
   * that the swipe controller will turn the left part of A visible and the right part of C visible,
   * but that B will obstruct C and the swiping will appear to happen between A and B as opposed
   * to A and C. To overcome this, you can swipe between consecutive layers. In the example
   * this would mean that you swipe between the collections {A,B} and {C}.
   *
   * <p>
   * Layers that are not mentioned in any of the two layer sets, are always visible.
   * </p>
   *
   * <p>
   * If you want to swipe just one layer, put the one layer in its own layer set, and leave the other layer set empty.
   * </p>
   *
   * ```javascript
   * swipeController.layers = [[layerToSwipe], []];
   * ```
   *
   */
  set layers(val: [Layer[], Layer[]]);
  get layers(): [Layer[], Layer[]];
  invalidate(): void;
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * Sets the swipe line location in view coordinates. If the swipe line has a horizontal
   * orientation, only the y coordinate is relevant. If the swipe line has a vertical orientation,
   * the x coordinate is considered.
   *
   * For view coordinates, the reference of the point is <code>null</code>.
   *
   * @param location The x-coordinate is relevant when the swipe line has vertical orientation and the y-coordinate is relevant when the swipe line has horizontal orientation.
   */
  set swipeLineLocation(location: Point);
  get swipeLineLocation(): Point;
  /**
   * Sets the orientation of the swipe line. A horizontal swipe line means
   * that the line moves from the left to the right side of the view and that layers
   * appear in the top- or bottom-half of the view. A vertical swipe line means
   * that the line moves from top to bottom of the view and the layers are clipped
   * to appear on the left or right side of the view.
   */
  set swipeLineOrientation(orientation: SwipeLineOrientation);
  get swipeLineOrientation(): SwipeLineOrientation;
  /**
   * Sets whether the controller is allowed to automatically change the swipe line orientation
   * when dragging the mouse.
   * <p>
   * By default automatic orientation changes are allowed.
   * </p>
   */
  set automaticOrientation(enabled: boolean);
  get automaticOrientation(): boolean;
  /**
   * Indicates if the mouse is hovering the swipe line.
   * You can use this to change the styling of the swipe line UI, or update the cursor.
   * @since 2021.0
   */
  get hovering(): boolean;
  /**
   * Indicates if the user is swiping (dragging the swipe line).
   * You can use this to change the styling of the swipe line UI, or update the cursor.
   * @since 2021.0
   */
  get swiping(): boolean;
  /**
   * An event that is fired when the layers change
   * @see {@link SwipeController.layers}
   * @since 2021.0
   * @event
   */
  on(event: "LayersChange", callback: (layers: [Layer[], Layer[]]) => void): Handle;
  /**
   * An event that is fired when the location of the swipe line changes
   * @see {@link SwipeController.swipeLineLocation}
   * @since 2021.0
   * @event
   */
  on(event: "SwipeLineLocationChange", callback: (swipeLineLocation: Point) => void): Handle;
  /**
   * An event that is fired when the orientation of the swipe line changes
   * @see {@link SwipeController.swipeLineOrientation}
   * @since 2021.0
   * @event
   */
  on(event: "SwipeLineOrientationChange", callback: (swipeLineOrientation: SwipeLineOrientation) => void): Handle;
  /**
   * An event that is fired when the automatic swipe line orientation setting changes
   * @see {@link SwipeController.automaticOrientation}
   * @since 2021.0
   * @event
   */
  on(event: "AutomaticOrientationChange", callback: (automaticSwipeLineOrientation: boolean) => void): Handle;
  /**
   * An event that is fired when the mouse is (no longer) hovering over the swipe line.
   *
   * You can use this to change the styling of the swipe line, or update the cursor.
   *
   * @see {@link SwipeController.hovering}
   * @since 2021.0
   * @event
   */
  on(event: "HoveringChanged", callback: (isHovering: boolean) => void): Handle;
  /**
   * An event that is fired when the user is (no longer) swiping (dragging the swipe line).
   *
   * You can use this to change the styling of the swipe line, or update the cursor.
   *
   * @see {@link SwipeController.swiping}
   * @since 2021.0
   * @event
   */
  on(event: "SwipingChanged", callback: (isSwiping: boolean) => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event
   */
  on(event: "Invalidated", callback: () => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event
   */
  on(event: "Activated", callback: (map: Map) => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event
   */
  on(event: "Deactivated", callback: (map: Map) => void): Handle;
}