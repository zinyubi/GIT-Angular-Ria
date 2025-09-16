import { EditContext } from "../../../controller/EditContext.js";
import { GeoCanvas } from "../../../style/GeoCanvas.js";
import { Polyline } from "../../../../shape/Polyline.js";
import { Polygon } from "../../../../shape/Polygon.js";
import { HelperHandle } from "./HelperHandle.js";
import { ShapeStyle } from "../../../style/ShapeStyle.js";
/**
 * An {@link EditHandle} that draws helper lines for a point list.
 *
 * On 3D maps, it draws a helper line for 3D polylines.
 * The helper line is a projection of the 3D polyline onto terrain.
 *
 * @since 2022.1
 */
export declare class PointListHelperHandle extends HelperHandle {
  /**
   * Constructs a new PointListHelperHandle
   */
  constructor(pointList: Polyline | Polygon, helperStyle?: ShapeStyle | null);
  get pointList(): Polyline | Polygon;
  /**
   * On 3D maps, this draws a {@link EditHandleStyles.helperStyle helper line} for 3D polylines.
   * The helper line is a projection of the 3D polyline onto terrain.
   */
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
}