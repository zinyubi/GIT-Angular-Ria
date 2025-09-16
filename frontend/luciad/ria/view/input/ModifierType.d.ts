/**
 * An enumeration describing ModifierType
 */
export declare enum ModifierType {
  /**
   *  Used when there is no modifier key (Alt, Ctrl or Shift) pressed during a Gesture Event.
   */
  NO_MOD = 0,
  /**
   *  Used when Alt is pressed during a Gesture Event.
   */
  ALT = 1,
  /**
   *  Used when Ctrl is pressed during a Gesture Event.
   */
  CTRL = 2,
  /**
   *  Used when Alt and Shift are pressed during a Gesture Event.
   */
  ALT_CTRL = 3,
  /**
   *  Used when Shift is pressed during a Gesture Event.
   */
  SHIFT = 4,
  /**
   *  Used when Alt and Ctrl are pressed during a Gesture Event.
   */
  ALT_SHIFT = 5,
  /**
   *  Used when Ctrl and SHIFT are pressed during a Gesture Event.
   */
  CTRL_SHIFT = 6,
  /**
   *  Used when Alt, Ctrl and Shift are pressed during a Gesture Event.
   */
  ALT_CTRL_SHIFT = 7,
}