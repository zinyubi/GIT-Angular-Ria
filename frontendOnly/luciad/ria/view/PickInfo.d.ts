import { Feature } from "../model/feature/Feature.js";
import { FeatureLayer } from "./feature/FeatureLayer.js";
import { TileSet3DLayer } from "./tileset/TileSet3DLayer.js";
/**
 * This JavaScript literal describes the data structure that represents an array of objects and the layer that objects resides in.
 * This structure is used by various API functions, eg.:
 * <ul>
 *   <li> {@link Map.pickAt Map.pickAt}
 *   <li> {@link Map.pickAtRectangle Map.pickAtRectangle}
 *   <li> {@link Map.pickClosestObject Map.pickClosestObject}
 *   <li> {@link Map.pickClosestObjectRectangle Map.pickClosestObjectRectangle}
 *   <li> {@link Map.selectObjects Map.selectObjects}
 *   <li> {@link Map.onCreateContextMenu Map.onCreateContextMenu}
 * <ul>
 */
export interface PickInfo {
  /**
   * The array of {@link Feature} instances.
   */
  objects: Feature[];
  /**
   * The layer the objects are associated with.
   */
  layer: FeatureLayer | TileSet3DLayer;
}