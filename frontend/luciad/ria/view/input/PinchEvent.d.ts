import { GestureEvent } from "./GestureEvent.js";
/**
 * {@link GestureEventType.PINCH}.
 *
 * @since 2021.0.2
 */
export interface PinchEvent extends GestureEvent {
  /**
   * A factor indicating whether the pinching fingers are progressing towards each other (<1) or away from each other (>1).
   * The factor is defined as the ratio of the current span (distance between fingers) to the previous span.
   */
  readonly scaleFactor: number;
  /**
   * A factor defined as the ratio of the current span (distance between fingers) to the span at the start of the pinch.
   */
  readonly scaleFactorFromStart: number;
}