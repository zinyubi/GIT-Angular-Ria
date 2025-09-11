import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { EditContext } from "../../../controller/EditContext.js";
import { GeoBuffer } from "../../../../shape/GeoBuffer.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
/**
 * An {@link GeoBuffer}.
 *
 * It draws {@link GeoBuffer.baseShape base shape}
 * of the {@link GeoBuffer}.
 *
 * @see {@link GeoBufferEditor}
 *
 * @since 2022.1
 */
export declare class GeoBufferHelperHandle extends HelperHandle {
  /**
   * Constructs a new {@link GeoBufferHelperHandle}.
   */
  constructor(geoBuffer: GeoBuffer, helperStyle?: ShapeStyle | null);
  get geoBuffer(): GeoBuffer;
  /**
   * Draws the outline of the geobuffer and its {@link GeoBuffer.baseShape base shape} with
   * the {@link EditHandleStyles.helperStyle helper style}'s stroke.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}