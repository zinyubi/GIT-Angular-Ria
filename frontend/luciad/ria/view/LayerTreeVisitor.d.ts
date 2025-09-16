import { Layer } from "./Layer.js";
import { LayerGroup } from "./LayerGroup.js";
/**
 * Visits a LayerTree
 */
interface LayerTreeVisitor {
  /**
   * Visits a {@link Layer} instance.
   * @param layer
   */
  visitLayer(layer: Layer): LayerTreeVisitor.ReturnValue;
  /**
   * Visits a {@link LayerGroup} instance.
   * @param layerGroup
   */
  visitLayerGroup(layerGroup: LayerGroup): LayerTreeVisitor.ReturnValue;
}
declare namespace LayerTreeVisitor {
  /**
   * An enumeration containing return values for LayerTreeVisitor methods
   */
  enum ReturnValue {
    /**
     * Return value for visit methods that indicate layer traversal should be aborted.
     */
    ABORT = 1,
    /**
     * Return value for visit methods that indicate layer traversal should continue.
     */
    CONTINUE = 2,
  }
}
export { LayerTreeVisitor };