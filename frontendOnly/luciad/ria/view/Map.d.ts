import { Feature } from "../model/feature/Feature.js";
import { WithIdentifier } from "../model/WithIdentifier.js";
import { CoordinateReference } from "../reference/CoordinateReference.js";
import { Bounds } from "../shape/Bounds.js";
import { Point } from "../shape/Point.js";
import { Shape } from "../shape/Shape.js";
import { EllipsoidTransformationOptions, LocationMode } from "../transformation/LocationMode.js";
import { Transformation } from "../transformation/Transformation.js";
import { Evented, Handle } from "../util/Evented.js";
import { AxisConfiguration } from "./axis/AxisConfiguration.js";
import { OrthographicCamera } from "./camera/OrthographicCamera.js";
import { PerspectiveCamera } from "./camera/PerspectiveCamera.js";
import { ContextMenu } from "./ContextMenu.js";
import { Controller } from "./controller/Controller.js";
import { CursorManager } from "./CursorManager.js";
import { FeatureLayer } from "./feature/FeatureLayer.js";
import { GraphicsEffects } from "./GraphicsEffects.js";
import { GestureEvent } from "./input/GestureEvent.js";
import { Layer } from "./Layer.js";
import { LayerTree } from "./LayerTree.js";
import { MapNavigator, MapNavigatorAnimationOptions } from "./MapNavigator.js";
import { PaintRepresentation } from "./PaintRepresentation.js";
import { PickInfo } from "./PickInfo.js";
import { SelectionType } from "./SelectionType.js";
import { TileSet3DLayer } from "./tileset/TileSet3DLayer.js";
/**
 * Options to get the map bounds for the current view
 * @since 2023.1
 */
export interface MapBoundsOptions {
  /**
   * if you want the mapBounds for a partial view, provide these
   * @default the view bounds of the map
   */
  viewBounds?: Bounds;
  /**
   * if you want the mapBounds in another reference
   * @default the reference of the map
   */
  reference?: CoordinateReference;
}
/**
 *  An options object hash containing map options to be used when creating a new map.
 */
export interface MapConstructorOptions {
  /**
   * The reference of the map, that can be a reference retrieved from
   * {@link getReference} or a string.
   * This is usually a reference with a cartesian {@link CoordinateType}.
   * When a geodetic reference is supplied, the reference will be internally converted to a reference with an equidistant
   * projection.
   * <p/>
   * For 3D, use geocentric reference (EPSG:4978) (only in a {@link WebGLMap}).
   * <p/>
   * If not specified, the map will be 2D with an equi-distant cylindrical reference (EPSG:32662).
   * <p/>
   */
  reference?: CoordinateReference | string;
  /**
   * Indicates whether the map should wrap around the projection boundary.
   * The projection boundary is typically the 180° meridian.
   *
   * This is only supported when the following conditions are fulfilled:
   * <ul>
   *   <li>The map must be a {@link WebGLMap}</li>
   *   <li>The map's {@link reference} must have a cylindrical projection (e.g. Mercator or Equidistant cylindrical)</li>
   * </ul>
   *
   * If any of these conditions are not fulfilled, {@link Map.wrapAroundWorld} will be forced to <code>false</code>.
   *
   * For more information on working with maps that wrap around the dateline, check out the
   * <a href="articles://howto/view/map_wraparound.html">Configuring a map to wrap around the dateline</a> guide.
   *
   * @default false
   * @since 2023.1
   */
  wrapAroundWorld?: boolean;
  /**
   *  Specifies the configuration of the X and Y axis.
   */
  axes?: {
    /**
     * The configuration of the
     * X-axis
     */
    xAxis?: AxisConfiguration;
    /**
     * The configuration of the
     * Y-axis
     */
    yAxis?: AxisConfiguration;
  };
  /**
   * The border configuration.
   */
  border?: {
    /**
     * The size - in pixels - of the left border.
     */
    left?: number;
    /**
     * The size - in pixels - of the bottom border.
     */
    bottom?: number;
  };
  /**
   * A CSS color used in 3D for the globe, if no imagery layers are present.
   * See {@link Map.globeColor} for details.
   *
   * @default "rgba(204,204,204,1.0)"
   */
  globeColor?: string | null;
  /**
   * The {@link Map.displayScale} value to use on the map.
   *
   * @default 1
   * @see {@link Map.displayScale}
   * @since 2024.1
   */
  displayScale?: number;
  /**
   * The {@link Map.autoAdjustDisplayScale} value to use on the map.
   *
   * @default false
   * @see {@link Map.autoAdjustDisplayScale}
   * @since 2024.1
   */
  autoAdjustDisplayScale?: boolean;
}
/**
 * Options for {@link Map.restoreState}
 * @since 2023.1
 */
export interface RestoreStateOptions {
  /**
   * Animation options for {@link Map.restoreState}.
   * When <code>false</code>, the restoreState operation will be immediate (synchronous).
   * When <code>true</code> or an {@link MapNavigatorAnimationOptions options object}, the restoreState operation will be animated and asynchronous.
   * This flag affects the resolution of the returned Promise (see {@link Map.restoreState return value} documentation for details).
   * To alter the animation, you can assign an object literal with the following properties to this option:
   *
   *  @default false
   */
  animate?: MapNavigatorAnimationOptions | boolean;
}
/**
 * Describes selected objects on the map.
 * @see {@link Map.selectedObjects}
 * @since 2023.1
 */
export interface SelectedObjectInfo {
  /**
   * The layer in which objects are selected
   */
  layer: Layer;
  /**
   * The list of selected object within this layer.
   */
  selected: WithIdentifier[];
}
/**
 * Described hovered objects on the map.
 * @see {@link Map.hoveredObjects}
 * @since 2023.1
 */
export interface HoveredObjectInfo {
  /**
   * The layer in which objects are hovered
   */
  layer: Layer;
  /**
   * The list of hovered objects within this layer
   */
  hovered: WithIdentifier[];
}
/**
 * Options for {@link Map.selectObjects}
 * @since 2023.1
 */
export interface SelectObjectOptions {
  /**
   * Describes the type of selection change to apply.
   */
  editSelection?: SelectionType;
}
/**
 * Options for {@link Map.restrictNavigationToBounds}.
 * @since 2023.1
 */
export interface RestrictNavigationToBoundsOptions {
  /**
   * The padding, in pixels, around the bounds.
   */
  padding?: {
    /**
     * The left padding, in pixels.
     */
    left?: number;
    /**
     * The right padding, in pixels.
     */
    right?: number;
    /**
     * The top padding, in pixels.
     */
    top?: number;
    /**
     * The bottom padding, in pixels.
     */
    bottom?: number;
  };
}
/**
 * Options for {@link Map.showBalloon}.
 * @since 2023.1
 */
export interface ShowBalloonOptions {
  /**
   * The object to which the balloon belongs to.
   * @deprecated Please use instead {@link ShowBalloonOptions.feature} for a {@link Feature} or {@link ShowBalloonOptions.anchor} for a {@link Point} object.
   */
  object?: Feature | Shape;
  /**
   * The feature to which the balloon is associated with. If the feature belongs to the model of the
   * {@link ShowBalloonOptions.layer} then the balloon anchor position follows the changes of the feature's shape.
   * If the feature is not provided, then the {@link ShowBalloonOptions.anchor} must be defined.
   * @since 2024.0
   */
  feature?: Feature;
  /**
   * The layer the feature belongs to.  If the <code>contentProvider</code> option is omitted,
   * the layer's {@link Layer.balloonContentProvider} will be used to generate the balloon's content.
   */
  layer?: FeatureLayer | TileSet3DLayer;
  /**
   * The anchor point defines the placement position of the balloon element.
   * If the value is omitted the balloon will be placed at the focus point of the feature's shape.
   * This point can be in the view (pixel), the model or the map's reference.
   * @since 2024.0
   */
  anchor?: Point;
  /**
   * A function that accepts a single parameter, and returns the contents for the balloon.
   * The parameter is the object for which the balloon is shown, which is the <code>feature</code>, or
   * <code>anchor</code> if the <code>feature</code> parameter is not provided.
   * The return value of the function may be a string or a DOM-node.
   */
  contentProvider?: (obj: Feature | Shape) => string | HTMLElement;
  /**
   * Whether the view should be panned to center of the balloon.
   */
  panTo?: boolean;
}
/**
 * An event that describes a change in map selection.
 * @since 2023.1
 */
export interface SelectionChangeEvent {
  /**
   * An array of {@link SelectionChangeInfo} objects.
   * If the selection changes across multiple layers then this
   * array will contain one object for each layer in which selection changes occurred.
   */
  selectionChanges: SelectionChangeInfo[];
}
/**
 * An event that describes a change in hovered objects.
 * @since 2023.1
 */
export interface HoverChangeEvent {
  /**
   * An array of {@link HoverChangeInfo} objects.
   * If there are hover changes across multiple layers then this
   * array will contain one object for each layer in which hover changes occurred.
   */
  hoverChanges: HoverChangeInfo[];
}
/**
 * The Map is the main view component that displays a number of layers.
 *
 * <p>
 * To create a hardware-accelerated 2D map, use {@link WebGLMap}:
 * </p>
 *
 * ```javascript
 * map = new WebGLMap("map");
 * ```
 *
 * <p>
 * To create a hardware-accelerated 3D map, use {@link WebGLMap} with reference EPSG:4978:
 * </p>
 *
 * ```javascript
 * map = new WebGLMap("map", { reference: getReference("EPSG:4978") });
 * ```
 *
 */
declare class Map implements Evented {
  /**
   * Creates a new map.
   *
   * <p style='background-color: rgb(220, 25, 25); border: 2px solid red; padding: 1em; color: white;'>
   *   <b>
   *   (non-WebGL) Map is being phased out, and will be removed in LuciadRIA 2025.0.
   *   Use {@link WebGLMap} instead.
   *   </b>
   * </p>
   *
   * @param node either the DOM node in the web-page which will hold the map or that node's id.
   * The container for a map is typically a DIV-element.
   * @param mapConfig the map configuration.
   *
   * @deprecated Use {@link WebGLMap} instead.
   */
  constructor(node: string | HTMLElement, mapConfig?: MapConstructorOptions);
  /**
   * The map's {@link CursorManager}.
   * Use this to change the mouse cursor on the {@link domNode map's DOM node}.
   *
   * See the <a href="articles://guide/view/controllers/custom_controllers.html">Implementing custom user interaction</a>
   * guide for more information on working with cursors on the map.
   *
   * @since 2022.1
   */
  get cursorManager(): CursorManager;
  /**
   * Returns the current bounds of the map as a rectangle in the map's reference.
   * @deprecated Please use {@link getMapBounds} instead.
   */
  get mapBounds(): Bounds;
  /**
   * <p>
   * This method can be called when the size of the map's container has changed. The map will
   * automatically refit itself to the size of the Map container at that time.
   * </p>
   *
   * <p>
   * The map listens by default to window resize events to resize automatically.  However, if the
   * map container is resized by JavaScript, for example by a JavaScript SplitContainer
   * component that divides the web page in two parts that can be resized, there is no way
   * to detect this resizing of the map container automatically.  In that case this method
   * can be called by the application developer
   * </p>
   */
  resize(): void;
  /**
   * Retrieves the first touched <code>Feature</code>.  The return value of the result is null if no object
   * is touched, or a {@link PickInfo} object, with two properties: the
   * <code>objects</code> that were touched (in this case it will be an array with a single element), and the
   * <code>layer</code> that object resides in.
   * <p> The closest object is picked by checking distances between the input location and feature shapes, or their labels
   * if the <code>paintRepresentations</code> parameter includes the {@link PaintRepresentation.LABEL LABEL}.
   *
   * @param  x an x location (view space, in pixels)
   * @param  y an y location (view space, in pixels)
   * @param  sensitivity the maximum distance (in pixels) between a touched object and <code>[x,y]</code>.
   * @param [paintRepresentations] an array of {@link PaintRepresentation}
   *          that indicates by what paint representation features can be picked:
   *          by their bodies ({@link PaintRepresentation.BODY BODY}), and/or
   *          by their labels ({@link PaintRepresentation.LABEL LABEL}).
   *          When omitted features are picked by their bodies only.
   * @return a pick info object containing the first touched object,
   *                  or <code>null</code>.
   */
  pickClosestObject(x: number, y: number, sensitivity: number, paintRepresentations?: PaintRepresentation[]): PickInfo | null;
  /**
   * Retrieves the first touched <code>Feature</code>.  The return value of the result is null if no object
   * is touched, or a {@link PickInfo} object, with two properties: the
   * <code>objects</code> that were touched (in this case it will be an array with a single element), and the
   * <code>layer</code> that object resides in.
   * <p> The closest object is picked by checking distances between the input location and feature shapes, or their labels
   * if the <code>paintRepresentations</code> parameter includes the {@link PaintRepresentation.LABEL LABEL}.
   *
   * @param  x an x location (view space, in pixels, the x-coordinate of the center of the rectangle)
   * @param  y an y location (view space, in pixels, the y-coordinate of the center of the rectangle)
   * @param  width  the width of the rectangle in which the first touched object must lie (in pixels)
   *        <code>width</code> will be clamped to 1 if it's smaller than 1.
   * @param  height the height of the rectangle in which the first touched object must lie (in pixels)
   *        <code>height</code> will be clamped to 1 if it's smaller than 1.
   * @param [paintRepresentations] an array of {@link PaintRepresentation}
   *          that indicates by what paint representation features can be picked:
   *          by their bodies ({@link PaintRepresentation.BODY BODY}), and/or
   *          by their labels ({@link PaintRepresentation.LABEL LABEL}).
   *          When omitted features are picked by their bodies only.
   * @return  a pick info object containing the first touched object,
   *                  or <code>null</code>.
   */
  pickClosestObjectRectangle(x: number, y: number, width: number, height: number, paintRepresentations?: PaintRepresentation[]): PickInfo | null;
  /**
   * Retrieves all touched <code>Features</code> in an array of {@link PickInfo} objects. The type of the
   * underlying layer determines the content of the array:
   *
   * <ul>
   *   <li>For <code>FeatureLayer</code>, the method returns the touched Features directly from the model</li>
   *   <li>For <code>TileSet3DLayer</code>, the method returns an array of proxy features with metadata about the
   *   touched 3D geometry. For more information and edge cases, consult the developer guide.
   * </ul>
   *
   * A pick info object is a JavaScript object with two properties:  the <code>objects</code>
   * that were touched, and the <code>layer</code> these objects reside in.  One pickinfo
   * object for each layer  with a touched object will be added to the result.
   *
   * @param x an x location (view space, in pixels)
   * @param y an y location (view coordinates, in pixels)
   * @param aSensitivity the maximum distance (in pixels) between a touched object and [x,y].
   * @param [paintRepresentations] an array of {@link PaintRepresentation}
   *          that indicates by what paint representation features can be picked:
   *          by their bodies ({@link PaintRepresentation.BODY BODY}), and/or
   *          by their labels ({@link PaintRepresentation.LABEL LABEL}).
   *          When omitted features are picked by their bodies only.
   * @return  a list of pick info objects.  Layers without touched objects are not in the list.
   */
  pickAt(x: number, y: number, aSensitivity: number, paintRepresentations?: PaintRepresentation[]): PickInfo[];
  /**
   * Retrieves all touched <code>Features</code> in an array of pick info objects:  a pick info object
   * is a JavaScript object with two properties:  the <code>objects</code> that were touched,
   * and the <code>layer</code> these objects reside in.  One pickinfo object for each layer
   * with a touched object will be added to the result.
   *
   * @param x a x location (view-space, in pixels, the x-coordinate of the center of the rectangle)
   * @param y a y location (view-space, in pixels, the y-coordinate of the center of the rectangle)
   * @param width the width of the rectangle in which the objects must lie (in pixels)
   *                <code>width</code> will be clamped to 1 if it's smaller than 1.
   * @param height the height of the rectangle in which the objects must lie (in pixels)
   *                <code>height</code> will be clamped to 1 if it's smaller than 1.
   * @param [paintRepresentations] an array of {@link PaintRepresentation}
   *          that indicates by what paint representation features can be picked:
   *          by their bodies ({@link PaintRepresentation.BODY BODY}), and/or
   *          by their labels ({@link PaintRepresentation.LABEL LABEL}).
   *          When omitted features are picked by their bodies only.
   * @return a list of pick info objects.  Layers without touched objects are not
   *                    in the list.
   */
  pickAtRectangle(x: number, y: number, width: number, height: number, paintRepresentations?: PaintRepresentation[]): PickInfo[];
  /**
   * <p>
   *   The selected objects of the map. This is an array of <code>Object</code>s where each
   *   <code>Object</code> contains the layer and the selected objects as properties. The name of
   *   those properties is <code>layer</code> and <code>selected</code> respectively.
   * </p>
   * <p>
   *   Performing an action on each selected object of a certain layer can for example be achieved
   *   as shown below.
   * </p>
   *
   * ```javascript
   *   var map = ...;
   *   var selection = map.selectedObjects;
   *   var i, j;
   *   var layer, selectedObjects,selectedObject;
   *   for ( i = 0; i < selection.length; i++ ){
   *     layer = selection[i].layer;
   *     if ( isSearchedLayer( layer ) ){
   *       selectedObjects = selection[i].selected;//array of the selected objects for layer
   *       for ( j = 0; j < selectedObjects.length; j++ ){
   *         selectedObject = selectedObjects[j];
   *         //do something with the selected object
   *       }
   *     }
   *   }
   * ```
   */
  get selectedObjects(): SelectedObjectInfo[];
  /**
   * The set of objects which are currently displayed as "hovered" (i.e. a cursor is hovering over them).
   * @since 2021.0
   */
  get hoveredObjects(): HoveredObjectInfo[];
  /**
   * Selects a number of objects, passed to this method as an array of {@link PickInfo} objects.
   * A {@link PickInfo} object is a JavaScript object with two properties: the <code>objects</code>
   * property is an array of the objects that must be selected, the <code>layer</code> property
   * indicates what the layer is these objects are supposed to be in.  If you try to select
   * an object that is not available in the layer, a ProgrammingError will be thrown.<br>
   * Note: You can select features only on a layer that is marked as <code>selectable</code>.
   * Also, objects that do not pass the layer's filter will not be selected either.
   * @param selection an array of {@link PickInfo} objects
   * @param [options] an object hash containing selection parameters.
   * the objects in selection that were not previously selected will be added to the current selection
   * and the objects that were will be removed. If editSelection is NEW (the default value), the current selection will
   * be replaced by the selection parameter. If editSelection is set to ADD or REMOVE, selectObjects
   * will respectively add or remove objects to and from the current selection.
   */
  selectObjects(selection: PickInfo[], options?: SelectObjectOptions): void;
  /**
   * Updates the set of objects which are displayed as "hovered" (i.e. a cursor is hovering over them). Note that this
   * method probably should not be called except from a custom {@link Controller} which is reacting to a cursor. If you
   * try to hover an object that is not available in the layer, a ProgrammingError will be thrown. Objects that do not
   * pass the layer's filter (if any) will not be hovered.
   * @param hovered a list of objects organized by layer
   * @since 2021.0
   */
  hoverObjects(hovered: PickInfo[]): void;
  /**
   * Clear the current set of hovered objects. See {@link hoverObjects} for more information.
   * @since 2021.0
   */
  clearHovered(): void;
  /**
   * Clear the current selection.
   *
   */
  clearSelection(): void;
  /**
   * refreshes the map unconditionally.
   *
   * @since 2021.1
   */
  invalidate(): void;
  /**
   * This method must be called if the map is to be removed from the web page.  This method
   * cleans up the DOM and unregisters DOM event handlers.
   */
  destroy(): void;
  /**
   * Places a balloon on the map. All parameters are optional, but at least
   * {@link ShowBalloonOptions.feature} or {@link ShowBalloonOptions.anchor} must be provided.
   * If the {@link ShowBalloonOptions.contentProvider} option is present it will be used to generate
   * the balloon content. If not, the <code>balloonContentProvider</code> of the layer will be
   * used to generate the balloon content, provided the layer is configured with one.  In all
   * other cases, a string representation of the object will be used as the balloon's content.
   * <br/>
   *
   * The balloon can be styled using the following CSS selectors:
   * <ul>
   *   <li><code>.luciad .lcdBalloon</code>: The balloon's container element. This element is absolutely positioned by LuciadRIA.</li>
   *   <li><code>.luciad .lcdBalloon .lcdFrame</code>: A container that wraps the header and the content. </li>
   *   <li><code>.luciad .lcdBalloon .lcdHeader</code>: The header of the balloon. Contains the close button.</li>
   *   <li><code>.luciad .lcdBalloon .lcdClose</code>: The close button of the balloon.</li>
   *   <li><code>.luciad .lcdBalloon .lcdContent</code>: The main content of the balloon.</li>
   * </ul>
   *
   * See @luciad/samples-common-ui/sample-common-style.css for an example usage of these selectors.
   *
   * <br/>
   *
   * Only one balloon instance can be shown at the same time.
   * Consider using labels if you want to show balloons for multiple objects at the same time.
   * Labels support HTML, so they can show the same contents as a balloon.
   * An additional benefit is that labels can be decluttered.
   *
   * @param options An options object literal.
   *
   * ```javascript
   * [[include:view/strategy/BalloonSnippets.ts_SHOW_BALLOON_FOR_FEATURE]]
   * ```
   */
  showBalloon(options: ShowBalloonOptions): void;
  /**
   * Hides the currently shown balloon, if any.
   */
  hideBalloon(): void;
  /**
   * <p>
   * Returns the current state of the map, so that it can be restored at a later time.
   * Currently this state encompasses a snapshot of the mapToViewTransformation configuration.
   * The returned state object does not have a fixed layout, so accessing properties of
   * the state is not allowed.
   * <p/>
   *
   * <p>
   * The state of the map does not include the state of the individual layers, nor any of the the navigation or scale restrictions.
   * </p>
   *
   * <p>
   * If you're using a custom map reference, this reference needs to have an identifier when saving the map state.
   * When restoring the saved state, ensure the reference can be retrieved from the
   * {@link ReferenceProvider}, using the reference identifier.
   * </p>
   *
   * @return the current map state
   */
  saveState(): unknown;
  /**
   * <p>
   * Restores the state of the map based on a state object that has been
   * returned by the {@link saveState} method.
   * </p>
   *
   * <p>
   * It is possible to restore the state of a map with a reference that's different from this map's reference.
   * Note that this is only true if a matching camera position can be found.
   * </p>
   *
   * <p>
   * For example, it is not possible to restore a map state that's looking at
   * Australia if this map has a Polar Stereographic North reference (because the southern hemisphere is not defined
   * in that projection). In that case, an Error is thrown.
   * </p>
   *
   * @param state A map state
   * @param options Options to restore the map state
   * @return A promise that will be resolved after the restoreState operation has finished.
   */
  restoreState(state: any, options?: RestoreStateOptions): Promise<void>;
  /**
   * Call this method to show a context menu at the given position.
   *
   * @param position the page position at which to show the context menu. The passed
   *                         position should compensate for the current scrolling offset of
   *                         the document
   * @param contextMenuInfo the context menu info object.  This object will
   *                                 be passed to
   *                                 {@link onCreateContextMenu}
   * @return a boolean indicating whether a context menu was shown. If no context menu was shown (because there are no items in the menu, cf. {@link onCreateContextMenu}), <code>false</code> is returned.
   */
  showContextMenu(position: number[], contextMenuInfo: any): boolean;
  /**
   * Override this method to add view-wide content to the map's context menu.
   *
   * @param contextMenu the context menu
   * @param [contextMenuInfo] The context menu info object.  This object may contain
   *      arbitrary data.  The default implementation expects a pickInfo object which will be passed to the appropriate
   *      {@link Layer.onCreateContextMenu onCreateContextMenu} method.
   */
  onCreateContextMenu(contextMenu: ContextMenu, contextMenuInfo: any): void;
  /**
   * Override this method to display a populated context menu. Implementations of this method
   * should provide the required glue code to display the context menu using UI toolkit
   * dependent code.
   *
   * @param position the page position at which to show the context menu. The position
   *                         already compensates for the current scrolling offset of the document
   * @param contextMenu the context menu
   */
  onShowContextMenu(position: number[], contextMenu: ContextMenu): void;
  /**
   * Override this when you wish to respond to click events on the map
   *
   * @param event the click event on the map
   */
  onClick(event: GestureEvent): boolean;
  /**
   * Determines whether a view coordinate is inside one of the map borders or not.
   * See the {@link Map} constructor to define a border.
   * @param border the border for which you want to verify the given
   *                                        coordinate
   * @param x the x coordinate
   * @param y the y coordinate
   * @return {Boolean} true if the coordinate is located in the map's border, false otherwise
   */
  isInBorder(border: Map.Border, x: number, y: number): boolean;
  /**
   * <p>
   *   Specify a bounds which identifies the area beyond which the map cannot zoom or pan.
   *   When set, a user will not be able to zoom or pan to an area that falls outside this bounds. The default
   *   value is <code>null</code>.
   * </p>
   * <p>
   *   While the bounds can be specified in any spatial reference, the
   *   constraints will be evaluated on a bounds in the spatial reference of the map.  For
   *   example, if the map's reference is in a Mercator grid reference, but the bounds
   *   constraint is specified in a geodetic reference, this bounds will be first
   *   converted to a bounds in a Mercator grid reference.
   *
   *   <br/>
   *   In general, this transformation of the bounds to the map's reference may make the bounds larger. For example, a rectangle in longitude-latitude,
   *   will not be a rectangle in a reference with a Polar projection, so the area needs to be distorted somewhat. For high accuracy,
   *   it is thus best to use specify the bounds in the reference of the Map.
   *
   *   <br/>
   *   See also {@link Transformation} for more information about transforming coordinates between reference systems.
   * </p>
   * <p>
   *   Visual feedback will be shown when the user hits the edges of the constraint during panning. Note that the style
   *   of this feedback cannot be modified.
   *   </p>
   * <p>
   *  When calling this method and the center of the view is not inside this bounds, the map will
   *  fit on this bounds.
   * </p>
   * <p>
   *   To cancel the constraint, call this method with <code>null</code>.
   * </p>
   * <p>
   *   On a 3D map, the constraint is ignored.
   * </p>
   * <p>
   *   On a 2D map, rotation is not possible when there is a constraint.
   * </p>
   *
   * @param bounds the bounding box restriction.
   * @param [options] additional options
   *
   * @deprecated See {@link MapNavigator.constraints constraints} to configure bounds constraints.
   *
   */
  restrictNavigationToBounds(bounds: Bounds, options?: RestrictNavigationToBoundsOptions): void;
  /**
   * Retrieve the bounds to which the navigation is restricted. You should not modify this object while it is set on the map.
   * @return the navigation restriction bounds.
   */
  getBoundsNavigationRestriction(): Bounds | null;
  /**
   * Creates a {@link Transformation} object that is used to
   * transform a view position to a corresponding world (map) position in 3D scenes, based on a mechanism that is defined by
   * {@link LocationMode} parameter.
   * <p> In 3D space there are multiple interpretations possible for a given view point expressed in pixel coordinates.
   *     Possible options are:<br>
   * <ul>
   *  <li><i>LocationMode.CLOSEST_SURFACE</i> - This transformation yields a world point position
   *     corresponding to the visible object at the view location closest to the viewer (camera eye point).
   *     The closest 3D object can be represented by 3D meshes, point clouds, extruded shapes, 3D icons or the terrain.</li>
   *  <li><i>LocationMode.TERRAIN</i> - This transformation yields a world point position on the terrain.</li>
   *  <li><i>LocationMode.ELLIPSOID</i> - This transformation yields a world point position on the ellipsoid.</li>
   * </ul>
   * <p><p>
   *   For 3D cartesian world references, the z = 0 plane takes on the role of terrain and ellipsoid.
   *   So for the corresponding location modes, the transformation yields a world point position on the z = 0 plane.
   * <p><p>
   *   Note: In 2D space the {@link LocationMode} parameter is disregarded and the returned
   *  {@link Transformation} object is same as the one obtained by
   *  {@link Map.viewToMapTransformation viewToMapTransformation}.
   *
   * <p>
   *   If the view coordinate does not represent a point on an object or terrain, then {@link OutOfBoundsError} will be thrown.
   * <p>
   *   <img src="media://3dtiles/viewPoint3d.png" alt="View point in 3D scene" height="360" />
   *   <img src="media://3dtiles/locationModeIn3d.png" alt="View to map transformation results in context of the locationMode property" height="360" /><br>
   *   The first image shows the view point that was used for the transformations. The second image shows from a different perspective
   *   the transformation results, points that were created by the Transformation object with different locationMode properties.
   *
   * @param locationMode the location mode the returned Transformation object will use. Default value is the {@link LocationMode.TERRAIN} mode.
   * @param options Optional object literal with location mode specific options.
   *
   * @since 2018.0
   */
  getViewToMapTransformation(locationMode?: LocationMode, options?: EllipsoidTransformationOptions): Transformation;
  /**
   * The transformation that can be used to transform coordinates specified in the
   * Map's reference to view coordinates (pixels). See {@link Map.viewToMapTransformation viewToMapTransformation}
   * for the inverse transformation.
   * <p>
   * In a 3D map, this transformation will throw {@link OutOfBoundsError} when the
   * world coordinate is not visible in the current view.
   * This happens when the world coordinate is obscured by terrain or on the back-facing side of the globe.
   * <p>
   * In a 2D map that has {@link Map.wrapAroundWorld} set to true, this transformation will return a pixel in view if it exists.
   * If this point is visible on multiple maps, the pixel corresponding to the center most map will be returned.
   * <br>
   * For more information, check <a href="articles://howto/view/map_wraparound.html?subcategory=ria_map_setup#_what_do_i_need_to_take_into_account_when_working_with_these_maps">Things to consider when using wrapAroundWorld</a>.
   */
  get mapToViewTransformation(): Transformation;
  /**
   * The transformation that can be used to transform coordinates specified
   * in view coordinates (pixels) to the map reference. See {@link Map.mapToViewTransformation mapToViewTransformation}
   * for the inverse transformation.
   * <p>
   * In a 3D map, this transformation will return a world point on the terrain at the input view coordinate.
   * If the view coordinate does not hit the terrain, the transformation will throw {@link OutOfBoundsError}.
   * <p>
   * In a 2D map, the world point will never contain elevation.
   * <p> This is a shorthand for {@link Map.getViewToMapTransformation Map#getViewToMapTransformation(LocationMode.TERRAIN)}
   *
   * If you are working with a Map.wrapAroundWorld map, and you're transforming the map point to a model reference afterward, make sure you enable {@link CreateTransformationOptions.normalizeWrapAround} on the map to model transformation you will create.
   */
  get viewToMapTransformation(): Transformation;
  /**
   * Returns the scale values of this map view as an array of two Numbers (scale along the X-axes
   * and the Y-axes, in that order). This is a read-only property.
   *
   *<p>
   * In the case when the unit of measure is a length (like distance, altitude, easting,....),
   * the scale is the ratio between the distance, as it is measured on the screen of the device, to
   * the distance in the real world.
   * This corresponds with paper map scales. For instance to obtain a 1:10000 map display the
   * scale should be set to <code>1 / 10000</code>.
   *</p>
   * <p>
   * In the case when the unit of measure is of a different type (for example, time or
   * temperature), the scale is the ratio of 1cm on the screen per units of measure. For example,
   * such a scale might express something like 1cm equals 5 hours.
   * </p>
   * <p>
   * Note that since web browsers do not provide unambiguous information on the correct screen
   * resolution (which is commonly expressed in dpi (dots per inch)), the distance of 1cm on a
   * device's display is an approximation.
   * To retrieve the conversion factor used by LuciadRIA,
   * you can use the {@link Map.dotsPerCentimeter dotsPerCentimeter} property of
   * the <code>Map</code>.
   * </p>
   *
   */
  get mapScale(): [number, number];
  /**
   * The number of virtual pixels ("dots") on the screen per centimeter, as determined by the
   * <code>Map</code>.
   * This value usually varies depending on the device, OS-settings and browser.
   *
   */
  get dotsPerCentimeter(): number;
  /**
   * The number of virtual pixels ("dots") on the screen per inch, as determined by the
   * <code>Map</code>.
   * This value usually varies depending on the device, OS-settings and browser.
   *
   */
  get dotsPerInch(): number;
  /**
   * The size of the view - excluding the border - as an array with two Numbers, representing the
   * width and height in pixels.  This is the size of the area where the data (not the axes) is
   * rendered.
   */
  get viewSize(): [number, number];
  /**
   * The {@link Map.displayScale} to use on the map.
   *
   * The display scale is the ratio of the resolution in physical pixels to the resolution
   * in CSS pixels for the current display device. A value of 1 indicates a classic 96 DPI display,
   * while a value of 2 (or even 4) is preferable for HiDPI/Retina displays.
   *
   * This setting scales the pixel density of the map. For example:
   * <ul>
   *   <li>displayScale = 1: the map renders at the classic 96 DPI.</li>
   *   <li>displayScale = 2: the map renders at double the pixel density.</li>
   *   <li>displayScale = 0.5: the map renders at half the pixel density.</li>
   * </ul>
   *
   * Increasing the display scale results in sharper images and crisper text, but it might have a negative impact on
   * performance.
   *
   * If you enable {@link Map.autoAdjustDisplayScale}, the Map's display scale automatically adjusts to match the display scale of the browser or operating system.
   *
   * This setting only works on {@link WebGLMap}. On {@link Map non-WebGLMap},
   * this value is forced to 1.
   *
   * The default value is 1.
   *
   * Whenever this value changes, a {@link WebGLMap.on "DisplayScaleChanged"} event is emitted.
   *
   * @since 2024.1
   */
  get displayScale(): number;
  set displayScale(val: number);
  /**
   * Determines whether the map automatically adjusts {@link Map.displayScale}.
   *
   * If you enable this setting, the map automatically adjusts {@link Map.displayScale} so that it always
   * matches <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio">window.devicePixelRatio</a>.
   * It will update {@link Map.displayScale} when the display scale changes on the monitor,
   * when users zoom on the web page, or drag the browser window to a monitor with a different
   * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio">devicePixelRatio</a>.
   *
   * This setting only works on {@link WebGLMap}. On {@link Map non-WebGLMap},
   * this value is forced to <code>false</code>.
   *
   * The default value is <code>false</code>.
   *
   * @since 2024.1
   */
  get autoAdjustDisplayScale(): boolean;
  set autoAdjustDisplayScale(val: boolean);
  /**
   * The size of the view - including the border - as an array with two Numbers, representing the
   * width and height in pixels.
   */
  get totalSize(): [number, number];
  /**
   * Returns all bounds of the map in the reference of your choosing
   * <ul>
   *   <li> if wrapAroundWorld is false this will always return a list with a single bounds element. </li>
   *   <li> if wrapAroundWorld is true and the map visualizes the world across the dateline,
   *   this will return a bounds left of that dateline and a bounds right of the dateline. </li>
   * </ul>
   * An empty list will be returned if the bounds cannot be calculated.
   * That is if no part of the map (viewBounds) is visible in the specified reference.
   * For more information, check <a href="articles://howto/view/map_wraparound.html?subcategory=ria_map_setup#_what_do_i_need_to_take_into_account_when_working_with_these_maps">Things to consider when using wrapAroundWorld</a>.
   *
   * @param options the options for these bounds {@link MapBoundsOptions}
   *
   * @since 2023.1
   */
  getMapBounds(options?: MapBoundsOptions): Bounds[];
  /**
   * The currently active controller of the map.
   *
   * A controller defines how user input is interpreted.
   * If {@link controller} is <code>null</code> or didn't handle the user input event, the event is passed to {@link defaultController}.
   *
   * {@link controller} typically remains <code>null</code> the majority of the time, and is only set when a special user interaction is required.
   * For example:
   * <ul>
   *   <li>{@link CreateController}: create a new {@link Feature}</li>
   *   <li>{@link EditController}: edit an existing {@link Feature}</li>
   *   <li>{@link SwipeController}: Compare layers by swiping</li>
   *   <li>{@link FlickerController}: Compare layers by flickering</li>
   *   <li>A measurement controller</>
   * </ul>
   * After these special user interactions finish, the {@link controller} typically deactivates itself (e.g. with creation or editing) or gets deactivated by the user (e.g. with swiping or flickering).
   * When that happens, this field goes back to <code>null</code>.
   *
   * By contrast, {@link defaultController} is typically non-null for the lifetime of the {@link Map} and handles navigation, hovering and selection.
   *
   * See the <a href="articles://guide/view/controllers/custom_controllers.html">
   * Implementing custom user interaction</a> guide and the
   * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
   * Managing user input with LuciadRIA controllers</a>
   * tutorial for more information.
   *
   * ```javascript
   * map.controller = new BasicCreateController(ShapeType.POINT);
   * ```
   */
  set controller(controller: Controller | null);
  get controller(): Controller | null;
  /**
   * The currently active default controller of the map.
   *
   * This controller handles user input, if no {@link controller} is active on the map or the {@link controller} didn't handle the user input.
   * As opposed to {@link controller}, {@link defaultController} typically is set to controllers that handle navigation, hovering and selection.
   * For example:
   * <ul>
   *   <li>{@link DefaultController}: implements the default LuciadRIA map behavior. You can customize parts of this, like just zooming or rotation.</li>
   *   <li>{@link ContextMenuController}: implements context menu actions on the map</li>
   *   <li>A custom navigation controller</li>
   * </ul>
   *
   * If {@link defaultController} is <code>null</code> or didn't handle the user input, the DOM event is forwarded back to the browser.
   * If {@link defaultController} did handle the user input, propagation of the DOM event is stopped.
   *
   * By default, this field is initialized with a {@link DefaultController}.
   * If both {@link controller} and {@link defaultController} are <code>null</code>, map interactions are completely disabled.
   *
   * See the <a href="articles://guide/view/controllers/custom_controllers.html">
   * Implementing custom user interaction</a> guide and the
   * <a href="articles://tutorial/view/controllers/managing_user_input_controllers.html">
   * Managing user input with LuciadRIA controllers</a>
   * tutorial for more information.
   *
   * @since 2024.0
   */
  set defaultController(controller: Controller | null);
  get defaultController(): Controller | null;
  /**
   * The map's {@link MapNavigator}. Use this to manipulate the area
   * which is shown in the map.
   */
  get mapNavigator(): MapNavigator;
  /**
   * The current world reference of the map.
   */
  get reference(): CoordinateReference;
  /**
   * Whether the map should wrap around the projection boundary.
   *
   * This is forced to <code>false</code> if the map has a {@link Map.reference reference} that does not use
   * a cylindrical projection.
   *
   * @since 2023.1
   */
  get wrapAroundWorld(): boolean;
  /**
   * Determine whether a particular object on a layer is displayed as "hovered" (i.e. a cursor is hovering over it).
   *
   * @param layer The layer on which the object is sitting
   * @param object The object whose hover status is to be determined
   * @return true if the object is hovered
   * @since 2021.0
   */
  isHovered(layer: Layer, object: WithIdentifier): boolean;
  /**
   * Determine whether a particular object on a layer is selected.
   *
   * @param layer The layer on which the object is sitting
   * @param object The object whose selection status is to be determined
   * @return true if the object is selected
   */
  isSelected(layer: Layer, object: WithIdentifier): boolean;
  /**
   * The layer tree that contains all of the layers in this map.
   * This property is immutable.
   */
  get layerTree(): LayerTree;
  /**
   * The DOM node in which the map is contained.
   * This is the same node which was passed by ID at map construction.
   */
  get domNode(): HTMLElement;
  /**
   * <p>
   * The minimum scale value of the map. A user cannot zoom out further than this value.
   * The value is an array of 2 positive numbers: the first for the scale along the horizontal axis, the second for the
   * scale along the vertical axis. These values may also be set with a single number value for
   * convenience.
   * </p>
   * <p>
   *   The default value of the horizontal and vertical components is <code>0</code>, meaning there
   *   is no lower scale limit in both dimensions.
   * </p>
   * <p>
   *   An error will be thrown when attempting to set an invalid value (e.g. the minMapScale is
   *   larger than the maxMapScale).
   * </p>
   *
   * ```javascript
   * map.minMapScale = 1/200000;
   * map.maxMapScale = 1/50000;
   * ```
   *
   * @deprecated See {@link MapNavigator.constraints constraints} to configure scale constraints.
   */
  get minMapScale(): number | [number, number];
  set minMapScale(minScale: number | [number, number]);
  /**
   * <p>
   *   The maximum scale value of the map. A user cannot zoom in further than this value. The value is an
   *   array of 2 positive numbers: the first for the scale along the horizontal axis, the second
   *   for the scale along the vertical axis. These values may also be set with a single number
   *   value for convenience.
   * </p>
   * <p>
   *   The default value of the horizontal and vertical components is <code>Infinity</code>,
   *   meaning there is no upper scale limit in both dimensions.
   * </p>
   * <p>
   *   An error will be thrown when attempting to set an invalid value (e.g. the maxMapScale is
   *   smaller than the minMapScale).
   * </p>
   * <p>
   *   Note that this value may conflict with the minimum scale which is implied by the bounds constraint ({@link Map.restrictNavigationToBounds}).
   *   When this value is smaller than that minimum-scale (which depends on the width/height of those bounds as well as the width/height of the view),
   *   the scale of the bounds-restriction will have precedence over this one.
   * </p>
   * <p>
   * This value may conflict with the scale implied by the navigation restriction {@link Map.getBoundsNavigationRestriction}.
   * Because the map will be zoomed in so no data outside the restriction is shown, that scale value may be larger than this value. If that is the case,
   * the scale value of the restriction will take precedence. Note that in such a case, it is impossible to zoom the map.
   *   </p>
   * @deprecated See {@link MapNavigator.constraints constraints} to configure scale constraints.
   */
  get maxMapScale(): number | [number, number];
  set maxMapScale(maxScale: number | [number, number]);
  /**
   * <p>
   *   The {@link GraphicsEffects graphics effects} that are applied on this map. Have a look at
   *   {@link GraphicsEffects} for a list of effects that are available.
   * <p>
   *   You should directly assign properties of the effects fields.
   * </p>
   * <p>
   *   Any effect that has complex parameters (using an object literal) can be disabled by setting
   *   its value to null. For simple effects that have boolean toggles, you can turn the effect off by
   *   setting the boolean value to false.:
   * </p>
   *
   * ```javascript
   *     map.effects.light = null;
   *     map.effects.atmosphere = false;
   * ```
   */
  get effects(): GraphicsEffects;
  /**
   * A CSS color string to indicate the desired color of the globe if no imagery layers are present.
   *
   *   ```javascript
   *      map.globeColor = "#aabbcc";  // or "rgba(110, 120, 130, 1.0)"
   *   ```
   *
   * The default color for the globe is light-grey ("rgba(204, 204, 204, 1.0)")
   * <p/>
   * This only has an effect on 3D maps.  On 2D maps, there is no globe.
   * <p/>
   * There are three distinct values that you can use, each with their specific behaviour.
   * <ul>
   *   <li>
   *     <b>rgba(red, green, blue, alpha), where alpha is non-zero</b> or <b>#RRGGBB</b><br>
   *     the globe is painted fully opaque with the given color in the absence of raster layers.
   *   </li>
   *   <li>
   *     <b>rgba(red, green, blue, 0)</b><br>
   *     the globe is painted fully transparent in the absence of raster layers.<br>
   *     The value of red, green and blue is ignored, "rgba(0,0,0,0)" has the same effect as "rgba(255,255,255,0)".
   *     The globe still allows you to drape 2D shapes and images on top of it.
   *   </li>
   *   <li>
   *     <b>null</b><br>
   *     no globe is painted.<br>
   *     This also disables 2D vector and raster painting.
   *     Only data that does not need draping will be rendered on the map.
   *   </li>
   */
  get globeColor(): string | null;
  set globeColor(globeColor: string | null);
  /**
   * <p>
   * The camera that is used by this map.
   * <p>
   *
   * <p>
   * For now, you can only set a {@link PerspectiveCamera} instance on a map if the
   * map has a geocentric reference (<code>EPSG:4978</code>) or a 3D cartesian reference (e.g. <code>LUCIAD:XYZ</code>, and you can
   * only set a {@link OrthographicCamera} on the map if the map does NOT have
   * a geocentric reference (ie. it's a projected (grid) or cartesian reference).
   * </p>
   *
   */
  get camera(): OrthographicCamera | PerspectiveCamera;
  set camera(newCamera: OrthographicCamera | PerspectiveCamera);
  /**
   * The key used to animate the camera on the map.
   */
  get cameraAnimationKey(): string;
  emit(event: string, ...args: any[]): void;
  /**
   * Event hook that is called when the map comes to rest. For example, this event is fired after
   * the user has finished panning or zooming the map.
   * @param event The "idle" event type
   * @param callback the callback to be invoked when the map comes to rest.
   * @param context value to use as this when executing callback
   * @since 2014.0
   * @event
   */
  on(event: "idle", callback: () => void, context?: any): Handle;
  /**
   * Event hook that is called when the selection of the map changes.
   *
   * @param event The "SelectionChanged" event type
   * @param callback callback to be invoked when there is a selection change. The callback gets one parameter, 'selectionChangeEvent' which indicates what selection changes occurred.
   * @param context value to use as this when executing callback.
   * @event
   */
  on(event: "SelectionChanged", callback: (selectionChangeEvent: SelectionChangeEvent) => void, context?: any): Handle;
  /**
   * Event hook that is called when the hover of the map changes.
   *
   * @param event The "HoverChanged" event type
   * @param callback callback to be invoked when there is a hover change.
   * @param context value to use as this when executing callback.
   * @since 2021.0
   * @event
   */
  on(event: "HoverChanged", callback: (hoverChangeEvent: HoverChangeEvent) => void, context?: any): Handle;
  /**
   * Event hook that is called when the map extent has changed, for instance by panning or
   * zooming.
   * Note that the MapChange event is fired only once per frame.
   * @param event The "MapChange" event type
   * @param callback callback to be invoked when the map extent has changed.
   * @param context value to use as this when executing callback
   * @event
   */
  on(event: "MapChange", callback: () => void, context?: any): Handle;
  /**
   * Event hook that is called when a balloon opens on the map.
   * @param event The "ShowBalloon" event type
   * @param callback callback to be invoked when a balloon opens on the map.
   * @param context value to use as this when executing callback
   * @since 2014.0
   * @event
   */
  on(event: "ShowBalloon", callback: () => void, context?: any): Handle;
  /**
   * Event hook that is called when a balloon closes on the map.
   * @param event The "HideBalloon" event type
   * @param callback callback to be invoked when a balloon closes on the map.
   * @param context value to use as this when executing callback
   * @since 2014.0
   * @event
   */
  on(event: "HideBalloon", callback: () => void, context?: any): Handle;
  /**
   * Event hook that is called when {@link Map.controller} changes.
   * Note that:
   * <ul>
   *   <li>{@link controller} can be null.</li>
   *   <li>Changing controllers is delayed when the currently active {@link Controller}
   *       returns a Promise from its {@link Controller.onDeactivate}.
   *       The ControllerChanged event will fire once deactivation is complete (ie. the deactivation promise resolves).
   *       Only then the new controller becomes active on the map.</li>
   * </ul>
   *
   * @param event The "ControllerChanged" event type
   * @param callback Callback to be invoked when the controller on the map changes. The callback gets 2 parameters,
   * the first is 'newController', which is the new {@link Controller} active on the map. The second is the previous
   * {@link Controller} that was active on the map.
   * @param context value to use as this when executing callback
   * @since 2017.1
   * @event
   */
  on(event: "ControllerChanged", callback: (newController: Controller | null, previousController: Controller | null) => void, context?: any): Handle;
  /**
   * Event hook that is called when {@link Map.defaultController} changes.
   * Note that:
   * <ul>
   *   <li>{@link defaultController} can be null.</li>
   *   <li>Changing controllers is delayed when the currently active {@link Controller}
   *       returns a Promise from its {@link Controller.onDeactivate}.
   *       The DefaultControllerChanged event will fire once deactivation is complete (ie. the deactivation promise resolves).
   *       Only then the new controller becomes active on the map.</li>
   * </ul>
   *
   * @param event The "DefaultControllerChanged" event type
   * @param callback Callback to be invoked when the default controller on the map changes. The callback gets 2 parameters,
   * the first is 'newController', which is the new {@link Controller} active on the map. The second is the previous
   * {@link Controller} that was active on the map.
   * @param context value to use as this when executing callback
   * @since 2024.0
   * @event
   */
  on(event: "DefaultControllerChanged", callback: (newController: Controller | null, previousController: Controller | null) => void, context?: any): Handle;
  /**
   * Event hook that is called when {@link Map.displayScale} changes.
   *
   * @param event The "DisplayScaleChanged" event type
   * @param callback Callback to be invoked when the display scale changes.
   * @param context value to use as this when executing callback
   * @since 2024.1
   * @event
   */
  on(event: "DisplayScaleChanged", callback: () => void, context?: any): Handle;
  /**
   * Event hook that is called when {@link Map.autoAdjustDisplayScale} changes.
   *
   * @param event The "AutoAdjustDisplayScaleChanged" event type
   * @param callback Callback to be invoked when the automatic display scale adjustment changes.
   * @param context value to use as this when executing callback
   * @since 2024.1
   * @event
   */
  on(event: "AutoAdjustDisplayScaleChanged", callback: () => void, context?: any): Handle;
}
/**
 * Describes a selection change on the map. See the "SelectionChanged" on {@link Map} for more information.
 */
export interface SelectionChangeInfo {
  /**
   * The layer on which the selection changed
   */
  layer: Layer;
  /**
   * The objects that were selected.
   */
  selected: WithIdentifier[];
  /**
   * The objects that were deselected.
   */
  deselected: WithIdentifier[];
}
/**
 * Describes a hover change on the map. See the "HoverChanged" on {@link Map} for more information.
 * @since 2021.0
 */
export interface HoverChangeInfo {
  /**
   * The layer on which the selection changed
   */
  layer: Layer;
  /**
   * The objects that were visited by a pointer/cursor.
   */
  hovered: WithIdentifier[];
  /**
   * The objects that were left by a pointer/cursor.
   */
  vacated: WithIdentifier[];
}
declare namespace Map {
  enum Border {
    BOTTOM = 1,
    LEFT = 0,
  }
}
export { Map };