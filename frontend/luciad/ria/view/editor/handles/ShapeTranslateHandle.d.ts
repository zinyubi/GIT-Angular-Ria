import { Point } from "../../../shape/Point.js";
import { Shape } from "../../../shape/Shape.js";
import { HandleEventResult } from "../../controller/HandleEventResult.js";
import { EditContext } from "../../controller/EditContext.js";
import { GestureEvent } from "../../input/GestureEvent.js";
import { ShapeTouchHandle } from "./ShapeTouchHandle.js";
/**
 * A handle used to translate (move) a {@link Shape}.
 *
 * The user can move the shape by dragging its fill or stroke.
 * This works for both mouse and touch events.
 *
 * Typically, this is the type of handle that {@link Editor.createTranslateHandle} returns.
 *
 * For {@link PointTranslateHandle} instead.
 * {@link PointTranslateHandle} adds point snapping capabilities.
 *
 * @since 2022.1
 */
export declare class ShapeTranslateHandle extends ShapeTouchHandle {
  /**
   * Constructs a new {@link ShapeTranslateHandle}.
   */
  constructor(shape: Shape);
  /**
   * The shape that's translated by this handle
   */
  get shape(): Shape;
  /**
   * The start point of the translation, or <code>null</code> if the handle is not {@link active}.
   */
  protected get startPoint(): Point | null;
  protected set startPoint(p: Point | null);
  /**
   * The (current) end point of the translation, or <code>null</code> if the handle is not {@link active}.
   */
  protected get endPoint(): Point | null;
  protected set endPoint(p: Point | null);
  activate(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Returns the cursor for this handle.
   *
   * @return the <code>"move"</code> cursor while the mouse {@link interacts} with the shape,
   * or the handle is {@link active}.
   */
  getCursor(event: GestureEvent, context: EditContext): string | null;
  interacts(event: GestureEvent, context: EditContext): boolean;
  process(event: GestureEvent, context: EditContext): HandleEventResult;
  /**
   * Called when the shape should be translated (moved).
   *
   * The default implementation calls {@link Shape.translate2D}.
   *
   * @param gestureEvent The gesture event that triggered the translation
   * @param context The edit context
   * @param dx The X offset to apply (in the {@link Shape.reference shape's reference})
   * @param dy The Y offset to apply (in the {@link Shape.reference shape's reference})
   */
  translate(gestureEvent: GestureEvent, context: EditContext, dx: number, dy: number): void;
}