/**
 * Determines how an edit move is constrained.
 *
 * For example, it is used by {@link PointDragHandle} to configure if a point handle can be moved
 * horizontally (parallel to the map) or vertically (in the Z direction).
 *
 * @since 2022.1
 */
export declare enum EditMoveConstraint {
  /**
   * With this constraint, movement is only allowed in the X and Y directions.
   * @deprecated This has been deprecated. Please use {@link ON_TERRAIN} instead.
   */
  XY = "XY",
  /**
   * With this constraint, movement is only allowed in the Z direction.
   * X and Y are kept constant.
   * @deprecated This has been deprecated. Please use {@link VERTICAL} instead.
   */
  Z = "Z",
  /**
   * With this constraint, movement is only allowed on the terrain.
   *
   * @since 2023.1
   */
  ON_TERRAIN = "ON_TERRAIN",
  /**
   * With this constraint, movement is only allowed in the vertical or up direction.
   * Horizontal location is kept constant.
   *
   * @since 2023.1
   */
  VERTICAL = "VERTICAL",
  /**
   * With this constraint, movement is only allowed over a horizontal plane.
   * Vertical location is kept constant.
   *
   * @since 2023.1
   */
  HORIZONTAL = "HORIZONTAL",
}