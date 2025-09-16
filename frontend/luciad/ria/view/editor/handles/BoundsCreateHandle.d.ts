import { Bounds } from "../../../shape/Bounds.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { ThreeStepEditHandle } from "./ThreeStepEditHandle.js";
/**
 * Handle that creates a {@link Bounds bounds} shape.
 * Creation can be done:
 * <ul>
 *   <li><b>by dragging the mouse</b>.
 *       The start of the drag gesture marks one corner, the end of the drag marks the opposite corner.
 *   </li>
 *   <li><b>by clicking</b>.The first click marks one corner, the second click marks the opposite corner.
 *   </li>
 * </ul>
 *
 * @see {@link BoundsEditor}
 * @since 2022.1
 */
export declare class BoundsCreateHandle extends ThreeStepEditHandle {
  /**
   * Constructs a new BoundsCreateHandle
   */
  constructor(bounds: Bounds);
  /**
   * The bounds instance being created
   */
  get bounds(): Bounds;
  shouldActivate(event: GestureEvent, context: EditContext): boolean;
  activate(event: GestureEvent, context: EditContext): HandleEventResult;
  shouldPaintFeature(context: EditContext): boolean;
  shouldProcess(event: GestureEvent): boolean;
  process(event: GestureEvent, context: EditContext): HandleEventResult;
  shouldDeactivate(event: GestureEvent): boolean;
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
  getCursor(): string | null;
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}