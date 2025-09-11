import { CompositeEditHandle } from "./CompositeEditHandle.js";
import { PointDragHandle } from "./PointDragHandle.js";
import { IconStyle } from "../../style/IconStyle.js";
import { BezierCurve } from "../../../shape/BezierCurve.js";
/**
 * A handle to translate points in a Bézier curve ({@link BezierCurve}).
 *
 * It composes a list of {@link PointDragHandle} placed at every point of the curve.
 *
 * @see {@link BezierCurveEditor}
 * @since 2024.1
 */
export declare class BezierCurveEditHandle extends CompositeEditHandle {
  /**
   * Creates a new {@link BezierCurveEditHandle}.
   */
  constructor(bezierCurve: BezierCurve, handleIconStyle?: IconStyle | null);
  /**
   * The Bézier curve being edited.
   */
  get bezierCurve(): BezierCurve;
  /**
   * The handle's icon style, as defined at constructor.
   */
  get handleIconStyle(): IconStyle | null | undefined;
  /**
   * Checks if the handles should be updated.
   * By default, this returns <code>true</code>.
   */
  shouldUpdateHandles(): boolean;
  /**
   * Creates translate handles.
   * The default implementation creates a {@link PointDragHandle} for every control point in {@link BezierCurve}.
   */
  createTranslateHandles(): PointDragHandle[];
  /**
   * Called when (another) handle changes the feature or shape, as indicated by the {@link EditHandle.on "EditShape"} event.
   *
   * The default implementation calls {@link createTranslateHandles}, if {@link shouldUpdateHandles} returns <code>true</code>.
   */
  update(): void;
}