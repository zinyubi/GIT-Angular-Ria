import { LayerConstructorOptions, LayerTreeNode } from "./LayerTreeNode.js";
import { LayerTreeNodeType } from "./LayerTreeNodeType.js";
import { LayerType } from "./LayerType.js";
import { Model } from "../model/Model.js";
import { Map } from "./Map.js";
import { Bounds } from "../shape/Bounds.js";
import { LayerTreeVisitor } from "./LayerTreeVisitor.js";
import { ContextMenu } from "./ContextMenu.js";
import { Handle } from "../util/Evented.js";
import { Feature } from "../model/feature/Feature.js";
import { Shape } from "../shape/Shape.js";
import { Interval } from "../util/Interval.js";
/**
 * The abstract superclass for layers added to
 * the {@link Map}.  It must not be instantiated explicitly.  Use
 * {@link RasterTileSetLayer} instead.
 */
export declare class Layer extends LayerTreeNode {
  /**
   * Creates a new layer with the given options.
   * @param model the model containing the data to be displayed in this layer
   * @param options an object hash containing layer parameters.
   */
  constructor(model: Model | null, options?: LayerConstructorOptions);
  /**
   * Returns the area of the map that is currently visible, expressed in model coordinates.
   * @return the visible bounds in model coordinates or null if nothing is visible
   * @deprecated Please use {@link Map.mapBounds mapBounds} instead.
   */
  getModelBoundsVisibleOnMap(): Bounds | null;
  /**
   */
  accept(visitor: LayerTreeVisitor): LayerTreeVisitor.ReturnValue;
  /**
   * Called when the map is going to display a context menu for an object that is contained by this layer. This
   * method can be overridden to populate the given context menu with additional items.
   * @param contextMenu The context menu to populate
   * @param map The map that is about to show a context menu
   * @param contextMenuInfo The object that was passed to the map when requesting the context menu.
   * The context menu info object. This object may contain arbitrary data.
   * The default implementation expects a pickInfo object which will be passed to the appropriate Layer's onCreateContextMenu method.
   * A pickInfo object is JavaScript object with two properties:
   * the objects that were touched (an array of Features) and the layer that object resides in.
   */
  onCreateContextMenu(contextMenu: ContextMenu, map: Map, contextMenuInfo: any): void;
  /**
   * Called when the map has detected a single click on an object that is contained by this layer. This method
   * can be overridden to take action when the click is detected. The default implementation of this method
   * simply returns <code>false</code>.
   * @param object the object that was clicked on
   * @return true to indicate that the click was handled and default behavior should not occur; false otherwise
   */
  onClick(object: Feature): boolean;
  /**
   * The scale range of this layer.
   */
  get scaleRange(): Interval;
  /**
   * The model of this layer, immutable.
   */
  get model(): Model | null;
  /**
   * Denotes whether the layer can be edited
   */
  get editable(): boolean;
  set editable(editable: boolean);
  /**
   * The content provider that may be used when {@link Map.showBalloon showBalloon}
   * is called on the map.  The content provider is a function that takes a single parameter and returns the contents
   * for the balloon. The parameter is the object for which the balloon is shown, which is typically a {@link Feature}.
   * The return value of the function can be a string or a DOM-node.
   *
   * See {@link Map.showBalloon showBalloon} for information on how to style the balloon.
   */
  get balloonContentProvider(): (obj: Feature | Shape) => string | HTMLElement;
  set balloonContentProvider(balloonContentProvider: (obj: Feature | Shape) => string | HTMLElement);
  /**
   * The {@link LayerType} of this layer.  The layer type is
   * used by the Map to optimize rendering. It is an optional parameter of the layer constructor.
   */
  get type(): LayerType;
  /**
   * The {@link LayerTreeNodeType.LAYER}.
   */
  get treeNodeType(): LayerTreeNodeType;
  on(event: string, callback: (...args: any[]) => void, context?: any): Handle;
  /**
   * Event fired when the editability of the layer changes.
   * @param event the 'EditableChanged' changed event.
   * @param callback the callback to be invoked when the editability of the layer changes. The callback gets the 'editable'
   * boolean parameter, which indicates whether or not the layer is editable.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "EditableChanged", callback: (editable: boolean) => void, context?: any): Handle;
}