/**
 * An enumeration describing GestureEventType
 */
export declare enum GestureEventType {
  /**
   * Used when a double-tap occurs. {@link GestureEvent.domEvent} returns the
   * down DOM event of the first tap of the double-tap.
   */
  DOUBLE_CLICK = 1,
  /**
   * Used when an event within a double-tap gesture occurs, including the down, move,
   * and up events. {@link GestureEvent.domEvent}
   * returns the DOM event that occurred during the double-tap gesture.
   */
  DOUBLE_CLICK_EVENT = 2,
  /**
   * Used when a tap occurs. This will be triggered immediately for every down event. All other
   * events should be preceded by this. {@link GestureEvent.domEvent}
   * returns the down DOM event that triggered this gesture event.
   */
  DOWN = 3,
  /**
   * Used for a mouse wheel scroll events. When it occurs, {@link GestureEvent.domEvent}
   * returns the scroll event that triggered this gesture event. An event of this type also contains an
   * <code>amount</code> property that indicates how large the scroll event was.
   * The value of the amount property is positive if the scroll direction is upwards, negative otherwise.
   */
  SCROLL = 4,
  /**
   * Used when a long press occurs. {@link GestureEvent.domEvent}
   * returns the down event that started the long press.
   */
  LONG_PRESS = 5,
  /**
   * Used when a drag occurs. When it occurs, {@link GestureEvent.domEvent}
   * returns the move event that triggered this gesture event.
   * The drag event additionally contains a <code>downEvent</code> property which contains a copy of the last down
   * event that preceded the drag event. This can be used to determine where the drag event started.
   */
  DRAG = 6,
  /**
   * Used when a drag gesture ends. When it occurs, {@link GestureEvent.domEvent}
   * returns the up event that triggered this gesture event.
   */
  DRAG_END = 7,
  /**
   * Used when the user has performed a down DOM event and not performed a move
   * or up yet. This event is commonly used to provide visual feedback to the user to let them
   * know that their action has been recognized i.e. highlight an element.
   * {@link GestureEvent.domEvent} returns the down motion event.
   */
  SHOW_PRESS = 8,
  /**
   * Used when a single-tap occurs. Unlike {@link SINGLE_CLICK_UP}, this gesture will only be
   * used after the detector is confident that the user's first tap is not followed by a second
   * tap leading to a double-click gesture. Note that there is a delay before the
   * detector can be sure that it's a confirmed single click, and not a double click.
   * Use {@link SINGLE_CLICK_UP} if you want to respond to clicks without a delay, but keep
   * in mind that this will also fire (twice) on double clicks.
   * {@link GestureEvent.domEvent} returns the down DOM event of the single-click.
   */
  SINGLE_CLICK_CONFIRMED = 9,
  /**
   * Used when a click occurs. {@link GestureEvent.domEvent}
   * returns the up DOM event that completed the first tap.
   * The difference with {@link SINGLE_CLICK_CONFIRMED} is that this event is fired
   * immediately when the mouse button is clicked, whereas {@link SINGLE_CLICK_CONFIRMED}
   * only fires after a small delay, when the gesture detector is confident that it's a single
   * click and not a double click.
   */
  SINGLE_CLICK_UP = 10,
  /**
   * Used when a pinch event occurs. The {@link GestureEvent.domEvent} returns the dom event
   * that triggered the current pinch event.  The pinch event additionally contains a <code>scaleFactor</code>
   * property which indicates whether the fingers are progressing towards each other (<1) or away from each
   * other (>1). <code>scaleFactor</code> is defined as the ratio of the current span (distance between fingers) to the previous span.
   * The pinch event also has a <code>scaleFactorFromStart</code> property, which is defined as the ratio of the current span
   * to the span at the start of the pinch.
   */
  PINCH = 11,
  /**
   * Used when a move event occurs that is not considered a drag. When it occurs,
   * {@link GestureEvent.domEvent} returns the move event that triggered this gesture event.
   */
  MOVE = 12,
  /**
   * Used when an up event occurs. When it occurs,
   * {@link GestureEvent.domEvent} returns the up event that triggered this gesture event.
   */
  UP = 13,
  /**
   * Used when a context menu should be shown.
   * {@link GestureEvent.domEvent} returns the up event that triggered this gesture event.
   */
  CONTEXT_MENU = 14,
  /**
   * Used when dragging with 2 fingers in the same direction.
   * When it occurs, {@link GestureEvent.domEvent} returns the touch event that triggered this gesture event.
   * Its {@link GestureEvent.viewPosition viewPosition}
   * and {@link GestureEvent.pagePosition pagePosition}
   * properties refer to the current center between the two fingers.
   * @see {@link TwoFingerDragEvent}
   */
  TWO_FINGER_DRAG = 15,
  /**
   * Used when scrolling with 2 fingers in the same direction ends.
   * @see {@link TwoFingerDragEvent}
   */
  TWO_FINGER_DRAG_END = 16,
  /**
   * Used when performing a 'turn' or rotation gesture with touch.
   * When it occurs, {@link GestureEvent.domEvent} returns the touch event that triggered this gesture event.
   * Its {@link GestureEvent.viewPosition viewPosition}
   * and {@link GestureEvent.pagePosition pagePosition} properties refer to the center between the two fingers, at the start of the twist.
   * @see {@link RotateEvent}
   */
  ROTATE = 17,
  /**
   * Used when performing a 'turn' or rotation gesture with touch ends.
   * @see {@link RotateEvent}
   */
  ROTATE_END = 18,
  /**
   * Used when a pinch event ends.
   */
  PINCH_END = 19,
}