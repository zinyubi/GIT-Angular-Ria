import { GestureEvent } from "../input/GestureEvent.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { SelectionType } from "../SelectionType.js";
import { PickInfo } from "../PickInfo.js";
import { PickController } from "./PickController.js";
import { Point } from "../../shape/Point.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
/**
 * A controller that allows the user to select objects on the map.
 * It works for both mouse and touch input.
 *
 * For a list of events handled by this controller, see {@link isPickEvent}.
 *
 * You can customize this controller's behavior by overriding its hooks:
 *
 * ```javascript
 * [[include:view/controller/SelectControllerSnippets.ts_CUSTOM_SELECT_CONTROLLER]]
 * ```
 *
 * When customizing a SelectController, consider doing the same customizations to {@link HoverController}.
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
export declare class SelectController extends PickController {
  constructor();
  getCandidates(viewPoint: Point | null, sensitivity: number, paintRepresentations: PaintRepresentation[], multiple: boolean): PickInfo[];
  handleCandidates(event: GestureEvent, candidates: PickInfo[]): HandleEventResult;
  /**
   * A hook to determine if an event is a selection event.
   * The default implementation checks if it is a {@link GestureEventType.SINGLE_CLICK_CONFIRMED} event.
   * @param event The event to check
   */
  isPickEvent(event: GestureEvent): boolean;
  /**
   * A hook to customize for what events a balloon is shown
   * @param gestureEvent The gesture event to check
   * @param selectionCandidate The selection candidate to check
   */
  isShowBalloon(gestureEvent: GestureEvent, selectionCandidate: PickInfo): boolean;
  /**
   * Determines the type of selection change.
   * The default behavior returns {@link SelectionType.TOGGLE} if the SHIFT key is held, and
   * {@link SelectionType.NEW} otherwise.
   * @param event The event to determine the type of selection for.
   */
  getSelectionType(event: GestureEvent): SelectionType;
}