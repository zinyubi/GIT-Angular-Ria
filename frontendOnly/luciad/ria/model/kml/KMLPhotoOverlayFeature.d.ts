import { KMLFeature } from "./KMLFeature.js";
/**
 * In the KML Specification, a Photo Overlay is an entity that contains an image reference and rendering details to
 * position it so that a photograph can be aligned to the 3D globe when the camera is positioned in the same geospatial
 * location as the photographer.
 *
 * Photo Overlays are not yet implemented in LuciadRIA but this type of feature will still appear in the KMLTree event with an error property.
 * @since 2021.0
 */
export declare class KMLPhotoOverlayFeature extends KMLFeature {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  copy(): KMLPhotoOverlayFeature;
}