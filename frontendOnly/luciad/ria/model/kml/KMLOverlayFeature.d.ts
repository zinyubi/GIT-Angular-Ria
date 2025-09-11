import { KMLLink } from "./KMLLink.js";
import { KMLFeatureProperties } from "./KMLFeature.js";
/**
 * Provides type-hinting to consumers of the KML Feature.
 * @since 2021.0
 */
export interface KMLOverlayFeatureProperties extends KMLFeatureProperties {
  /**
   * Specifies the location of the resource fetched by this overlay.
   * @since 2021.0
   */
  icon: KMLLink;
  /**
   * Specifies the color of this overlay
   * @since 2021.0
   */
  color: string | null;
  /**
   * Specifies the stacking order for the images in overlapping overlays
   * @since 2021.0
   */
  drawOrder: number | null;
}