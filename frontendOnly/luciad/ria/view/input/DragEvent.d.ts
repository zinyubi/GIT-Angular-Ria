import { GestureEvent } from "./GestureEvent.js";
/**
 * {@link GestureEventType.DRAG}.
 *
 * @since 2021.0.2
 */
export interface DragEvent extends GestureEvent {
  /**
   * A copy of the last down event that preceded this drag event. This can be used to determine
   * where the drag event started.
   */
  readonly downEvent: Omit<DragEvent, 'downEvent'>;
}