import { GestureEvent } from "./GestureEvent.js";
/**
 * {@link GestureEventType.SCROLL}.
 *
 * @since 2021.0.2
 */
export interface ScrollEvent extends GestureEvent {
  /**
   * A number that indicates how large the scroll event was.
   * The amount is positive if the scroll direction is upwards, negative otherwise.
   */
  readonly amount: number;
}