/**
 * An enumeration to describe mip map filtering used in {@link MeshStyle}
 *
 * Mipmap filtering is a technique used to reduce the visual artifacts that occurs when a
 * high resolution texture is applied to a small surface. The system uses lower resolution
 * textures (mipmaps) to better approximate the texture colors.
 *
 * @since 2024.0.03
 */
export declare enum MipmapFilteringType {
  /**
   * Indicates that no mipmap filtering is applied.
   */
  NO_MIPMAP_FILTERING = 0,
  /**
   * Indicates that the simplest filtering mode will be used. Only the nearest fitted mipmap will
   * be taken in consideration.
   */
  NEAREST_MIPMAPPING = 1,
  /**
   * Indicates that a more advanced filtering mode will be used. It will interpolate between multiple level
   * of mipmaps to get the best result.
   */
  LINEAR_MIPMAPPING = 2,
  /**
   * Indicates that there are no override of the filtering mode. It should use the mode specified in the data.
   * If the data does not define any mode then no mipmap filtering is applied.
   */
  BASED_ON_DATA = 3,
}