import { GeoBuffer } from "../../../shape/GeoBuffer.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { GeoCanvas } from "../../style/GeoCanvas.js";
import { ShapeTouchHandle } from "./ShapeTouchHandle.js";
import { ShapeStyle } from "../../style/ShapeStyle.js";
import { DrapeTarget } from "../../style/DrapeTarget.js";
import { Shape } from "../../../shape/Shape.js";
/**
 * A handle to change the {@link GeoBuffer}.
 *
 * The user can change the width of by dragging the stroke of the geobuffer.
 * While the user is dragging, a preview of the new width is drawn.
 *
 * @see {@link GeoBufferEditor}
 *
 * @since 2022.1
 */
export declare class GeoBufferWidthHandle extends ShapeTouchHandle {
  /**
   * Constructs a new {@link GeoBufferWidthHandle}.
   */
  constructor(geoBuffer: GeoBuffer, helperStyle?: ShapeStyle | null);
  get geoBuffer(): GeoBuffer;
  /**
   * Returns the helper style, to be used for visualizing helper shapes in {@link onDraw}.
   *
   * This returns the helper style that was passed into the constructor.
   * If no helper style was passed into the constructor, this returns the {@link EditHandleStyles.helperStyle context's helper style}.
   *
   * @param context The edit context
   * @see {@link HelperHandle.getHelperStyle}
   */
  getHelperStyle(context: EditContext): ShapeStyle | null;
  /**
   * Returns the drape target for this handle.
   *
   * @see {@link HelperHandle.getDrapeTarget}
   */
  getDrapeTarget(context: EditContext, shape: Shape): DrapeTarget;
  /**
   * Checks if the handle interacts with the given gesture event.
   *
   * @return <code>true</code> if the event {@link interactsWithControllerShape interacts} with the {@link geoBuffer}'s
   * stroke, but not with the {@link GeoBufferEditor.createHelperHandle}).
   */
  interacts(event: GestureEvent, context: EditContext): boolean;
  /**
   * Returns the current cursor for this handle.
   *
   * @return <code>"ns-resize"</code> if the mouse {@link interacts} with this handle,
   * or the handle is {@link active}.
   */
  getCursor(event: GestureEvent, context: EditContext): string | null;
  deactivate(event: GestureEvent, context: EditContext): HandleEventResult;
  onDraw(geoCanvas: GeoCanvas, context: EditContext): void;
  process(event: GestureEvent, context: EditContext): HandleEventResult;
}