/**
 * An object literal containing instructions for repeating labels along a path (for example, the path
 * of a line or the outside path of a polygon).
 */
interface OnPathLabelRepeatOptions {
  /**
   * Describes the distance in pixels between the beginning of the path and the label.
   * When you zoom in much onto a path then the <code>initialGap</code> defines how far away the first label will be drawn
   * relative to the start of the rendering line. The <code>initialGap</code> defaults to the value for <code>minimumGap</code>.
   */
  initialGap?: number;
  /**
   * Defines the minimum gap in pixels between two labels on the same path.
   * <p> The default value is 200 (pixels).
   */
  minimumGap?: number;
}
export { OnPathLabelRepeatOptions };