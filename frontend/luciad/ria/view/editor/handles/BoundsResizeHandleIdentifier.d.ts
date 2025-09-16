/**
 * An identifier for a {@link BoundsResizeHandle}.
 *
 * @see {@link BoundsEditor.createBoundsResizeHandle}
 * @since 2022.1
 */
export declare enum BoundsResizeHandleIdentifier {
  /**
   * An identifier for the lower left corner of the bounds,
   * i.e. the corner at coordinate [{@link Bounds.y bounds.y}].
   */
  LOWER_LEFT = "LOWER_LEFT",
  /**
   * An identifier for the upper left corner of the bounds,
   * i.e. the corner at coordinate [{@link Bounds.height bounds.height}].
   */
  UPPER_LEFT = "UPPER_LEFT",
  /**
   * An identifier for the upper right corner of the bounds,
   * i.e. the corner at coordinate [{@link Bounds.height bounds.height}].
   */
  UPPER_RIGHT = "UPPER_RIGHT",
  /**
   * An identifier for the lower right corner of the bounds,
   * i.e. the corner at coordinate [{@link Bounds.y bounds.y}].
   */
  LOWER_RIGHT = "LOWER_RIGHT",
}