import { KMLContainer } from "./KMLContainer.js";
/**
 * In the KML Specification, a Folder is an entity that contains other KML Features.
 *
 * @since 2020.1
 */
export declare class KMLFolderContainer extends KMLContainer {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  copy(): KMLFolderContainer;
}