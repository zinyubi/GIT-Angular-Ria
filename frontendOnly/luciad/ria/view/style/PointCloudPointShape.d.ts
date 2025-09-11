/**
 * Determines the shape of the dots used to draw point clouds.
 * <p/>
 * Please see {@link PointCloudStyle} for more details.
 * @since 2022.0
 */
declare enum PointCloudPointShape {
  /**
   * Draw point cloud dots as discs.
   * <p/>
   * This is the most performing.
   * When using large point sizes with lots of overlap, it can result in a more pixelated, low-resolution display even if you have high point density.
   * <p/>
   * This is the default for HSPC point clouds.
   */
  DISC = "DISC",
  /**
   * Draw point cloud dots as spheres.
   * <p/>
   * Large points with lots of overlap results in a high quality visual coverage of your data, but at the cost of performance.
   * <p/>
   * This is the default for OGC 3D Tiles point clouds.
   */
  SPHERE = "SPHERE",
}
export { PointCloudPointShape };