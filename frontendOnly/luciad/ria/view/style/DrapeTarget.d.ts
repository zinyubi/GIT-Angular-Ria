/**
 * Determines where data is draped on.
 *
 * @see {@link ShapeStyle.drapeTarget}
 * @see {@link GenericIconStyle.drapeTarget}
 * @see {@link RasterStyle.drapeTarget}
 * @see {@link TileSet3DLayer.isDrapeTarget}
 *
 * @since 2022.1
 */
export declare enum DrapeTarget {
  /**
   * Not draped on either terrain or mesh.
   */
  NOT_DRAPED = 0,
  /**
   * Draped on terrain only, not on 3D tile meshes.
   */
  TERRAIN = 1,
  /**
   * Draped only on 3D tile meshes that are {@link TileSet3DLayer.isDrapeTarget drape targets}, not on terrain.
   */
  MESH = 2,
  /**
   * Draped on both 3D tiles meshes that are {@link TileSet3DLayer.isDrapeTarget drape targets} and on terrain.
   */
  ALL = 3,
}