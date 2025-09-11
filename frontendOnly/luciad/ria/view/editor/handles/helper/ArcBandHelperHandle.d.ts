import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { ArcBand } from "../../../../shape/ArcBand.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
import { EditContext } from "../../../controller/EditContext.js";
/**
 * An {@link EditHandle} that draws helper lines for an {@link ArcBand}
 *
 * It draws {@link getHelperStyle helper lines} from the {@link ArcBand.center center} of the arcband
 * to the {@link ArcBand.sweepAngle end} corners of the
 * {@link ArcBand.minRadius minimum radius} arc.
 *
 * @see {@link ArcBandEditor}
 * @since 2022.1
 */
export declare class ArcBandHelperHandle extends HelperHandle {
  /**
   * Constructs a new {@link ArcBandHelperHandle}.
   */
  constructor(arcBand: ArcBand, helperStyle?: ShapeStyle | null);
  get arcBand(): ArcBand;
  /**
   * Draws {@link ArcBand.center center} of the arcband
   * to the {@link ArcBand.sweepAngle end} corners of the
   * {@link ArcBand.minRadius minimum radius} arc.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}