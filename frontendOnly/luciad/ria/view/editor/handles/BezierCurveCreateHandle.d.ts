import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { EditHandle } from "../EditHandle.js";
import { BezierCurve } from "../../../shape/BezierCurve.js";
/**
 * A handle to create a Bézier curve ({@link BezierCurve}).
 * The user can click (or tap) on the map to create control points of the Bézier curve.
 *
 * @see {@link BezierCurveEditor}
 * @since 2024.1
 */
export declare class BezierCurveCreateHandle extends EditHandle {
  /**
   * Creates a new {@link BezierCurveCreateHandle}.
   */
  constructor(bezierCurve: BezierCurve);
  /**
   * The Bézier curve being created.
   */
  get bezierCurve(): BezierCurve;
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