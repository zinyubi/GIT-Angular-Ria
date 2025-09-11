import { LayerConstructorOptions, LayerTreeNode } from "./LayerTreeNode.js";
import { LayerTreeNodeType } from "./LayerTreeNodeType.js";
import { LayerTreeVisitor } from "./LayerTreeVisitor.js";
import { PaintRepresentation } from "./PaintRepresentation.js";
/**
 * A layer tree node that groups a number of child <code>LayerTreeNode</code>
 */
declare class LayerGroup extends LayerTreeNode {
  /**
   * Constructs an empty <code>LayerGroup</code>
   * @param options Constructor arguments
   */
  constructor(options?: LayerConstructorOptions);
  /**
   * Removes all children from the layer group.
   */
  removeAllChildren(): void;
  /**
   * Add a node to the <code>LayerGroup</code>
   * @param layerTreeNode The LayerTreeNode to be added
   * @param [position] The position where the layer will be added.  Possible
   *                            options are: "top", "bottom" "above", "below".  With the last
   *                            two options, the <code>positionReference</code> parameter is
   *                            mandatory.  If no position parameter is present, "top" is assumed.
   * @param [positionReference] The reference layer in case "above"
   *                                                        or "below" is passed to addLayer.
   * @param [noEvent] Do not fire an event when a layer is added.
   */
  addChild(layerTreeNode: LayerTreeNode, position?: "top" | "bottom" | "above" | "below", positionReference?: LayerTreeNode, noEvent?: boolean): void;
  /**
   * Removes a child from this node.
   * @param layerTreeNode The node to be removed.
   * @param [noEvent] do not fire an event when the layer is removed.
   */
  removeChild(layerTreeNode: LayerTreeNode, noEvent?: boolean): void;
  /**
   * Move a node that belongs to the same map to another location in its layer tree.
   *
   * @param layerTreeNode The layer to be moved
   * @param [position] The position where the layer must be moved to.
   * Possible options are: "top", "bottom", "above", "below".
   * With the last two options, the <code>positionReference</code> parameter is mandatory.
   * If no position parameter is present, "top" is assumed.
   *
   * @param [positionReference] The reference layer tree node in case "above" or "below" is passed to
   * <code>moveChild</code>.
   * If the reference node is not a child of this layer group, the given layerTreeNode will be moved to the parent
   * group of the reference node.
   *
   * @param [noEvent] Do not fire an event when a layer is moved.
   */
  moveChild(layerTreeNode: LayerTreeNode, position?: "top" | "bottom" | "above" | "below", positionReference?: LayerTreeNode, noEvent?: boolean): void;
  accept(visitor: LayerTreeVisitor): LayerTreeVisitor.ReturnValue;
  /**
   *
   * Verifies whether the node can be moved to the specified position. This check does not modify
   * the LayerGroup. This check takes into account the ordering rules for layers that are applicable
   * to the entire <code>LayerTree</code>. Layers of type
   * <code>LayerType.BASE</code>
   * must always be positioned at the bottom of the <code>LayerTree</code>.
   *
   * @param layerTreeNode The LayerTreeNode to be added
   * @param [position] The position where the layer could be moved.  Possible
   *                            options are: "top", "bottom" "above", "below".  With the last
   *                            two options, the <code>positionReference</code> parameter is
   *                            mandatory.  If no position parameter is present, "top" is assumed.
   * @param [positionReference] The reference layer in case "above"
   *                                                        or "below" is passed to addLayer.
   *
   * @return whether the node can be moved
   */
  canMoveChild(layerTreeNode: LayerTreeNode, position?: "top" | "bottom" | "above" | "below", positionReference?: LayerTreeNode): boolean;
  /**
   *
   * Verifies whether the node can be added at the specified position. This check does not modify
   * the LayerGroup. This check takes into account the ID uniqueness and the ordering rules for layers that are
   * applicable to the entire <code>LayerTree</code>. Layers of type <code>LayerType.BASE</code>
   * must always be positioned at the bottom of the <code>LayerTree</code>.
   *
   * @param layerTreeNode The LayerTreeNode to be added
   * @param [position] The position where the layer could be added.  Possible
   *                            options are: "top", "bottom" "above", "below".  With the last
   *                            two options, the <code>positionReference</code> parameter is
   *                            mandatory.  If no position parameter is present, "top" is assumed.
   * @param [positionReference] The reference layer in case "above"
   *                                                        or "below" is passed to addLayer.
   *
   * @return whether the node can be added.
   */
  canAddChild(layerTreeNode: LayerTreeNode, position?: "top" | "bottom" | "above" | "below", positionReference?: LayerTreeNode): boolean;
  /**
   * Indicates whether the specified paint representation is supported for this layer.
   * It returns always true since a LayerGroup is a collection of LayerTreeNodes. In other words, a group can support
   * all the possible paint representations of its children.
   * @param paintRepresentation the paint representation
   * @return <code>true</code> in any case
   */
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  visitChildren(visitor: LayerTreeVisitor, order: LayerTreeNode.VisitOrder): void;
  get children(): LayerTreeNode[];
  set children(dummy: LayerTreeNode[]);
  /**
   * The <code>LayerTreeNodeType</code> of this layer. The value is <code>LAYER_GROUP</code>.
   */
  get treeNodeType(): LayerTreeNodeType;
  set treeNodeType(dummy: LayerTreeNodeType);
}
export { LayerGroup };