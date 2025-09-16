import { Polygon } from "../../../shape/Polygon.js";
import { Polyline } from "../../../shape/Polyline.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { EditHandle } from "../EditHandle.js";
/**
 * Constructor options for a {@link PointListCreateHandle}
 *
 * @since 2022.1
 */
export interface PointListCreateHandleConstructorOptions {
  /**
   * The minimum number of points that should be allowed during editing.
   * If no minimum is defined, this defaults to 0.
   *
   * @default 0
   * @see {@link EditSettings.minimumPointCount}
   */
  minimumPointCount?: number;
  /**
   * The maximum number of points that should be allowed during editing.
   * If no maximum is defined, this is -1.
   *
   * @default -1
   * @see {@link EditSettings.minimumPointCount}
   */
  maximumPointCount?: number;
  /**
   * Indicates whether to allow drawing shapes in "freehand" mode. When this is enabled,
   * the user can click / tap near the last created point and drag to draw a shape.
   * Multiple points will be inserted while the mouse is being dragged.
   *
   * When this is disabled, the user can only create (single) points by clicking / tapping the map.
   *
   * @default true
   * @see {@link EditSettings.freehand}
   */
  freehand?: boolean;
}
/**
 * A handle to create point list shapes, ie. polygons and polylines.
 *
 * It supports creation of point lists for both mouse and touch input.
 * The user can click (or tap) on the map to add points to the pointlist.
 * Once placed, the points cannot be moved or removed by this handle.
 *
 * If <code>freehand</code> is <code>true</code>, the user can start dragging the mouse near the last
 * created point to start "freehand" drawing. While "freehand" drawing is active, points are inserted automatically
 * under the mouse / finger.
 *
 * @see {@link PointListEditor}
 *
 * @since 2022.1
 */
export declare class PointListCreateHandle extends EditHandle {
  /**
   * Creates a new {@link PointListCreateHandle}.
   */
  constructor(pointList: Polyline | Polygon, options?: PointListCreateHandleConstructorOptions);
  /**
   * The point list (polyline or polygon) being created.
   */
  get pointList(): Polyline | Polygon;
  /**
   * The minimum point count to create a point list with.
   * @see {@link EditSettings.minimumPointCount}
   */
  get minimumPointCount(): number;
  /**
   * The maximum point count to create a point list with.
   * @see {@link EditSettings.maximumPointCount}
   */
  get maximumPointCount(): number;
  /**
   * Whether "freehand" drawing is allowed.
   * @see {@link EditSettings.freehand}
   */
  get freehand(): boolean;
  /**
   * Returns the current cursor for this handle.
   *
   * The default implementation always returns <code>"crosshair"</code>.
   */
  getCursor(_event: GestureEvent, _context: EditContext): string;
  /**
   * Paints a snap icon, if there's a point to snap to.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
  onGestureEvent(event: GestureEvent, context: EditContext): HandleEventResult;
}