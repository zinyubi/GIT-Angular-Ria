import { ExtrudedShape } from "../../../../shape/ExtrudedShape.js";
import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { EditContext } from "../../../controller/EditContext.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
/**
 * A helper handle for extruded shapes.
 *
 * It draws {@link ExtrudedShape.baseShape} as a helper shape, as well as a helper line for the height
 * axis. This helper line goes through the {@link Shape.focusPoint focus point} of the
 * {@link ExtrudedShape.baseShape base shape}.
 *
 * @see {@link ExtrudedShapeEditor}
 *
 * @since 2022.1
 */
export declare class ExtrudedShapeHelperHandle extends HelperHandle {
  /**
   * Constructs a new ExtrudedShapeHelperHandle.
   */
  constructor(extrudedShape: ExtrudedShape, helperStyle?: ShapeStyle | null);
  get extrudedShape(): ExtrudedShape;
  /**
   * This method draws shapes on the map for the handle.
   *
   * The default implementation draws {@link ExtrudedShape.baseShape} as a helper shape,
   * as well as a helper line for the height axis.
   * This helper line goes through the {@link ExtrudedShape.baseShape base shape}.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}