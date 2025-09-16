import { LayerGroup } from "./LayerGroup.js";
import { LayerTreeNode } from "./LayerTreeNode.js";
import { Handle } from "../util/Evented.js";
/**
 * Describes a change (add, remove, move) in the layer tree.
 * @since 2023.1
 */
export interface LayerTreeNodeChangeEvent {
  /**
   * The {@link LayerTreeNode} that was changed.
   */
  node: LayerTreeNode;
  /**
   * The new index of the added or moved node, or the index of the node that was removed.
   */
  index: number;
  /**
   * The path to the node that was changed.
   * The path contains each layer tree node from the root up to the parent of the node.
   */
  path: LayerTreeNode[];
}
/**
 * Describes a move of a node in a layer tree.
 * @since 2023.1
 */
export interface LayerTreeMovedEvent extends LayerTreeNodeChangeEvent {
  /**
   * The original index of the node, before the move.
   */
  originalIndex: number;
  /**
   * The original path of the node, before the move.
   */
  originalPath: LayerTreeNode[];
}
/**
 * A layer tree. that acts as the root of all layers in a Map.
 * <p/>
 * The {@link Map.layerTree 'layerTree'} property of Map is an instance of this
 * type. It is not possible to create your own LayerTree.
 */
declare class LayerTree extends LayerGroup {
  /**
   * This class should not be instantiated by users of LuciadRIA.
   */
  private constructor();
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
  /**
   * Event that indicates that a node was added to the tree.
   * @param event the 'NodeAdded' event
   * @param callback the callback to be invoked when a node is added to the tree.
   * @param context value to use as this when executing callback
   * @event
   **/
  on(event: "NodeAdded", callback: (layerTreeNodeChange: LayerTreeNodeChangeEvent) => void, context?: any): Handle;
  /**
   * Event that indicates that a node was added to the tree.
   * @param event the 'NodeRemoved' event
   * @param callback the callback to be invoked when a node is removed from the tree.
   *  @param context value to use as this when executing callback
   *  @event
   **/
  on(event: "NodeRemoved", callback: (layerTreeNodeChange: LayerTreeNodeChangeEvent) => void, context?: any): Handle;
  /**
   * Event that indicates that a node was moved in the tree.
   * @param event the 'NodeMoved' event
   * @param callback the callback to be invoked when a node is moved in the tree.
   * @param context value to use as this when executing callback
   * @event
   **/
  on(event: "NodeMoved", callback: (layerTreeNodeChange: LayerTreeMovedEvent) => void, context?: any): Handle;
}
export { LayerTree };