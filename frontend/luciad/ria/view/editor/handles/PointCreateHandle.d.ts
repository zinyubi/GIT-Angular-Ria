import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { PointDragHandle } from "./PointDragHandle.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { EditContext } from "../../controller/EditContext.js";
import { Point } from "../../../shape/Point.js";
/**
 * A handle that is used to create a single {@link Point}.
 *
 * After clicking or tapping once, the Point is {@link Point.move2DToPoint moved} to the clicked location.
 *
 * @see {@link PointEditor}
 *
 * @since 2022.1
 */
export declare class PointCreateHandle extends PointDragHandle {
  /**
   * Creates a new {@link PointCreateHandle}.
   *
   * @param point The point instance to move to the clicked / tapped location
   * @param onCreateCallback A callback that is called when the point has been placed.
   */
  constructor(point: Point, onCreateCallback: (point: Point) => void);
  getCursor(event: GestureEvent, context: EditContext): string | null;
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
  activate(event: GestureEvent, context: EditContext): HandleEventResult;
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
  shouldActivate(event: GestureEvent, context: EditContext): boolean;
  shouldProcess(event: GestureEvent): boolean;
  shouldDeactivate(event: GestureEvent): boolean;
  shouldPaintFeature(context: EditContext): boolean;
}