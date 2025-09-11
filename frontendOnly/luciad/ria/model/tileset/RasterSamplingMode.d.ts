/**
 * An enumeration to describe the sampling mode of a raster.
 * @since 2017.0
 */
export declare enum RasterSamplingMode {
  /**
   * Area-based sampling implies that the value of the pixel is valid for the entire area of the pixel.
   * Typically this type of sampling is used for satellite imagery, where a pixel typically contains an averaged
   * color value for the entire region of the pixel.
   */
  AREA = "AREA",
  /**
   * Point-based sampling implies that each pixel value of the raster has valid data at its center position.
   * Typically this type of sampling is used for elevation data, where exact measurements are made for a grid of points, but not the values in between
   * the pixels.
   */
  POINT = "POINT",
}