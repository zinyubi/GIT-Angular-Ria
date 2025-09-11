import { HandleEventResult } from "./HandleEventResult.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { PickInfo } from "../PickInfo.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { PickController } from "./PickController.js";
import { Point } from "../../shape/Point.js";
/**
 * A controller that allows the user to hover objects on the map.
 *
 * Note that {@link FeatureLayer.hoverable} needs to be enabled as well, for hovering to work.
 *
 * This controller only handles mouse events.
 *
 * Note that this controller consumes {@link GestureEventType.MOVE} events.
 * Controllers down the chain (see {@link CompositeController}), might also consume {@link GestureEventType.MOVE MOVE} events,
 * for example to update an icon under mouse. Because of this, it's recommended to put this controller <i>after</i>
 * other controllers.
 *
 * For a list of events handled by this controller, see {@link isPickEvent}.
 *
 * ```javascript
 * [[include:view/controller/HoverControllerSnippets.ts_AFTER_OTHER_CONTROLLERS]]
 * ```
 *
 * You can customize this controller's behavior by overriding its hooks:
 *
 * ```javascript
 * [[include:view/controller/HoverControllerSnippets.ts_CUSTOM_HOVER_CONTROLLER]]
 * ```
 *
 * When customizing a HoverController, consider doing the same customizations to {@link SelectController}.
 * This ensures that hovering and selection are consistent. Objects that are hovered, are also
 * selection candidates.
 *
 * See the
 * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
 * Managing user input with LuciadRIA controllers</a>
 * tutorial for more information.
 *
 * @since 2022.1
 */
export declare class HoverController extends PickController {
  constructor();
  /**
   * A hook to determine if an event is a hover event.
   * The default implementation checks if it is a {@link GestureEventType.MOVE} event and that it's a
   * {@link GestureEvent.inputType mouse} event.
   * @param event The event to check
   */
  isPickEvent(event: GestureEvent): boolean;
  getCandidates(viewPoint: Point | null, sensitivity: number, paintReps: PaintRepresentation[], multiple: boolean): PickInfo[];
  handleCandidates(gestureEvent: GestureEvent, candidates: PickInfo[]): HandleEventResult;
}