/**
 * An enumeration to describe the data type of a raster.
 * @since 2017.0
 */
export declare enum RasterDataType {
  /**
   * Indicates that a raster should be interpreted as image data. Please consult the developer guide on what
   * formats are valid when working with image data.
   */
  IMAGE = "tileset/image",
  /**
   * Indicates that a raster should be interpreted as elevation data. Please consult the developer guide on
   * what formats are valid when working with elevation data.
   */
  ELEVATION = "tileset/elevation",
}