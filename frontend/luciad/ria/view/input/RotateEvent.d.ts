import { GestureEvent } from "./GestureEvent.js";
/**
 * {@link GestureEventType.ROTATE_END}.
 *
 * @since 2022.1
 */
export interface RotateEvent extends GestureEvent {
  /**
   * The current angle of the rotate event.
   * It is defined as the angle between the horizontal of the screen (through the first finger) and the line connecting the two fingers.
   * It is measured in degrees and counter-clockwise positive. An angle of 0 refers to the position where the first finger is located to the left of the
   * other finger. If the first finger is to the right of the second finger, the angle will be 180.
   */
  angle: number;
  /**
   * Returns the span, in pixels, between the two fingers.
   */
  span: number;
  /**
   * The event that started the rotation.
   */
  downEvent: RotateEvent;
}