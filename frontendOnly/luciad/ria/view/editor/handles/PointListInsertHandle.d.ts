import { Geodesy } from "../../../geodesy/Geodesy.js";
import { Point } from "../../../shape/Point.js";
import { Polygon } from "../../../shape/Polygon.js";
import { Polyline } from "../../../shape/Polyline.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { IconStyle } from "../../style/IconStyle.js";
import { CompositeEditHandle } from "./CompositeEditHandle.js";
import { PointDragHandle } from "./PointDragHandle.js";
/**
 * NOTE on insta-moving of newly-created points:
 * - Last used point handle registers itself to composite in "activate"
 * - Last used point handle remains registered in composite until "deactivate"
 * - Composite bypasses events to the registered handle is one exists
 * This is necessary because the composite resets all its handles when updating
 */
/**
 * Handle to insert a point on a line segment of a point list ({@link Polygon}).
 *
 * This handle is intended to be used in the composite {@link PointListInsertHandle}.
 *
 * The default implementation draws an icon based on {@link EditHandleStyles.handleIconStyle}, but smaller.
 * The user can drag this handle to insert a new point on the segment.
 * The newly inserted point is immediately moved in the same drag gesture.
 *
 * @since 2022.1
 */
export declare class SinglePointInsertHandle extends PointDragHandle {
  /**
   * Creates a new {@link SinglePointInsertHandle}.
   *
   * @param index The index at which to insert the <code>pointToInsert</code>
   * @param pointToInsert The point to insert
   * @param parent The parent handle
   * @param handleIconStyle The icon style of the point handle
   */
  constructor(index: number, pointToInsert: Point, parent: PointListInsertHandle, handleIconStyle?: IconStyle | null);
  /**
   * Indicates whether this handle has already inserted the point in the point list.
   *
   * I.e. the user started dragging the handle.
   */
  get inserted(): boolean;
  /**
   * The point to insert in the point list.
   *
   * This is also where the handle draws an icon.
   */
  get pointToInsert(): Point;
  /**
   * The index where the point will be {@link Polyline.insertPoint inserted}.
   */
  get index(): number;
  /**
   * Returns the default handle icon style.
   *
   * This is the handle icon style that is used if no <code>handleIconStyle</code> was passed into the constructor.
   *
   * @param context The edit context
   * @return The context's {@link EditHandleStyles.handleIconStyle handle icon style}, {@link scaleIconStyle scaled}
   * with a factor of 0.6.
   */
  getDefaultHandleIconStyle(context: EditContext): IconStyle | null;
  /**
   * Activates this handle.
   *
   * The default implementation {@link PointListInsertHandle.pointList point list}.
   * This point is then translated in {@link drag}.
   */
  activate(_event: GestureEvent, context: EditContext): HandleEventResult;
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Called when the point is dragged.
   *
   * The default implementation {@link PointListInsertHandle.pointList point list}.
   * Inserting the point happens in {@link activate}.
   */
  drag(point: Point, event: GestureEvent, context: EditContext): void;
}
/**
 * A handle to insert points into a point list ({@link Polyline}).
 *
 * It composes a list of {@link SinglePointInsertHandle}.
 * By default, a {@link SinglePointInsertHandle} is placed at the center of every segment of the point list.
 *
 * @see {@link PointListEditor}
 * @since 2022.1
 */
export declare class PointListInsertHandle extends CompositeEditHandle {
  /**
   * Constructs a new PointListInsertHandle.
   */
  constructor(pointList: Polyline | Polygon, maximumPointCount: number, handleIconStyle?: IconStyle | null);
  get pointList(): Polygon | Polyline;
  get maximumPointCount(): number;
  get handleIconStyle(): IconStyle | null;
  /**
   * The geodesy instance associated with this handle.
   *
   * You can use this to {@link Geodesy.interpolate interpolate} line segments, to place {@link SinglePointInsertHandle insert handles}.
   */
  get geodesy(): Geodesy;
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Checks if the handles should be updated.
   *
   * By default, this always returns <code>true</code>, to ensure that {@link SinglePointInsertHandle.pointToInsert}
   * is always correct whenever the line segment moves.
   *
   * @see {@link PointListTranslateHandle.shouldUpdateHandles}
   */
  shouldUpdateHandles(): boolean;
  /**
   * Creates new {@link SinglePointInsertHandle insert handles}.
   *
   * The default implementation creates 1 insert handle on the halfway point between 2 points.
   * You can use {@link geodesy} to interpolate between points of the point list.
   */
  createInsertionHandles(): SinglePointInsertHandle[];
  /**
   * Called when this, or another, handle changes the feature or shape, as indicated by the {@link EditHandle.on "EditShape"} event.
   *
   * The default implementation does the following:
   * <ul>
   *  <li>
   *    It checks if the {@link Polyline.pointCount} is not less than the {@link maximumPointCount maximum point count}.
   *    If not, it clears the {@link handles} and {@link activeHandleIndex}.
   *  </li>
   *  <li>
   *    If the {@link maximumPointCount} check passes and {@link shouldUpdateHandles} returns <code>true</code>, it calls {@link createInsertionHandles}.
   *  </li>
   * </ul>
   */
  update(): void;
}