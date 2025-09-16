import { KMLContainer } from "./KMLContainer.js";
/**
 * In the KML Specification, a Document is an entity that contains other KML Features.
 *
 * @since 2020.1
 */
export declare class KMLDocumentContainer extends KMLContainer {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  copy(): KMLDocumentContainer;
}