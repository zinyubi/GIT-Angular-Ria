import { Feature } from "../../../model/feature/Feature.js";
import { Shape } from "../../../shape/Shape.js";
/**
 * ClusterShapeProvider interface. Defines the shape which will be used to represent the cluster on the map.
 */
export declare abstract class ClusterShapeProvider {
  /**
   * Returns the point in model coordinates for the cluster that will be composed of the given set of elements.
   *
   * @param composingElements The composing model elements for the cluster for which a
   * location needs to be provided.
   * @return The cluster point in model coordinates
   */
  abstract getShape(composingElements: Feature[]): Shape;
}