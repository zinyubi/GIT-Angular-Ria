/**
 * Enumerates different projection types for panoramic images
 * @since 2020.1
 */
export declare enum PanoramicImageProjectionType {
  /**
   * A pinhole projection. Also known as a "rectilinear", "gnomic", "gnomonic" or "tangent-plane" projection.
   * See {@link https://wiki.panotools.org/Rectilinear_Projection}
   */
  PINHOLE = 0,
  /**
   * An equirectangular projection. Also known as a "plate-carree" projection.
   * See {@link https://wiki.panotools.org/Equirectangular_Projection}.
   */
  EQUIRECTANGULAR = 1,
}