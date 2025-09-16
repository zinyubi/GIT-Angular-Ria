/**
 * The Location Mode constants identify how the Transformation object interprets a view position in 3D space.
 * Location Mode is used in {@link Map.getViewToMapTransformation}.
 */
export declare enum LocationMode {
  /**
   * Defines the view-to-map transformation mode that provides a corresponding world position on the terrain for a given view point (pixel).
   * Terrain mode includes the elevation layer in the map, if one is available and visible.
   * For 3D cartesian world references, this mode yields a corresponding world position on the z = 0 plane.
   */
  TERRAIN = "TERRAIN",
  /**
   * Defines the view-to-map transformation mode that provides a corresponding world position on a closest surface for a given view point (pixel).
   * This mode yields a world (map) point position on the closest surface that is a part of a 3D object (3D meshes, point clouds, an extruded shape, a 3D icon) or the terrain.
   * This mode has an effect on 3D maps only.
   */
  CLOSEST_SURFACE = "CLOSEST_SURFACE",
  /**
   * Defines the view-to-map transformation mode that provides a corresponding world position on the ellipsoid of the map reference for a given view point (pixel).
   * This mode has effect on 3D maps only. On 2D maps, this mode returns exactly the same result as the other location modes, due to the lack of
   * height information.  On 3D cartesian maps, this mode returns exactly the same result as the terrain mode.
   * @since 2020.0
   */
  ELLIPSOID = "ELLIPSOID",
}
/**
 * Transformation options passed to {@link Map.getViewToMapTransformation} with the LocationMode.ELLIPSOID mode.
 * @since 2022.0
 */
export interface EllipsoidTransformationOptions {
  /**
   * The height offset of the transformation in meters.
   */
  heightOffset?: number;
}