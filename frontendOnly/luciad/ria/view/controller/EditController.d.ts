import { Feature } from "../../model/feature/Feature.js";
import { Handle } from "../../util/Evented.js";
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
import { EditShapeEvent } from "./EditShapeEvent.js";
import { EditSettings } from "./EditSettings.js";
/**
 * Constructor options for {@link EditController}.
 */
export interface EditControllerConstructorOptions {
  /**
   * The style used for drawing helper shapes.
   *
   * @see {@link EditHandleStyles.helperStyle}
   */
  helperStyle?: ShapeStyle;
  /**
   * The style used to draw point handles.
   *
   * @see {@link EditHandleStyles.handleIconStyle}
   */
  handleIconStyle?: IconStyle;
  /**
   * Indicates whether to finish editing on a single-click event, or a double click event (the default)
   * @default false
   */
  finishOnSingleClick?: boolean;
  /**
   * The {@link Editor} determines how editing behaves.
   *
   * The {@link Editor.getEditHandles} to create handles for editing.
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
 * Controller used to graphically edit existing objects in a layer on the view.
 * <p>
 * Editing is supported for all shapes available in {@link ShapeFactory}.
 * Supported editing operations include moving the entire shape,
 * moving individual vertices or control points, adding vertices, and deleting vertices.
 * <p>
 * Editing is supported on regular 2D maps as well as WebGL 2D or 3D maps.
 * <p>
 * However, only 2D shapes or 2D aspects of 3D shapes are editable.  For example, you can edit the base shape of an extruded shape.
 * <p>
 * If you want to add undo/redo support to the EditController, check out the
 * <a href="articles://guide/view/controllers/undoredo.html">Adding undo/redo support to your application</a> guide.
 * <p>
 * If you want to change the way editing behaves, check out the
 * <a href="articles://tutorial/view/controllers/custom_editing.html">Customizing creation and editing</a> guide.
 */
export declare class EditController extends Controller {
  /**
   * Creates a new edit controller
   *
   * @param layer the layer in which to edit an object
   * @param feature the feature to edit
   * @param options An options object hash containing <code>EditController</code> options.
   */
  constructor(layer: FeatureLayer, feature: Feature, options?: EditControllerConstructorOptions);
  /**
   * Return the minimum number of points that should be allowed during editing.
   * @see {@link setPointCount}
   */
  getMinimumPointCount(): number;
  /**
   * Return the maximum number of points that should be allowed during editing.
   * @see {@link setPointCount}
   */
  getMaximumPointCount(): number;
  /**
   * Set the minimum and maximum number of points that should be allowed during editing using this controller.
   * Once the maximum number of points is reached, the controller will not allow insertion of new points.
   * Once the minimum number of points is reached, the controller will not allow deletion of new points.
   * Note that this method should be called before the edit controller is activated on the map, subsequent
   * calls to this method will be ignored.
   * @param aMinimumPointCount The minimum number of points that should be allowed during editing.
   * @param aMaximumPointCount The maximum number of points that should be allowed during editing. Set to -1 if not specified.
   */
  setPointCount(aMinimumPointCount: number, aMaximumPointCount: number): void;
  /**
   * Returns the settings configured on this EditController.
   * These settings are passed to the {@link EditContext.settings}.
   *
   * You can override this to add additional settings. For example, a custom constraint like a minimum and maximum
   * radius of a circle. LuciadRIA will add these additional settings to {@link EditContext.settings},
   * which is passed to the {@link EditHandle}s.
   *
   * ```javascript
   * [[include:view/editor/EditorSnippets.ts_EXTRA_SETTINGS]]
   * ```
   *
   * @since 2022.1
   */
  getSettings(): EditSettings;
  /**
   * The feature being edited by this controller.
   * @since 2022.1
   */
  get feature(): Feature;
  /**
   * The layer being edited by this controller.
   * @since 2022.1
   */
  get layer(): FeatureLayer;
  onActivate(map: Map): void;
  /**
   * Finishes the editing process.
   *
   * This calls the {@link onFinish} hook and handles its result.
   * The edit controller stays active. To deactivate, call:
   *
   * ```javascript
   * map.controller = null.
   * ```
   *
   * @since 2024.0
   */
  finish(): void;
  /**
   * Immediately restarts editing for the given feature and layer.
   * This can be used to force editing to a specific shape.
   * For example, to apply an undo step or to synchronize the edited shape with coordinates from a form.
   *
   * The feature that was currently being edited will not be updated in the model.
   *
   * ```javascript
   * function synchronizeEditControllerWithForm() {
   *   const newShape = createShapeFromFormValues(); // implemented in your code
   *   feature.shape = newShape;
   *   editController.restart(feature, layer);
   * }
   * ```
   *
   * @param feature The feature to restart editing for. If not specified, it uses the current {@link feature} and {@link Editor.restoreState}.
   * @param layer The layer to restart editing for. Must be editable. If not specified, it defaults to {@link layer}.
   *
   * @since 2022.1
   */
  restart(feature?: Feature, layer?: FeatureLayer): void;
  /**
   * Called when the EditController deactivates.
   *
   * This will return a Promise if there is an asynchronous {@link WorkingSet.put} operation on-going from {@link onFinish}.
   * Otherwise, it will de-activate synchronously.
   */
  onDeactivate(aMapView: Map): Promise<void> | void;
  onDraw(aGeoCanvas: GeoCanvas): void;
  onDrawLabel(labelCanvas: LabelCanvas): void;
  onGestureEvent(aEvent: GestureEvent): HandleEventResult;
  /**
   * Called whenever an edit operation finishes.
   *
   * By default, this calls {@link WorkingSet.put} on the layer's {@link FeatureLayer.workingSet workingSet}
   * to update the feature in the layer/model.
   * This will return a Promise if there is an asynchronous {@link WorkingSet.put} operation on-going.
   *
   * @since 2024.0
   */
  onFinish(): Promise<void> | void;
  /**
   * An event that fires whenever {@link EditController.restart} was called.
   *
   * Use this event to get notified whenever something external (like an undoable) restarts this EditController
   * (ie. changes its shape / feature).
   *
   * @see {@link Controller.on}
   * @event Restarted
   * @since 2022.1
   */
  on(event: "Restarted", callback: () => void): Handle;
  /**
   * An event that fires whenever the user edited the shape.
   *
   * You can use this event to create "edit shape" undoables.
   * See the <a href="articles://guide/view/controllers/undoredo.html">Adding undo/redo support to your application</a> guide
   * for more information on how to work with undo/redo in LuciadRIA.
   *
   * @see {@link Controller.on}
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