import { CompositeEditHandle } from "./CompositeEditHandle.js";
import { PointDragHandle, PointDragHandleConstructorOptions } from "./PointDragHandle.js";
import { Polyline } from "../../../shape/Polyline.js";
import { Polygon } from "../../../shape/Polygon.js";
import { IconStyle } from "../../style/IconStyle.js";
/**
 * Handle to translate a single point in a point list.
 *
 * This handle is intended to be used in the composite {@link PointListTranslateHandle}.
 *
 * See {@link PointHandle} for details on this handle's drawings and behavior.
 *
 * @since 2022.1
 */
export declare class SinglePointTranslateHandle extends PointDragHandle {
  /**
   * Creates a new {@link SinglePointTranslateHandle}.
   * @param pointList The point list in which to translate a point
   * @param index The index of the point in the point list
   * @param options Options for {@link PointDragHandle}'s constructor
   */
  constructor(pointList: Polyline | Polygon, index: number, options?: PointDragHandleConstructorOptions);
  get pointList(): Polyline | Polygon;
  /**
   * The index of the point in the point list, for this handle.
   */
  get index(): number;
}
/**
 * A handle to translate points in a point list ({@link Polyline}).
 *
 * It composes a list of {@link SinglePointTranslateHandle}.
 * By default, a {@link SinglePointTranslateHandle} is placed at every point of the point list.
 *
 * @see {@link PointListEditor}
 * @since 2022.1
 */
export declare class PointListTranslateHandle extends CompositeEditHandle {
  /**
   * Creates a new {@link PointListTranslateHandle}.
   */
  constructor(pointList: Polyline | Polygon, handleIconStyle?: IconStyle | null);
  /**
   * The point list being edited
   */
  get pointList(): Polyline | Polygon;
  /**
   * The handle's icon style, as defined at construction time.
   */
  get handleIconStyle(): IconStyle | null | undefined;
  /**
   * Checks if the handles should be updated.
   *
   * By default, this returns <code>true</code> if the {@link Polyline.pointCount shape's point count} is different
   * from the current amount of {@link handles}. Ie. only when the size of the point list changes, new
   * {@link SinglePointTranslateHandle} need to be created.
   *
   * If you create a different number of {@link createTranslateHandles translate handles}, then this check should reflect that.
   *
   * For example, if you disallow deletion of the first and last point, this method should check if the number of {@link handles}
   * is different from <code>{@link Polyline.pointCount shape.pointCount} - 2</code>
   */
  shouldUpdateHandles(): boolean;
  /**
   * Creates translate handles for the handle's {@link pointList}.
   *
   * The default implementation creates a {@link SinglePointTranslateHandle} for every point in the point list.
   */
  createTranslateHandles(): SinglePointTranslateHandle[];
  /**
   * Called when (another) handle changes the feature or shape, as indicated by the {@link EditHandle.on "EditShape"} event.
   *
   * The default implementation calls {@link createTranslateHandles}, if {@link shouldUpdateHandles} returns <code>true</code>.
   */
  update(): void;
}