import { GestureEvent } from "../input/GestureEvent.js";
import { PaintRepresentation } from "../PaintRepresentation.js";
import { PickInfo } from "../PickInfo.js";
import { Point } from "../../shape/Point.js";
import { PickController } from "./PickController.js";
import { HandleEventResult } from "./HandleEventResult.js";
/**
 * A controller that allows the user to open a context menu on the map.
 *
 * You can customize this controller's behavior by overriding its hooks:
 * ```javascript
 * [[include:view/controller/ContextMenuControllerSnippets.ts_CUSTOM_CONTEXT_MENU_CONTROLLER]]
 * ```
 *
 * @since 2022.1
 */
export declare class ContextMenuController extends PickController {
  constructor();
  /**
   * A hook to determine if an event is a context menu event.
   * The default implementation checks if it is a {@link GestureEventType.LONG_PRESS} event.
   * param event The event to check
   */
  isPickEvent(event: GestureEvent): boolean;
  getCandidates(viewPoint: Point | null, sensitivity: number, paintRepresentations: PaintRepresentation[], multiple: boolean): PickInfo[];
  handleCandidates(gestureEvent: GestureEvent, selectionCandidates: PickInfo[]): HandleEventResult;
}