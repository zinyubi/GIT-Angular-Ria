/**
 * An enumeration describing label rotations
 */
declare enum PathLabelRotation {
  /**
   * Don't rotate the label, but instead draw the label horizontally (compared to the
   * screen).
   */
  NO_ROTATION = 0,
  /**
   * Rotates the label relative to the angle of the path at which point the label is drawn.
   */
  FIXED_LINE_ANGLE = 1,
}
export { PathLabelRotation };