import { KMLFeature, KMLFeatureProperties } from "./KMLFeature.js";
/**
 * KML Containers are abstract elements that are not directly created, but are used as the base for
 * KML Folders and KML Documents.
 * 
 * @since 2020.1
 */
export declare abstract class KMLContainer<TProperties extends KMLFeatureProperties = KMLFeatureProperties> extends KMLFeature<TProperties> {
  /**
   * This abstract class should not be extended by users of LuciadRIA.
   */
  constructor();
  get shape(): null;
  /**
   * Returns an array of the features contained within this container.
   */
  get children(): KMLFeature[];
  abstract copy(): KMLContainer<TProperties>;
}