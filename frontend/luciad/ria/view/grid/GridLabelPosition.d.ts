/**
 * Defines the position of grid line labels with respect to the view. They can for example be placed at the left or at
 * the right edge of the view, or both. For example, when a label is placed at the east or south side of a line, it
 * will be placed at the left or lower edge of the view when using a rectangular projection like mercator.
 *
 * @since 2022.0
 */
export declare enum GridLabelPosition {
  /**
   * Places the line label at the east or south side of the parallel or meridian.
   */
  EAST_AND_SOUTH = 1,
  /**
   * Places the line label at the east or north side of the parallel or meridian.
   */
  EAST_AND_NORTH = 2,
  /**
   * Places the line label at the west or south side of the parallel or meridian.
   */
  WEST_AND_SOUTH = 3,
  /**
   * Places the line label at the west or north side of the parallel or meridian.
   */
  WEST_AND_NORTH = 4,
}