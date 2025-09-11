import { KMLXYVector } from "../../util/kml/KMLXYVector.js";
import { KMLFeature } from "./KMLFeature.js";
import { KMLOverlayFeatureProperties } from "./KMLOverlayFeature.js";
/**
 * In the KML Specification, a Screen Overlay is an entity that contains an image reference and rendering details to
 * attach it to the view (or screen) rather than the map.
 * @since 2021.0
 */
export declare class KMLScreenOverlayFeature extends KMLFeature<KMLScreenOverlayFeatureProperties> {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  copy(): KMLScreenOverlayFeature;
}
/**
 * Provides type-hinting to consumers of the KML Feature.
 * @since 2021.0
 */
export interface KMLScreenOverlayFeatureProperties extends KMLOverlayFeatureProperties {
  /**
   * Specifies a point on (or outside of) the overlay image that is mapped to the screen coordinate (<screenXY>).
   */
  overlayXY: KMLXYVector;
  /**
   * Specifies a point relative to the screen origin that the overlay image is mapped to.
   */
  screenXY: KMLXYVector;
  /**
   * Specifies a point relative to the screen about which the screen overlay is rotated.
   */
  rotationXY: KMLXYVector;
  /**
   * Specifies the size of the image for the screen overlay per the KML spec.
   */
  size: KMLXYVector;
  /**
   * Specifies an angle in degrees counterclockwise from north for the rotation of the overlay.
   */
  rotation: number;
}