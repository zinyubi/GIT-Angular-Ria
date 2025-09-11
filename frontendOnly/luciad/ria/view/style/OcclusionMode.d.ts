/**
 * An enumeration describing when a style should be painted in 3D in relation to other 3D data.
 * See {@link GenericIconStyle.occlusionMode IconStyle.occlusionMode} or {@link ShapeStyle.occlusionMode} for details
 * and limitations.
 */
declare enum OcclusionMode {
  /**
   * Show only the part of a shape that is not obscured by other 3D data.  This is the default.
   */
  VISIBLE_ONLY = 0,
  /**
   * Show the entire shape even if behind by other 3D data.  The shape will appear in front of other objects.
   */
  ALWAYS_VISIBLE = 1,
  /**
   * Shows only the part of the shape that is behind other 3D data.
   * You typically use this to display obscured shapes in combination with another style that uses "VISIBLE" mode.
   */
  OCCLUDED_ONLY = 2,
}
export { OcclusionMode };