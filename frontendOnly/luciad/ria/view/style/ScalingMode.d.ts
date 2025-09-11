/**
 * Describes the methods that are available for determining point sizes. <br/>
 * The Scaling Mode determines how the scale expression of the point cloud style is interpreted.
 * Please see {@link PointCloudStyle} for more details.
 * @since 2018.0
 */
declare enum ScalingMode {
  /**
   * Scaling mode to scale point size in function of the distance to the eye and the tile geometric error.
   * The points are given a world size adapted to the local density of the point cloud.
   * This creates, to the largest extent possible, a visually continuous and opaque coverage.
   */
  ADAPTIVE_WORLD_SIZE = "ADAPTIVE_WORLD_SIZE",
  /**
   * The Scaling mode to scale all points with same size on screen in pixels.
   */
  PIXEL_SIZE = "PIXEL_SIZE",
  /**
   * The Scaling mode to scale all points with same physical size in meters.
   * @since 2022.0
   */
  WORLD_SIZE = "WORLD_SIZE",
}
export { ScalingMode };