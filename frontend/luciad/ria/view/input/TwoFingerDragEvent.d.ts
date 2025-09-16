import { GestureEvent } from "./GestureEvent.js";
/**
 * {@link GestureEventType.TWO_FINGER_DRAG_END}.
 *
 * @since 2022.1
 */
export interface TwoFingerDragEvent extends GestureEvent {
  /**
   * The event that started the two finger drag
   */
  readonly downEvent: Omit<TwoFingerDragEvent, 'downEvent'>;
}