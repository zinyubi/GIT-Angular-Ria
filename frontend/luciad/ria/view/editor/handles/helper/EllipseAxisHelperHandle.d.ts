import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { Ellipse } from "../../../../shape/Ellipse.js";
import { Arc } from "../../../../shape/Arc.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
import { EditContext } from "../../../controller/EditContext.js";
/**
 * An {@link Arc}.
 *
 * It draws {@link getHelperStyle helper lines} for the major and minor axis of the ellipse.
 * This is used by {@link ArcEditor.createHelperHandle}.
 *
 * @see {@link EllipseEditor}
 * @see {@link ArcEditor}
 *
 * @since 2022.1
 */
export declare class EllipseAxisHelperHandle extends HelperHandle {
  /**
   * Constructs a new {@link EllipseAxisHelperHandle}.
   */
  constructor(ellipse: Ellipse | Arc, helperStyle?: ShapeStyle | null);
  get ellipse(): Ellipse | Arc;
  /**
   * Draws {@link getHelperStyle helper lines} for the major and minor axis of the ellipse or arc.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}