import { Feature } from "../../model/feature/Feature.js";
import { Editor } from "../editor/Editor.js";
import { FeatureLayer } from "../feature/FeatureLayer.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { Map } from "../Map.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { IconStyle } from "../style/IconStyle.js";
import { LabelCanvas } from "../style/LabelCanvas.js";
import { ShapeStyle } from "../style/ShapeStyle.js";
import { Controller } from "./Controller.js";
import { HandleEventResult } from "./HandleEventResult.js";
import { Handle } from "../../util/Evented.js";
import { EditShapeEvent } from "./EditShapeEvent.js";
import { EditSettings } from "./EditSettings.js";
/**
 * Constructor options for {@link CreateController}.
 */
export interface CreateControllerConstructorOptions {
  /**
   *  The style that editing helper lines will be drawn in
   */
  helperStyle?: ShapeStyle;
  /**
   * The style of the handles.
   */
  handleIconStyle?: IconStyle;
  /**
   * Indicates whether to finish creation on a single-click event, or a double-click event (the default).
   *
   * The flag has effect on creation of shapes where you have to "confirm" your creation by clicking somewhere
   * else on the map. For example, creation of a circle, where you first click somewhere on the map to place the circle,
   * then change the position or radius of the circle and then click (or double-click, if this is <code>false</code>)
   * somewhere else to finish creation.
   *
   * This flag has no effect on the default point, polyline and polygon creation.
   * Creation of these shapes already use single clicks to place points.
   */
  finishOnSingleClick?: boolean;
  /**
   * Indicates whether to allow drawing shapes in "freehand" mode. When this is enabled,
   * the user can click / tap near the last created point and drag to draw a shape.
   * Multiple points will be inserted while the mouse is being dragged.
   *
   * When this is disabled, the user can only create (single) points by clicking / tapping the map.
   *
   * @since 2022.0
   * @default true
   */
  freehand?: boolean;
  /**
   * The {@link Editor} to use. The editor determines how creation behaves.
   *
   * The {@link Editor.getCreateHandle} to get handles for creation.
   *
   * @since 2022.1
   */
  editor?: Editor;
  /**
   * The mouse interaction radius to use, in pixels.
   *
   * This is the radius used for mouse events, to determine interaction with handles.
   *
   * @see {@link EditSettings.mouseInteractionRadius}
   * @see {@link interactsWithControllerShape}
   * @since 2022.1
   */
  mouseInteractionRadius?: number;
  /**
   * The touch interaction radius to use, in pixels.
   *
   * This is the radius used for touch events, to determine interaction with handles.
   * Typically, this is larger than the {@link mouseInteractionRadius}.
   *
   * @see {@link EditSettings.touchInteractionRadius}
   * @see {@link interactsWithControllerShape}
   * @since 2022.1
   */
  touchInteractionRadius?: number;
}
/**
 * This controller enables creating a new shape on the map. To specify the layer in which the
 * object should be created, override the <code>onChooseLayer</code> method callback.
 *
 * If you want to change the way creation behaves, check out the
 * <a href="articles://tutorial/view/controllers/custom_editing.html">Customizing creation and editing</a> guide.
 **/
export declare class CreateController extends Controller {
  /**
   *
   * @param options An options object hash containing CreateController options.
   */
  protected constructor(options?: CreateControllerConstructorOptions);
  /**
   * Return the minimum number of points that should be created.
   * @return The minimum number of points to create.
   */
  getMinimumPointCount(): number;
  /**
   * Return the maximum number of points that should be created.
   * @return The maximum number of points to create.
   */
  getMaximumPointCount(): number;
  /**
   * Set the minimum and maximum number of points that should be created using this controller.
   * Once the maximum number of points is reached, the controller will automatically disable itself.
   * Note that this method should be called before the creation controller is activated on the map, subsequent
   * calls to this method will be ignored.
   * @param aMinimumPointCount The minimum number of points that should be created. Has to be positive.
   * @param aMaximumPointCount The maximum number of points that should be created. Set to -1 if not specified.
   */
  setPointCount(aMinimumPointCount: number, aMaximumPointCount: number): void;
  /**
   * Returns the settings configured on this CreateController.
   * These settings are passed to the {@link EditContext.settings}.
   *
   * @since 2022.1
   */
  getSettings(): EditSettings;
  onActivate(map: Map): void;
  onGestureEvent(aEvent: GestureEvent): HandleEventResult;
  /**
   * Finishes the creation process.
   *
   * This calls the {@link onObjectCreated} hook.
   * The creation controller stays active. To deactivate, call:
   *
   * ```javascript
   * map.controller = null.
   * ```
   *
   * @since 2024.0
   */
  finish(): void;
  /**
   * Restarts the creation process.
   *
   * The feature that is currently being created is _not_ added to the layer's model.
   *
   * @since 2024.0
   */
  restart(): void;
  onDeactivate(aMapView: Map): void | Promise<void>;
  onDraw(aGeoCanvas: GeoCanvas): void;
  onDrawLabel(aLabelCanvas: LabelCanvas): void;
  /**
   * This method is called when this controller needs to determine in which
   * layer an object should be created. This method can be overridden to choose
   * a specific layer. If this method returns <code>null</code> then the object creation will
   * not be started. This controller will remain the active controller though.
   * <p/>
   * The default implementation of this method iterates over the layers of the map view
   * from top to bottom and returns the first layer that is an instance of
   * {@link FeatureLayer FeatureLayer}
   * and that is editable and visible.
   * @param map the map
   * @return the layer to create objects for or <code>null</code>
   */
  onChooseLayer(map: Map): FeatureLayer | null;
  /**
   * Called when a new feature instance needs to be created.
      * @param map the map view
   * @param layer the layer
   *
   * @return a new feature
   */
  onCreateNewObject(map: Map, layer: FeatureLayer): Feature;
  /**
   * Called when a complete object has been created.
   * <p/>
   * The default implementation of this method adds the created object to the model
   * of the given layer. When the return is <code>true</code>, the controller will deactivate immediately.
   * When the return is a <code>Promise</code>, the controller will deactivate when the promise is resolved or when the promise is rejected.
   * <p/>
   * @param map the map view
   * @param layer   the layer
   * @param feature  the feature that was created
   * @return When a <code>Promise</code> is returned, the controller will deactivate when the promise is resolved or when the promise is rejected.
   *         When no <code>Promise</code> is returned, the controller will deactivate immediately.
   *
   */
  onObjectCreated(map: Map, layer: FeatureLayer, feature: Feature): void | Promise<void>;
  /**
   * An event that fires whenever {@link CreateController.restart} was called.
   *
   * @see {@link Controller.on}
   * @event Restarted
   * @since 2024.0
   */
  on(event: "Restarted", callback: () => void): Handle;
  /**
   * An event that fires whenever the user edited the shape.
   * @event EditShape
   * @since 2022.1
   */
  on(event: "EditShape", callback: (event: EditShapeEvent) => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event Invalidated
   */
  on(event: "Invalidated", callback: () => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event Activated
   */
  on(event: "Activated", callback: (map: Map) => void): Handle;
  /**
   * @see {@link Controller.on}
   * @event Deactivated
   */
  on(event: "Deactivated", callback: (map: Map) => void): Handle;
}