import { Shape } from "../../shape/Shape.js";
import { Handle } from "../../util/Evented.js";
import { EventedSupport } from "../../util/EventedSupport.js";
import { ContextMenu } from "../ContextMenu.js";
import { HandleEventResult } from "../controller/HandleEventResult.js";
import { EditContext } from "../controller/EditContext.js";
import { EditShapeEvent, EditShapeStatus } from "../controller/EditShapeEvent.js";
import { GestureEvent } from "../input/GestureEvent.js";
import { GeoCanvas } from "../style/GeoCanvas.js";
import { LabelCanvas } from "../style/LabelCanvas.js";
import { Map } from "../Map.js";
/**
 * An edit handle manipulates a {@link Feature feature} or some part of that feature,
 * usually its {@link Feature.shape shape}, based on input from the user.
 *
 * Edit handles are created by an {@link CreateController}
 * becomes active on the map.
 *
 * Edit handles generally correspond to the shape of the feature being edited.
 * For example, to edit a four-sided polygon, an {@link Editor} creates five
 * handles: four to move each of the individual vertices of the polygon, and a fifth one to move
 * the polygon as a whole.
 *
 * For more information, check out the
 * <a href="articles://tutorial/view/controllers/custom_editing.html">Customizing creation and editing</a> guide.
 *
 *  @since 2022.1
 */
export declare class EditHandle {
  /**
   * Creates a new edit handle.
   */
  constructor();
  /**
   * The {@link EventedSupport} used to emit events.
   *
   * Typically, handles use {@link emitEditShapeEvent} to emit "EditShape" events.
   * This is only used in advanced cases, for example when {@link CompositeEditHandle compositing multiple handles}.
   */
  protected get eventedSupport(): EventedSupport;
  /**
   * Handles the given {@link EditContext context}.
   *
   * The editing handle can modify the feature (or its shape) based on the type and state
   * of the input event. For example, a drag event that {@link CircleByCenterPoint.move2DToPoint moves a circle}.
   *
   * The default implementation {@link HandleEventResult.EVENT_IGNORED ignores} the event.
   *
   * @param event the gesture event.
   * @param context the edit context.
   **/
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Returns the mouse <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/cursor">cursor</a> to show.
   *
   * {@link CreateController} will check the active handle's cursor on every
   * {@link Map.cursorManager map's cursor} when the returned cursor string changes.
   *
   * The default implementation always returns <code>null</code>.
   *
   * @param event the gesture event to determine a cursor for.
   * @param context the edit context.
   *
   * @return a cursor, or <code>null</code> if no mouse cursor should be shown for this handle.
   */
  getCursor(event: GestureEvent, context: EditContext): string | null;
  /**
   * Indicates whether the feature being created or edited, should be painted by the controller.
   * The feature is painted using the layer's {@link FeaturePainter painter}.
   *
   * For handles used in editing, this is typically always <code>true</code>.
   * For handles used in creation, this typically returns <code>false</code> in the early steps of the creation process.
   * For example, when the user is still choosing a location for a point (before the first click).
   *
   * @param context The editing context.
   *
   * @since 2024.0
   */
  shouldPaintFeature(context: EditContext): boolean;
  /**
   * This method allows the handle to draw shapes on the map.
   *
   * For example, a point handle draws an icon at its point using {@link EditHandleStyles.handleIconStyle}.
   *
   * A handle can also draw {@link EditHandleStyles.helperStyle "helper"} shapes.
   * These are shapes that are not interactive, but help
   * the user while editing. For example, the base shape of an extruded shape, draped over terrain.
   * Or lines showing how a point can move.
   *
   * For consistency with built-in handles, it's recommended to draw helper shapes using
   * {@link EditHandleStyles.handleIconStyle}.
   *
   * The default implementation draws nothing.
   *
   * @param geoCanvas The GeoCanvas to draw on.
   * @param context The editing context.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
  /**
   * This method allows the handle to draw labels on the map.
   *
   * For example, you can use this to show coordinates of points, or the current radius of a circle
   * on top of an edit handle.
   *
   * The default implementation draws nothing.
   *
   * @param labelCanvas The {@link LabelCanvas label canvas} to draw labels on
   * @param context The editing context.
   */
  onDrawLabel(labelCanvas: LabelCanvas, context: EditContext): void;
  /**
   * Called when (another) handle changes the feature or shape, as indicated by the {@link EditHandle.on "EditShape"} event.
   *
   * This handle can update its own state, based on the changed shape.
   *
   * For example, a {@link PointListInsertHandle} just inserted a point in a polyline.
   * The {@link PointListTranslateHandle} uses the update to recalculate new sub-handles, based on the new polyline (with the extra point).
   *
   * The default implementation does nothing.
   *
   * @see {@link EditHandle.on}
   */
  update(): void;
  /**
   * Invalidates this edit handle.
   *
   * This will cause {@link onDraw} and {@link onDrawLabel} to be called again.
   *
   * Use this if you need to update the visualization of the handle.
   * For example, the handle has changed style and {@link onDraw} needs to be re-evaluated.
   *
   * @since 2024.0.02
   */
  invalidate(): void;
  /**
   * Populates a context menu with entries.
   *
   * For example, a handle for a point in a polyline might add a "Delete point" context menu entry.
   *
   * @param event the input event that triggered opening the context menu.
   * @param context the edit context
   * @param contextMenu the context menu to add entries to.
   * @param onDone a callback that needs to be called when a menu action is performed. Call this at the end of
   *               the {@link ContextMenuItem.action} implementation.
   */
  onCreateContextMenu(event: GestureEvent, context: EditContext, contextMenu: ContextMenu, onDone: () => void): void;
  /**
   * Emits an <code>"EditShape"</code> event.
   *
   * Typically, a handle emits this right after changing the shape.
   *
   * @param shape The shape to emit an edit event for
   * @param status The status of the edit. Typically, this is {@link EditShapeStatus.IN_PROGRESS IN_PROGRESS} while
   *               the handle is being dragged / changed, and {@link EditShapeStatus.FINISHED} when the drag ends.
   */
  protected emitEditShapeEvent(shape: Shape, status: EditShapeStatus): void;
  /**
   * An event that is emitted whenever this handle changes the shape of a feature.
   *
   * @event EditShape
   */
  on(event: "EditShape", callback: (event: EditShapeEvent) => void): Handle;
  /**
   * An event that is emitted whenever this handle is {@link invalidate invalidated}.
   *
   * @event Invalidated
   */
  on(event: "Invalidated", callback: () => void): Handle;
}
/**
 * Checks if there is interaction with a shape drawn by the active controller, at a given pixel location.
 *
 * Typically, this is used in handle interaction checks, like {@link ShapeTouchHandle.interacts}.
 * For example, an extruded shape being edited in 3D can only be moved by dragging its (projected) base shape.
 *
 * Only shapes that are drawn by {@link EditHandle.onDraw}) are checked for interaction.
 * If you want to check interaction with shapes on the map (outside of a Controller), use {@link Map.pickAt}.
 *
 * @param map The map to query
 * @param x The x coordinate of the pixel to query. Typically this comes from {@link GestureEvent.viewPoint}.
 * @param y The y coordinate of the pixel to query. Typically this comes from {@link GestureEvent.viewPoint}.
 * @param radius A distance, in pixels, around (x,y) to do the query with.
 *               See {@link EditSettings.touchInteractionRadius}.
 * @param shape the shape to check for interaction. For example, a subshape of the shape being edited.
 *              Only shapes that are drawn by {@link EditHandle.onDraw}) are checked for interaction.
 *              If no shape is specified, any shape drawn by the controller is an interaction candidate.
 *              If shape is defined, it has to be {@link Shape.equals equal} to a shape that was drawn (or if it is a shape list, one of the
 *              shapes in the shape list has to be {@link Shape.equals equal} to a shape that was drawn).
 * @param strokeOnly A boolean that indicates that only the stroke of shapes should be checked for interaction.
 *                   Defaults to <code>false</code>
 *
 * @see {@link queryControllerDrawings}
 * @since 2022.1
 */
export declare function interactsWithControllerShape(map: Map, x: number, y: number, radius: number, shape?: Shape, strokeOnly?: boolean): boolean;
/**
 * Queries the shapes drawn by the active controller, at a given pixel location
 *
 * Only shapes that are drawn by {@link EditHandle.onDraw}) are checked for interaction.
 * If you want to check interaction with shapes on the map (outside of a Controller), use {@link Map.pickAt}.
 *
 * If no controller is active, an empty list of shapes is returned.
 *
 * @param map The map to query
 * @param x The x coordinate of the pixel to query. Typically this comes from {@link GestureEvent.viewPoint}.
 * @param y The y coordinate of the pixel to query. Typically this comes from {@link GestureEvent.viewPoint}.
 * @param radius A distance, in pixels, around (x,y) to do the query with.
 *               See {@link EditSettings.touchInteractionRadius}.
 * @param strokeOnly A boolean that indicates that only the stroke of shapes should be checked for interaction.
 *                   Defaults to <code>false</code>
 * @since 2022.1
 */
export declare function queryControllerDrawings(map: Map, x: number, y: number, radius: number, strokeOnly?: boolean): Shape[];