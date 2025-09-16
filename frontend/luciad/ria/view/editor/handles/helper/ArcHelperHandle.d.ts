import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { EditContext } from "../../../controller/EditContext.js";
import { Arc } from "../../../../shape/Arc.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
/**
 * A {@link Arc}.
 *
 * It draws {@link getHelperStyle helper lines} for the "inverse" sweep angle of the arc.
 * This is the part of the ellipse that is not covered by the arc's sweep angle.
 *
 * @see {@link ArcEditor}
 * @since 2022.1
 */
export declare class ArcHelperHandle extends HelperHandle {
  /**
   * Constructs a new {@link ArcHelperHandle}.
   */
  constructor(arc: Arc, helperStyle?: ShapeStyle | null);
  get arc(): Arc;
  /**
   * Draws {@link getHelperStyle helper lines} for the "inverse" sweep angle of the arc.
   * This is the part of the ellipse that is not covered by the arc's sweep angle.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}