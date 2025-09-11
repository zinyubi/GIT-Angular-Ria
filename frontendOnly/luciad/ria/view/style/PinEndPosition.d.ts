/**
 * An enumeration describing the possible end positions of a label pin.
 */
declare enum PinEndPosition {
  /**
   * Attach the pin to the middle of the label.
   */
  MIDDLE = 1,
  /**
   * Attach the pin to the middle of the nearest border of the label.
   */
  BORDER = 2,
  /**
   * Attach the pin to the middle of the label, cut off at the border.
   */
  MIDDLE_BORDER = 3,
}
export { PinEndPosition };