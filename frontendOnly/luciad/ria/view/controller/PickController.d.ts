import { Controller } from "./Controller.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { PickInfo } from "../PickInfo.js";
import { Point } from "../../shape/Point.js";
import { HandleEventResult } from "./HandleEventResult.js";
/**
 * A base class for controllers that perform {@link Map.pickAt map picks}.
 * For example the {@link HoverController}.
 *
 * This controller can be used if you want to implement clicks / interaction with map objects under the mouse or finger.
 *
 * This base class provides hooks to customize how the picking is performed, as well as a callback to handle
 * the candidates returned by a {@link Map.pickAt map pick}.
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 * @since 2022.1
 */
export declare abstract class PickController extends Controller {
  constructor();
  /**
   * Called when a gesture event has been received. This is not intended to be overridden by subclasses.
   * You should override the hooks instead ({@link isPickEvent}, {@link isPickMultiple}, {@link getSensitivity},
   * {@link getPickPoint}, {@link getPaintRepresentations}, {@link getCandidates} and {@link handleCandidates}).
   * @param gestureEvent The gesture event to handle
   */
  onGestureEvent(gestureEvent: GestureEvent): HandleEventResult;
  /**
   * A hook to customize retrieval of candidates at a certain pixel point.
   * The default implementation returns the closest object under the pixel point.
   * @see {@link Map.pickAt}
   * @param viewPoint The point to query, as returned by {@link getPickPoint}
   * @param sensitivity The sensitivity to {@link Map.pickAt pick the map} with, as returned by {@link getSensitivity}
   * @param paintRepresentations The paint representations to {@link Map.pickAt pick the map} with, as returned by {@link getPaintRepresentations}
   * @param multiple Whether or not to consider multiple candidates, cf. {@link isPickMultiple}
   */
  getCandidates(viewPoint: Point | null, sensitivity: number, paintRepresentations: PaintRepresentation[], multiple: boolean): PickInfo[];
  /**
   * Indicates whether {@link getCandidates} should consider multiple candidates.
   *
   * When this returns <code>false</code>, {@link getCandidates} stops when it has found the first (closest) feature.
   * Picking the closest feature is faster than considering multiple candidates.
   *
   * By default, this returns false.
   *
   * @param gestureEvent The event that triggers the pick
   * @since 2024.0
   */
  isPickMultiple(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to customize at which (pixel) point the {@link Map.pickAt map is picked}.
   * By default, {@link GestureEvent.viewPoint} is returned.
   * @return The (pixel) point to pick the map at
   */
  getPickPoint(gestureEvent: GestureEvent): Point | null;
  /**
   * A hook to customize the sensitivity of a pick event. The sensitivity is the number of pixels
   * 'padded' around the event's {@link GestureEvent.viewPoint location} used to {@link getCandidates retrieve candidates}.
   *
   * The default behavior returns a small sensitivity for mouse events, and a larger sensitivity for touch events.
   * The type of event is determined by {@link GestureEvent.inputType}.
   *
   * @param event The event to determine sensitivity for
   */
  getSensitivity(event: GestureEvent): number;
  /**
   * A hook to customize the paint representations used to {@link Map.pickAt pick the map}.
   *
   * The default implementation always returns a list of {@link PaintRepresentation.BODY}
   *
   * @param event The event to determine paint representations for
   */
  getPaintRepresentations(event: GestureEvent): PaintRepresentation[];
  /**
   * A hook to determine if an event is a pick event, ie. if it should be handled by this controller.
   * @param gestureEvent The gesture event to check
   */
  abstract isPickEvent(gestureEvent: GestureEvent): boolean;
  /**
   * A hook to customize what happens with the list of candidates, retrieved by {@link getCandidates}.
   *
   * Examples:
   * <ul>
   *   <li>Selecting one or more candiates, see {@link SelectController}</li>
   *   <li>Hovering one or more candidates, see {@link HoverController}</li>
   *   <li>Showing a balloon on a candidate, see {@link Map.showBalloon}</li>
   *   <li>Opening a context menu on a candidate, see {@link ContextMenuController}</li>
   *   <li>Opening a popup menu in the UI, listing all selection candidates under the mouse</li>
   * </ul>
   *
   * @param gestureEvent The gesture event for which the list of candidates was retrieved
   * @param candidates The candidates, as returned by {@link getCandidates}
   */
  abstract handleCandidates(gestureEvent: GestureEvent, candidates: PickInfo[]): HandleEventResult;
}