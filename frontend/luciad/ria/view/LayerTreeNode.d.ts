import { LayerType } from "./LayerType.js";
import { PaintRepresentation } from "./PaintRepresentation.js";
import { LayerTreeNodeType } from "./LayerTreeNodeType.js";
import { LayerTreeVisitor } from "./LayerTreeVisitor.js";
import { LayerGroup } from "./LayerGroup.js";
import { Map } from "./Map.js";
import { Layer } from "./Layer.js";
import { Evented, Handle } from "../util/Evented.js";
/**
 * Layer parameters to construct a new layer.
 */
export interface LayerConstructorOptions {
  /**The layer's ID. this should be unique within the map.  If this parameter is omitted,
   * an ID will be generated automatically.
   **/
  id?: string;
  /**
   * The layer's label.  This should be human readable as it is typically used in
   * layer controls. If this parameter is omitted the layer's label will correspond
   * with the layer ID.
   */
  label?: string;
  /**
   * Configures the layer's {@link LayerType}. Value
   * must be one of <code>luciad.view.LayerType.BASE</code>,
   * <code>luciad.view.LayerType.STATIC</code> or
   * <code>luciad.view.LayerType.DYNAMIC</code>. This determines
   * the way the map will render the layer and can influence
   * rendering performance.  The default is <code>STATIC</code>.
   */
  layerType?: LayerType;
  /**
   * Configure the layer visibility. This can be changed afterwards with
   * <code>RasterTileSetLayer#visible</code>.
   */
  visible?: boolean;
  /**
   * The minimum scale at which this layer should render. If the map is being shown
   * at a lower scale, this layer will not be rendered.  This parameter can be
   * omitted if no minimum scale is desired.
   */
  minScale?: number;
  /**
   * The maximum scale at which this layer should render. If the map is being shown
   * at a higher scale, the layer will not be rendered. This parameter can be
   * omitted if no maximum scale is desired.
   */
  maxScale?: number;
}
/**
 * A node in a {@link LayerGroup}. Can not be instantiated directly, use
 * a more specific type of node instead.
 */
declare abstract class LayerTreeNode implements Evented {
  /**
   * The <code>LayerTreeNodeType</code> of this node.
   */
  abstract get treeNodeType(): LayerTreeNodeType;
  /**
   * Wait until this layer or layer group is finished with all possible work related to any change that happened before this call.
   * <br/>
   * At that moment, the screen is up-to-date with all changes.
   * <p/>
   * <i>Examples:</i>
   *
   *   ```javascript
   *     map.mapNavigator.fit({ bounds: somewhere });
   *     map.layerTree.whenReady().then(makeScreenshot);
   *   ```
   *
   * or
   *
   * ```javascript
   *     layer.painter.invalidateAll();
   *     layer.whenReady().then(alert);
   *   ```
   *
   * or
   *
   * ```javascript
   *     layer.model.add(newFeature);
   *     layer.whenReady().then(alert);
   *   ```
   *
   * <p/>
   *   This call can be used to have a reliable, programmatic way to wait for all work leading up to the call to be reflected on the screen.
   *   <br/>
   *   The returned promise will always resolve once, when the layer is ready.
   *   The promise is rejected when the layer does not become ready in 5 minutes.
   * <p/>
   *   Examples (not exhaustive) of aspects this promise will wait for:
   *   <ul>
   *     <li>While loading image data when it displayed for the first time, or after navigating the view</li>
   *     <li>While loading image data after changing raster model properties such as WMS style</li>
   *     <li>While loading feature data when it displayed for the first time, enters its scale range, or after navigating the view</li>
   *     <li>While loading feature data after invalidating the layer query provider</li>
   *     <li>While processing features after invalidating the layer feature painter or shape provider, or changing the layer filter</li>
   *     <li>While processing features after they were added, updated or removed to/in/from a model or workingSet</li>
   *   </ul>
   * <p/>
   *   NOTE: The promise gets resolved also when an error ({@link QueryStatus.QUERY_ERROR}) occurs while handling underlying query or when the node is invisible.
   * <p/>
   * A {@link LayerTree} will wait until all its children are ready.
   *
   * @return A promise that resolves to the LayerTreeNode when all current work is done
   */
  whenReady(): Promise<LayerTreeNode>;
  /**
   * Indicates whether the specified paint representation is supported for this layer.  Not
   * every LayerTreeNode may support all paint representations.  E.g. raster layers may not b
   * have a {@link PaintRepresentation.LABEL} paint representation.
   *
   * @param paintRepresentation the paint representation
   * @return <code>true</code> when <code>paintRepresentation</code> is supported,
   * <code>false</code> otherwise.
   */
  isPaintRepresentationSupported(paintRepresentation: PaintRepresentation): boolean;
  /**
   * Indicates whether the specified paint representation is visible.
   *
   * @param paintRepresentation The paint representation
   * @return <code>true</code> when <code>paintRepresentation</code> is supported
   * and visible, <code>false</code> otherwise
   * @see {@link setPaintRepresentationVisible}
   */
  isPaintRepresentationVisible(paintRepresentation: PaintRepresentation): boolean;
  /**
   * <p>Sets the visibility of a specific paint representation. This allows for example to
   * only show the {@link PaintRepresentation.BODY} of a layer and not the
   * {@link PaintRepresentation.LABEL}:</p>
   *
   * ```javascript
   *   var layer = ...;
   *   layer.setPaintRepresentationVisible( PaintRepresentation.BODY, true );
   *   layer.setPaintRepresentationVisible( PaintRepresentation.LABEL, false );
   * ```
   *
   * @param paintRepresentation The renderer-type of the layer.
   * Must be one of the {@link isPaintRepresentationSupported supported paint
   * representations}.
   * @param visible the new visible state of the paint representation
   */
  setPaintRepresentationVisible(paintRepresentation: PaintRepresentation, visible: boolean): void;
  /**
   * Accepts the given visitor on </code>this</code> {@link LayerTreeNode}.
   * @param visitor The visitor instance that must be used to process this
   * @return either {@link LayerTreeVisitor.ReturnValue.CONTINUE} or {@link LayerTreeVisitor.ReturnValue.ABORT}
   */
  accept(visitor: LayerTreeVisitor): LayerTreeVisitor.ReturnValue;
  /**
   * Indicates whether the specified paint representation is visible on the map. This method will only
   * return true if this paint representation is visible for this layer and every parent layer up to
   * the layer tree.
   *
   * @param paintRepresentation The paint representation
   * @return <code>true</code> when <code>paintRepresentation</code> is supported
   * and visible, <code>false</code> otherwise
   * @see {@link setPaintRepresentationVisibleInTree}
   */
  isPaintRepresentationVisibleInTree(paintRepresentation: PaintRepresentation): boolean;
  /**
   * <p>Sets the visibility of a specific paint representation in a layer tree. If it set to true,
   * this will ensure that the paint representation of every parent LayerTreeNode up to the roof of the
   * tree is configured to be visible as well.
   *
   * @param paintRepresentation The renderer-type of the layer.
   * Must be one of the {@link isPaintRepresentationSupported supported paint
   * representations}.
   * @param visible the new visible state of the paint representation
   */
  setPaintRepresentationVisibleInTree(paintRepresentation: PaintRepresentation, visible: boolean): void;
  /**
   * Accepts the given visitor on the children of <code>this</code>.
   * @param visitor The visitor which will receive the callbacks for the children.
   * @param order The order in which the children need to be traversed.
   */
  visitChildren(visitor: LayerTreeVisitor, order: LayerTreeNode.VisitOrder): void;
  /**
   * Returns the layer tree node with the given ID if that layer is this node or one of its children.
   * This may be a layer-group or a layer.
   * @param id The id of the layerTreeNode that you want to retrieve.
   * @return the requested layerTreeNode or undefined if it is not present in the tree
   *
   * @since 2014.0
   */
  findLayerTreeNodeById(id: string): LayerTreeNode;
  /**
   * Returns the layer group with the given ID if that layer is this node or one of its children.
   * @param id The id of the layer group that you want to retrieve.
   * @return the requested layer group or undefined if it is not present in the tree
   *
   * @since 2014.0
   */
  findLayerGroupById(id: string): LayerGroup;
  /**
   * Returns the layer with the given ID if that layer is this node or one of its children.
   * Note that the layer's ID does not correspond with the layer's label.
   * @param id The id of the layer that you want to retrieve.
   * @return the requested layer or undefined if it is not present in the tree
   */
  findLayerById(id: string): Layer;
  /**
   * The node's ID (immutable). This ID was configured at construction time and is unique over the whole layer tree.
   * If no ID was given, a UUID will have been generated automatically.
   */
  get id(): string;
  /**
   * The node's label.  This label was configured at construction time.
   * If no label was given, the label will correspond to the layer's ID.
   */
  get label(): string;
  set label(value: string);
  /**
   * <p>
   * Denotes whether the node is visible.  This can be considered
   * to be the master visibility switch:  Setting this to false makes the layer entirely invisible.
   * If it is true, the visible paint representations will be visible.
   * </p>
   * <p>
   * This property does not reflect whether this node's parent is visible as well, If this is
   * desired, use {@link visibleInTree} instead.
   * </p>
   */
  get visible(): boolean;
  set visible(visible: boolean);
  /**
   * <p>
   * Denotes whether this layer is visible on the map. This method will only return true if this layer and
   * every parent layer up to the root of the layer tree is visible.
   * </p>
   * <p>
   * If visibleInTree is set to true, this will ensure that every parent LayerTreeNode up to the
   * of the tree is configured to be visible as well.
   * </p>
   */
  get visibleInTree(): boolean;
  set visibleInTree(value: boolean);
  /**
   * The parent of this node or <code>null</code>. This property
   * will be <code>null</code> if this node has not been added as the child of another
   * node yet.
   */
  get parent(): LayerGroup | null;
  /**
   * The map this note is attached to, or <code>null</code>. This property
   * will be <code>null</code> if this node is not attached to a map.
   */
  get map(): Map | null;
  /**
   * The list of direct children of the node. The children are ordered according to
   * the painting order (the bottom layer is the first element in the array). Note that
   * also the nodes that are not visible will be included.
   */
  get children(): LayerTreeNode[];
  /**
   * Denotes what {@link PaintRepresentation PaintRepresentations} are available
   * for this layer.  This usually depends on the type of layer or the painter configuration
   * on the layer
   */
  get supportedPaintRepresentations(): PaintRepresentation[];
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
  /**
   * Fired when the visibility of a certain paint representation of the layer changes.
   * See {@link setPaintRepresentationVisible}.
   * @param event the "PaintRepresentationVisibilityChanged" event.
   * @param callBack the callback to be invoked when the visibility of a certain paint representation of the layer changes.
   * The callback gets two parameters, 'visibility' indicates whether or not the 'paintRepresentation' is visible.
   * @param context value to use as this when executing callback.
   * @event
   */
  on(event: "PaintRepresentationVisibilityChanged", callBack: (visibility: boolean, paintRepresentation: PaintRepresentation) => void, context?: any): Handle;
  /**
   * Fired when the visibility property of the layer changes.
   * See {@link visible}.
   * @param event the "VisibilityChanged" event
   * @param callBack the callback to be invoked when the visibility property of the layer changes.
   * The callback gets one parameter, 'visibility' which is the new visible property of the layer.
   * @param context value to use as this when executing callback.
   * @event
   */
  on(event: "VisibilityChanged", callBack: (visibility: boolean) => void, context?: any): Handle;
  /**
   * Fired when the visibility of the layer on the map changes.
   * See {@link visibleInTree}.
   * @param event the "VisibilityInTreeChanged" event
   * @param callBack the callback to be invoked when the visibility of the layer changes on the map.
   * The callback gets one parameter, 'visibleInTree' which indicates whether the layer is visible on the map or not.
   * @event
   * @since 2023.1
   */
  on(event: "VisibilityInTreeChanged", callBack: (visibleInTree: boolean) => void): Handle;
  /**
   * Fired when the label of the layer or layer group changes.
   * See {@link label}.
   * @param event the "LabelChanged" event
   * @param callBack the callback to be invoked when the label of the layer or layer group changes.
   * The callback gets one parameter. 'label' which is the new label of the layer.
   * @param context value to use as this when executing callback.
   * @event
   */
  on(event: "LabelChanged", callBack: (label: string) => void, context?: any): Handle;
}
declare namespace LayerTreeNode {
  /**
   * Enumeration for the different pattern types. Patterns can be combined, for example by
   * specifying both horizontal and vertical.
   */
  enum VisitOrder {
    /**
     * Visit the children starting from bottom to the top child.
     */
    BOTTOM_UP = 1,
    /**
     * Visit the children starting from top to the bottom child.
     */
    TOP_DOWN = 2,
  }
}
export { LayerTreeNode };