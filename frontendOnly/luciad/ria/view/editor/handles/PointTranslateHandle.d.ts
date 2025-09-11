import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { ShapeTranslateHandle } from "./ShapeTranslateHandle.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { EditContext } from "../../controller/EditContext.js";
import { Point } from "../../../shape/Point.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
/**
 * A handle to translate {@link Point} shapes.
 *
 * This handle extends {@link ShapeTranslateHandle} and adds snapping capabilities.
 *
 * This is to be used with individual {@link Point} shapes only.
 * To translate the points in a polyline or polygon, see {@link PointListTranslateHandle} and {@link SinglePointTranslateHandle}.
 *
 * @see {@link PointEditor}
 * @since 2022.1
 */
export declare class PointTranslateHandle extends ShapeTranslateHandle {
  /**
   * Creates a new {@link PointTranslateHandle}.
   */
  constructor(point: Point);
  get point(): Point;
  process(event: GestureEvent, context: EditContext): HandleEventResult;
  onDraw(geoCanvas: GeoCanvas, _context: EditContext): void;
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
}