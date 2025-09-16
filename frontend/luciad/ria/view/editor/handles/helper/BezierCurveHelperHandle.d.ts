import { EditContext } from "../../../controller/EditContext.js";
import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
import { BezierCurve } from "../../../../shape/BezierCurve.js";
/**
 * A {@link BezierCurveHelperHandle} handle that draws helper lines for a Bézier curve.
 *
 * It draws helper lines between control points of the edited Bézier curve.
 * The helper line is a projection of the 3D polyline onto terrain.
 * @since 2024.1
 */
export declare class BezierCurveHelperHandle extends HelperHandle {
  /**
   * Constructs a new BezierCurveHelperHandle
   */
  constructor(bezierCurve: BezierCurve, helperStyle?: ShapeStyle | null);
  get bezierCurve(): BezierCurve;
  /**
   * On 3D maps, this draws a {@link EditHandleStyles.helperStyle helper line} for a Bézier curve.
   * The helper line is a projection of the 3D polyline onto terrain.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}