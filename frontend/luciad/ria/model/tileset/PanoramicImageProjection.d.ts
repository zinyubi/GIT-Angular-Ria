/**
 * Describes a pinhole projection, also known as a "rectilinear", "gnomic", "gnomonic" or "tangent-plane" projection.
 * See {@link https://wiki.panotools.org/Rectilinear_Projection}
 * @since 2020.1
 */
import { PanoramicImageProjectionType } from "./PanoramicImageProjectionType.js";
/**
 * @since 2020.1
 */
export interface PinholePanoramicImageProjection {
  /**
   * The type of the projection: {@link PanoramicImageProjectionType.PINHOLE}
   */
  type: PanoramicImageProjectionType.PINHOLE;
  /**
   * The horizontal field-of-view of the pinhole projection, in degrees. Defaults to 90.
   * You can derive a horizontal FOV from a vertical FOV, using the aspect ratio of the image (width/height) as follows:
   * <pre>
   *   const horizontalFOV = 2 * Math.atan(Math.tan( verticalFOV / 2) * (width / height))
   * </pre>
   * See {@link https://en.wikipedia.org/wiki/Field_of_view_in_video_games} for more details.
   */
  horizontalFOV?: number;
}
/**
 * An equirectangular projection. Also known as a "plate-carree" projection.
 * See {@link https://wiki.panotools.org/Equirectangular_Projection}.
 * @since 2020.1
 */
export interface EquirectangularPanoramicImageProjection {
  /**
   * The type of the projection: {@link PanoramicImageProjectionType.EQUIRECTANGULAR}
   */
  type: PanoramicImageProjectionType.EQUIRECTANGULAR;
}
/**
 * Models a panoramic image projection, which is a projection type together with parameters for that projection.
 * @since 2020.1
 */
export type PanoramicImageProjection = PinholePanoramicImageProjection | EquirectangularPanoramicImageProjection;