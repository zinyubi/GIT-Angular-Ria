import { KMLFeature } from "./KMLFeature.js";
/**
 * In the KML Specification, a Placemark is an entity that contains some geometric entity and pertinent metadata.
 * @since 2020.1
 */
export declare class KMLPlacemarkFeature extends KMLFeature {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  copy(): KMLPlacemarkFeature;
}