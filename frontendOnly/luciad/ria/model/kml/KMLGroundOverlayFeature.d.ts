import { KMLAltitudeMode } from "../../util/kml/KMLAltitudeMode.js";
import { KMLFeature } from "./KMLFeature.js";
import { KMLOverlayFeatureProperties } from "./KMLOverlayFeature.js";
import { Bounds } from "../../shape/Bounds.js";
/**
 * In the KML Specification, a Ground Overlay is an entity that contains raster data in the form of an image reference and bounding area.
 *
 * When a KML file is loaded which contains a ground overlay element, a "KMLGroundOverlay" event will be emitted
 * on {@link KMLCodec}. To add a layer for a ground overlay element to the map, you need to
 * register a callback on {@link KMLCodec} for this event. In this callback you can create a layer
 * for the ground overlay by using {@link createGroundOverlayLayer}.
 *
 * Create a RasterTileSetLayer from a KMLGroundOverlayFeature
 * ```javascript
 * [[include:view/kml/KMLGroundOverlayFeatureSnippets.ts_CREATE_LAYER]]
 * ```
 *
 * @since 2020.1
 */
export declare class KMLGroundOverlayFeature extends KMLFeature<KMLGroundOverlayFeatureProperties> {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  copy(): KMLGroundOverlayFeature;
}
/**
 * Provides type-hinting to consumers of the KML Feature.
 * @since 2020.1
 */
export interface KMLGroundOverlayFeatureProperties extends KMLOverlayFeatureProperties {
  /**
   * Specifies how the {@link KMLAltitudeMode.CLAMP_TO_GROUND} (default)
   * or {@link KMLAltitudeMode.ABSOLUTE}.
   * @since 2021.0
   */
  altitudeMode: KMLAltitudeMode;
  /**
   * Specifies the distance above the earth's surface, in meters, and is interpreted according to the altitude mode.
   * @since 2021.0
   */
  altitude: number;
  /**
   * Specifies a rotation of the overlay about its center, in degrees.
   * Values can be ±180. The default is 0 (north). Rotations are specified in a counterclockwise direction.
   * @since 2021.0
   */
  rotation: number;
  /**
   * The bounds of the GroundOverlay's LatLonBox, without rotation.
   * @since 2021.0
   */
  bounds: Bounds;
}